import { useWindowScroll } from "@mantine/hooks";
import { useState } from "react";
import Age from "./hair-loss/Age";

const HairLoassQuiz = () => {
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
        <Age
          onNext={handleNext}
          onBack={handleBack}
          defaultValues={formData}
        />
      )}

      {/* Continue other steps like this */}
      {/* {activeStep === 2 && <StepOne ... />} */}
    </>
  );
};

export default HairLoassQuiz;
