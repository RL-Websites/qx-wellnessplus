import { BaseWebDatePickerOverrides } from "@/common/configs/baseWebOverrides";
import { Avatar, Button, Input } from "@mantine/core";
import { BaseProvider, LightTheme } from "baseui";
import { Datepicker as UberDatePicker } from "baseui/datepicker";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Client as Styletron } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";

interface StepThreeProps {
  handleBack: () => void;
  formData: any;
  handleSubmit: (dosageData) => void;
}

interface QtyItem {
  count: string;
  icon?: string;
  title?: string;
}

// const initialQtyItems: QtyItem[] = [
//   {
//     icon: "icon-oral",
//     title: "20mg",
//     activeIcon: "icon-tick",
//     active: true,
//   },
//   {
//     icon: "icon-injection",
//     title: "40mg (na)",
//     activeIcon: "icon-tick",
//     active: false,
//   },
// ];

// const strengthQtyItems: QtyItem[] = [
//   {
//     icon: "icon-mg",
//     title: "0.25mg",
//     activeIcon: "icon-tick",
//     active: true,
//   },
//   {
//     icon: "icon-mg",
//     title: "0.5mg (na)",
//     activeIcon: "icon-tick",
//     active: false,
//   },
//   {
//     icon: "icon-mg",
//     title: "1mg",
//     activeIcon: "icon-tick",
//     active: false,
//   },
//   {
//     icon: "icon-mg",
//     title: "1.5mg",
//     activeIcon: "icon-tick",
//     active: false,
//   },
//   {
//     icon: "icon-mg",
//     title: "2mg",
//     activeIcon: "icon-tick",
//     active: false,
//   },
// ];

const quantityItems: QtyItem[] = [
  {
    count: "15",
  },
  {
    count: "30",
  },
  {
    count: "45",
  },
];
const refillsItems: QtyItem[] = [
  {
    count: "1",
  },
  {
    count: "2",
  },
  {
    count: "3",
  },
];
const intervalItems: QtyItem[] = [
  {
    count: "30",
  },
  {
    count: "60",
  },
  {
    count: "90",
  },
];

