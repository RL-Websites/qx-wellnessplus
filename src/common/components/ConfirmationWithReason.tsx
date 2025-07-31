import { ActionIcon, Button, Flex, Modal, Textarea } from "@mantine/core";
import { useEffect, useState } from "react";

interface ModalProps {
  openModal: boolean;
  onModalClose: (closeReason: boolean | string) => void;
  icon?: React.ReactElement<any>;
  title?: string;
  confirmBtnText?: string;
  cancelBtnText?: string;
  isReasonRequired?: boolean;
  signature?: string;
}

const ConfirmationWithReason = ({
  openModal,
  onModalClose,
  icon = <i className="icon-approve-doctor1 text-5xl leading-none mb-3"></i>,
  title = "Are you sure you want to remove? Please specify the reason below.",
  confirmBtnText = "Remove",
  cancelBtnText = "Cancel",
  isReasonRequired = false,
  signature = "",
}: ModalProps) => {
  const [reasonText, setReasonText] = useState("");
  const [error, setError] = useState("");

  const closeModal = (reason) => {
    if (isReasonRequired) {
      if (reasonText.trim() === "") {
        setError("Please provide a note");
        return;
      } else {
        onModalClose(reason);
        if (reasonText) {
          setReasonText("");
        }
      }
    } else {
      onModalClose(reason);
      if (reasonText) {
        setReasonText("");
      }
    }
  };

  const dismissModal = () => {
    setReasonText("");
    setError("");
    onModalClose(false);
  };

  useEffect(() => {
    return () => setError("");
  }, []);

  return (
    <Modal.Root
      opened={openModal}
      onClose={dismissModal}
      closeOnClickOutside={false}
      centered
      size={540}
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body py="lg">
          <Flex className="mb-[5px]">
            <ActionIcon
              onClick={dismissModal}
              radius="100%"
              bg="dark"
              size="20"
              ms="auto"
            >
              <i className="icon-cross1 text-[10px]"></i>
            </ActionIcon>
          </Flex>
          <div className="text-center flex flex-col mb-4">
            {icon}
            <label className="text-foreground extra-form-text-medium">{title}</label>
          </div>
          <Textarea
            value={reasonText}
            onChange={(event) => setReasonText(event.currentTarget.value)}
            styles={{
              input: { height: "100px" },
            }}
          />
          {error && <p className="text-danger text-sm">{error}</p>}
          {signature ? (
            <>
              <p className="font-semibold text-foreground mt-4">Digital Signature: </p>
              <div className="text-center border border-grey-low mt-3">
                <img
                  src={import.meta.env.VITE_BASE_PATH + `${signature}`}
                  alt="signature"
                />
              </div>
            </>
          ) : (
            ""
          )}

          <Flex
            justify="space-evenly"
            gap={10}
            mt={"md"}
          >
            <Button
              size="md"
              bg="grey.4"
              c={"foreground"}
              type="button"
              w={"100%"}
              onClick={dismissModal}
            >
              {cancelBtnText}
            </Button>
            <Button
              size="md"
              bg={"foreground"}
              type="button"
              w={"100%"}
              onClick={() => closeModal(reasonText)}
            >
              {confirmBtnText}
            </Button>
          </Flex>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default ConfirmationWithReason;
