import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IPatientIntakeFormDTO } from "@/common/api/models/interfaces/PartnerPatient.model";
import orderApiRepository from "@/common/api/repositories/orderRepository";
import dmlToast from "@/common/configs/toaster.config";
import { Progress } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FullBodyPhoto from "./intake-steps/FullbodyPhoto";
import { questions } from "./intake-steps/questions";
import StepOne from "./intake-steps/step-one";
import StepThree from "./intake-steps/step-three";
import StepTwo from "./intake-steps/step-two";
import ThanksStep from "./intake-steps/thanks-step";

const PatientIntake = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [totalStep, setTotalStep] = useState(4);
  const [, scrollTo] = useWindowScroll();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const prescriptionUId = params.get("prescription_u_id");

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

  const intakeFormMutation = useMutation({ mutationFn: (payload: IPatientIntakeFormDTO) => orderApiRepository.patientIntakeFormSubmit(payload) });

  const handleFinalSubmit = (data: any) => {
    const tempData = { ...formData, ...data };
    const signature = tempData.signature;
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
      onSuccess: (res) => {
        // const prescription_uId = res?.data?.data?.u_id;
        dmlToast.success({ title: "Intake form submitted successfully" });
        // navigate(`../partner-patient-password-setup?prescription_u_id=${prescription_uId}`);
        setActiveStep(5);
      },
      onError: (err) => {
        const error = err as AxiosError<IServerErrorResponse>;
        console.log(error);
        dmlToast.error({ title: "Oops! Something went wrong. Please try again later." });
      },
    });

    // console.log(payload);
  };

  return (
    <>
      {activeStep !== 1 && activeStep !== 5 ? (
        <div className="max-w-[520px] mx-auto mb-6">
          <h2 className="heading-text text-foreground uppercase text-center pb-12">Intake Form</h2>
          <Progress value={progress} />
          <div className="text-center text-base text-foreground font-bold mt-3">
            {activeStep - 1} / {totalStep - 1}
          </div>
        </div>
      ) : activeStep === 1 ? (
        <h2 className="heading-text text-foreground uppercase text-center">help us better understand</h2>
      ) : (
        ""
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
      {activeStep === 3 && (
        <StepTwo
          onNext={handleNext}
          onBack={handleBack}
          defaultValues={formData}
        />
      )}
      {activeStep === 4 && (
        <StepThree
          onNext={handleFinalSubmit}
          onBack={handleBack}
          defaultValues={formData}
          isLoading={intakeFormMutation.isPending}
        />
      )}
      {activeStep === 5 && <ThanksStep />}

      {/* Continue other steps like this */}
      {/* {activeStep === 2 && <StepOne ... />} */}
    </>
  );
};

export default PatientIntake;
