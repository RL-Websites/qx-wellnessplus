import { Avatar, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { IMedicineListItem, IPrescribedMedicine } from "../api/models/interfaces/Medication.model";
import PrescribeDirectConfirmation from "./PrescribeDirectConfirmation";

interface ProductCardParams {
  productDetails: IMedicineListItem;
  prescribedData?: IPrescribedMedicine;
  onPrescribeDirect?: (medicationInfo: any) => void;
  handleEPrescription?: (medicationInfo: any) => void;
  pageLoading: boolean;
}

const ProductCard = ({ productDetails, onPrescribeDirect, prescribedData, handleEPrescription, pageLoading }: ProductCardParams) => {
  const [isRefillsEnabled, setIsRefillsEnabled] = useState(false);
  const [refills, setRefills] = useState<string>();
  const [interval, setInterval] = useState<string>();
  const [refillStartDate, setRefillStartDate] = useState<string>();
  const [refillEndDate, setRefillEndDate] = useState<string>();

  const [openPrescribeDirConf, handlePrescribeDirConf] = useDisclosure();

  const today = dayjs();

  const handleSwitchChange = (checked: boolean) => {
    if (checked) {
      setIsRefillsEnabled(checked);
    } else {
      setRefills("");
      setInterval("");
      setRefillStartDate("");
      setRefillEndDate("");
      setIsRefillsEnabled(checked);
    }
  };

  const handleSubmitData = (payload: any) => {
    onPrescribeDirect?.(payload);
  };

  useEffect(() => {
    if (prescribedData?.id && prescribedData?.refill_start_date) {
      setIsRefillsEnabled(false);
      setRefills(prescribedData?.refills_required);
      setInterval(prescribedData?.refill_interval);
      setRefillStartDate(prescribedData?.refill_start_date);
      setRefillEndDate(prescribedData?.refill_end_date);
    }
  }, [prescribedData]);

  useEffect(() => {
    if (refills !== undefined && interval !== undefined) {
      if (Number(refills) > 0 && Number(interval) > 0) {
        const refillStartDate = today.add(Number(interval), "day");
        const refillEndDate = today.add(Number(refills) * Number(interval), "day");
        setRefillStartDate(refillStartDate.format("MMMM DD, YYYY"));
        setRefillEndDate(refillEndDate.format("MMMM DD, YYYY"));
      } else {
        setRefillStartDate("");
        setRefillEndDate("");
      }
    }
  }, [refills, interval]);

  const onPrescribeDirectConfirm = (note) => {
    console.log({ note: note, productId: productDetails?.id });
    if (note !== false) {
      const prescribedDetails = {
        ...productDetails,
        note: note,
        refills_required: refills,
        refill_interval: interval,
        refill_start_date: refillStartDate,
        refill_end_date: refillEndDate,
      };
      onPrescribeDirect?.(prescribedDetails);
    }
    handlePrescribeDirConf.close();
  };

  return (
    <div className="card p-5 border border-grey-low space-y-5 cursor-pointer">
      <div className="flex gap-4 min-h-[204px]">
        <div className="card-thumb w-[200px]">
          <Avatar
            src={productDetails?.image ? `${import.meta.env.VITE_BASE_PATH}/storage/${productDetails?.image}` : "/images/product-img-placeholder.jpg"}
            size={200}
            radius={10}
          >
            <img
              src="/images/product-img-placeholder.jpg"
              alt=""
            />
          </Avatar>
        </div>
        <div className="card-content flex flex-col gap-3 w-[calc(100%_-_216px)]">
          <h6 className="text-foreground">{`${productDetails?.drug_name} ${productDetails?.drug_strength || ""}${productDetails?.quantity_unit || ""}`}</h6>
          <ul className="flex space-x-1 divide-x last">
            <li>
              <span className="text-fs-md">{productDetails?.type || "N/A"}</span>
            </li>
            <li className="pl-1">
              <span className="text-fs-md">{productDetails?.category?.title || "N/A"}</span>
            </li>
          </ul>
          {productDetails?.duration ? <div className="flex items-center leading-5 gap-2">Duration: {productDetails?.duration} days</div> : ""}
          {productDetails?.quantity ? <div className="flex items-center leading-5 gap-2">Quantity: {productDetails?.quantity} pcs</div> : ""}
          {productDetails?.price ? <h4 className="text-grey">{`$${productDetails?.price}`}</h4> : ""}
        </div>
      </div>

      <Button
        size="sm-2"
        w="100%"
        rightSection={<i className="icon-stethoscope text-base/none"></i>}
        onClick={() => handlePrescribeDirConf.open()}
      >
        Choose Medication
      </Button>

      <PrescribeDirectConfirmation
        onSend={handleSubmitData}
        medicationData={productDetails}
        openModal={openPrescribeDirConf}
        onModalClose={(reason) => onPrescribeDirectConfirm(reason)}
      />
    </div>
  );
};

export default ProductCard;
