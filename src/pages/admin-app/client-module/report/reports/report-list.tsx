import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import { IShowing } from "@/common/components/CustomFilter";
import NoTableData from "@/common/components/NoTableData";
import { PaginationFilter } from "@/common/components/PaginationFilter";
import TableLoader from "@/common/components/TableLoader";
import { userAtom } from "@/common/states/user.atom";
import { formatDate } from "@/utils/date.utils";
import { getOrderStatusClassName, getOrderStatusName } from "@/utils/status.utils";
import { getTimeFromDateString } from "@/utils/time.utils";
import { Button, Paper, ScrollArea, Table } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

function ReportList() {
  const [payments, setPayments] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showing, setShowing] = useState<IShowing | null>(null);
  const [sortDirection, setSortDirection] = useState<string>("desc");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<string | undefined>(undefined);
  const userData = useAtomValue(userAtom);

  const fetchPayments = () => {
    const params = {
      per_page: pageSize,
      paginate: true,
      sort_column: "id",
      sort_direction: sortDirection,
      page: pageIndex,
      status: statusFilter,
      date_range: dateRange,
    };
    return partnerApiRepository.getReportList(params);
  };

  const paymentQuery = useQuery({ queryKey: ["paymentList", sortDirection, pageSize, pageIndex, statusFilter, dateRange], queryFn: fetchPayments });

  useEffect(() => {
    if (paymentQuery.isFetched) {
      if (paymentQuery?.data?.status == 200) {
        setPayments(paymentQuery?.data?.data?.data?.data || []);
        setTotalCount(paymentQuery.data?.data?.data?.total || 0);
        setShowing({ from: paymentQuery.data?.data?.data?.from || 0, to: paymentQuery.data?.data?.data?.to || 0 });
      }
    }
  }, [paymentQuery.isFetched, paymentQuery.isRefetching, paymentQuery.data]);

  // const navigate = useNavigate();

  // const handleFilterChange = (filter) => {
  //   setStatusFilter(filter);
  //   setPageIndex(1);
  //   navigate("/clinic/billings");
  // };

  const updatePageSize = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const updateCurrentPage = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };

  const handleDownload = () => {
    const params = new URLSearchParams();

    // if (searchText) params.append("search", searchText);
    if (dateRange) params.append("date_range", dateRange);
    if (userData?.id !== undefined) {
      params.append("userId", userData.id.toString());
    }
    const downloadUrl = `${import.meta.env.VITE_BASE_PATH}/api/customer/report/download?${params.toString()}`;

    // Open the download in a new tab
    window.open(downloadUrl, "_blank");
  };

  const rows = payments.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td>{item?.prescription?.order_id}</Table.Td>
      <Table.Td>{item?.prescription?.patient?.name}</Table.Td>
      <Table.Td className="break-all">{item?.prescription?.patient?.email}</Table.Td>
      <Table.Td>
        {item?.medication?.name} {item?.medication?.strength} {item?.medication?.unit}
      </Table.Td>
      <Table.Td>$ {item?.selling_price}</Table.Td>
      <Table.Td>{item?.prescription?.customer?.account_name}</Table.Td>
      <Table.Td>
        {formatDate(item?.created_at, "MM-DD-YYYY")} <br />
        {item?.created_at ? getTimeFromDateString(item?.created_at) : ""}
      </Table.Td>
      <Table.Td>{formatDate(item?.updated_at, "MM-DD-YYYY")}</Table.Td>
      <Table.Td>
        <span className={`tags capitalize ${getOrderStatusClassName(item?.status)}`}>{getOrderStatusName(item?.prescription?.status)}</span>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <div className="page-title flex-wrap pb-5">
        <div className="page-title-start">
          <h6 className="lg:h2 md:h3 sm:h4">Reports</h6>
        </div>
        <div className="page-title-end">
          <Button
            size="sm-2"
            onClick={handleDownload}
          >
            Generate a Report
          </Button>
          <DatePickerInput
            type="range"
            clearable
            numberOfColumns={2}
            defaultDate={dayjs().subtract(1, "month").toDate()}
            maxDate={new Date()}
            value={dateRange ? (dateRange.split(",").map((date) => new Date(date)) as [Date, Date]) : undefined}
            onChange={(dates) => {
              if (Array.isArray(dates) && dates[0] && dates[1]) {
                const formattedRange = `${dayjs(dates[0]).format("YYYY-MM-DD")},${dayjs(dates[1]).format("YYYY-MM-DD")}`;
                setDateRange(formattedRange);
              } else {
                setDateRange(undefined);
              }
            }}
            classNames={{
              input: "!min-h-10 !h-10 !pr-10 text-foreground !bg-white",
              day: "data-[selected]:bg-foreground",
              placeholder: "text-foreground font-medium",
            }}
            placeholder="Date"
            rightSection={<i className="icon-filter text-lg/none mr-1 text-black"></i>}
          />
        </div>
      </div>

      <Paper
        shadow="xs"
        radius={12}
      >
        <ScrollArea>
          <Table
            verticalSpacing="md"
            withRowBorders={false}
            miw={1200}
            striped
            stripedColor="background"
            highlightOnHover
            highlightOnHoverColor="primary.0"
            className="dml-list-table"
          >
            <Table.Thead className="border-b border-grey-low">
              <Table.Tr>
                <Table.Th className="text-nowrap">Order ID</Table.Th>
                <Table.Th className="text-nowrap">Patient Name</Table.Th>
                <Table.Th className="text-nowrap">Email</Table.Th>
                <Table.Th className="text-nowrap">Medication</Table.Th>
                <Table.Th className="text-nowrap">Bill Amount</Table.Th>
                <Table.Th className="text-nowrap">Customer Account</Table.Th>
                <Table.Th className="text-nowrap">Order Date</Table.Th>
                <Table.Th className="text-nowrap">Payment Date</Table.Th>
                <Table.Th className="text-nowrap">Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paymentQuery.isLoading ? (
                <TableLoader
                  rows={6}
                  columns={9}
                />
              ) : rows.length > 0 ? (
                rows
              ) : (
                <NoTableData colSpan={9} />
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
}

export default ReportList;
