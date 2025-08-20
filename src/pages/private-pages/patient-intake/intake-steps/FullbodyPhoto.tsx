import { heightAtom, weightAtom } from "@/common/states/height.atom";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionIcon, Anchor, Button, Image, Input, NumberInput, Text } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconCloudUp, IconX } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const fullBodyPhotoSchema = yup.object({
  measurement: yup.object({
    height_feet: yup
      .string()
      .required(({ label }) => `${label} is required`)
      .label("Height"),
    height_inch: yup
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
  const [weight, setWeight] = useState<string>("");
  const [heightFeet, setHeightFeet] = useState<string>("");
  const [heightInch, setHeightInch] = useState<string>("");
  const [fullBodyBase64, setFullBodyBase64] = useState<string | null>(null);
  const [heightObj, setHeightObj] = useAtom(heightAtom);
  const [globalWeight, setGlobalWeight] = useAtom(weightAtom);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<fullBodyPhotoSchemaType>({
    resolver: yupResolver(fullBodyPhotoSchema),
  });

  const fileToBase64 = (file: File, callback: (result: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result as string);
    reader.onerror = (error) => console.error("Error converting file: ", error);
  };

  useEffect(() => {
    if (defaultValues?.measurement?.height_feet) {
      setValue("measurement.height_feet", defaultValues.measurement.height_feet);
      setHeightFeet(defaultValues.measurement.height_feet || "");
      setValue("measurement.height_inch", defaultValues.measurement.height_inch);
      setHeightInch(defaultValues.measurement.height_inch || "");
      setValue("measurement.weight", defaultValues.measurement.weight);
      setValue("measurement.full_body_image", defaultValues.measurement.full_body_image);
    } else {
      setValue("measurement.height_feet", heightObj?.height_feet?.toString() || "");
      setValue("measurement.height_inch", heightObj?.height_inch?.toString() || "");
      setHeightFeet(heightObj?.height_feet?.toString() || "");
      setHeightInch(heightObj?.height_inch?.toString() || "");
      setValue("measurement.weight", globalWeight || "");
      setWeight(globalWeight);
    }
  }, [defaultValues, heightObj]);

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
      <form
        id="stepFullBodyForm"
        onSubmit={handleSubmit(onNext)}
        className="card-common pt-12 space-y-10"
      >
        <div className="card-title with-border">
          <h6 className="text-[30px] font-semibold text-foreground font-poppins">Progress Tracking</h6>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input.Wrapper
            label="Height"
            required
            className="md:col-span-1 col-span-2"
            styles={{
              label: { fontWeight: 500, marginBottom: "0.5rem" },
            }}
            withAsterisk
          >
            <div className="grid grid-cols-2 gap-5">
              <NumberInput
                placeholder="Feet"
                value={heightFeet}
                {...register("measurement.height_feet")}
                onChange={(value) => {
                  setValue("measurement.height_feet", value.toString());
                  if (value) {
                    clearErrors("measurement.height_feet");
                  }
                }}
                min={0}
                max={99}
                hideControls
                clampBehavior="strict"
              />
              <NumberInput
                placeholder="Inches"
                value={heightInch}
                {...register("measurement.height_inch")}
                onChange={(value) => {
                  setValue("measurement.height_inch", value.toString());
                  if (value) {
                    clearErrors("measurement.height_inch");
                  }
                }}
                min={0}
                max={12}
                hideControls
                clampBehavior="strict"
              />
            </div>
          </Input.Wrapper>
          <NumberInput
            className="md:col-span-1 col-span-2"
            classNames={{
              root: "sm:!grid !block w-full",
              error: "sm:!text-end !text-start w-full",
            }}
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
        <div className="grid md:grid-cols-2 gap-6 xl:py-5 md:py-8">
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
          <div className="xl:pb-9 md:pb-16 xl:-mt-9 md:-mt-16">
            <p className="text-fs-lg text-foreground !font-medium pb-2 ">Upload Your Full Body Photo for Progress Tracking</p>
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
                root: "relative w-full md:h-full h-[500px] border-dashed border border-gray-300 bg-gray-50 cursor-pointer rounded-lg",
                inner: "absolute !inset-0 !size-full",
              }}
            >
              {!fullBodyFile ? (
                <div className="pointer-events-none h-full flex justify-center">
                  <div className="flex flex-col items-center justify-center h-full">
                    <IconCloudUp size={30} />
                    <h6 className="text-grey-medium font-semibold">Drag and Drop Here</h6>
                    <span className="text-grey-medium text-base font-medium">Or</span>
                    <Anchor
                      underline="always"
                      className="font-medium"
                    >
                      Browse Files
                    </Anchor>
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
