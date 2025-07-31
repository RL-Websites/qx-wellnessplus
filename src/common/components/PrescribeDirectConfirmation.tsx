import { IMedicineListItem } from "@/common/api/models/interfaces/Medication.model";
import { directPrescriptionSchema } from "@/pages/doctor-app/patients/components/schema";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionIcon, Button, Input, Modal } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import pharmacyRepository from "../api/repositories/pharmacyRepository";

interface ModalProps {
  openModal: boolean;
  onModalClose: (closeReason: boolean | string) => void;
  onSend: (prescriptionData: string) => void;
  isLoading?: boolean;
  medicationData: IMedicineListItem;
}

const PrescribeDirectConfirmation = ({ openModal, onModalClose, medicationData, onSend }: ModalProps) => {
  const [reasonText, setReasonText] = useState("");
  const closeModal = (reason) => {
    onModalClose(reason);
    if (reasonText) {
      setReasonText("");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(directPrescriptionSchema),
  });

  const { data: pharmacyDataRes } = useQuery({
    queryKey: ["getPharmacyList"],
    queryFn: () =>
      pharmacyRepository.getPharmacyListWithoutPaginate({
        noPaginate: true,
        dnnPharmacy: true,
      }),
  });

  const pharmactDetails = pharmacyDataRes?.data?.data;

  useEffect(() => {
    if (medicationData) {
      setValue("drug_name", medicationData.drug_name);
      setValue("day_supply", "0");
      setValue("refills", "0");
      setValue("dosage", medicationData?.drug_strength);
      setValue("directions", medicationData?.directions ?? "");
    }
  }, [medicationData]);

  const onSubmit = (data: any) => {
    const finalData = {
      ...{
        id: medicationData?.id,
        category: medicationData?.category,
        image: medicationData?.image,
        quantity_unit: medicationData?.quantity_unit,
        type: medicationData?.type,
      },
      ...data,
    };
    onSend(finalData);
  };

  return (
    <Modal.Root
      opened={openModal}
      onClose={() => closeModal(false)}
      closeOnClickOutside={false}
      centered
      size={"60%"}
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header pt={16}>
          <Modal.Title>Choose Medication</Modal.Title>

          <ActionIcon
            onClick={() => closeModal(false)}
            radius="100%"
            bg="dark"
            size="20"
            ms="auto"
          >
            <i className="icon-cross1 text-[10px]"></i>
          </ActionIcon>
        </Modal.Header>
        <Modal.Body pb="lg">
          <form
            className="max-w-4xl mx-auto grid grid-cols-2 gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input.Wrapper
              label="Request For"
              withAsterisk
            >
              <Input
                readOnly
                {...register("drug_name")}
              />
            </Input.Wrapper>
            <Input.Wrapper
              label="Dosage"
              withAsterisk
            >
              <Input {...register("dosage")} />
            </Input.Wrapper>

            <Input.Wrapper
              label="Quantity"
              withAsterisk
            >
              <Input
                type="number"
                min={1}
                error={getErrorMessage(errors?.quantity)}
                {...register("quantity")}
              />
            </Input.Wrapper>

            <Input.Wrapper
              label="Days Supply"
              error={getErrorMessage(errors?.day_supply)}
              withAsterisk
            >
              <Input {...register("day_supply")} />
            </Input.Wrapper>

            <Input.Wrapper
              error={getErrorMessage(errors?.refills)}
              label="Refills"
              withAsterisk
            >
              <Input {...register("refills")} />
            </Input.Wrapper>

            <Input.Wrapper
              label="Direction/Sig"
              error={getErrorMessage(errors?.directions)}
              withAsterisk
            >
              <Input {...register("directions")} />
            </Input.Wrapper>

            {/* Submit Button */}
            <div className="col-span-2 flex justify-center mt-6">
              <Button type="submit">Prescribed</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default PrescribeDirectConfirmation;
