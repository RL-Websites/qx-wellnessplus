import useAuthToken from "@/common/hooks/useAuthToken";
import { Button, Flex, Modal, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const SessionExpire = ({ openModal, closeModal }) => {
  const { removeCurrentUser } = useAuthToken();
  const navigate = useNavigate();
  const logout = () => {
    removeCurrentUser();
    closeModal("logout");
    navigate("/login");
  };
  return (
    <Modal.Root
      opened={openModal}
      onClose={() => closeModal("reset")}
      closeOnClickOutside={false}
      closeOnEscape={false}
      centered
      size="540px"
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <div className=""></div>
        </Modal.Header>
        <Modal.Body className="!pb-[22px]">
          <Flex
            direction={"column"}
            align={"center"}
            className="max-w-[380px]"
            mx="auto"
          >
            <i className="icon-approve-doctor1 text-[43px] mb-5"></i>
            <Title className="h6 text-foreground mb-3">Session expired!</Title>
            <Text className="text-grey font-medium text-base/snug text-center">Due to inactivity, your session has expired.</Text>
          </Flex>
          <Flex
            align="center"
            gap="sm"
            justify="center"
            mt={23}
          >
            <Button
              className="w-[160px]"
              onClick={logout}
            >
              Okay
            </Button>
          </Flex>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default SessionExpire;
