import prescriptionApiRepository from "@/common/api/repositories/prescriptionRepository";
import { formatDate } from "@/utils/date.utils";
import { Button, Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

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
    if (patientId) {
      onPatientUiIdChange(patientId);
    }
  }, [patientId, onPatientUiIdChange]);

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
          >
            Print Prescription
          </Button>
          <Button size="sm">Download Prescription</Button>
        </div>
      </div>
      {breadcrumbs}
      <div className="flex gap-6">
        <div className="card w-[calc(100%_-_448px)]">
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
                {["received"].includes(patientData?.status || "") && (
                  <>
                    <Table.Tr>
                      <Table.Th>Send Pharmacy:</Table.Th>
                      <Table.Td>{patientData?.send_pharmacy?.name || "N/A"}</Table.Td>
                    </Table.Tr>
                  </>
                )}

                <Table.Tr>
                  <Table.Th>Quantity:</Table.Th>
                  <Table.Td>{patientData?.details?.qty_ordered || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Quantity Filled:</Table.Th>
                  <Table.Td>{patientData?.details?.qty_filled || "N/A"}</Table.Td>
                </Table.Tr>

                <Table.Tr>
                  <Table.Th>Written Date:</Table.Th>
                  <Table.Td>{formatDate(patientData?.written_date) || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Pharmacy Receive Date:</Table.Th>
                  <Table.Td>{formatDate(patientData?.pharmacy_receive_date) || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Prescriber Sent Date:</Table.Th>
                  <Table.Td>{formatDate(patientData?.prescriber_sent_date) || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Refills Remaining:</Table.Th>
                  <Table.Td>{formatDate(patientData?.details?.refills_remaining) || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Refill Number:</Table.Th>
                  <Table.Td>{patientData?.details?.refill_number || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th className="align-top">Signature:</Table.Th>
                  <Table.Td>{patientData?.details?.signature || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Retail:</Table.Th>
                  <Table.Td>{patientData?.details?.retail || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Billed:</Table.Th>
                  <Table.Td>{patientData?.details?.billed || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Total Paid:</Table.Th>
                  <Table.Td>{patientData?.total_paid || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Margin:</Table.Th>
                  <Table.Td>{patientData?.margin || "N/A"}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
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
                  <Table.Td>{patientData?.doctor?.name || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>DEA:</Table.Th>
                  <Table.Td>{patientData?.doctor?.dea || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>NPI:</Table.Th>
                  <Table.Td>{patientData?.doctor?.npi || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Specialty:</Table.Th>
                  <Table.Td>{patientData?.doctor?.current_position || "N/A"}</Table.Td>
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
                  <Table.Td>{patientData?.patient?.name || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Gender:</Table.Th>
                  <Table.Td className="capitalize">{patientData?.patient?.gender || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Call Phone:</Table.Th>
                  <Table.Td>{patientData?.patient?.cell_phone || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Email:</Table.Th>
                  <Table.Td>{patientData?.patient?.email || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Allergy Info:</Table.Th>
                  <Table.Td>{patientData?.patient?.allergy_information || "N/A"}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
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
                  <Table.Td>{patientData?.medication?.drug_name || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Preferred Pharmacy:</Table.Th>
                  <Table.Td className="font-semibold">{patientData?.medication?.pharmacy?.name || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Drug NDC:</Table.Th>
                  <Table.Td>{patientData?.medication?.drug_ndc || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Drug GPI:</Table.Th>
                  <Table.Td>{patientData?.medication?.drug_gpi || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Drug Strength:</Table.Th>
                  <Table.Td>{patientData?.medication?.drug_strength || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Drug Schedule:</Table.Th>
                  <Table.Td>{patientData?.medication?.drug_schedule || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Drug Generic:</Table.Th>
                  <Table.Td>{patientData?.medication?.drug_is_generic || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Drug Brand Name:</Table.Th>
                  <Table.Td>{patientData?.medication?.drug_brand_name || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Drug Package Size:</Table.Th>
                  <Table.Td>{patientData?.medication?.drug_package_size || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Drug Form:</Table.Th>
                  <Table.Td>{patientData?.medication?.drug_form || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Drug Color:</Table.Th>
                  <Table.Td>{patientData?.medication?.drug_color || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Drug Shape:</Table.Th>
                  <Table.Td>{patientData?.medication?.drug_shape || "N/A"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Drug Front Imprint:</Table.Th>
                  <Table.Td>{patientData?.medication?.drug_front_imprint || "N/A"}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
