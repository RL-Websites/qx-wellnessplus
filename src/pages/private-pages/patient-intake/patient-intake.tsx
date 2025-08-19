import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IPatientIntakeFormDTO } from "@/common/api/models/interfaces/PartnerPatient.model";
import orderApiRepository from "@/common/api/repositories/orderRepository";
import dmlToast from "@/common/configs/toaster.config";
import { selectedCategoryAtom } from "@/common/states/category.atom";
import { basicInfoAtom } from "@/common/states/customerBasic.atom";
import { Progress } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FullBodyPhoto from "./intake-steps/FullbodyPhoto";
import { questions } from "./intake-steps/questions";
import StepEight from "./intake-steps/step-eight";
import StepFifteen from "./intake-steps/step-filteen";
import StepFive from "./intake-steps/step-five";
import StepFour from "./intake-steps/step-four";
import StepFourteen from "./intake-steps/step-fourteen";
import StepNine from "./intake-steps/step-nine";
import StepOne from "./intake-steps/step-one";
import StepSeven from "./intake-steps/step-seven";
import StepSeventeen from "./intake-steps/step-seventeen";
import StepSix from "./intake-steps/step-six";
import StepSixteen from "./intake-steps/step-sixteen";
import StepTen from "./intake-steps/step-ten";
import StepThirteen from "./intake-steps/step-thirteen";
import StepThree from "./intake-steps/step-three";
import StepTwelve from "./intake-steps/step-twelve";
import StepTwo from "./intake-steps/step-two";
import StepEleven from "./intake-steps/step.eleven";
import ThanksStep from "./intake-steps/thanks-step";

interface CategoryConfig {
  steps: number[];
  finalStep: number;
}

const categoryStepsMap: Record<string, CategoryConfig> = {
  "Single Peptides": {
    steps: [1, 10],
    finalStep: 10,
  },
  "Peptides Blends": {
    steps: [1, 10],
    finalStep: 10,
  },
  "Weight Loss": {
    steps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    finalStep: -1,
  },
  Testosterone: {
    steps: [1, 2, 3, 13],
    finalStep: 13,
  },
  "Hair Growth": {
    steps: [1, 3, 13],
    finalStep: 13,
  },
  Others: {
    steps: [1, 2, 13],
    finalStep: 13,
  },
};

