import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";

import MedicationCard from "@/common/components/MedicationCard";
import ConfirmProductOrderModal from "./components/ConfirmProductOrderModal";
import ProductDetailsModal from "./components/ProductDetailsModal";

import { ICommonParams } from "@/common/api/models/interfaces/Common.model";
import { IMedicineListItem } from "@/common/api/models/interfaces/Medication.model";
import { medicineRepository } from "@/common/api/repositories/medicineRepository";
import { selectedCategoryAtom } from "@/common/states/category.atom";
import { cartItemsAtom } from "@/common/states/product.atom";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { NavLink as RdNavLink } from "react-router-dom";

const MedicationsPage = () => {
  const [medicines, setMedicines] = useState<IMedicineListItem[]>();
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const [selectedMedication, setSelectedMedication] = useState<any>(null);
  const [pendingAddToCart, setPendingAddToCart] = useState<any>(null);
  const [pageSize, setPageSize] = useState<number>(2);
  const [confirmMeds, handleConfirmMeds] = useDisclosure(false);
  const [showDetails, setShowDetailsHandel] = useDisclosure(false);
  const selectedCategory = useAtomValue(selectedCategoryAtom);

  const slug = "alan-lane-68777502f1562";

  const fetchMedicine = () => {
    const params: ICommonParams = {
      per_page: pageSize,
      customer_slug: slug,
      noPaginate: true,
      category: selectedCategory,
    };
    return medicineRepository.getAllMedicines(params);
  };

  const medicineQuery = useQuery({
    queryKey: ["medicineList", selectedCategory],
    queryFn: fetchMedicine,
    enabled: !!selectedCategory,
  });

  useEffect(() => {
    if (medicineQuery?.data?.status === 200 && medicineQuery?.data?.data?.data) {
      const medList = medicineQuery.data?.data?.data?.map((item) => ({ ...item, qty: 1 }));
      setMedicines(medList || []);
    }
  }, [medicineQuery.data?.data?.data]);

  console.log(medicineQuery);

  console.log(medicines);

  const handleAddToCart = (item: any) => {
    setPendingAddToCart(item);

    if (["Single Peptides", "Peptides Blends"].includes(item.medication_category) || item.medication_type === "tergepitiede" || cartItems.length > 0) {
      handleConfirmMeds.open();
    } else {
      setCartItems((prev) => [...prev, item]);
    }
  };

  const handleAgree = (qty: number) => {
    if (pendingAddToCart) {
      const exists = cartItems.find((item) => item.id === pendingAddToCart.id);

      if (!exists) {
        setCartItems([...cartItems, { ...pendingAddToCart, qty }]);
      } else {
        setCartItems(cartItems.map((item) => (item.id === pendingAddToCart.id ? { ...item, qty: item.qty + qty } : item)));
      }
    }
    handleConfirmMeds.close();
  };

  const handleDisagree = () => {
    handleConfirmMeds.close();
  };

  const handelDetailsModal = (item: any) => {
    setSelectedMedication(item);
    setShowDetailsHandel.open();
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);

  return (
    <div className="medication-page">
      <div className="max-w-[776px] mx-auto text-center space-y-5">
        <h4 className="heading-text text-center text-foreground uppercase">The best pick for you!</h4>
        <span className="md:text-2xl font-medium text-foreground inline-block">
          Based on your responses, we've personalized these product suggestions for you. Kindly select the one you prefer.
        </span>
        <div className="rounded-lg bg-green-badge text-center py-2.5 px-6">Doctor consultation & shipping cost included</div>
      </div>

      <div className="grid grid-cols-3 lg:gap-y-12 lg:gap-x-20 md:gap-10 gap-5 pt-12">
        {medicines?.map((item, index) => {
          const isInCart = cartItems.some((cartItem) => cartItem.id === item.id);

          return (
            <MedicationCard
              key={index}
              image={`${import.meta.env.VITE_BASE_PATH}/storage/${item?.image}`}
              title={item?.name}
              cost={item?.price}
              onAddToCart={() => handleAddToCart(item)}
              onShowDetails={() => handelDetailsModal(item)}
              disabled={isInCart} // pass this prop to your MedicationCard
            />
          );
        })}
      </div>

      {cartItems.length > 0 && (
        <div className="fixed left-0 bottom-16 w-full animate-fadeInUp">
          <div className="bg-warning-bg px-10 py-4 flex items-center justify-between rounded-2xl mx-5">
            <div className="flex items-center gap-14">
              <div className="relative">
                <i className="icon-orders text-4xl/none"></i>
                <span className="text-base text-white rounded-full bg-primary size-5 absolute -top-2.5 -right-3 text-center leading-5">{totalCartCount}</span>
              </div>
              <span className="text-foreground text-xl font-medium">
                {totalCartCount > 0 && (
                  <div>
                    <span>
                      {totalCartCount} Product{totalCartCount > 1 ? "s" : ""} Have been added to Your cart
                    </span>
                  </div>
                )}
              </span>
            </div>
            <Button
              size="sm-2"
              color="primary"
              w={263}
              component={RdNavLink}
              to={`/order-summary`}
            >
              Proceed to checkout
            </Button>
          </div>
        </div>
      )}

      <ProductDetailsModal
        openModal={showDetails}
        onModalClose={setShowDetailsHandel.close}
        medicationDetails={selectedMedication}
      />

      <ConfirmProductOrderModal
        openModal={confirmMeds}
        onModalClose={handleConfirmMeds.close}
        onModalPressYes={handleDisagree}
        onModalPressNo={handleAgree}
        okBtnLoading={false}
        medicationInfo={pendingAddToCart ? [pendingAddToCart] : []}
      />
    </div>
  );
};

export default MedicationsPage;
