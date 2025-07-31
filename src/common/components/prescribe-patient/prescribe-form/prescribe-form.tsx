import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IPaymentCollect } from "@/common/api/models/interfaces/PrescribeNow.model";
import { IUserData } from "@/common/api/models/interfaces/User.model";
import prescribeNowRepository from "@/common/api/repositories/prescribeNowRepository";
import dmlToast from "@/common/configs/toaster.config";
import { userAtom } from "@/common/states/user.atom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stepper } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtom } from "jotai/react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { patientValidationSchema } from "./schema/schemaValidation";
import StepFour from "./step-four/step-four";
import StepOne from "./step-one/step-one";
import StepThree from "./step-three/step-three";
import StepTwo from "./step-two/step-two";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const appearance = {
  // Other options: 'night', 'flat', 'none'
  variables: {
    colorPrimary: "#0570de",
    colorBackground: "#ffffff",
    colorText: "#32325d",
    colorDanger: "#df1b41",
    fontFamily: "Arial, sans-serif",
    borderRadius: "4px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      borderColor: "#cccccc",
      padding: "10px",
    },
    ".Input:focus": {
      borderColor: "#0570de",
    },
  },
};
const PrescribeForm = () => {
  const [userData] = useAtom<IUserData | null>(userAtom);
  const [formData, setFormData] = useState<any>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [allowStepSwitching, setAllowStepSwitching] = useState<boolean>(false);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const navigate = useNavigate();
  const [, scrollTo] = useWindowScroll();
  const patientFormMethods = useForm({
    resolver: yupResolver(patientValidationSchema),
  });
  const options = {
    appearance,
  };

  const nextStep = () => {
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    setMaxStepReached((prevMax) => Math.max(prevMax, nextStep));
    scrollTo({ y: 0 });
    if (nextStep == 5) {
      setAllowStepSwitching(true);
    }
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
    scrollTo({ y: 0 });
  };

  const handleStepSubmit = (data) => {
    if (currentStep == 1) {
      if (formData.soap_note == undefined) {
        setFormData((prevData) => ({ ...prevData, soap_note: data }));
      } else {
        setFormData((prevData) => ({ ...prevData, soap_note: { ...prevData.soap_note, ...data } }));
      }
    } else if (currentStep == 2) {
      if (formData.medicine_selected == undefined) {
        setFormData((prevData) => ({ ...prevData, medicine_selected: data }));
      } else {
        setFormData((prevData) => ({ ...prevData, medicine_selected: data }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        ...data,
      }));
    }
    nextStep();
  };

  const handleBack = () => {
    prevStep();
    scrollTo({ y: 0 });
  };

  const saveAndBack = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }));

    prevStep();
    scrollTo({ y: 0 });
  };

  const prescribeNowMutation = useMutation({ mutationFn: (payload: IPaymentCollect) => prescribeNowRepository.paymentCollect(payload) });
  const handleFinalSubmit = (data: IPaymentCollect) => {
    prescribeNowMutation.mutate(data, {
      onSuccess: (res) => {
        dmlToast.success({ title: "Prescribed successfully." });
        userData?.userable_type == "clinic" ? navigate("/clinic/prescriptions") : navigate("/prescriber/prescriptions");
      },
      onError: (error) => {
        const err = error as AxiosError<IServerErrorResponse>;
        dmlToast.error({
          title: err?.response?.data?.message,
        });
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
                formData={formData}
                handleBack={handleBack}
                onSubmit={(data) => handleStepSubmit(data)}
              />
            </form>
          </FormProvider>
        </Stepper.Step>
        <Stepper.Step
          label="Step 2"
          description="Soap Note"
        >
          <StepTwo
            handleBack={handleBack}
            formData={formData}
            handleNext={(data) => handleStepSubmit(data)}
          />
        </Stepper.Step>
        <Stepper.Step
          label="Step 3"
          description="Medication"
        >
          <StepThree
            handleBack={handleBack}
            formData={formData}
            handleSubmit={(data) => handleStepSubmit(data)}
          />
        </Stepper.Step>
        <Stepper.Step
          label="Step 4"
          description="Payment"
        >
          <Elements
            stripe={stripePromise}
            options={options}
          >
            <StepFour
              handleBack={handleBack}
              formData={formData}
              handleSubmit={handleFinalSubmit}
              isSubmitting={prescribeNowMutation.isPending}
            />
          </Elements>
        </Stepper.Step>
      </Stepper>
    </div>
  );
};

export default PrescribeForm;
