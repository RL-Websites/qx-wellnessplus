import { Avatar, Button, Input, NumberInput } from "@mantine/core";
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

      <div className="border border-grey-light rounded-lg">
        <div className="border-b border-b-grey-low p-4 flex items-center justify-between">
          <h6 className="">Refills</h6>
          {prescribedData?.id ? (
            ""
          ) : (
            <label className="custom-switch">
              <input
                id="availability"
                type="checkbox"
                checked={isRefillsEnabled}
                onChange={(event) => handleSwitchChange(event.currentTarget.checked)}
              />
              <span className="custom-switch-slider" />
            </label>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 px-4 py-[6px]">
          <Input.Wrapper label="Refills Required">
            <NumberInput
              readOnly={!isRefillsEnabled}
              placeholder={isRefillsEnabled ? "Enter refills required" : "--"}
              value={refills}
              onChange={(value) => setRefills(value.toString())}
              clampBehavior="strict"
              hideControls
              max={99}
              min={0}
            />
          </Input.Wrapper>
          <Input.Wrapper label="Refills Interval (Day)">
            <NumberInput
              readOnly={!isRefillsEnabled}
              placeholder={isRefillsEnabled ? "Enter interval in days" : "--"}
              value={interval}
              onChange={(value) => setInterval(value.toString())}
              clampBehavior="strict"
              hideControls
              max={99}
              min={0}
            />
          </Input.Wrapper>
          <div className="flex flex-col gap-2">
            <span className="extra-form-text-medium text-foreground">Refill Start Date</span>
            {/* {isRefillsEnabled ? refillStartDate ? <p>{refillStartDate}</p> : <p className="pl-3">--</p> : <p className="pl-3">--</p>} */}
            {refillStartDate ? <p>{refillStartDate}</p> : <p className="pl-3">--</p>}
          </div>
          <div className="flex flex-col gap-2">
            <span className="extra-form-text-medium text-foreground">Refill End Date</span>
            {/* {isRefillsEnabled ? refillEndDate ? <p>{refillEndDate}</p> : <p className="pl-3">--</p> : <p className="pl-3">--</p>} */}
            {refillEndDate ? <p>{refillEndDate}</p> : <p className="pl-3">--</p>}
          </div>
        </div>
      </div>

      {prescribedData?.id ? (
        <Button
          size="sm-2"
          color="green.3"
          c="green"
          w="100%"
          rightSection={<i className="icon-tick text-base/none"></i>}
          className="no-pointer-events hover:bg-green-low"
        >
          Prescribed
        </Button>
      ) : productDetails.control_medicine == "0" ? (
        <Button
          size="sm-2"
          w="100%"
          rightSection={<i className="icon-stethoscope text-base/none"></i>}
          onClick={() => handlePrescribeDirConf.open()}
        >
          Prescribe Direct
        </Button>
      ) : (
        <Button
          size="sm-2"
          w="100%"
          loading={pageLoading}
          onClick={() => handleEPrescription?.(productDetails)}
          rightSection={<i className="icon-stethoscope text-base/none"></i>}
        >
          E-Prescribe Now
        </Button>
      )}

      <PrescribeDirectConfirmation
        openModal={openPrescribeDirConf}
        onModalClose={(reason) => onPrescribeDirectConfirm(reason)}
      />
    </div>
  );
};

export default ProductCard;
