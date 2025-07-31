import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import CustomFilter, { IShowing } from "@/common/components/CustomFilter";
import NoTableData from "@/common/components/NoTableData";
import { PaginationFilter } from "@/common/components/PaginationFilter";
import CustomSearchFilter from "@/common/components/SearchFilter";
import TableLoader from "@/common/components/TableLoader";
import { userAtom } from "@/common/states/user.atom";
import { formatDate } from "@/utils/date.utils";
import { getOrderStatusClassName, getOrderStatusName } from "@/utils/status.utils";
import { getTimeFromDateString } from "@/utils/time.utils";
import { Button, Paper, ScrollArea, Table } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showing, setShowing] = useState<IShowing | null>(null);
  const [searchText, setSearchText] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<string>();
  const [statusFilterLabel, setStatusFilterLabel] = useState<string>();
  const [dateRange, setDateRange] = useState<string | null>(null);
  const [userData] = useAtom(userAtom);
  const [customerList, setCustomerList] = useState<{ key: string; label: string; iconClass: string }[]>([]);
  const [selectedFilterCustomer, setSelectedFilterCustomer] = useState<string>("");
  const [selectedFilterCustomerId, setSelectedFilterCustomerId] = useState<string>("");

  const fetchPayments = () => {
    const params = {
      per_page: pageSize,
      paginate: true,
      sort_column: "id",
      sort_direction: "desc",
      page: pageIndex,
      status: [statusFilter],
      partner_id: selectedFilterCustomerId,
      search: searchText,
      date_range: dateRange,
    };
    return partnerApiRepository.getPrescriptions(params);
  };

  const paymentQuery = useQuery({ queryKey: ["paymentList", pageSize, pageIndex, statusFilter, searchText, dateRange, selectedFilterCustomerId], queryFn: fetchPayments });

  useEffect(() => {
    if (paymentQuery.isFetched) {
      if (paymentQuery?.data?.status == 200) {
        setOrders(paymentQuery?.data?.data?.data?.data || []);
        setTotalCount(paymentQuery.data?.data?.data?.total || 0);
        setShowing({ from: paymentQuery.data?.data?.data?.from || 0, to: paymentQuery.data?.data?.data?.to || 0 });
      }
    }
  }, [paymentQuery?.data?.data?.data?.data]);

  const fetchCustomers = () => {
    const params = {
      noPaginate: true,
      hasPrescription: true,
      status: ["active"],
    };
    return partnerApiRepository.getNonPaginatedPartnerList(params);
  };

  const customersQuery = useQuery({ queryKey: ["customerFilterDDList"], queryFn: fetchCustomers });

  useEffect(() => {
    if (customersQuery.isFetched && customersQuery?.data?.status == 200) {
      const updatedCustomerList = customersQuery?.data?.data?.data?.map((item) => ({
        key: item?.id ? item?.id.toString() : "",
        label: item?.account_name || "",
        iconClass: "icon-Partner",
      }));

      // const onlyUniqueCustomers = [
      //   {
      //     label: "All Source",
      //     key: "",
      //     iconClass: "icon-dashboard",
      //   },
      //   ...new Map(updatedCustomerList?.map((item) => [item.key, item])).values(),
      // ];

      // onlyUniqueCustomers?.length && onlyUniqueCustomers?.length > 0 ? setCustomerList([...new Set(onlyUniqueCustomers)]) : setCustomerList([]);

      updatedCustomerList?.length && updatedCustomerList?.length > 0
        ? setCustomerList([
            {
              label: "All Customers",
              key: "",
              iconClass: "icon-dashboard",
            },
            ...updatedCustomerList,
          ])
        : setCustomerList([]);
    }
  }, [customersQuery?.data?.data?.data]);

  const navigate = useNavigate();

  const handleFilterChange = (filter, label) => {
    if (filter == "") {
      setStatusFilter(undefined);
      setStatusFilterLabel("");
    } else {
      setStatusFilter(filter);
      setStatusFilterLabel(label);
    }
    setPageIndex(1);
    navigate("/client/orders");
  };

  const selectedFilter = statusFilterLabel ? statusFilterLabel : "All Status";

  const updatePageSize = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const updateCurrentPage = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };

  const rows = orders.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td>{item?.prescription?.order_id}</Table.Td>
      <Table.Td>{item?.prescription?.patient?.name}</Table.Td>
      <Table.Td className="break-all">{item?.prescription?.patient?.email || ""}</Table.Td>
      <Table.Td>
        {item?.medication_name} {item?.medication_strength}
      </Table.Td>
      <Table.Td>{item?.prescription?.customer?.account_name}</Table.Td>
      <Table.Td>${item?.prescription?.total_bill_amount}</Table.Td>
      <Table.Td>${item?.selling_price}</Table.Td>
      <Table.Td>
        {item?.created_at ? formatDate(item?.created_at) : ""} <br />
        {item?.created_at ? getTimeFromDateString(item?.created_at) : ""}
      </Table.Td>
      <Table.Td>
        <span className={`tags capitalize font-medium  ${getOrderStatusClassName(item?.prescription?.status)}`}>{getOrderStatusName(item?.prescription?.status)}</span>
      </Table.Td>
    </Table.Tr>
  ));

  const handleDownload = () => {
    const params = new URLSearchParams();

    dateRange && params.append("date_range", dateRange);
    userData?.id !== undefined && params.append("userId", userData.id.toString());

    const downloadUrl = `${import.meta.env.VITE_BASE_PATH}/api/partner/report/order-download?${params.toString()}`;

    window.open(downloadUrl, "_blank");
  };

  const handleCustomerFilterChange = (value, label) => {
    if (value == "") {
      setSelectedFilterCustomer("");
      setSelectedFilterCustomerId("");
    } else {
      setSelectedFilterCustomer(label);
      setSelectedFilterCustomerId(value);
    }
    setPageIndex(1);
  };

  return (
    <>
      <div className="page-title flex-wrap pb-5">
        <div className="page-title-start">
          <h6 className="lg:h2 md:h3 sm:h4">Orders</h6>
        </div>
        <div className="page-title-end">
          <Button
            size="sm-2"
            onClick={handleDownload}
          >
            Generate a Report
          </Button>
          <CustomSearchFilter onSearch={setSearchText} />
          <DatePickerInput
            type="range"
            clearable
            numberOfColumns={2}
            defaultDate={dayjs().subtract(1, "month").toDate()}
            maxDate={new Date()}
            value={dateRange ? (dateRange.split(",").map((date) => new Date(date)) as [Date, Date]) : [null, null]}
            onChange={(dates) => {
              if (Array.isArray(dates) && dates[0] && dates[1]) {
                const formattedRange = `${dayjs(dates[0]).format("YYYY-MM-DD")},${dayjs(dates[1]).format("YYYY-MM-DD")}`;
                setDateRange(formattedRange);
              } else {
                setDateRange(null);
              }
            }}
            classNames={{
              input: "!min-h-10 !h-10 !pr-10 text-foreground !bg-white",
              day: "data-[selected]:bg-foreground",
              placeholder: "text-foreground font-medium",
            }}
            placeholder="Date"
            rightSection={
              dateRange ? (
                <i
                  className="icon-cross1 cursor-pointer text-lg/none mr-1 text-black"
                  onClick={() => setDateRange(() => null)}
                ></i>
              ) : (
                <i className="icon-filter text-lg/none mr-1 text-black"></i>
              )
            }
          />
          <CustomFilter
            currentPage={pageIndex}
            filterParams={customerList}
            selectedFilter={selectedFilterCustomer || "All Customers"}
            onFilterChange={(value, label) => handleCustomerFilterChange(value, label)}
          />
          <CustomFilter
            currentPage={pageIndex}
            filterParams={[
              {
                label: "All Status",
                key: "",
                iconClass: "icon-all_source",
              },
              {
                label: "In queue",
                key: "in_queue",
                iconClass: "icon-in_queue",
              },
              {
                label: "Accepted",
                key: "accepted",
                iconClass: "icon-checkbox-select",
              },
              {
                label: "Invited",
                key: "invited",
                iconClass: "icon-available",
              },
              {
                label: "Pending",
                key: "pending",
                iconClass: "icon-in_queue",
              },
              {
                label: "Intake Pending",
                key: "intake_pending",
                iconClass: "icon-in_queue",
              },
              {
                label: "Submitted",
                key: "intake_submitted",
                iconClass: "icon-not_available",
              },
              {
                label: "Received",
                key: "received",
                iconClass: "icon-not_available",
              },
            ]}
            selectedFilter={selectedFilter}
            onFilterChange={(value, label) => handleFilterChange(value, label)}
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
            striped
            miw={1100}
            stripedColor="background"
            highlightOnHover
            highlightOnHoverColor="primary.0"
            className="dml-list-table"
          >
            <Table.Thead className="border-b border-grey-low">
              <Table.Tr>
                <Table.Th className="text-nowrap">Order ID</Table.Th>
                <Table.Th className="text-nowrap">Patient Name</Table.Th>
                <Table.Th className="break-all">Email</Table.Th>
                <Table.Th>Medication</Table.Th>
                <Table.Th className="text-nowrap">Customer Account</Table.Th>
                <Table.Th className="text-nowrap">Bill Amount</Table.Th>
                <Table.Th className="text-nowrap">Product Price</Table.Th>
                <Table.Th className="text-nowrap">Order Date</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paymentQuery?.isFetching ? (
                <TableLoader
                  rows={8}
                  columns={9}
                />
              ) : rows.length == 0 ? (
                <NoTableData colSpan={9} />
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

export default Orders;
