import { IPublicPartnerPrescriptionDetails } from "@/common/api/models/interfaces/PartnerPatient.model";
import { formatDate } from "@/utils/date.utils";
import { getFullName } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Text } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import * as yup from "yup";
interface PropTypes {
  onNext: (data: any) => void;
  onBack: () => void;
  defaultValues?: any;
  hasPeptides: boolean;
  hasOthers: boolean;
  patientData?: IPublicPartnerPrescriptionDetails;
}
const stepLastSchema = yup.object({
  // agreeTerms: yup.boolean().oneOf([true], "Please agree to the terms & conditions.").required("Please agree to the terms & conditions."),
  signature: yup.string().required("Please provide your signature."),
});
const Acknowledgement = ({ onNext, onBack, defaultValues, patientData, hasPeptides, hasOthers }: PropTypes) => {
  const [today, setToday] = useState(new Date());
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const [signatureImage, setSignatureImage] = useState("");
  const {
    handleSubmit,
    setValue,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(stepLastSchema),
    defaultValues: {
      signature: defaultValues?.signature,
    },
  });

  const clearSignature = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    sigCanvas.current?.clear();
    setSignatureImage("");
    setValue("signature", "");
  };

  const setSigImg = useDebouncedCallback((base64Data) => {
    setSignatureImage(base64Data);
  }, 1600);

  const saveSignature = () => {
    const base64Data = sigCanvas.current.toDataURL("image/png");
    setValue("signature", base64Data, { shouldValidate: true });
    // setSignatureImage(base64Data);
    setSigImg(base64Data);
    clearErrors("signature");
  };

  useEffect(() => {
    if (defaultValues?.signature) {
      setSignatureImage(defaultValues?.signature);
      setValue("signature", defaultValues?.signature, { shouldValidate: true });
    }
  }, [defaultValues]);
  return (
    <>
      <h1 className="heading-text text-foreground uppercase text-center">Acknowledgement</h1>
      <div className="card-common bg-white">
        <div className="card-body">
          <div className="space-y-7">
            {hasOthers ? (
              <>
                <h6 className="text-lg !font-medium text-foreground">DOSEVANA LLC TERMS & CONDITIONS</h6>

                <p className="text-medium text-lg">
                  These Terms and Conditions (“Agreement”) govern your use of the Dosevana LLC platform and services (“Services”). By registering, purchasing, or using any Service,
                  including telehealth consultations, prescription weight loss treatments, wellness programs, or related products, you agree to the terms outlined below. Please
                  read carefully.
                </p>

                <div>
                  <h6 className="text-lg !font-medium text-foreground">Emergency Disclaimer</h6>
                  <h6 className="text-lg !font-medium text-foreground">NOT FOR EMERGENCIES</h6>
                </div>
                <p className="text-medium text-lg">
                  Dosevana LLC is not designed for emergency medical care. If you experience a medical emergency, immediately call 911 or your local emergency number.
                </p>

                <h6 className="text-lg !font-medium text-foreground">Acceptance of Terms</h6>
                <p className="text-medium text-lg">
                  By clicking “I Agree,” creating an account, or using our Services, you confirm that you have read, understood, and accepted these Terms. If acting on behalf of
                  another individual (e.g., a minor as a legal guardian), you confirm you are legally authorized to do so.
                </p>

                <h6 className="text-lg !font-medium text-foreground">Services Provided</h6>
                <div className="text-medium text-lg">
                  Dosevana LLC facilitates access to health and wellness solutions, including but not limited to:
                  <ul className="!list-disc list-inside">
                    <li>Telehealth consultations with licensed healthcare providers</li>
                    <li>Prescription medications dispensed by licensed partner pharmacies</li>
                    <li>Weight loss and wellness programs (e.g., GLP-1 therapies)</li>
                    <li>Diagnostic and laboratory services via partner labs</li>
                  </ul>
                  Some Services may be delivered by independent third-party providers, pharmacies, or labs (collectively, “Providers”).
                </div>

                <h6 className="text-lg !font-medium text-foreground">Role of Dosevana LLC</h6>
                <div className="text-medium text-lg">
                  <ul className="!list-disc list-inside">
                    <li>
                      <strong>No Medical Practice by Dosevana LLC:</strong> Dosevana LLC itself does not provide medical care. All medical services are delivered by licensed
                      independent Providers.
                    </li>
                    <li>
                      <strong>No Pharmacy Operations:</strong> Dosevana LLC is not a pharmacy. Prescriptions, if approved, are filled by partner pharmacies.
                    </li>
                    <li>
                      <strong>Patient-Provider Relationship:</strong> Your medical relationship is solely with the licensed Provider you consult through our platform.
                    </li>
                  </ul>
                </div>

                <h6 className="text-lg !font-medium text-foreground">Eligibility & Use by Minors</h6>
                <p className="text-medium text-lg">
                  Services are available only to individuals 18 years and older. Minors are not eligible unless explicitly authorized by a parent or legal guardian and approved by
                  a Provider.
                </p>

                <h6 className="text-lg !font-medium text-foreground">Telehealth Consent</h6>
                <p className="text-medium text-lg">
                  By using Dosevana, you consent to receive medical care via telehealth. You understand that telehealth has limitations compared to in-person care, not all
                  conditions can be treated remotely, and Providers may determine whether telehealth is appropriate for you.
                </p>

                <h6 className="text-lg !font-medium text-foreground">Consent to Communications</h6>
                <p className="text-medium text-lg">
                  You agree to receive communications from Dosevana LLC via email, SMS, or phone, including but not limited to appointment updates, prescription and shipping
                  notifications, billing updates and reminders, and marketing/promotional messages (with opt-out options available).
                </p>

                <h6 className="text-lg !font-medium text-foreground">Cash-Pay Model</h6>
                <p className="text-medium text-lg">
                  Dosevana LLC does not accept Medicare, Medicaid, or other insurance. All Services are self-pay only. You agree not to submit any claims to third-party payers.
                </p>

                <h6 className="text-lg !font-medium text-foreground">Billing & Subscription Terms</h6>
                <div className="text-medium text-lg">
                  <ul className="!list-disc list-inside">
                    <li>
                      <strong>One-Time and Recurring Fees:</strong> Some Services require an onboarding fee plus a recurring subscription.
                    </li>
                    <li>
                      <strong>Automatic Billing:</strong> Your payment method will be charged automatically on a recurring basis unless canceled.
                    </li>
                    <li>
                      <strong>Three-Month Programs:</strong>
                      <ul className="list-disc list-inside ml-6">
                        <li>Medications may be dispensed monthly or in full, depending on Provider review.</li>
                        <li>You are financially responsible for all dispensed medications.</li>
                        <li>Non-Payment: Failure to pay may result in cancellation, referral to collections, and denial of future services.</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <h6 className="text-lg !font-medium text-foreground">Prescription Requirements</h6>
                <p className="text-medium text-lg">
                  A prescription is issued only if medically necessary, determined by a licensed Provider. Payment does not guarantee a prescription. Providers may deny or
                  discontinue treatment if deemed unsafe.
                </p>

                <h6 className="text-lg !font-medium text-foreground">Risk Disclosure</h6>
                <p className="text-medium text-lg">
                  You acknowledge that every treatment carries potential risks and side effects. You will review all product information, including FDA disclosures, and you accept
                  sole responsibility for the use of prescribed medications and services.
                </p>

                <h6 className="text-lg !font-medium text-foreground">Dispute Resolution & Arbitration</h6>
                <p className="text-medium text-lg">
                  Any dispute will first be addressed through good faith mediation. If unresolved, disputes will be resolved by binding arbitration administered by the American
                  Arbitration Association (AAA). You waive any right to jury trial or participation in class actions.
                </p>

                <h6 className="text-lg !font-medium text-foreground">Indemnification</h6>
                <p className="text-medium text-lg">
                  You agree to indemnify and hold harmless Dosevana LLC, its affiliates, Providers, and partners from any claims, damages, or liabilities arising from your use of
                  the Services or violation of this Agreement.
                </p>

                <h6 className="text-lg !font-medium text-foreground">Severability</h6>
                <p className="text-medium text-lg">If any provision of this Agreement is found invalid, the remaining provisions remain enforceable.</p>

                <h6 className="text-lg !font-medium text-foreground">Assignment</h6>
                <p className="text-medium text-lg">You may not transfer your rights under this Agreement. Dosevana LLC may assign this Agreement to affiliates or successors.</p>

                <h6 className="text-lg !font-medium text-foreground">Governing Law</h6>
                <p className="text-medium text-lg pb-8">This Agreement is governed by the laws of the State of Texas, USA, without regard to conflict of law principles.</p>
              </>
            ) : (
              <></>
            )}

            {hasPeptides ? (
              <>
                <h6 className="text-lg !font-medium text-foreground">DOSEVANA LLC – RESEARCH PEPTIDE PURCHASE: WAIVER & ACKNOWLEDGMENT</h6>

                <p className="text-medium text-lg">
                  PLEASE READ THIS AGREEMENT CAREFULLY BEFORE PROCEEDING. This Waiver and Acknowledgment (“Agreement”) is a legally binding document between you (“Purchaser”) and
                  Dosevana LLC (“the Company”). By clicking “I Agree” or proceeding with your purchase, you confirm that you have read, understood, and agree to all terms below.
                </p>

                <h6 className="text-lg !font-medium text-foreground">1. Nature of Products – Research Use Only</h6>
                <div className="text-medium text-lg">
                  All peptide products sold by Dosevana LLC are research-grade materials intended exclusively for laboratory research purposes and in vitro use only. They are NOT
                  approved by the U.S. Food and Drug Administration (FDA) for:
                  <ul className="!list-disc list-inside">
                    <li>Human consumption</li>
                    <li>Animal consumption</li>
                    <li>Medical treatment</li>
                    <li>Diagnostic purposes</li>
                    <li>Dietary supplementation</li>
                  </ul>
                  These products are not medications and should not be used to treat, cure, prevent, or diagnose any disease or medical condition.
                </div>

                <h6 className="text-lg !font-medium text-foreground">2. Professional Oversight Acknowledgment</h6>
                <p className="text-medium text-lg">
                  References to “doctor use” or “clinical handling” in product descriptions mean that peptides are to be handled in controlled, professional environments by
                  qualified individuals with proper medical or scientific training. This language does not imply approval for human treatment. You agree to ensure that anyone
                  handling these materials is appropriately licensed and qualified.
                </p>

                <h6 className="text-lg !font-medium text-foreground">3. No Medical Advice or Therapeutic Claims</h6>
                <div className="text-medium text-lg">
                  <ul className="!list-disc list-inside">
                    <li>Dosevana LLC does not provide medical advice, diagnosis, or treatment in relation to research peptides.</li>
                    <li>Any information on our website—including articles, product descriptions, or testimonials—is for informational and educational purposes only.</li>
                    <li>No claims are made about the safety, effectiveness, or suitability of these products for human or animal use.</li>
                  </ul>
                </div>

                <h6 className="text-lg !font-medium text-foreground">4. Assumption of Risk</h6>
                <p className="text-medium text-lg">
                  You acknowledge that handling and storing research peptides carries inherent risks, including but not limited to unknown side effects, adverse reactions, and
                  potential hazards requiring specialized handling and disposal. By purchasing, you voluntarily assume full responsibility for all risks associated with possession,
                  handling, and any use of the products.
                </p>

                <h6 className="text-lg !font-medium text-foreground">5. Indemnification</h6>
                <p className="text-medium text-lg">
                  You agree to indemnify, defend, and hold harmless Dosevana, its affiliates, officers, employees, partners, and distributors from any and all claims, damages,
                  liabilities, or expenses arising from:
                </p>
                <div className="text-medium text-lg">
                  <ul className="!list-disc list-inside">
                    <li>Your purchase, possession, handling, or use of peptides.</li>
                    <li>Any violation of this Agreement.</li>
                    <li>Failure to comply with applicable laws or safety protocols.</li>
                    <li>Third-party claims related to your actions.</li>
                  </ul>
                </div>

                <h6 className="text-lg !font-medium text-foreground">6. Release of Liability</h6>
                <p className="text-medium text-lg">
                  You irrevocably release and discharge Dosevana LLC and its affiliates from all liability—whether known or unknown—arising from or related to your purchase,
                  possession, or handling of peptides.
                </p>

                <h6 className="text-lg !font-medium text-foreground">7. Legal Compliance</h6>
                <div className="text-medium text-lg">
                  You represent and warrant that:
                  <ul className="!list-disc list-inside">
                    <li>You are at least 18 years of age (or the legal age of majority in your jurisdiction).</li>
                    <li>You will comply with all applicable federal, state, and local laws regarding purchase, handling, and research use of peptides.</li>
                    <li>You are solely responsible for ensuring lawful use of these products.</li>
                  </ul>
                </div>

                <h6 className="text-lg !font-medium text-foreground">8. No Unauthorized Resale or Distribution</h6>
                <p className="text-medium text-lg">
                  You agree not to resell, distribute, or transfer these products for any purpose other than legitimate laboratory research. Any resale for human or animal use is
                  strictly prohibited.
                </p>

                <h6 className="text-lg !font-medium text-foreground">9. Severability</h6>
                <p className="text-medium text-lg">If any portion of this Agreement is deemed unenforceable, the remaining provisions will remain valid and binding.</p>

                <h6 className="text-lg !font-medium text-foreground">10. Governing Law</h6>
                <p className="text-medium text-lg">
                  This Agreement is governed by the laws of the State of Texas, USA, without regard to conflict of law principles. Any disputes must be resolved in the courts of
                  Texas, to which you consent to jurisdiction.
                </p>

                <h6 className="text-lg !font-medium text-foreground">11. Entire Agreement</h6>
                <p className="text-medium text-lg pb-8">
                  This Waiver & Acknowledgment, together with Dosevana’s Terms of Service and Privacy Policy, constitutes the entire agreement governing your purchase.
                </p>

                <h6 className="text-lg !font-medium text-foreground">BY CLICKING “I AGREE,” YOU CONFIRM THAT YOU HAVE READ, UNDERSTOOD, AND VOLUNTARILY ACCEPT ALL TERMS.</h6>
              </>
            ) : (
              ""
            )}

            <div className=" border-b border-foreground border-dashed mt-4"></div>
            <h6 className="text-lg !font-medium text-foreground mt-3">Terms & Conditions Acknowledgment</h6>

            <div className="text-medium text-lg space-y-7">
              <div>
                By proceeding with this purchase, I confirm that I have read, understood, and agree to the Terms & Conditions governing the use of all treatments and related
                products offered by <strong>Dosevana LLC</strong>, including GLP-1 medications, peptides, testosterone therapy, hair growth solutions, and sexual health products.
              </div>
              <div>
                I acknowledge that:
                <ul className="!list-disc list-inside">
                  <>
                    <li>I have completed the required medical quiz and intake form truthfully and accurately to the best of my knowledge.</li>
                    <li>
                      I understand that my eligibility for treatment is subject to review and approval by a licensed provider, and my order may be declined if I do not meet medical
                      requirements.
                    </li>
                    <li>
                      I agree that these products and treatments are not substitutes for comprehensive medical advice and will only be used under appropriate medical supervision
                      and guidance.
                    </li>
                    <li>I accept that treatment outcomes may vary based on individual health factors, and no specific results are guaranteed.</li>
                  </>
                </ul>
              </div>
            </div>

            <div className="mt-3">
              <h6 className="text-lg !font-medium text-foreground">Digital Signature</h6>
              {getValues("signature") && signatureImage ? (
                <div className="lg:w-1/2 h-[148px] border-2 border-dashed border-gray-300 rounded-lg p-2 relative mt-3">
                  <div className="p-5 inline-flex size-full">
                    <img
                      src={signatureImage}
                      alt="signature"
                      className="size-full"
                    />
                  </div>
                  <Button
                    onClick={clearSignature}
                    variant="transparent"
                    className="absolute bottom-2 right-2 text-blue-600 text-sm underline"
                  >
                    Change Signature
                  </Button>
                </div>
              ) : (
                <></>
              )}

              <div className={`lg:w-1/2 border-2 border-dashed border-gray-300 rounded-lg p-2 relative mt-3 ${getValues("signature") && signatureImage ? "hidden" : ""}`}>
                <SignatureCanvas
                  ref={(ref) => {
                    if (ref) sigCanvas.current = ref;
                  }}
                  penColor="#175BCC"
                  maxWidth={1.5}
                  onEnd={() => saveSignature()}
                  canvasProps={{
                    className: "w-full h-32 bg-white rounded-lg",
                    style: { touchAction: "none", "-ms-touch-action": "none" },
                  }}
                />
                <Button
                  onClick={clearSignature}
                  variant="transparent"
                  className="absolute bottom-2 right-2 text-blue-600 text-sm underline"
                >
                  Clear Signature
                </Button>
              </div>
              {errors?.signature?.message && (
                <Text
                  c="red"
                  size="sm"
                  className="mt-2"
                >
                  {errors?.signature?.message?.toString() || ""}
                </Text>
              )}

              <p className="text-lg mt-3">
                Full Name: <span className="text-foreground">{getFullName(patientData?.patient?.first_name, patientData?.patient?.last_name)}</span>
              </p>
              <p className="text-lg">
                Date: <span className="text-foreground">{formatDate(today)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Button
          color="grey.4"
          c="foreground"
          variant="outline"
          onClick={onBack}
          classNames={{
            root: "border-primary",
            label: "text-primary",
          }}
          className="md:w-[200px] w-[150px]"
        >
          Back
        </Button>
        <Button
          className="md:w-[200px] w-[150px]"
          onClick={handleSubmit(onNext)}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default Acknowledgement;
