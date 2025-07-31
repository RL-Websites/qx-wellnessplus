import { IPrescriptionDetails } from "@/common/api/models/interfaces/Prescription.model";
import prescriptionApiRepository from "@/common/api/repositories/prescriptionRepository";
import { formatDate } from "@/utils/date.utils";
import { Modal, ScrollArea, Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

interface ModalProps {
  openModal: boolean;
  onModalClose: () => void;
  prescriptionId?: number;
  patientId?: any;
  patientData?: IPrescriptionDetails | null;
}

const PrescriptionModal = ({ openModal, onModalClose, prescriptionId, patientId }: ModalProps) => {
  const patientQuery = useQuery({
    queryKey: ["prescriptionDetails", patientId],
    queryFn: () => prescriptionApiRepository.getPrescriptionDetails(patientId || ""),
    enabled: !!patientId && !!openModal,
  });

  const patientData = patientQuery?.data?.data?.data;
  return (
    <Modal.Root
      opened={openModal}
      onClose={onModalClose}
      size="1128px"
      centered
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header className="flex-wrap sm:gap-0 gap-3 border-b border-b-grey-low !pt-3.5 !px-6 !pb-3">
          <Modal.Title>Prescription</Modal.Title>
          <div className="flex items-center gap-3">
            {/* <Button
              h="40px"
              bg="grey.4"
              c="foreground"
              component={Link}
              to={`${import.meta.env.VITE_BASE_URL}/download/intake-form-pdf/${patientData?.id}`}
              target="_blank"
              rightSection={<i className="icon-pdf text-sm leading-3.5"></i>}
            >
              Print
            </Button> */}
            {/* <Button
              h="40px"
              bg="grey.4"
              c="foreground"
              component={Link}
              to={`${import.meta.env.VITE_BASE_URL}/download/intake-form-pdf/${patientData?.id}`}
              target="_blank"
              rightSection={<i className="icon-download-04 text-sm leading-3.5"></i>}
            >
              Download PDF
            </Button> */}
            <i
              className="icon-cross text-2xl leading-6 cursor-pointer"
              onClick={onModalClose}
            ></i>
          </div>
        </Modal.Header>
        <Modal.Body className="!pl-6 !pr-0 !pt-6">
          <ScrollArea.Autosize
            type="always"
            scrollbarSize={6}
            scrollbars="y"
            offsetScrollbars
            classNames={{
              root: "h-[calc(100vh_-_230px)]",
              viewport: "view-port-next-inner pr-6",
            }}
          >
            <div className="flex gap-6">
              <div className="w-[calc(100%_-_600px)]">
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
                        <Table.Th>Source:</Table.Th>
                        <Table.Td>{patientData?.client?.name || "N/A"}</Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </div>
              </div>

              <div className="w-[600px] flex flex-col gap-6">
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
                        <Table.Tr>
                          <Table.Th className="align-top">Drug name:</Table.Th>
                          <Table.Td className="text-nowrap">{patientData?.medication?.drug_name || "N/A"}</Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                          <Table.Th>Drug SKU:</Table.Th>
                          <Table.Td>{patientData?.medication?.drug_gpi || "N/A"}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Th>Drug Strength:</Table.Th>
                          <Table.Td>{patientData?.medication?.drug_strength || "N/A"}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Th>Preferred Pharmacy:</Table.Th>
                          <Table.Td>{patientData?.medication?.pharmacy?.name || "N/A"}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Th>Send Pharmacy:</Table.Th>
                          <Table.Td>{patientData?.send_pharmacy?.name || "N/A"}</Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                          <Table.Th>RX Number:</Table.Th>
                          <Table.Td>{patientData?.dosespot_unique_id || "N/A"}</Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                          <Table.Th>Quantity:</Table.Th>
                          <Table.Td>{patientData?.details?.qty_ordered || "N/A"}</Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                          <Table.Th>Days Supply:</Table.Th>
                          <Table.Td>{patientData?.details?.days_supply || "N/A"}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Th>Refills:</Table.Th>
                          <Table.Td>{patientData?.details?.refill_number || "N/A"}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Th>Allergy Info:</Table.Th>
                          <Table.Td>{patientData?.patient?.allergy_information || "N/A"}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Th>Created Date:</Table.Th>
                          <Table.Td>{formatDate(patientData?.created_at, "DD MMMM, YYYY hh:MM A") || "N/A"}</Table.Td>
                        </Table.Tr>
                      </Table.Tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea.Autosize>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default PrescriptionModal;
