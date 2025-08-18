import { selectedCategoryAtom } from "@/common/states/category.atom";
import { useWindowScroll } from "@mantine/hooks";
import { useAtomValue } from "jotai";
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

import BodyMetrics from "./quizes/common/BodyMetrics";
import GenderSelection from "./quizes/common/GenderSelection";
import PregnancyStatus from "./quizes/common/PregnancyStatus";
import GenderHairGrowth from "./quizes/hair-growth/Gender";
import ScalpInfectionsTwo from "./quizes/hair-growth/ScalpInfectionsTwo";
import ThyroidDisease from "./quizes/hair-growth/ThyroidDisease";
import AlcoholConsumption from "./quizes/peptides-blends/AlcoholConsumption";
import Cholesterol from "./quizes/peptides-blends/Cholesterol";
import EndocrineAutoimmuneDisorders from "./quizes/peptides-blends/EndocrineAutoimmuneDisorders";
import ExerciseFrequency from "./quizes/peptides-blends/ExerciseFrequency";
import GallbladderHistory from "./quizes/peptides-blends/GallbladderHistory";
import HealthHistory from "./quizes/peptides-blends/HealthHistory";
import HormoneSensitiveCancer from "./quizes/peptides-blends/HormoneSensitiveCancer";
import HormoneTherapy from "./quizes/peptides-blends/HormoneTherapy";
import HypertensionMedication from "./quizes/peptides-blends/HypertensionMedication";
import LastDosage from "./quizes/peptides-blends/LastDosage";
import LifestyleCommitment from "./quizes/peptides-blends/LifestyleCommitment";
import MedicalConditions from "./quizes/peptides-blends/MedicalConditions";
import MedicationAllergies from "./quizes/peptides-blends/MedicationAllergies";
import PeptidesTakenBefore from "./quizes/peptides-blends/PeptidesTakenBefore";
import PeptideTherapyDuration from "./quizes/peptides-blends/PeptideTherapyDuration";
import PeptideTherapyEffectiveness from "./quizes/peptides-blends/PeptideTherapyEffectiveness";
import PhysicalActivityLevel from "./quizes/peptides-blends/PhysicalActivityLevel";
import PrescriptionMedications from "./quizes/peptides-blends/PrescriptionMedications";
import PrimaryGoalForPeptidesTherapy from "./quizes/peptides-blends/PrimaryGoalForPeptidesTherapy";
import RecreationalDrugs from "./quizes/peptides-blends/RecreationalDrugs";
import SideEffects from "./quizes/peptides-blends/SideEffects";
import SleepApnea from "./quizes/peptides-blends/SleepApnea";
import ThyroidCancerHistory from "./quizes/peptides-blends/ThyroidCancerHistory";
import UsedPeptidesBefore from "./quizes/peptides-blends/UsedPeptidesBefore";
import CardiovascularDisease from "./quizes/testosterone/CardiovascularDisease";
import GenderTestosterone from "./quizes/testosterone/Gender";
import Impairment from "./quizes/testosterone/Impairment";
import Nitroglycerin from "./quizes/testosterone/Nitroglycerin";
import Priapism from "./quizes/testosterone/Priapism";
import WeightLossBreastFeeding from "./quizes/weight-loss/BreastFeeding";
import CustomerStatus from "./quizes/weight-loss/CustomerStatus";
import DiseaseList from "./quizes/weight-loss/DiseaseList";
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
  const [totalStep, setTotalStep] = useState(20);
  const [, scrollTo] = useWindowScroll();
  const selectedCategory = useAtomValue(selectedCategoryAtom);
  const [eligibleComponent, setEligibleComponent] = useState<React.ReactNode | null>(null);
  const [isHairGrowthMale, setHairGrowthMale] = useState(false);
  const [isHairGrowthFemale, setHairGrowthFemale] = useState(false);

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

  const [genderOffset, setGenderOffset] = useState(0);

  useEffect(() => {
    if (formData.genderWeightLoss === "Female") {
      setGenderOffset(2);
    } else {
      setGenderOffset(0);
    }
  }, [formData.genderWeightLoss]);

  useEffect(() => {
    if (selectedCategory && (selectedCategory?.includes("Peptides Blends") || selectedCategory?.includes("Single Blends"))) {
      setTotalStep(30);
    }
    if (selectedCategory && selectedCategory.includes("Hair Growth (Male)")) {
      setHairGrowthMale(true);
      setHairGrowthFemale(false);
    }
    if (selectedCategory && selectedCategory.includes("Hair Growth (Female)")) {
      setHairGrowthFemale(true);
      setHairGrowthMale(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (eligibleComponent) {
      navigate("/ineligible-user");
    }
  }, [eligibleComponent, navigate]);

  return (
    <>
      {activeStep === 1 && (
        <DateOfBirth
          onNext={handleNext}
          onBack={handleBack}
          defaultValues={formData}
        />
      )}
      {(selectedCategory?.includes("Hair Growth") || selectedCategory?.includes("Hair Growth (Male)") || selectedCategory?.includes("Hair Growth (Female)")) && (
        <>
          {activeStep === 2 && (
            <GenderHairGrowth
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
        </>
      )}

      {selectedCategory?.includes("Weight Loss") && (
        <>
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
            <WeightLossBreastFeeding
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
                console.log(eligible);
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
          {activeStep === 2 && (
            <GenderTestosterone
              onNext={(data) => {
                const { eligible, ...rest } = data;
                setFormData((prev) => ({ ...prev, ...rest }));

                if (eligible) {
                  setEligibleComponent(<InEligibleUser />);
                } else {
                  handleNext(rest);
                }
              }}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 3 && (
            <CardiovascularDisease
              onNext={(data) => {
                const { eligible, ...rest } = data;
                setFormData((prev) => ({ ...prev, ...rest }));

                if (eligible) {
                  setEligibleComponent(<InEligibleUser />);
                } else {
                  handleNext(rest);
                }
              }}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 4 && (
            <Priapism
              onBack={handleBack}
              onNext={(data) => {
                const { eligible, ...rest } = data;
                setFormData((prev) => ({ ...prev, ...rest }));

                if (eligible) {
                  handleNext(rest);
                } else {
                  setEligibleComponent(<InEligibleUser />);
                }
              }}
              defaultValues={formData}
            />
          )}
          {activeStep === 5 && (
            <Nitroglycerin
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
          {activeStep === 6 && (
            <Impairment
              onNext={(data) => {
                const { eligible, ...rest } = data;
                setFormData((prev) => ({ ...prev, ...rest }));

                if (eligible) {
                  handleFinalSubmit;
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
      {isHairGrowthMale && (
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
      {isHairGrowthFemale && (
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

      {(selectedCategory?.includes("Peptides Blends") || selectedCategory?.includes("Single Blends")) && (
        <>
          {activeStep === 2 && (
            <GenderSelection
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 3 && (
            <CustomerStatus
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 4 && (
            <PrimaryGoalForPeptidesTherapy
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 5 && (
            <ExerciseFrequency
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 6 && (
            <LifestyleCommitment
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 7 && (
            <PhysicalActivityLevel
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 8 && (
            <UsedPeptidesBefore
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 9 && (
            <RecreationalDrugs
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 10 && (
            <AlcoholConsumption
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 11 && (
            <HormoneSensitiveCancer
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 12 && (
            <EndocrineAutoimmuneDisorders
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 13 && (
            <HealthHistory
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 14 && (
            <MedicalConditions
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 15 && (
            <Cholesterol
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 16 && (
            <HypertensionMedication
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 17 && (
            <ThyroidDisease
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 18 && (
            <ThyroidCancerHistory
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 19 && (
            <GallbladderHistory
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 20 && (
            <>
              {formData?.gender === "Male" && (
                <PregnancyStatus
                  onNext={handleNext}
                  onBack={handleBack}
                  defaultValues={formData}
                />
                // <MultipleEndocrineNeoplasia
                //   onNext={handleNext}
                //   onBack={handleBack}
                //   defaultValues={formData}
                // />
              )}
              {formData?.gender === "Female" && (
                <PlanningPregnancy
                  onNext={handleNext}
                  onBack={handleBack}
                  defaultValues={formData}
                />
              )}
            </>
          )}

          {activeStep === 21 && (
            <SleepApnea
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 22 && (
            <HormoneTherapy
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 23 && (
            <PrescriptionMedications
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 24 && (
            <MedicationAllergies
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 25 && (
            <PeptidesTakenBefore
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 26 && (
            <LastDosage
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 27 && (
            <PeptideTherapyDuration
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 28 && (
            <SideEffects
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 29 && (
            <PeptideTherapyEffectiveness
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 30 && (
            <BodyMetrics
              onNext={handleFinalSubmit}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {/* {activeStep === 3 && (
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
          )} */}
        </>
      )}
    </>
  );
};

export default QuizPage;
