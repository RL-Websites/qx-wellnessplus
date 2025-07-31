import { IPatientHistory } from "@/common/api/models/interfaces/Patient.model";
import patientApiRepository from "@/common/api/repositories/patientRepository";
import { IShowing } from "@/common/components/CustomFilter";
import NoTableData from "@/common/components/NoTableData";
import { formatDate } from "@/utils/date.utils";
import { Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PaginationFilter } from "../../PaginationFilter";

interface IBreadcrumb {
  breadcrumbs?: React.ReactNode;
  onPatientUiIdChange?: (uid: string) => void;
}

function CommonPatientHistoryPage({ breadcrumbs, onPatientUiIdChange }: IBreadcrumb) {
  const [patients, setPatients] = useState<IPatientHistory[]>([]);

  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotaPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [showing, setShowing] = useState<IShowing | null>(null);
  // const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>(["waiting", "received", "shipped", "hold", "cancelled", "delivered"]);
  // const userData = useAtomValue(userAtom);
  const { patientId } = useParams();
  const { id: u_id } = useParams();

  console.log(u_id);

  const fetchPatients = () => {
    const params = {
      per_page: pageSize,
      sort_column: "updated_at",
      sort_direction: "desc",
      page: pageIndex,
      pid: patientId,
    }; // according to Zahid vai, we will show all prescription in the previous order.
    return patientApiRepository.getPatientHistory(params);
  };
  const patientHistoryQuery = useQuery({ queryKey: ["patientHistoryList", pageSize, pageIndex, patientId, statusFilter], queryFn: fetchPatients });

  useEffect(() => {
    if (patientHistoryQuery.isFetched) {
      if (patientHistoryQuery?.data?.status == 200) {
        setPatients(patientHistoryQuery.data?.data?.data?.data || []);

        setTotalCount(patientHistoryQuery.data?.data?.data?.total || 0);
        setShowing({ from: patientHistoryQuery.data?.data?.data?.from || 0, to: patientHistoryQuery.data?.data?.data?.to || 0 });
      }
    }
  }, [patientHistoryQuery.isFetched, patientHistoryQuery.isRefetching, patientHistoryQuery.data]);

  useEffect(() => {
    if (u_id) {
      onPatientUiIdChange?.(u_id);
    }
  }, [u_id, onPatientUiIdChange]);

  useEffect(() => {
    setTotaPages(Math.ceil(+totalCount / +pageSize));
  }, [pageSize, totalCount]);

  const updatePageSize = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const updateCurrentPage = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };

  const handleFilterChange = (filter) => {
    if (filter == "") {
      setStatusFilter([]);
    } else {
      setStatusFilter([filter]);
    }
    setPageIndex(1);
    // navigate("/admin-clinic/clinic-list");
  };

  const selectedFilter = statusFilter.length === 1 ? statusFilter[0] : "All Status";

  const handlePageChange = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };

  return (
    <div className="patient-history">
      <div className="page-title">
        <div className="page-title-start">
          <h2>Patient History</h2>
        </div>
        <div className="page-title-end">
          {/* <CustomFilter
            currentPage={pageIndex}
            filterParams={[
              {
                label: "All",
                key: "",
                iconClass: "icon-dashboard",
              },
              {
                label: "Waiting",
                key: "waiting",
                iconClass: "icon-checkbox-select",
              },
              {
                label: "Received",
                key: "received",
                iconClass: "icon-checkbox-select",
              },
              {
                label: "Shipped",
                key: "shipped",
                iconClass: "icon-checkbox-select",
              },
              {
                label: "Hold",
                key: "hold",
                iconClass: "icon-checkbox-select",
              },
              {
                label: "Cancelled",
                key: "cancelled",
                iconClass: "icon-checkbox-select",
              },
              {
                label: "Delivered",
                key: "delivered",
                iconClass: "icon-checkbox-select",
              },
            ]}
            selectedFilter={selectedFilter}
            disableFilter={false}
            onFilterChange={handleFilterChange}
          /> */}
        </div>
      </div>
      {breadcrumbs}
      <div className="card mt-6">
        <h6 className="text-foreground pb-5">Previous Orders</h6>

        <ul className="flex flex-col gap-5">
          {patients?.length ? (
            patients.map((patient, index) => (
              <li
                key={index}
                className="flex gap-5 border border-grey-low rounded-xl p-6"
              >
                <div className="w-[415px] flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-[120px] extra-form-text-medium text-grey-medium">Order Date:</span>
                    <span className="w-[calc(100%_-_132px)] extra-form-text-regular">{patient?.created_at ? formatDate(patient?.created_at, "MMMM DD, YYYY") : "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-[120px] extra-form-text-medium text-grey-medium">Order No:</span>
                    <span className="w-[calc(100%_-_132px)] extra-form-text-regular">{patient?.order_id || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-[120px] extra-form-text-medium text-grey-medium">Order Qty:</span>
                    <span className="w-[calc(100%_-_132px)] extra-form-text-regular">{patient?.medication?.quantity || "N/A"}</span>
                  </div>
                </div>
                <div className="w-[calc(100%_-_435px)] flex items-center gap-5">
                  <div className="flex flex-col gap-3 w-[calc(100%_-_152px)]">
                    <div className="flex items-center gap-3">
                      <span className="w-[120px] extra-form-text-medium text-grey-medium">Drug Name:</span>
                      <span className="w-[calc(100%_-_132px)] extra-form-text-regular">{patient?.medication?.drug_name || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-[120px] extra-form-text-medium text-grey-medium">Drug Strength:</span>
                      <span className="w-[calc(100%_-_132px)] extra-form-text-regular">{patient?.medication?.drug_ndc || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-[120px] extra-form-text-medium text-grey-medium">Diagnosis:</span>
                      <span className="w-[calc(100%_-_132px)] extra-form-text-regular">{"N/A"}</span>
                    </div>
                  </div>
                  <Link
                    to={`../${patient?.u_id}/details/prescription`}
                    className="text-base font-medium text-primary underline"
                  >
                    View Prescription
                  </Link>
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
                  imgClass={"w-auto mb-10 mt-5"}
                />
              </Table.Tbody>
            </Table>
          )}
        </ul>

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
    </div>
  );
}

export default CommonPatientHistoryPage;
