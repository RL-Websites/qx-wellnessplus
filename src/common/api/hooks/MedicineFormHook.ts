import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";

import dmlToast from "@/common/configs/toaster.config";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { IServerErrorResponse } from "../models/interfaces/ApiResponse.model";
import { IStoreMedicineDTO } from "../models/interfaces/Medication.model";
import { medicineRepository } from "../repositories/medicineRepository";

export const medicineFormSchema = Yup.object().shape({
  medication_id: Yup.string().nullable(),
  drug_name: Yup.string().required("Drug name is required"),
  type: Yup.string().required("Type is required"),
  price: Yup.number().typeError("Price is required").positive("Price must be a positive value").required("Price is required"),
  states: Yup.array(Yup.string().required()).typeError("At least one state must be provided").required().min(1, "At least one state must be provided"),
  is_researched: Yup.string().required("Research only status is required"),
  category_id: Yup.string().required("Category is required"),
  control_medicine: Yup.string().required("Controlled Medicine status is required"),
  product_image: Yup.string().nullable(),
  sku: Yup.string().required("Please provide an SKU"),
  dose: Yup.number().typeError("Dose is required").positive("Dose must be a positive value").required("Please provide a medication dose."),
  unit: Yup.string().required("Please select an unit for the medication dose."),
  duration: Yup.number().typeError("Duration is required").typeError("Duration must be a positive value"),
  quantity: Yup.number().typeError("Quantity is required").typeError("Quantity must be a positive value"),
  // refill: Yup.string(),
  formula: Yup.string().nullable(),
  benefits: Yup.string().nullable(),
  how_to_use: Yup.string().nullable(),
  about: Yup.string().nullable(),
  special_notes: Yup.string().nullable(),
  side_effects: Yup.string().nullable(),
  dosage_directions: Yup.array(Yup.object({ title: Yup.string().required("Please provide a title"), details: Yup.string().required("Please provide a description") })),
});

export type medicineFormFieldTypes = Yup.InferType<typeof medicineFormSchema>;
export const useMedicineForm = (id?: string) => {
  const categoryQuery = useQuery({
    queryKey: ["medicineCategories"],
    queryFn: () => medicineRepository.getMedicineCategories(),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
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

  const addMedicineMutation = useMutation({ mutationFn: (payload: IStoreMedicineDTO) => medicineRepository.storeMedicine(payload) });

  const onSubmit = (data: medicineFormFieldTypes) => {
    const payload: IStoreMedicineDTO = id
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
        navigate("/pharmacy/products");
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
    clearErrors,
    onSubmit,
    categoryQuery,
    dosage_directions,
    isLoading: addMedicineMutation.isPending,
  };
};
