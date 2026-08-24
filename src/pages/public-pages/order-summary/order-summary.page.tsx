import dmlToast from "@/common/configs/toaster.config";
import useAuthToken from "@/common/hooks/useAuthToken";
import { cartItemsAtom } from "@/common/states/product.atom";
import { selectedStateAtom } from "@/common/states/state.atom";
import { useAuth } from "@/context/AuthContextProvider";
import { calculatePrice, generateMedName, imageUrl, isCartItemOrderable, stateWiseLabFee } from "@/utils/helper.utils";
import { Avatar, Button } from "@mantine/core";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { NavLink as RdNavLink, useNavigate } from "react-router-dom";
import { LabSubmissionType } from "./components/LabTypeSectionModal";

const OrderSummary = () => {
  const { getAccessToken } = useAuthToken();
  const { userLoading } = useAuth();
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const [totalBillAmount, setTotalBillAmount] = useState<number>(0);
  const [totalShippingFee, setTotalShippingFee] = useState<number>(0);
  const [selectedLabType, setSelectedLabType] = useState<LabSubmissionType | null>();
  const [selectedReports, setSelectedReports] = useState<any[]>();
  const selectedState = useAtomValue(selectedStateAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems?.length > 0) {
      let totalBill = 0;
      let shippingFee = 0;
      cartItems.forEach((item) => {
        const price = calculatePrice(item);
        totalBill = totalBill + price;
        if (item?.lab_required == "1" && item?.lab_type === "dosevana_lab") {
          totalBill += stateWiseLabFee(item, selectedState || "");
        }
        if (item.shippingType === "Overnight") {
          shippingFee += Number(item.over_night_shipping_fee || 0);
        }
      });

      setTotalShippingFee(shippingFee);
      setTotalBillAmount(totalBill + shippingFee);
    } else {
      setTotalBillAmount(0);
      setTotalShippingFee(0);
    }
  }, [cartItems, selectedState]);

  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  /*
   * The cart is persisted in localStorage, so it can outlive the shape the API
   * returns. An item without its customer_medication link cannot be priced or
   * ordered and used to throw during render, leaving a blank page. Drop those
   * instead, so a stale cart self-heals rather than trapping the patient.
   */
  useEffect(() => {
    const orderableItems = cartItems.filter(isCartItemOrderable);
    if (orderableItems.length !== cartItems.length) {
      setCartItems(orderableItems);
      dmlToast.error({
        title: "Cart updated",
        message: "An item in your cart is no longer available and has been removed.",
      });
    }
  }, [cartItems, setCartItems]);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/category");
    }
  }, [cartItems, navigate]);

  // Get lab data from cart items — only items that actually require a lab
  const labRequiredItem = cartItems.find((item) => {
    return item?.is_lab_required == 1 || item?.lab_required === "1";
  });
  const hasLabRequired = !!labRequiredItem;
  const requiredLabExaminations = labRequiredItem?.lab_package?.examinations ?? [];

  const disableChooseLabOptionMode = !!labRequiredItem?.lab_type;

  const handleNext = () => {
    // Lab option is now captured at add-to-cart time (e.g. testosterone modal on /medications)
    // so prefer the value persisted on the cart item over the (now usually unused) local state.
    const effectiveLabType = selectedLabType ?? (labRequiredItem?.lab_type as LabSubmissionType | undefined) ?? null;
    const effectiveReports = selectedReports ?? labRequiredItem?.reports ?? [];

    /*
     * A missing lab option must NOT block here. This page has no lab picker (the
     * choice is made in the add-to-cart modal), so returning early left the button
     * dead with only a console warning — the page became impossible to leave for any
     * cart that predates the add-to-cart fix. The payment step renders LabSection
     * whenever a lab is required and refuses to submit without a choice, so it is
     * both the right place to gate and a place the patient can actually act.
     */
    if (hasLabRequired && !effectiveLabType) {
      dmlToast.warning({
        title: "Lab option needed",
        message: "Please choose a lab option on the next step to continue.",
      });
    }

    /*
     * Do not bounce to /login while the session is still being resolved. userAtom is
     * populated asynchronously by AuthContextProvider, so a logged-in patient who
     * clicked before that resolved was sent to /login, which immediately sent them
     * back here — the "stuck on order summary" loop. A stored token is enough to
     * proceed; AuthGuard on /complete-order does the authoritative check.
     */
    if (userLoading) {
      return;
    }

    if (getAccessToken()) {
      navigate("/complete-order", {
        state: {
          lab_type: effectiveLabType,
          reports: effectiveReports,
        },
      });
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="lg:pt-16 md:pt-10 pt-4">
      <h2 className="heading-text text-foreground uppercase text-center">Order Summary</h2>

      {/* Lab Selection Component */}
      {/* {hasLabRequired && (
        <>
          <LabSection
            disabledChooseLabOptionMode={disableChooseLabOptionMode}
            examinations={requiredLabExaminations}
            prescriptionId={labRequiredItem?.customer_medication?.id ?? null}
            prescriptionDetailId={labRequiredItem?.id ?? null}
            value={selectedLabType}
            onSelectionChange={setSelectedLabType}
            reports={selectedReports}
            onReportsChange={setSelectedReports}
          />
        </>
      )} */}

      <div className="grid md:grid-cols-2 md:gap-[30px] gap-5 pt-12">
        <div className="card bg-opacity-60">
          <div className="md:space-y-10 space-y-5">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex lg:flex-row flex-col gap-5 relative"
              >
                <div className="flex flex-col gap-2">
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
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium text-center w-fit ${
                      item.shippingType === "Overnight" ? "bg-[#E1DCFD] text-foreground" : "bg-[#F7FBCE] text-foreground"
                    }`}
                  >
                    {item.shippingType} Shipping
                  </span>
                </div>
                <div className="lg:w-[calc(100%_-_154px)]">
                  <h6 className="text-xl font-semibold text-foreground font-poppins max-w-[300px]">{generateMedName(item)}</h6>
                  <div className="flex items-center gap-2.5 pt-2.5 font-poppins">
                    <span className="text-lg text-foreground">
                      {item.medication_category === "Single Peptides" ? "Anti-Aging" : item.medication_category === "Testosterone" ? "TRT/HRT" : item.medication_category}
                    </span>
                    <span className="text-lg text-foreground">|</span>
                    <span className="text-lg text-foreground">{item.medicine_type == "ODT" ? "Oral" : item.medicine_type}</span>
                  </div>
                </div>
                <i
                  className="icon-delete text-2xl/none text-danger absolute top-0 right-0 cursor-pointer"
                  onClick={() => handleRemoveItem(item.id)}
                ></i>
              </div>
            ))}
          </div>
        </div>
        <div className="card bg-opacity-60">
          <h6 className="card-title with-border text-foreground font-poppins font-semibold md:text-xl text-lg !border-foreground">Cart Total</h6>
          <div className="h-[calc(100%_-_80px)] min-h-[120px] overflow-y-auto py-2.5 flex flex-col justify-between gap-6">
            <div className="space-y-6">
              {cartItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between"
                >
                  <span className="text-foreground text-lg inline-block max-w-[226px] break-all">
                    {/* {item.name} {item.strength ? `${item.strength || ""} ${item.unit}` : ""} x {item.qty} */}
                    {generateMedName(item)} x {item.qty}
                  </span>
                  <span className="text-foreground text-lg">
                    $
                    {item?.lab_required == "1" && item?.lab_type === "dosevana_lab"
                      ? (calculatePrice(item) + stateWiseLabFee(item, selectedState)).toFixed(2)
                      : calculatePrice(item).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            {totalShippingFee > 0 && (
              <div className="flex flex-wrap items-center justify-between">
                <span className="text-[#6848FF] text-lg font-semibold">Overnight Shipping</span>
                <span className="text-[#6848FF] text-lg font-semibold">${totalShippingFee.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-t-foreground pt-2">
            <span className="text-foreground font-poppins font-semibold md:text-xl text-lg !border-foreground">Total Package Price</span>
            <span className="text-foreground font-poppins font-semibold md:text-xl text-lg !border-foreground">${totalBillAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-6 pt-4 sm:pb-0 pb-10">
        <Button
          variant="outline"
          className="lg:w-[200px] w-[150px]"
          component={RdNavLink}
          to={`/medications`}
        >
          Back
        </Button>
        <Button
          type="button"
          className="lg:w-[200px] w-[150px]"
          onClick={handleNext}
          // Session still resolving: show it rather than letting the click no-op.
          loading={userLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;
