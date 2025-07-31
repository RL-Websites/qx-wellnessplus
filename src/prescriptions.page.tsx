import addClientApiRepository from "@/common/api/repositories/clientRepositoiry";
import prescriptionApiRepository from "@/common/api/repositories/prescriptionRepository";
import CustomFilter, { IFilterParams, IShowing } from "@/common/components/CustomFilter";
import NoTableData from "@/common/components/NoTableData";
import { PaginationFilter } from "@/common/components/PaginationFilter";
import CustomSearchFilter from "@/common/components/SearchFilter";
import TableLoader from "@/common/components/TableLoader";
import { userAtom } from "@/common/states/user.atom";
import { formatDate } from "@/utils/date.utils";
import { getTimeFromDateString } from "@/utils/time.utils";
import { Paper, Table, Text, Tooltip } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Prescriptions = () => {
  const userData = useAtomValue(userAtom);
  const [patients, setPatients] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showing, setShowing] = useState<IShowing | null>({ from: 0, to: 0 });
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<string>("desc");
  const [selectedClientLabel, setSelectedClientLabel] = useState<string>("All Source");
  const [filterOptions, setFilterOptions] = useState<IFilterParams[]>([
    {
      label: "All Source",
      key: "",
      iconClass: "icon-dashboard",
    },
  ]);

  useEffect(() => {
    setTotalPages(Math.ceil(+totalCount / +pageSize));
  }, [pageSize, totalCount]);

  const fetchPatients = () => {
    const params = {
      per_page: pageSize,
      sort_column: "updated_at",
      sort_direction: sortDirection,
      page: pageIndex,
      client_id: selectedClient || undefined,
      module: "doctor",
      status: ["waiting", "received", "shipped", "hold", "cancelled", "delivered"],
    };
    return prescriptionApiRepository.getPrescriptions(params);
  };

  const patientQuery = useQuery({
    queryKey: ["prescriptionList", pageSize, pageIndex, selectedClient, sortDirection],
    queryFn: fetchPatients,
  });

  useEffect(() => {
    if (patientQuery.isFetched) {
      if (patientQuery?.data?.status == 200) {
        setPatients(patientQuery.data?.data?.data?.data || []);
        setTotalCount(patientQuery.data?.data?.data?.total || 0);
        setShowing({
          from: patientQuery.data?.data?.data?.from || 0,
          to: patientQuery.data?.data?.data?.to || 0,
        });
      }
    }
  }, [patientQuery.isFetched, patientQuery.isRefetching, patientQuery.data]);

  const updatePageSize = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const updateCurrentPage = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };

  const handleFilterChange = (filterKey: string, filterLabel: string) => {
    setSelectedClient(filterKey);
    setSelectedClientLabel(filterLabel);
    setSortDirection(filterKey === "MangoRx" ? "asc" : "desc");
    setPageIndex(1);
  };

  const getStatusClassName = (status: string) => {
    switch (status) {
      case "received":
        return "bg-green-low text-green";
      case "completed":
        return "bg-primary-light text-primary";
      case "in_queue":
        return "bg-tag-bg text-tag-bg-deep";
      case "pending":
        return "bg-tag-bg text-tag-bg-deep";
      case "declined":
        return "bg-danger-light text-danger-deep";
      default:
        return "bg-tag-bg text-tag-bg-deep";
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case "in_queue":
        return "In Queue";
      default:
        return status;
    }
  };

  const fetchSource = () => {
    const params = {
      patient_exist: true,
      userable_id: userData?.userable_id,
    };

    return addClientApiRepository.getClients(params);
  };

  const sourceQuery = useQuery({ queryKey: ["sourceList"], queryFn: fetchSource });

  const patientSources = sourceQuery?.data?.data?.data?.data;

  useEffect(() => {
    if (sourceQuery.isFetched) {
      setFilterOptions([
        {
          label: "All Source",
          key: "",
          iconClass: "icon-dashboard",
        },
      ]);
      if (sourceQuery?.data?.status == 200) {
        patientSources?.forEach((client: any) => {
          const newSource = { label: client?.name, key: client?.id, iconClass: "icon-clients" };

          setFilterOptions((prevFilters) => (prevFilters.find((item) => item?.key != newSource.key) ? [...prevFilters, newSource] : filterOptions));
        });
      }
    }
  }, [sourceQuery.isFetched]);

  const rows = patients?.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageIndex - 1) * pageSize + index + 1}</Table.Td>
      <Table.Td>{item?.dnn_unique_id}</Table.Td>
      <Table.Td>{item?.order_id}</Table.Td>
      <Table.Td>{item?.dosespot_unique_id}</Table.Td>
      <Table.Td>
        {item?.created_at ? formatDate(item?.created_at, "MMM DD, YYYY") : ""} <br />
        {item?.created_at ? getTimeFromDateString(item?.created_at) : ""}
      </Table.Td>
      <Table.Td>{item?.patient?.name}</Table.Td>
      <Table.Td>{item?.doctor?.name ? item?.doctor?.name : ""}</Table.Td>
      <Table.Td>{item?.client?.name}</Table.Td>
      <Table.Td>
        <Text className="text-sm/5">{item?.medication?.drug_name}</Text>
      </Table.Td>
      <Table.Td>
        <span className={`tags capitalize ${getStatusClassName(item?.treatment_status)}`}>{getStatusName(item.treatment_status)}</span>
      </Table.Td>
      <Table.Td></Table.Td>
      <Table.Td>
        <Tooltip
          label={item?.details?.note || ""}
          events={{ hover: Boolean(item?.details?.note), focus: Boolean(item?.details?.note), touch: Boolean(item?.details?.note) }}
        >
          <span className="cursor-pointer">{item?.details?.note || ""}</span>
        </Tooltip>
      </Table.Td>
      <Table.Td>
        <Tooltip
          label="View Prescription"
          position="top"
        >
          <Link
            to={`${item?.u_id}/details`}
            className="text-fs-sm text-primary"
          >
            <i className="icon-Through text-2xl/none"></i>
          </Link>
        </Tooltip>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <div className="table-title flex-wrap">
        <div className="table-title-inner">
          <h2>Reviews</h2>
        </div>
        <div className="flex gap-3">
          <CustomSearchFilter onSearch={() => {}} />
          <CustomFilter
            currentPage={pageIndex}
            filterParams={filterOptions}
            selectedFilter={selectedClientLabel}
            onFilterChange={(value, label) => handleFilterChange(value, label || "")}
          />
        </div>
      </div>
      <Paper
        shadow="xs"
        radius={12}
        className="mt-5 pt-[5px] pb-1"
      >
        <Table.ScrollContainer minWidth={1750}>
          <Table
            verticalSpacing="md"
            withRowBorders={false}
            layout="fixed"
            striped
            stripedColor="background"
            highlightOnHover
            highlightOnHoverColor="primary.0"
            className="dml-list-table"
          >
            <Table.Thead className="border-b border-grey-low">
              <Table.Tr>
                <Table.Th>SL</Table.Th>
                <Table.Th>Client order ID</Table.Th>
                <Table.Th>Order ID</Table.Th>
                <Table.Th>RX Number</Table.Th>
                <Table.Th>Prescribe Date</Table.Th>
                <Table.Th>Patient Name</Table.Th>
                <Table.Th>Dr Name</Table.Th>
                <Table.Th> Source</Table.Th>
                <Table.Th>Medication</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Tracking Number</Table.Th>
                <Table.Th>Note</Table.Th>
                <Table.Th>View</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {patientQuery.isLoading ? (
                <TableLoader
                  rows={8}
                  columns={13}
                />
              ) : rows?.length > 0 ? (
                rows
              ) : (
                <NoTableData colSpan={13} />
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>
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
    </>
  );
};
