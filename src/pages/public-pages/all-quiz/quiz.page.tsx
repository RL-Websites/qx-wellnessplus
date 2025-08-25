import { selectedCategoryAtom } from "@/common/states/category.atom";
import { useWindowScroll } from "@mantine/hooks";
import { useAtom, useAtomValue } from "jotai";
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

import { selectedGenderAtom } from "@/common/states/gender.atom";
import { weightAtom } from "@/common/states/height.atom";
import { dobAtom } from "@/common/states/user.atom";
import { formatDate } from "@/utils/date.utils";
import GenderHairGrowth from "./quizes/hair-growth/Gender";
import ScalpInfectionsTwo from "./quizes/hair-growth/ScalpInfectionsTwo";
import ThyroidDisease from "./quizes/hair-growth/ThyroidDisease";
import Cancers from "./quizes/peptides-blends/new/Cancers";
import CardiovascularDiseasePeptides from "./quizes/peptides-blends/new/CardiovascularDisease";
import GenderPeptides from "./quizes/peptides-blends/new/Gender";
import HSCancers from "./quizes/peptides-blends/new/HSCancers";
import KidneyDisease from "./quizes/peptides-blends/new/KidneyDisease";
import PregnancyBreastfeeding from "./quizes/peptides-blends/new/PregnancyBreastfeeding";
import ThyroidLiverKidneyDisease from "./quizes/peptides-blends/new/ThyroidLiverKidneyDisease";
import CardiovascularDisease from "./quizes/sexual-health/CardiovascularDisease";
import GenderSexualHealth from "./quizes/sexual-health/Gender";
import Impairment from "./quizes/sexual-health/Impairment";
import Nitroglycerin from "./quizes/sexual-health/Nitroglycerin";
import WeightLossBreastFeeding from "./quizes/weight-loss/BreastFeeding";
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
  const [totalStep, setTotalStep] = useState(20);
  const [, scrollTo] = useWindowScroll();
  const selectedCategory = useAtomValue(selectedCategoryAtom);
  const [selectedGender, setSelectedGender] = useAtom(selectedGenderAtom);
  const [eligibleComponent, setEligibleComponent] = useState<React.ReactNode | null>(null);
  const [isHairGrowthMale, setHairGrowthMale] = useState(false);
  const [isHairGrowthFemale, setHairGrowthFemale] = useState(false);
  const [skipInjectionDate, setSkipInjectionDate] = useState(false);
  const [globalWeight, setGlobalWeight] = useAtom(weightAtom);
  const [globalDob, setGlobalDob] = useAtom(dobAtom);

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

  // const handleBack = () => {
  //   if (activeStep > 1) {
  //     setActiveStep((prev) => prev - 1);
  //   }
  //   scrollTo({ y: 0 });
  // };

  const handleBack = () => {
    if (activeStep > 1) {
      if (skipInjectionDate && activeStep === 8 + genderOffset) {
        setActiveStep((prev) => prev - 2);
      } else {
        setActiveStep((prev) => prev - 1);
      }
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
          onNext={(data) => {
            setGlobalDob(formatDate(data?.date_of_birth, "MM-DD-YYYY"));
            handleNext(data);
          }}
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
              onNext={(data) => {
                setGlobalWeight(data?.weightlossweight);
                handleNext(data);
              }}
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

          {selectedGender === "Female" && activeStep === 6 && (
            <WeightLossPregnant
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {selectedGender === "Female" && activeStep === 7 && (
            <WeightLossBreastFeeding
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {activeStep === 6 + genderOffset && (
            <GlpOneMedication
              onNext={(data) => {
                handleNext(data);
                if (data.takesGlpOneMedication === "No") {
                  setSkipInjectionDate(true);
                  setActiveStep((prev) => prev + 1);
                } else {
                  setSkipInjectionDate(false);
                }
              }}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {!skipInjectionDate && activeStep === 7 + genderOffset && (
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

      {(selectedCategory?.includes("Sexual Health") || selectedCategory?.includes("Sexual Health (Male)") || selectedCategory?.includes("Sexual Health (Female)")) && (
        <>
          {activeStep === 2 && (
            <GenderSexualHealth
              onNext={handleNext}
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
          {/* {activeStep === 4 && (
            <Priapism
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
          )} */}
          {activeStep === 4 && (
            <Nitroglycerin
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
          {activeStep === 5 && (
            <Impairment
              onNext={handleFinalSubmit}
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
              onNext={(data) => {
                setFormData((prev) => ({ ...prev, ...data }));
                if (data.scalpInfactions === "Yes") {
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
            <AlopeciaAreata
              onNext={(data) => {
                setFormData((prev) => ({ ...prev, ...data }));
                if (data.alopeciaAreata === "Yes") {
                  setEligibleComponent(<InEligibleUser />);
                } else {
                  handleNext(data);
                }
              }}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 5 && (
            <MedicationTaking
              onNext={(data) => {
                setFormData((prev) => ({ ...prev, ...data }));
                if (data.medicationTaking === "Yes") {
                  setEligibleComponent(<InEligibleUser />);
                } else {
                  handleNext(data);
                }
              }}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 6 && (
            <ThyroidDisease
              onNext={(data) => {
                setFormData((prev) => ({ ...prev, ...data }));
                if (data.thyroidDisease === "Yes") {
                  setEligibleComponent(<InEligibleUser />);
                } else {
                  handleNext(data);
                }
              }}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 7 && (
            <Chemotherapy
              onNext={(data) => {
                const { eligible, ...rest } = data;
                setFormData((prev) => ({ ...prev, ...rest }));
                if (data.chemotherapy === "Yes") {
                  setEligibleComponent(<InEligibleUser />);
                } else {
                  handleFinalSubmit(data);
                }
              }}
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
              onNext={(data) => {
                setFormData((prev) => ({ ...prev, ...data }));
                if (data.planningPregnancy === "Yes") {
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
            <BreastFeeding
              onNext={(data) => {
                setFormData((prev) => ({ ...prev, ...data }));
                if (data.breastFeeding === "Yes") {
                  setEligibleComponent(<InEligibleUser />);
                } else {
                  handleNext(data);
                }
              }}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 5 && (
            <Pcos
              onNext={(data) => {
                setFormData((prev) => ({ ...prev, ...data }));
                if (data.pcos === "Yes") {
                  setEligibleComponent(<InEligibleUser />);
                } else {
                  handleNext(data);
                }
              }}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 6 && (
            <ScalpInfectionsTwo
              onNext={(data) => {
                setFormData((prev) => ({ ...prev, ...data }));
                if (data.scalpInfactions === "Yes") {
                  setEligibleComponent(<InEligibleUser />);
                } else {
                  handleNext(data);
                }
              }}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {activeStep === 7 && (
            <HairTreatment
              onNext={(data) => {
                const { eligible, ...rest } = data;
                setFormData((prev) => ({ ...prev, ...rest }));
                if (data.hairTreatment === "Yes") {
                  setEligibleComponent(<InEligibleUser />);
                } else {
                  handleFinalSubmit(data);
                }
              }}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
        </>
      )}

      {(selectedCategory?.includes("Peptides Blends") || selectedCategory?.includes("Single Blends")) && (
        <>
          {activeStep === 2 && (
            <GenderPeptides
              onNext={handleNext}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}
          {selectedGender === "Male" && activeStep === 3 && (
            <HSCancers
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
          {selectedGender === "Male" && activeStep === 4 && (
            <CardiovascularDiseasePeptides
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

          {selectedGender === "Male" && activeStep === 5 && (
            <KidneyDisease
              onNext={(data) => {
                const { eligible, ...rest } = data;

                setFormData((prev) => ({ ...prev, ...rest }));
                if (eligible) {
                  setEligibleComponent(<InEligibleUser />);
                } else {
                  handleFinalSubmit(rest);
                }
              }}
              onBack={handleBack}
              defaultValues={formData}
            />
          )}

          {/* Female Gender */}
          {selectedGender === "Female" && activeStep === 3 && (
            <PregnancyBreastfeeding
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
          {selectedGender === "Female" && activeStep === 4 && (
            <Cancers
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

          {selectedGender === "Female" && activeStep === 5 && (
            <ThyroidLiverKidneyDisease
              onNext={(data) => {
                const { eligible, ...rest } = data;

                setFormData((prev) => ({ ...prev, ...rest }));
                if (eligible) {
                  setEligibleComponent(<InEligibleUser />);
                } else {
                  handleFinalSubmit(rest);
                }
              }}
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
