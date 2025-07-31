import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import addClientApiRepository from "@/common/api/repositories/clientRepositoiry";
import ProfileImageCropper from "@/common/components/ProfileImageCropper";
import dmlToast from "@/common/configs/toaster.config";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionIcon, Avatar, Button, Input, Modal, NumberInput, ScrollArea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface ModalProps {
  openModal: boolean;
  onModalClose: (reason) => void;
}

const inviteClientFormSchema = yup.object({
  name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Client name"),
  email: yup
    .string()
    .email("Please provide a valid email address")
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Please provide a valid email address")
    .required(({ label }) => `${label} is required`)
    .label("Email"),
  phone: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .length(10, "Number must be 10 digits")
    .label("Number"),
  fax: yup.string().test("fax-length", "Fax number must be exactly 10 digits long", (value) => !value || value.length === 10),
  logo: yup.mixed().nullable(),
});

type inviteClientFormType = yup.InferType<typeof inviteClientFormSchema>;

const InviteClient = ({ openModal, onModalClose }: ModalProps) => {
  const [phone, setPhone] = useState<any>(null);
  const [fax, setFax] = useState<any>(null);
  const [logo, setLogo] = useState<string>("");
  const [openImageCropper, ImageCropperModalHandler] = useDisclosure();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    reset,
    watch,
  } = useForm<inviteClientFormType>({
    resolver: yupResolver(inviteClientFormSchema),
  });

  const closeModal = (reason) => {
    onModalClose(reason);
    reset();
  };

  const inviteClientMutation = useMutation({
    mutationFn: (payload: any) => addClientApiRepository.inviteClient(payload),
  });

  const onInviteFormSubmit = (data: inviteClientFormType) => {
    const payload: any = {
      ...data,
      email: data.email.toLowerCase(),
    };

    inviteClientMutation.mutate(payload, {
      onSuccess: () => {
        dmlToast.success({
          title: "Invitation has been sent to the client successfully.",
        });
        reset();
        setPhone("");
        setFax("");
        closeModal("success");
      },
      onError: (err: any) => {
        const error = err as AxiosError<IServerErrorResponse>;
        console.log(error);
        dmlToast.error({
          title: error?.response?.data?.message,
        });
      },
    });
  };

  const onCropped = (form: string | ArrayBuffer | null | File) => {
    console.log(form);
    if (form) {
      ImageCropperModalHandler.close();
      // logoMutation
      setValue("logo", form);
      const logoBase64 = form as string;
      setLogo(logoBase64);
    }
  };

  const watchedLogo = watch("logo");

  return (
    <Modal.Root
      centered
      size="1237px"
      opened={openModal}
      onClose={() => closeModal("dismiss")}
      closeOnClickOutside={false}
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Basic Info</Modal.Title>
          <ActionIcon
            onClick={() => closeModal("dismiss")}
            variant="transparent"
            size={24}
            color="foreground"
          >
            <i className="icon-cross text-2xl/none"></i>
          </ActionIcon>
        </Modal.Header>
        <Modal.Body>
          <form
            action=""
            className="grid sm:grid-cols-2 gap-6"
            onSubmit={handleSubmit(onInviteFormSubmit)}
          >
            <Input.Wrapper
              withAsterisk
              label="Client Name"
              className="sm:col-span-1 col-span-2"
              error={getErrorMessage(errors?.name)}
            >
              <Input
                type="text"
                {...register("name")}
                error={Boolean(errors?.name?.message)}
              />
            </Input.Wrapper>
            <Input.Wrapper
              withAsterisk
              label="Email Address"
              className="sm:col-span-1 col-span-2"
              error={getErrorMessage(errors?.email)}
            >
              <Input
                type="email"
                {...register("email")}
                error={Boolean(errors?.email?.message)}
              />
            </Input.Wrapper>
            <NumberInput
              withAsterisk
              label="Phone Number"
              hideControls
              value={phone}
              {...register("phone")}
              min={0}
              max={9999999999}
              clampBehavior="strict"
              error={getErrorMessage(errors?.phone)}
              onChange={(value) => {
                setPhone(value.toString());
                setValue("phone", value.toString());
                if (value) {
                  clearErrors("phone");
                }
              }}
              className="sm:col-span-1 col-span-2"
            />
            <NumberInput
              {...register("fax")}
              onChange={(value) => {
                if (value) {
                  setValue("fax", value?.toString());
                  clearErrors("fax");
                }
                setFax(value);
              }}
              value={fax}
              label="Fax Number"
              error={getErrorMessage(errors.fax)}
              max={9999999999}
              min={0}
              hideControls
              clampBehavior="strict"
              className="sm:col-span-1 col-span-2"
            />
            <div className="col-span-2">
              <h6 className="extra-form-text-medium text-foreground font-uberText border-b border-b-grey-low mb-6 pb-2">Client Logo</h6>
              <Avatar
                src={logo ? (watchedLogo as string) : ""}
                size={208}
                radius={10}
                className="user-avatar"
                onClick={ImageCropperModalHandler.open}
              >
                <img
                  src="/images/clinic-logo-blank.jpg"
                  alt=""
                />
              </Avatar>
              <ProfileImageCropper
                openModal={openImageCropper}
                onModalClose={ImageCropperModalHandler.close}
                src={`${import.meta.env.VITE_BASE_PATH}/storage/images/clinic-profile.png}`}
                cropped={onCropped}
                modalTitle={true}
                itemName="Client logo"
                isLoading={false}
                fileType="base64"
              />
            </div>
            <div className="input-btn col-span-2 sm:ml-auto sm:mx-0 mx-auto">
              <Button
                w={256}
                type="submit"
                loading={inviteClientMutation.isPending}
              >
                Submit
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default InviteClient;
