import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";

import MedicationCard from "@/common/components/MedicationCard";
import ConfirmProductOrderModal from "./components/ConfirmProductOrderModal";
import ProductDetailsModal from "./components/ProductDetailsModal";

import { IGetMedicationListParams } from "@/common/api/models/interfaces/Common.model";
import { IMedicineListItem, IPartnerMedicineListItem } from "@/common/api/models/interfaces/Medication.model";
import { medicineRepository } from "@/common/api/repositories/medicineRepository";
import { selectedCategoryAtom } from "@/common/states/category.atom";
import { customerAtom } from "@/common/states/customer.atom";
import { cartItemsAtom, prevGlpMedDetails } from "@/common/states/product.atom";
import { selectedStateAtom } from "@/common/states/state.atom";
import { stateWiseLabFee } from "@/utils/helper.utils";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { NavLink as RdNavLink } from "react-router-dom";
import ConfirmTestosteroneOnlyModal from "./components/ConfirmTestosteroneOnlyModal";

const MedicationsPage = () => {
  const [medicines, setMedicines] = useState<IMedicineListItem[]>();
  const selectedState = useAtomValue(selectedStateAtom);
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const [selectedMedication, setSelectedMedication] = useState<any>(null);
  const [pendingAddToCart, setPendingAddToCart] = useState<any>(null);
  const [pageSize, setPageSize] = useState<number>(2);
  const [confirmMeds, handleConfirmMeds] = useDisclosure(false);
  const [showDetails, setShowDetailsHandel] = useDisclosure(false);
  const [confirmTestosterone, handleConfirmTestosterone] = useDisclosure(false);
  const selectedCategory = useAtomValue(selectedCategoryAtom);
  const prevGlpDetails = useAtomValue(prevGlpMedDetails);
  const [tempSelectedMedicine, setTempSelectedMedicine] = useState<IPartnerMedicineListItem>();
  const [selectedProduct, setSelectedProduct] = useState<IPartnerMedicineListItem[]>([]);
  const [customerData, setCustomerData] = useAtom(customerAtom);

  const fetchMedicine = () => {
    const params: IGetMedicationListParams = {
      per_page: pageSize,
      customer_slug: customerData?.slug,
      noPaginate: true,
      category: selectedCategory,
      ...prevGlpDetails,
    };
    return medicineRepository.getAllMedicinesNoPaginate(params);
  };

  const medicineQuery = useQuery({
    queryKey: ["medicineList", selectedCategory],
    queryFn: fetchMedicine,
    enabled: !!selectedCategory && !!selectedCategory.length,
  });

  useEffect(() => {
    if (medicineQuery?.data?.status === 200 && medicineQuery?.data?.data?.data) {
      const medList = medicineQuery.data?.data?.data?.map((item) => ({ ...item, qty: 1 }));
      setMedicines(medList || []);
    }
  }, [medicineQuery.data]);

  useEffect(() => {
    if (medicineQuery?.isError && medicineQuery?.error?.response?.data?.status_code == 404) {
      setMedicines([]);
    }
  }, [medicineQuery.isFetched]);

  // console.log(medicineQuery);

  // console.log(medicines);

  const handleAddToCart = (item: any) => {
    setPendingAddToCart(item);
    if (item.medication_category === "Single Peptides" || item.medication_category === "Peptides Blends") {
      handleConfirmMeds.open();
    } else if (item.medication_category === "Testosterone") {
      setSelectedMedication(item);
      handleConfirmTestosterone.open();
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
    handleConfirmTestosterone.close();
  };

  const handleDisagree = () => {
    handleConfirmMeds.close();
    handleConfirmTestosterone.close();
  };

  const handelDetailsModal = (item: any) => {
    setSelectedMedication(item);
    setShowDetailsHandel.open();
  };

  const totalCartCount = cartItems.length;

  const handleSelect = (medicine: IPartnerMedicineListItem) => {
    if (selectedProduct?.length) {
      const doesExists = selectedProduct?.findIndex((item) => medicine.id === item.id);
      if (doesExists != undefined && doesExists > -1) {
        const newSelectedItems =
          selectedProduct?.length != undefined && selectedProduct?.length > 0 ? [...selectedProduct.filter((item) => medicine.id != item.id)] : [...selectedProduct];
        setSelectedProduct(() => structuredClone(newSelectedItems));
      } else {
        const newSelectedItems = selectedProduct?.length ? [...selectedProduct, medicine] : [...selectedProduct];
        setSelectedProduct(() => structuredClone(newSelectedItems));
      }
      console.log(selectedProduct);
    } else {
      setSelectedProduct((prevItems) => [...prevItems, medicine]);
    }
  };

  const onTestosteroneConfirm = (lab_required: string) => {
    setPendingAddToCart((prev) => ({
      ...prev, // keep previous values
      lab_required: true, // add new field
    }));
    setCartItems([...cartItems, { ...pendingAddToCart, lab_required }]);
    handleConfirmTestosterone.close();
  };

  return (
    <div className="medication-page">
      <div className="max-w-[776px] mx-auto text-center space-y-5">
        <h4 className="heading-text text-center text-foreground uppercase">The best pick for you!</h4>
        <span className="md:text-2xl font-medium text-foreground inline-block">
          Based on your responses, we've personalized these product suggestions for you. Kindly select the one you prefer.
        </span>
      </div>
      {medicines?.length > 0 ? (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 lg:gap-y-12 lg:gap-x-20 gap-7 pt-12 lg:pb-24 pb-[250px]">
          {medicines?.map((item, index) => {
            const isInCart = cartItems.some((cartItem) => cartItem.id === item.id);

            return (
              <MedicationCard
                key={index}
                image={`${import.meta.env.VITE_BASE_PATH}/storage/${item?.image}`}
                title={`${item?.name} ${item.strength ? item.strength + " " + item.unit : ""} `}
                cost={item?.customer_medication?.price}
                lab_fee={stateWiseLabFee(item, selectedState)}
                onAddToCart={() => handleAddToCart(item)}
                onShowDetails={() => handelDetailsModal(item)}
                disabled={isInCart} // pass this prop to your MedicationCard
                selectedCategory={selectedCategory}
              />
            );
          })}
        </div>
      ) : (
        <h5 className="text-center text-primary mt-[100px]">No medication found for the specified category.</h5>
      )}

      {cartItems.length > 0 && (
        <div className="fixed left-0 bottom-16 w-full animate-fadeInUp">
          <div className="bg-warning-bg px-10 lg:py-6 py-5 flex md:flex-row flex-col items-center justify-between rounded-2xl md:mx-5 mx-4 md:gap-2 gap-4">
            <div className="flex md:flex-row flex-col items-center lg:gap-14 md:gap-8 gap-2">
              <div className="relative">
                <i className="icon-orders text-4xl/none"></i>
                <span className="text-base text-white rounded-full bg-primary size-5 absolute -top-2.5 -right-3 text-center leading-5">{totalCartCount}</span>
              </div>
              <span className="text-foreground md:text-xl sm:text-lg text-base md:text-start text-center font-medium">
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
      <ConfirmTestosteroneOnlyModal
        openModal={confirmTestosterone}
        onModalClose={handleConfirmTestosterone.close}
        medicationName={tempSelectedMedicine?.medicine?.name + " " + tempSelectedMedicine?.medicine?.strength + "" + tempSelectedMedicine?.medicine?.unit}
        medicationDetails={pendingAddToCart}
        onModalPressYes={(labRequired) => {
          onTestosteroneConfirm(String(labRequired));
        }}
        onModalPressNo={handleConfirmTestosterone.close}
        medicationInfo={pendingAddToCart ? [pendingAddToCart] : []}
        okBtnLoading={false}
      />
    </div>
  );
};

export default MedicationsPage;
