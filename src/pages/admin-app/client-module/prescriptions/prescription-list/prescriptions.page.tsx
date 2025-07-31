import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import { IShowing } from "@/common/components/CustomFilter";
import NoTableData from "@/common/components/NoTableData";
import { PaginationFilter } from "@/common/components/PaginationFilter";
import TableLoader from "@/common/components/TableLoader";
import { formatDate } from "@/utils/date.utils";
import { Paper, ScrollArea, Table, Text, Tooltip } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Prescriptions = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showing, setShowing] = useState<IShowing | null>(null);
  const [sortDirection, setSortDirection] = useState<string>("desc");
  const [searchText, setSearchText] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const navigate = useNavigate();

  const fetchPatients = () => {
    const params = {
      per_page: pageSize,
      paginate: true,
      sort_column: "updated_at",
      sort_direction: sortDirection,
      page: pageIndex,
      search: searchText,
      status: ["received"],
    };
    return partnerApiRepository.getPrescriptions(params);
  };

  const patientQuery = useQuery({
    queryKey: ["prescriptionList", pageSize, pageIndex, sortDirection, searchText, statusFilter],
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

  useEffect(() => {
    setTotalPages(Math.ceil(+totalCount / +pageSize));
  }, [pageSize, totalCount]);

  const updatePageSize = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const updateCurrentPage = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };

  const handleFilterChange = (filter) => {
    if (filter == "") {
      setStatusFilter(["invited", "pending", "intake_submitted"]);
    } else {
      setStatusFilter([filter]);
    }
    setPageIndex(1);
    navigate("/admin-client/prescriptions");
  };

  const selectedFilter = statusFilter.length === 1 ? statusFilter[0] : "All Status";

  const getStatusClassName = (status: string) => {
    switch (status) {
      case "intake_submitted":
        return "bg-green-low text-green-middle";
      case "invited":
        return "bg-tag-bg text-tag-bg-deep";
      case "pending":
        return "bg-tag-bg text-tag-bg-deep";
      case "declined":
        return "bg-danger-light text-danger-deep";
      default:
        return "";
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case "intake_submitted":
        return "Submitted";
      default:
        return status;
    }
  };

  const rows = patients?.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td>{(pageIndex - 1) * pageSize + index + 1}</Table.Td>
      <Table.Td>{item?.prescription?.order_id || "N/A"}</Table.Td>
      <Table.Td>{item?.rx_number || "N/A"}</Table.Td>
      <Table.Td>{item?.prescription?.client?.name || "N/A"}</Table.Td>
      <Table.Td>{item?.prescription?.customer?.account_name || "N/A "}</Table.Td>

      <Table.Td>{formatDate(item?.created_at, "MM-DD-YYYY") || "N/A"}</Table.Td>
      <Table.Td>{item?.prescription?.patient?.name || "N/A"}</Table.Td>
      <Table.Td>{item?.doctor_name || "N/A"}</Table.Td>
      <Table.Td>
        <Text className="text-sm/5">
          {item?.medication_name || "N/A"} - {item?.medication_strength || "N/A"}
        </Text>
      </Table.Td>
      <Table.Td>
        <span className={`tags capitalize ${getStatusClassName(item?.prescription?.status)}`}>{getStatusName(item?.prescription?.status)}</span>
      </Table.Td>
      <Table.Td>{item?.trackingNumber || "N/A"}</Table.Td>
      <Table.Td>
        <p className="line-clamp-2">{item?.note || "N/A"}</p>
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
          <h2>Prescriptions</h2>
        </div>
      </div>
      <Paper
        shadow="xs"
        radius={12}
        className="mt-5 pt-[5px] pb-1"
      >
        <ScrollArea>
          <Table
            verticalSpacing="md"
            withRowBorders={false}
            miw={1500}
            striped
            stripedColor="background"
            highlightOnHover
            highlightOnHoverColor="primary.0"
            className="dml-list-table"
          >
            <Table.Thead className="border-b border-grey-low">
              <Table.Tr>
                <Table.Th className="text-nowrap">SL</Table.Th>
                <Table.Th className="text-nowrap">Order ID</Table.Th>
                <Table.Th className="text-nowrap">RX Number</Table.Th>
                <Table.Th className="text-nowrap">Client</Table.Th>
                <Table.Th className="text-nowrap w-[200px]">Customer Account</Table.Th>

                <Table.Th className="text-nowrap">Prescribe Date</Table.Th>
                <Table.Th className="text-nowrap">Patient Name</Table.Th>
                <Table.Th className="text-nowrap">Prescriber Name</Table.Th>
                <Table.Th className="text-nowrap">Medication</Table.Th>
                <Table.Th className="text-nowrap">Status</Table.Th>
                <Table.Th className="text-nowrap">Tracking Number</Table.Th>
                <Table.Th className="text-nowrap">Note</Table.Th>
                <Table.Th className="text-nowrap">Details</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {patientQuery.isFetching ? (
                <TableLoader
                  rows={8}
                  columns={13}
                />
              ) : rows.length == 0 ? (
                <NoTableData colSpan={13} />
              ) : (
                rows
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
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
