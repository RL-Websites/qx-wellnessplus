import dashboardApiRepository from "@/common/api/repositories/dasboardRepository";
import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import MatrixCard from "@/common/components/MatrixCard";
import NoTableData from "@/common/components/NoTableData";
import TableLoader from "@/common/components/TableLoader";
import { formatDate } from "@/utils/date.utils";
import { getStatusClassName, getStatusName } from "@/utils/status.utils";
import { getTimeFromDateString } from "@/utils/time.utils";
import { Button, ScrollArea, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, NavLink as RdNavLink, useNavigate } from "react-router-dom";
import AddPartnerAccount from "../common/AddPartnerAccount";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<any>();
  const [patients, setPatients] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [openAddPartnerModal, addPartnerModalHandler] = useDisclosure();
  const fetchPatients = () => {
    const params = {
      per_page: pageSize,
      sort_column: "created_at",
      sort_direction: "desc",
      page: 1,
      status: ["pending"],
    };
    return partnerApiRepository.getPrescriptions(params);
  };

  const patientQuery = useQuery({ queryKey: ["pRequests"], queryFn: fetchPatients });

  useEffect(() => {
    if (patientQuery.isFetched) {
      if (patientQuery?.data?.status == 200 && patientQuery?.data?.data?.data?.data) {
        setPatients(patientQuery.data?.data?.data?.data || []);
        setPageIndex(patientQuery.data?.data?.data?.current_page || 1);
      }
    }
  }, [patientQuery.isFetched, patientQuery.isRefetching, patientQuery.data]);

  const dashboardQuery = useQuery({ queryKey: ["spaModuleDashboard"], queryFn: () => dashboardApiRepository.getPartnerSummary() });
  // const counts = dashboardQuery.data?.data?.data;
  useEffect(() => {
    if (dashboardQuery?.data?.data.status_code == 200 && dashboardQuery?.data?.data.data) {
      setDashboardData(dashboardQuery?.data?.data.data);
    }
  }, [dashboardQuery?.data?.data.data]);

  const navigate = useNavigate();

  const addPartnerModalClose = (reason) => {
    if (reason == "success") {
      navigate("/client/partner-accounts");
    }
    addPartnerModalHandler.close();
  };

  const tableRows = patients.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td>{item?.prescription?.order_id}</Table.Td>
      <Table.Td>{item?.prescription?.patient?.name}</Table.Td>
      <Table.Td>{item?.prescription?.patient?.cell_phone}</Table.Td>
      <Table.Td className="break-all">{item?.prescription?.patient?.email}</Table.Td>
      <Table.Td>{item?.prescription?.customer?.account_name}</Table.Td>
      <Table.Td>
        {item?.created_at ? formatDate(item?.created_at, "MMM DD, YYYY") : ""} <br />
        {item?.created_at ? getTimeFromDateString(item?.created_at) : ""}
      </Table.Td>
      <Table.Td>
        <span className={`tags ` + getStatusClassName(item?.prescription?.status)}>{getStatusName(item?.prescription?.status)}</span>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <div className="dashboard">
      <div className="page-title pb-5">
        <div className="page-title-start">
          <h6 className="lg:h2 md:h3 sm:h4">Dashboard</h6>
        </div>
        <div className="page-title-end flex gap-4">
          <Button
            size="sm-2"
            component={RdNavLink}
            to={`/client/products/add-product`}
            variant="light"
            className="bg-grey-low"
          >
            Add Medication
          </Button>
          <Button
            size="sm-2"
            onClick={addPartnerModalHandler.open}
          >
            Add Customer Account
          </Button>
        </div>
      </div>
      <div className="space-y-5">
        <div className="card grid sm:grid-cols-2 gap-5">
          <MatrixCard
            matCard="bg-gradient-to-bl from-blue-light to-blue-medium p-6"
            iconBg="bg-primary md:h-20 md:w-20"
            dmlIcon="icon-Partner md:text-[40px]/none text-2xl/none text-white"
            cardCount={dashboardData?.total_partners}
            countStyle="pb-14 md:-mt-20 -mt-10"
            cardText="Total Customers"
            textW="!text-xl !font-medium mt-9"
            cardLink="/client/partner-accounts"
            linkText="View Details"
            linkIcon="icon-next_arrow text-xl/none"
          />{" "}
          <MatrixCard
            matCard="bg-gradient-to-bl from-green-light to-green-medium p-6"
            iconBg="bg-green-deep md:h-20 md:w-20"
            dmlIcon="icon-patients-new md:text-[40px]/none text-2xl/none text-white"
            cardCount={dashboardData?.total_patients}
            countStyle="pb-14 md:-mt-20 -mt-10"
            cardText="Total Patients"
            textW="!text-xl !font-medium mt-9"
            cardLink="/client/patients"
            linkText="View Details"
            linkIcon="icon-next_arrow text-xl/none"
          />
        </div>

        <div className="card p-0">
          <div className="card-title flex items-center justify-between p-6 pb-3.5">
            <h6 className="md:h4 sm:h5">Patients in Queue</h6>
            <div className="sm:flex items-center gap-[30px] hidden">
              <Link
                to="/client/patients"
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
              miw={1000}
              stripedColor="background"
              highlightOnHover
              highlightOnHoverColor="primary.0"
              className="dml-list-table"
            >
              <Table.Thead className="border-b border-grey-low">
                <Table.Tr>
                  <Table.Th>Order Id</Table.Th>
                  <Table.Th className="text-nowrap">Patient Name</Table.Th>
                  <Table.Th className="text-nowrap">Phone No.</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th className="text-nowrap">Customer Account</Table.Th>
                  <Table.Th className="text-nowrap">Request Date</Table.Th>
                  <Table.Th>Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {patientQuery?.isLoading ? (
                  <TableLoader
                    rows={6}
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
      </div>

      <AddPartnerAccount
        onModalClose={(reason) => addPartnerModalClose(reason)}
        openModal={openAddPartnerModal}
      />
    </div>
  );
};

export default DashboardPage;
