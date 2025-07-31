import { IPartnerMedicineListItem } from "@/common/api/models/interfaces/Medication.model";
import { IPartnerOnlyPatientInviteDTO } from "@/common/api/models/interfaces/PartnerPatient.model";
import { ActionIcon, Button, Modal, Table } from "@mantine/core";

interface IConfirmationModalProps {
  openModal: boolean;
  onModalClose: (closeReason: boolean) => void;
  onModalPressYes: () => void;
  onModalPressNo: () => void;
  okBtnLoading: boolean;
  medicationInfo?: IPartnerMedicineListItem[];
  patientInfo: IPartnerOnlyPatientInviteDTO;
}

function ConfirmProductOrderModal(modalProps: IConfirmationModalProps) {
  return (
    <Modal.Root
      opened={modalProps.openModal}
      onClose={() => modalProps.onModalClose(false)}
      closeOnClickOutside={false}
      centered
      classNames={{
        content: "md:min-w-[540px]",
      }}
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Medication Confirmation</Modal.Title>
          <ActionIcon
            onClick={() => modalProps.onModalClose(false)}
            radius="100%"
            bg="dark"
            size="24"
          >
            <i className="icon-cross1 text-xs"></i>
          </ActionIcon>
        </Modal.Header>
        <Modal.Body className="pt-0 pb-lg">
          <Table
            className="-mx-2 border-t-0 border-x-0 border-b-2 border-dashed border-grey-low"
            withRowBorders={false}
          >
            <Table.Tbody>
              <Table.Tr>
                <Table.Td className="text-lg w-[220px]">Patient Name:</Table.Td>
                <Table.Td className="text-lg text-foreground">
                  {modalProps.patientInfo?.first_name} {modalProps.patientInfo?.last_name}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          {modalProps?.medicationInfo?.map((medicine) => (
            <Table
              className="-mx-2 border-t-0 border-x-0 border-b-2 border-dashed border-grey-low"
              withRowBorders={false}
              key={medicine.id}
            >
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td className="text-lg w-[220px]">Medication Name:</Table.Td>
                  <Table.Td className="text-lg text-foreground">{medicine?.medicine?.name}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td className="text-lg w-[220px]">Dosage:</Table.Td>
                  <Table.Td className="text-lg text-foreground">{medicine?.medicine?.strength}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td className="text-lg w-[220px]">Price:</Table.Td>
                  <Table.Td className="text-lg text-foreground">${medicine?.price}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          ))}

          <div className="bg-tag-bg py-5 px-6 rounded-xl mt-7 space-y-4">
            <h6 className="text-tag-bg-deep">Is the patient currently on-site?</h6>
            <p className="text-fs-md text-tag-bg-deep">Onsite: Please hand over your device (tablet/laptop) so the client can complete the intake form now.</p>
            <p className="text-fs-md text-tag-bg-deep">Offsite: The intake form will be emailed to the client, and they can fill it out at their convenience.</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-6">
            <Button
              className="w-full"
              classNames={{
                label: "sm:text-base text-sm",
              }}
              onClick={() => modalProps.onModalPressYes()}
              disabled={modalProps.okBtnLoading}
            >
              Yes
            </Button>
            <Button
              className="w-full"
              classNames={{
                label: "sm:text-base text-sm",
              }}
              onClick={modalProps.onModalPressNo}
              disabled={modalProps.okBtnLoading}
            >
              No, send link
            </Button>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default ConfirmProductOrderModal;
