import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IPatientBookingPatientInfoDTO, IPublicPartnerPrescriptionDetails } from "@/common/api/models/interfaces/PartnerPatient.model";
import { ICreatePaymentIntentDTO } from "@/common/api/models/interfaces/Payment.model";
import orderApiRepository from "@/common/api/repositories/orderRepository";
import StripeWrapper from "@/common/components/StripeWrapper";
import dmlToast from "@/common/configs/toaster.config";
import { selectedCategoryAtom } from "@/common/states/category.atom";
import { customerAtom } from "@/common/states/customer.atom";
import { basicInfoAtom } from "@/common/states/customerBasic.atom";
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
import OrderInfo from "./payment-info/OrderInfo";
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
  const [basicInfo, setBasicInfo] = useAtom(basicInfoAtom);
  const [selectedCategory] = useAtom(selectedCategoryAtom);
  const detail_uid = params.get("detail_uid");
  const navigate = useNavigate();

  useEffect(() => {
    if (
      selectedCategory &&
      selectedCategory.includes("Weight Loss") &&
      selectedCategory.includes("Testosterone") &&
      selectedCategory.includes("Hair Growth (Male)") &&
      selectedCategory.includes("Hair Growth (Female)") &&
      selectedCategory.includes("Sexual Health (Male)") &&
      selectedCategory.includes("Sexual Health (Female)")
    ) {
      setHasOthers(true);
      setHasPeptides(false);
    }
    if (selectedCategory && (selectedCategory?.includes("Peptides Blends") || selectedCategory?.includes("Single Blends"))) {
      setHasPeptides(true);
      setHasOthers(false);
    }
  }, [selectedCategory]);

  const createPaymentIntentMutation = useMutation({ mutationFn: (payload: ICreatePaymentIntentDTO) => orderApiRepository.createPaymentIntent(payload) });

  useEffect(() => {
    if (cartItems?.length > 0 && customerData?.payment_type == "stripe") {
      let totalBill = 0;
      cartItems.forEach((item) => {
        const price = calculatePrice(item);
        totalBill = totalBill + price;
      });
    }
  }, [cartItems, customerData]);

  const nextStep = () => {
    const tempNextStep = currentStep + 1;
    setCurrentStep(tempNextStep);
    scrollTo({ y: 0 });
  };

  const getPatientData = (orderInfoData: IPatientBookingPatientInfoDTO) => {
    console.log("Order Info data", orderInfoData);
    setFormData((prev) => ({
      ...prev,
      patient: orderInfoData.patient,
      code: orderInfoData.code,
      amount: orderInfoData.final_total,
      prescription_u_id: orderInfoData.prescription_u_id,
    }));
    if (cartItems?.length > 0 && customerData?.payment_type == "stripe") {
      const payload: ICreatePaymentIntentDTO = {
        amount: orderInfoData.final_total || 0,
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

    nextStep();
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

  const onRefillTypeSelect = (refillType) => {
    setRefillType((prevType) => refillType);
    nextStep();
  };

  return (
    <section>
      {currentStep == 0 && (
        <BasicInfo
          userData={userData || undefined}
          onNext={(data) => {
            setFormData((prev) => ({ ...prev, ...data }));
            setBasicInfo(data);
            nextStep();
          }}
          formData={formData}
          isSubmitting={patientBookingMutation?.isPending}
        />
      )}
      {currentStep == 1 && (
        <Acknowledgement
          onNext={handleStepSubmit}
          onBack={handleBack}
          defaultValues={formData}
          patientData={formData}
          hasOthers={hasOthers}
          hasPeptides={hasPeptides}
        />
      )}
      {currentStep == 2 && (
        <OrderInfo
          handleBack={handleBack}
          formData={formData}
          onNext={getPatientData}
          isSubmitting={patientBookingMutation?.isPending}
        />
      )}
      {currentStep == 3 && clientSecret && (
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