const PatientIntake = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [finalStep, setFinalStep] = useState<number>(18);
  const [, scrollTo] = useWindowScroll();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const prescriptionUId = params.get("prescription_u_id");
  const selectedCategory = useAtomValue(selectedCategoryAtom);
  const [basicInfo] = useAtom(basicInfoAtom);

  const isFinalStep = (step: number) => step === finalStep;

  useEffect(() => {
    const categoriesArray: string[] = Array.isArray(selectedCategory) ? selectedCategory : selectedCategory ? [selectedCategory] : [];

    if (!categoriesArray.length) return;
    const allSteps = categoriesArray.map((cat) => categoryStepsMap[cat]?.steps || []).flat();
    const uniqueSteps = Array.from(new Set(allSteps)).sort((a, b) => a - b);

    let calculatedFinalStep = 17; // default for male
    if (basicInfo?.patient?.gender === "female") {
      calculatedFinalStep = 18;
    }

    const peptideCategories = ["Single Peptides", "Peptides Blends"];
    if (categoriesArray.some((cat) => peptideCategories.includes(cat))) {
      calculatedFinalStep = 10;
    } else if (categoriesArray.includes("Weight Loss")) {
      // Keep the gender-specific final step (17 or 18)
    } else if (categoriesArray[0] && categoryStepsMap[categoriesArray[0]]) {
      calculatedFinalStep = categoryStepsMap[categoriesArray[0]].finalStep;
    }

    setVisibleSteps(uniqueSteps);
    setFinalStep(calculatedFinalStep);

    if (!uniqueSteps.includes(activeStep)) {
      setActiveStep(uniqueSteps[0]);
    }
  }, [selectedCategory, basicInfo?.patient?.gender]);

  const progressSteps = visibleSteps.filter((step) => step !== 1);

  const progress = progressSteps.length > 1 ? (progressSteps.indexOf(activeStep) / (progressSteps.length - 1)) * 100 : activeStep === 1 ? 0 : 100;

  const handleNext = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    const currentIndex = visibleSteps.indexOf(activeStep);
    if (currentIndex < visibleSteps.length - 1) {
      setActiveStep(visibleSteps[currentIndex + 1]);
    }
    scrollTo({ y: 0 });
  };

  const handleBack = () => {
    const currentIndex = visibleSteps.indexOf(activeStep);
    if (currentIndex > 0) {
      setActiveStep(visibleSteps[currentIndex - 1]);
    }
    scrollTo({ y: 0 });
  };

  const intakeFormMutation = useMutation({
    mutationFn: (payload: IPatientIntakeFormDTO) => orderApiRepository.patientIntakeFormSubmit(payload),
  });

  const handleFinalSubmit = (data: any) => {
    const tempData = { ...formData, ...data };
    // const measurement = tempData.measurement;
    const measurement = { ...tempData.measurement, height: `${tempData.measurement.height_feet}'${tempData.measurement.height_inch}''` };

    const formattedData = questions
      .map((item) =>
        tempData[item.name]
          ? {
              question: item.label,
              key: item.name,
              answer: Array.isArray(tempData[item.name]) ? tempData[item.name] : [tempData[item.name]],
            }
          : null
      )
      .filter((item) => item !== null);

    const payload: IPatientIntakeFormDTO = {
      prescription_u_id: prescriptionUId || "",
      measurement: measurement,
      questionnaires: formattedData || [],
    };

    intakeFormMutation.mutate(payload, {
      onSuccess: () => {
        dmlToast.success({ title: "Intake form submitted successfully" });
        setActiveStep(19); // Thanks step
      },
      onError: (err) => {
        const error = err as AxiosError<IServerErrorResponse>;
        console.error(error);
        dmlToast.error({
          title: "Oops! Something went wrong. Please try again later.",
        });
      },
    });
  };

  const shouldSubmit = (step: number) => {
    if (selectedCategory?.includes("Weight Loss")) {
      return (basicInfo?.patient?.gender === "female" && step === 18) || (basicInfo?.patient?.gender !== "female" && step === 17);
    }
    return step === finalStep;
  };

  const renderStep = (stepNumber: number, Component: React.ComponentType<any>) => {
    if (!visibleSteps.includes(stepNumber)) return null;

    return (
      <Component
        onNext={shouldSubmit(stepNumber) ? handleFinalSubmit : handleNext}
        onBack={handleBack}
        defaultValues={formData}
        isLoading={shouldSubmit(stepNumber) && intakeFormMutation.isPending}
      />
    );
  };

  return (
    <>
      {activeStep !== visibleSteps[0] && activeStep !== 19 ? (
        <div className="max-w-[520px] mx-auto mb-6">
          <h2 className="heading-text pb-12 text-center">Intake Form</h2>
          <Progress value={progress} />
          <div className="text-center text-base text-foreground font-bold mt-3">
            {progressSteps.indexOf(activeStep) + 1} / {progressSteps.length}
          </div>
        </div>
      ) : activeStep === visibleSteps[0] ? (
        <h2 className="heading-text text-foreground uppercase text-center">help us better understand</h2>
      ) : null}

      {/* Render all steps */}
      {activeStep === 1 && renderStep(1, FullBodyPhoto)}
      {activeStep === 2 && renderStep(2, StepOne)}
      {activeStep === 3 && renderStep(3, StepTwo)}
      {activeStep === 4 && renderStep(4, StepThree)}
      {activeStep === 5 && renderStep(5, StepFour)}
      {activeStep === 6 && renderStep(6, StepFive)}
      {activeStep === 7 && renderStep(7, StepSix)}
      {activeStep === 8 && renderStep(8, StepSeven)}
      {activeStep === 9 && renderStep(9, StepEight)}
      {activeStep === 10 && renderStep(10, StepNine)}
      {activeStep === 11 && renderStep(11, StepTen)}
      {activeStep === 12 && renderStep(12, StepEleven)}
      {activeStep === 13 && renderStep(13, StepTwelve)}
      {activeStep === 14 && renderStep(14, StepThirteen)}
      {activeStep === 15 && renderStep(15, StepFourteen)}
      {activeStep === 16 && renderStep(16, StepFifteen)}
      {activeStep === 17 && renderStep(17, StepSixteen)}
      {activeStep === 18 && renderStep(18, StepSeventeen)}

      {activeStep === 19 && <ThanksStep />}
    </>
  );
};

export default PatientIntake;
