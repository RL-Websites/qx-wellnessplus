import { IClinicDetails } from "@/common/api/models/interfaces/Clinic.model";
import { ICommonParams } from "@/common/api/models/interfaces/Common.model";
import { IPrescribedMedicine } from "@/common/api/models/interfaces/Medication.model";
import { ICardRef } from "@/common/api/models/interfaces/Payment.model";
import { IPrescribeNowDTO, IPrescribePatientNowDTO } from "@/common/api/models/interfaces/PrescribeNow.model";
import { IUserData } from "@/common/api/models/interfaces/User.model";
import clinicRepository from "@/common/api/repositories/clinicRepository";
import paymentRepository from "@/common/api/repositories/paymentRepository";
import AddressAutoGoogle from "@/common/components/AddressAutoGoogle";
import AddNewPaymentMethod from "@/common/components/clinic/ClinicDetails/components/AddNewPaymentMethod";
import ConfirmationModal from "@/common/components/ConfirmationModal";
import dmlToast from "@/common/configs/toaster.config";
import { userAtom } from "@/common/states/user.atom";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Avatar, Button, Checkbox, Input, NumberInput, Radio, ScrollArea, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { shippingBillingSchema } from "../schema/schemaValidation";

interface StepFourProps {
  handleBack: () => void;
  formData: any;
  handleSubmit: (data) => void;
  isSubmitting: boolean;
}

