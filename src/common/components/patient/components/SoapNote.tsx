import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IPrescriptionDetails } from "@/common/api/models/interfaces/Prescription.model";
import { IAddSoapNoteDTO } from "@/common/api/models/interfaces/SoapNote.model";
import { IGetSystemCodesParams } from "@/common/api/models/interfaces/SystemCodes.model";
import soapNoteApiRepository from "@/common/api/repositories/soapNoteRepository";
import systemCodesRepository from "@/common/api/repositories/systemCodesRepository";
import dmlToast from "@/common/configs/toaster.config";
import { formatDate, getAge } from "@/utils/date.utils";
import { Button, Modal, ScrollArea, Textarea } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import ReusableCombobox, { DmlComboBoxDataType } from "./ReusableCombobox";

interface ModalProps {
  openModal: boolean;
  onModalClose: () => void;
  patientId?: number;
  prescriptionId?: number;
  patientData?: IPrescriptionDetails | null;
  onUpdate?: (success: boolean) => void;
}

function SoapNote({ openModal, onModalClose, patientId, prescriptionId, patientData, onUpdate }: ModalProps) {
  const [icdCodes, setIcdCodes] = useState<DmlComboBoxDataType[]>([]);
  const [cptCodes, setCptCodes] = useState<DmlComboBoxDataType[]>([]);
  const [tempIcdCodes, setTempIcdCodes] = useState<any[]>([]);
  const [tempCptCodes, setTempCptCodes] = useState<any[]>([]);
  const [selectedIcdCodes, setSelectedIcdCodes] = useState<string[]>();
  const [selectedCptCodes, setSelectedCptCodes] = useState<string[]>();
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

  const soapNoteQueryFn = () => {
    const params = {
      patientId: patientId,
      prescriptionId: prescriptionId,
    };

    return soapNoteApiRepository.getSoapNoteData(params);
  };
  const soapNoteQuery = useQuery({
    queryKey: ["soapNoteData", patientId, prescriptionId],
    queryFn: soapNoteQueryFn,
    enabled: !!(patientId && prescriptionId),
  });

  const soapNoteData = soapNoteQuery?.data?.data?.data;

  useEffect(() => {
    if (soapNoteData?.prescription_details?.id) {
      setSelectedIcdCodes(
        soapNoteData?.icd_codes?.length ? soapNoteData?.icd_codes?.map((icd) => ({ id: icd?.icd_code?.id, code: icd?.icd_code?.code, note: icd?.icd_code?.note })) : []
      );
      setTempIcdCodes(
        soapNoteData?.icd_codes?.length ? soapNoteData?.icd_codes?.map((icd) => ({ id: icd?.icd_code?.id, code: icd?.icd_code?.code, note: icd?.icd_code?.note })) : []
      );
      setSelectedCptCodes(
        soapNoteData?.cpd_codes?.length ? soapNoteData?.cpd_codes?.map((cpd) => ({ id: cpd?.cpd_code?.id, code: cpd?.cpd_code?.cpd_code, note: cpd?.cpd_code?.note })) : []
      );
      setTempCptCodes(
        soapNoteData?.cpd_codes?.length ? soapNoteData?.cpd_codes?.map((cpd) => ({ id: cpd?.cpd_code?.id, code: cpd?.cpd_code?.cpd_code, note: cpd?.cpd_code?.note })) : []
      );
      setValue("symptom", soapNoteData?.prescription_details?.subjective_symptom || "");
      setValue("findings", soapNoteData?.prescription_details?.objective_finding || "");
      setValue("assessment", soapNoteData?.prescription_details?.assessment_goal || "");
      setValue("plan_of_treatment", soapNoteData?.prescription_details?.plan_of_treatment || "");
    }
  }, [soapNoteQuery?.isFetched]);

  const { register, setValue, handleSubmit, reset } = useForm({});

  useEffect(() => {
    if (openModal && soapNoteData) {
      setTempIcdCodes(selectedIcdCodes ? [...selectedIcdCodes] : []);
      setTempCptCodes(selectedCptCodes ? [...selectedCptCodes] : []);
    }
  }, [openModal, soapNoteData]);

  const addSoapNoteMutation = useMutation({
    mutationFn: (payload: IAddSoapNoteDTO) => soapNoteApiRepository.addSoapNote(payload),
  });
  const soapNoteFormSubmit = (data: any) => {
    if (patientId && prescriptionId) {
      const icd_codes = tempIcdCodes.map((codes) => codes.id);
      const cpd_codes = tempCptCodes.map((codes) => codes.id);
      const payload: IAddSoapNoteDTO = {
        ...data,
        icd_codes,
        cpd_codes,
        patient_id: patientId,
        prescription_id: prescriptionId,
      };
      addSoapNoteMutation.mutate(payload, {
        onSuccess: () => {
          setSelectedIcdCodes(tempIcdCodes ? [...tempIcdCodes] : []);
          setSelectedCptCodes(tempCptCodes ? [...tempCptCodes] : []);
          dmlToast.success({
            title: "Soap note saved successfully",
          });
          onModalClose();
          if (onUpdate) {
            onUpdate(true);
          }
        },
        onError: (error) => {
          const err = error as AxiosError<IServerErrorResponse>;
          dmlToast.error({
            message: err?.response?.data?.message,
            title: "Oops! Something went wrong",
          });
        },
      });
    }
  };

  const onComboboxItemSelect = (values) => {
    setTempIcdCodes(values);
  };

  const modalDismiss = () => {
    setTempIcdCodes(selectedIcdCodes ? [...selectedIcdCodes] : []);
    setTempCptCodes(selectedCptCodes ? [...selectedCptCodes] : []);
    reset({
      icd_codes: selectedIcdCodes,
      cpd_codes: selectedCptCodes,
    });
    onModalClose();
  };

  return (
    <>
      <Modal.Root
        opened={openModal}
        onClose={() => modalDismiss()}
        size="1128px"
        centered
        closeOnClickOutside={false}
      >
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header className="border-b border-b-grey-low !pt-3.5 !px-6 !pb-3">
            <Modal.Title>Soap Notes</Modal.Title>
            <div className="flex items-center gap-3">
              <Button
                h="40px"
                bg="grey.4"
                c="foreground"
                rightSection={<i className="icon-pdf text-sm leading-3.5"></i>}
                component={Link}
                to={`${import.meta.env.VITE_BASE_URL}/download/soap-note/${prescriptionId}`}
                target="_blank"
              >
                Print
              </Button>
              <Button
                h="40px"
                bg="grey.4"
                c="foreground"
                rightSection={<i className="icon-download-04 text-sm leading-3.5"></i>}
                component={Link}
                to={`${import.meta.env.VITE_BASE_URL}/download/soap-note/${prescriptionId}`}
                target="_blank"
              >
                Download PDF
              </Button>
              <i
                className="icon-cross text-2xl leading-6 cursor-pointer"
                onClick={onModalClose}
              />
            </div>
          </Modal.Header>
          <Modal.Body className="!pl-6 !pr-0 !pt-6">
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
                <div className="col-span-4 grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-6">
                    <span className="extra-form-text-medium text-foreground">Patient Name</span>
                    <p className="text-grey text-fs-sp">{patientData?.patient?.name || "N/A"}</p>
                  </div>
                  <div className="flex flex-col gap-6">
                    <span className="extra-form-text-medium text-foreground">Drug Name</span>
                    <p className="text-grey text-fs-sp capitalize">{patientData?.medication?.drug_name ? patientData?.medication?.drug_name.toLowerCase() : "N/A"}</p>
                  </div>
                  <div className="flex flex-col gap-6">
                    <span className="extra-form-text-medium text-foreground">Client Name</span>
                    <p className="text-grey text-fs-sp">{patientData?.client?.name}</p>
                  </div>
                </div>
                <div className="col-span-3 grid grid-cols-4 gap-2">
                  <div className="col-span-2 flex flex-col gap-6">
                    <span className="extra-form-text-medium text-foreground">DOB</span>
                    <p className="text-grey text-fs-sp">{patientData?.patient?.dob ? formatDate(patientData?.patient?.dob, "MMMM DD, YYYY") : "N/A"}</p>
                  </div>
                  <div className="flex flex-col gap-6">
                    <span className="extra-form-text-medium text-foreground">Age</span>
                    <p className="text-grey text-fs-sp">{patientData?.patient?.dob ? getAge(patientData?.patient?.dob) : "N/A"}</p>
                  </div>
                  <div className="flex flex-col gap-6">
                    <span className="extra-form-text-medium text-foreground">Sex</span>
                    <p className="text-grey text-fs-sp">{patientData?.patient?.gender || "N/A"}</p>
                  </div>
                </div>
              </div>
              <form className="space-y-4">
                <div className="">
                  <ReusableCombobox
                    label="ICD Codes"
                    data={icdCodes}
                    selectedValues={tempIcdCodes}
                    onSelectionChange={onComboboxItemSelect}
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
                  {...register("symptom")}
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
                  {...register("findings")}
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
                  {...register("assessment")}
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
              </form>
              <div className="flex justify-end gap-2 pt-5">
                <Button
                  bg="grey.4"
                  c="foreground"
                  w="246px"
                  onClick={modalDismiss}
                >
                  Close
                </Button>
                <Button
                  bg="foreground"
                  type="button"
                  w="246px"
                  onClick={handleSubmit(soapNoteFormSubmit)}
                  loading={addSoapNoteMutation.isPending}
                >
                  Save
                </Button>
              </div>
            </ScrollArea.Autosize>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}

export default SoapNote;
