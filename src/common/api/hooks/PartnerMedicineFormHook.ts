import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";

import dmlToast from "@/common/configs/toaster.config";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { IServerErrorResponse } from "../models/interfaces/ApiResponse.model";
import { IStoreMedicineDTO } from "../models/interfaces/Medication.model";
import partnerApiRepository from "../repositories/partnerRepositoiry";

export const medicineFormSchema = Yup.object().shape({
  medication_id: Yup.string().nullable(),
  name: Yup.string().required("Drug name is required"),
  sku: Yup.string().required("Please provide an SKU"),
  dose: Yup.number().typeError("Dose is required").required("Please must be a positive value."),
  unit: Yup.string().required("Unit is required"),
  medicine_group: Yup.string().required("Medication group is required"),
  pharmacy_id: Yup.string().nullable(),
  medication_category: Yup.string().required("Medication category is required"),
  medicine_type: Yup.string().required("Medication type is required"),
  price: Yup.number().typeError("Pharmacy Cost is required").typeError("Pharmacy cost must be a positive value"),
  doctor_fee: Yup.number().typeError("Doctor Fee is required").typeError("Doctor fee must be a positive value"),
  service_fee: Yup.number().typeError("Service fee is required").required("Service fee is required"),
  shipping_fee: Yup.number().typeError("Shipping fee is required").required("Shipping fee is required"),
  is_research_only: Yup.string().required("Research only status is required"),
  dosage_directions: Yup.array(Yup.object({ title: Yup.string().required("Please provide a title"), details: Yup.string().required("Please provide a description") })),
  image: Yup.mixed().nullable(),
});

export type medicineFormFieldTypes = Yup.InferType<typeof medicineFormSchema>;
export const useMedicineForm = (id?: string) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    clearErrors,
  } = useForm<medicineFormFieldTypes>({
    resolver: yupResolver(medicineFormSchema),
  });

  const {
    fields: dosage_directions,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "dosage_directions",
  });

  const navigate = useNavigate();

  const addMedicineMutation = useMutation({ mutationFn: (payload: IStoreMedicineDTO) => partnerApiRepository.storeMedicine(payload) });

  const onSubmit = (data: medicineFormFieldTypes) => {
    const payload: any = id
      ? {
          request_type: "update",
          medication_id: id,
          ...data,
        }
      : {
          request_type: "store",
          ...data,
        };

    addMedicineMutation.mutate(payload, {
      onSuccess: (res) => {
        dmlToast.success({
          title: id ? "Medication updated successfully" : "Medication added successfully",
        });
        navigate("/client/products");
      },
      onError: (err) => {
        // Handle err
        console.error(err);
        const error = err as AxiosError<IServerErrorResponse>;
      },
    });
  };

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    getValues,
    append,
    remove,
    watch,
    clearErrors,
    onSubmit,
    dosage_directions,
    isLoading: addMedicineMutation.isPending,
  };
};
