import { ICommonParams } from "@/common/api/models/interfaces/Common.model";
import { IMedicineListItem } from "@/common/api/models/interfaces/Medication.model";
import { medicineRepository } from "@/common/api/repositories/medicineRepository";
import { IShowing } from "@/common/components/CustomFilter";
import { Avatar, Button } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface MedicationDataType {
  medication_id: string;
}
interface StepTwoProps {
  handleBack: () => void;
  formData: any;
  handleSubmit: (medicineData: MedicationDataType) => void;
}

function StepTwo({ handleBack, handleSubmit, formData }: StepTwoProps) {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [showing, setShowing] = useState<IShowing | null>(null);
  const [statusFilter, setStatusFilter] = useState<string[]>(["1", "2"]);
  const [medicines, setMedicines] = useState<IMedicineListItem[]>();
  const [selectedMedicine, setSelectedMedicine] = useState<string>();
  const [error, setError] = useState<string>();
  const fetchMedicine = () => {
    const params: ICommonParams = {
      per_page: pageSize,
      page: pageIndex,
      status: statusFilter,
      sort_column: "id",
      sort_direction: "desc",
    };
    return medicineRepository.getAllMedicines(params);
  };
  const medicineQuery = useQuery({ queryKey: ["Step2medicines"], queryFn: fetchMedicine });

  useEffect(() => {
    if (formData?.medication_id) {
      setSelectedMedicine(formData.medication_id);
    }
  }, [formData]);

  useEffect(() => {
    if (medicineQuery?.data?.data?.status_code == 200 && medicineQuery?.data?.data?.data?.data) {
      setMedicines(medicineQuery?.data?.data?.data?.data);
    }
  }, [medicineQuery.isFetched, medicineQuery.data]);

  const saveMedicineData = () => {
    if (selectedMedicine) {
      const medicine = medicines?.find((item) => (item.id ? item.id.toString() == selectedMedicine : {}));
      const medicineData = {
        medication_id: selectedMedicine,
        medication_data: medicine,
      };
      handleSubmit(medicineData);
    } else {
      setError("Please select a medicine");
    }
  };

  const handleMedicineSelect = (id: string) => {
    if (id) {
      setSelectedMedicine(id);
      setError("");
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-title with-border mb-6">
          <h6>Medication Information</h6>
        </div>
        <span className="extra-form-text-medium text-foreground">Select Medicines</span>
        <div className="grid grid-cols-2 gap-6 pt-4">
          {medicines?.map((item) => (
            <div
              className="card p-5 border border-grey-low flex gap-4 cursor-pointer"
              key={item.id}
              onClick={() => handleMedicineSelect(item.id ? item.id.toString() : "")}
            >
              <div className="card-thumb w-[200px]">
                <Avatar
                  src={`${import.meta.env.VITE_BASE_PATH}/storage/${item.image}`}
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
                <h6 className="text-foreground">{item?.drug_name}</h6>
                <ul className="flex space-x-1 divide-x last">
                  <li>
                    <span className="text-fs-md">{item?.type}</span>
                  </li>
                  <li className="pl-1">
                    <span className="text-fs-md">{item?.category?.title}</span>
                  </li>
                </ul>
                <h4>${item?.price}</h4>
                <Button
                  variant="transparent"
                  p={0}
                  w={40}
                  className="ms-auto"
                >
                  <i
                    className={` text-4xl/none transition-all duration-300 ${
                      selectedMedicine == item.id.toString()
                        ? "icon-checkmark-circle text-green-middle rounded-full text-2xl/none flex items-center justify-center"
                        : "icon-radio-button-deselected text-grey-low"
                    }`}
                  ></i>
                </Button>
              </div>
            </div>
          ))}
          {/* <div className="card p-5 border border-grey-low flex gap-4">
            <div className="card-thumb w-[200px]">
              <Avatar
                src={`/images/medicine-1.png`}
                size={200}
                radius={10}
              ></Avatar>
            </div>
            <div className="card-content flex flex-col gap-3 w-[calc(100%_-_216px)]">
              <h6 className="text-foreground">Tirzepatide Injectable Solution</h6>
              <ul className="flex space-x-1 divide-x last">
                <li>
                  <span className="text-fs-md">Capsule</span>
                </li>
                <li className="pl-1">
                  <span className="text-fs-md">Hair Fall</span>
                </li>
              </ul>
              <h4>$399</h4>
              <Button
                variant="transparent"
                p={0}
                w={40}
                className="ms-auto"
              >
                <i className="icon-radio-button-deselected text-4xl/none text-grey-low"></i>
              </Button>
            </div>
          </div>
          <div className="card p-5 border border-grey-low flex gap-4">
            <div className="card-thumb w-[200px]">
              <Avatar
                src={`/images/medicine.png`}
                size={200}
                radius={10}
              ></Avatar>
            </div>
            <div className="card-content flex flex-col gap-3 w-[calc(100%_-_216px)]">
              <h6 className="text-foreground">Tirzepatide Injectable Solution</h6>
              <ul className="flex space-x-1 divide-x last">
                <li>
                  <span className="text-fs-md">Capsule</span>
                </li>
                <li className="pl-1">
                  <span className="text-fs-md">Hair Fall</span>
                </li>
              </ul>
              <h4>$399</h4>
              <Button
                variant="transparent"
                p={0}
                w={40}
                className="ms-auto"
              >
                <i className="icon-radio-button-deselected text-4xl/none text-grey-low"></i>
              </Button>
            </div>
          </div>
          <div className="card p-5 border border-grey-low flex gap-4">
            <div className="card-thumb w-[200px]">
              <Avatar
                src={`/images/medicine-1.png`}
                size={200}
                radius={10}
              ></Avatar>
            </div>
            <div className="card-content flex flex-col gap-3 w-[calc(100%_-_216px)]">
              <h6 className="text-foreground">Tirzepatide Injectable Solution</h6>
              <ul className="flex space-x-1 divide-x last">
                <li>
                  <span className="text-fs-md">Capsule</span>
                </li>
                <li className="pl-1">
                  <span className="text-fs-md">Hair Fall</span>
                </li>
              </ul>
              <h4>$399</h4>
              <Button
                variant="transparent"
                p={0}
                w={40}
                className="ms-auto"
              >
                <i className="icon-radio-button-deselected text-4xl/none text-grey-low"></i>
              </Button>
            </div>
          </div>
          <div className="card p-5 border border-grey-low flex gap-4">
            <div className="card-thumb w-[200px]">
              <Avatar
                src={`/images/medicine.png`}
                size={200}
                radius={10}
              ></Avatar>
            </div>
            <div className="card-content flex flex-col gap-3 w-[calc(100%_-_216px)]">
              <h6 className="text-foreground">Tirzepatide Injectable Solution</h6>
              <ul className="flex space-x-1 divide-x last">
                <li>
                  <span className="text-fs-md">Capsule</span>
                </li>
                <li className="pl-1">
                  <span className="text-fs-md">Hair Fall</span>
                </li>
              </ul>
              <h4>$399</h4>
              <Button
                variant="transparent"
                p={0}
                w={40}
                className="ms-auto"
              >
                <i className="icon-radio-button-deselected text-4xl/none text-grey-low"></i>
              </Button>
            </div>
          </div>
          <div className="card p-5 border border-grey-low flex gap-4">
            <div className="card-thumb w-[200px]">
              <Avatar
                src={`/images/medicine.png`}
                size={200}
                radius={10}
              ></Avatar>
            </div>
            <div className="card-content flex flex-col gap-3 w-[calc(100%_-_216px)]">
              <h6 className="text-foreground">Tirzepatide Injectable Solution</h6>
              <ul className="flex space-x-1 divide-x last">
                <li>
                  <span className="text-fs-md">Capsule</span>
                </li>
                <li className="pl-1">
                  <span className="text-fs-md">Hair Fall</span>
                </li>
              </ul>
              <h4>$399</h4>
              <Button
                variant="transparent"
                p={0}
                w={40}
                className="ms-auto"
              >
                <i className="icon-radio-button-deselected text-4xl/none text-grey-low"></i>
              </Button>
            </div>
          </div>
          <div className="card p-5 border border-grey-low flex gap-4">
            <div className="card-thumb w-[200px]">
              <Avatar
                src={`/images/medicine.png`}
                size={200}
                radius={10}
              ></Avatar>
            </div>
            <div className="card-content flex flex-col gap-3 w-[calc(100%_-_216px)]">
              <h6 className="text-foreground">Tirzepatide Injectable Solution</h6>
              <ul className="flex space-x-1 divide-x last">
                <li>
                  <span className="text-fs-md">Capsule</span>
                </li>
                <li className="pl-1">
                  <span className="text-fs-md">Hair Fall</span>
                </li>
              </ul>
              <h4>$399</h4>
              <Button
                variant="transparent"
                p={0}
                w={40}
                className="ms-auto"
              >
                <i className="icon-radio-button-deselected text-4xl/none text-grey-low"></i>
              </Button>
            </div>
          </div>
          <div className="card p-5 border border-grey-low flex gap-4">
            <div className="card-thumb w-[200px]">
              <Avatar
                src={`/images/medicine-1.png`}
                size={200}
                radius={10}
              ></Avatar>
            </div>
            <div className="card-content flex flex-col gap-3 w-[calc(100%_-_216px)]">
              <h6 className="text-foreground">Tirzepatide Injectable Solution</h6>
              <ul className="flex space-x-1 divide-x last">
                <li>
                  <span className="text-fs-md">Capsule</span>
                </li>
                <li className="pl-1">
                  <span className="text-fs-md">Hair Fall</span>
                </li>
              </ul>
              <h4>$399</h4>
              <Button
                variant="transparent"
                p={0}
                w={40}
                className="ms-auto"
              >
                <i className="icon-radio-button-deselected text-4xl/none text-grey-low"></i>
              </Button>
            </div>
          </div>
          <div className="card p-5 border border-grey-low flex gap-4">
            <div className="card-thumb w-[200px]">
              <Avatar
                src={`/images/medicine.png`}
                size={200}
                radius={10}
              ></Avatar>
            </div>
            <div className="card-content flex flex-col gap-3 w-[calc(100%_-_216px)]">
              <h6 className="text-foreground">Tirzepatide Injectable Solution</h6>
              <ul className="flex space-x-1 divide-x last">
                <li>
                  <span className="text-fs-md">Capsule</span>
                </li>
                <li className="pl-1">
                  <span className="text-fs-md">Hair Fall</span>
                </li>
              </ul>
              <h4>$399</h4>
              <Button
                variant="transparent"
                p={0}
                w={40}
                className="ms-auto"
              >
                <i className="icon-radio-button-deselected text-4xl/none text-grey-low"></i>
              </Button>
            </div>
          </div>
          <div className="card p-5 border border-grey-low flex gap-4">
            <div className="card-thumb w-[200px]">
              <Avatar
                src={`/images/medicine.png`}
                size={200}
                radius={10}
              ></Avatar>
            </div>
            <div className="card-content flex flex-col gap-3 w-[calc(100%_-_216px)]">
              <h6 className="text-foreground">Tirzepatide Injectable Solution</h6>
              <ul className="flex space-x-1 divide-x last">
                <li>
                  <span className="text-fs-md">Capsule</span>
                </li>
                <li className="pl-1">
                  <span className="text-fs-md">Hair Fall</span>
                </li>
              </ul>
              <h4>$399</h4>
              <Button
                variant="transparent"
                p={0}
                w={40}
                className="ms-auto"
              >
                <i className="icon-radio-button-deselected text-4xl/none text-grey-low"></i>
              </Button>
            </div>
          </div> */}
          {error ? <p className="text-base text-danger">{error}</p> : ""}
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
            onClick={saveMedicineData}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

export default StepTwo;
