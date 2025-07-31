import prescriptionApiRepository from "@/common/api/repositories/prescriptionRepository";
import DynamicBreadcrumbs from "@/common/components/Breadcrumbs";
import StepBar from "@/common/components/stepbar";
import { Anchor, Button, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import LicenseModal from "../common/drivingLicense.modal";
import IntakeForm from "../common/intake-form.modal";
import LabReportModal from "../common/lab-report.modal";
import PrescriptionModal from "../common/prescription.modal";
const DetailsPage = () => {
  const [openPrescription, setPrescriptionHandler] = useDisclosure();
  const [openLicense, setLicenseHandler] = useDisclosure();
  const [openLabReport, setLabReportHandler] = useDisclosure();
  const [openIntakeForm, setOpenIntakeForm] = useDisclosure();
  const items = [
    { title: "Order History", href: "/partner-patient/orders" },
    { title: "Order Details", href: "" },
  ];
  const { id: patientId } = useParams();

  const patientQuery = useQuery({
    queryKey: ["patientDetails", patientId],
    queryFn: () => prescriptionApiRepository.getPrescriptionDetails(patientId || ""),
  });
  const patientData = patientQuery?.data?.data?.data;

  return (
    <div className="dashboard">
      <div className="flex justify-between items-center">
        <h2>
          Order Id <span className="font-normal">#{patientData?.prescription?.order_id}</span>
        </h2>
        <Button>Request Refill</Button>
      </div>
      <DynamicBreadcrumbs
        items={items}
        separatorMargin="1"
      />
      <div className="space-y-5">
        <div className="card ">
          <h4 className="text-foreground font-uber heading-xs md:heading-md ">Shipment Status</h4>

          <div className="mt-6">
            <div className="flex gap-8">
              <p className="text-foreground">
                <span className="font-bold">Medication:</span> {patientData?.medication?.name} {patientData?.medication?.strength}
                {patientData?.medication?.unit}
              </p>
              <p className="text-foreground">
                <span className="font-bold">Order Date:</span> {dayjs(patientData?.created_at).format("DD MMMM, YYYY")}
              </p>

              <p className="text-foreground">
                <span className="font-bold">Order ID:</span> #{patientData?.prescription?.order_id}
              </p>
            </div>
          </div>
          <StepBar />
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="card p-0">
            <div className="card-title with-border p-5">
              <h4 className="text-foreground font-uber heading-xs md:heading-md ">Medication Information</h4>
            </div>

            <div className="p-5">
              <Table
                withRowBorders={false}
                className="-ml-2.5 info-table info-table-md"
              >
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Th className="!font-bold !text-foreground">Name:</Table.Th>
                    <Table.Td>{patientData?.medication?.name}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th className="!font-bold !text-foreground">Product SKU:</Table.Th>
                    <Table.Td>{patientData?.medication?.sku}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th className="!font-bold !text-foreground">Dose:</Table.Th>
                    <Table.Td>
                      {patientData?.medication?.strength}
                      {patientData?.medication?.unit}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th className="!font-bold !text-foreground">Pharmacy Cost</Table.Th>
                    <Table.Td>{patientData?.medication?.price ? <span>$ {patientData.medication.price}</span> : "$ 0"}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th className="!font-bold !text-foreground">Doctor Fee:</Table.Th>
                    <Table.Td>{patientData?.medication?.doctor_fee ? <span>$ {patientData?.medication?.doctor_fee}</span> : "$ 0"}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th className="!font-bold !text-foreground">Service Fee:</Table.Th>
                    <Table.Td>{patientData?.medication?.service_fee ? <span>$ {patientData?.medication?.service_fee}</span> : "$ 0"}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th className="!font-bold !text-foreground">Shipping Fee:</Table.Th>
                    <Table.Td>{patientData?.medication?.shipping_fee ? <span>$ {patientData?.medication?.shipping_fee}</span> : "$ 0"}</Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </div>
          </div>
          <div className="card p-0 ">
            <div className="card-title p-5 with-border">
              <h4 className="text-foreground font-uber heading-xs md:heading-md ">Document Information</h4>
            </div>
            <div className="p-5">
              <Table
                withRowBorders={false}
                className="-ml-2.5 info-table info-table-md"
              >
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Th className="!font-bold !text-foreground">Prescription:</Table.Th>
                    <Table.Td>
                      <Anchor
                        underline="always"
                        fw={500}
                        ms={10}
                        onClick={() => {
                          setPrescriptionHandler.open();
                        }}
                      >
                        View
                      </Anchor>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th className="!font-bold !text-foreground">Lab Reports:</Table.Th>
                    <Table.Td>
                      <Anchor
                        underline="always"
                        fw={500}
                        ms={10}
                        onClick={() => {
                          setLabReportHandler.open();
                        }}
                      >
                        View
                      </Anchor>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th className="!font-bold !text-foreground">Driving License:</Table.Th>
                    <Table.Td>
                      <Anchor
                        component="button"
                        underline="always"
                        fw={500}
                        ms={10}
                        onClick={() => {
                          setLicenseHandler.open();
                        }}
                        disabled={!patientData?.prescription?.patient?.driving_license_front}
                        c={!patientData?.prescription?.patient?.driving_license_front ? "gray.5" : "primary.6"}
                        style={{ cursor: !patientData?.prescription?.patient?.driving_license_front ? "not-allowed" : "pointer" }}
                      >
                        View
                      </Anchor>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th className="!font-bold !text-foreground">Intake Form:</Table.Th>
                    <Table.Td>
                      <Anchor
                        underline="always"
                        fw={500}
                        ms={10}
                        onClick={() => {
                          setOpenIntakeForm.open();
                        }}
                      >
                        View
                      </Anchor>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <IntakeForm
        openModal={openIntakeForm}
        onModalClose={setOpenIntakeForm.close}
        patientId={Number(patientId)}
      />
      <PrescriptionModal
        patientId={patientId}
        openModal={openPrescription}
        onModalClose={setPrescriptionHandler.close}
      />
      <LicenseModal
        patientId={patientId}
        openModal={openLicense}
        onModalClose={setLicenseHandler.close}
      />
      <LabReportModal
        patientId={patientId}
        openModal={openLabReport}
        onModalClose={setLabReportHandler.close}
      />
    </div>
  );
};

export default DetailsPage;
