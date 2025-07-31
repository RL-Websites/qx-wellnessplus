import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { ICreateUserDto } from "@/common/api/models/interfaces/User.model";
import userRepository from "@/common/api/repositories/userRepository";
import dmlToast from "@/common/configs/toaster.config";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionIcon, Button, Input, Modal, NumberInput, PasswordInput } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { addUserSchema } from "./addUserSchema";

interface ModalProps {
  openModal: boolean;
  onModalClose: () => void;
}

type AddUserSchemaType = yup.InferType<typeof addUserSchema>;

function AddPartnerUsers({ openModal, onModalClose }: ModalProps) {
  // react hook form
  const {
    clearErrors,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(addUserSchema),
    defaultValues: { email: "", password: "" },
  });

  const closeModal = () => {
    onModalClose();
    reset();
  };

  const addUserMutation = useMutation({ mutationFn: (payload: ICreateUserDto) => userRepository.storeClinicUser(payload) });

  const onSubmit = (data: AddUserSchemaType) => {
    // console.log(data);
    const payload = { ...data, module: "customer", userable_type: "customer_standard_user" };
    addUserMutation.mutate(payload, {
      onSuccess: (res) => {
        dmlToast.success({
          title: res?.data?.message,
        });
        reset();
        closeModal();
      },
      onError: (err: any) => {
        const error = err as AxiosError<IServerErrorResponse>;
        if (error?.response?.data?.errors) {
          const errors = error?.response?.data?.errors;
          Object.keys(errors).forEach((key) => {
            dmlToast.error({
              title: errors[key].join(","),
            });
          });
        } else {
          dmlToast.error({
            title: error?.response?.data?.message,
          });
        }
      },
    });
  };

  return (
    <Modal.Root
      opened={openModal}
      onClose={closeModal}
      closeOnClickOutside={false}
      size={"700px"}
      centered
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Add Customer User Account</Modal.Title>
          <ActionIcon
            onClick={closeModal}
            radius="100%"
            bg="dark"
            size="24"
          >
            <i className="icon-cross1 text-xs"></i>
          </ActionIcon>
        </Modal.Header>
        <Modal.Body>
          <form
            className="rounded-md mx-auto flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input.Wrapper
              label="Full Name"
              withAsterisk
              error={errors.first_name?.message ? errors.first_name?.message : false}
            >
              <Input
                {...register("first_name")}
                error={Boolean(errors.first_name?.message)}
              />
            </Input.Wrapper>
            <Input.Wrapper
              label="Email Address"
              error={errors.email?.message ? errors.email?.message : false}
              withAsterisk
            >
              <Input
                {...register("email")}
                error={Boolean(errors.email?.message)}
              />
            </Input.Wrapper>

            <NumberInput
              {...register("phone")}
              onChange={(value) => {
                if (value) {
                  setValue("phone", value?.toString(), { shouldValidate: true });
                }
              }}
              label="Mobile Number"
              withAsterisk
              error={errors.phone?.message ? errors.phone?.message : false}
              max={9999999999}
              min={0}
              hideControls
              clampBehavior="strict"
              allowDecimal={false}
              allowNegative={false}
            />
            <Input.Wrapper
              label="Password"
              required
              error={getErrorMessage(errors?.password)}
            >
              <PasswordInput
                {...register("password")}
                visibilityToggleIcon={({ reveal }) => (reveal ? <i className="icon-view text-2xl leading-none"></i> : <i className="icon-view-off text-2xl leading-none"></i>)}
                classNames={{
                  input: errors?.password?.message ? "!border-1 !border-danger" : "",
                }}
                autoComplete="new-password"
              />
            </Input.Wrapper>
            <Input.Wrapper
              label="Confirm Password"
              required
              error={getErrorMessage(errors?.confirm_password)}
            >
              <PasswordInput
                {...register("confirm_password")}
                visibilityToggleIcon={({ reveal }) => (reveal ? <i className="icon-view text-2xl leading-none"></i> : <i className="icon-view-off text-2xl leading-none"></i>)}
                classNames={{
                  input: errors?.confirm_password?.message ? "!border-1 !border-danger" : "",
                }}
              />
            </Input.Wrapper>

            <Button
              type="submit"
              variant="filled"
              mt={24}
              disabled={addUserMutation.isPending}
              className="dml-modal-btn"
              loading={addUserMutation.isPending}
            >
              Add User
            </Button>
          </form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default AddPartnerUsers;
