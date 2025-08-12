import ThanksStep from "@/pages/private-pages/patient-intake/intake-steps/thanks-step";
import { useWindowScroll } from "@mantine/hooks";
import { useState } from "react";
import DateOfBirth from "./quizes/DateOfBirth";
import Gender from "./quizes/Gender";
import Age from "./quizes/hair-loss/Age";
import AlopeciaAreata from "./quizes/hair-loss/AlopeciaAreata";
import ScalpInfections from "./quizes/hair-loss/ScalpInfections";

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

      {activeStep === 6 && <ThanksStep />}
    </>
  );
};

export default QuizPage;
