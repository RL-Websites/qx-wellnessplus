import { IPublicPartnerPrescriptionDetails } from "@/common/api/models/interfaces/PartnerPatient.model";
import { formatDate } from "@/utils/date.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mantine/core";
import { useRef, useState } from "react";
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
  const {
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(stepLastSchema),
    defaultValues: {
      // agreeTerms: defaultValues?.agreeTerms || undefined,
      signature: defaultValues?.signature,
    },
  });

  const clearSignature = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    sigCanvas.current?.clear();
    // setSignature("");
    setValue("signature", "");
    // setValue("signature", "");
    // setError("signature", { message: "Signature is required" });
  };

  const saveSignature = () => {
    const base64Data = sigCanvas.current.toDataURL("image/png");
    setValue("signature", base64Data, { shouldValidate: true });
    // setSignature(base64Data);
    clearErrors("signature");
  };
  return (
    <>
      <h1 className="text-center text-foreground text-[90px]/none uppercase">Acknowledgement</h1>
      <div className="card-common bg-white">
        <div className="card-body">
          <div className="space-y-7">
            {hasOthers ? (
              <>
                <h6 className="text-lg !font-medium text-foreground">HEALTH & WELLNESS PLATFORM TERMS AND CONDITIONS</h6>

                <p className="text-medium text-lg">
                  This document governs your use of the platform and services provided by this Health & Wellness Company (the "Company", “We”, “Us”, or “Our”). By accessing,
                  registering for, or using any services or content provided through our platform, including telehealth, wellness programs, skincare, weight loss solutions, or
                  other related services (the “Services”), you agree to be bound by these Terms and Conditions (the “Agreement”).
                </p>

                <div>
                  <h6 className="text-lg !font-medium text-foreground">Emergency Disclaimer</h6>
                  <h6 className="text-lg !font-medium text-foreground">NOT FOR EMERGENCY USE</h6>
                </div>
                <p className="text-medium text-lg">
                  The Services are not intended for emergency medical situations. If you are experiencing a medical emergency, call 911 or your local emergency number immediately.
                </p>

                <h6 className="text-lg !font-medium text-foreground">Acceptance of Terms</h6>

                <p className="text-medium text-lg">
                  By clicking "I Agree", creating an account, or using the Services, you confirm that you have read, understood, and accepted this Agreement. If you are accepting
                  on behalf of another individual (e.g., as a parent or legal guardian), you certify that you are authorized to do so.
                </p>
                <h6 className="text-lg !font-medium text-foreground">Binding Arbitration Agreement</h6>

                <p className="text-medium text-lg">
                  You agree that any disputes with the Company, its agents, affiliates, or healthcare providers will be resolved through binding, individual arbitration and not via
                  jury trial or class action, as described below under “Arbitration and Dispute Resolution”.
                </p>
                <h6 className="text-lg !font-medium text-foreground">Changes to These Terms</h6>

                <p className="text-medium text-lg">
                  We reserve the right to modify or update this Agreement at any time, with or without notice, as required by law or business necessity. Continued use of the
                  Services after changes are posted constitutes your acceptance.
                </p>
                <h6 className="text-lg !font-medium text-foreground">Use by Minors</h6>

                <p className="text-medium text-lg">
                  The Services are not intended for users under 18 years of age. Individuals under 18 may only use the platform under the direct supervision of a parent or legal
                  guardian.
                </p>
                <h6 className="text-lg !font-medium text-foreground">Use by Minors</h6>

                <p className="text-medium text-lg">
                  The Services are not intended for users under 18 years of age. Individuals under 18 may only use the platform under the direct supervision of a parent or legal
                  guardian.
                </p>
                <h6 className="text-lg !font-medium text-foreground">Services Overview</h6>

                <div className="text-medium text-lg">
                  We facilitate access to certain health and wellness products and services, including but not limited to:
                  <ul className="!list-disc list-inside">
                    <li>Telehealth consultations</li>
                    <li>Prescription medications via licensed pharmacies</li>
                    <li>Skincare and weight loss products</li>
                    <li>Diagnostic testing via partner labs</li>
                  </ul>
                  Some services may be provided by independent third-party providers (the “Providers”), pharmacies (“Pharmacies”), and laboratories (“Labs”).
                </div>

                <h6 className="text-lg !font-medium text-foreground">No Medical Relationship with Company</h6>

                <p className="text-medium text-lg">
                  The Company itself does not practice medicine or provide clinical services. All clinical care is provided by third-party licensed medical professionals. You
                  acknowledge that you are not establishing a patient-provider relationship with the Company, but may do so with a licensed Provider via the platform.
                </p>
                <h6 className="text-lg !font-medium text-foreground">No Pharmacy Relationship with Company</h6>

                <p className="text-medium text-lg">
                  We are not a pharmacy and do not control pharmacy operations. Any medications prescribed will be filled by independent Pharmacies. You may be required to complete
                  a medical intake and establish medical necessity before a prescription is issued or filled.
                </p>
                <h6 className="text-lg !font-medium text-foreground">Consent to Telehealth</h6>

                <p className="text-medium text-lg">
                  You consent to receive healthcare via telehealth, which uses electronic communications to deliver medical care remotely. Telehealth is not suitable for all
                  medical conditions. You accept the risks and limitations associated with this form of care.
                </p>
                <h6 className="text-lg !font-medium text-foreground">Consent to Communications</h6>

                <p className="text-medium text-lg">
                  You agree to receive communications related to your health and services via SMS, email, phone, or other messaging channels. These communications may include
                  appointment reminders, treatment updates, or marketing content.
                </p>
                <h6 className="text-lg !font-medium text-foreground">Consent to Cash-Based Services</h6>

                <p className="text-medium text-lg">
                  The Company does not participate in Medicare, Medicaid, or other government insurance programs. All services are provided on a self-pay basis. You are fully
                  responsible for payment and agree not to submit claims to any third-party payer for reimbursement.
                </p>
                <h6 className="text-lg !font-medium text-foreground">Subscription Billing</h6>

                <p className="text-medium text-lg">
                  Certain services may be billed on a recurring subscription basis. Your credit/debit card will be charged automatically unless you cancel in accordance with our
                  cancellation policy. Any medication already shipped or dispensed will be billed in full.
                </p>

                <h6 className="text-lg !font-medium text-foreground">Three-Month Program Terms (if applicable)</h6>

                <div className="text-medium text-lg">
                  If enrolled in a 3-month program:
                  <ul className="!list-disc list-inside">
                    <li>Medication is dispensed monthly or all at once based on medical review.</li>
                    <li>You are financially responsible for the full cost of medications shipped.</li>
                    <li>Failure to pay will result in cancellation and referral to collections.</li>
                  </ul>
                </div>

                <h6 className="text-lg !font-medium text-foreground">Prescription Requirements</h6>

                <p className="text-medium text-lg">
                  Prescription products will only be dispensed upon completion of a medical intake, consultation with a licensed provider, and confirmation of medical necessity.
                  Payment does not guarantee a prescription.
                </p>

                <h6 className="text-lg !font-medium text-foreground">Risk Acknowledgment</h6>

                <p className="text-medium text-lg">
                  You agree to read all product information and disclosures provided by the Company, Providers, or pharmacies, including information published by the FDA. Use of
                  any treatment is at your own risk.
                </p>

                <h6 className="text-lg !font-medium text-foreground">Arbitration and Dispute Resolution</h6>

                <p className="text-medium text-lg">
                  Disputes will first be addressed through mediation administered by the American Arbitration Association. If unresolved, binding arbitration will follow, and
                  judgment may be entered in any court with jurisdiction. Class actions and group arbitration are waived.
                </p>

                <h6 className="text-lg !font-medium text-foreground">Indemnification</h6>

                <p className="text-medium text-lg">
                  You agree to indemnify and hold harmless the Company and its affiliates from any claims, liabilities, losses, or expenses arising from your use of the Services or
                  violation of this Agreement.
                </p>

                <h6 className="text-lg !font-medium text-foreground">Severability</h6>

                <p className="text-medium text-lg">If any part of this Agreement is deemed invalid or unenforceable, the remainder will remain in full force and effect.</p>

                <h6 className="text-lg !font-medium text-foreground">Assignment</h6>

                <p className="text-medium text-lg">You may not transfer or assign your rights under this Agreement. The Company may assign this Agreement at its discretion.</p>

                <h6 className="text-lg !font-medium text-foreground">Governing Law</h6>

                <p className="text-medium text-lg pb-8">
                  You may not transfer or assign your rights under this Agreement. The Company may assign this Agreement at its discretion.
                </p>
              </>
            ) : (
              <></>
            )}

            {hasPeptides ? (
              <>
                <h6 className="text-lg !font-medium text-foreground">WellnessPlus - Research Peptide Purchase: Waiver and Acknowledgment</h6>

                <h6 className="text-lg !font-medium text-foreground">
                  PLEASE READ THIS DOCUMENT CAREFULLY AND IN ITS ENTIRETY BEFORE PROCEEDING WITH YOUR PURCHASE. THIS IS A LEGALLY BINDING AGREEMENT.
                </h6>
                <p className="text-medium text-lg">
                  By clicking "I Agree" or by proceeding with your purchase, you, the "Purchaser," acknowledge that you have read, understood, and agree to be bound by all terms
                  and conditions set forth in this Waiver and Acknowledgment.
                </p>

                <h6 className="text-lg !font-medium text-foreground">1. Nature of Product - Research Use Only:</h6>
                <p className="text-medium text-lg">
                  The product(s) you are purchasing from [Your Website Name] (hereinafter "the Company") are{" "}
                  <strong>research-grade peptides intended EXCLUSIVELY FOR LABORATORY RESEARCH PURPOSES AND IN VITRO (NON-HUMAN/NON-ANIMAL) USE ONLY.</strong> These products are{" "}
                  <strong>NOT</strong> approved by the Food and Drug Administration (FDA) for human or animal consumption, therapeutic use, diagnostic use, or any other
                  application. They are NOT drugs, medications, or dietary supplements.
                </p>
                <h6 className="text-lg !font-medium text-foreground">2. Doctor Use – Professional Oversight Acknowledgment:</h6>
                <p className="text-medium text-lg">
                  You acknowledge and affirm that the phrase "doctor use" in the product description indicates that these peptides are intended for use under the direct supervision
                  and guidance of a qualified and licensed medical professional for research purposes within a controlled, professional setting. This terminology does not imply
                  that the product is a medication for human treatment, but rather underscores the need for expert handling and understanding of its properties.{" "}
                  <strong>
                    You are solely responsible for ensuring that any individual who handles or utilizes these products possesses the necessary medical or scientific qualifications
                    and licenses.
                  </strong>
                </p>

                <h6 className="text-lg !font-medium text-foreground">3. No Medical Advice; No Therapeutic Claims:</h6>
                <p className="text-medium text-lg">
                  The Company, its owners, employees, and affiliates <strong>DO NOT</strong> provide medical advice, diagnosis, or treatment. Any information provided on this
                  website, including product descriptions, articles, or testimonials, is for informational purposes only and is <strong>NOT</strong> intended as a substitute for
                  professional medical advice, diagnosis, or treatment.{" "}
                  <strong>
                    No claims are made or implied regarding the safety, efficacy, or suitability of these products for human or animal use, nor for the treatment, prevention, or
                    cure of any disease or medical condition.
                  </strong>
                </p>

                <h6 className="text-lg !font-medium text-foreground">4. Assumption of Risk:</h6>
                <p className="text-medium text-lg">
                  You understand and acknowledge that the use of research-grade chemicals and peptides carries inherent risks, including but not limited to, potential for adverse
                  reactions, unknown effects, and the need for specialized handling and disposal. You voluntarily and knowingly assume all risks associated with the possession,
                  handling, and use of the purchased product(s), including any and all risks of injury, illness, or damage, whether foreseen or unforeseen, arising from or related
                  to the product(s).
                </p>

                <h6 className="text-lg !font-medium text-foreground">5. Indemnification and Hold Harmless:</h6>
                <p className="text-medium text-lg">
                  To the fullest extent permitted by law, you agree to indemnify, defend, and hold harmless the Company, its officers, directors, employees, agents, distributors,
                  and affiliates from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or in
                  any way connected with: a. Your purchase, possession, handling, or use of the product(s). b. Your breach of any of the terms and conditions of this Waiver and
                  Acknowledgment. c. Your failure to comply with any applicable laws, regulations, or industry standards related to the research and handling of the product(s). d.
                  Any third-party claims alleging injury, damage, or loss resulting from your actions or omissions related to the product(s).
                </p>

                <h6 className="text-lg !font-medium text-foreground">6. Release of Liability:</h6>
                <p className="text-medium text-lg">
                  You hereby irrevocably and unconditionally release, waive, and forever discharge the Company, its officers, directors, employees, agents, distributors, and
                  affiliates from any and all claims, demands, liabilities, actions, causes of action, and expenses of any nature whatsoever, whether in law or equity, known or
                  unknown, foreseen or unforeseen, which you now have or may hereafter have, arising from or in any way related to your purchase, possession, handling, or use of
                  the product(s).
                </p>

                <h6 className="text-lg !font-medium text-foreground">7. Compliance with Laws and Regulations:</h6>
                <p className="text-medium text-lg">
                  You represent and warrant that you are at least 18 years of age (or the age of majority in your jurisdiction) and that you will comply with all applicable local,
                  state, federal, and international laws, regulations, and ordinances regarding the purchase, possession, handling, and use of these research products. You are
                  solely responsible for ensuring that your activities involving these products are conducted in a legal and safe manner.
                </p>

                <h6 className="text-lg !font-medium text-foreground">8. No Resale for Unauthorized Purposes:</h6>
                <p className="text-medium text-lg">
                  You agree that you will <strong>NOT</strong> resell, distribute, or transfer these products to any third party for purposes other than legitimate, authorized
                  laboratory research, and specifically NOT for human consumption, therapeutic use, or any other use not expressly permitted by law and this agreement.
                </p>

                <h6 className="text-lg !font-medium text-foreground">9. Severability:</h6>
                <p className="text-medium text-lg">
                  If any provision of this Waiver and Acknowledgment is found to be invalid, illegal, or unenforceable, the remaining provisions shall remain in full force and
                  effect.
                </p>

                <h6 className="text-lg !font-medium text-foreground">10. Governing Law and Jurisdiction:</h6>
                <p className="text-medium text-lg">
                  This Waiver and Acknowledgment shall be governed by and construed in accordance with the laws of the State of [Your State, e.g., Delaware], without regard to its
                  conflict of laws principles. Any dispute arising out of or relating to this Waiver and Acknowledgment or your purchase shall be exclusively brought in the federal
                  or state courts located in [Your County/City, e.g., Wilmington, Delaware], and you hereby consent to the personal jurisdiction of such courts.
                </p>

                <h6 className="text-lg !font-medium text-foreground">11. Entire Agreement:</h6>
                <p className="text-medium text-lg">
                  This Waiver and Acknowledgment, together with the Company's Terms of Service and Privacy Policy, constitutes the entire agreement between you and the Company
                  regarding your purchase of these research peptides and supersedes all prior or contemporaneous understandings and agreements, whether written or oral.
                </p>

                <h6 className="text-lg !font-medium text-foreground">
                  BY CLICKING "I AGREE" BELOW, YOU ARE CONFIRMING THAT YOU HAVE READ, UNDERSTOOD, AND VOLUNTARILY AGREE TO ALL OF THE TERMS AND CONDITIONS SET FORTH IN THIS WAIVER
                  AND ACKNOWLEDGMENT.
                </h6>
              </>
            ) : (
              ""
            )}

            <div className=" border-b border-foreground border-dashed mt-4"></div>
            <h6 className="text-lg !font-medium text-foreground mt-3">Terms & Conditions Acknowledgment</h6>

            <div className="text-medium text-lg space-y-7">
              <div>
                By proceeding with this purchase, I confirm that I have read, understood, and agree to the Terms & Conditions governing the use of GLP-1 medications and related
                products offered by Thrivewell.
              </div>
              <div>
                I acknowledge that:
                <ul className="!list-disc list-inside">
                  <li>I have completed the required medical quiz and intake form truthfully to the best of my knowledge.</li>
                  <li>I understand that my treatment is subject to provider review and may be declined based on medical eligibility.</li>
                  <li>I agree that these products are not a replacement for professional medical advice and will be used under appropriate guidance.</li>
                </ul>
              </div>
            </div>

            <div className="mt-3">
              <h6 className="text-lg !font-medium text-foreground">Digital Signature</h6>
              <div className="lg:w-1/2 border-2 border-dashed border-gray-300 rounded-lg p-2 relative mt-3">
                <SignatureCanvas
                  ref={sigCanvas}
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
              <p className="text-lg mt-3">
                Full Name: <span className="text-foreground">{patientData?.patient?.name}</span>
              </p>
              <p className="text-lg">
                Date: <span className="text-foreground">{formatDate(today)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <div className="flex gap-3 ms-auto">
          <Button
            w={256}
            onClick={handleSubmit(onNext)}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default Acknowledgement;
