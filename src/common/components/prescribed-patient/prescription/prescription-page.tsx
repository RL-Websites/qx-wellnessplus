import prescriptionApiRepository from "@/common/api/repositories/prescriptionRepository";
import { Button, Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

interface IBreadcrumb {
  breadcrumbs?: React.ReactNode;
  onPatientUiIdChange: (uid: string) => void;
}

export const PrescriptionPage = ({ breadcrumbs, onPatientUiIdChange }: IBreadcrumb) => {
  const { id: patientId } = useParams();

  const patientQuery = useQuery({
    queryKey: ["prescriptionDetails", patientId],
    queryFn: () => prescriptionApiRepository.getPrescriptionDetails(patientId || ""),
  });

  const patientData = patientQuery?.data?.data?.data;

  useEffect(() => {
    if (patientData?.u_id) {
      onPatientUiIdChange(patientData?.u_id);
    }
  }, [patientData?.u_id, onPatientUiIdChange]);

  return (
    <div className="prescription-page">
      <div className="page-title">
        <div className="page-title-start">
          <h2 className="text-grey-medium">View Prescription</h2>
        </div>
        <div className="page-title-end">
          <Button
            bg="grey.4"
            size="sm"
            c="foreground"
            component={Link}
            to={`${import.meta.env.VITE_BASE_URL}/download/prescription/${patientData?.id}`}
            target="_blank"
          >
            Print Prescription
          </Button>
          <Button
            size="sm"
            component={Link}
            to={`${import.meta.env.VITE_BASE_URL}/download/prescription/${patientData?.id}`}
            target="_blank"
          >
            Download Prescription
          </Button>
        </div>
      </div>
      {breadcrumbs}
      <div className="flex gap-6">
        <div className="w-[calc(100%_-_448px)]">
          <div className="card">
            <div className="card-title">
              <h6>Medication Details:</h6>
            </div>
            <Table
              withRowBorders={false}
              className="info-table info-table-sm"
              classNames={{
                th: "!w-[127px]",
              }}
            >
              <Table.Tbody>
                <Table.Tr>
                  <Table.Th className="align-top">Drug name:</Table.Th>
                  <Table.Td>{patientData?.medication_name || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Drug Strength:</Table.Th>
                  <Table.Td>{patientData?.medication_strength || "N/A"}</Table.Td>
                </Table.Tr>

                <Table.Tr>
                  <Table.Th>Preferred Pharmacy:</Table.Th>
                  <Table.Td className="font-semibold">{patientData?.prescription?.pharmacy?.name || "N/A"}</Table.Td>
                </Table.Tr>

                <Table.Tr>
                  <Table.Th>Drug SKU:</Table.Th>
                  <Table.Td>{patientData?.medication?.sku || "N/A"}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
          <div className="card mt-8">
            <div className="card-title">
              <h6>Prescription Details:</h6>
              <Table
                withRowBorders={false}
                className="info-table info-table-sm"
                classNames={{
                  th: "!w-[246px]",
                }}
              >
                <Table.Tbody>
                  {["received"].includes(patientData?.prescription?.status || "") && (
                    <>
                      <Table.Tr>
                        <Table.Th>Send Pharmacy:</Table.Th>
                        <Table.Td>{patientData?.prescription?.send_pharmacy?.name || "N/A"}</Table.Td>
                      </Table.Tr>
                    </>
                  )}
                  <Table.Tr>
                    <Table.Th>RX Number:</Table.Th>
                    <Table.Td>{patientData?.rx_number || "N/A"}</Table.Td>
                  </Table.Tr>

                  {/* <Table.Tr>
                    <Table.Th>Quantity:</Table.Th>
                    <Table.Td>{patientData?..qty_ordered || "N/A"}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Quantity Filled:</Table.Th>
                    <Table.Td>{patientData?.details?.qty_filled || "N/A"}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Days Supply:</Table.Th>
                    <Table.Td>{patientData?.details?.days_supply || "N/A"}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Refills Authorized:</Table.Th>
                    <Table.Td>{patientData?.details?.refills_authorized || "N/A"}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Refills Remaining:</Table.Th>
                    <Table.Td>{patientData?.details?.refills_remaining || "N/A"}</Table.Td>
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Th>RX Remark:</Table.Th>
                    <Table.Td>{patientData?.details?.rx_remark || "N/A"}</Table.Td>
                  </Table.Tr> */}
                  {/* <Table.Tr>
                    <Table.Th>Written Date:</Table.Th>
                    <Table.Td>{formatDate(patientData?.written_date) || "N/A"}</Table.Td>
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Th>Refills Remaining:</Table.Th>
                    <Table.Td>{formatDate(patientData?.details?.refills_remaining) || "N/A"}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Refill Number:</Table.Th>
                    <Table.Td>{patientData?.details?.refill_number || "N/A"}</Table.Td>
                  </Table.Tr> */}
                </Table.Tbody>
              </Table>
            </div>
          </div>
        </div>

        <div className="w-[424px] flex flex-col gap-6">
          <div className="card">
            <div className="card-title">
              <h6>Prescriber Details:</h6>
            </div>
            <Table
              withRowBorders={false}
              className="info-table info-table-sm"
              classNames={{
                th: "!w-[127px]",
              }}
            >
              <Table.Tbody>
                <Table.Tr>
                  <Table.Th>Name:</Table.Th>
                  <Table.Td>{patientData?.doctor_name || "N/A"}</Table.Td>
                </Table.Tr>

                <Table.Tr>
                  <Table.Th>NPI:</Table.Th>
                  <Table.Td>{patientData?.doctor_npi || "N/A"}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
          <div className="card">
            <div className="card-title">
              <h6>Patient Details:</h6>
            </div>
            <Table
              withRowBorders={false}
              className="info-table info-table-sm"
              classNames={{
                th: "!w-[127px]",
              }}
            >
              <Table.Tbody>
                <Table.Tr>
                  <Table.Th className="align-top">Name:</Table.Th>
                  <Table.Td>{patientData?.prescription?.patient?.name || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Gender:</Table.Th>
                  <Table.Td className="capitalize">{patientData?.prescription?.patient?.gender || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Call Phone:</Table.Th>
                  <Table.Td>{patientData?.prescription?.patient?.cell_phone || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Email:</Table.Th>
                  <Table.Td>{patientData?.prescription?.patient?.email || "N/A"}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
