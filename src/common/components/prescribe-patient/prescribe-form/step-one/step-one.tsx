import { IServerErrorResponseWithData } from "@/common/api/models/interfaces/ApiResponse.model";
import { ICheckIfPatientExistsDTO } from "@/common/api/models/interfaces/PrescribeNow.model";
import patientApiRepository from "@/common/api/repositories/patientRepository";
import prescribeNowRepository from "@/common/api/repositories/prescribeNowRepository";
import AddressAutoGoogle from "@/common/components/AddressAutoGoogle";
import { BaseWebDatePickerOverrides } from "@/common/configs/baseWebOverrides";
import dmlToast from "@/common/configs/toaster.config";
import { formatDate } from "@/utils/date.utils";
import { getErrorMessage } from "@/utils/helper.utils";
import { Button, Group, Input, NumberInput, Radio } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { BaseProvider, LightTheme } from "baseui";
import { Datepicker as UberDatePicker } from "baseui/datepicker";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { useSearchParams } from "react-router-dom";
import { Client as Styletron } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";
import { PatientFormFieldsType } from "../schema/schemaValidation";

interface StepOneProps {
  handleBack: () => void;
  onSubmit: (data) => void;
  formData: any;
}

const StepOne = ({ handleBack, onSubmit, formData }: StepOneProps) => {
  const engine = new Styletron();
  const [dob, setDob] = useState<any>(null);
  const [zipCode, setZipCode] = useState<any>(null);
  const [address, setAddress] = useState<string>("");
  const [patientPhone, setPatientPhone] = useState<string>("");
  const [ssn, setSsn] = useState<any>(null);
  const [height, setHeight] = useState<any>(null);
  const [weight, setWeight] = useState<any>(null);
  const [gender, setGender] = useState<string>("male");
  const [prefilledFromOldData, setPrefilledFromOldData] = useState<boolean>(false);
  const [allergy, setAllergy] = useState<string>("false");
  // const [cities, setCities] = useState<Array<object>>([]);
  // const [citySearchVal, setCitySearchVal] = useState("");
  // const [states] = useState<Array<object>>(locations.filter((item: any) => item?.type.toLowerCase() == "state"));
  const [params] = useSearchParams();
  const patientId = params.get("patient_id");

  const patientQuery = useQuery({
    queryKey: ["prescribePatientDetails", patientId],
    queryFn: () => patientApiRepository.getPatientDetails(patientId || ""),
    enabled: !!patientId,
  });

  useEffect(() => {
    if (patientQuery?.data?.data?.status_code == 200 && patientQuery?.data?.data?.data) {
      const patientDetails = patientQuery?.data?.data?.data;
      setValue("id", patientDetails?.id);
      setValue("first_name", patientDetails?.first_name);
      setValue("last_name", patientDetails?.last_name);
      setValue("cell_phone", patientDetails?.cell_phone);
      setPatientPhone(patientDetails?.cell_phone);
      setValue("gender", patientDetails?.gender);
      setGender(patientDetails?.gender);
      setValue("email", patientDetails?.email);
      setValue("address", patientDetails?.address1);
      setAddress(patientDetails?.address1);
      setHeight(patientDetails?.height);
      setValue("height", patientDetails?.height);
      setWeight(patientDetails?.weight);
      setValue("weight", patientDetails?.weight);
      setValue("dob", [formatDate(patientDetails?.dob)]);
      setDob(new Date(patientDetails?.dob));
      setValue("ssn", patientDetails?.social_security_number);
      setSsn(patientDetails?.social_security_number);
      setValue("zip_code", patientDetails?.zipcode);
      setZipCode(patientDetails?.zipcode);
      setValue("state", patientDetails?.state);
      setValue("city", patientDetails?.state);
      setValue("allergy", patientDetails?.allergy_information ? "true" : "false");
      setAllergy(patientDetails?.allergy_information ? "true" : "false");
      setValue("allergyType", patientDetails?.allergy_information);
    }
  }, [patientQuery?.data?.data?.data]);

  const {
    register,
    clearErrors,
    setValue,
    formState: { errors },
    watch,
    handleSubmit,
  } = useFormContext<PatientFormFieldsType>();

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  const minDate = new Date("1920-01-01");

  useEffect(() => {
    if (formData?.patient && formData?.patient?.state) {
      setValue("state", formData?.patient?.state);
      // setCities(
      //   locations.filter((item: any) => {
      //     return item.parent_id == formData?.patient?.state;
      //   })
      // );
      // setCitySearchVal("");
      setValue("city", formData?.patient?.state);
      setValue("first_name", formData?.patient?.first_name);
      setValue("last_name", formData?.patient?.last_name);
      setValue("cell_phone", formData?.patient?.cell_phone);
      setPatientPhone(formData?.patient?.cell_phone);
      setValue("gender", formData?.patient?.gender);
      setGender(formData?.patient?.gender);
      setValue("email", formData?.patient?.email);
      setValue("address", formData?.patient?.address);
      setAddress(formData?.patient?.address);
      setHeight(formData?.patient?.height);
      setValue("height", formData?.patient?.height);
      setWeight(formData?.patient?.weight);
      setValue("weight", formData?.patient?.weight);
      setValue("allergy", formData?.patient?.allergy);
      setSsn(formData?.patient?.ssn);
      setValue("ssn", formData?.patient?.ssn);

      // setValue("address2", formData?.patient?.address2);
      // setTimeout(() => {
      //   setValue("city", formData.city);
      //   setTimeout(() => {
      //   }, 50);
      // }, 50);
      // setCitySearchVal(getLocName(formData?.patient?.city));
    }
    if (formData?.patient?.dob?.length) {
      setDob(new Date(formData?.patient?.dob[0]));
    }
    if (formData?.patient?.zip_code) {
      setZipCode(formData?.patient?.zip_code);
      setValue("zip_code", formData?.patient?.zip_code);
    }
  }, ["formData"]);

  const checkIfPatientExistsMutation = useMutation({
    mutationFn: (payload: ICheckIfPatientExistsDTO) => prescribeNowRepository.checkIfPatientExists(payload),
  });

  const submitHandler = (data: PatientFormFieldsType) => {
    console.log(data);
    const payload: ICheckIfPatientExistsDTO = {
      cell_phone: data.cell_phone,
      email: data.email,
    };
    if (prefilledFromOldData || patientId) {
      const patientData = {
        patient: { ...data, dob: formatDate(data.dob?.[0], "MM/DD/YYYY") },
      };
      onSubmit(patientData);
    } else {
      checkIfPatientExistsMutation.mutate(payload, {
        onSuccess: (res) => {
          console.log(res);
          const patientData = {
            patient: { ...data, dob: formatDate(data.dob?.[0], "MM/DD/YYYY") },
          };
          onSubmit(patientData);
        },
        onError: (err) => {
          const error = err as AxiosError<IServerErrorResponseWithData<any>>;
          if (error?.response?.data?.status_code == 409) {
            dmlToast.success({
              title: "Patient already exists",
              message: "We have filled the fields with existing data.",
            });
            const oldData = error?.response?.data?.data;
            setValue("first_name", oldData?.first_name);
            setValue("last_name", oldData?.last_name);
            setValue("cell_phone", oldData?.cell_phone);
            setPatientPhone(oldData?.cell_phone);
            setValue("gender", oldData?.gender);
            setGender(oldData?.gender);
            setValue("email", oldData?.email);
            setValue("address", oldData?.address1 || "");
            setAddress(oldData?.address1);
            setHeight(oldData?.height || "");
            setValue("height", oldData?.height || "");
            setWeight(oldData?.weight || "");
            setValue("weight", oldData?.weight || "");
            setValue("allergy", oldData?.allergy_information ? "true" : "false");
            setAllergy(oldData?.allergy_information ? "true" : "false");
            setValue("allergyType", oldData?.allergy_information || "");
            setSsn(oldData?.social_security_number || "");
            setValue("ssn", oldData?.social_security_number || "");
            setPrefilledFromOldData(true);
          } else {
            console.log(error);
            dmlToast.error({
              title: error?.response?.data?.message,
            });
          }
        },
      });
    }
  };

  return (
    <>
      <div className="card p-6">
        <div className="card-title with-border mb-5">
          <h6>Patient Information</h6>
        </div>
        <div className="grid grid-cols-2 items-start gap-y-4 gap-x-6">
          <Input.Wrapper
            label="First Name"
            withAsterisk
            className="md:col-span-1 col-span-2"
            error={getErrorMessage(errors?.first_name)}
          >
            <Input
              type="text"
              {...register("first_name")}
              error={Boolean(errors?.first_name?.message)}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="Last Name"
            withAsterisk
            className="md:col-span-1 col-span-2"
            error={getErrorMessage(errors?.last_name)}
          >
            <Input
              type="text"
              {...register("last_name")}
              error={Boolean(errors?.last_name?.message)}
            />
          </Input.Wrapper>
          <Radio.Group
            label="Gender"
            withAsterisk
            value={gender}
            defaultValue={gender}
            onChange={(value) => {
              setValue("gender", value);
              setGender(value);
            }}
            name="favoriteFramework"
            className="md:col-span-1 col-span-2 justify-start"
            error={getErrorMessage(errors?.gender)}
          >
            <Group
              mt="xs"
              className="flex justify-between md:gap-7 gap-3 w-full"
            >
              <Radio
                value="male"
                label="Male"
                color="dark"
                {...register("gender")}
              />
              <Radio
                value="female"
                label="Female"
                color="dark"
                {...register("gender")}
              />

              <Radio
                value="other"
                label="Other"
                color="dark"
                {...register("gender")}
              />
            </Group>
          </Radio.Group>
          <Input.Wrapper
            label="Date of Birth"
            className="md:col-span-1 col-span-2"
            error={getErrorMessage(errors?.dob)}
            withAsterisk
          >
            <div className={`${errors?.dob ? "baseWeb-error" : ""} dml-Input-wrapper dml-Input-Calendar relative`}>
              <StyletronProvider value={engine}>
                <BaseProvider theme={LightTheme}>
                  <UberDatePicker
                    aria-label="Select a date"
                    placeholder="MM/DD/YYYY"
                    formatString="MM/dd/yyyy"
                    highlightedDate={maxDate}
                    maxDate={maxDate}
                    minDate={minDate}
                    value={dob}
                    mask="99/99/9999"
                    error={true}
                    onChange={(data) => {
                      setDob([data.date]);
                      setValue("dob", [data.date]);
                      if (data.date) {
                        clearErrors("dob");
                      }
                    }}
                    overrides={BaseWebDatePickerOverrides}
                  />
                </BaseProvider>
              </StyletronProvider>
            </div>
          </Input.Wrapper>
          <NumberInput
            label="Phone Number"
            hideControls
            clampBehavior="strict"
            withAsterisk
            className="md:col-span-1 col-span-2"
            value={patientPhone}
            {...register("cell_phone")}
            onChange={(value) => {
              setValue("cell_phone", value.toString());
              setPatientPhone(value.toString());
              if (value) {
                clearErrors(`cell_phone`);
              }
            }}
            error={getErrorMessage(errors?.cell_phone)}
            max={9999999999}
            min={0}
          />
          <Input.Wrapper
            label="Email"
            withAsterisk
            className="md:col-span-1 col-span-2"
            error={getErrorMessage(errors?.email)}
          >
            <Input
              type="text"
              {...register("email")}
              error={Boolean(errors?.email?.message)}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="Address"
            withAsterisk
            className="col-span-2"
            error={getErrorMessage(errors?.address)}
          >
            <AddressAutoGoogle
              {...register("address")}
              address={address}
              isError={Boolean(errors?.address?.message)}
              onSelect={(address) => {
                if (address.address) {
                  const onlyAddress = address.address.split(",")[0];
                  setValue(`address`, onlyAddress, { shouldValidate: true });
                  setValue(`state`, address.state, { shouldValidate: true });
                  setValue(`city`, address.city, { shouldValidate: true });
                  setValue("zip_code", address?.zip_code || "", { shouldValidate: true });
                  setAddress(onlyAddress);
                  setZipCode(address.zip_code || "");
                  clearErrors(`address`);
                }
              }}
            />
          </Input.Wrapper>
          <Input.Wrapper
            className="w-full"
            label="State"
            withAsterisk
            error={getErrorMessage(errors?.state)}
          >
            <Input
              {...register(`state`)}
              error={Boolean(errors?.state?.message)}
              disabled
            />
          </Input.Wrapper>
          <Input.Wrapper
            className="w-full"
            label="City"
            withAsterisk
            error={getErrorMessage(errors?.city)}
          >
            <Input
              type="text"
              {...register(`city`)}
              error={Boolean(errors?.city?.message)}
            />
          </Input.Wrapper>
          {/* <Select
            label="State"
            withAsterisk
            defaultValue={formData?.patient?.state || ""}
            classNames={{
              wrapper: "bg-grey-btn rounded-md",
            }}
            rightSection={<i className="icon-down-arrow text-sm"></i>}
            searchable
            className="md:col-span-1 col-span-2"
            error={getErrorMessage(errors.state)}
            {...register("state")}
            onChange={(value: any) => {
              setValue("state", value);
              if (value) {
                setValue("city", "");
                clearErrors("state");
                setCities(
                  locations.filter((item: any) => {
                    return item.parent_id == value;
                  })
                );
                setCitySearchVal("");
              }
            }}
            data={states?.map((item: any) => {
              return {
                value: item?.id.toString(),
                label: item?.name,
              };
            })}
          />
          <Select
            label="City"
            className="md:col-span-1 col-span-2"
            defaultValue={formData?.patient?.city || ""}
            searchValue={citySearchVal}
            onSearchChange={setCitySearchVal}
            {...register("city")}
            error={getErrorMessage(errors.city)}
            withAsterisk
            data={cities?.map((item: any) => {
              return {
                value: item?.id.toString(),
                label: item?.name,
              };
            })}
            rightSection={<i className="icon-down-arrow text-sm"></i>}
            searchable
            onChange={(value, option) => {
              setValue("city", value || "");
              if (value) {
                setCitySearchVal(option.label || "");
                clearErrors("city");
              }
            }}
          /> */}
          <NumberInput
            {...register("zip_code")}
            className="md:col-span-1 col-span-2"
            label="Zip Code"
            onChange={(value) => {
              if (value) {
                setValue("zip_code", value?.toString());
                clearErrors("zip_code");
              }
              setZipCode(value);
            }}
            value={zipCode}
            max={99999}
            min={0}
            error={getErrorMessage(errors.zip_code)}
            hideControls
            allowNegative={false}
            allowDecimal={false}
            withAsterisk
          />
          <Input.Wrapper
            label="SSN (Social Security Number)"
            error={getErrorMessage(errors.ssn)}
          >
            <Input
              type="text"
              className="md:col-span-1 col-span-2"
              component={IMaskInput}
              mask="000-00-0000"
              value={ssn}
              {...register("ssn")}
              error={Boolean(errors.ssn?.message)}
              onAccept={(value) => {
                console.log(value);
                setValue("ssn", value?.toString(), { shouldValidate: true });
                setSsn(value);
              }}
            />
          </Input.Wrapper>
          <NumberInput
            className="md:col-span-1 col-span-2"
            label="Height (c.m.)"
            value={height}
            {...register("height")}
            onChange={(value) => {
              if (value) {
                setValue("height", value?.toString());
                clearErrors("height");
              }
              setHeight(value);
            }}
            // value={height}
            max={9999}
            min={0}
            clampBehavior="strict"
            error={getErrorMessage(errors.height)}
            hideControls
            allowNegative={false}
            allowDecimal={true}
          />
          <NumberInput
            className="md:col-span-1 col-span-2"
            label="Weight (kg)"
            value={weight}
            {...register("weight")}
            onChange={(value) => {
              if (value) {
                setValue("weight", value?.toString());
                clearErrors("weight");
              }
              setWeight(value);
            }}
            // value={weight}
            max={999}
            min={0}
            error={getErrorMessage(errors.weight)}
            clampBehavior="strict"
            hideControls
            allowNegative={false}
            allowDecimal={true}
          />
          <Radio.Group
            label="Allergy"
            withAsterisk
            defaultValue={allergy}
            value={allergy}
            onChange={(value) => {
              setValue("allergy", value);
              setAllergy(value);
            }}
            className="md:col-span-1 col-span-2 justify-start mb-7"
            classNames={{
              error: "ms-10",
            }}
            error={getErrorMessage(errors?.allergy)}
          >
            <Group
              mt="xs"
              className="flex justify-between md:gap-7 gap-3 w-full"
            >
              <Radio
                value="true"
                label="Yes"
                color="dark"
                {...register("allergy")}
              />
              <Radio
                value="false"
                label="No"
                color="dark"
                {...register("allergy")}
              />
            </Group>
          </Radio.Group>
          {/* {watch("allergy")} */}
          {watch("allergy") == "true" ? (
            <Input.Wrapper
              label="Allergy Type"
              withAsterisk
              className="md:col-span-1 col-span-2"
              error={getErrorMessage(errors?.allergyType)}
            >
              <Input
                type="text"
                {...register("allergyType")}
                error={Boolean(errors?.allergyType?.message)}
              />
            </Input.Wrapper>
          ) : (
            ""
          )}

          <Input.Wrapper
            label="Symptoms"
            className="col-span-2"
            error={getErrorMessage(errors?.symptoms)}
          >
            <Input
              type="text"
              {...register("symptoms")}
              error={Boolean(errors?.symptoms?.message)}
            />
          </Input.Wrapper>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <div className="flex flex-wrap md:gap-6 gap-3 ms-auto">
          {/* <Button
            px={0}
            variant="transparent"
            onClick={handleBack}
            type="button"
            classNames={{
              label: "underline font-medium",
            }}
          >
            Back
          </Button> */}
          {/* <Button
            color="grey.4"
            c="foreground"
            type="button"
            classNames={{
              root: "md:w-[256px] w-auto",
              label: "font-medium",
            }}
            disabled
          >
            Save as Draft
          </Button> */}
          <Button
            onClick={handleSubmit(submitHandler)}
            classNames={{
              root: "md:w-[256px] w-auto",
              label: "font-medium",
            }}
            loading={checkIfPatientExistsMutation?.isPending}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default StepOne;
