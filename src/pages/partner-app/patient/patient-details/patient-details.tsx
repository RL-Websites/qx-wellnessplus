import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IPartnerOnlyPatientInviteDTO } from "@/common/api/models/interfaces/PartnerPatient.model";
import { IRequestRefillDTO, patientRequestList } from "@/common/api/models/interfaces/Prescription.model";
import partnerPatientRepository from "@/common/api/repositories/partnerPatientRepository";
import patientApiRepository from "@/common/api/repositories/patientRepository";
import DynamicBreadcrumbs from "@/common/components/Breadcrumbs";
import { IShowing } from "@/common/components/CustomFilter";
import NoTableData from "@/common/components/NoTableData";
import { PaginationFilter } from "@/common/components/PaginationFilter";
import dmlToast from "@/common/configs/toaster.config";
import { formatDate } from "@/utils/date.utils";
import { formatPhoneNumber } from "@/utils/helper.utils";
import { Button, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useHref, useNavigate, useParams } from "react-router-dom";
import ConfirmProductOrderModal from "../products/ConfirmProductOrderModal";

function PatientDetailsPage() {
  const [patients, setPatients] = useState<patientRequestList[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotaPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [showing, setShowing] = useState<IShowing | null>(null);
  const [confirmMeds, handleConfirmMeds] = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState<patientRequestList>();
  const targetLink = useHref("/partner-patient-booking");

  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Patients",
      href: "/partner/patients",
    },
    {
      title: "Details",
    },
  ];

  const { id: patientId } = useParams();

  const patientQuery = useQuery({
    queryKey: ["prescribePatientDetails", patientId],
    queryFn: () => patientApiRepository.getPatientDetails(patientId || ""),
  });

  const pDetails = patientQuery?.data?.data?.data;
  const pId = pDetails?.id;

  useEffect(() => {
    setTotaPages(Math.ceil(+totalCount / +pageSize));
  }, [pageSize, totalCount]);

  const fetchPatients = () => {
    const params = {
      per_page: pageSize,
      sort_column: "created_at",
      sort_direction: "desc",
      page: pageIndex,
      pid: pId,
    }; // according to Zahid vai, we will show all prescription in the previous order.
    return patientApiRepository.getPatientHistory(params);
  };
  const patientHistoryQuery = useQuery({ queryKey: ["patientHistoryList", pageSize, pageIndex, pId], queryFn: fetchPatients, enabled: !!pId });

  useEffect(() => {
    if (patientHistoryQuery.isFetched) {
      if (patientHistoryQuery?.data?.status == 200) {
        setPatients(patientHistoryQuery.data?.data?.data?.data || []);

        setTotalCount(patientHistoryQuery.data?.data?.data?.total || 0);
        setShowing({ from: patientHistoryQuery.data?.data?.data?.from || 0, to: patientHistoryQuery.data?.data?.data?.to || 0 });
      }
    }
  }, [patientHistoryQuery.isFetched, patientHistoryQuery.isRefetching, patientHistoryQuery.data]);
  const updatePageSize = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const updateCurrentPage = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };
  const invitePatientMutation = useMutation({ mutationFn: (payload: IRequestRefillDTO) => partnerPatientRepository.requestRefill(payload) });
  const handleSelectOrder = (order: patientRequestList) => {
    setSelectedOrder((prevOrder) => order);
    handleConfirmMeds.open();
  };
  const handleSubmit = (shouldOpen: boolean) => {
    if (!selectedOrder) {
      dmlToast.error({ title: "Couldn't detect the product" });
      return;
    } else {
      if (selectedOrder.prescription.patient?.email && selectedOrder.prescription.patient?.cell_phone) {
        const payload: IRequestRefillDTO = {
          prescription_uid: selectedOrder?.u_id,
        };

        invitePatientMutation.mutate(payload, {
          onSuccess: (res) => {
            // const prescriptionUId = res?.data?.data?.u_id;
            dmlToast.success({ title: "Successfully sent the intake link to patient" });
            if (shouldOpen) {
              window.open(`${targetLink}/?prescription_u_id=${selectedOrder?.prescription?.u_id}&detail_uid=${selectedOrder?.u_id}&is_refill=${1}`, "_blank");
              navigate("/partner/orders");
            } else {
              navigate("/partner/orders");
            }
            window.localStorage.removeItem("InvitePatientData");
          },
          onError: (err) => {
            const error = err as AxiosError<IServerErrorResponse>;
            dmlToast.error({ title: error.response?.data?.message });
          },
        });
      } else {
        dmlToast.error({ title: "Patient data not found, please try again by adding patient." });
      }
    }
  };

  return (
    <>
      <div className="page-title">
        <h6 className="lg:h2 md:h3 sm:h4">Details</h6>
      </div>
      <DynamicBreadcrumbs
        items={menuItems}
        separatorMargin="1"
      />
      <div className="card p-6">
        <div className="card-title with-border">
          <h6>Basic Information</h6>
        </div>
        <Table
          withRowBorders={false}
          className="info-table"
        >
          <Table.Tbody className="text-lg secondary.3">
            <Table.Tr>
              <Table.Th className="font-normal">First Name:</Table.Th>
              <Table.Td>{pDetails?.first_name || "NA"}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th className="font-normal">Last Name:</Table.Th>
              <Table.Td>{pDetails?.last_name || "NA"}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th className="font-normal">Date of Birth:</Table.Th>
              <Table.Td>{pDetails?.dob ? formatDate(pDetails?.dob, "MMMM DD, YYYY") : "NA"}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th className="font-normal">Phone:</Table.Th>
              <Table.Td>{pDetails?.cell_phone ? formatPhoneNumber(pDetails?.cell_phone) : "NA"}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th className="font-normal">Address:</Table.Th>
              <Table.Td>{pDetails?.address1 || "NA"}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th className="font-normal">Country:</Table.Th>
              <Table.Td>{"USA"}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th className="font-normal">State:</Table.Th>
              <Table.Td>{pDetails?.state || "NA"}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th className="font-normal">City:</Table.Th>
              <Table.Td>{pDetails?.city || "NA"}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th className="font-normal">Zip code:</Table.Th>
              <Table.Td>{pDetails?.zipcode || "NA"}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th className="font-normal">Prescriptions:</Table.Th>
              <Table.Td>{pDetails?.ordered_prescription__details_count || "NA"}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
      <div className="card p-6 mt-6">
        <div className="card-title pb-5">
          <h6>Previous Order</h6>
        </div>
        <ul className="flex flex-col gap-5">
          {patients?.length ? (
            patients.map((patient, index) => (
              <li
                key={index}
                className="flex lg:flex-row flex-col gap-5 border border-grey-low rounded-xl p-6"
              >
                <div className="xl:w-[415px] lg:w-[300px] flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="sm:w-[120px] w-full extra-form-text-medium text-grey-medium">Order Date:</span>
                    <span className="sm:w-[calc(100%_-_132px)] w-full extra-form-text-regular">
                      {patient?.created_at ? formatDate(patient?.created_at, "MMMM DD, YYYY") : "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="sm:w-[120px] w-full extra-form-text-medium text-grey-medium">Order No:</span>
                    <span className="sm:w-[calc(100%_-_132px)] w-full extra-form-text-regular">{patient?.prescription?.order_id || "N/A"}</span>
                  </div>
                </div>
                <div className="xl:w-[calc(100%_-_435px)] lg:w-[calc(100%_-_300px)] flex flex-wrap gap-5">
                  <div className="flex flex-col gap-3 xl:w-[calc(100%_-_152px)] w-full">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="sm:w-[120px] w-full extra-form-text-medium text-grey-medium">Drug Name:</span>
                      <span className="sm:w-[calc(100%_-_132px)] w-full extra-form-text-regular">
                        {patient?.medication_name || "N/A"} - {patient?.medication_strength || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="sm:w-[120px] w-full extra-form-text-medium text-grey-medium">Drug Price:</span>
                      <span className="sm:w-[calc(100%_-_132px)] w-full extra-form-text-regular">${patient?.selling_price || 0}</span>
                    </div>
                    {/* <div className="flex flex-wrap items-center gap-3">
                      <span className="sm:w-[120px] w-full extra-form-text-medium text-grey-medium">Pharmacy:</span>
                      <span className="sm:w-[calc(100%_-_132px)] w-full extra-form-text-regular">{patient?.send_pharmacy?.name || "N/A"}</span>
                    </div> */}
                  </div>
                  <div className="flex flex-col gap-3">
                    <Link
                      to={``}
                      // to={`${path}/${patient?.u_id}/details/prescription`}
                      className="text-base font-medium text-primary underline"
                    >
                      View Prescription
                    </Link>
                    <Button
                      size="sm-2"
                      onClick={() => handleSelectOrder(patient)}
                    >
                      Request Refill
                    </Button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <Table
              verticalSpacing="md"
              miw={700}
              layout="fixed"
              withRowBorders={false}
              striped
              stripedColor="background"
              highlightOnHover
              highlightOnHoverColor="primary.0"
              className="dml-list-table"
            >
              <Table.Tbody>
                <NoTableData
                  colSpan={1}
                  imgClass={"w-[350px] mb-8 mt-5"}
                />
              </Table.Tbody>
            </Table>
          )}
        </ul>
        <ConfirmProductOrderModal
          openModal={confirmMeds}
          onModalClose={() => {
            handleConfirmMeds.close();
            setSelectedOrder(undefined);
          }}
          onModalPressYes={() => handleSubmit(true)}
          onModalPressNo={() => handleSubmit(false)}
          okBtnLoading={invitePatientMutation?.isPending}
          medicationInfo={selectedOrder?.customer_medicaton ? [selectedOrder?.customer_medicaton] : []}
          patientInfo={selectedOrder?.prescription.patient as IPartnerOnlyPatientInviteDTO}
        />
        <div className="flex justify-end mt-5 mb-2 me-6">
          <PaginationFilter
            pageSize={pageSize}
            currentPage={pageIndex}
            totalCount={totalCount}
            showing={showing}
            updateCurrentPage={updateCurrentPage}
            updatePageSize={updatePageSize}
          />
        </div>
      </div>
    </>
  );
}

export default PatientDetailsPage;
