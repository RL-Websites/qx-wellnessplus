import { cartItemsAtom } from "@/common/states/product.atom";
import { calculatePrice } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Avatar, Button, TextInput } from "@mantine/core";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import promoCodesApiRepository from "@/common/api/repositories/promoCodeRepository";
import dmlToast from "@/common/configs/toaster.config";
import { customerAtom } from "@/common/states/customer.atom";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import * as yup from "yup";

interface PropTypes {
  formData?: any;
  handleBack: () => void;
  onNext: (payload: any) => void;
  isSubmitting: boolean;
}

interface PromoData {
  code: string;
  u_id: string;
  discount_value: string;
  discount_type: "flat" | "percentage" | string;
  orders_count?: number;
  total_sales?: number;
  [key: string]: any;
}

const promoSchema = yup.object().shape({
  promo_code: yup.string().nullable().optional(),
});

const OrderInfo = ({ formData, handleBack, onNext, isSubmitting }: PropTypes) => {
  const [cartItems] = useAtom(cartItemsAtom);

  const [totalBillAmount, setTotalBillAmount] = useState<number>(0);
  const [finalTotal, setFinalTotal] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [code, setCode] = useState<string>("");
  const [appliedPromo, setAppliedPromo] = useState<PromoData | null>(null);
  const [customerData] = useAtom(customerAtom);

  const { handleSubmit, register, setValue, reset } = useForm({
    resolver: yupResolver(promoSchema),
  });

  // compute subtotal from cartItems
  useEffect(() => {
    if (cartItems?.length > 0) {
      let total = 0;
      cartItems.forEach((item) => {
        total += calculatePrice(item);
      });

      total = Math.round(total * 100) / 100;
      setTotalBillAmount(total);

      if (!appliedPromo) {
        setFinalTotal(total);
      } else {
        const discountVal = parseFloat(appliedPromo.discount_value ?? "0");
        const discountType = (appliedPromo.discount_type ?? "flat").toLowerCase();
        let calculatedDiscount = 0;
        if (discountType === "flat") {
          calculatedDiscount = discountVal;
        } else {
          calculatedDiscount = (total * discountVal) / 100;
        }
        calculatedDiscount = Math.round(calculatedDiscount * 100) / 100;
        setDiscount(calculatedDiscount);
        setFinalTotal(Math.max(0, Math.round((total - calculatedDiscount) * 100) / 100));
      }
    } else {
      setTotalBillAmount(0);
      setFinalTotal(0);
      setDiscount(0);
    }
  }, [cartItems, appliedPromo]);

  // promo apply mutation
  const applyPromoMutation = useMutation<any, AxiosError<IServerErrorResponse>, { promo_code: string; customerId: string }>({
    mutationFn: ({ promo_code, customerId }) => promoCodesApiRepository.getApplyPromoCode({ code: promo_code, customerId }),

    onSuccess(response) {
      const apiData = response?.data?.data;
      if (!apiData) {
        dmlToast.error({ title: "Error", message: "The promo code is not valid." });
        return;
      }

      const subtotal = Number(totalBillAmount ?? 0);
      const discountVal = parseFloat(apiData.discount_value ?? "0");
      const discountType = (apiData.discount_type ?? "flat").toLowerCase();

      let calculatedDiscount = 0;
      if (discountType === "flat") {
        calculatedDiscount = discountVal;
      } else {
        calculatedDiscount = (subtotal * discountVal) / 100;
      }

      calculatedDiscount = Math.round(calculatedDiscount * 100) / 100;
      const computedFinal = Math.max(0, Math.round((subtotal - calculatedDiscount) * 100) / 100);

      setDiscount(calculatedDiscount);
      setFinalTotal(computedFinal);
      setAppliedPromo(apiData);
      setCode(apiData.code ?? "");

      // update the RHF field so the input (uncontrolled by us) shows the applied code
      setValue("promo_code", apiData.code ?? "");

      dmlToast.success({
        title: "Promo applied",
        message: apiData.code ?? "Promo code applied successfully",
      });
    },

    onError(err) {
      const errorMessage = err?.response?.data?.message || "Oops! Something went wrong, Please try again later.";
      dmlToast.error({ title: "Error", message: errorMessage });
    },
  });

  // called by RHF promo form
  const handleApplyPromo = (data: { promo_code?: string | null | undefined }) => {
    console.log("handleApplyPromo called =>", data);
    const customerId = customerData?.id.toString() || "";

    applyPromoMutation.mutate({ promo_code: data.promo_code ?? "", customerId: customerId });
  };

  // remove applied promo
  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setDiscount(0);
    setFinalTotal(Math.round((totalBillAmount ?? 0) * 100) / 100);
    setCode("");
    reset();
    setValue("promo_code", "");
  };

  // final submit
  const submitFormWithPatientCard = (shippingData: any) => {
    const payload: any = {
      patient: {
        ...formData?.patient,
      },
      final_total: finalTotal,
      discount: discount,
      code: code,
      cart: cartItems,
      subtotal: totalBillAmount,
    };

    onNext(payload);
  };

  const handleNext = handleSubmit(submitFormWithPatientCard);

  return (
    <>
      <form id="payment-form">
        <h1 className="heading-text text-foreground uppercase text-center pb-10">Payment Information</h1>
        <div className="grid lg:grid-cols-7 gap-6 mt-10">
          <div className="card card-bg lg:col-span-4">
            <div className="card-title">
              <h3 className="font-poppins font-semibold lg:text-3xl text-2xl">Cart</h3>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {cartItems?.map((item) => (
                <div
                  className="flex gap-6 mt-6"
                  key={item.id ?? item.u_id}
                >
                  <div className="card-thumb w-[129px]">
                    <Avatar
                      src={item?.image ? `${import.meta.env.VITE_BASE_PATH}/storage/${item?.image}` : "/images/product-img-placeholder.jpg"}
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
                    <h6 className="text-foreground">
                      {item?.name} {`${item?.strength ?? ""}${item?.unit ?? ""}`}
                    </h6>
                    <div className="text-gray">
                      {item?.medicine_type == "ODT" ? "Oral" : item?.medicine_type} | {item?.medication_category}
                    </div>
                    <div className="text-foreground">Price: ${calculatePrice(item)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="card card-bg">
              <div className="card-title pb-6">
                <h4 className="text-foreground text-[30px] font-semibold">Order Summary</h4>
              </div>
              <table className="w-full text-grey-medium">
                <tbody>
                  <tr>
                    <td className="py-3">Subtotal</td>
                    <td className="py-3 text-right">${totalBillAmount.toFixed(2)}</td>
                  </tr>
                  {discount > 0 ? (
                    <tr>
                      <td className="py-3 text-primary">Discount</td>
                      <td className="py-3 text-right text-primary">- ${discount.toFixed(2)}</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
              <table className="w-full text-grey text-2xl font-bold border-t border-grey-low mt-8">
                <tbody>
                  <tr>
                    <td className="py-3">Total Package Price</td>
                    <td className="py-3 text-right">${finalTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="card card-bg">
              <TextInput
                readOnly={!!appliedPromo}
                label="Apply Promo Code"
                placeholder="Enter promo code"
                {...register("promo_code")}
                rightSection={
                  appliedPromo ? (
                    <div
                      onClick={handleRemovePromo}
                      className="cursor-pointer"
                      aria-label="Remove promo"
                    >
                      <i className="icon-Icon-cross font-bold text-danger"></i>
                    </div>
                  ) : (
                    <Button
                      size="sm-2"
                      className="w-20"
                      type="button"
                      loading={applyPromoMutation.isPending}
                      onClick={handleSubmit(handleApplyPromo)}
                    >
                      Apply
                    </Button>
                  )
                }
                classNames={{
                  section: "!w-auto !mr-3",
                  input: "!pr-20",
                  label: "pb-6",
                }}
              />
            </div>
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
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default OrderInfo;