function StepThree({ handleBack, handleSubmit, formData }: StepThreeProps) {
  // const [qtyItems, setQtyItem] = useState<string>(15);
  // const [strengthItems, setStrengthItems] = useState<QtyItem[]>(strengthQtyItems);
  const engine = new Styletron();
  const [refillDate, setRefillDate] = useState<any>(new Date());
  const [quantity, setQuantity] = useState<string>("15");
  const [refills, setRefills] = useState<string>("1");
  const [intervals, setIntervals] = useState<string>("30");

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 10);

  const minDate = new Date();
  const today = dayjs();

  const selectItem = (setType: "qty" | "strength" | "quantity" | "refill" | "interval", value: string) => {
    if (setType === "quantity") {
      setQuantity(value);
    } else if (setType === "refill") {
      setRefills(value);
    } else if (setType === "interval") {
      setIntervals(value);
      const nextDate = today.add(Number(value), "day");
      setRefillDate(new Date(nextDate.format()));
    }
  };

  useEffect(() => {
    formData?.qty ? setQuantity(formData.qty) : "";
    formData?.refills ? setRefills(formData.refills) : "";
    formData?.interval ? setIntervals(formData.interval) : "";
    formData?.interval ? setRefillDate(new Date(formData.refill_date)) : "";
  }, [formData]);

  const saveDosageDetails = () => {
    const dosageData = {
      qty: quantity || "",
      refills: refills || "",
      interval: intervals || "",
      refill_date: dayjs(refillDate).format("YYYY-MM-DD"),
    };

    handleSubmit(dosageData);
  };

  const handleIntervalChange = (value) => {
    setIntervals(value);
    const nextDate = today.add(Number(value), "day");
    setRefillDate(new Date(nextDate.format()));
  };

  return (
    <>
      <div className="card p-6">
        <div className="flex gap-4 pb-5 border-b border-b-grey-low">
          <div className="card-thumb w-[200px]">
            <Avatar
              src={`${import.meta.env.VITE_BASE_PATH}/storage/${formData?.medication_data?.image}`}
              size={200}
              radius={10}
            >
              <img
                src="/images/product-img-placeholder.jpg"
                alt=""
              />
            </Avatar>
          </div>
          <div className="card-content flex flex-col gap-4 w-[calc(100%_-_216px)]">
            <h6 className="text-foreground">{formData?.medication_data?.drug_name}</h6>
            <ul className="flex space-x-3 divide-x last">
              <li>
                <span className="text-fs-md text-foreground !font-medium">{formData?.medication_data?.category?.title}</span>
              </li>
              <li className="pl-3">
                <span className="text-fs-md text-foreground !font-medium">{formData?.medication_data?.type}</span>
              </li>
              {/* <li className="pl-3">
                <span className="text-fs-md text-foreground !font-medium">Mini Troche</span>
              </li>
              <li className="pl-3">
                <span className="text-fs-md text-foreground !font-medium">Schedule: L</span>
              </li> */}
            </ul>
            {formData?.medication_data?.is_controlled == 1 ? (
              <Button
                w="140"
                variant="light"
                color="primary"
              >
                Controlled
              </Button>
            ) : (
              ""
            )}
            <h4>${formData?.medication_data?.price}</h4>
          </div>
        </div>
        <div className="flex flex-col gap-10 pt-6">
          {/* <div className="flex flex-col gap-5">
            <h6 className="text-foreground">Dosage Form:</h6>
            <div className="flex gap-16">
              {qtyItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-3 cursor-pointer"
                  onClick={() => selectItem("qty", index)}
                >
                  <div
                    className={`size-[100px] rounded-full flex items-center justify-center relative ${
                      item.active ? "bg-primary" : "bg-primary-light"
                    }`}
                  >
                    <i className={`${item.icon} text-4xl/none ${item.active ? "text-white" : "text-foreground"}`}></i>
                    <i
                      className={`${
                        item.activeIcon
                      } text-xl/none text-white size-8 bg-green border border-white rounded-full flex items-center justify-center absolute top-3 -right-3 ${
                        item.active ? "block" : "hidden"
                      }`}
                    ></i>
                  </div>
                  <p className="extra-form-text-medium text-foreground">{item.title}</p>
                </div>
              ))}
            </div>
          </div> */}
          {/* <div className="flex flex-col gap-5">
            <h6 className="text-foreground">Strength:</h6>
            <div className="flex gap-16">
              {strengthItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-3 cursor-pointer"
                  onClick={() => selectItem("strength", index)}
                >
                  <div
                    className={`size-[100px] rounded-full flex items-center justify-center relative ${
                      item.active ? "bg-primary" : "bg-primary-light"
                    }`}
                  >
                    <i className={`${item.icon} text-4xl/none ${item.active ? "text-white" : "text-foreground"}`}></i>
                    <i
                      className={`${
                        item.activeIcon
                      } text-xl/none text-white size-8 bg-green border border-white rounded-full flex items-center justify-center absolute top-3 -right-3 ${
                        item.active ? "block" : "hidden"
                      }`}
                    ></i>
                  </div>
                  <p className="extra-form-text-medium text-foreground">{item.title}</p>
                </div>
              ))}
            </div>
          </div> */}
          <div className="flex flex-col gap-5">
            <h6 className="text-foreground">Quantity:</h6>
            <div className="flex items-center gap-16">
              {quantityItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-3 cursor-pointer"
                  onClick={() => selectItem("quantity", item.count)}
                >
                  <div
                    className={`size-[100px] rounded-full flex items-center justify-center relative ${
                      quantity == item.count ? "bg-primary" : "bg-primary-light"
                    }`}
                  >
                    <h5 className={` ${quantity == item.count ? "text-white" : "text-foreground"}`}>{item.count}</h5>
                    <i
                      className={`text-xl/none text-white size-8 bg-green-middle border border-white rounded-full flex items-center justify-center absolute top-3 -right-3 ${
                        quantity == item.count ? "block icon-tick" : "hidden"
                      }`}
                    ></i>
                  </div>
                </div>
              ))}
              <Input.Wrapper
                label="Other:"
                classNames={{
                  root: "!flex gap-4",
                  label: "!mb-0 !self-center",
                }}
              >
                <Input
                  type="text"
                  className="max-w-[134px]"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                  }}
                />
              </Input.Wrapper>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <h6 className="text-foreground">Refills:</h6>
            <div className="flex items-center gap-16">
              {refillsItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-3 cursor-pointer"
                  onClick={() => selectItem("refill", item.count)}
                >
                  <div
                    className={`size-[100px] rounded-full flex items-center justify-center relative ${
                      refills == item.count ? "bg-primary" : "bg-primary-light"
                    }`}
                  >
                    <h5 className={`${refills == item.count ? "text-white" : "text-foreground"}`}>{item.count}</h5>
                    <i
                      className={`text-xl/none text-white size-8 bg-green-middle border border-white rounded-full flex items-center justify-center absolute top-3 -right-3 ${
                        refills == item.count ? "block icon-tick" : "hidden"
                      }`}
                    ></i>
                  </div>
                </div>
              ))}
              <Input.Wrapper
                label="Other:"
                classNames={{
                  root: "!flex gap-4",
                  label: "!mb-0 !self-center",
                }}
              >
                <Input
                  type="text"
                  className="max-w-[134px]"
                  value={refills}
                  onChange={(e) => {
                    setRefills(e.target.value);
                  }}
                />
              </Input.Wrapper>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <h6 className="text-foreground">Intervals:</h6>
            <div className="flex items-center gap-16">
              {intervalItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-3 cursor-pointer"
                  onClick={() => selectItem("interval", item.count)}
                >
                  <div
                    className={`size-[100px] rounded-full flex items-center justify-center relative ${
                      intervals == item.count ? "bg-primary" : "bg-primary-light"
                    }`}
                  >
                    <h5 className={`max-w-20 mx-auto text-center ${intervals == item.count ? "text-white" : "text-foreground"}`}>
                      {item.count} days
                    </h5>
                    <i
                      className={`text-xl/none text-white size-8 bg-green-middle border border-white rounded-full flex items-center justify-center absolute top-3 -right-3 ${
                        intervals == item.count ? "block icon-tick" : "hidden"
                      }`}
                    ></i>
                  </div>
                </div>
              ))}
              <Input.Wrapper
                label="Other:"
                classNames={{
                  root: "!flex gap-4",
                  label: "!mb-0 !self-center",
                }}
              >
                <Input
                  type="text"
                  className="max-w-[134px]"
                  value={intervals}
                  onChange={(e) => {
                    handleIntervalChange(e.target.value);
                  }}
                />
              </Input.Wrapper>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <h6 className="text-foreground">First Auto Refill Date:</h6>
            <div className="flex items-center gap-16">
              <div className={` dml-Input-wrapper dml-Input-Calendar relative`}>
                <StyletronProvider value={engine}>
                  <BaseProvider theme={LightTheme}>
                    <UberDatePicker
                      aria-label="Select a date"
                      placeholder="MM/DD/YYYY"
                      formatString="MM/dd/yyyy"
                      highlightedDate={maxDate}
                      maxDate={maxDate}
                      minDate={minDate}
                      value={refillDate}
                      mask="99/99/9999"
                      error={true}
                      onChange={(data) => {
                        setRefillDate([data.date]);
                        // setValue("dob", [data.date]);
                        // if (data.date) {
                        //   clearErrors("dob");
                        // }
                      }}
                      overrides={BaseWebDatePickerOverrides}
                    />
                  </BaseProvider>
                </StyletronProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <div className="flex gap-6 ms-auto">
          <Button
            px={0}
            variant="transparent"
            onClick={handleBack}
            classNames={{
              label: "underline font-medium",
            }}
          >
            Back
          </Button>
          <Button
            w={256}
            color="grey.4"
            c="foreground"
            disabled
          >
            Save as Draft
          </Button>
          <Button
            w={256}
            onClick={saveDosageDetails}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

export default StepThree;
