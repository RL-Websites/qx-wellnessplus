import { useMedicineForm } from "@/common/api/hooks/PartnerMedicineFormHook";
import { IMedicineListItem } from "@/common/api/models/interfaces/Medication.model";
import addClientApiRepository from "@/common/api/repositories/clientRepositoiry";
import pharmacyRepository from "@/common/api/repositories/pharmacyRepository";
import DynamicBreadcrumbs from "@/common/components/Breadcrumbs";
import ProfileImageCropper from "@/common/components/ProfileImageCropper";
import RichDetails from "@/common/components/RichDetails";
import { getErrorMessage } from "@/utils/helper.utils";
import { Avatar, Button, Group, Input, NumberInput, Paper, Radio, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

function AddProductPage() {
  const { id } = useParams();
  const [serviceFee, setServiceFee] = useState<string | number>("");
  const [image, setImage] = useState<string>("");
  const [price, setPrice] = useState<string | number>("");
  const [dose, setDose] = useState<string | number>("");
  const [unit, setUnite] = useState<string | undefined>("");
  const [group, setGroup] = useState<string | undefined>("");
  const [medCategory, setMedCategory] = useState<string | undefined>("");
  const [medType, setMedType] = useState<string | undefined>("");
  const [doctorFee, setDoctorFee] = useState<number | null>();
  const [shippingFee, setShippingFee] = useState<string | number>();
  const [productDetails, setProductDetails] = useState<IMedicineListItem>();
  const [isResearched, setIsResearched] = useState<string>("0");
  const [openImageCropper, ImageCropperModalHandler] = useDisclosure();

  const onCropped = (croppedFile: string | ArrayBuffer | null | File) => {
    if (croppedFile) {
      ImageCropperModalHandler.close();
      setValue("image", croppedFile);
      const base64Logo = croppedFile as string;
      setImage(base64Logo);
    }
  };

  const { register, handleSubmit, errors, setValue, watch, getValues, onSubmit, clearErrors, isLoading, dosage_directions, remove, append } = useMedicineForm(id);

  const medicineDetailsQuery = useQuery({
    queryKey: ["medicineEditQuery", id],
    queryFn: () => addClientApiRepository.getClientProductDetails(id || ""),
    enabled: !!id,
  });

  useEffect(() => {
    if (medicineDetailsQuery?.data?.data?.status_code == 200 && medicineDetailsQuery.data?.data?.data) {
      setProductDetails(medicineDetailsQuery.data?.data?.data);
      const prevDetailsData = medicineDetailsQuery.data?.data?.data;
      setValue("medication_id", prevDetailsData?.id?.toString());
      setValue("name", prevDetailsData.name);
      setValue("sku", prevDetailsData?.sku || "");
      setValue("dose", parseFloat(prevDetailsData?.strength));
      setDose(parseFloat(prevDetailsData?.strength));
      setValue("unit", prevDetailsData?.unit);
      setUnite(prevDetailsData?.unit);
      setValue("medicine_group", prevDetailsData?.medicine_group);
      setGroup(prevDetailsData?.medicine_group);
      setValue("pharmacy_id", prevDetailsData?.pharmacy_id?.toString());
      setValue("medication_category", prevDetailsData?.medication_category);
      setMedCategory(prevDetailsData?.medication_category);
      setValue("medicine_type", prevDetailsData?.medicine_type);
      setMedType(prevDetailsData?.medicine_type);
      setValue("price", parseFloat(prevDetailsData?.price));
      setPrice(parseFloat(prevDetailsData?.price));
      setValue("service_fee", parseFloat(prevDetailsData.service_fee));
      setServiceFee(parseFloat(prevDetailsData.service_fee));
      setValue("doctor_fee", parseFloat(prevDetailsData?.doctor_fee));
      setDoctorFee(parseFloat(prevDetailsData?.doctor_fee));
      setValue("is_research_only", prevDetailsData?.is_research_only?.toString());
      setIsResearched(prevDetailsData?.is_research_only?.toString());
      setValue("shipping_fee", parseFloat(prevDetailsData?.shipping_fee));
      setShippingFee(parseFloat(prevDetailsData?.shipping_fee));
      setValue("dosage_directions", prevDetailsData?.dosage_directions);
    }
  }, [medicineDetailsQuery.isFetched, medicineDetailsQuery.data?.data]);

  const menuItems = [
    {
      title: "Medications",
      href: "/client/products",
    },
    {
      title: `${id ? "Edit" : "Add"} Medication`,
    },
  ];

  const { data: pharmacyDataRes } = useQuery({
    queryKey: ["getPharmacyList"],
    queryFn: () =>
      pharmacyRepository.getPharmacyListWithoutPaginate({
        noPaginate: true,
        dnnPharmacy: true,
      }),
  });

  const pharmactDetails = pharmacyDataRes?.data?.data;

  return (
    <>
      <div className="page-title">
        <h6 className="lg:h2 md:h3 sm:h4">Add Medications</h6>
      </div>
      <DynamicBreadcrumbs
        items={menuItems}
        separatorMargin="1"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="card p-6">
          <div className="card-title with-border">
            <h6>Medication Information</h6>
          </div>
          <div className="grid md:grid-cols-2 items-start gap-y-4 gap-x-5 pt-5">
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
              error={getErrorMessage(errors?.sku)}
              label="Medication SKU"
              withAsterisk
            >
              <Input
                type="text"
                {...register("sku")}
                error={Boolean(errors?.sku?.message)}
              />
            </Input.Wrapper>
            <NumberInput
              label="Dose"
              hideControls
              withAsterisk
              clampBehavior="strict"
              value={dose}
              {...register("dose")}
              error={errors.dose?.message}
              onChange={(value) => {
                setValue("dose", Number(value));
                setDose(value);
                if (value) {
                  clearErrors(`dose`);
                }
              }}
              max={9999}
              min={0}
            />
            <Select
              label="Unit"
              placeholder="select"
              {...register("unit")}
              value={unit}
              data={["mg", "ml"]}
              onChange={(value) => {
                if (value) {
                  setValue("unit", value);
                  setUnite(value);
                  if (value) {
                    clearErrors("unit");
                  }
                }
              }}
              error={errors?.unit?.message}
              required
              rightSection={<i className="icon-down-arrow text-base/none"></i>}
            />
            <Select
              label="Medication Group"
              placeholder="Group Name"
              value={group}
              {...register("medicine_group")}
              data={[
                { value: "semaglutide", label: "Semaglutide" },
                { value: "tirzepatide", label: "Tirzepatide" },
                { value: "kyzatrex", label: "Kyzatrex" },
              ]}
              onChange={(value) => {
                if (value) {
                  setValue("medicine_group", value);
                  setGroup(value);
                  if (value) {
                    clearErrors("medicine_group");
                  }
                }
              }}
              required
              error={errors?.medicine_group?.message}
              rightSection={<i className="icon-down-arrow text-base/none"></i>}
            />
            <Select
              label="Preferred Pharmacy"
              placeholder="Pharmacy Name"
              {...register("pharmacy_id")}
              data={
                pharmactDetails?.map((item: any) => ({
                  label: item.name as string,
                  value: item.id?.toString() as string,
                })) || []
              }
              value={watch("pharmacy_id")}
              onChange={(value) => setValue("pharmacy_id", value)}
              required
            />
            <Select
              label="Medication Category"
              placeholder="Select"
              {...register("medication_category")}
              data={["Testosterone", "Weight Loss"]}
              value={medCategory}
              onChange={(value) => {
                if (value) {
                  setValue("medication_category", value);
                  setMedCategory(value);
                  if (value) {
                    clearErrors("medication_category");
                  }
                }
              }}
              required
              error={errors?.medication_category?.message}
              rightSection={<i className="icon-down-arrow text-base/none"></i>}
            />
            <Select
              label="Medication Type"
              placeholder="Select"
              {...register("medicine_type")}
              data={[
                { value: "odt", label: "ODT" },
                { value: "injection", label: "Injection" },
              ]}
              value={medType}
              onChange={(value) => {
                if (value) {
                  setValue("medicine_type", value);
                  setMedType(value);
                  if (value) {
                    clearErrors("medicine_type");
                  }
                }
              }}
              required
              error={errors?.medicine_type?.message}
              rightSection={<i className="icon-down-arrow text-base/none"></i>}
            />
            <NumberInput
              label="Price"
              hideControls
              withAsterisk
              clampBehavior="strict"
              value={price}
              {...register("price")}
              error={errors.price?.message}
              onChange={(value) => {
                setValue("price", Number(value));
                setPrice(value);
                if (value) {
                  clearErrors(`price`);
                }
              }}
              max={9999999}
              min={0}
            />
            <NumberInput
              label="Doctor Fee"
              withAsterisk
              hideControls
              clampBehavior="strict"
              value={doctorFee || ""}
              {...register("doctor_fee")}
              error={errors.doctor_fee?.message}
              onChange={(value) => {
                setValue("doctor_fee", Number(value));
                setDoctorFee(Number(value));
                if (value) {
                  clearErrors(`doctor_fee`);
                }
              }}
              max={9999999999}
              min={0}
            />
            <NumberInput
              label="Service Fee"
              hideControls
              clampBehavior="strict"
              withAsterisk
              value={serviceFee}
              {...register("service_fee")}
              error={errors.service_fee?.message}
              onChange={(value) => {
                setValue("service_fee", Number(value));
                setServiceFee(value);
                if (value) {
                  clearErrors(`service_fee`);
                }
              }}
              max={9999999999}
              min={0}
            />
            <NumberInput
              label="Shipping Fee"
              hideControls
              clampBehavior="strict"
              withAsterisk
              defaultValue={0}
              value={shippingFee}
              {...register("shipping_fee")}
              error={errors.shipping_fee?.message}
              onChange={(value) => {
                setValue("shipping_fee", Number(value));
                setShippingFee(value);
                if (value) {
                  clearErrors(`shipping_fee`);
                }
              }}
              max={9999999999}
              min={0}
            />
            <Radio.Group
              label="Research Only"
              withAsterisk
              value={isResearched}
              onChange={(val) => {
                setIsResearched(val);
                setValue("is_research_only", val);
              }}
            >
              <Group gap="lg">
                <Radio
                  label="No"
                  color="dark"
                  value={"0"}
                  {...register("is_research_only")}
                />
                <Radio
                  label="Yes"
                  color="dark"
                  value={"1"}
                  {...register("is_research_only")}
                />
              </Group>
            </Radio.Group>
          </div>
        </div>
        <div className="card col-span-2 mt-1">
          <h6 className="extra-form-text-medium text-foreground font-uberText border-b border-b-grey-low mb-6 pb-2">Medication Image</h6>
          <Avatar
            src={id && !image ? `${import.meta.env.VITE_BASE_PATH}/storage/${medicineDetailsQuery?.data?.data?.data?.image}` : image}
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
            src={`${import.meta.env.VITE_BASE_PATH}/storage/${medicineDetailsQuery?.data?.data?.data?.image}`}
            cropped={onCropped}
            itemName="Medication Image"
            isLoading={false}
            fileType="base64"
          />
        </div>
        <div className="card p-6">
          <div className="card-title with-border">
            <h6 className="text-foreground">Add Section</h6>
          </div>
          <div className="space-y-5 pt-5">
            {dosage_directions?.map((item, index) => (
              <Paper
                className="p-4 border rounded-md relative"
                key={item.id}
              >
                <Input.Wrapper
                  label="Title"
                  withAsterisk
                  error={errors?.dosage_directions?.[index]?.title?.message}
                >
                  <Input
                    type="text"
                    {...register(`dosage_directions.${index}.title`)}
                  />
                </Input.Wrapper>
                <Input.Wrapper
                  label="Description"
                  className="mt-4"
                  withAsterisk
                  error={errors?.dosage_directions?.[index]?.details?.message}
                >
                  <RichDetails
                    value={getValues(`dosage_directions.${index}.details`) || ""}
                    key={item?.id}
                    onChange={(value) => {
                      setValue(`dosage_directions.${index}.details`, value);
                    }}
                  />
                </Input.Wrapper>

                <Button
                  variant="transparent"
                  size="xs"
                  className="absolute -right-6 -top-3"
                  color="danger.6"
                  onClick={() => remove(index)}
                >
                  <i className="icon-cross text-2xl"></i>
                </Button>
              </Paper>
            ))}

            <Button
              variant="outline"
              size="esm"
              color="grey"
              className="font-normal"
              leftSection={<i className="icon-add text-xl leading-none"></i>}
              onClick={() => append({ title: "", details: "" })}
            >
              Add New Section
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Button
            size="md"
            variant="light"
            w={256}
            to="/client/products"
            component={NavLink}
          >
            Cancel
          </Button>
          <Button
            size="md"
            w={256}
            ms="sm"
            type="submit"
            loading={isLoading}
          >
            {id ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </>
  );
}

export default AddProductPage;
