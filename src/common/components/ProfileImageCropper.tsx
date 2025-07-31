import { ActionIcon, Button, FileInput, FocusTrap, Group, Modal } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { CircleStencil, Cropper, CropperRef, ImageRestriction } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";

interface ModalProps {
  openModal: boolean;
  modalTitle?: boolean;
  onModalClose: () => void;
  src?: any;
  cropped: (file: string | ArrayBuffer | null | File) => void;
  isLoading: boolean;
  itemName?: string;
  fileType?: string;
}

const ProfileImageCropper = ({ modalTitle = false, openModal, onModalClose, src, cropped, isLoading, itemName = "profile image", fileType = "file" }: ModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageErrorText, setImageErrorText] = useState("");
  const cropperRef = useRef<CropperRef>(null);

  const newImageUpload = (value) => {
    if (value) {
      // setFile(value);
      const blob = URL.createObjectURL(value);

      setImage(blob);
    }
    // setFile(null);
  };

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
        // setImage(null);
      }
      // if (file) {
      //   setFile(null);
      // }
    };
  }, [image]);

  useEffect(() => {
    setImageErrorText("");
  }, [openModal]);

  const onSave = () => {
    const canvas = cropperRef.current?.getCanvas();
    if (canvas) {
      const form = new FormData();
      canvas.toBlob((blob) => {
        if (blob) {
          if (fileType == "file") {
            form.append("file", blob, file?.name);
            cropped(form.get("file"));
          } else {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
              const base64data = reader.result;
              cropped(base64data);
            };
          }
        }
      }, "image/jpeg");
    } else {
      setImageErrorText("Please upload an image first");
    }
  };

  return (
    <Modal.Root
      opened={openModal}
      onClose={onModalClose}
      closeOnClickOutside={false}
      size="lg"
      centered
    >
      <Modal.Overlay />
      <Modal.Content>
        <FocusTrap.InitialFocus />
        <Modal.Header>
          <Modal.Title className="capitalize">{modalTitle ? itemName : <>{itemName}</>}</Modal.Title>
          <ActionIcon
            onClick={onModalClose}
            radius="100%"
            bg="dark"
            size="24"
          >
            <i className="icon-cross1 text-xs"></i>
          </ActionIcon>
        </Modal.Header>
        <Modal.Body>
          <FileInput
            rightSection={<i className="icon-upload-04 text-foreground text-lg"></i>}
            rightSectionWidth={54}
            label={`Please upload your ${itemName}`}
            placeholder={`Upload Your File`}
            accept="image/png, image/jpeg, image/jpg, image/svg"
            onChange={(value) => {
              newImageUpload(value);
              setFile;
            }}
          />
          {imageErrorText && <p className="text-danger text-base mt-1">{imageErrorText}</p>}

          <div className={`mt-4 ${image ? "h-[350px] bg-zinc-200" : ""} `}>
            <Cropper
              ref={cropperRef}
              src={image}
              stencilComponent={CircleStencil}
              className="upload-example__cropper"
              imageRestriction={ImageRestriction.fitArea}
            />
          </div>

          <Group mt="lg">
            <Button
              onClick={onSave}
              loading={isLoading}
            >
              Save
            </Button>
            <Button
              variant="outline"
              onClick={onModalClose}
            >
              Cancel
            </Button>
          </Group>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default ProfileImageCropper;
