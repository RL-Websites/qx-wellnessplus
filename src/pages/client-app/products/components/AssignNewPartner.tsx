import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IClinicListFilterParams } from "@/common/api/models/interfaces/Clinic.model";
import { IAssignMedToPartner } from "@/common/api/models/interfaces/Medication.model";
import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import dmlToast from "@/common/configs/toaster.config";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionIcon, Button, ComboboxItem, Modal, ScrollArea, Select } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface ModalProps {
  openModal: boolean;
  onModalClose: (reason: string) => void;
  prevData?: any;
  isEdit?: boolean;
  medicinePrice?: string;
  medicineId?: string;
  clinicId?: string;
  offerPrice?: string;
  clinicName?: string;
  assignedClinicIds?: (string | number)[];
}

const addClinicSchema = yup.object({
  clinic_id: yup.string().required("Please select a customer."),
  clinic_price: yup.string().required("Clinic Offer Price is required"),
});

const AssignNewPartner = ({ openModal, onModalClose, isEdit, medicinePrice = "0", medicineId, clinicId, offerPrice = undefined, clinicName, assignedClinicIds }: ModalProps) => {
  const [clinicDDList, setClinicDDList] = useState<{ value: string; label: string }[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<string>("");
  const [selectedClinicName, setSelectedClinicName] = useState<string>("");
  // console.log("assignedClinicIds", assignedClinicIds);
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(addClinicSchema),
    defaultValues: {
      clinic_id: "",
      clinic_price: undefined,
    },
  });

  const fetchCustomers = () => {
    const params: IClinicListFilterParams = {
      noPaginate: true,
      status: ["active"],
    };

    return partnerApiRepository.getPartnerListWithoutPagination(params);
  };
  useEffect(() => {
    setValue("clinic_price", offerPrice !== undefined ? offerPrice : medicinePrice ? medicinePrice : "0");
  }, [medicinePrice, offerPrice]);

  useEffect(() => {
    setValue("clinic_id", clinicId || "");
    setSelectedClinic(clinicId || "");
    setSelectedClinicName(clinicName || "");
  }, [clinicId]);

  const clinicListQuery = useQuery({ queryKey: ["clinicDDList"], queryFn: () => fetchCustomers(), enabled: !!openModal });

  useEffect(() => {
    const clinicDDdata =
      clinicListQuery?.data?.data?.data?.map((item) => ({
        value: item?.id?.toString() || "",
        label: item.account_name || "",
      })) || [];

    // console.log("clinicListQuery?.data?.data?.data", clinicListQuery?.data?.data?.data);

    const filteredClinicList = clinicDDdata.filter((item) => {
      if (isEdit && item.value === clinicId) return true;
      return !assignedClinicIds?.includes(item.value);
    });

    setClinicDDList(filteredClinicList);

    if (clinicId) {
      setSelectedClinic(clinicId);
      setSelectedClinicName(clinicName || "");
    }
  }, [clinicListQuery?.data?.data?.data, assignedClinicIds, isEdit, clinicId]);

  const closeModal = (reason: string) => {
    setSelectedClinic("");
    setSelectedClinicName("");
    reset({
      clinic_id: "",
      clinic_price: medicinePrice || offerPrice || "0",
    });
    onModalClose(reason);
  };

  // console.log("clinicDDList", clinicDDList);

  const assignClinicMutation = useMutation({ mutationFn: (payload: IAssignMedToPartner) => partnerApiRepository.assignMedicine(payload) });

  const handleSaveClinic = (data) => {
    const payload: IAssignMedToPartner = {
      customer_id: data.clinic_id,
      medication_id: medicineId || "",
    };

    assignClinicMutation.mutate(payload, {
      onSuccess: () => {
        dmlToast.success({ title: "Partner Assigned successfully" });
        reset();
        closeModal("success");
      },
      onError: (err) => {
        const error = err as AxiosError<IServerErrorResponse>;
        console.log(error);
      },
    });
    console.log(data);
  };

  return (
    <Modal.Root
      opened={openModal}
      onClose={() => closeModal("dismiss")}
      centered
      closeOnClickOutside={false}
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>{isEdit ? "Update Price" : "Assign New Customer Account"}</Modal.Title>
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
          <form onSubmit={handleSubmit(handleSaveClinic)}>
            <Select
              label="Choose Customer"
              withAsterisk
              data={clinicDDList?.length ? clinicDDList : undefined}
              searchValue={selectedClinicName}
              value={selectedClinic}
              classNames={{ wrapper: "bg-grey-btn rounded-md" }}
              error={getErrorMessage(errors.clinic_id)}
              {...register("clinic_id")}
              onChange={(value: any, options: ComboboxItem) => {
                setValue("clinic_id", value);
                setSelectedClinic(value);
                setSelectedClinicName(options.label);
                if (value) {
                  clearErrors("clinic_id");
                }
              }}
              rightSection={<i className="icon-down-arrow text-sm"></i>}
              searchable
              className="w-full"
            />

            <div className="flex gap-3 justify-center">
              {isEdit && (
                <Button
                  variant="light"
                  className="mt-6 mx-auto w-1/2"
                >
                  Undo
                </Button>
              )}
              <Button
                type="submit"
                className="mt-6 mx-auto w-[calc(100%_-_50%)]"
                loading={assignClinicMutation.isPending}
              >
                Save
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default AssignNewPartner;
