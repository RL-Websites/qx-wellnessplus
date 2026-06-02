import { Button, Tooltip } from "@mantine/core";
import { IconCircleCheckFilled, IconDownload, IconUpload } from "@tabler/icons-react";
import { useState } from "react";
import patientApiRepository from "@/common/api/repositories/patientRepository";
import dmlToast from "@/common/configs/toaster.config";
import LabExaminationOptions from "./LabExaminationOptions";

function SelectedLabOption(props: {
  selectedOption: any;
  setIsUploadModalOpen: (value: boolean) => void;
  visibleExaminations: any[];
  allowLabDocuments?: boolean;
  onEditLabOption?: () => void; // New prop for editing
  isHiddenExaminationTitle?: boolean;
  prescriptionId?: number | string | null;
}) {
  const {
    selectedOption,
    setIsUploadModalOpen,
    visibleExaminations,
    allowLabDocuments = true,
    isHiddenExaminationTitle = false,
    prescriptionId = null,
  } = props;

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadLabRequisition = async () => {
    if (!prescriptionId) {
      dmlToast.error({
        title: "Unavailable",
        message: "Lab requisition will be available after the order is created.",
      });
      return;
    }
    setIsDownloading(true);
    try {
      const response = await patientApiRepository.downloadLabRequisition(prescriptionId);
      const contentType = response?.headers?.["content-type"] ?? "";
      if (contentType.includes("application/json")) {
        const text = await (response.data as Blob).text();
        const json = JSON.parse(text);
        dmlToast.error({
          title: "Download failed",
          message: json?.message ?? "Unable to download lab requisition.",
        });
        return;
      }
      const blob = new Blob([response.data as BlobPart], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `lab_requisition_${prescriptionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      dmlToast.error({
        title: "Download failed",
        message: error?.response?.data?.message ?? error?.message ?? "Unable to download lab requisition.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="border-t border-[#D8DDE5] pt-4 first:border-t-0 first:pt-0">
        <p className="text-xs font-medium text-foreground sm:text-sm">Lab Option</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="inline-flex min-h-[42px] min-w-0 items-center gap-2 rounded-xl border border-primary bg-[#F7FBFF] px-3 py-2 text-left shadow-[0_4px_14px_rgba(59,130,246,0.08)]">
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

          {!allowLabDocuments ? (
            <p className="m-0 text-xs text-[#8A8F97] sm:text-sm">Lab requisition download and report upload will be available after the order is created.</p>
          ) : selectedOption.submissionType === "preferred_lab" ? (
            prescriptionId ? (
              <Button
                variant="filled"
                size="sm-2"
                leftSection={
                  <IconDownload
                    size={16}
                    stroke={1.8}
                  />
                }
                onClick={handleDownloadLabRequisition}
                loading={isDownloading}
                className="bg-foreground hover:bg-foreground/80 transition-colors w-fit"
              >
                Download Lab Requisition
              </Button>
            ) : (
              <p className="m-0 text-xs text-[#8A8F97] sm:text-sm">Lab requisition will be available after the order is placed.</p>
            )
          ) : selectedOption.submissionType === "own_lab" ? (
            prescriptionId ? (
              <div className="flex w-full flex-wrap items-center gap-3">
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
                  className="bg-foreground hover:bg-foreground/80 transition-colors w-fit"
                >
                  Upload Lab Report
                </Button>
                <p className="m-0 text-xs text-[#8A8F97] sm:text-sm">(You may upload the lab reports at a later time, if convenient.)</p>
              </div>
            ) : (
              <p className="m-0 text-xs text-[#8A8F97] sm:text-sm">You'll be able to upload your lab report after the order is placed.</p>
            )
          ) : null}
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
