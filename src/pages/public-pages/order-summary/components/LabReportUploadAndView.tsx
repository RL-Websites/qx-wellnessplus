import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import orderApiRepository from "@/common/api/repositories/orderRepository";
import dmlToast from "@/common/configs/toaster.config";
import { compressFileToBase64 } from "@/utils/fileUpload";
import { yupResolver } from "@hookform/resolvers/yup";
import { Anchor, Button, Group, Modal, Tooltip } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconCloudUp, IconDownload, IconFileText, IconFileTypePdf, IconPhoto, IconTrash } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import * as yup from "yup";

type Mode = "view" | "edit" | "upload";

interface ModalProps {
  openModal: boolean;
  onModalClose: (reason) => void;
  prescriptionDetailId?: number | string;
  /** Present only in the QX pre-order flow — see the mutation below. */
  checkoutKey?: string;
  reports?: any[];
  mode?: Mode;
  uploadPage?: string;
  skipSendingToDoctor?: boolean;
  onUploaded?: (reports: any[]) => void;
}

type UploadedFile = {
  id: string;
  name: string;
  url?: string;
  file_url?: string;
  dataUrl?: string;
  source?: "existing" | "new";
  uploadPage?: string;
};

type FormValues = {
  lab_reportFiles: UploadedFile[];
};

