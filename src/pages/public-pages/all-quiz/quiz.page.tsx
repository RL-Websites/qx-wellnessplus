import ThanksStep from "@/pages/private-pages/patient-intake/intake-steps/thanks-step";
import { useWindowScroll } from "@mantine/hooks";
import { useState } from "react";
import DateOfBirth from "./quizes/DateOfBirth";
import Gender from "./quizes/Gender";
import Age from "./quizes/hair-loss/Age";
import AlopeciaAreata from "./quizes/hair-loss/AlopeciaAreata";
import BreastFeeding from "./quizes/hair-loss/BreastFeeding";
import Chemotherapy from "./quizes/hair-loss/Chemotherapy";
import HairTreatment from "./quizes/hair-loss/HairTreatment";
import MedicationTaking from "./quizes/hair-loss/MedicationTaking";
import Pcos from "./quizes/hair-loss/PCOS";
import PlanningPregnancy from "./quizes/hair-loss/PlanningPregnancy";
import ScalpInfections from "./quizes/hair-loss/ScalpInfections";
import ScalpInfectionsTwo from "./quizes/hair-loss/ScalpInfectionsTwo";
import ThyroidDisease from "./quizes/hair-loss/ThyroidDisease";

const QuizPage = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [totalStep, setTotalStep] = useState(20);
  const [, scrollTo] = useWindowScroll();

  const progress = ((activeStep - 1) / (totalStep - 1)) * 100; // Adjust for hidden step 1

  const handleNext = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    if (activeStep < totalStep) {
      setActiveStep((prev) => prev + 1);
    }
    scrollTo({ y: 0 });
    console.log(data);
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
          onNext={handleNext}
          onBack={handleBack}
          defaultValues={formData}
        />
      )}
      {activeStep === 9 && (
        <PlanningPregnancy
          onNext={handleNext}
          onBack={handleBack}
          defaultValues={formData}
        />
      )}
      {activeStep === 10 && (
        <BreastFeeding
          onNext={handleNext}
          onBack={handleBack}
          defaultValues={formData}
        />
      )}
      {activeStep === 11 && (
        <Pcos
          onNext={handleNext}
          onBack={handleBack}
          defaultValues={formData}
        />
      )}
      {activeStep === 12 && (
        <ScalpInfectionsTwo
          onNext={handleNext}
          onBack={handleBack}
          defaultValues={formData}
        />
      )}
      {activeStep === 13 && (
        <HairTreatment
          onNext={handleNext}
          onBack={handleBack}
          defaultValues={formData}
        />
      )}

      {activeStep === 14 && <ThanksStep />}
    </>
  );
};

export default QuizPage;
