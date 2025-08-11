import { IPatientBookingPatientInfoDTO, IPublicPartnerPrescriptionDetails } from "@/common/api/models/interfaces/PartnerPatient.model";
import AddressAutoGoogle from "@/common/components/AddressAutoGoogle";
import { BaseWebDatePickerOverrides } from "@/common/configs/baseWebOverrides";
import dmlToast from "@/common/configs/toaster.config";
import { formatDate } from "@/utils/date.utils";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionIcon, Anchor, Button, Group, Image, Input, NumberInput, Radio, Text } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconX } from "@tabler/icons-react";
import { BaseProvider, LightTheme } from "baseui";
import { Datepicker as UberDatePicker } from "baseui/datepicker";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Client as Styletron } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";
import { BasicInfoFormFieldsType, basicInfoValidationSchema } from "./validationSchema";

interface BasicInfoPropTypes {
  patientDetails?: IPublicPartnerPrescriptionDetails;
  onNext: (data) => void;
  isSubmitting?: boolean;
}

const BasicInfo = ({ patientDetails, onNext, isSubmitting }: BasicInfoPropTypes) => {
  const engine = new Styletron();
  const [dob, setDob] = useState<any>(null);
  const [phone, setPhone] = useState<string>();
  const [gender, setGender] = useState<string>("male");
  const [zipCode, setZipCode] = useState<any>(null);
  const [address, setAddress] = useState<string>("");
  const [frontFile, setFrontFile] = useState<string>();
  const [backFile, setBackFile] = useState<string>();
  const [frontBase64, setFrontBase64] = useState<string | null>(null);
  const [backBase64, setBackBase64] = useState<string | null>(null);
  const [params] = useSearchParams();
  const prescriptionUId = params.get("prescription_u_id");
  const navigate = useNavigate();

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  const minDate = new Date("1920-01-01");

  const fileToBase64 = (file: File, callback: (result: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result as string);
    reader.onerror = (error) => console.error("Error converting file: ", error);
  };

  const handleFileUpload = (files: File[], type: "front" | "back") => {
    if (files.length > 0) {
      const file = files[0];
      fileToBase64(file, (base64) => {
        if (type === "front") {
          setFrontFile(base64);
          setFrontBase64(base64);
        } else {
          setBackFile(base64);
          setBackBase64(base64);
        }
      });
    }
  };

  const removeFrontFile = (ev) => {
    ev.preventDefault();
    setFrontFile(undefined);
    setFrontBase64(null);
  };

  const removeBackFile = (ev) => {
    ev.preventDefault();
    setBackFile(undefined);
    setBackBase64(null);
  };

  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(basicInfoValidationSchema),
  });

  useEffect(() => {
    const tempPatientDetails = patientDetails;
    if (tempPatientDetails?.status && tempPatientDetails?.status == "invited") {
      // do nothing
    } else if (tempPatientDetails?.status && tempPatientDetails?.status == "intake_pending") {
      navigate(`../partner-patient-intake?prescription_u_id=${prescriptionUId}`);
    } else if (tempPatientDetails?.status && tempPatientDetails?.status == "pending") {
      navigate(`../partner-patient-password-setup?prescription_u_id=${prescriptionUId}`);
    } else {
      console.log(tempPatientDetails?.status);
    }
    // setPatientDetails(patientDetailsQuery?.data?.data?.data);
    setValue("first_name", tempPatientDetails?.patient?.first_name || "", { shouldValidate: true });
    setValue("last_name", tempPatientDetails?.patient?.last_name || "", { shouldValidate: true });
    setValue("email", tempPatientDetails?.patient?.email || "", { shouldValidate: true });
    if (tempPatientDetails?.patient?.dob) {
      setDob(new Date(tempPatientDetails?.patient?.dob));
      setValue("dob", [formatDate(tempPatientDetails?.patient?.dob)]);
      setGender(tempPatientDetails?.patient?.gender);
      setValue("gender", tempPatientDetails?.patient?.gender);
      setAddress(tempPatientDetails?.patient?.address1);
      setValue("address", tempPatientDetails?.patient?.address1);
      setValue("state", tempPatientDetails?.patient?.state);
      setValue("city", tempPatientDetails?.patient?.city);
      setZipCode(tempPatientDetails?.patient?.zipcode);
      setValue("zip_code", tempPatientDetails?.patient?.zipcode);
      setValue("latitude", tempPatientDetails?.patient?.latitude);
      setValue("longitude", tempPatientDetails?.patient?.longitude);
      setFrontFile(
        tempPatientDetails?.patient?.driving_license_front ? `${import.meta.env.VITE_BASE_PATH}/storage/${tempPatientDetails?.patient?.driving_license_front}` : undefined
      );
      setBackFile(tempPatientDetails?.patient?.driving_license_back ? `${import.meta.env.VITE_BASE_PATH}/storage/${tempPatientDetails?.patient?.driving_license_back}` : undefined);
    }
  }, [patientDetails]);

  const onSubmit = async (data: BasicInfoFormFieldsType) => {
    const payload: IPatientBookingPatientInfoDTO = {
      prescription_u_id: prescriptionUId || "",
      patient: {
        first_name: data?.first_name,
        last_name: data?.last_name,
        email: data?.email,
        cell_phone: data?.phone,
        dob: data?.dob?.[0] ? formatDate(data?.dob?.[0], "MM-DD-YYYY") : "",
        gender: data?.gender,
        // weight: data?.weight,
        // height: data?.height,
        address: data?.address,
        city: data?.city,
        latitude: data?.latitude || 0,
        longitude: data?.longitude || 0,
        state: data?.state,
        zip_code: data?.zip_code,
        driving_lic_back: backBase64 || undefined,
        driving_lic_front: frontBase64 || undefined,
      },
    };
    onNext(payload);
  };

  const handleNext = handleSubmit(onSubmit);

  return (
    <>
      <h1 className="text-center text-foreground text-[90px]/none">FEW QUICK QUESTIONS</h1>
      <div className="card-common">
        <div className="card-title">
          <h3 className="font-poppins font-semibold lg:text-3xl text-2xl">Basic Information</h3>
        </div>
        <form
          className="grid sm:grid-cols-2 gap-y-4 gap-x-6 pt-5"
          onSubmit={handleNext}
        >
          <Input.Wrapper
            label="First Name"
            withAsterisk
            className="sm:col-span-1 col-span-2"
            error={getErrorMessage(errors?.first_name)}
          >
            <Input
              type="text"
              {...register("first_name")}
              // disabled
              error={Boolean(errors?.first_name?.message)}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="Last Name"
            withAsterisk
            className="sm:col-span-1 col-span-2"
            error={getErrorMessage(errors?.last_name)}
          >
            <Input
              type="text"
              {...register("last_name")}
              // disabled
              error={Boolean(errors?.last_name?.message)}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="Email"
            withAsterisk
            className="sm:col-span-1 col-span-2"
            error={getErrorMessage(errors?.email)}
          >
            <Input
              type="text"
              {...register("email")}
              // disabled
              error={Boolean(errors?.email?.message)}
            />
          </Input.Wrapper>
          <NumberInput
            label="Phone/Mobile No"
            hideControls
            clampBehavior="strict"
            withAsterisk
            className="sm:col-span-1 col-span-2"
            value={phone}
            {...register("phone")}
            onChange={(value) => {
              setValue("phone", value.toString());
              setPhone(value.toString());
              if (value) {
                clearErrors(`phone`);
              }
            }}
            error={getErrorMessage(errors?.phone)}
            max={9999999999}
            min={0}
          />
          <Radio.Group
            label="Gender"
            withAsterisk
            value={gender}
            defaultValue={gender}
            onChange={(value) => {
              setValue("gender", value);
              setGender(value);
              if (value) {
                clearErrors("gender");
              }
            }}
            name="gender"
            className="sm:col-span-1 col-span-2 justify-start"
            error={getErrorMessage(errors?.gender)}
          >
            <Group
              mt="xs"
              className="flex justify-between md:gap-7 gap-3 w-full"
            >
              <Radio
                value="Male"
                label="Male"
                color="dark"
                {...register("gender")}
              />
              <Radio
                value="Female"
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
            error={getErrorMessage(errors.dob)}
            withAsterisk
            className="sm:col-span-1 col-span-2"
          >
            <div className={`${errors?.dob ? "baseWeb-error" : ""} dml-Input-wrapper dml-Input-Calendar relative`}>
              <StyletronProvider value={engine}>
                <BaseProvider theme={LightTheme}>
                  {/* <pre>{JSON.stringify(dob)}</pre> */}
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
          <Input.Wrapper
            className="sm:col-span-1 col-span-2"
            label="Address"
            error={getErrorMessage(errors.address)}
            withAsterisk
          >
            <AddressAutoGoogle
              {...register("address")}
              address={address}
              isError={Boolean(errors?.address?.message)}
              onSelect={(address) => {
                if (address.address) {
                  const onlyAddress = address.address.split(",")[0];
                  setValue("address", onlyAddress, { shouldValidate: true });
                  setValue("state", address.state, { shouldValidate: true });
                  setValue("city", address.city, { shouldValidate: true });
                  setValue("zip_code", address.zip_code || "", { shouldValidate: true });
                  setValue("latitude", address?.latitude);
                  setValue("longitude", address?.longitude);
                  setAddress(onlyAddress);
                  setZipCode(parseInt(address.zip_code || ""));
                  clearErrors("address");
                }
              }}
            />
          </Input.Wrapper>
          <Input.Wrapper
            className="sm:col-span-1 col-span-2"
            label="Country"
            error={getErrorMessage(errors.country)}
          >
            <Input
              type="text"
              value="USA"
              disabled
            />
          </Input.Wrapper>
          <Input.Wrapper
            className="sm:col-span-1 col-span-2"
            label="State"
            withAsterisk
            error={getErrorMessage(errors.state)}
          >
            <Input
              {...register("state")}
              error={getErrorMessage(errors.state?.message)}
              disabled
            />
          </Input.Wrapper>
          <Input.Wrapper
            className="sm:col-span-1 col-span-2"
            label="City"
            withAsterisk
            error={getErrorMessage(errors.city)}
          >
            <Input
              {...register("city")}
              error={getErrorMessage(errors.city?.message)}
              type="text"
            />
          </Input.Wrapper>
          <div className="col-span-2 grid grid-cols-2 gap-5">
            <NumberInput
              {...register("zip_code")}
              className="sm:col-span-1 col-span-2"
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
              clampBehavior="strict"
              allowNegative={false}
              allowDecimal={false}
              withAsterisk
            />
          </div>
          <div className="sm:col-span-1 col-span-2">
            <h6 className="font-poppins extra-form-text-medium text-foreground mb-2">Upload Driving License (Front Side)</h6>
            <Dropzone
              onDrop={(files) => handleFileUpload(files, "front")}
              onReject={(rejectedFiles) => {
                if (rejectedFiles?.[0]?.errors?.[0]?.code == "file-too-large") {
                  dmlToast.error({ title: "File size should be less than 2MB." });
                }
              }}
              accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
              maxSize={2 * 1024 ** 2} // 5MB limit
              multiple={false} // Only allow one file
              classNames={{
                root: "relative w-full min-h-[220px] border-dashed border border-grey w-full cursor-pointer rounded-lg",
                inner: "absolute !inset-0 !size-full",
              }}
            >
              {!frontFile ? (
                <Group
                  justify="center"
                  mih={220}
                  className="flex-col gap-1 text-center pointer-events-none"
                >
                  <i className="icon-document-upload text-[52px] text-grey" />
                  <Text className="font-semibold text-grey">Drag & drop or click to upload</Text>
                  <div className="d-inline-flex leading-none text-sm">or</div>
                  <Anchor className="underline">Browse Files</Anchor>
                </Group>
              ) : (
                <div className="relative inline-block size-full">
                  <Image
                    src={frontFile}
                    alt="Front Side"
                    className="size-full rounded-md object-scale-down"
                  />
                  <ActionIcon
                    size="sm"
                    radius="xl"
                    variant="filled"
                    color="red"
                    style={{ position: "absolute", top: -5, right: -5, zIndex: 10 }}
                    onClick={(event) => removeFrontFile(event)}
                  >
                    <IconX size={14} />
                  </ActionIcon>
                </div>
              )}
            </Dropzone>
          </div>
          <div className="sm:col-span-1 col-span-2">
            <h6 className="font-poppins extra-form-text-medium text-foreground mb-2">Upload Driving License (Back Side)</h6>
            <Dropzone
              onDrop={(files) => handleFileUpload(files, "back")}
              onReject={(rejectedFiles) => {
                if (rejectedFiles?.[0]?.errors?.[0]?.code == "file-too-large") {
                  dmlToast.error({ title: "File size should be less than 2MB." });
                }
              }}
              accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
              maxSize={2 * 1024 ** 2}
              multiple={false}
              classNames={{
                root: "relative w-full min-h-[220px] border-dashed border border-grey w-full cursor-pointer rounded-lg",
                inner: "absolute !inset-0 !size-full",
              }}
            >
              {!backFile ? (
                <Group
                  justify="center"
                  mih={220}
                  className="flex-col gap-1 text-center pointer-events-none"
                >
                  <i className="icon-document-upload text-[52px] text-grey" />
                  <Text className="font-semibold text-grey">Drag & drop or click to upload</Text>
                  <div className="d-inline-flex leading-none text-sm">or</div>
                  <Anchor className="underline">Browse Files</Anchor>
                </Group>
              ) : (
                <div className="relative inline-block size-full">
                  <Image
                    src={backFile}
                    alt="Back Side"
                    className="size-full rounded-md object-scale-down"
                  />
                  <ActionIcon
                    size="sm"
                    radius="xl"
                    variant="filled"
                    color="red"
                    style={{ position: "absolute", top: -5, right: -5, zIndex: 10 }}
                    onClick={(event) => removeBackFile(event)}
                  >
                    <IconX size={14} />
                  </ActionIcon>
                </div>
              )}
            </Dropzone>
          </div>
        </form>
      </div>
      <div className="flex justify-between mt-6">
        <div className="flex gap-3 ms-auto">
          <Button
            w={256}
            onClick={handleNext}
            loading={isSubmitting}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default BasicInfo;
