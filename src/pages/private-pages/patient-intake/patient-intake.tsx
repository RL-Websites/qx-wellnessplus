import { Progress } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { useState } from "react";
import FullBodyPhoto from "./intake-steps/FullbodyPhoto";
import StepOne from "./intake-steps/step-one";

const PatientIntake = () => {
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
      {activeStep > 1 && (
        <div className="max-w-[520px] mx-auto mb-6">
          <Progress value={progress} />
          <div className="text-center text-base text-foreground font-bold mt-3">
            {activeStep - 1} / {totalStep - 1}
          </div>
        </div>
      )}

      {activeStep === 1 && (
        <FullBodyPhoto
          onNext={handleNext}
          defaultValues={formData}
        />
      )}
      {activeStep === 2 && (
        <StepOne
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

export default PatientIntake;
