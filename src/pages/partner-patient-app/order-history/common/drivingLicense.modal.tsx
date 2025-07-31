import { IPrescriptionDetails } from "@/common/api/models/interfaces/Prescription.model";
import prescriptionApiRepository from "@/common/api/repositories/prescriptionRepository";
import { Image, Modal } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

interface ModalProps {
  openModal: boolean;
  onModalClose: () => void;
  patientId?: any;
  patientData?: IPrescriptionDetails | null;
}

const LicenseModal = ({ openModal, onModalClose, patientId }: ModalProps) => {
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
          <Modal.Title>Driving License</Modal.Title>
          <div className="flex items-center gap-3">
            <i
              className="icon-cross text-2xl leading-6 cursor-pointer"
              onClick={onModalClose}
            ></i>
          </div>
        </Modal.Header>
        <Modal.Body className="!pt-6">
          {patientData?.patient?.driving_license_front || patientData?.patient?.driving_license_back ? (
            <div className="grid grid-cols-2 gap-5">
              <div>
                <p className="text-fs-md text-foreground">Front</p>
                {patientData?.patient?.driving_license_front ? (
                  <Image
                    src={`${import.meta.env.VITE_BASE_PATH}/storage/${patientData?.patient?.driving_license_front}`}
                    alt="Front Side"
                    className="size-full rounded-md object-scale-down"
                  />
                ) : (
                  <div className="flex items-center justify-center h-[300px] border rounded-md text-foreground text-xl font-medium">No front image uploaded</div>
                )}
              </div>
              <div>
                <p className="text-fs-md text-foreground">Back</p>
                {patientData?.patient?.driving_license_back ? (
                  <Image
                    src={`${import.meta.env.VITE_BASE_PATH}/storage/${patientData?.patient?.driving_license_back}`}
                    alt="Back Side"
                    className="size-full rounded-md object-scale-down"
                  />
                ) : (
                  <div className="flex items-center justify-center h-[300px] border rounded-md text-foreground text-xl font-medium">No back image uploaded</div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 italic">No driving license uploaded.</div>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default LicenseModal;
