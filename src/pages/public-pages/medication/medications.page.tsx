import MedicationCard from "@/common/components/MedicationCard";
import { Button } from "@mantine/core";
import { useState } from "react";
import { medications } from "../constant/category-constant";

const MedicationsPage = () => {
  const [cartItems, setCartItems] = useState<number>(0);

  const handleAddToCart = () => {
    setCartItems((prev) => prev + 1);
  };

  return (
    <div className="medication-page">
      <div className="max-w-[776px] mx-auto text-center space-y-5">
        <h4 className="lg:text-[90px] md:text-6xl sm:text-4xl text-2xl text-center text-foreground uppercase">The best pick for you!</h4>
        <span className="md:text-2xl font-medium text-foreground inline-block">
          Based on your responses, we've personalized these product suggestions for you. Kindly select the one you prefer.
        </span>
        <div className="rounded-lg bg-green-badge text-center py-2.5 px-6">Doctor consultation & shipping cost included</div>
      </div>

      <div className="grid grid-cols-3 lg:gap-y-12 lg:gap-x-20 md:gap-10 gap-5 pt-12">
        {medications?.map((item, index) => (
          <MedicationCard
            key={index}
            image={item?.image}
            title={item?.title}
            cost={item?.cost}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {cartItems > 0 && (
        <div className="fixed left-0 bottom-16 w-full animate-fadeInUp">
          <div className="bg-warning-bg px-10 py-4 flex items-center justify-between rounded-2xl mx-5">
            <div className="flex items-center gap-14">
              <div className="relative">
                <i className="icon-orders text-4xl/none"></i>
                <span className="text-base text-white rounded-full bg-primary size-5 absolute -top-2.5 -right-3 text-center leading-5">{cartItems}</span>
              </div>
              <span className="text-foreground text-xl font-medium">
                {cartItems} Product{cartItems > 1 ? "s" : ""} Have been added to Your cart
              </span>
            </div>
            <Button
              size="sm-2"
              color="primary"
              w={263}
            >
              Proceed to checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationsPage;
