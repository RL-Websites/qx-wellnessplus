import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IMedicineListItem } from "@/common/api/models/interfaces/Medication.model";
import { IPartnerInviteDto } from "@/common/api/models/interfaces/Partner.model";
import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import AddressAutoGoogle from "@/common/components/AddressAutoGoogle";
import NoTableData from "@/common/components/NoTableData";
import ProfileImageCropper from "@/common/components/ProfileImageCropper";
import dmlToast from "@/common/configs/toaster.config";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionIcon, Avatar, Button, Group, Input, Modal, NumberInput, Radio, ScrollArea, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import AddMedicine from "./AddMedicine";
import { addPartnerValidationSchema, invitePartnerType } from "./addPartnerValidation";
interface ModalProps {
  openModal: boolean;
  onModalClose: (reason) => void;
}

interface ISelectedMedicineListItem extends IMedicineListItem {
  newPrice?: number;
}
const AddPartnerAccount = ({ openModal, onModalClose }: ModalProps) => {
  const [phone, setPhone] = useState<string>("");
  const [fax, setFax] = useState<string>("");
  const [logo, setLogo] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>("");
  const [openImageCropper, ImageCropperModalHandler] = useDisclosure();
  const [openMedicine, openMedicineHandler] = useDisclosure();
  const [paymentType, setPaymentType] = useState<string>("manual");
  const [selectedMedicines, setSelectedMedicines] = useState<ISelectedMedicineListItem[]>([]);

  const onCropped = (croppedFile: string | ArrayBuffer | null | File) => {
    if (croppedFile) {
      ImageCropperModalHandler.close();
      setValue("logo", croppedFile);
      const base64Logo = croppedFile as string;
      setLogo(base64Logo);
    }
  };

  const {
    register,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(addPartnerValidationSchema),
    defaultValues: {
      paymentType: "manual",
    },
  });

  const closeModal = (reason) => {
    onModalClose(reason);
    reset();
    setSelectedMedicines([]);
    setValue("logo", "");
    setLogo("");
    setPaymentType("manual");
    setCustomerId("");
    setValue("paymentType", "manual");
    setValue("stripe_connect_id", "");
    clearErrors();
  };

  const cancelModal = (reason) => {
    openMedicineHandler.close();
  };

  const invitePartnerMutation = useMutation({
    mutationFn: (payload: IPartnerInviteDto) => partnerApiRepository.AddInvitePartner(payload),
  });

  const handleAddPartnerAccount = (data: invitePartnerType) => {
    const payload: IPartnerInviteDto = {
      contact_person_name: data?.contact_person_name,
      account_name: data?.account_name,
      email: data?.email,
      phone: data?.phone,
      fax_number: data?.fax_number,
      address: data?.address,
      state: data?.state,
      city: data?.city,
      zip_code: data?.zip_code,
      stripe_connect_id: data?.stripe_connect_id || "",
      payment_type: data?.paymentType,
      medication_ids: selectedMedicines?.map((item) => ({ id: item?.id, price: item?.newPrice })),
      logo: data?.logo,
    };
    invitePartnerMutation.mutate(payload, {
      onSuccess(res) {
        dmlToast.success({
          title: "Customer invitation sent successfully",
        });
        reset();
        setSelectedMedicines([]);
        setValue("logo", "");
        setLogo("");
        onModalClose("success");
      },
      onError(err) {
        const error = err as AxiosError<IServerErrorResponse>;
        const errorMessage = error?.response?.data?.message || "Oops! Something went wrong, Please try again later.";
        dmlToast.error({ title: "Error", message: errorMessage });
      },
    });
  };

  const handleFormError = (error) => {
    console.log(error);
  };

  const rows = selectedMedicines.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td className="!pl-0">
        {item.name} {item.strength}
        {item.unit}
      </Table.Td>
      <Table.Td className="!pl-0">${item?.total_price}</Table.Td>
      <Table.Td className="!pl-0 w-[158px]">
        <Input
          type="number"
          value={item?.newPrice}
          onChange={(e) => {
            const medList = [...selectedMedicines];
            medList[index].newPrice = e.target.value ? parseFloat(e.target.value) : undefined;
            setSelectedMedicines(medList);
          }}
        />
      </Table.Td>
      <Table.Td className="text-right">
        <ActionIcon
          onClick={() => {
            const updated = [...selectedMedicines];
            updated.splice(index, 1);
            setSelectedMedicines(updated);
          }}
          variant="transparent"
          className="text-danger"
        >
          <i className="icon-delete text-xl/none"></i>
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Modal.Root
        opened={openModal}
        onClose={() => closeModal("dismiss")}
        size="1237px"
        centered
        closeOnClickOutside={false}
        classNames={{
          header: "sm:!px-10",
          body: "sm:!px-10 !pb-0",
        }}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Add Customer Account</Modal.Title>
            <ActionIcon
              onClick={() => closeModal("dismiss")}
              variant="transparent"
              size={24}
              color="foreground"
            >
              <i className="icon-cross text-2xl/none"></i>
            </ActionIcon>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(handleAddPartnerAccount, handleFormError)}>
              <div className="grid md:grid-cols-2 gap-y-4 gap-x-6">
                <Input.Wrapper
                  label="Name"
                  withAsterisk
                  className="col-span-2"
                  error={getErrorMessage(errors?.account_name)}
                >
                  <Input
                    type="text"
                    {...register("account_name")}
                    error={Boolean(errors?.account_name?.message)}
                  />
                </Input.Wrapper>
                <Input.Wrapper
                  label="Contact Name"
                  withAsterisk
                  className="md:col-span-1 col-span-2"
                  error={getErrorMessage(errors?.contact_person_name)}
                >
                  <Input
                    type="text"
                    {...register("contact_person_name")}
                    error={Boolean(errors?.contact_person_name?.message)}
                  />
                </Input.Wrapper>
                <Input.Wrapper
                  label="Email Address"
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
                <NumberInput
                  label="Phone Number"
                  hideControls
                  clampBehavior="strict"
                  withAsterisk
                  className="md:col-span-1 col-span-2"
                  value={phone}
                  {...register("phone")}
                  onChange={(value) => {
                    setValue("phone", value.toString());
                    // setPhone(value.toString());
                    clearErrors(`phone`);
                  }}
                  error={getErrorMessage(errors?.phone)}
                  max={9999999999}
                  min={0}
                  allowDecimal={false}
                  allowNegative={false}
                />
                <NumberInput
                  label="Fax Number"
                  hideControls
                  clampBehavior="strict"
                  className="md:col-span-1 col-span-2"
                  value={fax}
                  {...register("fax_number")}
                  onChange={(value) => {
                    setValue("fax_number", value.toString());
                    // setFax(value.toString());
                    clearErrors("fax_number");
                  }}
                  error={getErrorMessage(errors?.fax_number)}
                  max={9999999999}
                  min={0}
                  allowDecimal={false}
                  allowNegative={false}
                />
                <div className="col-span-2 mt-1">
                  <h6 className="extra-form-text-medium text-foreground font-uberText border-b border-b-grey-low mb-6 pb-2">Customer Logo</h6>
                  <Avatar
                    src={logo ? logo : ""}
                    size={208}
                    radius={10}
                    className="user-avatar"
                    onClick={ImageCropperModalHandler.open}
                  >
                    <img
                      src="/images/clinic-logo-blank.jpg"
                      alt=""
                    />
                  </Avatar>
                  <ProfileImageCropper
                    openModal={openImageCropper}
                    onModalClose={ImageCropperModalHandler.close}
                    src={`${import.meta.env.VITE_BASE_PATH}/storage/images/clinic-profile.png}`}
                    cropped={onCropped}
                    itemName="Customer logo"
                    isLoading={false}
                    fileType="base64"
                  />
                </div>
                <Input.Wrapper
                  label="Address"
                  withAsterisk
                  className="md:col-span-1 col-span-2"
                  error={getErrorMessage(errors?.address)}
                >
                  <AddressAutoGoogle
                    {...register("address")}
                    address={address}
                    isError={Boolean(errors?.address?.message)}
                    onSelect={(address) => {
                      if (address.address) {
                        const onlyAddress = address.address.split(",")[0];
                        setAddress(onlyAddress);
                        setValue(`address`, onlyAddress, { shouldValidate: true });
                        setValue(`state`, address?.state, { shouldValidate: true });
                        setValue(`city`, address?.city, { shouldValidate: true });
                        setValue(`zip_code`, address?.zip_code || "", { shouldValidate: true });
                        setZipCode(address?.zip_code || "");
                        clearErrors(`address`);
                      }
                    }}
                  />
                </Input.Wrapper>
                <Input.Wrapper
                  className="md:col-span-1 col-span-2"
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
                  className="md:col-span-1 col-span-2"
                  label="City"
                  withAsterisk
                  error={getErrorMessage(errors?.city)}
                >
                  <Input
                    {...register(`city`)}
                    error={Boolean(errors?.city?.message)}
                    type="text"
                  />
                </Input.Wrapper>
                <NumberInput
                  label="Zip Code"
                  withAsterisk
                  hideControls
                  className="md:col-span-1 col-span-2"
                  allowNegative={false}
                  allowDecimal={false}
                  value={zipCode}
                  {...register(`zip_code`)}
                  error={getErrorMessage(errors?.zip_code)}
                  max={99999}
                  min={0}
                  clampBehavior="strict"
                  onChange={(value) => {
                    setValue(`zip_code`, value.toString());
                    setZipCode(value.toString());
                    if (value) {
                      clearErrors(`zip_code`);
                    }
                  }}
                />
                <div className="col-span-2 mt-1">
                  <h6 className="extra-form-text-medium text-foreground font-uberText border-b border-b-grey-low mb-6 pb-2">Payment Type</h6>
                  <div className="grid grid-cols-2 gap-x-6">
                    <Radio.Group
                      value={paymentType}
                      defaultValue={paymentType}
                      onChange={(value) => {
                        setPaymentType(value);
                        setValue("paymentType", value);
                        clearErrors("paymentType");
                        if (value === "manual") {
                          setCustomerId("");
                          setValue("stripe_connect_id", "");
                        }
                      }}
                      label="Select Payment Type"
                      error={getErrorMessage(errors?.paymentType)}
                    >
                      <Group mt="xs">
                        <Radio
                          value="manual"
                          label="Manual Payment"
                          color="dark"
                          {...register("paymentType")}
                        />
                        <Radio
                          value="stripe"
                          label="Stripe Connection"
                          color="dark"
                          {...register("paymentType")}
                        />
                      </Group>
                    </Radio.Group>

                    {/* Only show this when paymentType is 'stripe' */}
                    {paymentType === "stripe" && (
                      <NumberInput
                        label="Customer Stripe Connect ID"
                        withAsterisk
                        hideControls
                        allowNegative={false}
                        allowDecimal={false}
                        value={customerId}
                        {...register(`stripe_connect_id`)}
                        error={getErrorMessage(errors?.stripe_connect_id)}
                        max={9999999999}
                        min={0}
                        clampBehavior="strict"
                        onChange={(value) => {
                          setValue(`stripe_connect_id`, value.toString());
                          setCustomerId(value.toString());
                          if (value) {
                            clearErrors(`stripe_connect_id`);
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              {selectedMedicines?.length > 0 ? (
                ""
              ) : (
                <div className="flex flex-wrap items-center sm:justify-between justify-center pt-10">
                  <label className="text-foreground font-medium">Assign Medication</label>
                  <Button
                    variant="transparent"
                    classNames={{
                      label: "text-primary underline font-medium",
                    }}
                    onClick={() => openMedicineHandler.open()}
                  >
                    Assign Medication(s)
                  </Button>
                </div>
              )}
              {selectedMedicines.length > 0 && (
                <>
                  <div className="flex flex-wrap items-center sm:justify-between justify-center pt-10">
                    <label className="text-foreground font-medium">Assign Medication</label>
                    <Button
                      variant="transparent"
                      classNames={{
                        label: "text-primary underline font-medium",
                      }}
                      onClick={() => openMedicineHandler.open()}
                    >
                      Assign Medication(s)
                    </Button>
                  </div>
                  <ScrollArea
                    scrollbarSize={6}
                    miw={320}
                    scrollbars="x"
                  >
                    <Table
                      verticalSpacing="md"
                      withRowBorders={false}
                      striped
                      stripedColor="background"
                      highlightOnHover
                      highlightOnHoverColor="primary.0"
                      className="dml-list-table"
                    >
                      <Table.Thead className="border-b border-grey-low">
                        <Table.Tr>
                          <Table.Th className="!pl-0 text-nowrap">Product Name</Table.Th>
                          <Table.Th className="!pl-0 text-nowrap">Total Cost</Table.Th>
                          <Table.Th className="!pl-0 text-nowrap">Selling Price</Table.Th>
                          <Table.Th className="text-right">Action</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>{rows?.length > 0 ? rows : <NoTableData colSpan={3} />}</Table.Tbody>
                    </Table>
                  </ScrollArea>
                </>
              )}

              <div className="w-full flex justify-between mt-6 mb-20">
                <div className="flex gap-3 sm:ms-auto sm:mx-0 mx-auto">
                  {/* <Button
                          c="foreground"
                          color="grey.4"
                          w={256}
                          onClick={handleBack}
                        >
                          Back
                        </Button> */}
                  <Button
                    w={256}
                    type="submit"
                    loading={invitePartnerMutation.isPending}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      <AddMedicine
        openModal={openMedicine}
        onModalClose={(reason) => {
          if (reason === "submit") {
            openMedicineHandler.close();
          } else {
            cancelModal(reason);
          }
        }}
        prevMedicine={selectedMedicines}
        onSave={(medicines) => {
          const newMedicines = medicines
            .filter((item) => !selectedMedicines.some((selected) => selected.id === item.id))
            .map((item) => ({ ...item, newPrice: item.total_price ? parseFloat(item.total_price) : undefined }));
          const medicineList = [...selectedMedicines, ...newMedicines];
          setSelectedMedicines([...medicineList]);
        }}
      />
    </>
  );
};

export default AddPartnerAccount;
