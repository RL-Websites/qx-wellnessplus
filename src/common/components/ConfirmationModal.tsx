import { Button, Flex, Modal, Text, Title } from "@mantine/core";

interface IConfirmationModalProps {
  openModal: boolean;
  onModalClose: (closeReason: boolean) => void;
  onModalPressOk: () => void;
  title?: string;
  subTitle?: (string | undefined)[];
  message?: string | React.ReactNode; // ✅ Allows both string & JSX
  dmlIcon?: string;
  okBtnText?: string;
  cancelBtnText?: string;
  okBtnLoading?: boolean;
}

function ConfirmationModal(modalProps: IConfirmationModalProps) {
  return (
    <Modal.Root
      opened={modalProps.openModal}
      onClose={() => modalProps.onModalClose(false)}
      closeOnClickOutside={false}
      centered
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body py={"lg"}>
          <Flex
            direction="column"
            align="center"
          >
            {modalProps.dmlIcon && <i className={`${modalProps.dmlIcon} mb-5`}></i>}
            {modalProps.title && <Title className="h6 text-foreground mb-3">{modalProps.title}</Title>}
            {modalProps?.subTitle?.length && modalProps?.subTitle?.length > 0
              ? modalProps?.subTitle?.map((service, index) => (
                  <div key={index}>
                    <span className="break-all heading-xxs text-foreground pb-6">{service}</span>
                    {modalProps?.subTitle?.length && modalProps?.subTitle?.length - 1 == index ? "" : ","}
                  </div>
                ))
              : ""}
            {modalProps.message && (
              <Text
                c="foreground"
                className="text-center"
              >
                {typeof modalProps.message === "string" ? <span dangerouslySetInnerHTML={{ __html: modalProps.message }} /> : modalProps.message}
              </Text>
            )}
          </Flex>

          <div className="grid grid-cols-2 gap-2.5 mt-6">
            <Button
              bg="grey.4"
              c="foreground"
              className="w-full"
              classNames={{
                label: "sm:text-base text-sm",
              }}
              onClick={() => modalProps.onModalClose(false)}
            >
              {modalProps.cancelBtnText || "Cancel"}
            </Button>
            <Button
              className="w-full"
              classNames={{
                label: "sm:text-base text-sm",
              }}
              onClick={modalProps.onModalPressOk}
              loading={modalProps.okBtnLoading}
            >
              {modalProps.okBtnText || "Ok"}
            </Button>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default ConfirmationModal;
