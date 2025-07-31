import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IAdminBasicInfoDto, IProfileImageDto } from "@/common/api/models/interfaces/User.model";
import userRepository from "@/common/api/repositories/userRepository";
import ProfileImageCropper from "@/common/components/ProfileImageCropper";
import dmlToast from "@/common/configs/toaster.config";
import { Locations } from "@/common/constants/locations";
import { ILocation } from "@/common/models/location";
import { userAtom } from "@/common/states/user.atom";
import { formatPhoneNumber, getErrorMessage, getLocName } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Avatar, Button, Group, Input, NumberInput, Select, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtom } from "jotai/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import ChangePasswordModal from "./components/ChangePasswordModal";

const basicInfoSchema = yup.object({
  first_name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("First name is"),
  last_name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Last name"),
  phone: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .length(10, "Number must be 10 digits")
    .label("Number"),
  address: yup.string().required("Address is required").min(5, "Address must be at least 5 characters long"),
  country: yup.string(),
  city: yup.string(),
  state: yup.string(),
  zipCode: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Zip code"),
});

type basicInfoType = yup.InferType<typeof basicInfoSchema>;

function ProfilePage(formData: any) {
  const [zipCode, setZipCode] = useState<number | string>("");

  const [states, setStates] = useState<ILocation[]>([]);
  const [cities, setCities] = useState<Array<object>>([]);
  const [city, setCity] = useState<string>("");
  const [userData, setUserDataAtom] = useAtom(userAtom);
  const [mobileNumber, setMobileNumber] = useState<string>("");

  const [basicInfoEditing, basicInfoEditHandler] = useDisclosure();
  const [openImageCropper, ImageCropperModalHandler] = useDisclosure();
  const [openChangePassModal, changePassModalHandler] = useDisclosure();
  const {
    handleSubmit: basicInfoHandleSubmit,
    setValue: basicInfoSetValue,
    formState: { errors: basicInfoErrors },
    register: basicInfoRegister,
    reset: basicInfoReset,
    clearErrors: basicInfoClearErrors,
    setValue,
    clearErrors,
  } = useForm({
    resolver: yupResolver(basicInfoSchema),
    defaultValues: {
      first_name: userData?.first_name,
      last_name: userData?.last_name,
      phone: userData?.phone,
      address: userData?.addressable?.address1,
      state: userData?.addressable?.state_id?.toString(),
      city: userData?.addressable?.city_id?.toString(),
      zipCode: userData?.addressable?.zip_code.toString(),
      country: "USA",
    },
  });

  useEffect(() => {
    setStates(Locations.filter((item) => item.type.toLowerCase() == "state"));
  }, []);

  useEffect(() => {
    if (formData?.zip_code) {
      setZipCode(formData?.zipCode);
      setValue("zipCode", formData?.zipCode);
    }
  }, [formData, setValue]);

  const basicInfoMutation = useMutation({ mutationFn: (payload: IAdminBasicInfoDto) => userRepository.updateUserData(payload) });

  const setBasicInfoFormData = (data) => {
    basicInfoReset({
      first_name: data?.first_name,
      last_name: data?.last_name,
      phone: data?.phone,
      address: data?.addressable?.address1,
      state: data?.addressable?.state_id?.toString(),
      city: data?.addressable?.city_id?.toString(),
      zipCode: data?.addressable?.zip_code,
      country: "USA",
    });
    setMobileNumber(data?.phone);
    setZipCode(data?.addressable?.zip_code);
  };

  const basicInfoEdit = () => {
    if (Locations?.length) {
      setCities(
        Locations?.filter((location) => {
          return location?.parent_id == userData?.addressable?.state_id;
        })
      );
    }
    setBasicInfoFormData(userData);
    basicInfoSetValue("phone", userData?.phone);
    setCity(getLocName(userData?.addressable?.city_id));
    basicInfoEditHandler.open();
  };

  const submitBasicInfo = (data: basicInfoType) => {
    const payload: IAdminBasicInfoDto = {
      first_name: data?.first_name || "",
      last_name: data?.last_name || "",
      email: userData?.email || "",
      phone: data?.phone || "",
      country: "USA",
      address: data?.address || "",
      city_id: data?.city || "",
      state_id: data?.state || "",
      zip_code: data?.zipCode?.toString() || "",
      u_id: userData?.u_id || "",
      _method: "put",
      dob: userData?.dob || null,
    };
    basicInfoMutation.mutate(payload, {
      onSuccess: (res) => {
        setUserDataAtom(res?.data?.data);
        setBasicInfoFormData(res?.data?.data);
        dmlToast.success({
          title: "Your Information has been updated successfully",
        });
        basicInfoEditHandler.close();
      },
      onError: (error) => {
        const err = error as AxiosError<IServerErrorResponse>;
        dmlToast.error({
          message: "",
          title: err?.response?.data?.message,
          color: "danger",
          withCloseButton: true,
        });
      },
    });
  };

  const profileImageMutation = useMutation({ mutationFn: (payload: IProfileImageDto) => userRepository.profileImageUpdate(payload) });

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

  return (
    <>
      <div className="dml-profile">
        <h2 className="text-grey-medium pb-5">User Profile</h2>
        <div className="dml-profile-content">
          <div className="dml-profile-content-inner">
            <div className="inner-title">
              <div className="flex gap-2.5 items-center">
                <h6>Personal Information</h6>
                <span className="capitalize inner-title-tag">{userData?.userable_type || ""}</span>
              </div>
              {/* <button
                type="button"
                className="heading-xs text-primary ms-auto me-4"
                onClick={() => changePassModalHandler.open()}
              >
                Change Password
              </button> */}
              {/* <button
                type="button"
                className="heading-xs text-primary"
              >
                Edit
              </button> */}
            </div>

            <div className="inner-wrapper">
              <div className="inner-wrapper-thumb text-center">
                <Avatar
                  src={`${import.meta.env.VITE_BASE_PATH}/storage/${userData?.profile_image}` || "/images/profile-blank.svg"}
                  size={208}
                  radius={10}
                  className="user-avatar"
                  onClick={ImageCropperModalHandler.open}
                >
                  <img
                    src="/images/profile-blank.svg"
                    alt=""
                  />
                </Avatar>
                {/* <button
                  onClick={ImageCropperModalHandler.open}
                  className="text-primary underline font-bold font-uber mt-2"
                >
                  Change Image
                </button> */}
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
                    <h6 className="text-secondary font-medium pb-2">Email</h6>
                    <p className="text-grey-medium">{userData?.email}</p>
                  </div>
                </div>
                <div className="wrapper-text-flex md:pl-10">
                  <div>
                    <h6 className="text-secondary extra-form-text-medium pb-2">Password</h6>
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
          <div className="dml-profile-content-inner">
            <div className="inner-title">
              <div className="flex gap-2.5 items-center">
                <h6>Basic Information</h6>
              </div>
              <Group ms="auto">
                {basicInfoEditing ? (
                  <>
                    <button
                      className="text-foreground underline text-fs-lg"
                      onClick={basicInfoEditHandler.close}
                    >
                      Cancel
                    </button>
                    <Button
                      size="sm"
                      onClick={basicInfoHandleSubmit(submitBasicInfo)}
                      loading={basicInfoMutation.isPending}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="text-fs-lg text-primary"
                    onClick={basicInfoEdit}
                  >
                    Edit
                  </button>
                )}
              </Group>
            </div>
            {basicInfoEditing ? (
              <div className="inner-wrapper">
                <form className="grid grid-cols-2 gap-6 w-full">
                  <Input.Wrapper
                    label="First Name"
                    className=""
                    error={basicInfoErrors?.first_name?.message || ""}
                  >
                    <Input
                      type="text"
                      {...basicInfoRegister("first_name")}
                    />
                  </Input.Wrapper>
                  <Input.Wrapper
                    label="Last Name"
                    className=""
                    error={basicInfoErrors?.last_name?.message || ""}
                  >
                    <Input
                      type="text"
                      {...basicInfoRegister("last_name")}
                    />
                  </Input.Wrapper>

                  <NumberInput
                    {...basicInfoRegister("phone")}
                    onChange={(value) => {
                      if (value) {
                        basicInfoSetValue("phone", value?.toString());
                        basicInfoClearErrors("phone");
                      }
                      setMobileNumber(value?.toString());
                    }}
                    value={mobileNumber}
                    label="Mobile Number"
                    error={getErrorMessage(basicInfoErrors.phone)}
                    max={9999999999}
                    min={0}
                    hideControls
                    clampBehavior="strict"
                    allowDecimal={false}
                    allowNegative={false}
                  />
                  <Input.Wrapper
                    label="Address"
                    className=""
                    error={basicInfoErrors?.address?.message || ""}
                  >
                    <Input
                      type="text"
                      {...basicInfoRegister("address")}
                    />
                  </Input.Wrapper>

                  <Select
                    data={[{ value: "1", label: "USA" }]}
                    label="Country"
                    defaultValue={"1"}
                    rightSection={<i className="icon-down-arrow text-sm"></i>}
                    disabled
                    classNames={{
                      wrapper: "bg-grey-btn rounded-md",
                    }}
                    {...basicInfoRegister("country")}
                    onChange={() => basicInfoSetValue("country", "1", { shouldValidate: true })}
                  />

                  <Select
                    label="State"
                    classNames={{
                      wrapper: "bg-grey-btn rounded-md",
                    }}
                    {...basicInfoRegister("state")}
                    defaultValue={userData?.addressable?.state_id?.toString()}
                    rightSection={<i className="icon-down-arrow text-sm"></i>}
                    onChange={(value) => {
                      basicInfoSetValue("state", value || "", { shouldValidate: true });
                      // basicInfoSetValue("city", "");
                      setCities(
                        Locations?.filter((location) => {
                          return location?.parent_id == value;
                        })
                      );
                      setCity("");
                    }}
                    searchable
                    data={states?.map((location) => ({
                      value: location?.id?.toString(),
                      label: location?.name || "",
                    }))}
                  />
                  <Select
                    label="City"
                    defaultValue={userData?.addressable?.city_id?.toString()}
                    classNames={{
                      wrapper: "bg-grey-btn rounded-md",
                    }}
                    {...basicInfoRegister("city")}
                    searchable
                    searchValue={city}
                    onSearchChange={setCity}
                    rightSection={<i className="icon-down-arrow text-sm"></i>}
                    onChange={(value, option) => {
                      basicInfoSetValue("city", value || "", { shouldValidate: true });
                      setCity(option.label || "");
                    }}
                    data={cities.map((city: any) => ({
                      value: city.id?.toString(),
                      label: city?.name,
                    }))}
                  />
                  {/* <Input.Wrapper
                    label="Zip Code"
                    className=""
                  >
                    <Input
                      type="text"
                      {...basicInfoRegister("zipCode")}
                    />
                  </Input.Wrapper> */}

                  <NumberInput
                    className="w-full"
                    {...basicInfoRegister("zipCode")}
                    onChange={(value) => {
                      if (value) {
                        setValue("zipCode", value.toString());
                        clearErrors("zipCode");
                      }
                      setZipCode(value?.toString());
                    }}
                    label="Zip Code"
                    error={getErrorMessage(basicInfoErrors.zipCode)}
                    max={9999999999}
                    min={0}
                    hideControls
                    clampBehavior="strict"
                    allowNegative={false}
                    value={zipCode}
                  />
                </form>
              </div>
            ) : (
              <div className="inner-wrapper">
                <Table withRowBorders={false}>
                  <Table.Tbody className="text-lg secondary.3">
                    <Table.Tr>
                      <Table.Th className="font-normal w-3/12">Phone/Mobile No:</Table.Th>
                      <Table.Td className="w-9/12">{userData?.phone ? `${formatPhoneNumber(userData?.phone)}` : "N/A"}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th className="font-normal">Address:</Table.Th>
                      <Table.Td>{userData?.addressable?.address1 || "NA"}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th className="font-normal">City:</Table.Th>
                      <Table.Td>{getLocName(userData?.addressable?.city_id) || "NA"}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th className="font-normal">State:</Table.Th>
                      <Table.Td>{getLocName(userData?.addressable?.state_id) || "NA"}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th className="font-normal">Zip Code:</Table.Th>
                      <Table.Td>{userData?.addressable?.zip_code || "NA"}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th className="font-normal">Country:</Table.Th>
                      <Table.Td>USA</Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
