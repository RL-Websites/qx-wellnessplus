import $http from "@/common/api/axios";
import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IDocumentRenameDTO } from "@/common/api/models/interfaces/Document.model";
import documentRepository from "@/common/api/repositories/documentRepository";
import EditableDocumentTag from "@/common/components/EditableDocumentTag";
import dmlToast from "@/common/configs/toaster.config";
import { Anchor, Group, Text } from "@mantine/core";
import { Dropzone, FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import { IconUpload, IconX } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useRef, useState } from "react";
import { Control, useController, useFormContext } from "react-hook-form";

interface IDocuments extends File {
  path?: string;
  document_id?: number;
  file_name?: string;
  original_name?: string;
}
interface DropzoneProps {
  name: string;
  maxSize: number;
  folderName?: string;
  control?: Control<any>;
  documents?: IDocuments[];
  u_id?: string;
  onError: (msg) => void;
}

const FileUploader: React.FC<DropzoneProps> = ({ name, maxSize, folderName, documents, u_id, onError, ...props }) => {
  // console.log(documents);

  const openRef = useRef<() => void>(null);
  const { control } = useFormContext();
  const { field } = useController({
    name,
    control,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const [uploadedFiles, setUploadedFiles] = useState<FileWithPath[]>(documents ? [...documents] : []);

  const handleDrop = async (acceptedFiles: FileWithPath[]) => {
    const documentData = new FormData();
    acceptedFiles.forEach((file) => {
      documentData.append("documents[]", file);
    });
    if (u_id) {
      documentData.append("u_id", u_id);
    }
    if (folderName && folderName !== undefined) {
      documentData.append("folder", folderName);
      documentData.append("type", folderName);
    }

    try {
      setLoading(true);
      const response = await $http.post("upload-documents", documentData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.status_code == 200) {
        const newFiles = [...uploadedFiles, ...response.data.data];
        setUploadedFiles(newFiles);
        field.onChange(newFiles);
        setLoading(false);
        dmlToast.success({
          title: response?.data?.message,
        });
      }
    } catch (error: any) {
      setLoading(false);
      dmlToast.error({
        title: error?.response?.data?.message,
      });
    }
  };

  const handleFileReject = (files) => {
    // Handle rejected files here
    // console.log(files);
    const errorCode = files?.[0]?.errors?.[0].code;
    let msg = "";
    switch (errorCode) {
      case "file-too-large":
        msg = "File size should not be more than 2MB";
        break;
      case "file-invalid-type":
        msg = "Selected file is not supported.";
        break;
      default:
        msg = "An error occurred while uploading the file";
        break;
    }
    // control.setError("file", { message: msg, type: "validate" });
    onError(msg);
  };

  const removeDocMutation = useMutation({ mutationFn: (document_id: string) => documentRepository.documentRemove(document_id) });

  const handleRemove = (file) => {
    console.log(file);
    const document_id = file?.document_id;
    removeDocMutation.mutate(document_id, {
      onSuccess: () => {
        const newFiles = uploadedFiles.filter((file) => file?.document_id !== document_id);
        field.onChange(newFiles);
        setUploadedFiles(newFiles);

        dmlToast.success({
          title: "Document removed successfully",
        });
      },
      onError: (err) => {
        console.log(err);
        const error = err as AxiosError<IServerErrorResponse>;
        dmlToast.error({
          message: error?.response?.data?.message,
          title: "Failed to remove document. Please try again later.",
        });
      },
    });
  };

  const renameDocMutation = useMutation({ mutationFn: (payload: IDocumentRenameDTO) => documentRepository.documentRename(payload) });

  const handleRename = (newName, file) => {
    console.log(newName);
    const document_id = file?.document_id;
    const payload: IDocumentRenameDTO = {
      document_id: file?.document_id,
      new_display_name: newName,
    };

    const IndexOfFileToRename = uploadedFiles.findIndex((file) => file?.document_id == document_id);
    const newFiles = [...uploadedFiles];
    newFiles[IndexOfFileToRename].original_name = newName;
    renameDocMutation.mutate(payload, {
      onSuccess: (res) => {
        newFiles[IndexOfFileToRename].original_name = res?.data?.data?.display_name;
        setUploadedFiles(newFiles);
        field.onChange(newFiles);
        dmlToast.success({
          title: "Document renamed successfully",
        });
      },
      onError: (err) => {
        const error = err as AxiosError<IServerErrorResponse>;
        dmlToast.error({
          message: error?.response?.data?.message,
          title: "Failed to rename document. Please try again later.",
        });
      },
    });
  };

  return (
    <div className="dml-fileUploader-wrapper relative">
      <Dropzone
        onDrop={handleDrop}
        onReject={(files) => handleFileReject(files)}
        maxSize={maxSize}
        {...props}
        loading={loading}
        className="border-dashed border border-grey bg-grey-btn w-full cursor-pointer rounded-lg"
        accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.pdf, MIME_TYPES.doc, MIME_TYPES.docx]}
      >
        <Group
          justify="center"
          gap="xl"
          mih={220}
          style={{ pointerEvents: "none" }}
          className="flex-col text-center"
        >
          <Dropzone.Accept>
            <IconUpload
              style={{
                width: 52,
                height: 52,
                color: "var(--mantine-color-blue-6)",
              }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{
                width: 52,
                height: 52,
                color: "var(--mantine-color-red-6)",
              }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <div className="text-center">
              <i className="icon-document-upload text-5xl/none text-grey-medium"></i>
              <Text
                size="xl"
                inline
                className="heading-sm text-grey-medium"
              >
                Drag and Drop Here
              </Text>
              <Text
                size="lg"
                c="dimmed"
                inline
                mt={7}
              >
                or
              </Text>
              <Anchor
                underline="always"
                className="font-medium"
              >
                Browse files
              </Anchor>
            </div>
          </Dropzone.Idle>
          {/* <div className="text-center">
            <Text
              size="xl"
              inline
            >
              Drag and Drop Here
            </Text>
            <Text
              size="sm"
              c="dimmed"
              inline
              mt={7}
            >
              or
            </Text>
            <Anchor
              onClick={() => openRef.current?.()}
              underline="always"
            >
              Browse files
            </Anchor>
          </div> */}
        </Group>
      </Dropzone>
      <Group className="mt-3.5 flex-wrap gap-y-3">
        {/* {documents
          ? documents.map((file: IDocuments, index) => (
              <EditableDocumentTag
                key={index}
                docName={file.original_name}
                editable={true}
                removable={true}
                leftIconClass="icon-list"
                onRemove={() => handleRemove(file)}
                onRename={(newName) => handleRename(newName, file)}
              />
            ))
          : ""} */}

        {uploadedFiles
          ? uploadedFiles.map((file: any, index: number) => (
              <EditableDocumentTag
                key={index}
                docName={file.original_name}
                editable={true}
                removable={true}
                leftIconClass="icon-pdf"
                onRemove={() => handleRemove(file)}
                onRename={(newName) => handleRename(newName, file)}
              />
            ))
          : ""}
      </Group>
    </div>
  );
};

export default FileUploader;
