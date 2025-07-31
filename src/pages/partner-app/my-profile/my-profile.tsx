import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IPartnerMedicineListItem } from "@/common/api/models/interfaces/Medication.model";
import { IProfileImageDto } from "@/common/api/models/interfaces/User.model";
import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import userRepository from "@/common/api/repositories/userRepository";
import NoTableData from "@/common/components/NoTableData";
import ProfileImageCropper from "@/common/components/ProfileImageCropper";
import dmlToast from "@/common/configs/toaster.config";
import { userAtom } from "@/common/states/user.atom";
import { useAuth } from "@/context/AuthContextProvider";
import ChangePasswordModal from "@/pages/admin-app/users/components/ChangePasswordModal";
import { formatPhoneNumber, getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Avatar, Button, Flex, Input, NumberInput, ScrollAreaAutosize, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import PriceUpdateHistory from "../common/PriceUpdateHistory";

const personalInfoFormSchema = yup.object({
  name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Name"),
  contact_person_name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Contact name"),
  phone: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .length(10, "Phone number must be 10 digits long")
    .label("Phone number"),
  fax_number: yup.string(),
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
  const [openPriceHistoryModal, handlePriceHistoryModal] = useDisclosure();
  const [medicines, setMedicines] = useState<IPartnerMedicineListItem[]>([]);
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

  const fetchMedicine = () => {
    const params = {};
    return partnerApiRepository.getAllPartnerMedicines(params);
  };

  const useMedicineQuery = useQuery({ queryKey: ["MedicineList"], queryFn: fetchMedicine });

  useEffect(() => {
    if (useMedicineQuery.isFetched && useMedicineQuery.data?.status === 200) {
      const dataList = useMedicineQuery.data.data?.data?.data || [];
      setMedicines(dataList);
    }
  }, [useMedicineQuery.data?.data?.data?.data]);

  useEffect(() => {
    basicInfoSetValue("name", userData?.name || "", { shouldValidate: true });
    basicInfoSetValue("contact_person_name", userData?.userable?.contact_person_name || "", { shouldValidate: true });
    basicInfoSetValue("phone", userData?.phone?.toString() || "", { shouldValidate: true });
    basicInfoSetValue("fax_number", userData?.userable?.fax_number ? userData?.userable?.fax_number?.toString() : "", { shouldValidate: true });
    setPhone(userData?.phone || "");
    setFax(userData?.userable?.fax_number ? userData?.userable?.fax_number?.toString() : "");
    setSlug(userData?.userable?.slug || "");
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

  const updateBasicInfoMn = useMutation({ mutationFn: (payload: any) => partnerApiRepository.updatePartnerBasicInfo(payload) });

  const handleSave = (data: personalInfoFormType) => {
    console.log(data);
    const payload: any = {
      slug: slug,
      account_name: data?.name,
      contact_person_name: data?.contact_person_name,
      phone: data?.phone,
      fax_number: data?.fax_number,
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

  const rows = medicines?.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td className="!pl-0">{item.medicine?.name}</Table.Td>
      <Table.Td className="!pl-0 text-end">${item?.price}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <div className="page-title pb-5">
        <div className="page-title-start">
          <h6 className="lg:h2 md:h3 sm:h4">User Profile</h6>
        </div>
      </div>
      <div className="dml-profile-content-inner">
        <div className="inner-title">
          <div className="flex items-center gap-2.5">
            <h6>Personal Information</h6>
          </div>
          {userData?.userable_type == "customer_standard_user" ? (
            ""
          ) : editing ? (
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
              <Input.Wrapper
                label="Contact Person Name"
                withAsterisk
                error={getErrorMessage(errors?.name)}
              >
                <Input
                  type="text"
                  {...register("contact_person_name")}
                  error={Boolean(errors?.contact_person_name?.message)}
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
                {...register("fax_number")}
                onChange={(value) => {
                  basicInfoSetValue("fax_number", value.toString());
                  setFax(value.toString());
                  if (value) {
                    clearErrors("fax_number");
                  }
                }}
                error={getErrorMessage(errors?.fax_number)}
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
                  <p className="text-grey-medium">{userData?.name}</p>
                </div>
                <div className="text-name">
                  <h6 className="text-secondary font-medium pb-2">Contact Person Name</h6>
                  <p className="text-grey-medium">{userData?.userable?.contact_person_name}</p>
                </div>
                <div className="text-email">
                  <h6 className="text-secondary font-medium pb-2">Email Address</h6>
                  <p className="text-grey-medium">{userData?.email}</p>
                </div>
                <div className="text-medicine">
                  <h6 className="text-secondary extra-form-text-medium pb-2">Total Medicine Sold</h6>
                  <p className="text-grey-medium">{userData?.prescription_count ? userData?.prescription_count : "0"}</p>
                </div>
              </div>
              <div className="wrapper-text-flex md:pl-10">
                <div className="text-phone">
                  <h6 className="text-secondary extra-form-text-medium pb-2">Phone/Mobile No</h6>
                  <p className="text-grey-medium">{formatPhoneNumber(userData?.phone)}</p>
                </div>
                <div className="text-phone">
                  <h6 className="text-secondary extra-form-text-medium pb-2">Fax Number</h6>
                  <p className="text-grey-medium">{formatPhoneNumber(userData?.userable?.fax_number)}</p>
                </div>
                {userData?.userable_type === "customer_standard_user" ? (
                  ""
                ) : (
                  <div className="text-client">
                    <h6 className="text-secondary extra-form-text-medium pb-2">Associated Client</h6>
                    <p className="text-grey-medium">{userData?.client?.name}</p>
                  </div>
                )}

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
        )}
      </div>
      <div className="card mt-5">
        <div className="card-title with-border flex items-center">
          <h6 className="text-lg font-bold">Assigned Medication</h6>
          <Button
            variant="transparent"
            className="ml-auto"
            px={0}
            classNames={{
              label: "text-primary underline font-medium",
            }}
            onClick={handlePriceHistoryModal.open}
          >
            Price Update History
          </Button>
        </div>
        <div className="card-body">
          <ScrollAreaAutosize>
            <Table
              verticalSpacing="md"
              withRowBorders={false}
              stripedColor="background"
              highlightOnHover
              highlightOnHoverColor="primary.0"
              className="dml-list-table"
            >
              <Table.Thead className="border-b border-grey-low">
                <Table.Tr>
                  <Table.Th className="!pl-0">Medicine Name</Table.Th>
                  <Table.Th className="!pl-0 text-end">Price</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows?.length > 0 ? (
                  rows
                ) : (
                  <NoTableData
                    imgClass="mt-0 mb-3 w-[200px]"
                    titleClass="font-semibold text-foreground text-lg"
                    title="No medication assigned"
                    colSpan={2}
                  />
                )}
              </Table.Tbody>
            </Table>
          </ScrollAreaAutosize>
        </div>
      </div>
      <PriceUpdateHistory
        openModal={openPriceHistoryModal}
        onModalClose={handlePriceHistoryModal.close}
        partnerId={userData?.userable_id}
      />
    </>
  );
};

export default MyProfile;
