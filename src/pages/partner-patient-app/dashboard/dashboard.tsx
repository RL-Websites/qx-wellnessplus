import { patientRequestList } from "@/common/api/models/interfaces/Prescription.model";
import dashboardApiRepository from "@/common/api/repositories/dasboardRepository";
import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import { IShowing } from "@/common/components/CustomFilter";
import MatrixCard from "@/common/components/MatrixCard";
import NoTableData from "@/common/components/NoTableData";
import TableLoader from "@/common/components/TableLoader";
import { formatDate } from "@/utils/date.utils";
import { getOrderStatusClassName, getOrderStatusName } from "@/utils/status.utils";
import { getTimeFromDateString } from "@/utils/time.utils";
import { Anchor, ScrollArea, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LicenseModal from "../order-history/common/drivingLicense.modal";
import IntakeForm from "../order-history/common/intake-form.modal";
import LabReportModal from "../order-history/common/lab-report.modal";
import PrescriptionModal from "../order-history/common/prescription.modal";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<any>();
  const [ordersList, setOrdersList] = useState<patientRequestList[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<any>("");
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotaPages] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showing, setShowing] = useState<IShowing | null>(null);
  const [openPrescription, setPrescriptionHandler] = useDisclosure();
  const [openLicense, setLicenseHandler] = useDisclosure();
  const [openLabReport, setLabReportHandler] = useDisclosure();
  const [openIntakeForm, setOpenIntakeForm] = useDisclosure();

  const dashboardQuery = useQuery({ queryKey: ["spaModuleDashboard"], queryFn: () => dashboardApiRepository.getPartnerSummary() });
  // const counts = dashboardQuery.data?.data?.data;
  useEffect(() => {
    if (dashboardQuery?.data?.data.status_code == 200 && dashboardQuery?.data?.data.data) {
      setDashboardData(dashboardQuery?.data?.data.data);
    }
  }, [dashboardQuery?.data?.data.data]);

  const fetchOrders = () => {
    const params = {
      per_page: pageSize,
      paginate: true,
      sort_column: "id",
      sort_direction: "desc",
      page: pageIndex,
    };
    return partnerApiRepository.getPrescriptions(params);
  };

  const ordersQuery = useQuery({ queryKey: ["paymentList", pageSize, pageIndex], queryFn: fetchOrders });

  useEffect(() => {
    if (ordersQuery.isFetched) {
      if (ordersQuery?.data?.status == 200) {
        setOrdersList(ordersQuery?.data?.data?.data?.data || []);
        setTotalCount(ordersQuery.data?.data?.data?.total || 0);
        setShowing({ from: ordersQuery.data?.data?.data?.from || 0, to: ordersQuery.data?.data?.data?.to || 0 });
      }
    }
  }, [ordersQuery.isFetched, ordersQuery.isRefetching, ordersQuery.data]);

  useEffect(() => {
    setTotaPages(Math.ceil(+totalCount / +pageSize));
  }, [pageSize, totalCount]);

  const rows = ordersList.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        {formatDate(item?.created_at, "MM-DD-YYYY")} <br />
        {item?.created_at ? getTimeFromDateString(item?.created_at) : ""}
      </Table.Td>
      <Table.Td>
        {item?.medication?.drug_name} {item?.medication?.drug_strength}
      </Table.Td>
      <Table.Td>{item?.order_id}</Table.Td>
      <Table.Td>
        <Anchor
          underline="always"
          fw={500}
          ms={10}
          onClick={() => {
            setSelectedPrescription(item?.u_id);
            setPrescriptionHandler.open();
          }}
        >
          View
        </Anchor>
      </Table.Td>
      <Table.Td>
        <Anchor
          underline="always"
          fw={500}
          ms={10}
          onClick={() => {
            setSelectedPrescription(item?.u_id);
            setLabReportHandler.open();
          }}
        >
          View
        </Anchor>
      </Table.Td>
      <Table.Td>
        <Anchor
          component="button"
          underline="always"
          fw={500}
          ms={10}
          onClick={() => {
            setSelectedPrescription(item?.u_id);
            setLicenseHandler.open();
          }}
          disabled={!item?.patient?.driving_license_front}
          c={!item?.patient?.driving_license_front ? "gray.5" : "primary.6"}
          style={{ cursor: !item?.patient?.driving_license_front ? "not-allowed" : "pointer" }}
        >
          View
        </Anchor>
      </Table.Td>
      <Table.Td>
        <Anchor
          underline="always"
          fw={500}
          ms={10}
          onClick={() => {
            setSelectedPrescription(item?.u_id);
            setOpenIntakeForm.open();
          }}
        >
          View
        </Anchor>
      </Table.Td>
      <Table.Td>
        <span className={`tags capitalize font-medium  ${getOrderStatusClassName(item?.status || "")}`}>{getOrderStatusName(item?.status || "")}</span>
      </Table.Td>
      {/* <Table.Td>
        <Tooltip
          label="View Details"
          position="top"
        >
          <NavLink
            to={`./${item?.u_id}/details`}
            className="text-sm text-primary font-medium inline-flex"
          >
            <i className="icon-Through text-2xl/none"></i>
          </NavLink>
        </Tooltip>
      </Table.Td> */}
    </Table.Tr>
  ));

  return (
    <div className="dashboard">
      <div className="page-title pb-5">
        <div className="page-title-start">
          <h6 className="lg:h2 md:h3 sm:h4">My Dashboard</h6>
        </div>
      </div>
      <div className="space-y-5">
        <div className="card grid sm:grid-cols-2 gap-5">
          <MatrixCard
            matCard="bg-gradient-to-bl from-blue-light to-blue-medium p-6"
            iconBg="bg-primary md:h-20 md:w-20"
            dmlIcon="icon-prescription md:text-[40px]/none text-2xl/none text-white"
            cardCount={dashboardData?.total_orders ? dashboardData?.total_orders : ""}
            countStyle="pb-14 md:-mt-20 -mt-10"
            cardText="Total Orders"
            textW="!text-xl !font-medium mt-9"
            cardLink="/partner-patient/orders"
            linkText="View Details"
            linkIcon="icon-next_arrow text-xl/none"
          />
          <MatrixCard
            matCard="bg-gradient-to-bl from-green-light to-green-medium p-6"
            iconBg="bg-green-deep md:h-20 md:w-20"
            dmlIcon="icon-total-order md:text-[40px]/none text-2xl/none text-white"
            cardCount={dashboardData?.total_amount ? "$" + parseFloat(dashboardData?.total_amount)?.toLocaleString() : ""}
            countStyle="pb-14 md:-mt-20 -mt-10"
            cardText="Total Amounts"
            textW="!text-xl !font-medium mt-9"
            // cardLink="/partner-patient/orders"
            // linkText="View Details"
            // linkIcon="icon-next_arrow text-xl/none"
          />
        </div>
        <div className="card">
          <div className="card-title flex items-center justify-between">
            <h4>Orders</h4>
            <Link
              to={`/partner-patient/orders`}
              className="heading-xxxs text-primary underline"
            >
              View
            </Link>
          </div>
          <ScrollArea>
            <Table
              verticalSpacing="md"
              withRowBorders={false}
              striped
              stripedColor="background"
              highlightOnHover
              highlightOnHoverColor="primary.0"
              className="dml-list-table"
            >
              <Table.Thead className="border-b border-grey-low">
                <Table.Tr>
                  <Table.Th className="text-nowrap">Order Date</Table.Th>
                  <Table.Th className="text-nowrap">Medication</Table.Th>
                  <Table.Th className="text-nowrap">Order ID</Table.Th>
                  <Table.Th className="text-nowrap">Prescription</Table.Th>
                  <Table.Th className="text-nowrap">Lab Reports</Table.Th>
                  <Table.Th className="text-nowrap">Driving License</Table.Th>
                  <Table.Th className="text-nowrap">Intake Form</Table.Th>
                  <Table.Th className="text-nowrap">Status </Table.Th>
                  {/* <Table.Th>Details </Table.Th> */}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {ordersQuery?.isFetching ? (
                  <TableLoader
                    rows={8}
                    columns={8}
                  />
                ) : rows.length == 0 ? (
                  <NoTableData colSpan={8} />
                ) : (
                  rows
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </div>
      </div>

      <IntakeForm
        openModal={openIntakeForm}
        onModalClose={setOpenIntakeForm.close}
        patientId={selectedPrescription}
      />
      <PrescriptionModal
        patientId={selectedPrescription}
        openModal={openPrescription}
        onModalClose={setPrescriptionHandler.close}
      />
      <LicenseModal
        patientId={selectedPrescription}
        openModal={openLicense}
        onModalClose={setLicenseHandler.close}
      />
      <LabReportModal
        patientId={selectedPrescription}
        openModal={openLabReport}
        onModalClose={setLabReportHandler.close}
      />
    </div>
  );
};

export default DashboardPage;
