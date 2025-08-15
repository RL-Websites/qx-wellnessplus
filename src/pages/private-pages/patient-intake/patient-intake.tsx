import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IPatientIntakeFormDTO } from "@/common/api/models/interfaces/PartnerPatient.model";
import orderApiRepository from "@/common/api/repositories/orderRepository";
import dmlToast from "@/common/configs/toaster.config";
import { selectedCategoryAtom } from "@/common/states/category.atom";
import { Progress } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FullBodyPhoto from "./intake-steps/FullbodyPhoto";
import { questions } from "./intake-steps/questions";
import StepOne from "./intake-steps/step-one";
import StepThree from "./intake-steps/step-three";
import StepTwo from "./intake-steps/step-two";
import ThanksStep from "./intake-steps/thanks-step";

// Map of category => steps to show
const categoryStepsMap: Record<string, number[]> = {
  "Single Peptides": [1, 2, 4],
  "Peptides Blends": [1, 2, 4],
  "Weight Loss": [1, 2, 3, 4],
  Testosterone: [1, 2, 3, 4],
  "Hair Growth": [1, 3, 4],
  Others: [1, 2, 3],
};

const PatientIntake = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [totalStep, setTotalStep] = useState(4);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([1, 2, 3, 4]);
  const [, scrollTo] = useWindowScroll();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const prescriptionUId = params.get("prescription_u_id");
  const selectedCategory = useAtomValue(selectedCategoryAtom);

  useEffect(() => {
    // Ensure selectedCategory is always an array
    const categoriesArray: string[] = Array.isArray(selectedCategory) ? selectedCategory : selectedCategory ? [selectedCategory] : [];

    if (!categoriesArray.length) return;

    // Merge steps from all selected categories
    const stepsForCategory: number[] = categoriesArray.map((cat) => categoryStepsMap[cat] || []).flat();

    // Remove duplicates and sort
    const uniqueSteps = Array.from(new Set(stepsForCategory)).sort((a, b) => a - b);

    setVisibleSteps(uniqueSteps);
    setTotalStep(uniqueSteps.length);

    if (!uniqueSteps.includes(activeStep)) {
      setActiveStep(uniqueSteps[0]);
    }
  }, [selectedCategory]);

  const progress = (visibleSteps.indexOf(activeStep) / (visibleSteps.length - 1)) * 100;

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
    const measurement = tempData.measurement;

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
        setActiveStep(5); // Thanks step
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

  return (
    <>
      {activeStep !== visibleSteps[0] && activeStep !== 5 ? (
        <div className="max-w-[520px] mx-auto mb-6">
          <h2 className="heading-text text-foreground uppercase text-center pb-12">Intake Form</h2>
          <Progress value={progress} />
          <div className="text-center text-base text-foreground font-bold mt-3">
            {visibleSteps.indexOf(activeStep)} / {visibleSteps.length - 1}
          </div>
        </div>
      ) : activeStep === visibleSteps[0] ? (
        <h2 className="heading-text text-foreground uppercase text-center">help us better understand</h2>
      ) : null}

      {activeStep === 1 && visibleSteps.includes(1) && (
        <FullBodyPhoto
          onNext={handleNext}
          defaultValues={formData}
        />
      )}
      {activeStep === 2 && visibleSteps.includes(2) && (
        <StepOne
          onNext={handleNext}
          onBack={handleBack}
          defaultValues={formData}
        />
      )}
      {activeStep === 3 && visibleSteps.includes(3) && (
        <StepTwo
          onNext={handleNext}
          onBack={handleBack}
          defaultValues={formData}
        />
      )}
      {activeStep === 4 && visibleSteps.includes(4) && (
        <StepThree
          onNext={handleFinalSubmit}
          onBack={handleBack}
          defaultValues={formData}
          isLoading={intakeFormMutation.isPending}
        />
      )}
      {activeStep === 5 && <ThanksStep />}
    </>
  );
};

export default PatientIntake;
