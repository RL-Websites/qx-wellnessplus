import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IPatientIntakeFormDTO } from "@/common/api/models/interfaces/PartnerPatient.model";
import orderApiRepository from "@/common/api/repositories/orderRepository";
import dmlToast from "@/common/configs/toaster.config";
import { selectedCategoryAtom } from "@/common/states/category.atom";
import { basicInfoAtom } from "@/common/states/customerBasic.atom";
import StepFifteen from "@/pages/step-filteen";
import { Progress } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FullBodyPhoto from "./intake-steps/FullbodyPhoto";

import AnimatedStep from "@/common/components/AnimatedSteps";
import { AnimatePresence } from "framer-motion";
import MedicalHistory from "./intake-steps/hair-growth/medicalHistory";
import SymptomHistory from "./intake-steps/hair-growth/symptomHistory";
import WhenNotice from "./intake-steps/hair-growth/whenNotice";
import MedsAllergy from "./intake-steps/prevMedsAllergy";
import { questions } from "./intake-steps/questions";
import SexualHealthConcerns from "./intake-steps/sexual-health/sexualHealthConcerns";
import SexualHealthFinal from "./intake-steps/sexual-health/sexualHealthFinal";
import SexualHealthRisks from "./intake-steps/sexual-health/sexualHealthRisks";
import StepEight from "./intake-steps/step-eight";
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
import BodyMeasure from "./intake-steps/testosterone/bodyMeasure";
import HormonalHealth from "./intake-steps/testosterone/hormonalHealth";
import LifestyleAndFertility from "./intake-steps/testosterone/lifeStyleAndFertility";
import TestosteroneHistory from "./intake-steps/testosterone/testosteroneHistory";
import ThanksStep from "./intake-steps/thanks-step";

interface CategoryConfig {
  steps: number[];
  finalStep: number;
}

interface StepConfig {
  component: React.FC<any>;
  categories: string[]; // active categories for which this step should appear
}

