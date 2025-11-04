import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IPatientBookingPatientInfoDTO, IPatientPaymentAuthorizeConfirmDTO } from "@/common/api/models/interfaces/PartnerPatient.model";
import orderApiRepository from "@/common/api/repositories/orderRepository";
import paymentRepository from "@/common/api/repositories/paymentRepository";
import AddressAutoGoogle from "@/common/components/AddressAutoGoogle";
import ConfirmationModal from "@/common/components/ConfirmationModal";
import { InputErrorMessage } from "@/common/configs/inputErrorMessage";
import dmlToast from "@/common/configs/toaster.config";
import { customerAtom } from "@/common/states/customer.atom";
import { cartItemsAtom } from "@/common/states/product.atom";
import states from "@/data/state-list.json";
import { calculatePrice, getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Input, NumberInput, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { shippingBillingSchema } from "./schemaValidation";

interface PropTypes {
  formData?: any;
  handleBack: () => void;
  handleSubmit?: (data: IPatientBookingPatientInfoDTO) => void;
  isSubmitting: boolean;
}

const paymentOptions: StripePaymentElementOptions = {
  // layout: { type: "tabs", defaultCollapsed: false, radios: true, spacedAccordionItems: false },
  layout: { type: "accordion", defaultCollapsed: false, radios: false, spacedAccordionItems: false },
  fields: { billingDetails: { address: "never" } },
};

const PaymentInfo = ({ formData, handleBack, handleSubmit, isSubmitting }: PropTypes) => {
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const [customerData, setCustomerData] = useAtom(customerAtom);
  const [isSameAsPatientInfo, setIsSameAsPatientInfo] = useState<boolean>(false);
  const [isSameAsShippingInfo, setIsSameAsShippingInfo] = useState<boolean>(false);

  const [shippingZipCode, setShippingZipCode] = useState<string>();
  const [billingZipCode, setBillingZipCode] = useState<string>();
  const [address, setAddress] = useState<string>("");
  const [billingAddress, setBillingAddress] = useState<string>("");
  const [temptSubmitPayload, setTempSubmitPayload] = useState<any>();
  const [openPaymentConfirmation, handlePaymentConfirmation] = useDisclosure();
  const [capturingPayment, setCapturingPayment] = useState(false);
  const [shippingStateSearchVal, setShippingStateSearchVal] = useState<string>("");
  const [billingStateSearchVal, setBillingStateSearchVal] = useState<string>("");
  const [totalBillAmount, setTotalBillAmount] = useState<number>(0);

  const navigate = useNavigate();

  const paymentAuthorizeMn = useMutation({ mutationFn: (payload: IPatientPaymentAuthorizeConfirmDTO) => paymentRepository.patientPaymentAuthorizeConfirm(payload) });

  useEffect(() => {
    if (cartItems?.length > 0) {
      let totalBill = 0;
      cartItems.forEach((item) => {
        const price = calculatePrice(item);
        totalBill = totalBill + price;
      });

      setTotalBillAmount(totalBill);
    }
  }, [cartItems]);

  const patientBookingMutation = useMutation({
    mutationFn: (payload: IPatientBookingPatientInfoDTO) => orderApiRepository.patientBooking(payload),
  });

  const handleIntakeSubmit = async (data: IPatientBookingPatientInfoDTO) => {
    try {
      const res = await patientBookingMutation.mutateAsync(data);
      return res; // ✅ resolves with the successful response
    } catch (err) {
      return Promise.reject(err); // ✅ rejects with the error
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setIsSameAsPatientInfo(checked);
    const name = formData?.patient?.first_name + (formData?.patient?.last_name ? " " : "") + formData?.patient?.last_name;
    const address = formData?.patient?.address;
    setValue("shipping.name", name, { shouldValidate: true });
    setValue("shipping.email", formData?.patient?.email, { shouldValidate: true });
    setValue("shipping.address", address, { shouldValidate: true });
    setAddress(address);
    setValue("shipping.address2", formData?.patient?.address2, { shouldValidate: true });
    setShippingStateSearchVal(formData?.patient?.state);
    setValue("shipping.state", formData?.patient?.state, { shouldValidate: true });

    setValue("shipping.city", formData?.patient?.city, { shouldValidate: true });
    setValue("shipping.zip_code", formData?.patient?.zip_code, { shouldValidate: true });
    setShippingZipCode(formData?.patient?.zip_code);
  };

  const handleBillingCheckboxChange = () => {
    if (watch("shipping.name") && watch("shipping.email") && watch("shipping.address") && watch("shipping.city") && watch("shipping.state") && shippingZipCode) {
      setIsSameAsShippingInfo((prev) => {
        return !prev;
      });
      // setValue("shipping", getValues("shipping"), { shouldValidate: true });

      setValue("billing.name", watch("shipping.name"), { shouldValidate: true });
      setValue("billing.email", watch("shipping.email"), { shouldValidate: true });
      setValue("billing.address", watch("shipping.address"), { shouldValidate: true });
      setBillingAddress(watch("shipping.address") || "");
      setValue("billing.address2", watch("shipping.address2"), { shouldValidate: true });
      setBillingStateSearchVal(watch("shipping.state") || "");
      setValue("billing.state", watch("shipping.state") || "", { shouldValidate: true });
      setValue("billing.city", watch("shipping.city") || "", { shouldValidate: true });
      setValue("billing.zip_code", shippingZipCode || "", { shouldValidate: true });
      setBillingZipCode(shippingZipCode || "");
    }
  };

  const {
    register,
    handleSubmit: shippingBillingSubmit,
    setValue,
    clearErrors,
    formState: { errors },
    getValues,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(shippingBillingSchema),
  });

  const submitShippingBilling = (data) => {
    console.log(data);
  };

  const stripe = useStripe();
  const elements = useElements();
  const shippingState = watch("shipping.state");
  const billingState = watch("billing.state");

  const submitFormWithPatientCard = (data) => {
    const medications = cartItems?.map((item) => ({
      qty_ordered: item.qty,
      customer_medication_id: item.customer_medication.id, // customerMedication er medication_id
      labRequired: item.lab_required ? item.lab_required : null,
    }));
    const payload: IPatientBookingPatientInfoDTO = {
      slug: customerData?.slug || "",
      cart_total: formData?.amount.toFixed(2) || 0,
      signature: formData.signature,
      shipping: data.shipping,
      billing: data.billing,
      patient: formData?.patient,
      medications: medications,
    };
    setTempSubmitPayload(payload);
    handlePaymentConfirmation.open();
  };

  const handlePayment = async () => {
    setCapturingPayment(true);
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      dmlToast.error({ title: "Stripe is not loaded. Please try again later." });
      setCapturingPayment(false);
      handlePaymentConfirmation.close();
      return null;
    }
    // elements.submit();
    const paymentElement = elements.getElement(PaymentElement);
    if (!paymentElement) {
      setCapturingPayment(false);
      dmlToast.error({ title: "Stripe payment element not found. Please try again later." });
      handlePaymentConfirmation.close();
      return;
    }

    try {
      const payload: IPatientBookingPatientInfoDTO = {
        ...formData,
        ...temptSubmitPayload,
      };
      // First, call your backend API
      await handleIntakeSubmit(payload);
      // Then confirm the payment with Stripe
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: formData?.patient?.first_name + " " + formData?.patient?.last_name, // Fixed name duplication
              email: formData?.patient.email,
              phone: formData?.patient.cell_phone,
              address: {
                country: "US",
                postal_code: temptSubmitPayload.billing.zip_code,
                state: temptSubmitPayload.billing.state,
                city: temptSubmitPayload.billing.city,
                line1: temptSubmitPayload.billing.address,
                line2: "",
              },
            },
          },
          return_url: `${import.meta.env.VITE_FRONTEND_URL}/partner-patient-booking-success`,
        },
        redirect: "if_required",
      });

      // Handle Stripe errors
      if (error) {
        console.error(error);
        dmlToast.error({
          title: error.message || "Payment failed. Please try again.",
        });
        setCapturingPayment(false);
        handlePaymentConfirmation.close();
        return;
      }

      // Handle successful Stripe intent
      if (paymentIntent) {
        const payload: IPatientPaymentAuthorizeConfirmDTO = {
          payment_intent_id: paymentIntent.id,
          client_secret: paymentIntent.client_secret || "",
        };
        paymentAuthorizeMn.mutate(payload, {
          onSuccess: (res) => {
            // dmlToast.success({ title: "Patient has been invited successfully." });
            const prescription_uId = res?.data?.data?.u_id;
            navigate(`/patient-intake?prescription_u_id=${prescription_uId}`);
            console.log(res);
          },
          onError: (err) => {
            const error = err as AxiosError<IServerErrorResponse>;
            dmlToast.error({ title: error.message });
          },
        });

        setCapturingPayment(false);
        handlePaymentConfirmation.close();
        // ✅ Both backend and Stripe succeeded — continue to next step
        setCapturingPayment(false);
        handlePaymentConfirmation.close();
        // your further code here
      } else {
        dmlToast.error({
          title: "Stripe payment intent initializing error.",
          message: "Please refresh the page and try again.",
        });
        setCapturingPayment(false);
        handlePaymentConfirmation.close();
      }
    } catch (error: any) {
      console.error("❌ Booking failed:", error);
      dmlToast.error({
        title:
          error?.response?.data?.message || // backend-defined error
          error?.message || // generic JS/axios error
          "Something went wrong. Please try again.", // fallback
      });
      setCapturingPayment(false);
      handlePaymentConfirmation.close();
    }
  };

  return (
    <>
      <form id="payment-form">
        <div className="py-5 px-10 bg-tag-bg rounded-xl text-center">
          <p className="text-fs-lg text-tag-bg-deep">Please review your information carefully before submitting, as it cannot be modified later.</p>
        </div>
        <div className="card card-bg mt-10">
          <div className="card-title with-border">
            <h6>Order Summary</h6>
          </div>
          <div className="mt-5 sm:flex justify-between">
            <p className="text-primary text-xl font-bold">Total Payable Amount</p>
            <p className="text-primary text-xl font-bold">${formData.amount.toFixed(2)}</p>
          </div>
        </div>
        <div className="card card-bg mt-10">
          <div className="card-title">
            <h3 className="font-poppins font-semibold lg:text-3xl text-2xl">Payment details</h3>
          </div>
          <div className="mt-6">
            {/* <CardElement options={cardOptions} /> */}
            <PaymentElement
              id="payment-element"
              options={paymentOptions}
            />
          </div>
        </div>
        <div className="card card-bg mt-10">
          <div className="card-title flex flex-wrap justify-between items-center gap-2">
            <h3 className="font-poppins font-semibold lg:text-3xl md:text-2xl text-xl">Shipping Info</h3>
            <Checkbox
              checked={isSameAsPatientInfo}
              label="Same as patient info"
              onChange={(event) => handleCheckboxChange(event.currentTarget.checked)}
            />
          </div>
          <div className="md:grid md:grid-cols-2 gap-6 pt-10 md:space-y-0 space-y-6">
            <Input.Wrapper
              classNames={InputErrorMessage}
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
              className="w-full"
              classNames={InputErrorMessage}
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

            <Select
              label="State"
              withAsterisk
              classNames={{
                label: "!text-sm md:!text-base lg:!text-lg",
                wrapper: isSameAsPatientInfo ? "bg-transparent" : "bg-grey-btn rounded-md",
                input: isSameAsPatientInfo ? "bg-transparent pl-0" : "",
                section: isSameAsPatientInfo ? "hidden" : "",
              }}
              rightSection={<i className="icon-down-arrow text-sm"></i>}
              searchable
              searchValue={shippingStateSearchVal}
              onSearchChange={setShippingStateSearchVal}
              value={shippingState}
              readOnly={isSameAsPatientInfo}
              className="w-full"
              data={states?.map((item) => ({ value: item?.StateName, label: item?.StateName }))}
              {...register("shipping.state")}
              error={getErrorMessage(errors?.shipping?.state?.message)}
              onChange={(value, option) => {
                if (value) {
                  setValue("shipping.state", value || "");
                  setShippingStateSearchVal(option.label);
                  clearErrors("shipping.state");
                }
              }}
            />

            <Input.Wrapper
              label="Address"
              withAsterisk
              classNames={InputErrorMessage}
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
                    // setValue(`shipping.state`, address.state, { shouldValidate: true });
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

            {/* <Input.Wrapper
              className="w-full"
              label="State"
              withAsterisk
              classNames={InputErrorMessage}
              error={getErrorMessage(errors?.shipping?.state)}
            >
              <Input
                {...register(`shipping.state`)}
                error={Boolean(errors?.shipping?.state?.message)}
                readOnly={isSameAsPatientInfo}
                disabled
              />
            </Input.Wrapper> */}

            <Input.Wrapper
              className="w-full"
              label="Suite/Apt"
              error={getErrorMessage(errors?.shipping?.address2)}
              classNames={InputErrorMessage}
            >
              <Input
                {...register("shipping.address2")}
                readOnly={isSameAsPatientInfo}
                error={getErrorMessage(errors?.shipping?.address2?.message)}
                classNames={{
                  input: isSameAsPatientInfo ? "pl-0" : "",
                }}
              />
            </Input.Wrapper>

            <Input.Wrapper
              className="w-full"
              label="City"
              withAsterisk
              classNames={InputErrorMessage}
              error={getErrorMessage(errors?.shipping?.city)}
            >
              <Input
                type="text"
                {...register(`shipping.city`)}
                error={Boolean(errors?.shipping?.city?.message)}
                readOnly={isSameAsPatientInfo}
                classNames={{
                  input: isSameAsPatientInfo ? "pl-0" : "",
                }}
              />
            </Input.Wrapper>

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
                label: "!text-sm md:!text-base lg:!text-lg",
                wrapper: isSameAsPatientInfo ? "bg-transparent" : " rounded-md",
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
        <div className="card card-bg mt-10">
          <div className="card-title flex flex-wrap justify-between items-center gap-2">
            <h3 className="font-poppins font-semibold lg:text-3xl md:text-2xl text-xl">Billing Info</h3>
            <div className="flex items-center gap-4">
              <Checkbox
                label="Same as shipping info"
                checked={isSameAsShippingInfo}
                onChange={() => handleBillingCheckboxChange()}
              />
            </div>
          </div>
          <div className="md:grid md:grid-cols-2 gap-6 pt-10 md:space-y-0 space-y-6">
            <Input.Wrapper
              label="Name"
              withAsterisk
              error={getErrorMessage(errors?.billing?.name)}
              classNames={InputErrorMessage}
            >
              <Input
                type="text"
                {...register("billing.name")}
                readOnly={isSameAsShippingInfo}
                classNames={{
                  input: isSameAsShippingInfo ? "pl-0" : "",
                }}
                error={Boolean(errors?.billing?.name)}
              />
            </Input.Wrapper>

            <Input.Wrapper
              label="Email Address"
              withAsterisk
              className="w-full"
              error={getErrorMessage(errors?.billing?.email)}
              classNames={InputErrorMessage}
            >
              <Input
                type="email"
                {...register("billing.email")}
                readOnly={isSameAsShippingInfo}
                classNames={{
                  input: isSameAsShippingInfo ? "pl-0" : "",
                }}
                error={Boolean(errors?.billing?.email)}
              />
            </Input.Wrapper>

            <Select
              label="State"
              withAsterisk
              classNames={{
                label: "!text-sm md:!text-base lg:!text-lg",
                wrapper: isSameAsShippingInfo ? "bg-transparent" : "bg-grey-btn rounded-md",
                input: isSameAsShippingInfo ? "bg-transparent pl-0" : "",
                section: isSameAsShippingInfo ? "hidden" : "",
              }}
              rightSection={<i className="icon-down-arrow text-sm"></i>}
              searchable
              searchValue={billingStateSearchVal}
              onSearchChange={setBillingStateSearchVal}
              value={billingState}
              readOnly={isSameAsShippingInfo}
              className="w-full"
              data={states?.map((item) => ({ value: item?.StateName, label: item?.StateName }))}
              {...register("billing.state")}
              error={getErrorMessage(errors?.billing?.state?.message)}
              onChange={(value, option) => {
                if (value) {
                  setValue("billing.state", value || "");
                  setBillingStateSearchVal(option.label);
                  clearErrors("billing.state");
                }
              }}
            />

            <Input.Wrapper
              label="Address"
              withAsterisk
              error={getErrorMessage(errors?.billing?.address)}
              classNames={InputErrorMessage}
            >
              <AddressAutoGoogle
                {...register("billing.address")}
                address={billingAddress}
                isError={Boolean(errors?.billing?.address?.message)}
                onSelect={(address) => {
                  if (address.address) {
                    const onlyAddress = address.address.split(",")[0];
                    setValue(`billing.address`, onlyAddress, { shouldValidate: true });
                    setBillingAddress(onlyAddress);
                    // setValue(`billing.state`, address.state, { shouldValidate: true });
                    setValue(`billing.city`, address.city, { shouldValidate: true });
                    setValue("billing.zip_code", address?.zip_code || "", { shouldValidate: true });
                    setBillingZipCode(address?.zip_code);
                    clearErrors(`billing.address`);
                  }
                }}
                isReadonly={isSameAsShippingInfo}
                isDisabled={isSameAsShippingInfo}
                classname={isSameAsShippingInfo ? "pl-0" : ""}
              />
            </Input.Wrapper>

            {/* <Input.Wrapper
              className="w-full"
              label="State"
              withAsterisk
              error={getErrorMessage(errors?.billing?.state)}
              classNames={InputErrorMessage}
            >
              <Input
                {...register(`billing.state`)}
                error={Boolean(errors?.billing?.state?.message)}
                readOnly={isSameAsShippingInfo}
                classNames={{
                  input: isSameAsShippingInfo ? "pl-0" : "",
                }}
                disabled
              />
            </Input.Wrapper> */}

            <Input.Wrapper
              className="w-full"
              label="Suite/Apt"
              error={getErrorMessage(errors?.billing?.address2)}
              classNames={InputErrorMessage}
            >
              <Input
                {...register("billing.address2")}
                readOnly={isSameAsShippingInfo}
                error={getErrorMessage(errors?.billing?.address2?.message)}
                classNames={{
                  input: isSameAsShippingInfo ? "pl-0" : "",
                }}
              />
            </Input.Wrapper>

            <Input.Wrapper
              className="w-full"
              label="City"
              withAsterisk
              error={getErrorMessage(errors?.billing?.city)}
              classNames={InputErrorMessage}
            >
              <Input
                type="text"
                {...register(`billing.city`)}
                error={Boolean(errors?.billing?.city?.message)}
                readOnly={isSameAsShippingInfo}
                classNames={{
                  input: isSameAsShippingInfo ? "pl-0" : "",
                }}
              />
            </Input.Wrapper>
            <NumberInput
              value={billingZipCode}
              {...register("billing.zip_code")}
              className="w-full border-0"
              label="Zip Code"
              onChange={(value) => {
                if (value) {
                  setValue("billing.zip_code", value?.toString());
                  clearErrors("billing.zip_code");
                }
                setBillingZipCode(value?.toString());
              }}
              readOnly={isSameAsShippingInfo}
              classNames={{
                label: "!text-sm md:!text-base lg:!text-lg",
                wrapper: isSameAsShippingInfo ? "bg-transparent" : " rounded-md",
                input: isSameAsShippingInfo ? "!bg-transparent pl-0 border-0" : "",
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
      </form>

      <div className="flex justify-between gap-6 mt-6">
        <Button
          w={256}
          color="grey.4"
          c="foreground"
          variant="outline"
          onClick={handleBack}
          classNames={{
            root: "border-primary",
            label: "text-primary",
          }}
        >
          Back
        </Button>
        <Button
          w={256}
          loading={isSubmitting}
          onClick={shippingBillingSubmit(submitFormWithPatientCard)}
        >
          Next
        </Button>
      </div>

      <ConfirmationModal
        openModal={openPaymentConfirmation}
        onModalClose={handlePaymentConfirmation.close}
        onModalPressOk={() => handlePayment()}
        title="Payment Confirmation"
        message="Are you sure you want to proceed for payment?"
        dmlIcon="icon-approve-doctor text-5xl/none"
        okBtnText="Confirm"
        okBtnLoading={capturingPayment}
      />
    </>
  );
};

export default PaymentInfo;
