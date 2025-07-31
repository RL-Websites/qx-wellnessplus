import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { ICreatePaymentIntentDTO } from "@/common/api/models/interfaces/Partner.model";
import { IPatientBookingPatientInfoDTO, IPublicPartnerPrescriptionDetails } from "@/common/api/models/interfaces/PartnerPatient.model";
import partnerPatientRepository from "@/common/api/repositories/partnerPatientRepository";
import partnerApiRepository from "@/common/api/repositories/partnerRepositoiry";
import RegistrationFooter from "@/common/components/Registration/RegistrationFooter";
import StripeWrapper from "@/common/components/StripeWrapper";
import dmlToast from "@/common/configs/toaster.config";
import { Avatar, Image, Stepper, Tooltip } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Client as Styletron } from "styletron-engine-monolithic";
import RefillStep from "./booking-steps/RefillStep";
import StepOne from "./booking-steps/StepOne";
import StepTwo from "./booking-steps/StepTwo";

const PartnerPatientBooking = () => {
  const engine = new Styletron();
  const [currentStep, setCurrentStep] = useState(0);
  const [allowStepSwitching, setAllowStepSwitching] = useState<boolean>(false);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [, scrollTo] = useWindowScroll();
  const [isRefill, setIsRefill] = useState(0);
  const [refillType, setRefillType] = useState<string>("");

  const [patientDetails, setPatientDetails] = useState<IPublicPartnerPrescriptionDetails>();
  const [params] = useSearchParams();
  const prescriptionUId = params.get("prescription_u_id");
  const is_refill = params.get("is_refill");
  const detail_uid = params.get("detail_uid");
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    setIsRefill((prevRefill) => Number(is_refill));
  }, [is_refill]);

  const patientDetailsQuery = useQuery({
    queryKey: ["partner-patient-booking-query", prescriptionUId],
    queryFn: () => partnerPatientRepository.publicGetPatientDetails({ u_id: prescriptionUId || "", detail_uid: detail_uid || undefined }),
    enabled: !!prescriptionUId,
  });

  const createPaymentIntentMutation = useMutation({ mutationFn: (payload: ICreatePaymentIntentDTO) => partnerApiRepository.createPaymentIntent(payload) });

  useEffect(() => {
    if (patientDetailsQuery?.data?.data?.status_code == 200 && patientDetailsQuery?.data?.data?.data) {
      const tempPatientDetails = patientDetailsQuery?.data?.data?.data;
      // setIsRefill((prevRefill) => (tempPatientDetails?.is_refill ? true : false));
      if (tempPatientDetails?.status && tempPatientDetails?.status == "invited") {
        // do nothing
        if (tempPatientDetails?.customer?.payment_type == "stripe" && tempPatientDetails.total_bill_amount) {
          const payload: ICreatePaymentIntentDTO = {
            amount: tempPatientDetails.total_bill_amount,
            prescription_id: tempPatientDetails?.id,
          };
          createPaymentIntentMutation.mutate(payload, {
            onSuccess: (res) => {
              setClientSecret(res?.data?.data?.client_secret || "");
            },
            onError: (err) => {
              const error = err as AxiosError<IServerErrorResponse>;
              console.log(error?.message);
            },
          });
        }
      } else if (tempPatientDetails?.status && tempPatientDetails?.status == "intake_pending") {
        navigate(`../partner-patient-intake?prescription_u_id=${prescriptionUId}`);
      } else if (tempPatientDetails?.status && tempPatientDetails?.status == "pending") {
        navigate(`../partner-patient-password-setup?prescription_u_id=${prescriptionUId}`);
      } else {
        console.log(tempPatientDetails?.status);
      }
      setPatientDetails(patientDetailsQuery?.data?.data?.data);
    }
  }, [patientDetailsQuery?.data?.data?.data]);

  const nextStep = () => {
    const tempNextStep = currentStep + 1;
    setCurrentStep(tempNextStep);
    setMaxStepReached(tempNextStep);
    if (tempNextStep == 1) {
      setAllowStepSwitching(true);
    }
  };

  const prevStep = () => {
    const tempPrevStep = currentStep > 0 ? currentStep - 1 : 0;
    setCurrentStep(tempPrevStep);

    scrollTo({ y: 0 });
  };

  const handleBack = () => {
    prevStep();
    scrollTo({ y: 0 });
  };

  const handleStepSubmit = (data) => {
    console.log(data);
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }));
    nextStep();
    scrollTo({ y: 0 });
  };

  const patientBookingMutation = useMutation({ mutationFn: (payload: IPatientBookingPatientInfoDTO) => partnerPatientRepository.patientBooking(payload) });

  const onSubmit = async (data) => {
    const payload: IPatientBookingPatientInfoDTO = isRefill ? { ...data, is_refill: isRefill, refill_type: refillType } : data;
    patientBookingMutation.mutate(payload, {
      onSuccess: (res) => {
        // dmlToast.success({ title: "Patient has been invited successfully." });
        const prescription_uId = res?.data?.data?.u_id;
        navigate(`../partner-patient-intake?prescription_u_id=${prescription_uId}`);
        console.log(res);
      },
      onError: (err) => {
        const error = err as AxiosError<IServerErrorResponse>;
        console.log(error);
        dmlToast.error({ title: error.message });
      },
    });
    // console.log("Submitting Data:", payload);
    // navigate(`../partner-patient-intake?prescription_u_id=${prescriptionUId}`);
  };

  // const handleNext = handleSubmit(onSubmit);

  const onRefillTypeSelect = (refillType) => {
    setRefillType((prevType) => refillType);
    nextStep();
  };

  return (
    <section className="bg-background xl:px-0 px-4 relative min-h-screen flex flex-col">
      <div className="external-page-header w-full !pt-[83px] !pb-16 flex sm:justify-between ">
        <div className="flex sm:flex-row flex-col items-center sm:gap-6 gap-2">
          <Image
            mah={80}
            maw={200}
            src={`/images/wellness-logo.svg`}
            alt={"SalesPlus"}
            className="img-fluid object-scale-down sm:mx-0 mx-auto"
          />
          {/* {patientDetails?.type === "partner" && (
            <>
              <Divider orientation="vertical" />
              <img
                src="/images/wellness-logo.svg"
                alt="Wellness Logo"
                className="overflow-hidden shrink-0"
              />
            </>
          )} */}
        </div>

        <div className="flex items-center justify-center gap-2">
          <Tooltip label={patientDetails?.customer?.account_name}>
            <Avatar
              src={`${import.meta.env.VITE_BASE_PATH}/storage/${patientDetails?.customer?.profile_image}`}
              alt="logo"
              size={52}
            >
              <img
                src="/images/clinic-icon-grey.svg"
                alt=""
              />
            </Avatar>
          </Tooltip>
          <h6 className="text-foreground">{patientDetails?.customer?.account_name}</h6>
        </div>
      </div>
      <div className="dr-header-container pb-8 w-full">
        {isRefill ? (
          <Stepper
            active={currentStep}
            allowNextStepsSelect={allowStepSwitching}
            completedIcon={<i className="icon-tick text-[24px]"></i>}
            onStepClick={(step) => step <= maxStepReached && setCurrentStep(step)}
          >
            <Stepper.Step
              label="Step 1"
              description="Refill Info"
            >
              <RefillStep handleSubmit={(refillType) => onRefillTypeSelect(refillType)} />
            </Stepper.Step>
            <Stepper.Step
              label="Step 2"
              description="Basic Info"
            >
              <StepOne
                patientDetails={patientDetails}
                onNext={(data) => (patientDetails?.customer?.payment_type == "stripe" ? handleStepSubmit(data) : onSubmit(data))}
                isSubmitting={patientBookingMutation?.isPending}
              />
            </Stepper.Step>
            {patientDetails?.customer?.payment_type == "stripe" && (
              <Stepper.Step
                label="Step 3"
                description="Payment Authorization"
              >
                {clientSecret}
                {clientSecret && (
                  <StripeWrapper clientSecret={clientSecret}>
                    <StepTwo
                      handleBack={handleBack}
                      formData={formData}
                      patientDetails={patientDetails}
                      handleSubmit={onSubmit}
                      isSubmitting={patientBookingMutation?.isPending}
                    />
                  </StripeWrapper>
                )}
              </Stepper.Step>
            )}
          </Stepper>
        ) : patientDetails?.customer?.payment_type == "stripe" ? (
          <Stepper
            active={currentStep}
            allowNextStepsSelect={allowStepSwitching}
            completedIcon={<i className="icon-tick text-[24px]"></i>}
            onStepClick={(step) => step <= maxStepReached && setCurrentStep(step)}
          >
            <Stepper.Step
              label="Step 1"
              description="Basic Info"
            >
              <StepOne
                patientDetails={patientDetails}
                onNext={(data) => handleStepSubmit(data)}
                isSubmitting={patientBookingMutation?.isPending}
              />
            </Stepper.Step>

            <Stepper.Step
              label="Step 2"
              description="Payment Authorization"
            >
              {clientSecret && (
                <StripeWrapper clientSecret={clientSecret}>
                  <StepTwo
                    handleBack={handleBack}
                    formData={formData}
                    patientDetails={patientDetails}
                    handleSubmit={onSubmit}
                    isSubmitting={patientBookingMutation?.isPending}
                  />
                </StripeWrapper>
              )}
            </Stepper.Step>
          </Stepper>
        ) : (
          <StepOne
            patientDetails={patientDetails}
            onNext={(data) => onSubmit(data)}
            isSubmitting={patientBookingMutation?.isPending}
          />
        )}
      </div>
      <RegistrationFooter />
    </section>
  );
};

export default PartnerPatientBooking;
