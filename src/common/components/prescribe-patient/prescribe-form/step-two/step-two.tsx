import { IGetSystemCodesParams } from "@/common/api/models/interfaces/SystemCodes.model";
import systemCodesRepository from "@/common/api/repositories/systemCodesRepository";
import ReusableCombobox, { DmlComboBoxDataType } from "@/common/components/patient/components/ReusableCombobox";
import { formatDate, getAge } from "@/utils/date.utils";
import { Button, ScrollArea, Textarea } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface MedicationDataType {
  medication_id: string;
}
interface StepTwoProps {
  handleBack: () => void;
  formData: any;
  handleNext: (data) => void;
}

function StepTwo({ handleBack, formData, handleNext }: StepTwoProps) {
  const [icdCodes, setIcdCodes] = useState<DmlComboBoxDataType[]>([]);
  const [cptCodes, setCptCodes] = useState<DmlComboBoxDataType[]>([]);
  const [tempIcdCodes, setTempIcdCodes] = useState<any[]>([]);
  const [tempCptCodes, setTempCptCodes] = useState<any[]>([]);
  const [icdSearchText, setIcdSearchText] = useState<string>("");
  const [cptSearchText, setCptSearchText] = useState<string>("");

  const icdCodesQueryFn = () => {
    const params: IGetSystemCodesParams = {
      code_type: "icd",
      status: 1,
      noPaginate: true,
      search: icdSearchText,
    };
    return systemCodesRepository.getAllCodesNoPaginate(params);
  };

  const icdCodesQuery = useQuery({ queryKey: ["icdCodesQuery", icdSearchText], queryFn: icdCodesQueryFn });

  useEffect(() => {
    if (icdCodesQuery?.data?.status == 200) {
      const formattedIcdCodes = icdCodesQuery?.data?.data?.data ? icdCodesQuery?.data?.data?.data.map((item) => ({ id: item?.id, code: item?.code || "", note: item?.note })) : [];
      setIcdCodes(formattedIcdCodes);
    }
  }, [icdCodesQuery.data?.data?.data]);

  const cptCodesQueryFn = () => {
    const params: IGetSystemCodesParams = {
      code_type: "cpd",
      status: 1,
      noPaginate: true,
      search: cptSearchText,
    };
    return systemCodesRepository.getAllCodesNoPaginate(params);
  };

  const cptCodesQuery = useQuery({ queryKey: ["cpdCodesQuery", cptSearchText], queryFn: cptCodesQueryFn });

  useEffect(() => {
    if (cptCodesQuery?.data?.status == 200) {
      const formattedIcdCodes = cptCodesQuery?.data?.data?.data
        ? cptCodesQuery?.data?.data?.data.map((item) => ({ id: item?.id, code: item?.cpd_code || "", note: item?.note }))
        : [];
      setCptCodes(formattedIcdCodes);
    }
  }, [cptCodesQuery?.data?.data?.data]);

  useEffect(() => {
    if (formData?.soap_note != undefined) {
      setTempIcdCodes(formData?.soap_note?.icd_codes);
      setTempCptCodes(formData?.soap_note?.cpt_codes);
      setValue("subjective_symptom", formData?.soap_note?.subjective_symptom || "");
      setValue("objective_finding", formData?.soap_note?.objective_finding || "");
      setValue("assessment_goal", formData?.soap_note?.assessment_goal || "");
      setValue("plan_of_treatment", formData?.soap_note?.plan_of_treatment || "");
    }
  }, [formData]);

  const { register, setValue, handleSubmit, reset } = useForm({});

  const saveSoapNoteData = (data: any) => {
    const icd_codes = tempIcdCodes;
    const cpt_codes = tempCptCodes;
    const soapNoteData = {
      icd_codes,
      cpt_codes,
      ...data,
    };
    handleNext(soapNoteData);
  };

  return (
    <form onSubmit={handleSubmit(saveSoapNoteData)}>
      <div className="card">
        <div className="card-title with-border mb-6">
          <h6>Soap Notes</h6>
        </div>
        <ScrollArea.Autosize
          type="always"
          scrollbarSize={6}
          scrollbars="y"
          offsetScrollbars
          classNames={{
            root: "h-[calc(100vh_-_230px)]",
            viewport: "view-port-next-inner pr-6",
          }}
        >
          <div className="grid grid-cols-7 gap-y-6 pb-4">
            <div className="col-span-5 grid grid-cols-4 gap-2">
              <div className="flex flex-col gap-6">
                <span className="extra-form-text-medium text-foreground">Patient Name</span>
                <p className="text-grey text-fs-sp">
                  {formData?.patient?.first_name ? formData?.patient?.first_name : ""} {formData?.patient?.last_name ? formData?.patient?.last_name : ""}
                </p>
              </div>
              <div className="flex flex-col gap-6">
                <span className="extra-form-text-medium text-foreground">DOB</span>
                <p className="text-grey text-fs-sp capitalize">{formData?.patient?.dob ? formatDate(formData?.patient?.dob, "MMMM DD, YYYY") : ""}</p>
              </div>
              <div className="flex flex-col gap-6">
                <span className="extra-form-text-medium text-foreground">Age</span>
                <p className="text-grey text-fs-sp">{getAge(formData?.patient?.dob)}</p>
              </div>
              <div className="flex flex-col gap-6">
                <span className="extra-form-text-medium text-foreground">Sex</span>
                <p className="text-grey text-fs-sp capitalize">{formData?.patient?.gender}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="">
              <ReusableCombobox
                label="ICD Codes"
                data={icdCodes}
                selectedValues={tempIcdCodes}
                onSelectionChange={setTempIcdCodes}
                pillsInputHeight={`!h-auto`}
                onSearchChange={(text) => setIcdSearchText(text)}
                isLoading={icdCodesQuery.isLoading}
              />
            </div>

            <div className="">
              <ReusableCombobox
                label="CPT Codes"
                data={cptCodes}
                selectedValues={tempCptCodes}
                onSelectionChange={setTempCptCodes}
                pillsInputHeight={`!h-auto`}
                onSearchChange={(text) => setCptSearchText(text)}
                isLoading={cptCodesQuery.isLoading}
              />
            </div>
            <Textarea
              label="Subjective Symptoms"
              description="Onset / Location / Frequency / Aggravating Factors"
              placeholder=""
              inputWrapperOrder={["label", "description", "input"]}
              classNames={{
                root: "dml-InputWrapper-root-alternative",
                input: "!h-[150px]",
                label: "!mb-0 !self-start",
                description: "text-grey text-fs-md",
              }}
              {...register("subjective_symptom")}
            />
            <Textarea
              label="Objective Findings"
              description="Visual / Palpable / Test Results"
              placeholder=""
              inputWrapperOrder={["label", "description", "input"]}
              classNames={{
                root: "dml-InputWrapper-root-alternative",
                input: "!h-[150px]",
                label: "!mb-0 !self-start",
                description: "text-grey text-fs-md",
              }}
              {...register("objective_finding")}
            />
            <Textarea
              label="Assessment Goals"
              description="Long Term / Short Term"
              placeholder=""
              inputWrapperOrder={["label", "description", "input"]}
              classNames={{
                root: "dml-InputWrapper-root-alternative",
                input: "!h-[150px]",
                label: "!mb-0 !self-start",
                description: "text-grey text-fs-md",
              }}
              {...register("assessment_goal")}
            />
            <Textarea
              label="Plan of Treatment"
              description="Future Treatment / Frequency / Self-Care"
              placeholder=""
              inputWrapperOrder={["label", "description", "input"]}
              classNames={{
                root: "dml-InputWrapper-root-alternative",
                input: "!h-[150px]",
                label: "!mb-0 !self-start",
                description: "text-grey text-fs-md",
              }}
              {...register("plan_of_treatment")}
            />
          </div>
        </ScrollArea.Autosize>
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
          {/* <Button
            w={256}
            color="grey.4"
            c="foreground"
            disabled
          >
            Save as Draft
          </Button> */}
          <Button
            w={256}
            type="submit"
          >
            Next
          </Button>
        </div>
      </div>
    </form>
  );
}

export default StepTwo;
