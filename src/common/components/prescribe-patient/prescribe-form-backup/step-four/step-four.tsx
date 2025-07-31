import IntakeForm from "@/common/components/patient/components/IntakeForm";
import SoapNote from "@/common/components/patient/components/SoapNote";
import { Button, CheckIcon, Radio, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";

interface StepFourProps {
  handleBack: () => void;
  handleSubmit: (data) => void;
  formData: any;
}

function StepFour({ handleBack, handleSubmit, formData }: StepFourProps) {
  const [openSoapNote, setSoapNoteHandler] = useDisclosure();
  const [openIntakeForm, setOpenIntakeForm] = useDisclosure();
  const [directionValue, setDirectionValue] = useState<string | null>("prePopulated");
  const [statementValue, setStatementValue] = useState<string | null>("prePopulated");
  const [instructionValue, setInstructionValue] = useState<string | null>("prePopulated");
  const [dispensationValue, setDispensationValue] = useState<string | null>("prePopulated");
  const [sideEffectValue, setSideEffectValue] = useState<string | null>("prePopulated");

  const [directionPrevData, setDirectionPrevData] = useState<string>(formData?.medication_data?.directions ? formData?.medication_data?.directions : "None");
  const [directionManualData, setDirectionManualData] = useState<string>();
  const [statementManualData, setStatementManualData] = useState<string>();
  const [statementPrevData, setStatementPrevData] = useState<string>(
    formData?.medication_data?.clinical_different_statement ? formData?.medication_data?.clinical_different_statement : "None"
  );
  const [instructionPrevData, setInstructionPrevData] = useState<string>(formData?.medication_data?.add_instruction ? formData?.medication_data?.add_instruction : "None");
  const [instructionManualData, setInstructionManualData] = useState<string>();
  const [dispensationManualData, setDispensationManualData] = useState<string>();
  const [dispensationPrevData, setDispensationPrevData] = useState<string>(formData?.medication_data?.dispensation ? formData?.medication_data?.dispensation : "None");
  const [sideEffectPrevData, setSideEffectPrevData] = useState<string>(formData?.medication_data?.side_effects ? formData?.medication_data?.side_effects : "None");
  const [sideEffectManualData, setSideEffectManualData] = useState<string>();

  const isDirectionPrePopulated = directionValue === "prePopulated";
  const isStatementPrePopulated = statementValue === "prePopulated";
  const isInstructionPrePopulated = instructionValue === "prePopulated";
  const isDispensationPrePopulated = dispensationValue === "prePopulated";
  const isSideEffectPrePopulated = sideEffectValue === "prePopulated";

  // const actions = {
  //   icon: <i className="icon-cross1 text-base"></i>,
  //   onClick: () => {},
  // };

  const handleNext = () => {
    const data = {
      direction: isDirectionPrePopulated ? directionPrevData : directionManualData,
      statement: isStatementPrePopulated ? statementPrevData : statementManualData,
      instruction: isInstructionPrePopulated ? instructionPrevData : instructionManualData,
      dispensation: isDispensationPrePopulated ? dispensationPrevData : dispensationManualData,
      sideEffect: isSideEffectPrePopulated ? sideEffectPrevData : sideEffectManualData,
    };
    handleSubmit(data);
  };

  useEffect(() => {
    if (formData?.direction != undefined && formData?.direction != directionPrevData) {
      setDirectionManualData(formData?.direction);
      setDirectionValue("manualEntry");
    }
    if (formData?.statement != undefined && formData?.statement != statementPrevData) {
      setStatementManualData(formData?.statement);
      setStatementValue("manualEntry");
    }
    if (formData?.instruction != undefined && formData?.instruction != instructionPrevData) {
      setInstructionManualData(formData?.instruction);
      setInstructionValue("manualEntry");
    }
    if (formData?.dispensation != undefined && formData?.dispensation != dispensationPrevData) {
      setDispensationManualData(formData?.dispensation);
      setDispensationValue("manualEntry");
    }
    if (formData?.sideEffect != undefined && formData?.sideEffect != sideEffectPrevData) {
      setSideEffectManualData(formData?.sideEffect);
      setSideEffectValue("manualEntry");
    }

    // formData?.direction == directionPrevData ? " " : setDirectionManualData(formData?.direction);
    // formData?.statement == statementPrevData ? " " : setStatementManualData(formData?.statement);
    // formData?.instruction == instructionPrevData ? " " : setInstructionManualData(formData?.instruction);
    // formData?.dispensation == dispensationPrevData ? " " : setDispensationManualData(formData?.dispensation);
    // formData?.sideEffect == sideEffectPrevData ? " " : setSideEffectManualData(formData?.sideEffect);
  }, [formData]);

  return (
    <>
      <div className="card p-6 space-y-8 divide-y">
        <div>
          <h6 className="text-foreground pb-5">Direction:</h6>
          <Radio.Group
            value={directionValue}
            onChange={setDirectionValue}
          >
            <div className="flex items-center gap-[70px]">
              <Radio.Card
                value="prePopulated"
                className="relative border-0 w-[453px]"
                radius="md"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex gap-2 items-center">
                    <Radio.Indicator
                      icon={CheckIcon}
                      size="lg"
                      color="green.5"
                    />
                    <h6>Pre-populated</h6>
                  </div>
                  <Textarea
                    readOnly={isDirectionPrePopulated}
                    value={directionPrevData}
                    classNames={{
                      input:
                        directionValue == "prePopulated"
                          ? "!bg-primary-light !border-primary !text-3xl !p-5 !text-foreground"
                          : "!bg-white !border-grey-low !text-3xl !p-5 !text-foreground",
                    }}
                    autosize
                    minRows={2}
                    onChange={(e) => setDirectionPrevData(e.target.value)}
                  />
                </div>
              </Radio.Card>
              <h5 className="pt-4">OR</h5>
              <Radio.Card
                value="manualEntry"
                className="relative border-0 w-[453px]"
                radius="md"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex gap-2 items-center">
                    <Radio.Indicator
                      icon={CheckIcon}
                      size="lg"
                      color="green.5"
                    />
                    <h6>Enter Text Manually (max 150 letters)</h6>
                  </div>
                  <Textarea
                    readOnly={isDirectionPrePopulated}
                    classNames={{
                      input:
                        directionValue == "prePopulated"
                          ? "!bg-white !border-grey-low !text-3xl !p-5 !text-foreground focus:!border-primary"
                          : "!bg-primary-light !border-primary !text-3xl !p-5 !text-foreground focus:!border-primary",
                    }}
                    autosize
                    minRows={2}
                    value={directionManualData}
                    onChange={(e) => setDirectionManualData(e.target.value)}
                  />
                </div>
              </Radio.Card>
            </div>
          </Radio.Group>
        </div>
        <div>
          <h6 className="text-foreground py-5">Clinical Difference Statement:</h6>
          <Radio.Group
            value={statementValue}
            onChange={setStatementValue}
          >
            <div className="flex items-center gap-[70px]">
              <Radio.Card
                value="prePopulated"
                className="relative border-0 w-[453px]"
                radius="md"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex gap-2 items-center">
                    <Radio.Indicator
                      icon={CheckIcon}
                      size="lg"
                      color="green.5"
                    />
                    <h6>Pre-populated</h6>
                  </div>
                  <Textarea
                    readOnly={isStatementPrePopulated}
                    value={statementPrevData}
                    classNames={{
                      input:
                        statementValue == "prePopulated"
                          ? "!bg-primary-light !border-primary !text-3xl !p-5 !text-foreground"
                          : "!bg-white !border-grey-low !text-3xl !p-5 !text-foreground",
                    }}
                    autosize
                    minRows={2}
                    maxRows={2}
                    onChange={(e) => setStatementPrevData(e.target.value)}
                  />
                </div>
              </Radio.Card>
              <h5 className="pt-4">OR</h5>
              <Radio.Card
                value="manualEntry"
                className="relative border-0 w-[453px]"
                radius="md"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex gap-2 items-center">
                    <Radio.Indicator
                      icon={CheckIcon}
                      size="lg"
                      color="green.5"
                    />
                    <h6>Enter Text Manually (max 150 letters)</h6>
                  </div>
                  <Textarea
                    readOnly={isStatementPrePopulated}
                    classNames={{
                      input:
                        statementValue == "prePopulated"
                          ? "!bg-white !border-grey-low !text-3xl !p-5 !text-foreground focus:!border-primary"
                          : "!bg-primary-light !border-primary !text-3xl !p-5 !text-foreground focus:!border-primary",
                    }}
                    autosize
                    minRows={2}
                    maxRows={2}
                    value={statementManualData}
                    onChange={(e) => setStatementManualData(e.target.value)}
                  />
                </div>
              </Radio.Card>
            </div>
          </Radio.Group>
        </div>
        <div>
          <h6 className="text-foreground py-5">Add Instruction:</h6>
          <Radio.Group
            value={instructionValue}
            onChange={setInstructionValue}
          >
            <div className="flex items-center gap-[70px]">
              <Radio.Card
                value="prePopulated"
                className="relative border-0 w-[453px]"
                radius="md"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex gap-2 items-center">
                    <Radio.Indicator
                      icon={CheckIcon}
                      size="lg"
                      color="green.5"
                    />
                    <h6>Pre-populated</h6>
                  </div>
                  <Textarea
                    readOnly={isInstructionPrePopulated}
                    value={instructionPrevData}
                    classNames={{
                      input:
                        instructionValue == "prePopulated"
                          ? "!bg-primary-light !border-primary !text-3xl !p-5 !text-foreground"
                          : "!bg-white !border-grey-low !text-3xl !p-5 !text-foreground",
                    }}
                    autosize
                    minRows={2}
                    maxRows={2}
                    onChange={(e) => setInstructionPrevData(e.target.value)}
                  />
                </div>
              </Radio.Card>
              <h5 className="pt-4">OR</h5>
              <Radio.Card
                value="manualEntry"
                className="relative border-0 w-[453px]"
                radius="md"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex gap-2 items-center">
                    <Radio.Indicator
                      icon={CheckIcon}
                      size="lg"
                      color="green.5"
                    />
                    <h6>Enter Text Manually (max 150 letters)</h6>
                  </div>
                  <Textarea
                    readOnly={isInstructionPrePopulated}
                    classNames={{
                      input:
                        instructionValue == "prePopulated"
                          ? "!bg-white !border-grey-low !text-3xl !p-5 !text-foreground focus:!border-primary"
                          : "!bg-primary-light !border-primary !text-3xl !p-5 !text-foreground focus:!border-primary",
                    }}
                    autosize
                    minRows={2}
                    maxRows={2}
                    value={instructionManualData}
                    onChange={(e) => setInstructionManualData(e.target.value)}
                  />
                </div>
              </Radio.Card>
            </div>
          </Radio.Group>
        </div>
        <div>
          <h6 className="text-foreground py-5">Dispensation:</h6>
          <Radio.Group
            value={dispensationValue}
            onChange={setDispensationValue}
          >
            <div className="flex items-center gap-[70px]">
              <Radio.Card
                value="prePopulated"
                className="relative border-0 w-[453px]"
                radius="md"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex gap-2 items-center">
                    <Radio.Indicator
                      icon={CheckIcon}
                      size="lg"
                      color="green.5"
                    />
                    <h6>Pre-populated</h6>
                  </div>
                  <Textarea
                    readOnly={isDispensationPrePopulated}
                    value={dispensationPrevData}
                    classNames={{
                      input:
                        dispensationValue == "prePopulated"
                          ? "!bg-primary-light !border-primary !text-3xl !p-5 !text-foreground"
                          : "!bg-white !border-grey-low !text-3xl !p-5 !text-foreground",
                    }}
                    autosize
                    minRows={2}
                    maxRows={2}
                    onChange={(e) => setDispensationPrevData(e.target.value)}
                  />
                </div>
              </Radio.Card>
              <h5 className="pt-4">OR</h5>
              <Radio.Card
                value="manualEntry"
                className="relative border-0 w-[453px]"
                radius="md"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex gap-2 items-center">
                    <Radio.Indicator
                      icon={CheckIcon}
                      size="lg"
                      color="green.5"
                    />
                    <h6>Enter Text Manually (max 150 letters)</h6>
                  </div>
                  <Textarea
                    readOnly={isDispensationPrePopulated}
                    classNames={{
                      input:
                        dispensationValue == "prePopulated"
                          ? "!bg-white !border-grey-low !text-3xl !p-5 !text-foreground focus:!border-primary"
                          : "!bg-primary-light !border-primary !text-3xl !p-5 !text-foreground focus:!border-primary",
                    }}
                    autosize
                    minRows={2}
                    maxRows={3}
                    value={dispensationManualData}
                    onChange={(e) => setDispensationManualData(e.target.value)}
                  />
                </div>
              </Radio.Card>
            </div>
          </Radio.Group>
        </div>
        <div>
          <h6 className="text-foreground py-5">Side Effects:</h6>
          <Radio.Group
            value={sideEffectValue}
            onChange={setSideEffectValue}
          >
            <div className="flex items-center gap-[70px]">
              <Radio.Card
                value="prePopulated"
                className="relative border-0 w-[453px]"
                radius="md"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex gap-2 items-center">
                    <Radio.Indicator
                      icon={CheckIcon}
                      size="lg"
                      color="green.5"
                    />
                    <h6>Pre-populated</h6>
                  </div>
                  <Textarea
                    readOnly={isSideEffectPrePopulated}
                    value={sideEffectPrevData}
                    classNames={{
                      input:
                        sideEffectValue == "prePopulated"
                          ? "!bg-primary-light !border-primary !text-3xl !p-5 !text-foreground"
                          : "!bg-white !border-grey-low !text-3xl !p-5 !text-foreground",
                    }}
                    autosize
                    minRows={2}
                    maxRows={2}
                    onChange={(e) => setSideEffectPrevData(e.target.value)}
                  />
                </div>
              </Radio.Card>
              <h5 className="pt-4">OR</h5>
              <Radio.Card
                value="manualEntry"
                className="relative border-0 w-[453px]"
                radius="md"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex gap-2 items-center">
                    <Radio.Indicator
                      icon={CheckIcon}
                      size="lg"
                      color="green.5"
                    />
                    <h6>Enter Text Manually (max 150 letters)</h6>
                  </div>
                  <Textarea
                    readOnly={isSideEffectPrePopulated}
                    classNames={{
                      input:
                        sideEffectValue == "prePopulated"
                          ? "!bg-white !border-grey-low !text-3xl !p-5 !text-foreground focus:!border-primary"
                          : "!bg-primary-light !border-primary !text-3xl !p-5 !text-foreground focus:!border-primary",
                    }}
                    autosize
                    minRows={2}
                    maxRows={3}
                    value={sideEffectManualData}
                    onChange={(e) => setSideEffectManualData(e.target.value)}
                  />
                </div>
              </Radio.Card>
            </div>
          </Radio.Group>
        </div>
        {/* <div className="max-w-[459px]">
          <h6 className="text-foreground py-5">Diagnosis:</h6>
          <CustomSearchFilter onSearch={() => {}} />
          <div className="mt-5">
            <DocumentTag
              badgeColor="bg-tag-bg"
              badgeText="Lorem ipsum dolor"
              actions={[actions]}
            />
          </div>
        </div> */}
        <div className="flex gap-5 pt-[30px]">
          <Button
            variant="outline"
            size="sm-2"
            rightSection={<i className="icon-soap-note text-sm/none"></i>}
            onClick={() => setSoapNoteHandler.open()}
          >
            Add Soap Note
          </Button>
          <Button
            variant="outline"
            size="sm-2"
            rightSection={<i className="icon-soap-note text-sm/none"></i>}
            onClick={() => {}}
            disabled
          >
            Add Intake Note
          </Button>
        </div>
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
            color="grey.4"
            c="foreground"
            disabled
          >
            Save as Draft
          </Button>
          <Button
            w={256}
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </div>

      <SoapNote
        openModal={openSoapNote}
        onModalClose={setSoapNoteHandler.close}
      />
      <IntakeForm
        openModal={openIntakeForm}
        onModalClose={setOpenIntakeForm.close}
      />
    </>
  );
}

export default StepFour;
