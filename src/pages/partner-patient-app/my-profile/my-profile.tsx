import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IProfileImageDto } from "@/common/api/models/interfaces/User.model";
import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import userRepository from "@/common/api/repositories/userRepository";
import AddressAutoGoogle from "@/common/components/AddressAutoGoogle";
import DocumentTag from "@/common/components/DocumentTag";
import ProfileImageCropper from "@/common/components/ProfileImageCropper";
import { BaseWebDatePickerOverrides } from "@/common/configs/baseWebOverrides";
import dmlToast from "@/common/configs/toaster.config";
import { userAtom } from "@/common/states/user.atom";
import { useAuth } from "@/context/AuthContextProvider";
import ChangePasswordModal from "@/pages/admin-app/users/components/ChangePasswordModal";
import { PatientBasicInfoFormFieldsType, patientBasicInfoValidationSchema } from "@/pages/partner-patient-intake/validationSchema";
import { formatDate } from "@/utils/date.utils";
import { formatPhoneNumber, getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionIcon, Avatar, Button, Flex, Group, Image, Input, NumberInput, Radio, Table, Text } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { useDisclosure } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { BaseProvider, LightTheme } from "baseui";
import { Datepicker as UberDatePicker } from "baseui/datepicker";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Client as Styletron } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";

