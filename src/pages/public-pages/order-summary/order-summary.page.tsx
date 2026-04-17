import useAuthToken from "@/common/hooks/useAuthToken";
import { cartItemsAtom } from "@/common/states/product.atom";
import { selectedStateAtom } from "@/common/states/state.atom";
import { userAtom } from "@/common/states/user.atom";
import { calculatePrice, stateWiseLabFee } from "@/utils/helper.utils";
import { Avatar, Button } from "@mantine/core";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { NavLink as RdNavLink, useNavigate } from "react-router-dom";
import LabSection from "./components/LabSection";
import { LabSubmissionType } from "./components/LabTypeSectionModal";

const OrderSummary = () => {
  const { getAccessToken } = useAuthToken();
  const [userData] = useAtom(userAtom);
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
        if (item?.lab_required == "1") {
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

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/category");
    }
  }, [cartItems, navigate]);

  // Get lab data from cart items
  const labRequiredItem = cartItems.find((item) => {
    const category = item?.medication_category;
    const hasLabPackage = !!item?.lab_package;
    return category?.toLowerCase() === "testosterone" || hasLabPackage;
  });
  const hasLabRequired = !!labRequiredItem;
  const requiredLabExaminations = labRequiredItem?.lab_package?.examinations ?? [];

  const disableChooseLabOptionMode = !!labRequiredItem?.lab_type;

  const handleNext = () => {
    console.log(userData, getAccessToken());

    // Validate lab selection if required
    if (hasLabRequired && !selectedLabType) {
      console.warn("Please select a lab submission option before continuing.");
      return;
    }

    if (userData && getAccessToken()) {
      navigate("/complete-order", {
        state: {
          lab_type: selectedLabType || null,
          reports: selectedReports,
        },
      });
    } else {
      navigate("/login");
    }

    return;
  };

  return (
    <div className="lg:pt-16 md:pt-10 pt-4">
      <h2 className="heading-text text-foreground uppercase text-center">Order Summary</h2>

      {/* Lab Selection Component */}
      {hasLabRequired && (
        <>
          {/* Lab Selection Section */}
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
      )}

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
                    src={item.image ? `${import.meta.env.VITE_BASE_PATH}/storage/${item.image}` : "/placeholder.png"}
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
                  <h6 className="text-xl font-semibold text-foreground font-poppins max-w-[300px]">
                    {item.name} {item.strength ? `${item.strength} ${item.unit || ""}` : ""}
                  </h6>
                  <div className="flex items-center gap-2.5 pt-2.5 font-poppins">
                    <span className="text-lg text-foreground">{item.medication_category}</span>
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
                    {item.name} {item.strength ? `${item.strength || ""} ${item.unit}` : ""} x {item.qty}
                  </span>
                  <span className="text-foreground text-lg">
                    ${item?.lab_required == "1" ? (calculatePrice(item) + stateWiseLabFee(item, selectedState)).toFixed(2) : calculatePrice(item).toFixed(2)}
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
      <div className="flex justify-between gap-6 pt-4">
        <Button
          variant="outline"
          className="lg:w-[200px] w-[150px]"
          component={RdNavLink}
          to={`/medications`}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="lg:w-[200px] w-[150px]"
          form="stepTwoForm"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;
