import dashboardApiRepository from "@/common/api/repositories/dasboardRepository";
import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import { IShowing } from "@/common/components/CustomFilter";
import MatrixCard from "@/common/components/MatrixCard";
import NoTableData from "@/common/components/NoTableData";
import { PaginationFilter } from "@/common/components/PaginationFilter";
import TableLoader from "@/common/components/TableLoader";
import { userAtom } from "@/common/states/user.atom";
import { formatDate } from "@/utils/date.utils";
import { getOrderStatusClassName, getOrderStatusName } from "@/utils/status.utils";
import { getTimeFromDateString } from "@/utils/time.utils";
import { Anchor, Button, ScrollArea, Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Link, NavLink as RdNavLink } from "react-router-dom";

const Dashboard = () => {
  const [inactive_user] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>();
  const [orders, setOrders] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(4);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showing, setShowing] = useState<IShowing | null>(null);
  const [userData] = useAtom(userAtom);

  const dashboardQuery = useQuery({ queryKey: ["spaModuleDashboard"], queryFn: () => dashboardApiRepository.getPartnerSummary() });
  // const counts = dashboardQuery.data?.data?.data;
  useEffect(() => {
    if (dashboardQuery?.data?.data.status_code == 200 && dashboardQuery?.data?.data.data) {
      setDashboardData(dashboardQuery?.data?.data.data);
    }
  }, [dashboardQuery?.data?.data.data]);

  const fetchPayments = () => {
    const params = {
      per_page: pageSize,
      paginate: true,
      sort_column: "id",
      sort_direction: "desc",
      page: pageIndex,
    };
    return partnerApiRepository.getPrescriptions(params);
  };

  const paymentQuery = useQuery({ queryKey: ["paymentList", pageSize, pageIndex], queryFn: fetchPayments });

  useEffect(() => {
    if (paymentQuery.isFetched) {
      if (paymentQuery?.data?.status == 200) {
        setOrders(paymentQuery?.data?.data?.data?.data || []);
        setTotalCount(paymentQuery.data?.data?.data?.total || 0);
        setShowing({ from: paymentQuery.data?.data?.data?.from || 0, to: paymentQuery.data?.data?.data?.to || 0 });
      }
    }
  }, [paymentQuery.isFetched, paymentQuery.isRefetching, paymentQuery.data]);

  const updatePageSize = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const updateCurrentPage = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };

  const tableRows = orders?.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td>{item?.prescription?.order_id}</Table.Td>
      <Table.Td>{item?.rx_number}</Table.Td>
      <Table.Td>{item?.prescription?.patient?.name || ""}</Table.Td>
      <Table.Td className="break-all">{item?.prescription?.patient?.email || ""}</Table.Td>
      <Table.Td>
        {item?.medication_name || "N/A"} {item?.medication_strength}
      </Table.Td>
      <Table.Td>${item?.prescription?.total_bill_amount}</Table.Td>
      <Table.Td>
        {formatDate(item?.created_at, "MM-DD-YYYY")} <br />
        {item?.created_at ? getTimeFromDateString(item?.created_at) : ""}
      </Table.Td>
      <Table.Td>
        {formatDate(item?.updated_at, "MM-DD-YYYY")} <br />
        {item?.created_at ? getTimeFromDateString(item?.updated_at) : ""}
      </Table.Td>
      <Table.Td>
        <span className={`tags capitalize ${getOrderStatusClassName(item.prescription?.status)}`}>{getOrderStatusName(item.prescription?.status)}</span>
      </Table.Td>
      {/* <Table.Td>
        <Tooltip
          label="View Details"
          position="top"
        >
          <NavLink
            to={`/`}
            className="text-sm text-primary font-medium"
          >
            <i className={`icon-Through text-xl/none`}></i>
          </NavLink>
        </Tooltip>
      </Table.Td> */}
    </Table.Tr>
  ));
  return (
    <>
      {userData?.userable?.payment_type == "stripe" ? (
        <>
          <div className="dashboard inactive_user">
            <div className="page-title pb-5">
              <div className="page-title-start">
                <h6 className="lg:h2 md:h3 sm:h4">Dashboard</h6>
              </div>
            </div>
            <div className="card">
              <div className="grid md:grid-cols-5 gap-10">
                <div className="text-content col-span-3">
                  <h6 className="lg:h4 md:h-5 text-foreground">Set up your Stripe Account</h6>
                  <p className="extra-form-text-regular py-5">To start receiving payments, you must accept the Stripe Connect invitation sent to your email.</p>
                  <h6 className="text-foreground pb-2">Follow These Steps:</h6>
                  <ul className="list-disc list-outside pl-6 space-y-1">
                    <li className="heading-xxs">Check your inbox and look for an email from Stripe Connection.</li>
                    <li className="heading-xxs">Open the email and click the invitation link.</li>
                    <li className="heading-xxs">Complete the Stripe setup.</li>
                    <li className="heading-xxs">Return to this app and click "I Have Activated My Stripe Connection Account". </li>
                    <li className="heading-xxs">You can contact us by clicking "Need Help".</li>
                  </ul>
                  <h6 className="text-foreground pt-5">This confirms you've completed the Stripe Connection setup.</h6>
                </div>
                <div className="col-span-2 flex justify-center items-center">
                  <img
                    src="/images/setup-stripe-acc.png"
                    alt="Setup stripe account image"
                  />
                </div>
              </div>
              <div className="text-center pt-[60px]">
                <Button
                  size="sm-2"
                  className="w-[476px]"
                >
                  I Have Activated My Stripe Connection Account
                </Button>
                <Anchor
                  href="https://mantine.dev/"
                  target="_blank"
                  underline="always"
                  className="block font-bold mt-[30px]"
                >
                  Need Help
                </Anchor>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="dashboard">
            <div className="page-title pb-5">
              <div className="page-title-start">
                <h6 className="lg:h2 md:h3 sm:h4">Dashboard</h6>
              </div>
              <div className="page-title-end flex gap-4">
                <Button
                  size="sm-2"
                  component={RdNavLink}
                  to={`../add-patient`}
                >
                  Add Patient
                </Button>
              </div>
            </div>
            <div className="space-y-5">
              <div className="card grid sm:grid-cols-2 gap-5">
                <MatrixCard
                  matCard="bg-gradient-to-bl from-blue-light to-blue-medium p-6"
                  iconBg="bg-primary md:h-20 md:w-20"
                  dmlIcon="icon-user-group md:text-[40px]/none text-2xl/none text-white"
                  cardCount={dashboardData?.total_patients}
                  countStyle="pb-14 md:-mt-20 -mt-10"
                  cardText="Total Patient"
                  textW="!text-xl !font-medium mt-9"
                  cardLink="/partner/patients"
                  linkText="View Details"
                  linkIcon="icon-next_arrow text-xl/none"
                />{" "}
                <MatrixCard
                  matCard="bg-gradient-to-bl from-green-light to-green-medium p-6"
                  iconBg="bg-green-deep md:h-20 md:w-20"
                  dmlIcon="icon-orders md:text-[40px]/none text-2xl/none text-white"
                  cardCount={dashboardData?.active_orders}
                  countStyle="pb-14 md:-mt-20 -mt-10"
                  cardText="Active Orders"
                  textW="!text-xl !font-medium mt-9"
                  cardLink="/partner/orders"
                  linkText="View Details"
                  linkIcon="icon-next_arrow text-xl/none"
                />
              </div>

              <div className="card p-0">
                <div className="card-title flex items-center justify-between p-6 pb-3.5">
                  <h6 className="md:h4 sm:h5">Orders</h6>
                  <div className="sm:flex items-center gap-[30px] hidden">
                    <Link
                      to="/partner/orders"
                      className="heading-xxxs text-primary underline"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="sm:hidden flex items-center gap-3">
                    <Link to="/client/patients">
                      <i className="icon-requests text-xl/none text-primary"></i>
                    </Link>
                  </div>
                </div>
                <ScrollArea>
                  <Table
                    verticalSpacing="md"
                    withRowBorders={false}
                    striped
                    miw={1200}
                    stripedColor="background"
                    highlightOnHover
                    highlightOnHoverColor="primary.0"
                    className="dml-list-table"
                  >
                    <Table.Thead className="border-b border-grey-low">
                      <Table.Tr>
                        <Table.Th className="text-nowrap">Order Id</Table.Th>
                        <Table.Th className="text-nowrap">Patient Name</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Medication</Table.Th>
                        <Table.Th className="text-nowrap">Bill Amount</Table.Th>
                        <Table.Th className="text-nowrap">Order Date</Table.Th>
                        <Table.Th className="text-nowrap">Payment Date</Table.Th>
                        <Table.Th className="text-nowrap">Shipping Status</Table.Th>
                        {/* <Table.Th className="w-40 text-center">Details</Table.Th> */}
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {paymentQuery?.isLoading ? (
                        <TableLoader
                          rows={8}
                          columns={8}
                        />
                      ) : tableRows.length > 0 ? (
                        tableRows
                      ) : (
                        <NoTableData
                          colSpan={8}
                          imgClass="w-[130px] mt-11 mb-4"
                          titleClass="mb-[37px] heading-xxs text-foreground"
                        />
                      )}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </div>
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
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
