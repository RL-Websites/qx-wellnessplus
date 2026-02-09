import { Elements } from "@stripe/react-stripe-js";
import { Appearance, loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import React from "react";

interface StripeWrapperProps {
  children: React.ReactNode;
  clientSecret: string;
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripeWrapper = ({ children, clientSecret }: StripeWrapperProps) => {
  const appearance: Appearance = {
    // Other options: 'night', 'flat', 'none'
    theme: "stripe",
    variables: {
      colorPrimary: "#000000",
      colorBackground: "#ffffff",
      colorText: "#000000",
      colorTextPlaceholder: "#adb5bd",
      colorTextSecondary: "#adb5bd",
      colorDanger: "#FF5A43",
      fontFamily: '"UberMove", sans-serif',
      borderRadius: "8px",
      spacingUnit: "5px",
    },
    rules: {
      ".Input": {
        borderColor: "transparent",
        padding: "18px",
        backgroundColor: "#e8e8e8",
      },
      ".Input:focus": {
        borderColor: "#0570de",
        outline: "none",
        boxShadow: "none",
      },
      ".Label": {
        fontWeight: "500",
        fontSize: "18px",
        color: "000000",
      },
      ".AccordionItem": {
        "border-bottom": "1px solid var(--colorPrimary)",
      },
      ".AnimateSinglePresenceItem": {
        "border-top": "1px solid var(--colorPrimary)",
      },
    },
  };
  const loader = "auto";
  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
    loader,
  };
  return (
    <Elements
      stripe={stripePromise}
      options={options}
    >
      {children}
    </Elements>
  );
};

export default StripeWrapper;
