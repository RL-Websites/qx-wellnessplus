import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IPartnerClientUpdateDTO } from "@/common/api/models/interfaces/client.model";
import { IProfileImageDto } from "@/common/api/models/interfaces/User.model";
import addClientApiRepository from "@/common/api/repositories/clientRepositoiry";
import userRepository from "@/common/api/repositories/userRepository";
import ProfileImageCropper from "@/common/components/ProfileImageCropper";
import dmlToast from "@/common/configs/toaster.config";
import { userAtom } from "@/common/states/user.atom";
import { useAuth } from "@/context/AuthContextProvider";
import ChangePasswordModal from "@/pages/admin-app/users/components/ChangePasswordModal";
import { formatPhoneNumber, getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Avatar, Button, Flex, Input, NumberInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const personalInfoFormSchema = yup.object({
  name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Name"),
  phone: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .length(10, "Phone number must be 10 digits long")
    .label("Phone number"),
  fax: yup.string(),
});

type personalInfoFormType = yup.InferType<typeof personalInfoFormSchema>;

const MyProfile = () => {
  const [userData, setUserDataAtom] = useAtom(userAtom);
  const [phone, setPhone] = useState<string>("");
  const [fax, setFax] = useState<string>("");
  const [openImageCropper, ImageCropperModalHandler] = useDisclosure();
  const [openChangePassModal, changePassModalHandler] = useDisclosure();
  const [editing, handleEdit] = useDisclosure();
  const [slug, setSlug] = useState<string>("");
  const profileImageMutation = useMutation({ mutationFn: (payload: IProfileImageDto) => userRepository.profileImageUpdate(payload) });
  const { loadUserData } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue: basicInfoSetValue,
    clearErrors,
  } = useForm<personalInfoFormType>({
    resolver: yupResolver(personalInfoFormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    basicInfoSetValue("name", userData?.userable?.name || "", { shouldValidate: true });
    basicInfoSetValue("phone", userData?.userable?.phone ? userData?.userable?.phone?.toString() : "", { shouldValidate: true });
    basicInfoSetValue("fax", userData?.userable?.fax ? userData?.userable?.fax?.toString() : "", { shouldValidate: true });
    setPhone(userData?.userable?.phone ? userData?.userable?.phone?.toString() : "");
    setFax(userData?.userable?.fax ? userData?.userable?.fax?.toString() : "");
    setSlug(userData?.userable?.slug || "");
  }, [userData?.userable]);

  const onCropped = (form: string | ArrayBuffer | null | File) => {
    const image = form;
    if (userData?.u_id) {
      const payload: IProfileImageDto = { u_id: userData?.u_id, profile_image: image };
      profileImageMutation.mutate(payload, {
        onSuccess: (res) => {
          if (res.data?.data?.user?.id) {
            const updatedData = { ...userData, profile_image: res?.data?.data?.user?.profile_image };
            setUserDataAtom(updatedData);
            ImageCropperModalHandler.close();
          }
        },
        onError: (err) => {
          console.log(err);
        },
      });
    }
  };

  const updateBasicInfoMn = useMutation({ mutationFn: (payload: IPartnerClientUpdateDTO) => addClientApiRepository.updatePartnerClientBasicInfo(payload) });

  const handleSave = (data: personalInfoFormType) => {
    console.log(data);
    const payload: IPartnerClientUpdateDTO = {
      slug: slug,
      name: data?.name,
      phone: data?.phone,
      fax: data?.fax,
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

  return (
    <div className="dml-profile-content-inner">
      <div className="inner-title">
        <div className="flex items-center gap-2.5">
          <h6>Personal Information</h6>
        </div>
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
          <div className="grid lg:grid-cols-2 gap-6">
            <Input.Wrapper
              label="Name"
              withAsterisk
              error={getErrorMessage(errors?.name)}
            >
              <Input
                type="text"
                {...register("name")}
                error={Boolean(errors?.name?.message)}
              />
            </Input.Wrapper>

            <NumberInput
              label="Phone/Mobile No"
              hideControls
              clampBehavior="strict"
              withAsterisk
              className="col-span-1"
              value={phone}
              {...register("phone")}
              onChange={(value) => {
                basicInfoSetValue("phone", value.toString());
                setPhone(value.toString());
                if (value) {
                  clearErrors(`phone`);
                }
              }}
              error={getErrorMessage(errors?.phone)}
              max={9999999999}
              min={0}
            />

            <NumberInput
              label="Fax Number"
              hideControls
              clampBehavior="strict"
              className="col-span-1"
              value={fax}
              {...register("fax")}
              onChange={(value) => {
                basicInfoSetValue("fax", value.toString());
                setFax(value.toString());
                if (value) {
                  clearErrors("fax");
                }
              }}
              error={getErrorMessage(errors?.fax)}
              max={9999999999}
              min={0}
            />
          </div>
        </form>
      ) : (
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
                <p className="text-grey-medium">{userData?.userable?.name}</p>
              </div>
              <div className="text-email">
                <h6 className="text-secondary font-medium pb-2">Email Address</h6>
                <p className="text-grey-medium">{userData?.userable?.email}</p>
              </div>
              <div className="text-medicine">
                <h6 className="text-secondary extra-form-text-medium pb-2">Total Medicine Sold</h6>
                <p className="text-grey-medium">{userData?.prescription_count}</p>
              </div>
            </div>
            <div className="wrapper-text-flex md:pl-10">
              <div className="text-phone">
                <h6 className="text-secondary extra-form-text-medium pb-2">Phone/Mobile No</h6>
                <p className="text-grey-medium">{formatPhoneNumber(userData?.userable?.phone)}</p>
              </div>
              <div className="text-phone">
                <h6 className="text-secondary extra-form-text-medium pb-2">Fax Number</h6>
                <p className="text-grey-medium">{formatPhoneNumber(userData?.userable?.fax)}</p>
              </div>

              {/* <div className="text-avail">
                <h6 className="text-secondary extra-form-text-medium pb-4">Password</h6>
                <button
                  type="button"
                  className="text-primary text-fs-sm !font-medium underline"
                  onClick={() => changePassModalHandler.open()}
                >
                  Change Password
                </button>
              </div> */}

              <ChangePasswordModal
                openModal={openChangePassModal}
                onModalClose={changePassModalHandler.close}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
