import { selectedCategoryAtom } from "@/common/states/category.atom";
import ThanksStep from "@/pages/private-pages/patient-intake/intake-steps/thanks-step";
import { useWindowScroll } from "@mantine/hooks";
import { useAtomValue } from "jotai"; // ✅ useAtomValue for reading
import { useState } from "react";
import DateOfBirth from "./quizes/DateOfBirth";
import Gender from "./quizes/Gender";
import Age from "./quizes/hair-growth/Age";
import AlopeciaAreata from "./quizes/hair-growth/AlopeciaAreata";
import BreastFeeding from "./quizes/hair-growth/BreastFeeding";
import Chemotherapy from "./quizes/hair-growth/Chemotherapy";
import HairTreatment from "./quizes/hair-growth/HairTreatment";
import MedicationTaking from "./quizes/hair-growth/MedicationTaking";
import Pcos from "./quizes/hair-growth/Pcos";
import PlanningPregnancy from "./quizes/hair-growth/PlanningPregnancy";
import ScalpInfections from "./quizes/hair-growth/ScalpInfections";
import ScalpInfectionsTwo from "./quizes/hair-growth/ScalpInfectionsTwo";
import ThyroidDisease from "./quizes/hair-growth/ThyroidDisease";
import CustomerStatus from "./quizes/weight-loss/CustomerStatus";

const QuizPage = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [totalStep] = useState(20);
  const [, scrollTo] = useWindowScroll();

  const selectedCategory = useAtomValue(selectedCategoryAtom);

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
      {activeStep === 2 && (
        <Gender
          onNext={handleNext}
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
          {activeStep === 4 && (
            <CustomerStatus
              onNext={handleFinalSubmit}
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
            <ScalpInfections
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

      {activeStep > lastStep && <ThanksStep />}
    </>
  );
};

export default QuizPage;
