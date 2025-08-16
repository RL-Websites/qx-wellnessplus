import { selectedCategoryAtom } from "@/common/states/category.atom";
import { useWindowScroll } from "@mantine/hooks";
import { useAtomValue } from "jotai"; // ✅ useAtomValue for reading
import { useEffect, useState } from "react";
import DateOfBirth from "./quizes/DateOfBirth";

import AlopeciaAreata from "./quizes/hair-growth/AlopeciaAreata";
import BreastFeeding from "./quizes/hair-growth/BreastFeeding";
import Chemotherapy from "./quizes/hair-growth/Chemotherapy";
import HairTreatment from "./quizes/hair-growth/HairTreatment";
import MedicationTaking from "./quizes/hair-growth/MedicationTaking";
import Pcos from "./quizes/hair-growth/Pcos";
import PlanningPregnancy from "./quizes/hair-growth/PlanningPregnancy";
import ScalpInfections from "./quizes/hair-growth/ScalpInfections";

import { useNavigate } from "react-router-dom";
import InEligibleUser from "../ineligible-user/ineligible-user.page";

import ScalpInfectionsTwo from "./quizes/hair-growth/ScalpInfectionsTwo";
import ThyroidDisease from "./quizes/hair-growth/ThyroidDisease";
import ScalpInfectionsTestosterone from "./quizes/testosterone/ScalpInfections";
import CustomerStatus from "./quizes/weight-loss/CustomerStatus";
import DiseaseList from "./quizes/weight-loss/DiseaseList";
import GenderWeightLoss from "./quizes/weight-loss/Gender";
import GlpOneMedication from "./quizes/weight-loss/GlpOneMedication";
import WeightLossHeight from "./quizes/weight-loss/Height";
import InjectionDate from "./quizes/weight-loss/InjectionDate";
import MultipleMedicine from "./quizes/weight-loss/MultipleMedicine";
import WeightLossPregnant from "./quizes/weight-loss/Pregnant";
import WeightLossWeight from "./quizes/weight-loss/Weight";
import WeightLossGoal from "./quizes/weight-loss/WeightLossGoal";

const QuizPage = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [lastStep, setLastStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [totalStep] = useState(20);
  const [, scrollTo] = useWindowScroll();
  const selectedCategory = useAtomValue(selectedCategoryAtom);
  const [eligibleComponent, setEligibleComponent] = useState<React.ReactNode | null>(null);

  const navigate = useNavigate();

  const lastStepByCategory = (category: string[]) => {
    switch (category[0]) {
      case "Hair Growth":
        return 7;
      case "Hair Growth (male)":
        return 7;
      case "Hair Growth (female)":
        return 7;
      case "Testosterone":
        return 4;
      case "Weight Loss":
        return 3;
      case "Peptides Blends":
        return 5;
      case "Single Peptides":
        return 5;
      default:
        return defaultLastStep;
    }
  };

  const defaultLastStep = 2;

  useEffect(() => {
    const step = lastStepByCategory(selectedCategory || []);
    setLastStep(step);
  }, [selectedCategory]);

  const handleFinalSubmit = (data: any) => {
    const tempData = { ...formData, ...data };
    setFormData(tempData);
    navigate("/medications");
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

  if (eligibleComponent) {
    return <>{eligibleComponent}</>;
  }

  const [genderOffset, setGenderOffset] = useState(0);

  useEffect(() => {
    if (formData.genderWeightLoss === "Female") {
      setGenderOffset(2);
    } else {
      setGenderOffset(0);
    }
  }, [formData.genderWeightLoss]);

  return (
    <>
      {activeStep === 1 && (
        <DateOfBirth
          onNext={handleNext}
          onBack={handleBack}
          defaultValues={formData}
        />
      )}

      {selectedCategory?.includes("Weight Loss") && (
        <>
          {activeStep === 2 && (
            <GenderWeightLoss
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 3 && (
            <CustomerStatus
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

          {activeStep === 4 && (
            <WeightLossWeight
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 5 && (
            <WeightLossHeight
              onNext={(data) => {
                const { eligible, ...rest } = data;
                setFormData((prev) => ({ ...prev, ...rest }));
                if (eligible) {
                  handleNext(rest);
                } else {
                  setEligibleComponent(<InEligibleUser />);
                }
              }}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {formData.genderWeightLoss === "Female" && activeStep === 6 && (
            <WeightLossPregnant
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {formData.genderWeightLoss === "Female" && activeStep === 7 && (
            <BreastFeeding
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 6 + genderOffset && (
            <GlpOneMedication
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 7 + genderOffset && (
            <InjectionDate
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 8 + genderOffset && (
            <WeightLossGoal
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 9 + genderOffset && (
            <MultipleMedicine
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 10 + genderOffset && (
            <DiseaseList
              onNext={(data) => {
                const { eligible, ...rest } = data;
                setFormData((prev) => ({ ...prev, ...rest }));
                if (eligible) {
                  handleFinalSubmit(rest);
                } else {
                  setEligibleComponent(<InEligibleUser />);
                }
              }}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
        </>
      )}

      {selectedCategory?.includes("Testosterone") && (
        <>
          {activeStep === 3 && (
            <ScalpInfectionsTestosterone
              onNext={handleFinalSubmit}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
        </>
      )}
      {selectedCategory?.includes("Hair Growth (Male)") && (
        <>
          {activeStep === 3 && (
            <ScalpInfections
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 4 && (
            <AlopeciaAreata
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 5 && (
            <MedicationTaking
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 6 && (
            <ThyroidDisease
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 7 && (
            <Chemotherapy
              onNext={handleFinalSubmit}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
        </>
      )}
      {selectedCategory?.includes("Hair Growth (Female)") && (
        <>
          {activeStep === 3 && (
            <PlanningPregnancy
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 4 && (
            <BreastFeeding
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 5 && (
            <Pcos
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 6 && (
            <ScalpInfectionsTwo
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 7 && (
            <HairTreatment
              onNext={handleFinalSubmit}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
        </>
      )}

      {selectedCategory?.includes("Peptides Blends") && (
        <>
          {activeStep === 3 && (
            <CustomerStatus
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 4 && (
            <Pcos
              onNext={handleFinalSubmit}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
        </>
      )}
    </>
  );
};

export default QuizPage;
