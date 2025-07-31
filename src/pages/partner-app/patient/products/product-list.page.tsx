import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IPartnerMedicineListItem } from "@/common/api/models/interfaces/Medication.model";
import { IInvitePartnerPatientDTO } from "@/common/api/models/interfaces/PartnerPatient.model";
import partnerPatientRepository from "@/common/api/repositories/partnerPatientRepository";
import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import DynamicBreadcrumbs from "@/common/components/Breadcrumbs";
import ProductCard from "@/common/components/client/product/product.card";
import { IShowing } from "@/common/components/CustomFilter";
import NoData from "@/common/components/NoData";
import { PaginationFilter } from "@/common/components/PaginationFilter";
import CustomSearchFilter from "@/common/components/SearchFilter";
import dmlToast from "@/common/configs/toaster.config";
import { invitingPartnerPatient } from "@/common/states/invitingPartnerPatient.atom";
import { Button, ScrollArea, Skeleton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHref, useNavigate } from "react-router-dom";
import ConfirmProductOrderModal from "./ConfirmProductOrderModal";

function ProductPageList() {
  const [medicines, setMedicines] = useState<IPartnerMedicineListItem[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showing, setShowing] = useState<IShowing | null>(null);
  const [confirmMeds, handleConfirmMeds] = useDisclosure();
  const [searchText, setSearchText] = useState<string>();
  const [selectedProductId, setSelectedProductId] = useState<number[]>([]);
  const [invitingPatientData] = useAtom(invitingPartnerPatient);
  const targetLink = useHref("/partner-patient-booking");
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Patients",
      href: "/partner/patients",
    },
    {
      title: "Add Patient",
      href: invitingPatientData?.patient_id ? `/partner/add-patient/new-patient?patient_id=${invitingPatientData?.patient_id}` : `/partner/add-patient/new-patient`,
    },
    {
      title: "Medications (Select treatment)",
    },
  ];

  const handleSelect = useCallback(
    (id: number) => {
      console.log(selectedProductId);
      if (selectedProductId?.length) {
        const doesExists = selectedProductId?.findIndex((item) => item == id);
        if (doesExists > -1) {
          const newSelectedItems = selectedProductId?.length > 0 ? [...selectedProductId.filter((item) => item != item)] : selectedProductId;
          setSelectedProductId(newSelectedItems);
        } else {
          const newSelectedItems = selectedProductId?.length ? [...selectedProductId, id] : selectedProductId;
          setSelectedProductId(newSelectedItems);
        }
        console.log(selectedProductId);
      } else {
        setSelectedProductId((prevItems) => [...prevItems, id]);
      }
    },
    [selectedProductId]
  );

  const fetchMedicine = () => {
    const params = {
      per_page: pageSize,
      page: pageIndex,
      search: searchText,
    };
    return partnerApiRepository.getAllPartnerMedicines(params);
  };

  useEffect(() => {
    console.log(invitingPatientData);
  }, [invitingPatientData]);

  const useMedicineQuery = useQuery({ queryKey: ["medicineList", pageSize, pageIndex, searchText], queryFn: fetchMedicine });

  useEffect(() => {
    if (useMedicineQuery?.data?.status == 200 && useMedicineQuery?.data?.data?.data?.data) {
      setMedicines(useMedicineQuery.data?.data?.data?.data || []);
      setTotalCount(useMedicineQuery.data?.data?.data?.total || 0);
      setShowing({ from: useMedicineQuery.data?.data?.data?.from || 0, to: useMedicineQuery.data?.data?.data?.to || 0 });
    }
  }, [useMedicineQuery.data]);

  const updatePageSize = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const updateCurrentPage = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };

  const invitePatientMutation = useMutation({ mutationFn: (payload: IInvitePartnerPatientDTO) => partnerPatientRepository.invitePartnerPatient(payload) });

  const handleSubmit = (shouldOpen: boolean) => {
    if (!selectedProductId) {
      dmlToast.error({ title: "Please select a product first" });
      return;
    } else {
      if (invitingPatientData?.email && invitingPatientData?.cell_phone) {
        const payload: IInvitePartnerPatientDTO = {
          ...invitingPatientData,
          medication_id: selectedProductId,
        };

        invitePatientMutation.mutate(payload, {
          onSuccess: (res) => {
            const prescriptionUId = res?.data?.data?.u_id;
            dmlToast.success({ title: "Successfully sent the intake link to patient" });
            if (shouldOpen) {
              window.open(`${targetLink}/?prescription_u_id=${prescriptionUId}`, "_blank");
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

  const formatDrugStrength = (value?: string): string => {
    if (!value) return "";
    return value.startsWith(".") ? `0${value}` : value;
  };

  const getSelectedServiceName = useMemo(() => {
    const selectedMedication = medicines?.filter((med) => selectedProductId?.some((item) => item == med.medication_id)).map((item) => item.medicine?.name);
    // console.log(selectedMedication);
    return selectedMedication;
  }, [selectedProductId, medicines]);

  return (
    <div className="">
      <div className="page-title">
        <div className="page-title-start">
          <h6 className="lg:h2 md:h3 sm:h4">Medications (Select treatment)</h6>
        </div>
        <div className="page-title-end">
          <CustomSearchFilter
            onSearch={(text: string) => {
              setSearchText(text);
              setPageIndex(1);
            }}
          />
        </div>
      </div>
      <DynamicBreadcrumbs
        items={menuItems}
        separatorMargin="1"
      />
      <div className="bg-tag-bg py-5 px-6 rounded-xl mt-5">
        <p className="text-fs-md text-tag-bg-deep">
          If the patient is taking a weight loss product for the first time, please recommend the lowest available dose. If they’ve already completed the lowest dose without any
          side effects, you may suggest the next higher dose. Final dosage approval will always be confirmed by our licensed provider.
        </p>
      </div>
      <div className="card mt-5">
        {useMedicineQuery?.isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton
              height={198}
              className="rounded-xl"
            />
            <Skeleton
              height={198}
              className="rounded-xl"
            />
            <Skeleton
              height={198}
              className="rounded-xl"
            />
            <Skeleton
              height={198}
              className="rounded-xl"
            />
          </div>
        ) : medicines?.length ? (
          <ScrollArea
            type="hover"
            scrollbarSize={6}
            styles={{
              root: { minHeight: "270px" },
            }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              {medicines?.map((medicine) => (
                <ProductCard
                  key={medicine.id}
                  module="customer"
                  medicine={medicine.medicine}
                  sellingPrice={medicine.price}
                  onSelect={() => handleSelect(medicine.medication_id)}
                  isSelected={selectedProductId?.includes(medicine.medication_id)}
                  isEdit={false}
                  isDetails={false}
                  isSelectable={true}
                  onDuplicate={() => {}}
                />
                // <ProductCard
                //   {...medicine}
                //   key={medicine?.id}
                //   isSelected={selectedProductId === medicine.medication_id}
                //   onSelect={() => handleSelect(medicine.medication_id)}
                //   title={`${medicine?.medicine?.drug_name} ${formatDrugStrength(medicine?.medicine?.drug_strength)}`}
                //   drug_strength={medicine?.medicine?.drug_strength}
                //   customer_med_status={medicine.status}
                //   status={medicine?.medicine?.is_active}
                //   total_price={medicine?.price}
                //   medicineType={medicine?.medicine?.type}
                //   medicineCategory={medicine?.medicine?.category?.title}
                //   module="customer"
                //   price={medicine?.medicine?.price}
                //   doctor_fees={medicine?.medicine?.doctor_fees}
                //   service_fees={medicine?.medicine?.service_fees}
                //   shipping_fees={medicine?.medicine?.shipping_fee?.toString()}
                //   isSelectable={true}
                //   isEdit={false}
                //   onDuplicate={() => {}}
                // />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex h-[400px] items-center justify-center">
            <NoData
              imgClass="w-[200px] lg:w-[300px] m-0 mb-4"
              titleClass="h6 text-foreground mb-2"
              title="No products available yet!"
            />
          </div>
        )}

        <div className="flex justify-end mt-5 mb-2 me-4">
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
      <div className="flex justify-end mt-5 mb-2 me-4">
        <Button
          size="sm-2"
          disabled={!selectedProductId}
          onClick={handleConfirmMeds.open}
        >
          Open & Send Link
        </Button>
      </div>
      <ConfirmProductOrderModal
        openModal={confirmMeds}
        onModalClose={handleConfirmMeds.close}
        onModalPressYes={() => handleSubmit(true)}
        onModalPressNo={() => handleSubmit(false)}
        okBtnLoading={invitePatientMutation?.isPending}
        medicationInfo={medicines.filter((item) => selectedProductId?.includes(item.medication_id))}
        patientInfo={invitingPatientData}
      />
    </div>
  );
}

export default ProductPageList;
