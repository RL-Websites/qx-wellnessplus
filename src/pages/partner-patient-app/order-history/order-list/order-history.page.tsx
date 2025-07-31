import { patientRequestList } from "@/common/api/models/interfaces/Prescription.model";
import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import { IShowing } from "@/common/components/CustomFilter";
import NoTableData from "@/common/components/NoTableData";
import TableLoader from "@/common/components/TableLoader";
import { formatDate } from "@/utils/date.utils";
import { getOrderStatusClassName, getOrderStatusName } from "@/utils/status.utils";
import { getTimeFromDateString } from "@/utils/time.utils";
import { Anchor, Paper, ScrollArea, Table, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import LicenseModal from "../common/drivingLicense.modal";
import IntakeForm from "../common/intake-form.modal";
import LabReportModal from "../common/lab-report.modal";
import PrescriptionModal from "../common/prescription.modal";

export default function OrderHistoryPage() {
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
      <Table.Td>
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
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <div className="table-title md:flex-row flex-col md:items-center items-start">
        <div className="table-title-inner">
          <h6 className="lg:h2 md:h3 sm:h4">Order History</h6>
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
                <Table.Th className="text-nowrap">Action </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {ordersQuery?.isFetching ? (
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
      <div className="flex justify-end  mt-5 mb-2 me-6">
        {/* <PaginationFilter
          pageSize={pageSize}
          currentPage={pageIndex}
          totalCount={totalCount}
          showing={showing}
        /> */}
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
    </>
  );
}
