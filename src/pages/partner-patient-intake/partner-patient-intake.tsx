// PartnerPatientIntake.tsx
import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IPatientIntakeFormDTO, IPublicPartnerPrescriptionDetails } from "@/common/api/models/interfaces/PartnerPatient.model";
import partnerPatientRepository from "@/common/api/repositories/partnerPatientRepository";
import RegistrationFooter from "@/common/components/Registration/RegistrationFooter";
import dmlToast from "@/common/configs/toaster.config";
import { formatDate } from "@/utils/date.utils";
import { Avatar, Button, Image, Progress, Tooltip } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { NavLink as RdNavLink, useNavigate, useSearchParams } from "react-router-dom";
import { questions } from "./intake-steps/questions";
import StepEight from "./intake-steps/step-eight";
import StepEleven from "./intake-steps/step-eleven";
import StepFive from "./intake-steps/step-five";
import StepFour from "./intake-steps/step-four";
import StepFullBody from "./intake-steps/step-fullbody";
import StepLast2 from "./intake-steps/step-last2";
import StepLast3 from "./intake-steps/step-last3";
import StepNine from "./intake-steps/step-nine";
import StepOne from "./intake-steps/step-one";
import StepSeven from "./intake-steps/step-seven";
import StepSix from "./intake-steps/step-six";
import StepTen from "./intake-steps/step-ten";
import StepThirteen from "./intake-steps/step-thirteen";
import StepThree from "./intake-steps/step-three";
import StepTwelve from "./intake-steps/step-twelve";
import StepTwo from "./intake-steps/step-two";
import StepEighteen from "./intake-steps/step_eighteen";
import StepSeventeen from "./intake-steps/step_seventeen";
import StepSixteen from "./intake-steps/step_sixteen";

const TOTAL_STEPS = 19;

