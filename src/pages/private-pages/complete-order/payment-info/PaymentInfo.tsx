import { IPatientBookingPatientInfoDTO, IPublicPartnerPrescriptionDetails } from "@/common/api/models/interfaces/PartnerPatient.model";
import AddressAutoGoogle from "@/common/components/AddressAutoGoogle";
import ConfirmationModal from "@/common/components/ConfirmationModal";
import { calculatePrice, getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Avatar, Button, Checkbox, Input, NumberInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { shippingBillingSchema } from "./schemaValidation";

interface PropTypes {
  formData?: any;
  patientDetails?: IPublicPartnerPrescriptionDetails;
  handleBack: () => void;
  handleSubmit: (data: IPatientBookingPatientInfoDTO) => void;
  isSubmitting: boolean;
}

const paymentOptions: StripePaymentElementOptions = {
  layout: { type: "tabs", defaultCollapsed: false, radios: true, spacedAccordionItems: false },
  fields: { billingDetails: { address: "never" } },
};

const PaymentInfo = ({ formData, patientDetails, handleBack, handleSubmit, isSubmitting }: PropTypes) => {
  const [isSameAsPatientInfo, setIsSameAsPatientInfo] = useState<boolean>(false);
  const [isSameAsShippingInfo, setIsSameAsShippingInfo] = useState<boolean>(false);

  const [shippingZipCode, setShippingZipCode] = useState<string>();
  const [billingZipCode, setBillingZipCode] = useState<string>();
  const [address, setAddress] = useState<string>("");
  const [billingAddress, setBillingAddress] = useState<string>("");
  const [temptSubmitPayload, setTempSubmitPayload] = useState<any>();
  const [openPaymentConfirmation, handlePaymentConfirmation] = useDisclosure();
  const [capturingPayment, setCapturingPayment] = useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    setIsSameAsPatientInfo(checked);
    const name = formData?.patient?.first_name + (formData?.patient?.last_name ? " " : "") + formData?.patient?.last_name;
    const address = formData?.patient?.address;
    setValue("shipping.name", name, { shouldValidate: true });
    setValue("shipping.email", formData?.patient?.email, { shouldValidate: true });
    setValue("shipping.address", address, { shouldValidate: true });
    setAddress(address);
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

  // const stripe = useStripe();
  // const elements = useElements();

  const submitFormWithPatientCard = (data) => {
    const payload: IPatientBookingPatientInfoDTO = {
      shipping: data.shipping,
      billing: data.billing,
      patient: formData?.patient,

      prescription_u_id: patientDetails?.u_id || "",
    };
    setTempSubmitPayload(payload);
    handlePaymentConfirmation.open();
  };

  const handlePayment = async () => {
    setCapturingPayment(true);
    // if (!stripe || !elements) {
    //   // Stripe.js hasn't yet loaded.
    //   // Make sure to disable form submission until Stripe.js has loaded.
    //   dmlToast.error({ title: "Stripe is not loaded. Please try again later." });
    //   setCapturingPayment(false);
    //   handlePaymentConfirmation.close();
    //   return null;
    // }
    // // elements.submit();
    // const paymentElement = elements.getElement(PaymentElement);
    // if (!paymentElement) {
    //   setCapturingPayment(false);
    //   dmlToast.error({ title: "Stripe payment element not found. Please try again later." });
    //   handlePaymentConfirmation.close();
    //   return;
    // }

    // const { paymentIntent, error } = await stripe.confirmPayment({
    //   elements,
    //   confirmParams: {
    //     payment_method_data: {
    //       billing_details: {
    //         name: patientDetails?.patient.name,
    //         email: patientDetails?.patient.email,
    //         phone: patientDetails?.patient.cell_phone,
    //         address: {
    //           country: "US",
    //           postal_code: temptSubmitPayload.billing.zip_code,
    //           state: temptSubmitPayload.billing.state,
    //           city: temptSubmitPayload.billing.city,
    //           line1: temptSubmitPayload.billing.address,
    //           line2: "",
    //         },
    //       },
    //     },
    //   },
    //   redirect: "if_required",
    // });

    // if (error) {
    //   console.error(error);
    //   dmlToast.error({ title: error.message || "Payment failed. Please try again." });
    //   setCapturingPayment(false);
    //   handlePaymentConfirmation.close();
    //   return;
    // }

    // // const paymentMethodId = paymentMethod.id;
    // if (paymentIntent) {
    //   const payload: IPatientBookingPatientInfoDTO = {
    //     ...temptSubmitPayload,
    //     payment: {
    //       amount: paymentIntent.amount,
    //       client_secret: paymentIntent.client_secret || "",
    //       payment_method_id: paymentIntent.payment_method || "",
    //       payment_intent_id: paymentIntent.id,
    //     },
    //   };
    //   // setTempSubmitPayload((prev) => payload);
    //   handleSubmit(payload);
    //   setCapturingPayment(false);
    //   handlePaymentConfirmation.close();
    // } else {
    //   dmlToast.error({ title: "Stripe payment intent initializing error. ", message: "Please try again with refreshing the page." });
    //   setCapturingPayment(false);
    //   handlePaymentConfirmation.close();
    // }
  };

  return (
    <>
      <form id="payment-form">
        <div className="py-5 px-10 bg-tag-bg rounded-xl text-center">
          <p className="text-fs-lg text-tag-bg-deep">Please review your information carefully before submitting, as it cannot be modified later.</p>
        </div>
        <div className="grid lg:grid-cols-7 gap-6 mt-10">
          <div className="card lg:col-span-4">
            <div className="card-title with-border">
              <h6>Payment details</h6>
            </div>
            <div className="mt-6">
              {/* <CardElement options={cardOptions} /> */}
              {/* <PaymentElement
                id="payment-element"
                options={paymentOptions}
              /> */}
            </div>
          </div>
          <div className="card lg:col-span-3">
            <div className="card-title with-border">
              <h6>Order Summary</h6>
            </div>
            {patientDetails?.prescription_details?.map((item) => (
              <div
                className="flex gap-6 mt-6"
                key={item.u_id}
              >
                <div className="card-thumb w-[129px]">
                  <Avatar
                    src={item?.medication?.image ? `${import.meta.env.VITE_BASE_PATH}/storage/${item?.medication?.image}` : "/images/product-img-placeholder.jpg"}
                    size={129}
                    radius={10}
                  >
                    <img
                      src="/images/product-img-placeholder.jpg"
                      alt="product image"
                    />
                  </Avatar>
                </div>
                <div className="space-y-2.5">
                  {/* <h6 className="text-foreground">{`${formData?.medicine_selected?.drug_name} - ${formData?.medicine_selected?.dosage || ""}`}</h6> */}
                  <h6 className="text-foreground">
                    {item?.medication?.name} {`${item?.medication?.strength}${item?.medication?.unit}`}
                  </h6>
                  <div className="text-gray">
                    {item?.medication?.medicine_type} | {item?.medication?.medication_category}
                  </div>
                  {/* TOdo: need to update */}
                  {/* <div className="text-gray">Duration: 1 month</div> */}
                  <div className="text-foreground">Price: ${calculatePrice(item)}</div>
                </div>
              </div>
            ))}

            <div className="mt-10">
              {/* <h4 className="border border-t-0 border-x-0 border-b-grey-low pb-5 text-xl">Cart Total</h4> */}
              {/* <table className="w-full text-grey-medium">
              <tbody>
                <tr>
                  <td className="py-3">Subtotal</td>
                  <td className="py-3 text-right">$789</td>
                </tr>
                <tr>
                  <td className="py-3">Shipping</td>
                  <td className="py-3 text-right">$30</td>
                </tr>
              </tbody>
            </table> */}

              <table className="w-full text-grey text-2xl font-bold border-t border-grey-low mt-8">
                <tbody>
                  <tr>
                    <td className="py-3">Total</td>
                    <td className="py-3 text-right">${patientDetails?.total_bill_amount}</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm italic text-tag-bg-deep">* Doctor Consultation & Shipping included.</p>
            </div>
          </div>
        </div>
        <div className="card mt-10">
          <div className="card-title flex justify-between items-center with-border">
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
                error={Boolean(errors?.shipping?.state?.message)}
                readOnly={isSameAsPatientInfo}
                disabled
              />
            </Input.Wrapper>

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
        <div className="card mt-10">
          <div className="card-title with-border flex justify-between items-center">
            <h6>Billing Info</h6>
            <div className="flex items-center gap-4">
              <Checkbox
                label="Same as shipping info"
                checked={isSameAsShippingInfo}
                onChange={() => handleBillingCheckboxChange()}
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
              className="col-span-1"
              error={getErrorMessage(errors?.billing?.email)}
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
                    setBillingAddress(onlyAddress);
                    setValue(`billing.state`, address.state, { shouldValidate: true });
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

            <Input.Wrapper
              className="w-full"
              label="State"
              withAsterisk
              error={getErrorMessage(errors?.billing?.state)}
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
            </Input.Wrapper>
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
                readOnly={isSameAsShippingInfo}
                classNames={{
                  input: isSameAsShippingInfo ? "pl-0" : "",
                }}
              />
            </Input.Wrapper>
            <NumberInput
              value={billingZipCode}
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
              readOnly={isSameAsShippingInfo}
              classNames={{
                wrapper: isSameAsShippingInfo ? "bg-transparent" : "bg-grey-btn rounded-md",
                input: isSameAsShippingInfo ? "!bg-transparent pl-0" : "",
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

      <div className="flex justify-end gap-6 mt-6">
        <Button
          w={256}
          color="grey.4"
          c="foreground"
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          w={256}
          loading={capturingPayment}
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
        okBtnLoading={isSubmitting}
      />
    </>
  );
};

export default PaymentInfo;
