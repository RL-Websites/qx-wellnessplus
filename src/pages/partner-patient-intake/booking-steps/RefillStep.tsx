import { Button } from "@mantine/core";
import { useState } from "react";

interface RefillStepProps {
  handleSubmit: (refillType) => void;
}
const RefillStep = ({ handleSubmit }: RefillStepProps) => {
  const [selectedRefillOption, setSelectedRefillOption] = useState<string>("oneMonth");
  return (
    <>
      <div className="card">
        <div className="card-title with-border">
          <h6>Refill Information</h6>
        </div>
        <div className="grid md:grid-cols-2 gap-9 mt-6">
          <div
            className={`relative card transition-all border border-grey-low cursor-pointer hover:bg-primary-light hover:border-primary hover:ring-2 hover:ring-primary/20 ${
              selectedRefillOption == "oneMonth" ? "bg-primary-light ring-2 ring-primary/20" : ""
            }`}
            onClick={() => setSelectedRefillOption("oneMonth")}
          >
            {selectedRefillOption == "oneMonth" ? (
              <span className="absolute right-3 top-3">
                <i className="icon-checkmark-circle text-2xl/none text-green-middle" />
              </span>
            ) : (
              ""
            )}
            <h6 className="text-foreground mb-3">Refill for One-Month</h6>
            <div>You can order a one-month refill here in just a few steps!</div>
          </div>
          <div
            className={`relative card transition-all border border-grey-low cursor-pointer hover:bg-primary-light hover:border-primary hover:ring-2 hover:ring-primary/20 ${
              selectedRefillOption == "threeMonth" ? "bg-primary-light ring-2 ring-primary/20" : ""
            }`}
            onClick={() => setSelectedRefillOption("threeMonth")}
          >
            {selectedRefillOption == "threeMonth" ? (
              <span className="absolute right-3 top-3">
                <i className="icon-checkmark-circle text-2xl/none text-green-middle" />
              </span>
            ) : (
              ""
            )}

            <h6 className="text-foreground mb-3">Refill for Three-Months</h6>
            <div>You can order a three-month refill here in just a few steps!</div>
          </div>
        </div>

        <div className="card bg-tag-bg mt-5 border border-dashed border-tag-bg-deep space-y-4">
          <h6 className="text-tag-bg-deep">Recommended Dose Adjustment</h6>
          <ul className="!list-disc list-inside text-tag-bg-deep">
            <li>You previously started with 0.25 mg.</li>
            <li>If you experienced no major side effects, it's generally recommended to move up to 0.5 mg for better results.</li>
            <li>If you're unsure, you can stay on the current dose or talk to our provider.</li>
          </ul>
          <h6 className="text-tag-bg-deep">What You Need To Do</h6>
          <ul className="!list-disc list-inside text-tag-bg-deep">
            <li>Select your dose (based on how you felt on the previous one).</li>
            <li>Complete your purchase securely.</li>
            <li>Fill out a quick intake form — we'll send it right after your order.</li>
          </ul>
          <h6 className="text-tag-bg-deep">Need help choosing your dose?</h6>
          <ul className="!list-disc list-inside text-tag-bg-deep">
            <li>
              Our support team is here— just reply to this page or email <b>support@salesplusrx.com.</b>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex justify-end gap-6 mt-6">
        <Button
          w={256}
          onClick={() => handleSubmit(selectedRefillOption)}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default RefillStep;
