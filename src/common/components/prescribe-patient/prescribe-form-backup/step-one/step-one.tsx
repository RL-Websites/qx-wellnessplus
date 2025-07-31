import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { ICheckIfPatientExistsDTO } from "@/common/api/models/interfaces/PrescribeNow.model";
import prescribeNowRepository from "@/common/api/repositories/prescribeNowRepository";
import AddressAutoGoogle from "@/common/components/AddressAutoGoogle";
import { BaseWebDatePickerOverrides } from "@/common/configs/baseWebOverrides";
import dmlToast from "@/common/configs/toaster.config";
import { getErrorMessage, getLocName } from "@/utils/helper.utils";
import { Button, Group, Input, NumberInput, Radio } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { BaseProvider, LightTheme } from "baseui";
import { Datepicker as UberDatePicker } from "baseui/datepicker";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Client as Styletron } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";
import { PatientFormFieldsType } from "../schema/schemaValidation";

interface StepOneProps {
  handleBack: () => void;
  onSubmit: (data) => void;
  formData: any;
  locations: Array<object>;
}

const StepOne = ({ handleBack, onSubmit, formData, locations }: StepOneProps) => {
  const engine = new Styletron();
  const [dob, setDob] = useState<any>(null);
  const [zipCode, setZipCode] = useState<any>(null);
  const [address, setAddress] = useState<string>("");
  const [patientPhone, setPatientPhone] = useState<string>("");
  const [cities, setCities] = useState<Array<object>>([]);
  const [citySearchVal, setCitySearchVal] = useState("");
  const [states] = useState<Array<object>>(locations.filter((item: any) => item?.type.toLowerCase() == "state"));

  const {
    register,
    clearErrors,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useFormContext<PatientFormFieldsType>();

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  const minDate = new Date("1920-01-01");

  useEffect(() => {
    console.log(formData?.patient);
    if (formData?.patient && formData?.patient?.state) {
      setValue("state", formData?.patient?.state);
      setCities(
        locations.filter((item: any) => {
          return item.parent_id == formData?.patient?.state;
        })
      );
      // setCitySearchVal("");
      setValue("first_name", formData?.patient?.first_name);
      setValue("last_name", formData?.patient?.last_name);
      setValue("cell_phone", formData?.patient?.cell_phone);
      setPatientPhone(formData?.patient?.cell_phone);
      setValue("gender", formData?.patient?.gender);
      setValue("email", formData?.patient?.email);
      setValue("address", formData?.patient?.address1);
      setValue("height", formData?.patient?.height);
      // setValue("address2", formData?.patient?.address2);
      // setTimeout(() => {
      //   setValue("city", formData.city);
      //   setTimeout(() => {
      //   }, 50);
      // }, 50);
      setCitySearchVal(getLocName(formData?.patient?.city));
    }
    if (formData?.patient?.dob?.length) {
      setDob(new Date(formData?.patient?.dob[0]));
    }
    if (formData?.patient?.zip_code) {
      setZipCode(formData?.patient?.zip_code);
    }
  }, ["formData"]);

  const checkIfPatientExistsMutation = useMutation({
    mutationFn: (payload: ICheckIfPatientExistsDTO) => prescribeNowRepository.checkIfPatientExists(payload),
  });

  const submitHandler = (data: PatientFormFieldsType) => {
    const payload: ICheckIfPatientExistsDTO = {
      cell_phone: data.cell_phone,
      email: data.email,
    };

    checkIfPatientExistsMutation.mutate(payload, {
      onSuccess: (res) => {
        console.log(res);
        const patientData = {
          patient: data,
        };
        onSubmit(patientData);
      },
      onError: (err) => {
        const error = err as AxiosError<IServerErrorResponse>;
        if (error?.response?.data?.status_code == 409) {
          dmlToast.success({
            title: "Patient already exists",
            message: "We have filled the fields with existing data.",
          });
        } else {
          console.log(error);
          dmlToast.error({
            title: error?.response?.data?.message,
          });
        }
      },
    });
  };

  return (
    <>
      <div className="card p-6">
        <div className="card-title with-border mb-5">
          <h6>Patient Information</h6>
        </div>
        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
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
            defaultValue="male"
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
                  setValue("zip_code", address.zip_code, { shouldValidate: true });
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
              {...register(`city`)}
              type="text"
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
            {...register("zipcode")}
            className="md:col-span-1 col-span-2"
            label="Zip Code"
            onChange={(value) => {
              if (value) {
                setValue("zipcode", value?.toString());
                clearErrors("zipcode");
              }
              setZipCode(value);
            }}
            value={zipCode}
            max={99999}
            min={0}
            error={getErrorMessage(errors.zipcode)}
            hideControls
            allowNegative={false}
            allowDecimal={false}
            withAsterisk
          />
          <NumberInput
            className="md:col-span-1 col-span-2"
            label="SSN (Social Security Number)"
            max={99999}
            min={0}
            clampBehavior="strict"
            hideControls
            allowNegative={false}
            allowDecimal={false}
          />
          <NumberInput
            className="md:col-span-1 col-span-2"
            label="Height (c.m.)"
            {...register("height")}
            onChange={(value) => {
              if (value) {
                setValue("height", value?.toString());
                clearErrors("height");
              }
            }}
            // value={height}
            max={9999}
            min={0}
            clampBehavior="strict"
            error={getErrorMessage(errors.height)}
            hideControls
            allowNegative={false}
            allowDecimal={true}
            withAsterisk
          />
          <NumberInput
            className="md:col-span-1 col-span-2"
            label="Weight (kg)"
            {...register("weight")}
            onChange={(value) => {
              if (value) {
                setValue("weight", value?.toString());
                clearErrors("weight");
              }
            }}
            // value={weight}
            max={999}
            min={0}
            error={getErrorMessage(errors.weight)}
            clampBehavior="strict"
            hideControls
            allowNegative={false}
            allowDecimal={true}
            withAsterisk
          />
          <Radio.Group
            label="Allergy"
            withAsterisk
            defaultValue="Yes"
            className="md:col-span-1 col-span-2 justify-start"
            error={getErrorMessage(errors?.allergy)}
          >
            <Group
              mt="xs"
              className="flex justify-between md:gap-7 gap-3 w-full"
            >
              <Radio
                value="yes"
                label="Yes"
                color="dark"
                {...register("allergy")}
              />
              <Radio
                value="no"
                label="No"
                color="dark"
                {...register("allergy")}
              />
            </Group>
          </Radio.Group>
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
          <Input.Wrapper
            label="Symptoms"
            withAsterisk
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
          <Button
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
          </Button>
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
