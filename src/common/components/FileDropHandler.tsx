import { Anchor, Group, Text } from "@mantine/core";
import { Dropzone, FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import { IconUpload, IconX } from "@tabler/icons-react";
import React, { useState } from "react";
import { Control, useController, useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { IFileWithCustomProperties } from "../api/models/interfaces/Prescriber.model";
import EditableDocumentTag from "./EditableDocumentTag";

interface DropzoneProps {
  name: string;
  maxSize: number;
  control?: Control<any>;
  documents?: IFileWithCustomProperties[];
  onError: (msg) => void;
}

const FileDropHandler: React.FC<DropzoneProps> = ({ name, maxSize, documents, onError, ...props }) => {
  const { control } = useFormContext();
  const { field } = useController({
    name,
    control,
  });
  // const [loading, setLoading] = useState<boolean>(false);

  const [uploadedFiles, setUploadedFiles] = useState<IFileWithCustomProperties[]>(documents ? [...documents] : []);

  const handleDrop = async (acceptedFiles: FileWithPath[]) => {
    const droppedFiles = acceptedFiles.map((file) => ({ file: file, id: uuidv4() }));

    const newFiles = [...uploadedFiles, ...droppedFiles];
    console.log(newFiles);
    setUploadedFiles(newFiles);
    field.onChange(newFiles);

    // try {
    //   setLoading(true);
    //   const response = await $http.post("upload-documents", documentData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   });
    //   if (response.data.status_code == 200) {
    //     const newFiles = [...uploadedFiles, ...response.data.data];
    //     setUploadedFiles(newFiles);
    //     field.onChange(newFiles);
    //     setLoading(false);
    //     dmlToast.success({
    //       title: response?.data?.message,
    //     });
    //   }
    // } catch (error: any) {
    //   setLoading(false);
    //   dmlToast.error({
    //     title: error?.response?.data?.message,
    //   });
    // }
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

  // const removeDocMutation = useMutation({ mutationFn: (document_id: string) => documentRepository.documentRemove(document_id) });

  const handleRemove = (file) => {
    console.log(file);
    const document_id = file?.id;
    const newFiles = uploadedFiles.filter((file) => file?.id !== document_id);

    setUploadedFiles(newFiles);
    field.onChange(newFiles);

    // removeDocMutation.mutate(document_id, {
    //   onSuccess: () => {
    //     field.onChange(newFiles);
    //     setUploadedFiles(newFiles);

    //     dmlToast.success({
    //       title: "Document removed successfully",
    //     });
    //   },
    //   onError: (err) => {
    //     console.log(err);
    //     const error = err as AxiosError<IServerErrorResponse>;
    //     dmlToast.error({
    //       message: error?.response?.data?.message,
    //       title: "Failed to remove document. Please try again later.",
    //     });
    //   },
    // });
  };

  // const renameDocMutation = useMutation({ mutationFn: (payload: IDocumentRenameDTO) => documentRepository.documentRename(payload) });

  const handleRename = (newName, file, ext) => {
    console.log(newName);
    const document_id = file?.id;
    // const payload: IDocumentRenameDTO = {
    //   document_id: file?.document_id,
    //   new_display_name: newName,
    // };

    // const fileToChange = uploadedFiles.find((file) => file?.id == document_id)?.file;
    const indexOfFileToRename = uploadedFiles.findIndex((file) => file?.id == document_id);
    const newFiles = [...uploadedFiles];
    const fileToChange = newFiles[indexOfFileToRename].file;
    const fileWithNewName = new File([fileToChange], `${newName}.${ext}`, { type: fileToChange.type, lastModified: fileToChange.lastModified });
    newFiles[indexOfFileToRename].file = fileWithNewName;
    console.log(fileWithNewName);
    setUploadedFiles(newFiles);
    field.onChange(newFiles);

    // renameDocMutation.mutate(payload, {
    //   onSuccess: (res) => {
    //     newFiles[IndexOfFileToRename].original_name = res?.data?.data?.display_name;
    //     setUploadedFiles(newFiles);
    //     field.onChange(newFiles);
    //     dmlToast.success({
    //       title: "Document renamed successfully",
    //     });
    //   },
    //   onError: (err) => {
    //     const error = err as AxiosError<IServerErrorResponse>;
    //     dmlToast.error({
    //       message: error?.response?.data?.message,
    //       title: "Failed to rename document. Please try again later.",
    //     });
    //   },
    // });
  };

  return (
    <div className="dml-fileUploader-wrapper relative">
      <Dropzone
        onDrop={handleDrop}
        onReject={(files) => handleFileReject(files)}
        maxSize={maxSize}
        {...props}
        className="border-dashed border border-grey bg-grey-btn w-full cursor-pointer rounded-lg mb-3.5"
        accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.pdf, MIME_TYPES.doc, MIME_TYPES.docx]}
      >
        <Group
          justify="center"
          gap="xl"
          mih={206}
          style={{ pointerEvents: "none" }}
          className="flex-col text-center border-dashed border border-grey bg-grey-btn w-full cursor-pointer rounded-lg"
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
          ? uploadedFiles.map((file: IFileWithCustomProperties, index: number) => (
              <EditableDocumentTag
                key={index}
                docName={file.file.name}
                editable={true}
                removable={true}
                leftIconClass="icon-pdf"
                onRemove={() => handleRemove(file)}
                onRename={(newName, ext) => handleRename(newName, file, ext)}
              />
            ))
          : ""}
      </Group>
    </div>
  );
};

export default FileDropHandler;
