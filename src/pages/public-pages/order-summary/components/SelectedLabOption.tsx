import { Button, Tooltip } from "@mantine/core";
import { IconCircleCheckFilled, IconDownload, IconUpload } from "@tabler/icons-react";
import LabExaminationOptions from "./LabExaminationOptions";

function SelectedLabOption(props: {
  selectedOption: any;
  // handleDownloadLabRequisition: () => void;
  // isDownloading: boolean;
  setIsUploadModalOpen: (value: boolean) => void;
  visibleExaminations: any[];
  allowLabDocuments?: boolean;
  onEditLabOption?: () => void; // New prop for editing
  isHiddenExaminationTitle?: boolean;
}) {
  const {
    selectedOption,
    // handleDownloadLabRequisition,
    // isDownloading,
    setIsUploadModalOpen,
    visibleExaminations,
    allowLabDocuments = true,
    isHiddenExaminationTitle = false,
  } = props;

  return (
    <>
      <div className="border-t border-[#D8DDE5] pt-4 first:border-t-0 first:pt-0">
        <p className="text-xs font-medium text-foreground sm:text-sm">Lab Option</p>

        <div className="mt-4 flex items-center gap-3 overflow-x-auto whitespace-nowrap">
          <div className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-primary bg-[#F7FBFF] px-3 py-2 text-left shadow-[0_4px_14px_rgba(59,130,246,0.08)]">
            <span className="flex min-w-0 items-center gap-2.5">
              <IconCircleCheckFilled
                size={22}
                className="shrink-0 text-[#17A34A]"
              />
              <span className="truncate text-xs font-semibold text-[#2E3642] sm:text-sm">{selectedOption.title}</span>
            </span>
            <Tooltip
              label={
                <div className="max-w-xs space-y-1 text-xs leading-5">
                  {selectedOption.description.map((paragraph) => (
                    <p
                      className="m-0 p-0"
                      key={paragraph}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              }
              multiline
              withArrow
              color="dark"
              position="top"
            >
              <span className="inline-flex size-4 cursor-help items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">i</span>
            </Tooltip>
          </div>

          {/* The following buttons are for download/upload, keep them in the same flex container */}

          {!allowLabDocuments ? (
            <p className="m-0 shrink-0 text-xs text-[#8A8F97] sm:text-sm">Lab requisition download and report upload will be available after the order is created.</p>
          ) : selectedOption.submissionType === "preferred_lab" || selectedOption.submissionType === "dosevana_lab" ? (
            <Button
              variant="filled"
              size="sm-2"
              leftSection={
                <IconDownload
                  size={16}
                  stroke={1.8}
                />
              }
              // onClick={handleDownloadLabRequisition}
              // loading={isDownloading}
              className="bg-foreground hover:bg-foreground/80 transition-colors"
            >
              Download Lab Requisition
            </Button>
          ) : (
            <>
              <Button
                variant="filled"
                onClick={() => setIsUploadModalOpen(true)}
                size="sm-2"
                rightSection={
                  <IconUpload
                    size={16}
                    stroke={1.8}
                  />
                }
                className="bg-foreground hover:bg-foreground/80 transition-colors"
              >
                Upload Lab Report
              </Button>
              <p className="m-0 shrink-0 text-xs text-[#8A8F97] sm:text-sm">(You may upload the lab reports at a later time, if convenient.)</p>
            </>
          )}
        </div>
      </div>
      <LabExaminationOptions
        visibleExaminations={visibleExaminations}
        isHiddenExaminationTitle={isHiddenExaminationTitle}
      />
      <div className="mt-5 rounded-2xl border border-[#F4E3B8] bg-[#FFF8E8] px-4 py-4 text-xs leading-6 text-[#B06A00] shadow-[0_8px_20px_rgba(176,106,0,0.05)] sm:px-5 sm:text-sm">
        Blood work is required before starting Testosterone Replacement Therapy (TRT). Our medical provider will review the lab results to determine eligibility.
      </div>
    </>
  );
}

export default SelectedLabOption;
