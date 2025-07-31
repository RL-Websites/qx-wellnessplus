import { IChangePasswordPayload } from "@/common/api/models/interfaces/Auth.model";
import authApiRepository from "@/common/api/repositories/authRepository";
import dmlToast from "@/common/configs/toaster.config";
import useAuthToken from "@/common/hooks/useAuthToken";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionIcon, Button, Input, Modal, PasswordInput } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

interface ModalProps {
  openModal: boolean;
  onModalClose: () => void;
}
const changePasswordSchema = yup.object({
  oldPassword: yup.string().required("Old password is required").label("Old password"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must have at least 8 characters")
    .matches(/^(?=.*\d).*$/, "Password must contain at least one numerical value")
    .matches(/^((?=.*[a-z]){1}).*$/, "Password must contain at least one lower case alphabetical character")
    .matches(/^((?=.*[A-Z]){1}).*$/, "Password must contain at least one upper case alphabetical character")
    .matches(/^(?=.*[!@#$%^&()\-+=\{\};:,<.>]).*$/, "Password must contain at least one special character")
    .label("New password"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});
type ChangePasswordSchemaType = yup.InferType<typeof changePasswordSchema>;

const ChangePasswordModal = ({ openModal, onModalClose }: ModalProps) => {
  const { removeAccessToken, removeCurrentUser, removeAuthAccessCode } = useAuthToken();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    mode: "onChange",
  });

  const ChangePasswordMutation = useMutation({
    mutationFn: (payload: IChangePasswordPayload) => {
      return authApiRepository.changePassword(payload);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApiRepository.logout(),
  });

  const navigate = useNavigate();

  const onSubmit = (data: ChangePasswordSchemaType) => {
    const payload: IChangePasswordPayload = {
      current_password: data.oldPassword,
      new_password: data.newPassword,
      new_password_confirmation: data.confirmPassword,
    };
    ChangePasswordMutation.mutate(payload, {
      onSuccess: () => {
        dmlToast.success({
          title: "The password has been changed successfully",
        });
        logoutMutation.mutate();
        removeAccessToken();
        removeCurrentUser();
        removeAuthAccessCode();
        localStorage.removeItem("otpExpired");
        localStorage.removeItem("email");
        navigate("/login");
        closeModal();
      },
      onError: (error: any) => {
        console.log(error);
        dmlToast.error({
          title: error?.response?.data?.message,
        });
      },
    });
  };

  const closeModal = () => {
    clearErrors();
    reset();
    onModalClose();
  };

  return (
    <Modal.Root
      opened={openModal}
      onClose={closeModal}
      size="md"
      centered
      closeOnClickOutside={false}
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Change Password</Modal.Title>
          <ActionIcon
            onClick={closeModal}
            radius="100%"
            bg="dark"
            size="22"
          >
            <i className="icon-cross1 text-xs"></i>
          </ActionIcon>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Input.Wrapper
              label="Old password"
              required
              error={errors.oldPassword?.message ? errors.oldPassword?.message : false}
            >
              <PasswordInput
                {...register("oldPassword")}
                visibilityToggleIcon={({ reveal }) =>
                  reveal ? <i className="icon-view text-2xl text-foreground"></i> : <i className="icon-view-off text-2xl text-foreground"></i>
                }
              />
            </Input.Wrapper>
            <Input.Wrapper
              label="New password"
              required
              error={errors.newPassword?.message ? errors.newPassword?.message : false}
            >
              <PasswordInput
                {...register("newPassword")}
                visibilityToggleIcon={({ reveal }) =>
                  reveal ? <i className="icon-view text-2xl text-foreground"></i> : <i className="icon-view-off text-2xl text-foreground"></i>
                }
              />
            </Input.Wrapper>
            <Input.Wrapper
              label="Confirm password"
              required
              error={errors.confirmPassword?.message ? errors.confirmPassword?.message : false}
            >
              <PasswordInput
                {...register("confirmPassword")}
                visibilityToggleIcon={({ reveal }) =>
                  reveal ? <i className="icon-view text-2xl text-foreground"></i> : <i className="icon-view-off text-2xl text-foreground"></i>
                }
              />
            </Input.Wrapper>
            <Button
              type="submit"
              loading={ChangePasswordMutation.isPending}
              className="dml-modal-btn"
              mt="xs"
            >
              Reset Password
            </Button>
          </form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default ChangePasswordModal;
