import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import LabReportUploadAndView from "./LabReportUploadAndView";
import LabTypeSectionModal, { LabExamination, LabOption, LabOptionId, LabSubmissionType } from "./LabTypeSectionModal";
import SelectedLabOption from "./SelectedLabOption";

const getLabOptionIdFromSubmissionType = (value?: LabSubmissionType | null): LabOptionId | null => {
  if (value === "preferred_lab") return "preferred-lab";
  if (value === "own_lab") return "upload-results";
  if (value === "dosevana_lab") return "dosevana-lab";
  return null;
};

const LAB_OPTIONS: LabOption[] = [
  {
    id: "preferred-lab",
    title: "Patient's Preferred Lab (Requisition Provided)",
    description: ["A lab requisition form will be provided that can be taken to any laboratory of choice.", "Payment will be made directly to the lab at the time of the visit."],
    submissionType: "preferred_lab",
  },
  {
    id: "upload-results",
    title: "Upload Existing Lab Results",
    description: [
      "If recent lab results are available, they may be uploaded for medical review.",
      "The lab report must be completed within the last 90 days and include the required tests. Based on the patient's profile, the system will display the necessary tests (e.g., Testosterone, Estradiol, PSA, CBC for men or hormone panel tests for women).",
      "If required tests are missing, the order may be cancelled after doctor review. Medication will not be charged, but the doctor review fee may still apply.",
    ],
    submissionType: "own_lab",
  },
  {
    id: "dosevana-lab",
    title: "Prepaid Lab Setup by Dosevana",
    description: [
      "Dosevana will arrange the lab order with a partner laboratory.",
      "The lab test fee will be added during checkout. The patient simply needs to visit the lab on the scheduled day, and results will be sent directly to our medical team.",
      "(No paperwork or report uploads required.)",
    ],
    submissionType: "dosevana_lab",
  },
];

interface LabSelectionProps {
  examinations?: LabExamination[];
  prescriptionId?: number | string | null;
  prescriptionDetailId?: number | string | null;
  reports?: any[];
  value?: LabSubmissionType | null;
  onSelectionChange?: (value: LabSubmissionType | null) => void;
  onReportsChange?: (reports: any[]) => void;
  allowLabDocuments?: boolean;
  isHiddenExaminationTitle?: boolean;
  autoOpenModalTrigger?: number;
  disabledChooseLabOptionMode?: boolean;
}

const LabSection = ({
  examinations = [],
  prescriptionId = null,
  prescriptionDetailId = null,
  reports = [],
  value = null,
  onSelectionChange,
  onReportsChange,
  isHiddenExaminationTitle = false,
  allowLabDocuments = true,
  disabledChooseLabOptionMode = false,
  autoOpenModalTrigger = 0,
}: LabSelectionProps) => {
  const [isModalOpen, setIsModalOpen] = useDisclosure(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useDisclosure(false);
  const [uploadedReports, setUploadedReports] = useState<any[]>([]);
  const visibleExaminations = examinations.filter((exam) => !!(exam?.name || exam?.code));
  const [draftSelection, setDraftSelection] = useState<LabOptionId>(getLabOptionIdFromSubmissionType(value) ?? "preferred-lab");
  const savedSelection = getLabOptionIdFromSubmissionType(value);
  const selectedOption = LAB_OPTIONS.find((option) => option.id === savedSelection) ?? null;

  const saveSelection = () => {
    onSelectionChange?.(LAB_OPTIONS.find((option) => option.id === draftSelection)?.submissionType ?? null);
    setIsModalOpen.close();
  };
  return (
    <>
      <div className="card bg-opacity-60 mt-10 p-6 md:p-10 rounded-[32px]">
        <div className="space-y-7">
          {!disabledChooseLabOptionMode && (
            <div className="space-y-3">
              <h6 className="font-semibold text-foreground">One or more medications in this treatment require lab work.</h6>
              <p className="text-foreground/70 font-poppins">Select one of the options below to proceed with the required blood tests</p>
              <Button
                size="sm-2"
                onClick={setIsModalOpen.open}
                className="!w-fit"
              >
                Choose Lab Options
              </Button>
              <span className="text-lg/none text-foreground block">Choose how you want to complete your lab work</span>
            </div>
          )}
          {selectedOption ? (
            <SelectedLabOption
              selectedOption={selectedOption}
              // If not disabled, allow editing the lab option
              onEditLabOption={!disabledChooseLabOptionMode ? setIsModalOpen.open : undefined}
              setIsUploadModalOpen={setIsUploadModalOpen.open}
              visibleExaminations={visibleExaminations}
              allowLabDocuments={allowLabDocuments}
              prescriptionId={prescriptionId}
            />
          ) : (
            ""
          )}
        </div>
      </div>
      <LabTypeSectionModal
        opened={isModalOpen}
        onClose={setIsModalOpen.close}
        onSave={saveSelection}
        draftSelection={draftSelection}
        onSelect={setDraftSelection}
        examinations={visibleExaminations}
        options={LAB_OPTIONS}
      />
      {allowLabDocuments ? (
        <LabReportUploadAndView
          skipSendingToDoctor={true}
          openModal={isUploadModalOpen}
          onModalClose={() => setIsUploadModalOpen.close()}
          prescriptionDetailId={prescriptionDetailId ?? undefined}
          reports={uploadedReports}
          onUploaded={(newReports) => {
            setUploadedReports((prev) => {
              const merged = [...prev];

              newReports.forEach((report) => {
                if (!merged.some((item) => String(item?.id) === String(report?.id))) {
                  merged.push(report);
                }
              });

              onReportsChange?.(merged);
              return merged;
            });
          }}
          mode="upload"
        />
      ) : null}
    </>
  );
};

export default LabSection;
