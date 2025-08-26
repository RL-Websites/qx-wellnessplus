import useAuthToken from "@/common/hooks/useAuthToken";
import { cartItemsAtom } from "@/common/states/product.atom";
import { userAtom } from "@/common/states/user.atom";
import { calculatePrice } from "@/utils/helper.utils";
import { Button } from "@mantine/core";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { NavLink as RdNavLink, useNavigate } from "react-router-dom";

const OrderSummary = () => {
  const { getAccessToken } = useAuthToken();
  const [userData] = useAtom(userAtom);
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const [totalBillAmount, setTotalBillAmount] = useState<number>(0);
  const navigate = useNavigate();

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

  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/medications");
    }
  }, [cartItems, navigate]);

  const handleNext = () => {
    console.log(userData, getAccessToken());
    if (userData && getAccessToken()) {
      navigate("/complete-order");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="lg:pt-16 md:pt-10 pt-4">
      <h2 className="heading-text text-foreground uppercase text-center">Order Summary</h2>
      <div className="grid md:grid-cols-2 md:gap-[30px] gap-5 pt-12">
        <div className="card bg-opacity-60">
          <div className="md:space-y-10 space-y-5">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex lg:flex-row flex-col gap-5 relative"
              >
                <img
                  src={item.image ? `${import.meta.env.VITE_BASE_PATH}/storage/${item.image}` : "/placeholder.png"}
                  className="size-32 rounded-lg"
                  alt={item.name}
                />
                <div className="lg:w-[calc(100%_-_154px)]">
                  <h6 className="text-xl font-semibold text-foreground font-poppins max-w-[300px]">
                    {item.name} {item.strength ? `${item.strength} ${item.unit}` : ""}
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
          <div className="h-[calc(100%_-_80px)] min-h-[120px] overflow-y-auto py-2.5 space-y-6">
            {cartItems.map((item, idx) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between"
              >
                <span className="text-foreground text-lg inline-block max-w-[226px]">
                  {item.name} {item.strength ? `${item.strength} ${item.unit}` : ""} x {item.qty}
                </span>
                <span className="text-foreground text-lg">${calculatePrice(item)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-t-foreground pt-2">
            <span className="text-foreground font-poppins font-semibold md:text-xl text-lg !border-foreground">Total</span>
            <span className="text-foreground font-poppins font-semibold md:text-xl text-lg !border-foreground">${totalBillAmount}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-6 pt-4">
        <Button
          variant="outline"
          className="w-[200px]"
          component={RdNavLink}
          to={`/medications`}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="w-[200px]"
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