const MyProfile = () => {
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
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [userData, setUserDataAtom] = useAtom(userAtom);
  const [openImageCropper, ImageCropperModalHandler] = useDisclosure();
  const [openChangePassModal, changePassModalHandler] = useDisclosure();
  const [editing, handleEdit] = useDisclosure();
  const [slug, setSlug] = useState<string>("");

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

  const profileImageMutation = useMutation({ mutationFn: (payload: IProfileImageDto) => userRepository.profileImageUpdate(payload) });
  const { loadUserData } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<PatientBasicInfoFormFieldsType>({
    resolver: yupResolver(patientBasicInfoValidationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    setValue("first_name", userData?.userable?.first_name || "", { shouldValidate: true });
    setValue("last_name", userData?.userable?.last_name || "", { shouldValidate: true });
    setValue("phone", userData?.userable?.cell_phone?.toString() || "", { shouldValidate: true });
    setPhone(userData?.userable?.cell_phone || "");
    setValue("gender", userData?.userable?.gender || "", { shouldValidate: true });
    setGender(userData?.userable?.gender || "");
    setValue("dob", [formatDate(userData?.userable?.dob)]);
    setDob(new Date(userData?.userable?.dob));
    setValue("weight", userData?.userable?.weight || "", { shouldValidate: true });
    setWeight(userData?.userable?.weight || "");
    setValue("height", userData?.userable?.height || "", { shouldValidate: true });
    setHeight(userData?.userable?.height || "");
    setValue("address", userData?.userable?.address1 || "", { shouldValidate: true });
    setAddress(userData?.userable?.address1 || "");
    setValue("state", userData?.userable?.state || "", { shouldValidate: true });
    setValue("city", userData?.userable?.city || "", { shouldValidate: true });
    setValue("zip_code", userData?.userable?.zipcode || "", { shouldValidate: true });
    setZipCode(userData?.userable?.zipcode || "");
    setValue("driving_lic_front", userData?.userable?.driving_license_front || "", { shouldValidate: true });
    setFrontFile(`${import.meta.env.VITE_BASE_PATH}/storage/${userData?.userable?.driving_license_front}` || "");
    setValue("driving_lic_back", userData?.userable?.driving_license_back || "", { shouldValidate: true });
    setBackFile(`${import.meta.env.VITE_BASE_PATH}/storage/${userData?.userable?.driving_license_back}` || "");
    setSlug(userData?.userable?.u_id || "");
  }, [userData?.userable]);

  const onCropped = (form: string | ArrayBuffer | null | File) => {
    const image = form;
    if (userData?.u_id) {
      const payload: IProfileImageDto = { u_id: userData?.u_id, profile_image: image };
      profileImageMutation.mutate(payload, {
        onSuccess: (res) => {
          if (res.data?.data?.user?.id) {
            const updatedUserData = { ...userData, profile_image: res?.data?.data?.user?.profile_image };
            setUserDataAtom(updatedUserData);
            ImageCropperModalHandler.close();
          }
        },
        onError: (err) => {
          console.log(err);
        },
      });
    }
  };

  const updateBasicInfoMn = useMutation({ mutationFn: (payload: any) => partnerApiRepository.updatePartnerPatientBasicInfo(payload) });

  const handleSave = (data: PatientBasicInfoFormFieldsType) => {
    console.log(data);
    const payload: any = {
      u_id: slug,
      first_name: data?.first_name,
      last_name: data?.last_name,
      cell_phone: data?.phone,
      gender: data?.gender,
      dob: formatDate(data?.dob?.[0], "MM-DD-YYYY"),
      weight: data?.weight,
      height: data?.height,
      address: data?.address,
      state: data?.state,
      city: data?.city,
      zip_code: data?.zip_code,
      driving_lic_front: frontBase64 || "",
      driving_lic_back: backBase64 || "",
    };
    updateBasicInfoMn.mutate(payload, {
      onSuccess: (res) => {
        loadUserData();
        dmlToast.success({ title: "Profile data updated successfully." });
      },
      onError: (err) => {
        const error = err as AxiosError<IServerErrorResponse>;
        console.log(error);
        dmlToast.error({ title: "Oops, Something went wrong! Please try again later." });
      },
    });
    handleEdit.close();
  };

  const imageNameDisplay = (path?: string) => path?.split("/").pop() ?? "";

  return (
    <div className="space-y-5">
      <div className="dml-profile-content-inner">
        <div className="inner-title">
          <div className="flex items-center gap-2.5">
            <h6>Personal Information</h6>
          </div>
        </div>
        <div className="inner-wrapper">
          <div className="inner-wrapper-thumb">
            <Avatar
              src={`${import.meta.env.VITE_BASE_PATH}/storage/${userData?.profile_image}` || "/images/clinic-logo-blank.jpg"}
              size={208}
              radius={10}
              className="user-avatar"
              onClick={() => {
                ImageCropperModalHandler.open();
              }}
            >
              <img
                src="/images/profile-blank.svg"
                alt=""
              />
            </Avatar>

            <ProfileImageCropper
              openModal={openImageCropper}
              onModalClose={ImageCropperModalHandler.close}
              src={`${import.meta.env.VITE_BASE_PATH}/storage/${userData?.profile_image}`}
              cropped={onCropped}
              isLoading={profileImageMutation.isPending}
            />
          </div>
          <div className="inner-wrapper-text">
            <div className="wrapper-text-flex md:pr-10">
              <div className="text-name">
                <h6 className="text-secondary font-medium pb-2">Name</h6>
                <p className="text-grey-medium">{userData?.name}</p>
              </div>
              <div className="text-email">
                <h6 className="text-secondary font-medium pb-2">Email Address</h6>
                <p className="text-grey-medium">{userData?.email}</p>
              </div>
            </div>
            <div className="wrapper-text-flex md:pl-10">
              <div className="text-phone">
                <h6 className="text-secondary extra-form-text-medium pb-2">Phone/Mobile No</h6>
                <p className="text-grey-medium">{formatPhoneNumber(userData?.phone)}</p>
              </div>
              <div className="text-avail">
                <h6 className="text-secondary extra-form-text-medium pb-4">Password</h6>
                <button
                  type="button"
                  className="text-primary text-fs-sm !font-medium underline"
                  onClick={() => changePassModalHandler.open()}
                >
                  Change Password
                </button>
              </div>

              <ChangePasswordModal
                openModal={openChangePassModal}
                onModalClose={changePassModalHandler.close}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-title with-border flex justify-between">
          <h6>Basic Information</h6>
          {editing ? (
            <Flex
              align="center"
              gap="sm"
            >
              <Button
                variant="transparent"
                size="sm"
                type="button"
                classNames={{
                  label: "underline font-medium",
                }}
                onClick={handleEdit.close}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                type="button"
                onClick={handleSubmit(handleSave)}
              >
                Save
              </Button>
            </Flex>
          ) : (
            <Button
              variant="transparent"
              size="sm"
              type="button"
              classNames={{
                label: "text-primary underline text-xl/snug",
              }}
              onClick={handleEdit.open}
            >
              Edit
            </Button>
          )}
        </div>
        {editing ? (
          <form className="py-5">
            <div className="grid sm:grid-cols-2 gap-y-4 gap-x-6">
              <Input.Wrapper
                label="First Name"
                withAsterisk
                className="sm:col-span-1 col-span-2"
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
                className="sm:col-span-1 col-span-2"
                error={getErrorMessage(errors?.last_name)}
              >
                <Input
                  type="text"
                  {...register("last_name")}
                  error={Boolean(errors?.last_name?.message)}
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
              <NumberInput
                withAsterisk
                label="Weight(In Pounds)"
                value={weight}
                {...register("weight")}
                onChange={(value) => {
                  setWeight(value?.toString() || "");
                  setValue("weight", value.toString());
                  if (value) {
                    clearErrors("weight");
                  }
                }}
                error={getErrorMessage(errors?.weight)}
                min={0}
                max={999}
                hideControls
                clampBehavior="strict"
              />
              <NumberInput
                withAsterisk
                label="Height(In Inches)"
                value={height}
                {...register("height")}
                onChange={(value) => {
                  setHeight(value?.toString() || "");
                  setValue("height", value.toString());
                  if (value) {
                    clearErrors("height");
                  }
                }}
                error={getErrorMessage(errors?.height)}
                min={0}
                max={999}
                hideControls
                clampBehavior="strict"
              />
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
                <h6 className="extra-form-text-medium text-foreground mb-2">Upload Driving License (Front Side)</h6>
                <Dropzone
                  onDrop={(files) => handleFileUpload(files, "front")}
                  onReject={(rejectedFiles) => {
                    if (rejectedFiles?.[0]?.errors?.[0]?.code == "file-too-large") {
                      dmlToast.error({ title: "File size should be less than 2MB." });
                    }
                  }}
                  accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.pdf]}
                  maxSize={2 * 1024 ** 2} // 5MB limit
                  multiple={false} // Only allow one file
                  classNames={{
                    root: "relative w-full min-h-[220px] border-dashed border border-grey bg-grey-btn w-full cursor-pointer rounded-lg",
                    inner: "absolute !inset-0 !size-full",
                  }}
                >
                  {!frontFile ? (
                    <Group
                      justify="center"
                      gap="xl"
                      mih={220}
                      className="flex-col text-center pointer-events-none"
                    >
                      <Text>Drag & drop or click to upload</Text>
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
                <h6 className="extra-form-text-medium text-foreground mb-2">Upload Driving License (Back Side)</h6>
                <Dropzone
                  onDrop={(files) => handleFileUpload(files, "back")}
                  onReject={(rejectedFiles) => {
                    if (rejectedFiles?.[0]?.errors?.[0]?.code == "file-too-large") {
                      dmlToast.error({ title: "File size should be less than 2MB." });
                    }
                  }}
                  accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.pdf]}
                  maxSize={2 * 1024 ** 2}
                  multiple={false}
                  classNames={{
                    root: "relative w-full min-h-[220px] border-dashed border border-grey bg-grey-btn w-full cursor-pointer rounded-lg",
                    inner: "absolute !inset-0 !size-full",
                  }}
                >
                  {!backFile ? (
                    <Group
                      justify="center"
                      gap="xl"
                      mih={220}
                      className="flex-col text-center pointer-events-none"
                    >
                      <Text>Drag & drop or click to upload</Text>
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
            </div>
          </form>
        ) : (
          <div className="card-body">
            <Table
              withRowBorders={false}
              className="-ml-2.5 info-table info-table-lg"
            >
              <Table.Tbody className="text-lg secondary.3">
                <Table.Tr>
                  <Table.Th>First Name:</Table.Th>
                  <Table.Td>{userData?.userable?.first_name}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Last Name:</Table.Th>
                  <Table.Td>{userData?.userable?.last_name}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th className="font-normal">Phone/Mobile No:</Table.Th>
                  <Table.Td>{formatPhoneNumber(userData?.userable?.cell_phone)}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th className="font-normal">Gender:</Table.Th>
                  <Table.Td>{userData?.userable?.gender}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th className="font-normal">Date Of Birth:</Table.Th>
                  <Table.Td>{userData?.userable?.dob}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th className="font-normal">Weight (In Pounds):</Table.Th>
                  <Table.Td>{userData?.userable?.weight}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th className="font-normal">Height (In Inches):</Table.Th>
                  <Table.Td>{userData?.userable?.height}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th className="font-normal">Address:</Table.Th>
                  <Table.Td>{userData?.userable?.address1}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th className="font-normal">Country:</Table.Th>
                  <Table.Td>{"USA"}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th className="font-normal">State:</Table.Th>
                  <Table.Td>{userData?.userable?.state}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th className="font-normal">City:</Table.Th>
                  <Table.Td>{userData?.userable?.city}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th className="font-normal">Zip Code:</Table.Th>
                  <Table.Td>{userData?.userable?.zipcode}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th className="font-normal">Upload Driving License (Front & Back):</Table.Th>
                  <Table.Td>
                    {userData?.userable?.driving_license_front && userData?.userable?.driving_license_back ? (
                      <div className="flex flex-wrap gap-3">
                        <DocumentTag
                          badgeColor="bg-tag-bg text-foreground"
                          badgeText={imageNameDisplay(userData?.userable?.driving_license_front)}
                          childrenOne
                          childrenTwo
                        />
                        <DocumentTag
                          badgeColor="bg-tag-bg text-foreground"
                          badgeText={imageNameDisplay(userData?.userable?.driving_license_back)}
                          childrenOne
                          childrenTwo
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
