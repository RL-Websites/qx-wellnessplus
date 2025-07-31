import { IPrescriptionDetails } from "@/common/api/models/interfaces/Prescription.model";
import prescriptionApiRepository from "@/common/api/repositories/prescriptionRepository";
import { Button, Modal, Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ModalProps {
  openModal: boolean;
  onModalClose: () => void;
  prescriptionId?: number;
  patientId?: number;
  patientData?: IPrescriptionDetails | null;
}

function PrescriptionInfo({ openModal, onModalClose, patientId, prescriptionId, patientData }: ModalProps) {
  const [intakeFormParam, setIntakeFormParam] = useState<any>();

  useEffect(() => {
    if (prescriptionId && patientId) {
      setIntakeFormParam({ patientId: patientId, prescriptionId: prescriptionId });
    }
  }, [prescriptionId, patientId]);

  const intakeFormQuery = useQuery({
    queryKey: ["GetIntakeForm", patientId, prescriptionId],
    queryFn: () => prescriptionApiRepository.getIntakeFormData(intakeFormParam),
  });
  const intakeFormData = intakeFormQuery?.data?.data?.data;

  return (
    <>
      <Modal.Root
        opened={openModal}
        onClose={onModalClose}
        size="1128px"
        centered
      >
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header className="border-b border-b-grey-low !pt-3.5 !px-6 !pb-3">
            <Modal.Title>Prescription</Modal.Title>
            <div className="flex items-center gap-3">
              <Button
                h="40px"
                bg="grey.4"
                c="foreground"
                component={Link}
                to={`${import.meta.env.VITE_BASE_URL}/download/intake-form-pdf/${prescriptionId}`}
                target="_blank"
                rightSection={<i className="icon-pdf text-sm leading-3.5"></i>}
              >
                Print
              </Button>
              <Button
                h="40px"
                bg="grey.4"
                c="foreground"
                component={Link}
                to={`${import.meta.env.VITE_BASE_URL}/download/intake-form-pdf/${prescriptionId}`}
                target="_blank"
                rightSection={<i className="icon-download-04 text-sm leading-3.5"></i>}
              >
                Download PDF
              </Button>
              <i
                className="icon-cross text-2xl leading-6 cursor-pointer"
                onClick={onModalClose}
              ></i>
            </div>
          </Modal.Header>
          <Modal.Body className="!pl-6 !pr-0 !pt-6">
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
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}

export default PrescriptionInfo;