const PartnerPatientIntake = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [patientDetails, setPatientDetails] = useState<IPublicPartnerPrescriptionDetails>();
  const [params] = useSearchParams();
  const prescriptionUId = params.get("prescription_u_id");
  const [totalStep, setTotalStep] = useState(TOTAL_STEPS);
  const [forceShowSteps, setForceShowSteps] = useState(false);
  const navigate = useNavigate();
  const [, scrollTo] = useWindowScroll();

  const patientDetailsQuery = useQuery({
    queryKey: ["partner-patient-booking-query", prescriptionUId],
    queryFn: () => partnerPatientRepository.publicGetPatientDetails({ u_id: prescriptionUId || "" }),
    enabled: !!prescriptionUId,
  });

  useEffect(() => {
    if (patientDetailsQuery?.data?.data?.status_code == 200 && patientDetailsQuery?.data?.data?.data) {
      const tempPatientDetails = patientDetailsQuery?.data?.data?.data;
      if (tempPatientDetails?.status && tempPatientDetails?.status == "intake_pending") {
        // do nothing
        if (tempPatientDetails?.patient?.gender == "Female") {
          setTotalStep(TOTAL_STEPS);
        } else {
          setTotalStep(() => TOTAL_STEPS - 1);
        }
      } else if (tempPatientDetails?.status && tempPatientDetails?.status == "pending") {
        navigate(`../partner-patient-password-setup?prescription_u_id=${prescriptionUId}`);
      } else {
        if (tempPatientDetails?.patient?.gender == "Female") {
          setTotalStep(TOTAL_STEPS);
        } else {
          setTotalStep(() => TOTAL_STEPS - 1);
        }
      }

      setPatientDetails(patientDetailsQuery?.data?.data?.data);
    }
  }, [patientDetailsQuery?.data?.data?.data]);

  const progress = (activeStep / totalStep) * 100;

  const handleNext = (data: any) => {
    // const tempData = { ...formData, ...data };
    // const formattedData = questions.map((item) => ({
    //   question: item.label,
    //   key: item.name,
    //   answer: [tempData[item.name]],
    // }));

    // console.log(tempData);
    // console.log(formattedData);
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

  const intakeFormMutation = useMutation({ mutationFn: (payload: IPatientIntakeFormDTO) => partnerPatientRepository.patientIntakeFormSubmit(payload) });

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
              answer: [tempData[item.name]],
            }
          : null
      )
      .filter((item) => item !== null);
    const payload: IPatientIntakeFormDTO = {
      prescription_u_id: prescriptionUId || "",
      signature: signature,
      measurement: measurement,
      questionnaires: formattedData || [],
    };

    intakeFormMutation.mutate(payload, {
      onSuccess: (res) => {
        const prescription_uId = res?.data?.data?.u_id;
        dmlToast.success({ title: "Intake form submitted successfully" });
        navigate(`../partner-patient-password-setup?prescription_u_id=${prescription_uId}`);
      },
      onError: (err) => {
        const error = err as AxiosError<IServerErrorResponse>;
        console.log(error);
        dmlToast.error({ title: "Oops! Something went wrong. Please try again later." });
      },
    });

    // console.log(payload);
  };

  const showFullIntakeSteps = (() => {
    if (!patientDetails?.patient?.last_intake_submit_date) return true;

    const createdAt = dayjs(patientDetails?.patient?.last_intake_submit_date);
    const now = dayjs();

    const isOlderThanOneMonth = now.diff(createdAt, "month") >= 1;

    return isOlderThanOneMonth;
  })();

  const shouldShowUpdateCard = patientDetails?.patient?.last_intake_submit_date && !showFullIntakeSteps && !forceShowSteps;

  return (
    <section className="bg-background xl:px-0 px-4 relative min-h-screen flex flex-col">
      <div className="external-page-header w-full !pt-[83px] !pb-16 flex sm:justify-between">
        <div className="flex sm:flex-row flex-col items-center sm:gap-6 gap-2">
          <Image
            mah={80}
            maw={200}
            src={`/images/wellness-logo.svg`}
            alt="Wellness Logo"
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
        {shouldShowUpdateCard ? (
          <div className="card text-center">
            <Image
              src={`/images/ask-qa.png`}
              className="w-[380px] mx-auto"
            />
            <p className="text-fs-lg text-foreground py-10">
              Since your last purchase for this medication was <span className="font-bold">{formatDate(patientDetails?.created_at, "MMM DD, YYYY")}</span>. Do you have any updates
              on your intake since the last order?
            </p>
            <div className="flex items-center justify-center gap-5">
              <Button
                px={0}
                variant="light"
                className="sm:w-[256px] w-[120px]"
                component={RdNavLink}
                to={`../partner-patient-password-setup?prescription_u_id=${patientDetails?.u_id}`}
              >
                No
              </Button>
              <Button
                type="submit"
                className="sm:w-[256px] w-[120px]"
                onClick={() => setForceShowSteps(true)}
              >
                Yes
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="max-w-[520px] mx-auto mb-6">
              <Progress value={progress} />
              <div className="text-center text-sm text-gray-600 mt-3">
                {activeStep} / {totalStep}
              </div>
            </div>

            {activeStep === 1 && (
              <StepFullBody
                onNext={handleNext}
                defaultValues={formData}
              />
            )}
            {activeStep === 2 && (
              <StepOne
                onNext={handleNext}
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
                onNext={handleNext}
                onBack={handleBack}
                defaultValues={formData}
              />
            )}
            {activeStep === 5 && (
              <StepFour
                onNext={handleNext}
                onBack={handleBack}
                defaultValues={formData}
              />
            )}
            {activeStep === (patientDetails?.patient?.gender == "Female" ? 6 : 0) ? (
              <StepFive
                onNext={handleNext}
                onBack={handleBack}
                defaultValues={formData}
              />
            ) : (
              ""
            )}
            {activeStep === (patientDetails?.patient?.gender == "Female" ? 7 : 6) && (
              <StepSix
                onNext={handleNext}
                onBack={handleBack}
                defaultValues={formData}
              />
            )}
            {activeStep === (patientDetails?.patient?.gender == "Female" ? 8 : 7) && (
              <StepSeven
                onNext={handleNext}
                onBack={handleBack}
                defaultValues={formData}
              />
            )}
            {activeStep === (patientDetails?.patient?.gender == "Female" ? 9 : 8) && (
              <StepEight
                onNext={handleNext}
                onBack={handleBack}
                defaultValues={formData}
              />
            )}
            {activeStep === (patientDetails?.patient?.gender == "Female" ? 10 : 9) && (
              <StepNine
                onNext={handleNext}
                onBack={handleBack}
                defaultValues={formData}
              />
            )}
            {activeStep === (patientDetails?.patient?.gender == "Female" ? 11 : 10) && (
              <StepTen
                onNext={handleNext}
                onBack={handleBack}
                defaultValues={formData}
              />
            )}
            {activeStep === (patientDetails?.patient?.gender == "Female" ? 12 : 11) && (
              <StepEleven
                onNext={handleNext}
                onBack={handleBack}
                defaultValues={formData}
              />
            )}
            {activeStep === (patientDetails?.patient?.gender == "Female" ? 13 : 12) && (
              <StepTwelve
                onNext={handleNext}
                onBack={handleBack}
                defaultValues={formData}
              />
            )}
            {activeStep === (patientDetails?.patient?.gender == "Female" ? 14 : 13) && (
              <StepThirteen
                onNext={handleNext}
                onBack={handleBack}
                defaultValues={formData}
              />
            )}
            {activeStep === (patientDetails?.patient?.gender == "Female" ? 15 : 14) && (
              <StepSixteen
                onNext={handleNext}
                onBack={handleBack}
                defaultValues={formData}
              />
            )}
            {activeStep === (patientDetails?.patient?.gender == "Female" ? 16 : 15) && (
              <StepSeventeen
                onNext={handleNext}
                onBack={handleBack}
                defaultValues={formData}
              />
            )}
            {activeStep === (patientDetails?.patient?.gender == "Female" ? 17 : 16) && (
              <StepEighteen
                onNext={handleNext}
                onBack={handleBack}
                defaultValues={formData}
              />
            )}
            {activeStep === totalStep - 1 && (
              <StepLast3
                onNext={handleNext}
                onBack={handleBack}
                defaultValues={formData}
              />
            )}
            {activeStep === totalStep && (
              <StepLast2
                onNext={handleFinalSubmit}
                onBack={handleBack}
                defaultValues={formData}
                patientData={patientDetails}
                isLoading={intakeFormMutation.isPending}
              />
            )}
            {/* 
        {activeStep === totalStep && (
          <StepLast
            onNext={handleFinalSubmit}
            onBack={handleBack}
            defaultValues={formData}
            isLoading={intakeFormMutation.isPending}
          />
        )} */}
          </>
        )}
      </div>

      <RegistrationFooter />
    </section>
  );
};

export default PartnerPatientIntake;
