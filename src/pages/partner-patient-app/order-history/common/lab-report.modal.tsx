import { IPrescriptionDetails } from "@/common/api/models/interfaces/Prescription.model";
import prescriptionApiRepository from "@/common/api/repositories/prescriptionRepository";
import { Modal, ScrollArea, Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";

interface ModalProps {
  openModal: boolean;
  onModalClose: () => void;
  patientId?: any;
  patientData?: IPrescriptionDetails | null;
}

const LabReportModal = ({ openModal, onModalClose, patientId }: ModalProps) => {
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
      size="1024px"
      centered
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header className="border-b border-b-grey-low !pt-3.5 !px-6 !pb-3">
          <Modal.Title>Lab Reports</Modal.Title>
          <div className="flex items-center gap-3">
            <i
              className="icon-cross text-2xl leading-6 cursor-pointer"
              onClick={onModalClose}
            ></i>
          </div>
        </Modal.Header>
        <Modal.Body className="!pl-6 !pr-0 !pt-6">
          {patientData?.lab_test_files?.length ? (
            <ScrollArea
              type="always"
              scrollbarSize={6}
              scrollbars="x"
              offsetScrollbars
              classNames={{
                root: "w-full",
                viewport: "view-port-next-inner",
              }}
            >
              <Table
                verticalSpacing="md"
                withRowBorders={false}
                miw={632}
                layout="fixed"
                striped
                stripedColor="background"
                highlightOnHover
                highlightOnHoverColor="primary.0"
                className="dml-list-table"
              >
                <Table.Thead className="border-b border-grey-low">
                  <Table.Tr>
                    <Table.Th>Report Name</Table.Th>
                    <Table.Th>File Type</Table.Th>
                    <Table.Th>Details</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {patientData?.lab_test_files.map((item, index) => (
                    <Table.Tr key={index}>
                      <Table.Td>{item?.lab_test?.name}</Table.Td>
                      <Table.Td>{item?.lab_test?.file}</Table.Td>
                      <Table.Td>
                        <NavLink
                          to={item?.status == "pending" ? "" : `${import.meta.env.VITE_BASE_PATH}/storage/test_files/${item?.uploaded_file}`}
                          target={item?.status == "pending" ? "_self" : "_blank"}
                          className={`text-sm underline font-medium ${item?.status == "pending" ? "text-grey" : "text-primary"}`}
                        >
                          View
                        </NavLink>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          ) : (
            <div className="border border-grey-low rounded px-9 py-[26px] flex justify-center gap-5 mb-6 mt-5">
              <p className="extra-text-medium text-grey-medium">No lab results available at the moment</p>
            </div>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default LabReportModal;
