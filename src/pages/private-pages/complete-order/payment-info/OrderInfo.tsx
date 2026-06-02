import { cartItemsAtom } from "@/common/states/product.atom";
import { calculatePrice, dosevanaCostGenerate, generateMedName, imageUrl, stateWiseLabFee } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Avatar, Button, TextInput } from "@mantine/core";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import promoCodesApiRepository from "@/common/api/repositories/promoCodeRepository";
import dmlToast from "@/common/configs/toaster.config";
import { customerAtom } from "@/common/states/customer.atom";
import { selectedStateAtom } from "@/common/states/state.atom";
import LabSection from "@/pages/public-pages/order-summary/components/LabSection";
import { LabSubmissionType } from "@/pages/public-pages/order-summary/components/LabTypeSectionModal";
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
  discount_type: "fixed" | "percentage" | string;
  orders_count?: number;
  total_sales?: number;
  [key: string]: any;
}

const promoSchema = yup.object().shape({
  promo_code: yup.string().nullable().optional(),
});

const OrderInfo = ({ formData, handleBack, onNext, isSubmitting }: PropTypes) => {
  const [cartItems] = useAtom(cartItemsAtom);
  const [storedCartItems, setStoredCartItems] = useState<any[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const savedCartItems = window.localStorage.getItem("cartItems");
      return savedCartItems ? (JSON.parse(savedCartItems) ?? []) : [];
    } catch {
      return [];
    }
  });

  const [totalBillAmount, setTotalBillAmount] = useState<number>(0); // subtotal (products only)
  const [totalDvCost, setTotalDvCost] = useState<number>(0); // subtotal (products only)
  const [labFee, setLabFee] = useState<number>(0); // separate lab fee
  const [totalShippingFee, setTotalShippingFee] = useState<number>(0);
  const [finalTotal, setFinalTotal] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [code, setCode] = useState<string>("");
  const [appliedPromo, setAppliedPromo] = useState<PromoData | null>(null);
  const [customerData] = useAtom(customerAtom);
  const selectedState = useAtomValue(selectedStateAtom);
  const [selectedLabType, setSelectedLabType] = useState<LabSubmissionType | null>(formData?.lab_type ?? null);
  const [selectedReports, setSelectedReports] = useState<any[]>(formData?.reports ?? []);
  const activeCartItems = cartItems?.length > 0 ? cartItems : formData?.cart?.length > 0 ? formData.cart : storedCartItems;

  useEffect(() => {
    if (cartItems?.length > 0) {
      setStoredCartItems(cartItems);
    }
  }, [cartItems]);

  // Detect lab-required item (TRT/Hormone/lab-package medications)
  const labRequiredItem = useMemo(
    () =>
      activeCartItems?.find((item) => {
        return item?.is_lab_required == 1 || item?.lab_required === "1";
      }),
    [activeCartItems]
  );
  const hasLabRequired = !!labRequiredItem;
  const requiredLabExaminations = labRequiredItem?.lab_package?.examinations ?? [];
  const disableChooseLabOptionMode = !!labRequiredItem?.lab_type;

  // Lab option is selected upstream (testosterone modal on /medications) and persisted on
  // the cart item. Seed local state from there so SelectedLabOption renders the saved
  // choice instead of an empty card.
  useEffect(() => {
    if (!labRequiredItem) return;
    if (!selectedLabType && labRequiredItem.lab_type) {
      setSelectedLabType(labRequiredItem.lab_type as LabSubmissionType);
    }
    if ((!selectedReports || selectedReports.length === 0) && Array.isArray(labRequiredItem.reports) && labRequiredItem.reports.length > 0) {
      setSelectedReports(labRequiredItem.reports);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labRequiredItem?.lab_type, labRequiredItem?.reports]);

  const { handleSubmit, register, setValue, reset } = useForm({
    resolver: yupResolver(promoSchema),
  });

  // compute subtotal and lab fee separately
  useEffect(() => {
    if (activeCartItems?.length > 0) {
      let productTotal = 0;
      let dosevanaTotal = 0;
      let labFeeTotal = 0;
      let shippingFeeTotal = 0;

      // Lab fee is only billed when patient picks the Dosevana-managed lab option.
      // own_lab / preferred_lab => $0 (handled outside checkout).
      const chargeLabFee = selectedLabType === "dosevana_lab";

      activeCartItems.forEach((item) => {
        productTotal += calculatePrice(item);
        dosevanaTotal += dosevanaCostGenerate(item, item?.customer_medication?.customer);
        if (chargeLabFee && item?.lab_required == "1") {
          labFeeTotal += stateWiseLabFee(item, selectedState);
        }
        if (item.shippingType === "Overnight") {
          shippingFeeTotal += Number(item.over_night_shipping_fee || 0);
        }
      });

      productTotal = Math.round(productTotal * 100) / 100;
      labFeeTotal = Math.round(labFeeTotal * 100) / 100;

      setTotalBillAmount(productTotal);
      setTotalDvCost(dosevanaTotal);
      setLabFee(labFeeTotal);
      setTotalShippingFee(shippingFeeTotal);

      const grossTotal = productTotal + labFeeTotal + shippingFeeTotal;

      if (!appliedPromo) {
        setFinalTotal(grossTotal);
      } else {
        const discountVal = parseFloat(appliedPromo.discount_value || "0");
        const discountType = (appliedPromo.discount_type || "fixed").toLowerCase();
        let calculatedDiscount = 0;

        if (discountType === "fixed") {
          calculatedDiscount = discountVal;
        } else {
          calculatedDiscount = (productTotal * discountVal) / 100;
        }

        calculatedDiscount = Math.round(calculatedDiscount * 100) / 100;
        setDiscount(calculatedDiscount);
        setFinalTotal(Math.max(0, Math.round((grossTotal - calculatedDiscount) * 100) / 100));
      }
    } else {
      setTotalBillAmount(0);
      setLabFee(0);
      setTotalShippingFee(0);
      setFinalTotal(0);
      setDiscount(0);
    }
  }, [activeCartItems, appliedPromo, selectedState, selectedLabType]);

  // promo apply mutation
  const applyPromoMutation = useMutation<any, AxiosError<IServerErrorResponse>, { promo_code: string; customerId: string }>({
    mutationFn: ({ promo_code, customerId }) => promoCodesApiRepository.getApplyPromoCode({ code: promo_code, customerId, totalBillAmount, totalDvCost }),

    onSuccess(response) {
      const apiData = response?.data?.data;
      if (!apiData) {
        dmlToast.error({ title: "Error", message: "The promo code is not valid." });
        return;
      }

      const subtotal = Number(totalBillAmount ?? 0) + Number(labFee ?? 0) + Number(totalShippingFee ?? 0);
      const discountVal = parseFloat(apiData.discount_value ?? "0");
      const discountType = (apiData.discount_type ?? "fixed").toLowerCase();

      let calculatedDiscount = 0;
      if (discountType === "fixed") {
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
    const customerId = customerData?.id.toString() || "";

    applyPromoMutation.mutate({ promo_code: data.promo_code ?? "", customerId });
  };

  // remove applied promo
  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setDiscount(0);
    setFinalTotal(Math.round((totalBillAmount + labFee + totalShippingFee) * 100) / 100);
    setCode("");
    reset();
    setValue("promo_code", "");
  };

  // final submit
  const submitFormWithPatientCard = (shippingData: any) => {
    if (hasLabRequired && !selectedLabType) {
      dmlToast.error({
        title: "Lab option required",
        message: "Please choose a lab option before continuing.",
      });
      return;
    }

    const payload: any = {
      patient: {
        ...formData?.patient,
      },
      final_total: finalTotal,
      discount: discount,
      code: code,
      cart: activeCartItems,
      subtotal: totalBillAmount,
      lab_fee: labFee,
      shipping_fee: totalShippingFee,
      lab_type: selectedLabType ?? null,
      // QX patient is selecting for themselves, so always "now".
      lab_selection_mode: hasLabRequired && selectedLabType ? "now" : null,
      reports: selectedReports ?? [],
    };

    onNext(payload);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (event?.currentTarget?.value) {
        handleApplyPromo({ promo_code: event?.currentTarget?.value });
      }
      event.preventDefault();
    }
  };

  const handleNext = handleSubmit(submitFormWithPatientCard);

  return (
    <>
      <form id="payment-form">
        <h1 className="heading-text text-foreground uppercase text-center pb-10">Payment Information</h1>

        {hasLabRequired && (
          <LabSection
            disabledChooseLabOptionMode={disableChooseLabOptionMode}
            examinations={requiredLabExaminations}
            // QX is payment-first: no real Prescription exists yet at this step,
            // so don't pass an id (a customer_medication id is NOT a prescription id
            // and would cause the download endpoint to 500). Requisition becomes
            // downloadable from the post-checkout order/prescription screens.
            prescriptionId={null}
            prescriptionDetailId={null}
            value={selectedLabType}
            onSelectionChange={setSelectedLabType}
            reports={selectedReports}
            onReportsChange={setSelectedReports}
          />
        )}

        <div className="grid lg:grid-cols-2 gap-6 mt-10">
          {/* Cart Section */}
          <div className="card card-bg">
            <div className="card-title">
              <h3 className="font-poppins font-semibold lg:text-3xl text-2xl">Cart</h3>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {activeCartItems?.map((item) => (
                <div
                  className="flex gap-6 mt-6"
                  key={item.id ?? item.u_id}
                >
                  <div className="flex flex-col gap-2">
                    <div className="card-thumb w-[129px]">
                      <Avatar
                        src={imageUrl(item?.image, "/images/product-img-placeholder.jpg")}
                        size={129}
                        radius={10}
                      >
                        <img
                          src="/images/product-img-placeholder.jpg"
                          alt="product image"
                        />
                      </Avatar>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium text-center w-fit ${
                        item.shippingType === "Overnight" ? "bg-[#E1DCFD] text-foreground" : "bg-[#F7FBCE] text-foreground"
                      }`}
                    >
                      {item.shippingType} Shipping
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    <h6 className="text-foreground break-all">{generateMedName(item)}</h6>
                    <div className="text-gray">
                      {item?.medication_category === "Single Peptides" ? "Anti-Aging" : item.medication_category === "Testosterone" ? "TRT/HRT" : item?.medication_category} |{" "}
                      {item?.medicine_type == "ODT" ? "Oral" : item?.medicine_type}
                    </div>
                    <div className="text-foreground">
                      Price: $
                      {item?.lab_required == "1" && selectedLabType === "dosevana_lab"
                        ? (Number(calculatePrice(item)) + stateWiseLabFee(item, selectedState)).toFixed(2)
                        : calculatePrice(item).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
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

                  {labFee > 0 && (
                    <tr>
                      <td className="py-3">Lab Fee</td>
                      <td className="py-3 text-right">${labFee.toFixed(2)}</td>
                    </tr>
                  )}

                  {totalShippingFee > 0 && (
                    <tr>
                      <td className="py-3 text-[#6848FF] font-semibold">Overnight Shipping</td>
                      <td className="py-3 text-right text-[#6848FF] font-semibold">${totalShippingFee.toFixed(2)}</td>
                    </tr>
                  )}

                  {discount > 0 && (
                    <tr>
                      <td className="py-3 text-primary font-semibold">Discount</td>
                      <td className="py-3 text-right text-primary font-semibold">- ${discount.toFixed(2)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <table className="w-full text-grey text-2xl font-bold border-t border-foreground">
                <tbody>
                  <tr>
                    <td className="py-3 sm:text-xl text-base text-foreground">Total Package Price</td>
                    <td className="py-3 sm:text-xl text-base text-foreground text-right">${finalTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Promo Section */}
            <div className="card card-bg">
              <TextInput
                readOnly={!!appliedPromo}
                label="Apply Promo Code"
                placeholder="Enter promo code"
                {...register("promo_code")}
                onKeyDown={handleKeyDown}
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
                  root: "w-full",
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
