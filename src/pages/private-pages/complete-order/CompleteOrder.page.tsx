import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IPatientBookingPatientInfoDTO, IPublicPartnerPrescriptionDetails } from "@/common/api/models/interfaces/PartnerPatient.model";
import { ICreatePaymentIntentDTO } from "@/common/api/models/interfaces/Payment.model";
import orderApiRepository from "@/common/api/repositories/orderRepository";
import StripeWrapper from "@/common/components/StripeWrapper";
import dmlToast from "@/common/configs/toaster.config";
import { customerAtom } from "@/common/states/customer.atom";
import { cartItemsAtom } from "@/common/states/product.atom";
import { userAtom } from "@/common/states/user.atom";
import { calculatePrice } from "@/utils/helper.utils";
import { useWindowScroll } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Client as Styletron } from "styletron-engine-monolithic";
import Acknowledgement from "./Acknowledgement";
import BasicInfo from "./basic-info/BasicInfo";
import PaymentInfo from "./payment-info/PaymentInfo";

const CompleteOrderPage = () => {
  const engine = new Styletron();
  const [customerData, setCustomerData] = useAtom(customerAtom);
  const [userData, setUserData] = useAtom(userAtom);
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [, scrollTo] = useWindowScroll();
  const [isRefill, setIsRefill] = useState(0);
  const [refillType, setRefillType] = useState<string>("");
  const [patientDetails, setPatientDetails] = useState<IPublicPartnerPrescriptionDetails>();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [hasPeptides, setHasPeptides] = useState(false);
  const [hasOthers, setHasOthers] = useState(true);
  const [params] = useSearchParams();
  // const prescriptionUId = params.get("prescription_u_id");
  // const is_refill = params.get("is_refill");
  const detail_uid = params.get("detail_uid");
  const navigate = useNavigate();

  // const patientDetailsQuery = useQuery({
  //   queryKey: ["partner-patient-booking-query"],
  //   queryFn: () => orderApiRepository.publicGetPatientDetails({ u_id: prescriptionUId || "", detail_uid: detail_uid || undefined }),
  //   enabled: !!prescriptionUId,
  // });

  const createPaymentIntentMutation = useMutation({ mutationFn: (payload: ICreatePaymentIntentDTO) => orderApiRepository.createPaymentIntent(payload) });

  useEffect(() => {
    if (cartItems?.length > 0 && customerData?.payment_type == "stripe") {
      let totalBill = 0;
      cartItems.forEach((item) => {
        const price = calculatePrice(item);
        totalBill = totalBill + price;
      });

      const payload: ICreatePaymentIntentDTO = {
        amount: totalBill.toString(),
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
  }, [cartItems, customerData]);

  // useEffect(() => {
  //   if (patientDetailsQuery?.data?.data?.status_code == 200 && patientDetailsQuery?.data?.data?.data) {
  //     const tempPatientDetails = patientDetailsQuery?.data?.data?.data;
  //     // setIsRefill((prevRefill) => (tempPatientDetails?.is_refill ? true : false));
  //     if (tempPatientDetails?.status && tempPatientDetails?.status == "invited") {
  //       // do nothing
  //       if (tempPatientDetails?.customer?.payment_type == "stripe" && tempPatientDetails.total_bill_amount) {
  //       }
  //     } else if (tempPatientDetails?.status && tempPatientDetails?.status == "intake_pending") {
  //       navigate(`../partner-patient-intake?prescription_u_id=${prescriptionUId}`);
  //     } else if (tempPatientDetails?.status && tempPatientDetails?.status == "pending") {
  //       navigate(`../partner-patient-password-setup?prescription_u_id=${prescriptionUId}`);
  //     } else {
  //       console.log(tempPatientDetails?.status);
  //     }
  //     setPatientDetails(patientDetailsQuery?.data?.data?.data);
  //   }
  // }, [patientDetailsQuery?.data?.data?.data]);

  const nextStep = () => {
    const tempNextStep = currentStep + 1;
    setCurrentStep(tempNextStep);
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
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }));
    nextStep();
    scrollTo({ y: 0 });
  };

  const patientBookingMutation = useMutation({ mutationFn: (payload: IPatientBookingPatientInfoDTO) => orderApiRepository.patientBooking(payload) });

  const onSubmit = async (data) => {
    const payload: IPatientBookingPatientInfoDTO = isRefill ? { ...data, is_refill: isRefill, refill_type: refillType } : data;

    patientBookingMutation.mutate(payload, {
      onSuccess: (res) => {
        // dmlToast.success({ title: "Patient has been invited successfully." });
        const prescription_uId = res?.data?.data?.u_id;
        setCartItems([]);
        navigate(`/patient-intake?prescription_u_id=${prescription_uId}`);
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
    <section>
      {currentStep == 0 && (
        <BasicInfo
          userData={userData || undefined}
          onNext={(data) => handleStepSubmit(data)}
          isSubmitting={patientBookingMutation?.isPending}
        />
      )}
      {currentStep == 1 && (
        <Acknowledgement
          onNext={handleStepSubmit}
          onBack={handleBack}
          defaultValues={formData}
          patientData={patientDetails}
          hasOthers={hasOthers}
          hasPeptides={hasPeptides}
        />
      )}
      {currentStep == 2 && clientSecret && (
        <StripeWrapper clientSecret={clientSecret}>
          <PaymentInfo
            handleBack={handleBack}
            handleSubmit={(data) => onSubmit(data)}
            isSubmitting={patientBookingMutation.isPending}
            formData={formData}
          />
        </StripeWrapper>
      )}
    </section>
  );
};

export default CompleteOrderPage;
