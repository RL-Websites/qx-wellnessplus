import { IPublicPartnerPrescriptionDetails } from "@/common/api/models/interfaces/PartnerPatient.model";
import { formatDate } from "@/utils/date.utils";
import { Button, ScrollArea } from "@mantine/core";
import { useState } from "react";

// const stepLast2Schema = yup.object({
//   acknowledgement: yup.boolean().oneOf([true], "Please accept the acknowledgement.").required("Please accept the acknowledgement."),
// });

// type stepLast2SchemaType = yup.InferType<typeof stepLast2Schema>;

interface StepCompProps {
  onNext: (data: any) => void;
  onBack: () => void;
  defaultValues?: any;
  isLoading?: boolean;
  patientData?: IPublicPartnerPrescriptionDetails;
}
const StepLast2 = ({ onNext, onBack, defaultValues, patientData, isLoading = false }: StepCompProps) => {
  // const acknowledgement = watch("acknowledgement");

  const [today, setToday] = useState(new Date());

  return (
    <>
      <div className="card">
        <div className="card-title with-border">Acknowledgement</div>
        <div className="card-body pt-9">
          <ScrollArea
            scrollbars="y"
            type="always"
            offsetScrollbars="x"
            scrollbarSize={10}
            h={500}
            classNames={{
              viewport: "pr-2 [&>div]:!flex [&>div]:flex-col [&>div]:gap-7",
            }}
          >
            <h6 className="text-lg !font-medium text-foreground">HEALTH & WELLNESS PLATFORM TERMS AND CONDITIONS</h6>

            <p className="text-medium text-lg">
              This document governs your use of the platform and services provided by this Health & Wellness Company (the "Company", “We”, “Us”, or “Our”). By accessing,
              registering for, or using any services or content provided through our platform, including telehealth, wellness programs, skincare, weight loss solutions, or other
              related services (the “Services”), you agree to be bound by these Terms and Conditions (the “Agreement”).
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
              By clicking "I Agree", creating an account, or using the Services, you confirm that you have read, understood, and accepted this Agreement. If you are accepting on
              behalf of another individual (e.g., as a parent or legal guardian), you certify that you are authorized to do so.
            </p>
            <h6 className="text-lg !font-medium text-foreground">Binding Arbitration Agreement</h6>

            <p className="text-medium text-lg">
              You agree that any disputes with the Company, its agents, affiliates, or healthcare providers will be resolved through binding, individual arbitration and not via
              jury trial or class action, as described below under “Arbitration and Dispute Resolution”.
            </p>
            <h6 className="text-lg !font-medium text-foreground">Changes to These Terms</h6>

            <p className="text-medium text-lg">
              We reserve the right to modify or update this Agreement at any time, with or without notice, as required by law or business necessity. Continued use of the Services
              after changes are posted constitutes your acceptance.
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
              We are not a pharmacy and do not control pharmacy operations. Any medications prescribed will be filled by independent Pharmacies. You may be required to complete a
              medical intake and establish medical necessity before a prescription is issued or filled.
            </p>
            <h6 className="text-lg !font-medium text-foreground">Consent to Telehealth</h6>

            <p className="text-medium text-lg">
              You consent to receive healthcare via telehealth, which uses electronic communications to deliver medical care remotely. Telehealth is not suitable for all medical
              conditions. You accept the risks and limitations associated with this form of care.
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
              You agree to read all product information and disclosures provided by the Company, Providers, or pharmacies, including information published by the FDA. Use of any
              treatment is at your own risk.
            </p>

            <h6 className="text-lg !font-medium text-foreground">Arbitration and Dispute Resolution</h6>

            <p className="text-medium text-lg">
              Disputes will first be addressed through mediation administered by the American Arbitration Association. If unresolved, binding arbitration will follow, and judgment
              may be entered in any court with jurisdiction. Class actions and group arbitration are waived.
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

            <p className="text-medium text-lg pb-8 border-b border-foreground border-dashed">
              You may not transfer or assign your rights under this Agreement. The Company may assign this Agreement at its discretion.
            </p>

            <h6 className="text-lg !font-medium text-foreground">Terms & Conditions Acknowledgment</h6>

            <div className="text-medium text-lg">
              By proceeding with this purchase, I confirm that I have read, understood, and agree to the Terms & Conditions governing the use of GLP-1 medications and related
              products offered by Thrivewell. I acknowledge that:
              <ul className="!list-disc list-inside">
                <li>I have completed the required medical quiz and intake form truthfully to the best of my knowledge.</li>
                <li>I understand that my treatment is subject to provider review and may be declined based on medical eligibility.</li>
                <li>I agree that these products are not a replacement for professional medical advice and will be used under appropriate guidance.</li>
              </ul>
            </div>

            <div>
              <p className="text-lg">
                Customer Full Name: <span className="text-foreground">{patientData?.patient?.name}</span>
              </p>
              <p className="text-lg">
                Date: <span className="text-foreground">{formatDate(today)}</span>
              </p>
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="bg-tag-bg py-5 px-6 rounded-xl mt-4">
        <p className="text-fs-md text-tag-bg-deep text-center">
          You need to accept the Terms & Conditions to continue. The service won't be available unless you click 'I agree to the terms & conditions'.
        </p>
      </div>

      <div className="flex justify-between mt-6">
        <div className="flex gap-6 sm:ms-auto sm:mx-0 mx-auto">
          <Button
            px={0}
            variant="outline"
            onClick={onBack}
            className="sm:w-[256px] w-[120px]"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="px-4"
            onClick={onNext}
            loading={isLoading}
          >
            I agree to the terms & conditions
          </Button>
        </div>
      </div>
    </>
  );
};

export default StepLast2;
