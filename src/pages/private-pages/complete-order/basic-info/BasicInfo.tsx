import { IPatientBookingPatientInfoDTO } from "@/common/api/models/interfaces/PartnerPatient.model";
import { IUserData } from "@/common/api/models/interfaces/User.model";
import AddressAutoGoogle from "@/common/components/AddressAutoGoogle";
import { BaseWebDatePickerOverrides } from "@/common/configs/baseWebOverrides";
import { InputErrorMessage } from "@/common/configs/inputErrorMessage";
import dmlToast from "@/common/configs/toaster.config";
import { selectedCategoryAtom } from "@/common/states/category.atom";
import { selectedGenderAtom } from "@/common/states/gender.atom";
import { selectedStateAtom } from "@/common/states/state.atom";
import { dobAtom } from "@/common/states/user.atom";
import states from "@/data/state-list.json";
import { formatDate } from "@/utils/date.utils";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionIcon, Anchor, Button, Group, Image, Input, NumberInput, Radio, Select, Text } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconX } from "@tabler/icons-react";
import { BaseProvider, LightTheme } from "baseui";
import { Datepicker as UberDatePicker } from "baseui/datepicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Client as Styletron } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";
import { BasicInfoFormFieldsType, basicInfoValidationSchema } from "./validationSchema";

interface BasicInfoPropTypes {
  userData?: IUserData;
  formData?: IPatientBookingPatientInfoDTO;
  onNext: (data) => void;
  isSubmitting?: boolean;
}

dayjs.extend(customParseFormat);

