import { selectedCategoryAtom } from "@/common/states/category.atom";
import { useWindowScroll } from "@mantine/hooks";
import { useAtomValue } from "jotai"; // ✅ useAtomValue for reading
import { useState } from "react";
import MedicationsPage from "../medication/medications.page";
import DateOfBirth from "./quizes/DateOfBirth";
import Gender from "./quizes/Gender";

import AlopeciaAreata from "./quizes/hair-growth/AlopeciaAreata";
import BreastFeeding from "./quizes/hair-growth/BreastFeeding";
import Chemotherapy from "./quizes/hair-growth/Chemotherapy";
import HairTreatment from "./quizes/hair-growth/HairTreatment";
import MedicationTaking from "./quizes/hair-growth/MedicationTaking";
import Pcos from "./quizes/hair-growth/Pcos";
import PlanningPregnancy from "./quizes/hair-growth/PlanningPregnancy";
import ScalpInfections from "./quizes/hair-growth/ScalpInfections";

import InEligibleUser from "../ineligible-user/ineligible-user.page";
import ScalpInfectionsTwo from "./quizes/hair-growth/ScalpInfectionsTwo";
import ThyroidDisease from "./quizes/hair-growth/ThyroidDisease";
import ScalpInfectionsTestosterone from "./quizes/testosterone/ScalpInfections";
import Age from "./quizes/weight-loss/Age";
import CustomerStatus from "./quizes/weight-loss/CustomerStatus";

const QuizPage = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [totalStep] = useState(20);
  const [, scrollTo] = useWindowScroll();
  const selectedCategory = useAtomValue(selectedCategoryAtom);
  const [eligibleComponent, setEligibleComponent] = useState<React.ReactNode | null>(null);
  const [customerStatusComponent, setCustomerStatusComponent] = useState<React.ReactNode | null>(null);

  const lastStepByCategory: Record<string, number> = {
    "Hair Growth (male)": 8,
    "Hair Growth (female)": 8,
    Testosterone: 4,
    "Weight Loss": 4,
    "Peptides Blends": 5,
  };

  const defaultLastStep = 2;

  const lastStep = lastStepByCategory[selectedCategory as string] ?? defaultLastStep;

  const handleFinalSubmit = (data: any) => {
    const tempData = { ...formData, ...data };
    console.log(tempData);
    setFormData(tempData);
    setActiveStep((prev) => prev + 1);
  };

  const handleNext = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    if (activeStep < totalStep) {
      setActiveStep((prev) => prev + 1);
    }
    scrollTo({ y: 0 });
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
    }
    scrollTo({ y: 0 });
  };

  return (
    <>
      {activeStep === 1 && (
        <DateOfBirth
          onNext={handleNext}
          onBack={handleBack}
          defaultValues={formData}
        />
      )}
      {eligibleComponent
        ? eligibleComponent
        : activeStep === 2 && (
            <Gender
              onNext={(data) => {
                setFormData((prev) => ({ ...prev, ...data }));
                if (data.inEligibleUser) {
                  setEligibleComponent(<InEligibleUser />);
                } else {
                  handleNext(data);
                }
              }}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

      {selectedCategory === "Weight Loss" && (
        <>
          {activeStep === 3 && (
            <Age
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {customerStatusComponent
            ? customerStatusComponent
            : activeStep === 4 && (
                <CustomerStatus
                  onNext={(data) => {
                    setFormData((prev) => ({ ...prev, ...data }));
                    if (data.inEligibleUser) {
                      setCustomerStatusComponent(<InEligibleUser />);
                    } else {
                      handleNext(data);
                    }
                  }}
                  onBack={handleBack}
                  defaultValues={formData}
                />
              )}
        </>
      )}
      {selectedCategory === "Testosterone" && (
        <>
          {activeStep === 3 && (
            <Age
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 4 && (
            <ScalpInfectionsTestosterone
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
        </>
      )}
      {selectedCategory === "Hair Growth (male)" && (
        <>
          {activeStep === 3 && (
            <Age
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 4 && (
            <ScalpInfections
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 5 && (
            <AlopeciaAreata
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 6 && (
            <MedicationTaking
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 7 && (
            <ThyroidDisease
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 8 && (
            <Chemotherapy
              onNext={handleFinalSubmit}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
        </>
      )}
      {selectedCategory === "Hair Growth (female)" && (
        <>
          {activeStep === 3 && (
            <Age
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 4 && (
            <PlanningPregnancy
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 5 && (
            <BreastFeeding
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 6 && (
            <Pcos
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 7 && (
            <ScalpInfectionsTwo
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 8 && (
            <HairTreatment
              onNext={handleFinalSubmit}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
        </>
      )}

      {selectedCategory === "Peptides Blends" && (
        <>
          {activeStep === 3 && (
            <Age
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 4 && (
            <CustomerStatus
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 5 && (
            <Pcos
              onNext={handleFinalSubmit}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
        </>
      )}

      {activeStep > lastStep && <MedicationsPage />}
    </>
  );
};

export default QuizPage;
