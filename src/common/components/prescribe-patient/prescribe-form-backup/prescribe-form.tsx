import { IPrescribeNowDTO } from "@/common/api/models/interfaces/PrescribeNow.model";
import prescribeNowRepository from "@/common/api/repositories/prescribeNowRepository";
import dmlToast from "@/common/configs/toaster.config";
import { Locations } from "@/common/constants/locations";
import { formatDate } from "@/utils/date.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stepper } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { patientValidationSchema } from "./schema/schemaValidation";
import StepFive from "./step-five/step-five";
import StepFour from "./step-four/step-four";
import StepOne from "./step-one/step-one";
import StepSix from "./step-six/step-six";
import StepThree from "./step-three/step-three";
import StepTwo from "./step-two/step-two";

const PrescribeForm = () => {
  const [formData, setFormData] = useState<any>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [allowStepSwitching, setAllowStepSwitching] = useState<boolean>(false);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const navigate = useNavigate();

  const patientFormMethods = useForm({
    resolver: yupResolver(patientValidationSchema),
  });

  const nextStep = () => {
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    setMaxStepReached((prevMax) => Math.max(prevMax, nextStep));
    if (nextStep == 5) {
      setAllowStepSwitching(true);
    }
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleStepSubmit = (data) => {
    if (currentStep == 0) {
      setFormData((prevData) => ({ ...prevData, patient: data }));
    }
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }));
    console.log({ ...formData, ...data });
    nextStep();
  };

  const handleBack = () => {
    prevStep();
  };

  const saveAndBack = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }));

    prevStep();
  };

  const prescribeNowMutation = useMutation({ mutationFn: (payload: IPrescribeNowDTO) => prescribeNowRepository.prescribeNow(payload) });
  const handleFinalSubmit = (data) => {
    const finalData = {
      ...formData,
      ...data,
      patient: { ...formData.patient, dob: formatDate(formData.patient.dob, "YYYY-MM-DD") },
      refill_date: "2024-12-12",
    };
    console.log(finalData);
    prescribeNowMutation.mutate(finalData, {
      onSuccess: (data) => {
        dmlToast.success({ title: "Prescribed successfully." });
        navigate("/prescriber/prescriptions");
      },
      onError: (error) => {
        console.error("Error prescribing", error);
      },
    });
  };

  return (
    <div>
      <Stepper
        active={currentStep}
        allowNextStepsSelect={allowStepSwitching}
        completedIcon={<i className="icon-tick text-[24px]"></i>}
        onStepClick={(step) => step <= maxStepReached && setCurrentStep(step)}
        classNames={{
          steps: "!mt-10 max-w-[924px]",
        }}
      >
        <Stepper.Step
          label="Step 1"
          description="Patient"
        >
          <FormProvider {...patientFormMethods}>
            <form>
              <StepOne
                locations={Locations}
                formData={formData}
                handleBack={handleBack}
                onSubmit={(data) => handleStepSubmit(data)}
              />
            </form>
          </FormProvider>
        </Stepper.Step>
        <Stepper.Step
          label="Step 2"
          description="Medication"
        >
          <form>
            <StepTwo
              handleBack={handleBack}
              formData={formData}
              handleSubmit={(data) => handleStepSubmit(data)}
            />
          </form>
        </Stepper.Step>
        <Stepper.Step
          label="Step 3"
          description="Dosage Details"
        >
          <StepThree
            handleBack={handleBack}
            formData={formData}
            handleSubmit={(data) => handleStepSubmit(data)}
          />
        </Stepper.Step>
        <Stepper.Step
          label="Step 4"
          description="Dosage Direction"
        >
          <StepFour
            handleBack={handleBack}
            formData={formData}
            handleSubmit={(data) => handleStepSubmit(data)}
          />
        </Stepper.Step>

        <Stepper.Step
          label="Step 5"
          description="Review"
        >
          <StepSix
            setCurrentStep={setCurrentStep}
            handleBack={handleBack}
            handleSubmit={handleStepSubmit}
            formData={formData}
          />
        </Stepper.Step>
        <Stepper.Step
          label="Step 6"
          description="Payment"
        >
          <StepFive
            handleBack={handleBack}
            formData={formData}
            handleSubmit={handleFinalSubmit}
            isSubmitting={prescribeNowMutation.isPending}
          />
        </Stepper.Step>
      </Stepper>
    </div>
  );
};

export default PrescribeForm;