const BasicInfo = ({ userData, onNext, formData, isSubmitting }: BasicInfoPropTypes) => {
  const engine = new Styletron();
  const [dob, setDob] = useState<any>(null);
  const [phone, setPhone] = useState<string>();
  const [selectedGender, setSelectedGender] = useAtom(selectedGenderAtom);
  const [gender, setGender] = useState<string>(selectedGender || "male");
  const [selectedState, setSelectedState] = useAtom(selectedStateAtom);
  const [stateSearchVal, setStateSearchVal] = useState<string>(selectedState || "");
  const [address, setAddress] = useState<string>("");
  const [zipCode, setZipCode] = useState<any>(null);
  const [frontFile, setFrontFile] = useState<string>();
  const [backFile, setBackFile] = useState<string>();
  const [frontBase64, setFrontBase64] = useState<string | null>(null);
  const [backBase64, setBackBase64] = useState<string | null>(null);
  const selectedCategory = useAtomValue(selectedCategoryAtom);
  const [params] = useSearchParams();
  const [globalDob, setGlobalDob] = useAtom(dobAtom);
  const prescriptionUId = params.get("prescription_u_id");
  const navigate = useNavigate();

  const ageLimit = selectedCategory?.includes("Testosterone") ? 22 : 18;

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - ageLimit);

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
          setValue("driving_lic_front", base64, { shouldValidate: true });
        } else {
          setBackFile(base64);
          setBackBase64(base64);
          setValue("driving_lic_back", base64, { shouldValidate: true });
        }
      });
    }
  };

  const removeFrontFile = (ev) => {
    ev.preventDefault();
    setFrontFile(undefined);
    setFrontBase64(null);
    setValue("driving_lic_front", "");
  };

  const removeBackFile = (ev) => {
    ev.preventDefault();
    setBackFile(undefined);
    setBackBase64(null);
    setValue("driving_lic_back", "");
  };

  const {
    register,
    handleSubmit,
    clearErrors,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(basicInfoValidationSchema, { context: { selectedCategory } }),
    context: { selectedCategory },
    mode: "onChange",
  });

  const state = watch("state");

  useEffect(() => {
    const tempPatientDetails = userData;

    // setPatientDetails(patientDetailsQuery?.data?.data?.data);

    setValue("first_name", tempPatientDetails?.userable?.first_name || "", { shouldValidate: true });
    setValue("last_name", tempPatientDetails?.userable?.last_name || "", { shouldValidate: true });
    setValue("email", tempPatientDetails?.email || "", { shouldValidate: true });

    if (userData != undefined && !formData?.patient?.address) {
      if (tempPatientDetails?.userable?.dob && !formData?.patient?.dob) {
        setPhone(tempPatientDetails?.userable?.cell_phone);

        setValue("phone", tempPatientDetails?.userable?.cell_phone, { shouldValidate: true });

        setAddress(tempPatientDetails?.userable?.address1);
        setValue("address", tempPatientDetails?.userable?.address1);
        setValue("address2", tempPatientDetails?.userable?.address2);
        // setValue("state", tempPatientDetails?.userable?.state, { shouldValidate: true });
        // setSelectedState(tempPatientDetails?.userable?.state);
        // setStateSearchVal(tempPatientDetails?.userable?.state);
        if (tempPatientDetails?.userable?.state) {
          setSelectedState(tempPatientDetails.userable.state);
          setStateSearchVal(tempPatientDetails.userable.state);
          setValue("state", tempPatientDetails.userable.state, { shouldValidate: true });
        }
        setValue("city", tempPatientDetails?.userable?.city);
        setValue("zip_code", tempPatientDetails?.userable?.zipcode);
        setZipCode(tempPatientDetails?.userable?.zipcode);
        setValue("latitude", tempPatientDetails?.userable?.latitude ? Number(tempPatientDetails?.userable?.latitude) : null);
        setValue("longitude", tempPatientDetails?.userable?.longitude ? Number(tempPatientDetails?.userable?.longitude) : null);
        setFrontFile(tempPatientDetails?.userable?.base64_driving_license_front ? tempPatientDetails?.userable?.base64_driving_license_front : "");
        setBackFile(tempPatientDetails?.userable?.base64_driving_license_front ? tempPatientDetails?.userable?.base64_driving_license_front : "");
        setFrontBase64(tempPatientDetails?.userable?.base64_driving_license_front ? tempPatientDetails?.userable?.base64_driving_license_front : "");
        setBackBase64(tempPatientDetails?.userable?.base64_driving_license_front ? tempPatientDetails?.userable?.base64_driving_license_front : "");
        setValue("driving_lic_front", tempPatientDetails?.userable?.base64_driving_license_front ? tempPatientDetails?.userable?.base64_driving_license_front : "");
        setValue("driving_lic_back", tempPatientDetails?.userable?.base64_driving_license_back ? tempPatientDetails?.userable?.base64_driving_license_back : "");
      }
    }

    if (!userData?.userable?.dob && !formData?.patient?.dob && globalDob) {
      const parsedDate = dayjs(globalDob, "MM-DD-YYYY");
      if (parsedDate.isValid()) {
        setDob(parsedDate.toDate());
        setValue("dob", [parsedDate.format("MM-DD-YYYY")]);
      }
    } else if (userData?.userable?.dob) {
      const parsedDate = dayjs(userData?.userable?.dob);
      if (parsedDate.isValid()) {
        setDob(parsedDate.toDate());
        setValue("dob", [parsedDate.format("MM-DD-YYYY")]);
      }
    }

    if (selectedGender) {
      setGender(selectedGender);
      setValue("gender", selectedGender);
    } else if (userData?.userable?.gender) {
      setGender(userData.userable.gender);
      setSelectedGender(userData.userable.gender);
      setValue("gender", userData.userable.gender);
    }
  }, [userData]);

  useEffect(() => {
    if (formData?.patient?.address) {
      if (formData?.patient?.dob) {
        // console.log(formData?.patient?.cell_phone);
        setPhone(formData?.patient?.cell_phone);

        setValue("phone", formData?.patient?.cell_phone || "", { shouldValidate: true });

        setAddress(formData?.patient?.address);
        setValue("address", formData?.patient?.address);
        setValue("address2", formData?.patient?.address2);
        // setValue("state", formData?.patient?.state, { shouldValidate: true });
        // setSelectedState(formData?.patient?.state);
        // setStateSearchVal(formData?.patient?.state);
        if (formData?.patient?.state) {
          setSelectedState(formData.patient.state);
          setStateSearchVal(formData.patient.state);
          setValue("state", formData.patient.state, { shouldValidate: true });
        }
        setValue("city", formData?.patient?.city);
        setZipCode(formData?.patient?.zip_code);
        setValue("zip_code", formData?.patient?.zip_code);
        setValue("latitude", Number(formData?.patient?.latitude));
        setValue("longitude", Number(formData?.patient?.longitude));
        setFrontFile(formData?.patient?.driving_lic_front || "");
        setBackFile(formData?.patient?.driving_lic_back || "");
        setFrontBase64(formData?.patient?.driving_lic_front || "");
        setBackBase64(formData?.patient?.driving_lic_back || "");
        setValue("driving_lic_front", formData?.patient?.driving_lic_front || "");
        setValue("driving_lic_back", formData?.patient?.driving_lic_back || "");
      }

      if (!formData?.patient?.dob && globalDob) {
        const parsedDate = dayjs(globalDob, "MM-DD-YYYY");
        if (parsedDate.isValid()) {
          console.log(parsedDate.toDate());
          // setDob(parsedDate.toDate());
          // setValue("dob", [parsedDate.format("MM-DD-YYYY")]);
        }
      } else if (formData?.patient?.dob) {
        const parsedDate = dayjs(formData.patient.dob, "MM-DD-YYYY");
        if (parsedDate.isValid()) {
          setDob(parsedDate.toDate());
          setValue("dob", [parsedDate.format("MM-DD-YYYY")]);
        }
      } else {
        setDob(null);
        setValue("dob", []);
      }
    }

    if (formData?.patient?.gender) {
      setGender(formData.patient.gender);
      setSelectedGender(formData.patient.gender);
      setValue("gender", formData.patient.gender);
    }
  }, [formData]);

  useEffect(() => {
    // make sure form knows the current selectedState (or empty string)
    setValue("state", selectedState || "", { shouldValidate: true });
    // Note: setValue will update RHF internal value so validation passes on submit
  }, [selectedState, setValue]);

  const onSubmit = async (data: BasicInfoFormFieldsType) => {
    const payload: Partial<IPatientBookingPatientInfoDTO> = {
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
        address2: data?.address2 || "",
        city: data?.city,
        latitude: data?.latitude || 0,
        longitude: data?.longitude || 0,
        state: data?.state,
        zip_code: data?.zip_code,
        driving_lic_back: backBase64 || "",
        driving_lic_front: frontBase64 || "",
      },
    };
    onNext(payload);
  };

  const onError = (error) => {
    if (error?.phone?.message) {
      const phoneElement = document.getElementById("phone-input");
      if (phoneElement) {
        phoneElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        phoneElement.focus();
      }
    }
    if (error?.dob?.message) {
      const dobElement = document.querySelector('[aria-labelledby="dob-input"]') as HTMLElement;

      if (dobElement) {
        dobElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        dobElement.focus();
      }
    }
  };
  const handleNext = handleSubmit(onSubmit, onError);

  return (
    <>
      <h1 className="heading-text text-foreground uppercase text-center">FEW QUICK QUESTIONS</h1>
      <div className="card-common">
        <div className="card-title">
          <h3 className="font-poppins font-semibold lg:text-3xl text-2xl">Basic Information</h3>
        </div>
        <form
          className="grid grid-cols-1  md:grid-cols-2 gap-y-4 gap-x-6 pt-5"
          onSubmit={handleNext}
        >
          <Input.Wrapper
            label="First Name"
            withAsterisk
            className="md:col-span-1 col-span-2"
            classNames={InputErrorMessage}
            error={getErrorMessage(errors?.first_name)}
          >
            <Input
              type="text"
              {...register("first_name")}
              disabled
              error={Boolean(errors?.first_name?.message)}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="Last Name"
            withAsterisk
            className="md:col-span-1 col-span-2"
            classNames={InputErrorMessage}
            error={getErrorMessage(errors?.last_name)}
          >
            <Input
              type="text"
              {...register("last_name")}
              disabled
              error={Boolean(errors?.last_name?.message)}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="Email"
            withAsterisk
            className="md:col-span-1 col-span-2"
            classNames={InputErrorMessage}
            error={getErrorMessage(errors?.email)}
          >
            <Input
              type="text"
              {...register("email")}
              disabled
              error={Boolean(errors?.email?.message)}
            />
          </Input.Wrapper>
          <Input.Wrapper
            id="phone-input"
            label="Phone Number"
            withAsterisk
            className="md:col-span-1 col-span-2"
            error={getErrorMessage(errors?.phone)}
            classNames={InputErrorMessage}
          >
            <Input
              component={IMaskInput}
              mask="(000) 000-0000"
              value={phone}
              {...register("phone")}
              onAccept={(value: string) => {
                setValue("phone", value, { shouldValidate: true });
                setPhone(value);
                clearErrors("phone");
              }}
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
              setSelectedGender(value);
              if (value) {
                clearErrors("gender");
              }
            }}
            name="gender"
            className="md:col-span-1 col-span-2 justify-start"
            classNames={InputErrorMessage}
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
            className="md:col-span-1 col-span-2"
            classNames={InputErrorMessage}
          >
            <div className={`${errors?.dob ? "baseWeb-error" : ""} dml-Input-wrapper dml-Input-Calendar relative`}>
              <StyletronProvider value={engine}>
                <BaseProvider theme={LightTheme}>
                  {/* <pre>{JSON.stringify(dob)}</pre> */}
                  <UberDatePicker
                    aria-labelledby="dob-input"
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
          <Select
            label="State"
            withAsterisk
            classNames={{
              wrapper: "bg-grey-btn rounded-md",
            }}
            rightSection={<i className="icon-down-arrow text-sm"></i>}
            searchable
            searchValue={stateSearchVal}
            onSearchChange={setStateSearchVal}
            value={selectedState}
            className="md:col-span-1 col-span-2 w-full"
            data={states?.map((item) => ({ value: item?.StateName, label: item?.StateName }))}
            {...register("state")}
            error={getErrorMessage(errors.state?.message)}
            onChange={(value, option) => {
              setValue("state", value || "", { shouldValidate: true });
              setSelectedState(value || "");
              if (value) {
                setStateSearchVal(option.label);
                clearErrors("state");
              }
            }}
          />
          <Input.Wrapper
            className="sm:col-span-1 col-span-2 w-full"
            label="Address"
            error={getErrorMessage(errors.address)}
            withAsterisk
          >
            <AddressAutoGoogle
              {...register("address")}
              address={address}
              state={state}
              isError={Boolean(errors?.address?.message)}
              onSelect={(address) => {
                if (address.address) {
                  const onlyAddress = address.address.split(",")[0];
                  setValue("address", onlyAddress, { shouldValidate: true });
                  setValue("city", address.city, { shouldValidate: true });
                  setValue("zip_code", address.zip_code || "", { shouldValidate: true });
                  setValue("latitude", Number(address?.latitude));
                  setValue("longitude", Number(address?.longitude));
                  setAddress(onlyAddress);
                  setZipCode(parseInt(address.zip_code || ""));
                  clearErrors("address");
                }
              }}
            />
          </Input.Wrapper>
          <Input.Wrapper
            className="sm:col-span-1 col-span-2 w-full"
            label="Suite/Apt"
            error={getErrorMessage(errors.address2)}
          >
            <Input
              {...register("address2")}
              error={getErrorMessage(errors.address2?.message)}
            />
          </Input.Wrapper>
          <Input.Wrapper
            className="md:col-span-1 col-span-2"
            label="Country"
            error={getErrorMessage(errors.country)}
            classNames={InputErrorMessage}
          >
            <Input
              type="text"
              value="USA"
              disabled
            />
          </Input.Wrapper>
          <Input.Wrapper
            className="md:col-span-1 col-span-2"
            label="City"
            withAsterisk
            error={getErrorMessage(errors.city)}
            classNames={InputErrorMessage}
          >
            <Input
              {...register("city")}
              error={getErrorMessage(errors.city?.message)}
              type="text"
            />
          </Input.Wrapper>
          <NumberInput
            {...register("zip_code")}
            className="md:col-span-1 col-span-2"
            classNames={InputErrorMessage}
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
          <div className="md:col-span-1 col-span-2">
            <h6 className="font-poppins extra-form-text-medium text-foreground mb-2">
              Upload Driving License (Front Side)<span className="dml-InputWrapper-required dml-NumberInput-required">*</span>
            </h6>
            <Dropzone
              onDrop={(files) => handleFileUpload(files, "front")}
              onReject={(rejectedFiles) => {
                if (rejectedFiles?.[0]?.errors?.[0]?.code == "file-too-large") {
                  dmlToast.error({ title: "File size should be less than 2MB." });
                }
              }}
              accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
              // maxSize={10 * 1024 ** 2} // 10MB limit
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
            {errors?.driving_lic_front?.message ? <p className="text-danger text-sm mt-2">Please upload an image of the front side of your driving license.</p> : ""}
            <p></p>
          </div>
          <div className="md:col-span-1 col-span-2">
            <h6 className="font-poppins extra-form-text-medium text-foreground mb-2">
              Upload Driving License (Back Side)<span className="dml-InputWrapper-required dml-NumberInput-required">*</span>
            </h6>
            <Dropzone
              onDrop={(files) => handleFileUpload(files, "back")}
              onReject={(rejectedFiles) => {
                if (rejectedFiles?.[0]?.errors?.[0]?.code == "file-too-large") {
                  dmlToast.error({ title: "File size should be less than 2MB." });
                }
              }}
              accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
              // maxSize={10 * 1024 ** 2} //10MB limit
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
            {errors?.driving_lic_back?.message ? <p className="text-danger text-sm mt-2">Please upload an image of the back side of your driving license.</p> : ""}
          </div>
        </form>
      </div>
      <div className="flex sm:justify-end justify-center mt-6">
        <Button
          w={256}
          onClick={handleNext}
          loading={isSubmitting}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default BasicInfo;
