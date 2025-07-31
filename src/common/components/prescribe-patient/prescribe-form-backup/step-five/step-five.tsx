import { ICommonParams } from "@/common/api/models/interfaces/Common.model";
import { ICardRef } from "@/common/api/models/interfaces/Payment.model";
import { IPrescribeNowDTO } from "@/common/api/models/interfaces/PrescribeNow.model";
import paymentRepository from "@/common/api/repositories/paymentRepository";
import AddNewPaymentMethod from "@/common/components/clinic/ClinicDetails/components/AddNewPaymentMethod";
import { Locations } from "@/common/constants/locations";
import { ILocation } from "@/common/models/location";
import { formatDate } from "@/utils/date.utils";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Input, NumberInput, Radio, ScrollArea, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { shippingBillingSchema } from "../schema/schemaValidation";

interface StepFiveProps {
  handleBack: () => void;
  formData: any;
  handleSubmit: (data) => void;
  isSubmitting: boolean;
}

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

function StepFive({ handleBack, handleSubmit, formData, isSubmitting }: StepFiveProps) {
  const [states] = useState<ILocation[]>(Locations.filter((item: any) => item?.type.toLowerCase() === "state"));
  const [shippingCities, setShippingCities] = useState<ILocation[]>();
  const [billingCities, setBillingCities] = useState<ILocation[]>();
  const [shippingZipCode, setShippingZipCode] = useState<string>();
  const [billingZipCode, setBillingZipCode] = useState<string>();
  const [citySearchVal, setCitySearchVal] = useState<string>();
  const [shippingCityVal, setShippingCityVal] = useState<string>();
  const [shippingStateVal, setShippingStateVal] = useState<string>();
  const [billingCityVal, setBillingCityVal] = useState<string>();
  const [billingStateVal, setBillingStateVal] = useState<string>();
  const [billingCitySearchVal, setBillingCitySearchVal] = useState<string>();
  const [isSameAsPatientInfo, setIsSameAsPatientInfo] = useState<boolean>(false);
  const [isSameAsShippingInfo, setIsSameAsShippingInfo] = useState<boolean>(false);
  const [isSameAsClinicInfo, setIsSameAsClinicInfo] = useState<boolean>(false);
  const [openAddNewPayment, handleAddNewPayment] = useDisclosure();
  const [payor, setPayor] = useState<string>();
  const [selectedCard, setSelectedCard] = useState<string>();
  const [cardList, setCardList] = useState<ICardRef[]>();

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
    const address = formData?.patient?.address1 + (formData?.patient?.address2 ? " " : "") + formData?.patient?.address2;
    console.log(name, address);
    setValue("shipping.name", name, { shouldValidate: true });
    setValue("shipping.email", formData?.patient?.email, { shouldValidate: true });
    setValue("shipping.address1", address, { shouldValidate: true });
    setValue("shipping.state_id", formData?.patient?.state, { shouldValidate: true });
    setShippingStateVal(formData?.patient?.state);
    setValue("shipping.zip_code", formData?.patient?.zipcode, { shouldValidate: true });
    setShippingCities(
      Locations.filter((item: any) => {
        return item.parent_id == formData?.patient?.state;
      })
    );
    setValue("shipping.city_id", formData?.patient?.city, { shouldValidate: true });
    setShippingCityVal(formData?.patient?.city);
    setShippingZipCode(formData?.patient?.zipcode);
  };

  const handleBillingCheckboxChange = (type: "shipping" | "clinic") => {
    if (type === "shipping") {
      if (getValues("shipping.name") && getValues("shipping.email") && getValues("shipping.address1") && shippingStateVal && shippingZipCode && shippingCityVal) {
        setIsSameAsShippingInfo((prev) => {
          return !prev;
        });
      }
      setValue("shipping", getValues("shipping"), { shouldValidate: true });
      setIsSameAsClinicInfo(false);

      setValue("billing.name", getValues("shipping.name"), { shouldValidate: true });
      setValue("billing.email", getValues("shipping.email"), { shouldValidate: true });
      setValue("billing.address1", getValues("shipping.address1"), { shouldValidate: true });
      setValue("billing.state_id", shippingStateVal || "", { shouldValidate: true });
      setBillingStateVal(shippingStateVal);
      setValue("billing.zip_code", shippingZipCode || "", { shouldValidate: true });
      setBillingCities(
        Locations.filter((item: any) => {
          return item.parent_id == shippingStateVal;
        })
      );
      setValue("billing.city_id", shippingCityVal || "", { shouldValidate: true });
      setBillingCityVal(shippingCityVal);
      setBillingZipCode(shippingZipCode);
    } else {
      setIsSameAsClinicInfo((prev) => {
        const newValue = !prev;
        return newValue;
      });
      setIsSameAsShippingInfo(false);
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
    const payload: IPrescribeNowDTO = { ...data, card_id: selectedCard };
    handleSubmit(payload);
  };

  // const saveAndBack = (data) => {
  //   handleBack(data);
  // };
  const options = {
    appearance,
  };
  return (
    <>
      <form className="space-y-6">
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
            }}
          />
        </div>
        {payor == "Patient" ? (
          ""
        ) : (
          <div className="card">
            <div className="card-title flex justify-between items-center">
              <h6>Payment Method List</h6>
              <Button
                size="sm-2"
                onClick={() => handleAddNewPayment.open()}
              >
                Add New Payment Method
              </Button>
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
                {cardList?.map((card) => (
                  <div
                    className="flex flex-col gap-6 pt-[30px]"
                    key={card.id}
                  >
                    <div className="flex items-center gap-6 border border-grey-low rounded-xl px-5 py-6">
                      <Radio value="1" />
                      <div className="flex justify-between items-center w-[calc(100%_-_48px)]">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <p className="extra-form-text-medium text-foreground">(****{card?.card_number ? card?.card_number[card?.card_number?.length - 4] : ""})</p>
                            <span className="tags bg-green-light text-green-middle w-auto px-3">{card?.card_type}</span>
                          </div>
                          <span className="text-fs-sm">Expires in {card?.expiration_date ? formatDate(card?.expiration_date, "MM/YYYY") : ""}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="extra-form-text-medium">Name</p>
                          <span className="extra-form-text-regular">{card?.card_holder_name || ""}</span>
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
                ))}
              </ScrollArea>
            </Radio.Group>
            <Elements
              stripe={stripePromise}
              options={options}
            >
              <AddNewPaymentMethod
                opened={openAddNewPayment}
                onClose={(status) => onAddNewPaymentClose(status)}
              />
            </Elements>
          </div>
        )}
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
              error={getErrorMessage(errors?.shipping?.address1)}
            >
              <Input
                type="text"
                {...register("shipping.address1")}
                readOnly={isSameAsPatientInfo}
                classNames={{
                  input: isSameAsPatientInfo ? "pl-0" : "",
                }}
                error={Boolean(errors?.shipping?.address1)}
              />
            </Input.Wrapper>

            <Select
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
              error={getErrorMessage(errors?.shipping?.state_id)}
              {...register("shipping.state_id")}
              value={shippingStateVal}
              onChange={(value: any) => {
                setValue("shipping.state_id", value);
                setShippingStateVal(value);
                if (value) {
                  setValue("shipping.city_id", "");
                  setShippingCityVal("");
                  clearErrors("shipping.state_id");
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
            />
            <Select
              label="City"
              className="w-full"
              classNames={{
                wrapper: isSameAsPatientInfo ? "bg-transparent" : "bg-grey-btn rounded-md",
                input: isSameAsPatientInfo ? "bg-transparent pl-0" : "",
              }}
              searchValue={citySearchVal}
              onSearchChange={setCitySearchVal}
              readOnly={isSameAsPatientInfo}
              {...register("shipping.city_id")}
              value={shippingCityVal}
              error={getErrorMessage(errors?.shipping?.city_id)}
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
                setValue("shipping.city_id", value || "");
                setShippingCityVal(value || "");
                if (value) {
                  setCitySearchVal(option.label || "");
                  clearErrors("shipping.city_id");
                }
              }}
            />

            <NumberInput
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
              value={shippingZipCode}
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
              error={getErrorMessage(errors?.billing?.address1)}
            >
              <Input
                type="text"
                {...register("billing.address1")}
                readOnly={isSameAsShippingInfo}
                classNames={{
                  input: isSameAsShippingInfo ? "pl-0" : "",
                }}
                error={Boolean(errors?.billing?.address1)}
              />
            </Input.Wrapper>
            <Select
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
            />

            <Select
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
            />
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
          <Button
            w={256}
            onClick={shippingBillingSubmit(submitShippingBilling)}
            loading={isSubmitting}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

export default StepFive;
