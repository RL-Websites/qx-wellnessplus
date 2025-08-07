import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionIcon, Button, Image, NumberInput, Text } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconCloudUp, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const fullBodyPhotoSchema = yup.object({
  measurement: yup.object({
    height: yup
      .string()
      .required(({ label }) => `${label} is required`)
      .label("Height"),
    weight: yup
      .string()
      .required(({ label }) => `${label} is required`)
      .label("Weight"),
    full_body_image: yup.mixed().required("Please upload your full body photo."),
  }),
});

export type fullBodyPhotoSchemaType = yup.InferType<typeof fullBodyPhotoSchema>;

interface FullBodyPhotoProps {
  onNext: (data: fullBodyPhotoSchemaType) => void;
  defaultValues?: fullBodyPhotoSchemaType;
}

const FullBodyPhoto = ({ onNext, defaultValues }: FullBodyPhotoProps) => {
  const [fullBodyFile, setFullBodyFile] = useState<File | null>(null);
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [fullBodyBase64, setFullBodyBase64] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<fullBodyPhotoSchemaType>({
    resolver: yupResolver(fullBodyPhotoSchema),
    defaultValues: {},
  });

  const fileToBase64 = (file: File, callback: (result: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result as string);
    reader.onerror = (error) => console.error("Error converting file: ", error);
  };

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      fileToBase64(file, (base64) => {
        setFullBodyFile(file);
        setFullBodyBase64(base64);
        setValue("measurement.full_body_image", base64);
        clearErrors("measurement.full_body_image");
      });
    }
  };

  const removeFile = () => {
    setFullBodyFile(null);
    setFullBodyBase64(null);
    setValue("measurement.full_body_image", "");
  };

  return (
    <>
      <h2 className="heading-text text-foreground uppercase text-center">help us better understand</h2>
      <form
        id="stepFullBodyForm"
        onSubmit={handleSubmit(onNext)}
        className="card-common pt-12 space-y-10"
      >
        <div className="card-title with-border">
          <h6 className="text-foreground">Progress Tracking</h6>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberInput
            className="md:col-span-1 col-span-2"
            label="Height (inches)"
            value={height}
            {...register("measurement.height")}
            onChange={(value) => {
              if (value) {
                setHeight(value?.toString());
                setValue("measurement.height", value?.toString());
                clearErrors("measurement.height");
              }
            }}
            // value={height}
            max={9999}
            min={0}
            clampBehavior="strict"
            error={getErrorMessage(errors?.measurement?.height)}
            hideControls
            allowNegative={false}
            allowDecimal={true}
            withAsterisk
          />
          <NumberInput
            className="md:col-span-1 col-span-2"
            label="Weight (lbs)"
            value={weight}
            {...register("measurement.weight")}
            onChange={(value) => {
              if (value) {
                setWeight(value?.toString());
                setValue("measurement.weight", value?.toString());
                clearErrors("measurement.weight");
              }
            }}
            // value={weight}
            max={999}
            min={0}
            error={getErrorMessage(errors.measurement?.weight)}
            clampBehavior="strict"
            hideControls
            allowNegative={false}
            allowDecimal={true}
            withAsterisk
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 py-5">
          <div className="border-2 border-dashed border-primary bg-primary-secondary p-4 rounded-md text-sm pb-20 text-foreground">
            <h6 className="heading-xxs pb-4">Full Body Photo Guideline</h6>
            <p className="text-fs-md text-foreground pb-5">
              To help our healthcare providers assess your current wellness status and personalize your treatment, we ask for a clear, full-body photo.
            </p>
            <h6 className="heading-xxs pb-4">Tips for the Best Photo:</h6>
            <ul className="list-disc ps-5 space-y-1">
              <li>Stand upright, arms relaxed at your sides</li>
              <li>Use a plain/light background for better visibility</li>
              <li>Avoid filters or image editing — keep it natural</li>
              <li>Remove hats/sunglasses (if any)</li>
              <li>Face the camera directly (front-facing photo is preferred)</li>
            </ul>
            <h6 className="heading-xxs pb-4 pt-5">How to Take the Photo:</h6>
            <ul className="list-disc ps-5 space-y-1">
              <li>Use your phone camera or upload from your gallery</li>
              <li>Ask someone to help take the picture if needed</li>
              <li>Make sure the entire body is visible in the frame</li>
            </ul>
            <h6 className="heading-xxs pb-4 pt-5">Privacy First:</h6>
            <ul className="list-disc ps-5 space-y-1">
              <li>Your image is securely stored and only accessible to medical staff</li>
              <li>It will not be shared or used for any other purpose</li>
            </ul>
          </div>

          <div className="-mt-10 pb-9">
            <p className="text-fs-lg text-foreground !font-medium pb-2">Upload Your Full Body Photo for Progress Tracking</p>
            <Dropzone
              onDrop={handleFileUpload}
              onReject={(rejectedFiles) => {
                if (rejectedFiles?.[0]?.errors?.[0]?.code === "file-too-large") {
                  alert("The file size exceeds the 5MB limit. Please upload a smaller file.");
                }
              }}
              accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
              maxSize={5 * 1024 ** 2}
              multiple={false}
              classNames={{
                root: "relative w-full h-full border-dashed border border-gray-300 bg-gray-50 cursor-pointer rounded-lg",
                inner: "absolute !inset-0 !size-full",
              }}
            >
              {!fullBodyFile ? (
                <div className="pointer-events-none h-full flex justify-center">
                  <div className="flex flex-col items-center justify-center h-full">
                    <IconCloudUp size={30} />
                    <h6 className="text-grey-medium">Drag and Drop Here</h6>
                  </div>
                </div>
              ) : (
                <div className="relative inline-block size-full">
                  <Image
                    src={URL.createObjectURL(fullBodyFile)}
                    alt="Full Body"
                    className="size-full rounded-md object-scale-down"
                  />
                  <ActionIcon
                    size="sm"
                    radius="xl"
                    variant="filled"
                    color="red"
                    style={{ position: "absolute", top: -5, right: -5, zIndex: 10 }}
                    onClick={removeFile}
                  >
                    <IconX size={14} />
                  </ActionIcon>
                </div>
              )}
            </Dropzone>
            {errors.measurement?.full_body_image && (
              <Text
                color="red"
                size="sm"
                mt="xs"
              >
                {getErrorMessage(errors.measurement?.full_body_image)}
              </Text>
            )}
          </div>
        </div>
      </form>

      <div className="flex justify-end mt-6">
        <Button
          type="submit"
          form="stepFullBodyForm"
          w={256}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default FullBodyPhoto;