const PatientIntake = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [prevStep, setPrevStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [finalStep, setFinalStep] = useState<number>(18);
  const [, scrollTo] = useWindowScroll();
  const [params] = useSearchParams();
  const prescriptionUId = params.get("prescription_u_id");
  const selectedCategory = useAtomValue(selectedCategoryAtom);
  const [basicInfo] = useAtom(basicInfoAtom);
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [filteredSteps, setFilteredSteps] = useState<StepConfig[]>([]);
  const [totalDynamicSteps, setTotalDynamicSteps] = useState(0);

  const stepConfig: StepConfig[] = [
    // Shared / Weight Loss steps
    { component: FullBodyPhoto, categories: ["weightLoss"] },
    { component: StepOne, categories: ["weightLoss"] },
    { component: MedsAllergy, categories: ["weightLoss"] },
    { component: StepTwo, categories: ["weightLoss"] },
    { component: StepThree, categories: ["weightLoss"] },
    { component: StepFour, categories: ["weightLoss"] },
    { component: StepFive, categories: ["weightLoss"] },
    { component: StepSix, categories: ["weightLoss"] },
    { component: StepSeven, categories: ["weightLoss"] },
    { component: StepEight, categories: ["weightLoss"] },
    { component: StepNine, categories: ["weightLoss"] },
    { component: StepTen, categories: ["weightLoss"] },
    { component: StepEleven, categories: ["weightLoss"] },
    { component: StepTwelve, categories: ["weightLoss"] },
    { component: StepThirteen, categories: ["weightLoss"] },
    { component: StepFourteen, categories: ["weightLoss"] },
    { component: StepFifteen, categories: ["weightLoss"] },
    { component: StepSixteen, categories: ["weightLoss"] },
    { component: FullBodyPhoto, categories: ["peptides"] },
    { component: StepSeventeen, categories: ["peptides"] },
    { component: BodyMeasure, categories: ["testosterone"] },
    { component: HormonalHealth, categories: ["testosterone"] },
    { component: TestosteroneHistory, categories: ["testosterone"] },
    { component: LifestyleAndFertility, categories: ["testosterone"] },
    { component: SexualHealthConcerns, categories: ["sexualHealth"] },
    { component: SexualHealthRisks, categories: ["sexualHealth"] },
    { component: SexualHealthFinal, categories: ["sexualHealth"] },
    { component: WhenNotice, categories: ["hairGrowth"] },
    { component: MedicalHistory, categories: ["hairGrowth"] },
    { component: SymptomHistory, categories: ["hairGrowth"] },

    // TODO: add Testosterone-specific steps
    // { component: StepX, categories: ["Testosterone"] },
    // { component: StepY, categories: ["Testosterone"] },

    // TODO: add Hair Growth-specific steps
    // { component: StepZ, categories: ["Hair Growth"] },
  ];

  useEffect(() => {
    const medicationCats: string[] = Array.isArray(selectedCategory) ? selectedCategory : selectedCategory ? [selectedCategory] : [];

    const categories: string[] = [];
    if (medicationCats.some((cat) => ["Single Peptides", "Peptides Blends"].includes(cat))) categories.push("peptides");
    if (medicationCats.some((cat) => ["Testosterone"].includes(cat))) categories.push("testosterone");
    if (medicationCats.some((cat) => ["Hair Growth (Male)", "Hair Growth (Female)"].includes(cat))) categories.push("hairGrowth");
    if (medicationCats.some((cat) => ["Sexual Health (Male)", "Sexual Health (Female)"].includes(cat))) categories.push("sexualHealth");
    if (medicationCats.some((cat) => ["Weight Loss"].includes(cat))) categories.push("weightLoss");

    setActiveCategories(categories);

    let stepsFiltered = stepConfig.filter((step) => step.categories.some((cat) => categories.includes(cat)));

    // Condition: Male + Others → remove StepFive
    if (basicInfo?.patient?.gender === "male" || basicInfo?.patient?.gender === "Male") {
      stepsFiltered = stepsFiltered.filter((step) => step.component !== StepFive);
    }

    setFilteredSteps(stepsFiltered);
    setTotalDynamicSteps(stepsFiltered.length);
  }, [selectedCategory, basicInfo?.patient?.gender]);

  const progress = (activeStep / totalDynamicSteps) * 100;

  const handleNext = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    // const currentIndex = visibleSteps.indexOf(activeStep);
    setPrevStep(activeStep);
    if (activeStep < totalDynamicSteps + 1) {
      setActiveStep((prev) => prev + 1);
    }
    scrollTo({ y: 0 });
  };

  const handleBack = () => {
    setPrevStep(activeStep);
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
    }
    scrollTo({ y: 0 });
  };

  const intakeFormMutation = useMutation({
    mutationFn: (payload: IPatientIntakeFormDTO) => orderApiRepository.patientIntakeFormSubmit(payload),
  });

  const handleFinalSubmit = (data: any) => {
    const tempData = { ...formData, ...data };
    const measurement = {
      ...tempData.measurement,
      height: tempData?.measurement?.height_feet ? `${tempData?.measurement?.height_feet}'${tempData?.measurement?.height_inch}''` : undefined,
    };

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
        setActiveStep(totalDynamicSteps + 1); // Thanks step
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

  // Checks if current step is the final dynamic step
  const shouldSubmit = (step: number) => {
    return step === totalDynamicSteps;
  };

  const CurrentStepComponent = filteredSteps[activeStep - 1]?.component;

  return (
    <>
      {/* Dynamic Header + Progress */}
      {activeStep <= totalDynamicSteps &&
        (() => {
          // Determine header type
          const isWeightLossFirstStep = activeStep === 1 && activeCategories.length === 1 && activeCategories[0] === "weightLoss";
          const headerType = isWeightLossFirstStep ? "weightLoss" : "generic";
          const headerKey = `${headerType}-${activeStep}`;

          return (
            <div className="mb-6">
              <AnimatePresence mode="wait">
                <AnimatedStep
                  key={headerKey}
                  direction={activeStep > prevStep ? "right" : "left"} // ✅ handles back/next animations
                >
                  {isWeightLossFirstStep ? (
                    <div className="text-center pb-12">
                      <h2 className="heading-text text-foreground uppercase">Let's Get to Know You Better</h2>
                      <p className="text-foreground text-xl font-medium font-poppins pt-2.5">Tell us a little about your current stats so we can tailor your plan.</p>
                      <div className="max-w-[520px] mx-auto mt-6">
                        <Progress value={progress} />
                        <div className="text-center text-base text-foreground font-bold mt-3">
                          {activeStep <= totalDynamicSteps ? `${activeStep} / ${totalDynamicSteps}` : `${totalDynamicSteps + 1} / ${totalDynamicSteps + 1}`}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-[800px] mx-auto pb-12">
                      <h2 className="heading-text text-center">Intake Form</h2>
                      <p className="text-foreground text-center text-lg font-medium font-poppins pt-5">
                        An intake form is a short questionnaire that collects your health details for review by our licensed providers. Please answer all questions as clearly and
                        accurately as possible. This helps our licensed providers review your information faster and ensures safe, personalized treatment.
                      </p>
                      <div className="max-w-[520px] mx-auto mt-6">
                        <Progress value={progress} />
                        <div className="text-center text-base text-foreground font-bold mt-3">
                          {activeStep <= totalDynamicSteps ? `${activeStep} / ${totalDynamicSteps}` : `${totalDynamicSteps + 1} / ${totalDynamicSteps + 1}`}
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatedStep>
              </AnimatePresence>
            </div>
          );
        })()}

      {/* {activeStep <= totalDynamicSteps && (
        <>
          {activeStep === 1 ? (
            activeCategories.length === 1 && activeCategories[0] === "weightLoss" ? (
              // Only Weight Loss → special first step header
              <AnimatePresence mode="wait">
                  <AnimatedStep
                    key={activeStep}
                    direction={"right"}
                  >
                <div className="mb-6">
                  <div className="text-center pb-12">
                    <h2 className="heading-text text-foreground uppercase">Let's Get to Know You Better</h2>
                    <p className="text-foreground text-xl font-medium font-poppins pt-2.5">Tell us a little about your current stats so we can tailor your plan.</p>
                  </div>
                  <div className="max-w-[520px] mx-auto">
                    <Progress value={progress} />
                    <div className="text-center text-base text-foreground font-bold mt-3">
                      {activeStep <= totalDynamicSteps ? `${activeStep} / ${totalDynamicSteps}` : `${totalDynamicSteps + 1} / ${totalDynamicSteps + 1}`}
                    </div>
                  </div>
                </div>
              </AnimatedStep>
              </AnimatePresence>
            ) : (
              // Any other category or multiple categories → generic intake header
              <div className="mb-6">
                <AnimatePresence mode="wait">
                  <AnimatedStep
                    key={activeStep}
                    direction={"right"}
                  >
                    <div className="max-w-[800px] mx-auto pb-12">
                      <h2 className="heading-text text-center">Intake Form</h2>
                      <p className="text-foreground text-center text-lg font-medium font-poppins pt-5">
                        An intake form is a short questionnaire that collects your health details for review by our licensed providers. Please answer all questions as clearly and
                        accurately as possible. This helps our licensed providers review your information faster and ensures safe, personalized treatment.
                      </p>
                    </div>
                  </AnimatedStep>
                </AnimatePresence>
                <div className="max-w-[520px] mx-auto">
                  <Progress value={progress} />
                  <div className="text-center text-base text-foreground font-bold mt-3">
                    {activeStep <= totalDynamicSteps ? `${activeStep} / ${totalDynamicSteps}` : `${totalDynamicSteps + 1} / ${totalDynamicSteps + 1}`}
                  </div>
                </div>
              </div>
            )
          ) : (
            // All other steps → generic intake header
            <div className="mb-6">
              <AnimatePresence mode="wait">
                <AnimatedStep
                  key={activeStep}
                  direction={"right"}
                >
                  <div className="max-w-[800px] mx-auto pb-12">
                    <h2 className="heading-text text-center">Intake Form</h2>
                    <p className="text-foreground text-center text-lg font-medium font-poppins pt-5">
                      An intake form is a short questionnaire that collects your health details for review by our licensed providers. Please answer all questions as clearly and
                      accurately as possible. This helps our licensed providers review your information faster and ensures safe, personalized treatment.
                    </p>
                  </div>
                </AnimatedStep>
              </AnimatePresence>

              <div className="max-w-[520px] mx-auto">
                <Progress value={progress} />
                <div className="text-center text-base text-foreground font-bold mt-3">
                  {activeStep} / {totalDynamicSteps}
                </div>
              </div>
            </div>
          )}
        </>
      )} */}

      {/* Render all steps */}
      <AnimatePresence mode="wait">
        {activeStep <= totalDynamicSteps && CurrentStepComponent && (
          <AnimatedStep
            key={activeStep}
            direction={activeStep > prevStep ? "right" : "left"}
          >
            <CurrentStepComponent
              onNext={shouldSubmit(activeStep) ? handleFinalSubmit : handleNext}
              onBack={handleBack}
              defaultValues={formData}
              isLoading={shouldSubmit(activeStep) && intakeFormMutation.isPending}
              isFinalStep={shouldSubmit(activeStep)}
            />
          </AnimatedStep>
        )}
      </AnimatePresence>
      {/* {activeStep <= totalDynamicSteps && CurrentStepComponent && (
        <CurrentStepComponent
          onNext={shouldSubmit(activeStep) ? handleFinalSubmit : handleNext}
          onBack={handleBack}
          defaultValues={formData}
          isLoading={shouldSubmit(activeStep) && intakeFormMutation.isPending}
          isFinalStep={shouldSubmit(activeStep)}
        />
      )} */}

      {/* Thanks Step */}
      {activeStep === totalDynamicSteps + 1 && <ThanksStep isActive={totalDynamicSteps && activeStep == totalDynamicSteps + 1 && totalDynamicSteps > 0 ? true : false} />}
    </>
  );
};

export default PatientIntake;
