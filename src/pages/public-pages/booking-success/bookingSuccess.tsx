import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IPatientPaymentAuthorizeConfirmDTO } from "@/common/api/models/interfaces/PartnerPatient.model";
import paymentRepository from "@/common/api/repositories/paymentRepository";
import dmlToast from "@/common/configs/toaster.config";
import { cartItemsAtom } from "@/common/states/product.atom";
import { Button, Image, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const BookingSuccess = () => {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const isMediumScreen = useMediaQuery("(min-width: 768px)");
  const [prescriptionUId, setPrescriptionUId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"loading" | "succeeded" | "failed" | "processing">("loading");
  const [updateTitle, setUpdateTitle] = useState<string | null>(null);
  const navigate = useNavigate();
  const setCartItems = useSetAtom(cartItemsAtom);
  const [params] = useSearchParams();
  let buttonSize: "md" | "lg" = "md";
  if (isLargeScreen) {
    buttonSize = "lg";
  } else if (isMediumScreen) {
    buttonSize = "md";
  }

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  const payment_intent = params.get("payment_intent");
  const client_secret = params.get("payment_intent_client_secret");

  const paymentAuthorizeMn = useMutation({ mutationFn: (payload: IPatientPaymentAuthorizeConfirmDTO) => paymentRepository.patientPaymentAuthorizeConfirm(payload) });

  // useEffect(() => {
  //   if (payment_intent && client_secret) {
  //     const payload: IPatientPaymentAuthorizeConfirmDTO = {
  //       payment_intent_id: payment_intent,
  //       client_secret: client_secret,
  //     };
  //     if (!prescriptionUId) {
  //       paymentAuthorizeMn.mutate(payload, {
  //         onSuccess: (res) => {
  //           // dmlToast.success({ title: "Patient has been invited successfully." });
  //           const prescription_uId = res?.data?.data?.u_id;
  //           setPrescriptionUId(prescription_uId);
  //           setTimeout(() => {
  //             navigate(`/partner-patient-intake?prescription_u_id=${prescription_uId}`);
  //           }, 10000);
  //           console.log(res);
  //         },
  //         onError: (err) => {
  //           const error = err as AxiosError<IServerErrorResponse>;
  //           console.log(error);
  //           dmlToast.error({ title: error?.response?.data?.message });
  //         },
  //       });
  //     }
  //   }
  // }, [payment_intent, client_secret]);

  useEffect(() => {
    const verifyAndAuthorizePayment = async () => {
      if (!payment_intent || !client_secret || prescriptionUId) return;

      try {
        const stripe = await stripePromise;

        // ✅ TypeScript-safe null check
        if (!stripe) {
          dmlToast.error({ title: "Payment system not initialized. Please refresh the page." });
          return;
        }
        // Retrieve PaymentIntent status from Stripe
        const { paymentIntent, error: retrieveError } = await stripe.retrievePaymentIntent(client_secret);
        console.log(paymentIntent, retrieveError);
        if (retrieveError) {
          dmlToast.error({ title: "Failed to retrieve payment information." });
          return;
        }

        if (!paymentIntent) {
          dmlToast.error({ title: "Unable to verify payment." });
          return;
        }

        // Handle based on PaymentIntent status
        switch (paymentIntent.status) {
          case "succeeded":
          case "requires_capture": {
            setPaymentStatus("succeeded");
            setUpdateTitle("Payment successful. Thank you!");
            const payload: IPatientPaymentAuthorizeConfirmDTO = {
              payment_intent_id: payment_intent,
              client_secret,
            };

            paymentAuthorizeMn.mutate(payload, {
              onSuccess: (res) => {
                const prescription_uId = res?.data?.data?.u_id;
                // The inline checkout clears these itself; a redirect-based method
                // comes back here instead, so the cart has to be cleared on this path
                // as well or the patient can re-order what they just paid for.
                setCartItems([]);
                localStorage.removeItem("cartItems");
                setPrescriptionUId(prescription_uId);
                setTimeout(() => {
                  navigate(`/patient-intake?prescription_u_id=${prescription_uId}`);
                }, 10000);
              },
              onError: (err) => {
                const error = err as AxiosError<IServerErrorResponse>;
                console.error("Authorize error:", error);
                dmlToast.error({ title: error?.response?.data?.message || "Authorization failed." });
              },
            });
            break;
          }

          case "requires_payment_method": {
            setPaymentStatus("failed");
            setUpdateTitle("Payment failed. Please try again.");
            break;
          }

          case "processing": {
            // ACH, Cash App and the BNPL options settle out of band. Tell the backend
            // so the order is parked as `payment_processing` instead of being left at
            // intent_created — the Stripe webhook finalises it and emails the intake
            // link once the funds clear.
            setPaymentStatus("processing");
            setUpdateTitle("Your payment is still processing...");
            setCartItems([]);
            localStorage.removeItem("cartItems");
            paymentAuthorizeMn.mutate({ payment_intent_id: payment_intent, client_secret });
            break;
          }

          default: {
            setPaymentStatus("failed");
            setUpdateTitle("Something went wrong with your payment.");
            break;
          }
        }
      } catch (err) {
        console.error("Unexpected error verifying payment:", err);
        dmlToast.error({ title: "Something went wrong while verifying payment." });
      }
    };

    verifyAndAuthorizePayment();
  }, [payment_intent, client_secret, prescriptionUId]);

  return (
    <div className="flex flex-col py-12 items-center justify-center text-center">
      {paymentStatus === "loading" && (
        <div className="text-center">
          <p className="text-lg text-gray-600">{"Verifying your payment..."}</p>
        </div>
      )}

      {paymentStatus === "succeeded" && (
        <>
          <Image
            className="img-fluid"
            src="/images/thank-you.png"
            w={450}
          />
          <Text
            className="text-4xl"
            mt={48}
            fw={700}
            c="secondary"
          >
            Thank You
          </Text>
          <div className="text-[#7C7C7C] mt-3 text-center">
            <p className="text-center w-[600px] mx-auto my-3 font-medium text-foreground">
              Next Step: Please complete your Intake Form so our licensed doctors can review your information and approve your prescription.
            </p>
            <p className="text-center w-[500px] mx-auto ">Please wait... It will redirect you to the intake form section! You can also Click the button below to continue</p>
            <div className="flex justify-center mt-5">
              <Link to={prescriptionUId ? `/patient-intake?prescription_u_id=${prescriptionUId}` : ""}>
                <Button
                  size={buttonSize}
                  className="sm:w-[400px] w-[200px]"
                >
                  Go to intake form
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}

      {paymentStatus === "failed" && (
        <>
          <Image
            className="img-fluid"
            src="/images/payment-failed.svg"
            alt="Payment Failed"
            w={300}
          />
          <Text
            className="text-4xl"
            mt={48}
            fw={700}
            c="red"
          >
            {"Payment Failed"}
          </Text>
          <p className="text-gray-500 mt-4">{"Your payment could not be completed. Please try again"}</p>
          {/* <div className="flex justify-center mt-6">
            <Link to="/partner-patient-booking">
              <Button
                variant="outline"
                color="red"
                size={buttonSize}
              >
                {t("tryAgain") || "Try Again"}
              </Button>
            </Link>
          </div> */}
        </>
      )}

      {paymentStatus === "processing" && (
        <div>
          <Image
            className="img-fluid"
            src="/images/thank-you.png"
            alt="Processing Payment"
            w={300}
          />
          <Text
            className="text-3xl mt-12"
            fw={700}
            c="secondary"
          >
            {"Payment is Processing"}
          </Text>
          <p className="text-gray-500 mt-4 max-w-[600px] mx-auto">
            {
              "Your order is confirmed and your payment is being processed by your bank or payment provider. This can take a few minutes to a few business days. We will email you a link to your intake form as soon as it clears — you do not need to pay again."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingSuccess;