const LabReportUploadAndView: React.FC<ModalProps> = ({
  openModal,
  onModalClose,
  mode = "view",
  reports,
  prescriptionDetailId,
  checkoutKey,
  uploadPage = "trt_cycle",
  skipSendingToDoctor = false,
  onUploaded,
}) => {
  const [localMode, setLocalMode] = useState<Mode>(mode);
  useEffect(() => setLocalMode(mode), [mode]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const createValidationSchema = (isUpload: boolean) =>
    yup.object({
      lab_reportFiles: yup
        .array()
        .of(
          yup.object({
            id: yup.string().required(),
            name: yup.string().required(),
          }) as any
        )
        .when([], {
          is: () => isUpload,
          then: (schema: any) => schema.min(1, "Please upload at least one file"),
          otherwise: (schema: any) => schema,
        }),
    });

  const validationSchema = useMemo(() => createValidationSchema(localMode === "upload"), [localMode]);

  const {
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema) as Resolver<FormValues>,
    defaultValues: { lab_reportFiles: [] },
  });

  useEffect(() => {
    setValue("lab_reportFiles", uploadedFiles);
    if (uploadedFiles.length) clearErrors("lab_reportFiles");
  }, [uploadedFiles, setValue, clearErrors]);

  useEffect(() => {
    if (!openModal) return;

    if (reports && reports.length > 0) {
      const normalized = reports.map((d: any) => ({
        id: d.id ? String(d.id) : `${d.name || d.file_name || Date.now()}`,
        name: d.name || d.file_name || d.file_original_name || "Report",
        url: d.file_url,
        source: "existing" as const,
      }));

      setUploadedFiles(normalized);
    } else if (localMode === "upload") {
      setUploadedFiles([]);
    }
  }, [openModal, reports, localMode]);

  const handleDrop = (files: File[]) => {
    if (!files || files.length === 0) return;

    const promises = files.map(
      (file) =>
        new Promise<UploadedFile>((resolve) => {
          compressFileToBase64([file], (base64) => {
            const dataUrl = base64?.startsWith("data:") ? base64 : `data:${file.type};base64,${base64}`;
            const id = (crypto as any)?.randomUUID?.() ?? `${Date.now()}_${Math.random()}`;
            resolve({ id, name: file.name, dataUrl, source: "new" });
          });
        })
    );

    Promise.all(promises).then((newDocs) => {
      setUploadedFiles((s) => [...s, ...newDocs]);
    });
  };

  const removeFile = (id: string) => {
    setUploadedFiles((s) => s.filter((f) => f.id !== id));
  };

  const downloadFile = async (url: string, name: string) => {
    if (!url) return dmlToast.error({ title: "No preview available" });
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      window.open(url, "_blank"); // Fallback if CORS prevents blob download
    }
  };

  /*
   * Two endpoints, one widget. With a checkoutKey the order does not exist yet, so
   * the report is staged (WellnessQXPatientController::stageLabReport) and claimed
   * later; without one this is an ordinary upload against an existing detail.
   */
  const labReportMutation = useMutation({
    mutationFn: (payload: any) => (checkoutKey ? orderApiRepository.stageLabReport(payload) : orderApiRepository.labReportUploadRequest(payload)),
  });

  const closeModal = (reason) => {
    onModalClose(reason);
  };

  const onSubmit = async (data: FormValues) => {
    const filePayload = data.lab_reportFiles
      .filter((file) => !!file.dataUrl)
      .map((file) => ({
        report: file.dataUrl || "",
        skipSendingToDoctor: skipSendingToDoctor,
        file_original_name: file.name,
      }));

    if (filePayload.length === 0) return;

    const payload = checkoutKey
      ? { checkout_key: checkoutKey, file: filePayload }
      : {
          prescription_detail_id: prescriptionDetailId,
          uploadPage,
          file: filePayload,
          skipSendingToDoctor,
        };

    labReportMutation.mutate(payload, {
      onSuccess(res) {
        onUploaded?.(res?.data?.data || []);
        dmlToast.success({
          title: "Lab Report upload successfully",
        });
        closeModal("success");
      },
      onError(err) {
        const error = err as AxiosError<IServerErrorResponse>;
        const errorMessage = error?.response?.data?.message || "Oops! Something went wrong, Please try again later.";
        dmlToast.error({ title: "Oops! Something went wrong, Please try again later.", message: errorMessage });
      },
    });
  };

  const existingReports = uploadedFiles.filter((f) => f.source === "existing" || (!!f.url && !f.dataUrl));
  const newUploads = uploadedFiles.filter((f) => f.source === "new" || !!f.dataUrl);

  const renderFileRow = (doc: UploadedFile, allowRemove: boolean) => {
    const ext = doc.name?.split(".").pop()?.toLowerCase() || "";
    const isPdf = ext === "pdf";
    const isImage = ["jpg", "jpeg", "png", "svg", "webp", "gif"].includes(ext);

    return (
      <div
        key={doc.id}
        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:border-primary/40 hover:shadow-sm transition-all group"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded flex items-center justify-center ${isPdf ? "bg-red-50 text-red-500" : isImage ? "bg-indigo-50 text-indigo-500" : "bg-blue-50 text-blue-500"}`}
          >
            {isPdf ? (
              <IconFileTypePdf
                size={20}
                stroke={1.5}
              />
            ) : isImage ? (
              <IconPhoto
                size={20}
                stroke={1.5}
              />
            ) : (
              <IconFileText
                size={20}
                stroke={1.5}
              />
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span
              className="text-sm font-medium text-gray-800 truncate"
              title={doc.name}
            >
              {doc.name}
            </span>
            <span className="text-xs text-gray-400 uppercase">{ext || "Document"}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-1.5 flex-shrink-0">
          {doc.url && (
            <Tooltip label="Download Report">
              <button
                type="button"
                onClick={() => downloadFile(doc.url!, doc.name)}
                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
              >
                <IconDownload
                  size={18}
                  stroke={1.5}
                />
              </button>
            </Tooltip>
          )}

          {allowRemove && localMode !== "view" && (
            <Tooltip label="Remove Document">
              <button
                type="button"
                onClick={() => removeFile(doc.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <IconTrash
                  size={18}
                  stroke={1.5}
                />
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal.Root
      opened={openModal}
      onClose={() => closeModal("dismiss")}
      size="1024px"
      centered
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header className="border-b border-b-grey-low !pt-3.5 !px-6 !pb-3">
          <h2 className="text-xl lg:text-3xl xl:text-4xl !font-poppins !font-bold">
            {localMode === "upload" ? "Upload Lab Report" : localMode === "edit" ? "Update Lab Report" : "View Lab Report"}
          </h2>
          <div className="flex items-center gap-3">
            <i
              className="icon-cross1 text-2xl/none cursor-pointer text-primary"
              onClick={() => closeModal("dismiss")}
            ></i>
          </div>
        </Modal.Header>

        <Modal.Body className="!pl-6 !pr-6 !pt-6">
          <form onSubmit={(e) => e.preventDefault()}>
            {(localMode === "upload" || localMode === "edit") && (
              <>
                <div className="mb-4 rounded-xl border border-[#F4E3B8] bg-[#FFF8E8] px-4 py-3 text-sm leading-6 text-[#B06A00]">
                  After upload, you cannot change this. Before uploading, make sure you are uploading your lab reports.
                </div>

                <Dropzone
                  onDrop={(files) => handleDrop(files)}
                  onReject={(rejectedFiles) => {
                    rejectedFiles.forEach((rejection) => {
                      rejection.errors.forEach((error) => {
                        dmlToast.error({ title: error.message });
                      });
                    });
                  }}
                  accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.pdf]}
                  multiple={true}
                  classNames={{
                    root: "relative w-full min-h-[220px] border-dashed border border-grey bg-grey-btn w-full cursor-pointer rounded-lg",
                    inner: "absolute !inset-0 !size-full",
                  }}
                >
                  <Group
                    justify="center"
                    mih={220}
                    className="flex-col text-center gap-2"
                  >
                    <IconCloudUp size={30} />
                    <p className="text-2xl/none text-grey-medium font-bold">Drag and Drop Here</p>
                    <span className="text-lg text-grey-medium">Or</span>
                    <Anchor
                      underline="never"
                      className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-primary after:transition-transform after:duration-500 hover:after:scale-x-0 text-lg/none"
                      fw={500}
                    >
                      Browse File
                    </Anchor>
                  </Group>
                </Dropzone>
              </>
            )}

            <div className="flex flex-col gap-3 mt-4">
              {uploadedFiles.length === 0 && localMode !== "upload" && (
                <div className="text-sm text-gray-500 italic p-4 text-center border rounded-lg bg-gray-50 border-gray-100">No lab reports available</div>
              )}

              {(localMode === "upload" || localMode === "edit") && newUploads.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700">New Uploads</p>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      {newUploads.length} {newUploads.length === 1 ? "file" : "files"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">{newUploads.map((doc) => renderFileRow(doc, true))}</div>
                </div>
              )}

              {existingReports.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700">Existing Reports</p>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                      {existingReports.length} {existingReports.length === 1 ? "file" : "files"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">{existingReports.map((doc) => renderFileRow(doc, false))}</div>
                </div>
              )}
            </div>
            {errors.lab_reportFiles && <div className="text-sm text-red-600 mt-3">{(errors.lab_reportFiles as any)?.message}</div>}

            <div className="flex justify-center mt-6">
              {localMode !== "view" && newUploads.length > 0 && (
                <Button
                  size="md"
                  className="w-[256px]"
                  onClick={handleSubmit(onSubmit)}
                  loading={labReportMutation.isPending}
                >
                  {localMode === "upload" ? "Upload" : "Update"}
                </Button>
              )}
            </div>
          </form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default LabReportUploadAndView;
