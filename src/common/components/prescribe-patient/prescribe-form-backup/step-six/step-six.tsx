import { formatDate } from "@/utils/date.utils";
import { formatPhoneNumber, getLocName } from "@/utils/helper.utils";
import { Anchor, Button, Checkbox, Table } from "@mantine/core";
import { useEffect, useState } from "react";

interface StepSixProps {
  setCurrentStep: (step: number) => void;
  handleBack: () => void;
  handleSubmit: (data: any) => void;
  formData: any;
}

const StepSix = ({ setCurrentStep, handleBack, handleSubmit, formData }: StepSixProps) => {
  const [agreed, setAgreed] = useState(false);
  const [termsError, setTermsError] = useState("");

  useEffect(() => {
    if (formData.agreed !== undefined) {
      setAgreed(formData.agreed);
    }
  }, [formData]);

  const handleNext = () => {
    if (!agreed) {
      setTermsError("You must agree to the terms and conditions");
      return;
    }
    handleSubmit({ agreed: agreed });
  };
  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="card p-6">
          <div className="card-title with-border flex items-center justify-between">
            <h6 className="text-foreground">Patient Information</h6>
            <button
              type="button"
              className="text-fs-lg text-primary !font-bold ms-auto"
              onClick={() => setCurrentStep(0)}
            >
              Edit
            </button>
          </div>
          <Table
            withRowBorders={false}
            className="info-table info-table-md"
          >
            <Table.Tbody>
              <Table.Tr>
                <Table.Th>First Name:</Table.Th>
                <Table.Td>{formData?.patient?.first_name || ""}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Last Name:</Table.Th>
                <Table.Td>{formData?.patient?.last_name || ""}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Date of Birth:</Table.Th>
                <Table.Td>{formData?.patient?.dob ? formatDate(formData?.patient?.dob, "MMM DD, YYYY") : ""}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Address:</Table.Th>
                <Table.Td>{formData?.patient?.address1}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Address(Cont):</Table.Th>
                <Table.Td>{formData?.patient?.address2}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>State:</Table.Th>
                <Table.Td>{formData?.patient?.state ? getLocName(formData?.patient?.state) : ""}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>City:</Table.Th>
                <Table.Td>{getLocName(formData.patient?.city)}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Zip Code:</Table.Th>
                <Table.Td>{formData?.patient?.zipcode}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Email:</Table.Th>
                <Table.Td>{formData?.patient?.email}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Cell Phone (Digits Only):</Table.Th>
                <Table.Td>{formData?.patient?.cell_phone ? formatPhoneNumber(formData?.patient?.cell_phone) : ""}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Gender:</Table.Th>
                <Table.Td className="capitalize">{formData?.patient?.gender || ""}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
        <div className="card p-6">
          <div className="card-title with-border flex items-center justify-between">
            <h6 className="text-foreground">Medication Information</h6>
            <button
              type="button"
              className="text-fs-lg text-primary !font-bold ms-auto"
              onClick={() => setCurrentStep(1)}
            >
              Edit
            </button>
          </div>
          <Table
            withRowBorders={false}
            className="info-table info-table-md"
          >
            <Table.Tbody>
              <Table.Tr>
                <Table.Th>Medicine Selected:</Table.Th>
                <Table.Td>{formData?.medication_data?.drug_name}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
        {/* <div className="card p-6">
          <div className="card-title with-border flex items-center justify-between">
            <h6 className="text-foreground">Payment Method</h6>
            <button
              type="button"
              className="text-fs-lg text-primary !font-bold ms-auto"
              onClick={() => setCurrentStep(0)}
            >
              Edit
            </button>
          </div>
          <Table
            withRowBorders={false}
            className="info-table info-table-sm"
          >
            <Table.Tbody>
              <Table.Tr>
                <Table.Th>Payor:</Table.Th>
                <Table.Td>{"Clinic"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Payment Method:</Table.Th>
                <Table.Td>{"Visa"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Card Number:</Table.Th>
                <Table.Td>{"****1390"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Card Holder Name:</Table.Th>
                <Table.Td>{"John Smith"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Card Email:</Table.Th>
                <Table.Td>{"johnsmith@gmail.com"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Card Expiration Date:</Table.Th>
                <Table.Td>{formatDate("03-25-1025", "MM-DD-YYYY")}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div> */}
        {/* <div className="card p-6">
          <div className="card-title with-border flex items-center justify-between">
            <h6 className="text-foreground">Billing Info</h6>
            <button
              type="button"
              className="text-fs-lg text-primary !font-bold ms-auto"
              onClick={() => setCurrentStep(0)}
            >
              Edit
            </button>
          </div>
          <Table
            withRowBorders={false}
            className="info-table info-table-sm"
          >
            <Table.Tbody>
              <Table.Tr>
                <Table.Th>Name:</Table.Th>
                <Table.Td>{"Alen Johan Christenson"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Address:</Table.Th>
                <Table.Td>{"3301 Southern Blvd SE"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>City:</Table.Th>
                <Table.Td>{"New York"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Zip Code:</Table.Th>
                <Table.Td>{"88310"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Email Address:</Table.Th>
                <Table.Td>{"woodwarden,street#666"}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
        <div className="card p-6">
          <div className="card-title with-border flex items-center justify-between">
            <h6 className="text-foreground">Shipping Info</h6>
            <button
              type="button"
              className="text-fs-lg text-primary !font-bold ms-auto"
              onClick={() => setCurrentStep(0)}
            >
              Edit
            </button>
          </div>
          <Table
            withRowBorders={false}
            className="info-table info-table-sm"
          >
            <Table.Tbody>
              <Table.Tr>
                <Table.Th>Name:</Table.Th>
                <Table.Td>{"Alen Johan Christenson"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Address:</Table.Th>
                <Table.Td>{"3301 Southern Blvd SE"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>City:</Table.Th>
                <Table.Td>{"New York"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Zip Code:</Table.Th>
                <Table.Td>{"88310"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Email Address:</Table.Th>
                <Table.Td>{"woodwarden,street#666"}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div> */}
        {/* <div className="card p-6">
          <div className="card-title with-border flex items-center justify-between">
            <h6 className="text-foreground">Prescriber</h6>
            <button
              type="button"
              className="text-fs-lg text-primary !font-bold ms-auto"
              onClick={() => setCurrentStep(0)}
            >
              Edit
            </button>
          </div>
          <Table
            withRowBorders={false}
            className="info-table info-table-sm"
          >
            <Table.Tbody>
              <Table.Tr>
                <Table.Th>Medicine Name:</Table.Th>
                <Table.Td>{"Olympus Max Male (Bremelanotide/Oxytocin/Tadalafil)"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Brand Name:</Table.Th>
                <Table.Td>{"Mango"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Form:</Table.Th>
                <Table.Td>{"Tablet"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Dosage Form:</Table.Th>
                <Table.Td>{"Oral"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Type:</Table.Th>
                <Table.Td>{"Mini Troche"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Schedule</Table.Th>
                <Table.Td>{"L"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Signature Type::</Table.Th>
                <Table.Td>{"Controlled"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Strength:</Table.Th>
                <Table.Td>{"20 mg"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Refill:</Table.Th>
                <Table.Td>{"5"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>First Auto-refill Date After:</Table.Th>
                <Table.Td>{"14 days"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Quantity:</Table.Th>
                <Table.Td>{8}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Days Supply:</Table.Th>
                <Table.Td>{"14"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Side Effects:</Table.Th>
                <Table.Td>{"Fever"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Dispension:</Table.Th>
                <Table.Td>{"Therapeutically equivalent generic drug may be substituted"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Clinical Difference Statement:</Table.Th>
                <Table.Td>{"Better delivery of medication"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Direction:</Table.Th>
                <Table.Td>{"Dissolve 1/4 Troche under tongue every morning."}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Instruction:</Table.Th>
                <Table.Td>{"Can take 1/2 torche for Erection support."}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Diagnosis:</Table.Th>
                <Table.Td>{"Lorem ipsum dolor"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Intake Form:</Table.Th>
                <Table.Td>
                  <Button
                    variant="transparent"
                    p={0}
                    classNames={{
                      label: "underline text-primary font-normal",
                    }}
                  >
                    View
                  </Button>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Soap Note:</Table.Th>
                <Table.Td>
                  <Button
                    variant="transparent"
                    p={0}
                    classNames={{
                      label: "underline text-primary font-normal",
                    }}
                  >
                    View
                  </Button>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div> */}

        <Checkbox
          label={
            <>
              By selecting this you are confirming that you have read, understood and agree to the{" "}
              <Anchor
                href="https://salesplusrx.com/terms-and-conditions"
                target="_blank"
                inherit
              >
                terms and conditions.
              </Anchor>
            </>
          }
          checked={agreed}
          onChange={(event) => {
            setAgreed(event.currentTarget.checked);
          }}
        />
        {termsError ? <p className="text-danger text-fs-sm -mt-3">{termsError}</p> : ""}
      </div>
      <div className="flex justify-between mt-6">
        <div className="flex gap-6 ms-auto">
          <Button
            px={0}
            variant="transparent"
            onClick={handleBack}
            classNames={{
              label: "underline font-medium",
            }}
          >
            Back
          </Button>
          <Button
            w={256}
            type="submit"
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default StepSix;
