import { ISystemCodes } from "@/common/api/models/interfaces/SystemCodes.model";
import systemCodesRepository from "@/common/api/repositories/systemCodesRepository";
import dmlToast from "@/common/configs/toaster.config";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Modal, Textarea } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface ModalProps {
  openModal: boolean;
  onModalClose: (reason?: string) => void;
  isEditMode?: boolean;
  initialValues?: ISystemCodes;
}
const addCodeSchema = yup.object({
  cpd_code: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Code"),
  note: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Code Details"),
});
type addCodeSchemaType = yup.InferType<typeof addCodeSchema>;

function AddIcdCodes({ openModal, onModalClose, isEditMode = false, initialValues }: ModalProps) {
  const [isAvailable, setIsAvailable] = useState(initialValues?.status ?? 1);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
  } = useForm({
    resolver: yupResolver(addCodeSchema),
    defaultValues: {
      cpd_code: initialValues?.cpd_code || "",
      note: initialValues?.note || "",
    },
  });

  useEffect(() => {
    if (isEditMode && initialValues) {
      setValue("cpd_code", initialValues?.cpd_code ?? "");
      setValue("note", initialValues?.note ?? "");
      setIsAvailable(initialValues?.status ?? 1);
    } else {
      reset();
      setIsAvailable(1);
    }
  }, [isEditMode, initialValues, setValue, reset]);

  const addCptCodesMutation = useMutation({ mutationFn: (payload: ISystemCodes) => systemCodesRepository.createCpdCodes(payload) });

  const updateCptCodesMutation = useMutation({
    mutationFn: (payload: ISystemCodes) => (initialValues?.id ? systemCodesRepository.updateCpdCodes(initialValues.id, payload) : Promise.reject("Invalid ID")),
  });

  const onSubmit = (data: addCodeSchemaType) => {
    const payload: ISystemCodes = {
      ...data,
      value: 1,
      status: isAvailable,
    };

    if (isEditMode && initialValues?.id) {
      updateCptCodesMutation.mutate(payload, {
        onSuccess: () => {
          dmlToast.success({
            title: "Code updated successfully",
          });
          reset();
          clearErrors();
          onModalClose("success");
        },
        onError: (error) => {
          dmlToast.error({
            message: getErrorMessage(error),
            title: "Error updating code",
          });
        },
      });
    } else {
      addCptCodesMutation.mutate(payload, {
        onSuccess: () => {
          dmlToast.success({
            title: "User added successfully",
          });
          reset();
          clearErrors();
          onModalClose("success");
        },
        onError: (error) => {
          dmlToast.error({
            message: getErrorMessage(error),
            title: "Error adding user",
          });
        },
      });
    }
  };

  const modalDismiss = () => {
    reset();
    clearErrors();
    onModalClose();
  };

  return (
    <Modal.Root
      size="md"
      centered
      opened={openModal}
      onClose={modalDismiss}
      closeOnClickOutside={false}
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>{isEditMode ? "Edit CPT Code" : "Add CPT Code"}</Modal.Title>
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <label
                htmlFor="availability"
                className="text-foreground text-fs-sp"
              >
                Code Status
              </label>
              <label className="custom-switch">
                <input
                  id="availability"
                  type="checkbox"
                  checked={Boolean(isAvailable)}
                  onChange={(e) => setIsAvailable(e.target.checked ? 1 : 0)}
                />
                <span className="custom-switch-slider" />
              </label>
            </div>
            <i
              onClick={modalDismiss}
              className="icon-cross text-2xl/none cursor-pointer ml-6"
            />
          </div>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Input.Wrapper
              label="Code"
              withAsterisk
              error={getErrorMessage(errors?.cpd_code)}
            >
              <Input
                {...register("cpd_code")}
                error={Boolean(errors.cpd_code?.message)}
              />
            </Input.Wrapper>
            <Textarea
              label="Code Details"
              placeholder=""
              withAsterisk
              classNames={{
                root: "dml-InputWrapper-root-alternative",
                input: "!h-[128px]",
                label: "!mb-0 !self-start",
                description: "text-grey text-fs-md",
              }}
              {...register("note")}
              error={getErrorMessage(errors?.note)}
            />
            <Button
              type="submit"
              className="dml-modal-btn"
              mt="md"
              loading={addCptCodesMutation.isPending || updateCptCodesMutation.isPending}
            >
              {isEditMode ? "Update Code" : "Add Code"}
            </Button>
          </form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}

export default AddIcdCodes;
