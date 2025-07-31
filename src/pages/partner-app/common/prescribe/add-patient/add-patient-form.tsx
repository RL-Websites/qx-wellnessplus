import $http from "@/common/api/axios";
import { IPartnerOnlyPatientInviteDTO } from "@/common/api/models/interfaces/PartnerPatient.model";
import { IPatientDetails } from "@/common/api/models/interfaces/Patient.model";
import patientApiRepository from "@/common/api/repositories/patientRepository";
import dmlToast from "@/common/configs/toaster.config";
import { invitingPartnerPatient } from "@/common/states/invitingPartnerPatient.atom";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, NumberInput, Skeleton } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";

const addPatientSchema = yup.object({
  first_name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("First name"),
  last_name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Last name"),
  email: yup
    .string()
    .email("Please provide a valid email address")
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Email address is required")
    .required(({ label }) => `${label} is required`)
    .label("Email"),
  phone: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .length(10, "Number must be 10 digits")
    .label("Phone"),
});

type addPatientType = yup.InferType<typeof addPatientSchema>;

const AddPatientForm = () => {
  const [phone, setPhone] = useState<any>(null);
  const [, setInvitePatientData] = useAtom(invitingPartnerPatient);
  const [patientDetails, setPatientDetails] = useState<IPatientDetails>();
  const [params] = useSearchParams();
  const patientUId = params.get("patient_id");

  const [checkLoading, setCheckLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addPatientSchema),
  });

  const patientDetailsQuery = useQuery({
    queryKey: ["existingPartnerPatientQuery", patientUId],
    queryFn: () => patientApiRepository.getPatientDetails(patientUId || ""),
    enabled: !!patientUId,
  });

  useEffect(() => {
    if (patientDetailsQuery?.data?.data?.status_code == 200 && patientDetailsQuery?.data?.data?.data) {
      const tempPatientDetails = patientDetailsQuery?.data?.data?.data;
      setPatientDetails(patientDetailsQuery?.data?.data?.data);
      setValue("first_name", tempPatientDetails?.first_name || "");
      setValue("last_name", tempPatientDetails?.last_name || "");
      setValue("email", tempPatientDetails?.email || "");
      setPhone(tempPatientDetails?.cell_phone);
      setValue("phone", tempPatientDetails?.cell_phone);
    }
  }, [patientDetailsQuery?.data?.data?.data]);

  const onsubmit = async (data: addPatientType) => {
    const payload: IPartnerOnlyPatientInviteDTO = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      cell_phone: data.phone,
      patient_id: patientUId,
    };
    if (patientDetails) {
      setInvitePatientData(payload);
      navigate("../patients/products");
      return;
    }
    try {
      setCheckLoading(true);
      // API call to check if email exists
      const response = await $http.post(`auth/email-check`, { email: data?.email });
      const status = response?.data?.status; // Adjust this based on actual API structure
      setCheckLoading(false);
      if (status === "success") {
        setInvitePatientData(payload);
        navigate("../patients/products");
      } else {
        dmlToast.error({ title: "Email already exists or is invalid." });
      }
    } catch (error: any) {
      setCheckLoading(false);
      const errorMessage = error?.response?.data?.message || "An unexpected error occurred.";
      dmlToast.error({ title: errorMessage });
    }
  };
  return patientDetailsQuery?.isLoading ? (
    <div className="grid md:grid-cols-2 gap-6 card">
      <Skeleton
        height={68}
        className="w-full"
      />
      <Skeleton
        height={68}
        className="w-full"
      />
      <Skeleton
        height={68}
        className="w-full"
      />
      <Skeleton
        height={68}
        className="w-full"
      />
    </div>
  ) : (
    <div className="card">
      <h6 className="card-title">Basic Info</h6>
      <form
        className="grid md:grid-cols-2 gap-6 pt-10"
        onSubmit={handleSubmit(onsubmit)}
      >
        <Input.Wrapper
          label="First Name"
          className="md:col-span-1 col-span-2"
          error={errors?.first_name?.message || ""}
          withAsterisk
        >
          <Input
            type="text"
            {...register("first_name")}
            error={Boolean(errors?.first_name?.message)}
            readOnly={!!patientDetails?.first_name}
          />
        </Input.Wrapper>
        <Input.Wrapper
          label="Last Name"
          className="md:col-span-1 col-span-2"
          error={errors?.last_name?.message || ""}
          withAsterisk
        >
          <Input
            type="text"
            {...register("last_name")}
            error={Boolean(errors?.last_name?.message)}
            readOnly={!!patientDetails?.last_name}
          />
        </Input.Wrapper>
        <Input.Wrapper
          label="Email"
          className="md:col-span-1 col-span-2"
          error={errors?.email?.message || ""}
          withAsterisk
        >
          <Input
            type="text"
            {...register("email")}
            error={Boolean(errors?.email?.message)}
            readOnly={!!patientDetails?.email}
          />
        </Input.Wrapper>
        <NumberInput
          {...register("phone")}
          onChange={(value) => {
            if (value) {
              setValue("phone", value?.toString());
              clearErrors("phone");
            }
            setPhone(value);
          }}
          value={phone}
          label="Phone"
          error={getErrorMessage(errors.phone)}
          max={9999999999}
          min={0}
          hideControls
          clampBehavior="strict"
          withAsterisk
          className="md:col-span-1 col-span-2"
          readOnly={!!patientDetails?.cell_phone}
        />
        <div className="input-btn col-span-2 sm:ml-auto sm:mx-0 mx-auto">
          <Button
            size="md"
            loading={checkLoading}
            w="256"
            type="submit"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPatientForm;