const cardOptions = {
  style: {
    base: {
      fontSize: "20px",
      color: "#32325d",
      "::placeholder": { color: "#aab7c4" },
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#fff",
      padding: "10px",
    },
    invalid: {
      color: "#fa755a",
    },
  },
  hidePostalCode: true, // Optional
};

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const appearance = {
  // Other options: 'night', 'flat', 'none'
  variables: {
    colorPrimary: "#0570de",
    colorBackground: "#ffffff",
    colorText: "#32325d",
    colorDanger: "#df1b41",
    fontFamily: "Arial, sans-serif",
    borderRadius: "4px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      borderColor: "#cccccc",
      padding: "10px",
    },
    ".Input:focus": {
      borderColor: "#0570de",
    },
  },
};
function StepFour({ handleBack, handleSubmit, formData, isSubmitting }: StepFourProps) {
  const [userData, setUserDataAtom] = useAtom<IUserData | null>(userAtom);

  const [shippingZipCode, setShippingZipCode] = useState<string>();
  const [billingZipCode, setBillingZipCode] = useState<string>();
  const [shippingCityVal, setShippingCityVal] = useState<string>();
  const [shippingStateVal, setShippingStateVal] = useState<string>();
  const [billingCityVal, setBillingCityVal] = useState<string>();
  const [billingStateVal, setBillingStateVal] = useState<string>();
  const [isSameAsPatientInfo, setIsSameAsPatientInfo] = useState<boolean>(false);
  const [isSameAsShippingInfo, setIsSameAsShippingInfo] = useState<boolean>(false);
  const [isSameAsClinicInfo, setIsSameAsClinicInfo] = useState<boolean>(false);
  const [openAddNewPayment, handleAddNewPayment] = useDisclosure();
  const [payor, setPayor] = useState<string>("Clinic");
  const [selectedCard, setSelectedCard] = useState<string>();
  const [cardList, setCardList] = useState<ICardRef[]>();
  const [orderedItems, setOrderItems] = useState<IPrescribedMedicine[]>();
  const [subTotal, setSubTotal] = useState<number>(0);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [address, setAddress] = useState<string>("");
  const [billingAddress, setBillingAddress] = useState<string>("");
  const [clinicDetails, setClinicDetails] = useState<IClinicDetails>();
  const [temptSubmitPayload, setTempSubmitPayload] = useState<any>();
  const [openPaymentConfirmation, handlePaymentConfirmation] = useDisclosure();

  const fetchCard = () => {
    const params: ICommonParams = {
      page: 1,
      per_page: 20,
      sort_column: "id",
      sort_direction: "desc",
    };
    return paymentRepository.getCardList(params);
  };

  const cardQuery = useQuery({ queryKey: ["PrescribeNowCardQuery"], queryFn: () => fetchCard() });

  useEffect(() => {
    if (cardQuery?.data?.status == 200 && cardQuery?.data?.data?.data?.data) {
      setCardList(cardQuery?.data?.data?.data?.data);
    }
  }, [cardQuery.isFetched, cardQuery.data?.data?.data?.data?.length]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // useEffect(() => {
  //   // console.log(formData);
  //   if (formData != undefined && formData?.medicine_selected?.length > 0) {
  //     setOrderItems(formData?.medicine_selected);
  //     const totalMedsPrice = formData?.medicine_selected?.reduce((summedPrice, item) => summedPrice + Number(item?.price), 0);
  //     console.log(totalMedsPrice);
  //     setSubTotal(totalMedsPrice);

  //     setTotalPrice(totalMedsPrice + shippingCost);
  //   }
  // }, [setOrderItems]);

  const clinicQuery = useQuery({
    queryKey: ["clinicDetails", userData],
    queryFn: () => clinicRepository.getClinicDetails(userData?.userable_type == "clinic" ? userData?.userable_id : userData?.clinic_id),
  });

  useEffect(() => {
    if (clinicQuery.isFetched && clinicQuery?.data?.data?.data) {
      setClinicDetails(clinicQuery?.data?.data?.data);
    }
  }, [clinicQuery?.data]);

  const {
    register,
    handleSubmit: shippingBillingSubmit,
    setValue,
    clearErrors,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(shippingBillingSchema),
  });

  const handleCheckboxChange = (checked: boolean) => {
    setIsSameAsPatientInfo(checked);
    const name = formData?.patient?.first_name + (formData?.patient?.last_name ? " " : "") + formData?.patient?.last_name;
    const address = formData?.patient?.address;
    // console.log(name, address);
    setValue("shipping.name", name, { shouldValidate: true });
    setValue("shipping.email", formData?.patient?.email, { shouldValidate: true });
    setValue("shipping.address", address, { shouldValidate: true });
    setAddress(address);
    setValue("shipping.state", formData?.patient?.state, { shouldValidate: true });
    setShippingStateVal(formData?.patient?.state);
    // setShippingCities(
    //   Locations.filter((item: any) => {
    //     return item.parent_id == formData?.patient?.state;
    //   })
    // );
    setValue("shipping.city", formData?.patient?.city, { shouldValidate: true });
    setShippingCityVal(formData?.patient?.city);
    setValue("shipping.zip_code", formData?.patient?.zip_code, { shouldValidate: true });
    setShippingZipCode(formData?.patient?.zip_code);
  };

  const handleBillingCheckboxChange = (type: "shipping" | "clinic") => {
    if (type === "shipping") {
      if (getValues("shipping.name") && getValues("shipping.email") && getValues("shipping.address") && shippingStateVal && shippingZipCode && shippingCityVal) {
        setIsSameAsShippingInfo((prev) => {
          return !prev;
        });
      }
      setValue("shipping", getValues("shipping"), { shouldValidate: true });
      setIsSameAsClinicInfo(false);

      setValue("billing.name", getValues("shipping.name"), { shouldValidate: true });
      setValue("billing.email", getValues("shipping.email"), { shouldValidate: true });
      setValue("billing.address", getValues("shipping.address"), { shouldValidate: true });
      setBillingAddress(getValues("shipping.address") || "");
      setValue("billing.state", shippingStateVal || "", { shouldValidate: true });
      setBillingStateVal(shippingStateVal);
      setValue("billing.zip_code", shippingZipCode || "", { shouldValidate: true });
      setValue("billing.city", shippingCityVal || "", { shouldValidate: true });
      setBillingCityVal(shippingCityVal);
      setBillingZipCode(shippingZipCode);
      // setBillingCities(
      //   Locations.filter((item: any) => {
      //     return item.parent_id == shippingStateVal;
      //   })
      // );
    } else {
      // console.log(clinicDetails, billingStateVal, billingZipCode, billingCityVal);
      // return;
      // if (getValues("billing.name") && getValues("billing.email") && getValues("billing.address") && billingStateVal && billingZipCode && billingCityVal)
      //   setIsSameAsClinicInfo((prev) => {
      //     const newValue = !prev;
      //     return newValue;
      //   });
      setIsSameAsShippingInfo(false);
      setIsSameAsClinicInfo(true);

      setValue("billing.name", clinicDetails?.name || "", { shouldValidate: true });
      setValue("billing.email", clinicDetails?.email || "", { shouldValidate: true });
      setValue("billing.address", clinicDetails?.address?.address1 || "", { shouldValidate: true });
      setBillingAddress(clinicDetails?.address?.address1 || "");
      setValue("billing.state", clinicDetails?.address?.state || "", { shouldValidate: true });
      setBillingStateVal(clinicDetails?.address?.state);
      setValue("billing.zip_code", clinicDetails?.address?.zip_code || "", { shouldValidate: true });
      setValue("billing.city", clinicDetails?.address?.city || "", { shouldValidate: true });
      setBillingCityVal(clinicDetails?.address?.city);
      setBillingZipCode(clinicDetails?.address?.zip_code);
    }
  };

  // const isBillingReadOnly = isSameAsShippingInfo || isSameAsClinicInfo;

  const onAddNewPaymentClose = (isSuccess) => {
    if (isSuccess == "success") {
      cardQuery.refetch();
    }
    handleAddNewPayment.close();
  };

  const submitShippingBilling = (data) => {
    const customerId = cardList?.find((item) => item.id == selectedCard)?.payment_customer_id;
    const paymentMethodId = cardList?.find((item) => item.id == selectedCard)?.payment_method_id;
    if (!customerId || !paymentMethodId) {
      dmlToast.error({
        title: "Missing payment collection method. Please select or provide one.",
      });
      return;
    }
    if (customerId && paymentMethodId) {
      const payload: IPrescribeNowDTO = {
        shipping: data.shipping,
        billing: data.billing,
        payment_customer_id: customerId,
        payment_method_id: paymentMethodId,
        amount: totalPrice,
        patient: formData?.patient,
        soap_note: formData?.soap_note,
        medication: formData?.medicine_selected,
        payor: payor?.toLowerCase() || "",
      };

      setTempSubmitPayload(payload);
      handlePaymentConfirmation.open();
      // handleSubmit(payload);
    }
  };

  // const saveAndBack = (data) => {
  //   handleBack(data);
  // };

  const stripe = useStripe();
  const elements = useElements();

  const submitFormWithPatientCard = async (data) => {
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return null;
    }
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error("CardElement not found.");
      return;
    }

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error(error);
      return;
    }

    const paymentMethodId = paymentMethod.id;

    if (!paymentMethodId) {
      console.error("Error: Payment method ID is missing.");
    }

    if (paymentMethod && paymentMethodId) {
      const payload: IPrescribePatientNowDTO = {
        shipping: data.shipping,
        billing: data.billing,
        card_data: {
          country: paymentMethod.card?.country,
          display_brand: paymentMethod?.card?.brand,
          exp_month: paymentMethod?.card?.exp_month,
          exp_year: paymentMethod?.card?.exp_year,
          last4: paymentMethod?.card?.last4,
        },
        patient: formData?.patient,
        soap_note: formData?.soap_note,
        medication: formData?.medicine_selected,
        payment_method_id: paymentMethodId,
        prescription_ids: [],
        amount: totalPrice,
        payor: payor?.toLowerCase() || "",
      };
      setTempSubmitPayload(payload);
      handlePaymentConfirmation.open();
      // handleSubmit(payload);
    } else {
      console.log("Unable to payment");
    }
  };
  const options = {
    appearance,
  };

  return (
    <>
      <form className="space-y-6">
        <div className="card">
          <div className="card-title with-border pb-5">
            <h6 className="">Order Summary</h6>
          </div>
          <div className="flex">
            <div className="border-r border-r-grey-light grow">
              <div className="flex gap-4 py-5 pr-5 border-b border-b-grey-light last:border-b-0">
                <div className="card-thumb w-[200px]">
                  <Avatar
                    src={
                      formData?.medicine_selected?.image ? `${import.meta.env.VITE_BASE_PATH}/storage/${formData?.medicine_selected?.image}` : "/images/product-img-placeholder.jpg"
                    }
                    size={200}
                    radius={10}
                  >
                    <img
                      src="/images/product-img-placeholder.jpg"
                      alt=""
                    />
                  </Avatar>
                </div>
                <div className="card-content flex flex-col gap-3 w-[calc(100%_-_216px)]">
                  <h6 className="text-foreground">{`${formData?.medicine_selected?.drug_name} - ${formData?.medicine_selected?.dosage || ""}`}</h6>
                  <ul className="flex space-x-1 divide-x last">
                    <li>
                      <span className="text-fs-md">{formData?.medicine_selected?.type || "N/A"}</span>
                    </li>
                    <li className="pl-1">
                      <span className="text-fs-md">{formData?.medicine_selected?.category?.title || ""}</span>
                    </li>
                  </ul>

                  <div className="flex space-x-1">
                    <span className="text-fs-md">Day Supply:</span> <span className="text-fs-md">{formData?.medicine_selected?.day_supply} days</span>
                  </div>

                  <div className="flex space-x-1">
                    <span className="text-fs-md">Quantity:</span> <span className="text-fs-md">{formData?.medicine_selected?.quantity} pcs</span>
                  </div>

                  <div className="flex space-x-1">
                    <span className="text-fs-md">Refills:</span> <span className="text-fs-md">{formData?.medicine_selected?.refills ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="gro-0 w-[500px]">
              <h6 className="py-5 px-6 border-b border-b-grey-light">Patient Information</h6>
              <div className="flex flex-col justify-between h-[calc(100%_-_75px)]">
                <div className="pl-6 py-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-fs-lg font-medium">Name:</span>
                    <span className="text-fs-lg">
                      {formData?.patient?.first_name} {formData?.patient?.last_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-fs-lg font-medium">Gender:</span>
                    <span className="text-fs-lg capitalize">{formData?.patient?.gender}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-fs-lg font-medium">Date of Birth:</span>
                    <span className="text-fs-lg">{formData?.patient?.dob}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-fs-lg font-medium">Phone:</span>
                    <span className="text-fs-lg">{formData?.patient?.cell_phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-fs-lg font-medium">Email:</span>
                    <span className="text-fs-lg">{formData?.patient?.email}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-fs-lg font-medium">Allergy:</span>
                    <span className="text-fs-lg">{formData?.patient?.allergy === "true" ? formData?.patient?.allergyType : "None"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-fs-lg font-medium">Symptoms:</span>
                    <span className="text-fs-lg">{formData?.patient?.symptoms}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title flex justify-between items-center">
            <h6>Shipping Info</h6>
            <Checkbox
              checked={isSameAsPatientInfo}
              label="Same as patient info"
              onChange={(event) => handleCheckboxChange(event.currentTarget.checked)}
            />
          </div>
          <div className="grid grid-cols-2 gap-6 pt-10">
            <Input.Wrapper
              label="Name"
              withAsterisk
              error={getErrorMessage(errors?.shipping?.name)}
            >
              <Input
                type="text"
                {...register("shipping.name")}
                readOnly={isSameAsPatientInfo}
                classNames={{
                  input: isSameAsPatientInfo ? "pl-0" : "",
                }}
                error={Boolean(errors?.shipping?.name)}
              />
            </Input.Wrapper>

            <Input.Wrapper
              label="Email Address"
              withAsterisk
              className="col-span-1"
              error={getErrorMessage(errors?.shipping?.email)}
            >
              <Input
                type="email"
                {...register("shipping.email")}
                readOnly={isSameAsPatientInfo}
                classNames={{
                  input: isSameAsPatientInfo ? "pl-0" : "",
                }}
                error={Boolean(errors?.shipping?.email)}
              />
            </Input.Wrapper>

            <Input.Wrapper
              label="Address"
              withAsterisk
              error={getErrorMessage(errors?.shipping?.address)}
            >
              <AddressAutoGoogle
                {...register("shipping.address")}
                address={address}
                isError={Boolean(errors?.shipping?.address?.message)}
                onSelect={(address) => {
                  if (address.address) {
                    const onlyAddress = address.address.split(",")[0];
                    setValue(`shipping.address`, onlyAddress, { shouldValidate: true });
                    setAddress(onlyAddress);
                    setValue(`shipping.state`, address.state, { shouldValidate: true });
                    setValue(`shipping.city`, address.city, { shouldValidate: true });
                    setValue("shipping.zip_code", address?.zip_code || "", { shouldValidate: true });
                    setShippingZipCode(address?.zip_code);
                    clearErrors(`shipping.address`);
                  }
                }}
                isReadonly={isSameAsPatientInfo}
                isDisabled={isSameAsPatientInfo}
              />
            </Input.Wrapper>
            <Input.Wrapper
              className="w-full"
              label="State"
              withAsterisk
              error={getErrorMessage(errors?.shipping?.state)}
            >
              <Input
                {...register(`shipping.state`)}
                value={shippingStateVal}
                error={Boolean(errors?.shipping?.state?.message)}
                readOnly={isSameAsPatientInfo}
                disabled
                onChange={(value) => {
                  if (value) {
                    setValue("shipping.state", value.toString(), { shouldValidate: false });
                    clearErrors("shipping.state");
                  }
                  setShippingStateVal(value.toString());
                }}
              />
            </Input.Wrapper>
            {/* <Select
              label="State"
              withAsterisk
              classNames={{
                wrapper: isSameAsPatientInfo ? "bg-transparent" : "bg-grey-btn rounded-md",
                input: isSameAsPatientInfo ? "bg-transparent pl-0" : "",
              }}
              rightSection={!isSameAsPatientInfo ? <i className="icon-down-arrow text-sm"></i> : <i className="icon-down-arrow opacity-0"></i>}
              searchable
              className="md:col-span-1 col-span-2"
              readOnly={isSameAsPatientInfo}
              error={getErrorMessage(errors?.shipping?.state)}
              {...register("shipping.state")}
              value={shippingStateVal}
              onChange={(value: any) => {
                setValue("shipping.state", value);
                setShippingStateVal(value);
                if (value) {
                  setValue("shipping.city", "");
                  setShippingCityVal("");
                  clearErrors("shipping.state");
                  setShippingCities(
                    Locations.filter((item: any) => {
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
            /> */}
            <Input.Wrapper
              className="w-full"
              label="City"
              withAsterisk
              error={getErrorMessage(errors?.shipping?.city)}
            >
              <Input
                type="text"
                {...register(`shipping.city`)}
                error={Boolean(errors?.shipping?.city?.message)}
                readOnly={isSameAsPatientInfo}
                value={shippingCityVal}
                onChange={(value) => {
                  setValue("shipping.city", value ? value.toString() : "", { shouldValidate: true });
                  if (value) {
                    clearErrors("shipping.city");
                  }
                  setShippingCityVal(value ? value.toString() : "");
                }}
              />
            </Input.Wrapper>
            {/* <Select
              label="City"
              className="w-full"
              classNames={{
                wrapper: isSameAsPatientInfo ? "bg-transparent" : "bg-grey-btn rounded-md",
                input: isSameAsPatientInfo ? "bg-transparent pl-0" : "",
              }}
              searchValue={citySearchVal}
              onSearchChange={setCitySearchVal}
              readOnly={isSameAsPatientInfo}
              {...register("shipping.city")}
              value={shippingCityVal}
              error={getErrorMessage(errors?.shipping?.city)}
              withAsterisk
              data={shippingCities?.map((item: any) => {
                return {
                  value: item?.id.toString(),
                  label: item?.name,
                };
              })}
              rightSection={!isSameAsPatientInfo ? <i className="icon-down-arrow text-sm"></i> : <i className="icon-down-arrow opacity-0"></i>}
              searchable
              onChange={(value, option) => {
                setValue("shipping.city", value || "");
                setShippingCityVal(value || "");
                if (value) {
                  setCitySearchVal(option.label || "");
                  clearErrors("shipping.city");
                }
              }}
            /> */}

            <NumberInput
              value={shippingZipCode}
              {...register("shipping.zip_code")}
              className="w-full"
              label="Zip Code"
              onChange={(value) => {
                if (value) {
                  setValue("shipping.zip_code", value?.toString());
                  clearErrors("shipping.zip_code");
                }
                setShippingZipCode(value?.toString());
              }}
              readOnly={isSameAsPatientInfo}
              classNames={{
                wrapper: isSameAsPatientInfo ? "bg-transparent" : "bg-grey-btn rounded-md",
                input: isSameAsPatientInfo ? "bg-transparent pl-0" : "",
              }}
              max={99999}
              min={0}
              error={getErrorMessage(errors?.shipping?.zip_code)}
              hideControls
              allowNegative={false}
              allowDecimal={false}
              withAsterisk
            />
          </div>
        </div>
        <div className="card">
          <div className="card-title flex justify-between items-center">
            <h6>Billing Info</h6>
            <div className="flex items-center gap-4">
              <Checkbox
                label="Same as shipping info"
                checked={isSameAsShippingInfo}
                onChange={() => handleBillingCheckboxChange("shipping")}
              />
              <Checkbox
                label="Same as clinic info"
                checked={isSameAsClinicInfo}
                onChange={() => handleBillingCheckboxChange("clinic")}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 pt-10">
            <Input.Wrapper
              label="Name"
              withAsterisk
              error={getErrorMessage(errors?.billing?.name)}
            >
              <Input
                type="text"
                {...register("billing.name")}
                readOnly={isSameAsShippingInfo || isSameAsClinicInfo}
                classNames={{
                  input: isSameAsShippingInfo || isSameAsClinicInfo ? "pl-0" : "",
                }}
                error={Boolean(errors?.billing?.name)}
              />
            </Input.Wrapper>

            <Input.Wrapper
              label="Email Address"
              withAsterisk
              className="col-span-1"
              error={getErrorMessage(errors?.billing?.email)}
            >
              <Input
                type="email"
                {...register("billing.email")}
                readOnly={isSameAsShippingInfo || isSameAsClinicInfo}
                classNames={{
                  input: isSameAsShippingInfo || isSameAsClinicInfo ? "pl-0" : "",
                }}
                error={Boolean(errors?.billing?.email)}
              />
            </Input.Wrapper>

            <Input.Wrapper
              label="Address"
              withAsterisk
              error={getErrorMessage(errors?.billing?.address)}
            >
              <AddressAutoGoogle
                {...register("billing.address")}
                address={billingAddress}
                isError={Boolean(errors?.billing?.address?.message)}
                onSelect={(address) => {
                  if (address.address) {
                    const onlyAddress = address.address.split(",")[0];
                    setValue(`billing.address`, onlyAddress, { shouldValidate: true });
                    setAddress(onlyAddress);
                    setValue(`billing.state`, address.state, { shouldValidate: true });
                    setValue(`billing.city`, address.city, { shouldValidate: true });
                    setValue("billing.zip_code", address?.zip_code || "", { shouldValidate: true });
                    setShippingZipCode(address?.zip_code);
                    clearErrors(`billing.address`);
                  }
                }}
                isReadonly={isSameAsShippingInfo || isSameAsClinicInfo}
                isDisabled={isSameAsShippingInfo || isSameAsClinicInfo}
                classname={isSameAsShippingInfo || isSameAsClinicInfo ? "pl-0" : ""}
              />
            </Input.Wrapper>

            <Input.Wrapper
              className="w-full"
              label="State"
              withAsterisk
              error={getErrorMessage(errors?.billing?.state)}
            >
              <Input
                {...register(`billing.state`)}
                error={Boolean(errors?.billing?.state?.message)}
                readOnly={isSameAsShippingInfo || isSameAsClinicInfo}
                classNames={{
                  input: isSameAsShippingInfo || isSameAsClinicInfo ? "pl-0" : "",
                }}
                disabled
              />
            </Input.Wrapper>
            {/* <Select
              label="State"
              withAsterisk
              classNames={{
                wrapper: isSameAsShippingInfo ? "bg-transparent" : "bg-grey-btn rounded-md",
                input: isSameAsShippingInfo ? "bg-transparent pl-0" : "",
              }}
              rightSection={!isSameAsShippingInfo ? <i className="icon-down-arrow text-sm"></i> : <i className="icon-down-arrow opacity-0"></i>}
              searchable
              className="md:col-span-1 col-span-2"
              readOnly={isSameAsShippingInfo}
              error={getErrorMessage(errors?.billing?.state_id)}
              {...register("billing.state_id")}
              value={billingStateVal}
              onChange={(value: any) => {
                setValue("billing.state_id", value);
                setBillingStateVal(value);
                if (value) {
                  setValue("billing.city_id", "");
                  clearErrors("billing.state_id");
                  setBillingCities(
                    Locations.filter((item: any) => {
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
            /> */}
            <Input.Wrapper
              className="w-full"
              label="City"
              withAsterisk
              error={getErrorMessage(errors?.billing?.city)}
            >
              <Input
                type="text"
                {...register(`billing.city`)}
                error={Boolean(errors?.billing?.city?.message)}
                readOnly={isSameAsShippingInfo || isSameAsClinicInfo}
                classNames={{
                  input: isSameAsShippingInfo || isSameAsClinicInfo ? "pl-0" : "",
                }}
              />
            </Input.Wrapper>
            {/* <Select
              label="City"
              className="w-full"
              classNames={{
                wrapper: isSameAsShippingInfo ? "bg-transparent" : "bg-grey-btn rounded-md",
                input: isSameAsShippingInfo ? "bg-transparent pl-0" : "",
              }}
              searchValue={billingCitySearchVal}
              onSearchChange={setBillingCitySearchVal}
              readOnly={isSameAsShippingInfo}
              {...register("billing.city_id")}
              value={billingCityVal}
              error={getErrorMessage(errors?.billing?.city_id)}
              withAsterisk
              data={billingCities?.map((item: any) => {
                return {
                  value: item?.id.toString(),
                  label: item?.name,
                };
              })}
              rightSection={!isSameAsShippingInfo ? <i className="icon-down-arrow text-sm"></i> : <i className="icon-down-arrow opacity-0"></i>}
              searchable
              onChange={(value, option) => {
                setValue("billing.city_id", value || "");
                setBillingCityVal(value || "");
                if (value) {
                  setCitySearchVal(option.label || "");
                  clearErrors("billing.city_id");
                }
              }}
            /> */}
            <NumberInput
              {...register("billing.zip_code")}
              className="w-full"
              label="Zip Code"
              onChange={(value) => {
                if (value) {
                  setValue("billing.zip_code", value?.toString());
                  clearErrors("billing.zip_code");
                }
                setBillingZipCode(value?.toString());
              }}
              value={billingZipCode}
              readOnly={isSameAsShippingInfo || isSameAsClinicInfo}
              classNames={{
                wrapper: isSameAsShippingInfo || isSameAsClinicInfo ? "bg-transparent" : "bg-grey-btn rounded-md",
                input: isSameAsShippingInfo || isSameAsClinicInfo ? "!bg-transparent pl-0" : "",
              }}
              error={getErrorMessage(errors?.billing?.zip_code)}
              max={99999}
              min={0}
              hideControls
              allowNegative={false}
              allowDecimal={false}
              withAsterisk
            />
          </div>
        </div>

        <div className="card">
          <div className="card-title with-border mb-5">
            <h6>Payment Method Selection</h6>
          </div>
          <Select
            label="Payor"
            withAsterisk
            defaultValue="Clinic"
            rightSection={<i className="icon-down-arrow text-sm"></i>}
            searchable
            data={["Clinic", "Patient"]}
            onChange={(value) => {
              setPayor(value || "");
              if (value) {
                setValue("payor", value, { shouldValidate: true });
              }
            }}
          />
        </div>
        {payor == "Patient" ? (
          <div className="card">
            <div className="card-title flex justify-between items-center">
              <h6>Provide Patient's card information</h6>
            </div>
            <div
              style={{
                border: "2px solid #ccc",
                padding: "12px",
                borderRadius: "8px",
                background: "#fff",
                display: "flex",
                flexDirection: "column", // Makes input fields stack
                gap: "12px",
              }}
            >
              <CardElement options={cardOptions} />
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-title flex justify-between items-center">
              <h6>Payment Method List</h6>
              {userData?.userable_type == "clinic" ? (
                <Button
                  size="sm-2"
                  onClick={() => handleAddNewPayment.open()}
                >
                  Add New Payment Method
                </Button>
              ) : (
                ""
              )}
            </div>
            <Radio.Group
              value={selectedCard}
              onChange={(value) => setSelectedCard(value)}
            >
              <ScrollArea
                type="hover"
                scrollbarSize={6}
                scrollbars="y"
              >
                {cardList != undefined && cardList?.length > 0 ? (
                  cardList?.map((card) => (
                    <div
                      className="flex flex-col gap-6 pt-[30px]"
                      key={card.id}
                    >
                      <div className="flex items-center gap-6 border border-grey-low rounded-xl px-5 py-6">
                        <Radio value={card.id?.toString()} />
                        <div className="flex justify-between items-center w-[calc(100%_-_48px)]">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <p className="extra-form-text-medium text-foreground">(****{card?.card_number ? card?.card_number : ""})</p>
                              <span className="tags bg-green-light text-green-middle w-auto px-3">{card?.card_type}</span>
                            </div>
                            <span className="text-fs-sm">Expires in {card?.exp_year ? `${card?.exp_month}/${card?.exp_year}` : ""}</span>
                          </div>
                          <div className="flex flex-col gap-2">
                            <p className="extra-form-text-medium">Name</p>
                            <span className="extra-form-text-regular">{userData?.userable_clinic?.contact_person_name || ""}</span>
                          </div>
                          {!!card?.email && (
                            <div className="flex flex-col gap-2">
                              <p className="extra-form-text-medium">Card Email</p>
                              <span className="extra-form-text-regular">{card?.email}</span>
                            </div>
                          )}
                          {/* <ActionIcon
                            variant="transparent"
                            color="danger"
                          >
                            <i className="icon-delete text-2xl/none"></i>
                          </ActionIcon> */}
                        </div>
                      </div>
                      {/* <div className="flex items-center gap-6 border border-grey-low rounded-xl px-5 py-6">
                        <Radio value="card2" />
                        <div className="flex justify-between items-center w-[calc(100%_-_48px)]">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <p className="extra-form-text-medium text-foreground">(****1390)</p>
                              <span className="tags bg-green-light text-green rounded-xl">Visa</span>
                            </div>
                            <span className="text-fs-sm">Expires in 11/2026</span>
                          </div>
                          <div className="flex flex-col gap-2">
                            <p className="extra-form-text-medium">Name</p>
                            <span className="extra-form-text-regular">John Smith</span>
                          </div>
                          <div className="flex flex-col gap-2">
                            <p className="extra-form-text-medium">Card Email</p>
                            <span className="extra-form-text-regular">Johnsmith@gmail.com</span>
                          </div>
                        </div>
                      </div> */}
                      {/* <div className="flex items-center gap-6 border border-grey-low rounded-xl px-5 py-6">
                        <Radio value="card3" />
                        <div className="flex justify-between items-center w-[calc(100%_-_48px)]">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <p className="extra-form-text-medium text-foreground">(****1390)</p>
                              <span className="tags bg-green-light text-green rounded-xl">Visa</span>
                            </div>
                            <span className="text-fs-sm">Expires in 11/2026</span>
                          </div>
                          <div className="flex flex-col gap-2">
                            <p className="extra-form-text-medium">Name</p>
                            <span className="extra-form-text-regular">John Smith</span>
                          </div>
                          <div className="flex flex-col gap-2">
                            <p className="extra-form-text-medium">Card Email</p>
                            <span className="extra-form-text-regular">Johnsmith@gmail.com</span>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  ))
                ) : userData?.userable_type == "clinic" ? (
                  ""
                ) : (
                  <p className="text-danger mt-4">No Card has been added by your clinic. Please request your clinic to add a card or pay with patients card.</p>
                )}
              </ScrollArea>
            </Radio.Group>

            <Elements
              stripe={stripePromise}
              options={options}
            >
              <AddNewPaymentMethod
                opened={openAddNewPayment}
                clinicInfo={userData?.userable_clinic}
                onClose={(status) => onAddNewPaymentClose(status)}
              />
            </Elements>
          </div>
        )}
      </form>

      <div className="flex justify-between mt-6">
        <div className="flex gap-6 ms-auto">
          {/* <Button
            w={256}
            color="grey.4"
            c="foreground"
            disabled
          >
            Save as Draft
          </Button> */}
          <Button
            w={256}
            color="grey.4"
            c="foreground"
            onClick={handleBack}
          >
            Back
          </Button>
          {payor == "Clinic" ? (
            <Button
              w={256}
              onClick={shippingBillingSubmit(submitShippingBilling)}
            >
              Next
            </Button>
          ) : (
            <Button
              w={256}
              onClick={shippingBillingSubmit(submitFormWithPatientCard)}
            >
              Pay Now
            </Button>
          )}
        </div>
      </div>
      <ConfirmationModal
        openModal={openPaymentConfirmation}
        onModalClose={handlePaymentConfirmation.close}
        onModalPressOk={() => handleSubmit(temptSubmitPayload)}
        title="Payment Confirmation"
        message="Are you sure you want to proceed for payment?"
        dmlIcon="icon-approve-doctor text-5xl/none"
        okBtnText="Confirm"
        okBtnLoading={isSubmitting}
      />
    </>
  );
}

export default StepFour;
