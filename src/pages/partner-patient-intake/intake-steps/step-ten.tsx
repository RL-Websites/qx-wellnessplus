import EditableDocumentTag from "@/common/components/EditableDocumentTag";
import dmlToast from "@/common/configs/toaster.config";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Group, Input, Radio, Text } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconUpload } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step10Schema = yup.object({
  thyroidCancer: yup.string().required("Please select at least one value."),
  thyroidCancerType: yup.string().when("thyroidCancer", {
    is: "Yes",
    then: (schema) => schema.required("Please select what type of thyroid cancer."),
  }),
  papillaryReport: yup.string().when("thyroidCancerType", {
    is: "Papillary",
    then: (schema) => schema.required("Please mention if you have the report."),
  }),
  papillaryReportUp: yup.string().when("papillaryReport", {
    is: "Yes",
    then: (schema) => schema.required("Please upload your pathology report."),
  }),
  papillaryReportFileName: yup.string().when("papillaryReport", {
    is: "Yes",
    then: (schema) => schema.required("Please upload your pathology report."),
  }),
  follicularReport: yup.string().when("thyroidCancerType", {
    is: "Follicular",
    then: (schema) => schema.required("Please mention if you have the report."),
  }),
  follicularReportUp: yup.string().when("follicularReport", {
    is: "Yes",
    then: (schema) => schema.required("Please upload your pathology report."),
  }),
  follicularReportFileName: yup.string().when("follicularReport", {
    is: "Yes",
    then: (schema) => schema.required("Please upload your pathology report."),
  }),
  thyroidCancerOther: yup.string().when("thyroidCancerType", {
    is: "Other",
    then: (schema) => schema.required("Please mention what type of thyroid cancer do you have."),
  }),
  thyroidOtherReport: yup.string().when("thyroidCancerType", {
    is: "Other",
    then: (schema) => schema.required("Please mention if you have the report."),
  }),
  thyroidOtherReportUp: yup.string().when("thyroidOtherReport", {
    is: "Yes",
    then: (schema) => schema.required("Please upload your pathology report."),
  }),
  thyroidReportFileName: yup.string().when("thyroidOtherReport", {
    is: "Yes",
    then: (schema) => schema.required("Please upload your pathology report."),
  }),
});

export type step10SchemaType = yup.InferType<typeof step10Schema>;
interface Step10Props {
  onNext: (data: any) => void;
  onBack: () => void;
  defaultValues?: step10SchemaType;
}

const StepTen = ({ onNext, onBack, defaultValues }: Step10Props) => {
  const [papillaryReportFile, setPapillaryReportFile] = useState<string | null>(null);
  // const [papillaryReportFileName, setPapillaryReportFileName] = useState<string | null>(null);
  const [follicularReportFile, setFollicularReportFile] = useState<string | null>(null);
  // const [follicularReportFileName, setFollicularReportFileName] = useState<string | null>(null);
  const [otherReportFile, setOtherReportFile] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      thyroidCancer: defaultValues?.thyroidCancer || "",
      thyroidCancerType: defaultValues?.thyroidCancerType || "",
      papillaryReport: defaultValues?.papillaryReport || "",
      papillaryReportUp: defaultValues?.papillaryReportUp || "",
      papillaryReportFileName: defaultValues?.papillaryReportFileName || "",
      follicularReport: defaultValues?.follicularReport || "",
      follicularReportUp: defaultValues?.follicularReportUp || "",
      follicularReportFileName: defaultValues?.follicularReportFileName || "",
      thyroidCancerOther: defaultValues?.thyroidCancerOther || "",
      thyroidOtherReport: defaultValues?.thyroidOtherReport || "",
      thyroidOtherReportUp: defaultValues?.thyroidOtherReportUp || "",
      thyroidReportFileName: defaultValues?.thyroidReportFileName || "",
    },
    resolver: yupResolver(step10Schema),
  });

  useEffect(() => {
    defaultValues?.papillaryReportUp && setPapillaryReportFile(defaultValues.papillaryReportUp);
    defaultValues?.follicularReportUp && setFollicularReportFile(defaultValues.follicularReportUp);
    defaultValues?.thyroidOtherReportUp && setOtherReportFile(defaultValues.thyroidOtherReportUp);
  }, [defaultValues]);

  const thyroidCancer = watch("thyroidCancer");
  const showThyroidCancerType = thyroidCancer === "Yes";
  const thyroidCancerType = watch("thyroidCancerType");
  const showPapillaryReport = thyroidCancerType == "Papillary";
  const papillaryReport = watch("papillaryReport");
  const papillaryReportFileName = watch("papillaryReportFileName");
  const showPapillaryReportUp = papillaryReport == "Yes";
  const showFollicularReport = thyroidCancerType == "Follicular";
  const follicularReport = watch("follicularReport");
  const showFollicularReportUp = follicularReport == "Yes";
  const follicularReportFileName = watch("follicularReportFileName");
  const showThyroidCancerOther = thyroidCancerType == "Other";
  const thyroidOtherReport = watch("thyroidOtherReport");
  const showThyroidOtherReportUp = thyroidOtherReport == "Yes";
  const thyroidReportFileName = watch("thyroidReportFileName");

  const fileToBase64 = (file: File, callback: (result: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result as string);
    reader.onerror = (error) => console.error("Error converting file: ", error);
  };

  const handlePapillaryReportUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setValue("papillaryReportFileName", file.name);
      fileToBase64(file, (base64) => {
        setPapillaryReportFile(base64);
        setValue("papillaryReportUp", base64);
        // setFrontBase64(base64);
      });
    }
  };
  const handleFollicularReportUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setValue("follicularReportFileName", file.name);
      fileToBase64(file, (base64) => {
        setFollicularReportFile(base64);
        setValue("follicularReportUp", base64);
        // setFrontBase64(base64);
      });
    }
  };
  const handleThyroidOtherReportUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setValue("thyroidReportFileName", file.name);
      fileToBase64(file, (base64) => {
        setOtherReportFile(base64);
        setValue("thyroidOtherReportUp", base64);
        // setFrontBase64(base64);
      });
    }
  };

  const removePapillaryFile = () => {
    // ev.preventDefault();
    setValue("papillaryReportFileName", "");
    setValue("papillaryReportUp", "");
    setPapillaryReportFile(null);
  };

  const removeFollicularFile = () => {
    // ev.preventDefault();
    setValue("follicularReportFileName", "");
    setValue("follicularReportUp", "");
    setFollicularReportFile(null);
  };
  const removeThyroidOtherFile = () => {
    // ev.preventDefault();
    setValue("thyroidReportFileName", "");
    setValue("thyroidOtherReportUp", "");
    setOtherReportFile(null);
  };

  return (
    <>
      <form
        id="step10Form"
        onSubmit={handleSubmit(onNext)}
        className="card divide-y pt-10 space-y-10 min-h-[200px]"
      >
        <Radio.Group
          label="Do you have a personal or family history of thyroid cancer?"
          value={thyroidCancer}
          {...register("thyroidCancer")}
          onChange={(value) => {
            console.log(value);
            setValue("thyroidCancer", value);
            setValue("thyroidCancerType", "");
            setValue("papillaryReport", "");
            setValue("papillaryReportUp", "");
            setValue("papillaryReportFileName", "");
            setValue("follicularReport", "");
            setValue("follicularReportUp", "");
            setValue("follicularReportFileName", "");
            setValue("thyroidOtherReport", "");
            setValue("thyroidOtherReportUp", "");
            setValue("thyroidReportFileName", "");
            setPapillaryReportFile(null);
            setFollicularReportFile(null);
            setOtherReportFile(null);
            clearErrors("thyroidCancer");
          }}
          error={getErrorMessage(errors?.thyroidCancer)}
        >
          <Box
            mt="xs"
            className="space-y-4"
          >
            <Radio
              value="Yes"
              label="Yes"
              color="dark"
              {...register("thyroidCancer")}
            />
            <Radio
              value="No"
              label="No"
              color="dark"
              {...register("thyroidCancer")}
            />
          </Box>
        </Radio.Group>

        {showThyroidCancerType && (
          <div>
            <Radio.Group
              label="What type of thyroid cancer?"
              {...register("thyroidCancerType")}
              value={thyroidCancerType}
              onChange={(value) => {
                setValue("thyroidCancerType", value);
                setValue("thyroidCancerOther", "");
                setValue("papillaryReport", "");
                setValue("papillaryReportUp", "");
                setValue("papillaryReportFileName", "");
                setValue("follicularReport", "");
                setValue("follicularReportUp", "");
                setValue("follicularReportFileName", "");
                setValue("thyroidOtherReport", "");
                setValue("thyroidOtherReportUp", "");
                setValue("thyroidReportFileName", "");
                setPapillaryReportFile(null);
                setFollicularReportFile(null);
                setOtherReportFile(null);
                clearErrors("thyroidCancerType");
              }}
              className="pt-10"
            >
              <Box
                mt="xs"
                className="space-y-3"
              >
                <Radio
                  value="Medullary"
                  label="Medullary"
                  color="dark"
                  {...register("thyroidCancerType")}
                />
                <Radio
                  value="Papillary"
                  label="Papillary"
                  color="dark"
                  {...register("thyroidCancerType")}
                />
                <Radio
                  value="Follicular"
                  label="Follicular"
                  color="dark"
                  {...register("thyroidCancerType")}
                />
                <Radio
                  value="Other"
                  label="Other"
                  color="dark"
                  {...register("thyroidCancerType")}
                />
              </Box>
            </Radio.Group>
            {errors?.thyroidCancerType?.message ? <p className="text-sm text-danger mt-2">{errors?.thyroidCancerType?.message}</p> : ""}
          </div>
        )}
        {showPapillaryReport && (
          <Radio.Group
            label="Do you have your pathology report?"
            className="pt-8"
            value={papillaryReport}
            {...register("papillaryReport")}
            onChange={(value) => {
              console.log(value);
              setValue("papillaryReport", value);
              setValue("papillaryReportUp", "");
              setValue("papillaryReportFileName", "");
              setPapillaryReportFile(null);
              clearErrors("papillaryReport");
            }}
            error={getErrorMessage(errors?.papillaryReport)}
          >
            <Box
              mt="xs"
              className="space-y-4"
            >
              <Radio
                value="Yes"
                label="Yes"
                color="dark"
                {...register("papillaryReport")}
              />
              <Radio
                value="No"
                label="No"
                color="dark"
                {...register("papillaryReport")}
              />
            </Box>
          </Radio.Group>
        )}

        {showPapillaryReportUp && (
          <div className="pt-8">
            <h6 className="extra-form-text-medium text-foreground mb-2">Please Upload Papillary pathology Report</h6>
            {!papillaryReportFile ? (
              <Dropzone
                onDrop={(files) => handlePapillaryReportUpload(files)}
                onReject={(rejectedFiles) => {
                  if (rejectedFiles?.[0]?.errors?.[0]?.code == "file-too-large") {
                    dmlToast.error({ title: "File size should be less than 2MB." });
                  }
                }}
                accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.pdf]}
                maxSize={2 * 1024 ** 2}
                multiple={false}
                classNames={{
                  root: "relative w-full min-h-[220px] border-dashed border border-grey bg-grey-btn w-full cursor-pointer rounded-lg",
                  inner: "absolute !inset-0 !size-full",
                }}
              >
                <Group
                  justify="center"
                  gap="md"
                  mih={220}
                  className="flex-col text-center pointer-events-none"
                >
                  <IconUpload
                    style={{
                      width: 52,
                      height: 52,
                    }}
                    stroke={1.5}
                  />
                  <Text>Drag & drop or click to upload</Text>
                </Group>
              </Dropzone>
            ) : (
              <div className="flex">
                <EditableDocumentTag
                  docName={papillaryReportFileName || ""}
                  removable={true}
                  leftIconClass="icon-pdf"
                  onRemove={() => removePapillaryFile()}
                />
              </div>
            )}

            {errors?.papillaryReportUp?.message ? <p className="text-sm text-danger mt-2">{errors?.papillaryReportUp?.message}</p> : ""}
          </div>
        )}
        {showFollicularReport && (
          <div>
            <Radio.Group
              label="Do you have your pathology report?"
              {...register("follicularReport")}
              value={follicularReport}
              onChange={(value) => {
                setValue("follicularReport", value);
                setValue("follicularReportUp", "");
                setValue("follicularReportFileName", "");
                setFollicularReportFile(null);
                clearErrors("follicularReport");
              }}
              className="pt-8"
            >
              <Box
                mt="xs"
                className="space-y-3"
              >
                <Radio
                  value="Yes"
                  label="Yes"
                  color="dark"
                  {...register("follicularReport")}
                />
                <Radio
                  value="No"
                  label="No"
                  color="dark"
                  {...register("follicularReport")}
                />
              </Box>
            </Radio.Group>
            {errors?.follicularReport?.message ? <p className="text-sm text-danger mt-2">{errors?.follicularReport?.message}</p> : ""}
          </div>
        )}
        {showFollicularReportUp && (
          <div className="pt-6">
            <h6 className="extra-form-text-medium text-foreground mb-2">Please Upload Follicular pathology Report</h6>
            {!follicularReportFile ? (
              <Dropzone
                onDrop={(files) => handleFollicularReportUpload(files)}
                onReject={(rejectedFiles) => {
                  if (rejectedFiles?.[0]?.errors?.[0]?.code == "file-too-large") {
                    dmlToast.error({ title: "File size should be less than 2MB." });
                  }
                }}
                accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.pdf]}
                maxSize={2 * 1024 ** 2}
                multiple={false}
                classNames={{
                  root: "relative w-full min-h-[220px] border-dashed border border-grey bg-grey-btn w-full cursor-pointer rounded-lg",
                  inner: "absolute !inset-0 !size-full",
                }}
              >
                <Group
                  justify="center"
                  gap="md"
                  mih={220}
                  className="flex-col text-center pointer-events-none"
                >
                  <IconUpload
                    style={{
                      width: 52,
                      height: 52,
                    }}
                    stroke={1.5}
                  />
                  <Text>Drag & drop or click to upload</Text>
                </Group>
              </Dropzone>
            ) : (
              <div className="flex">
                <EditableDocumentTag
                  docName={follicularReportFileName || ""}
                  removable={true}
                  leftIconClass="icon-pdf"
                  onRemove={() => removeFollicularFile()}
                />
              </div>
            )}

            {errors?.follicularReportUp?.message ? <p className="text-sm text-danger mt-2">{errors?.follicularReportUp?.message}</p> : ""}
          </div>
        )}
        {showThyroidCancerOther && (
          <div>
            <Input.Wrapper
              label="Please specify what type of thyroid cancer?"
              withAsterisk
              className="pt-8"
              error={getErrorMessage(errors.thyroidCancerOther)}
            >
              <Input
                type="text"
                {...register("thyroidCancerOther")}
              />
            </Input.Wrapper>

            <div>
              <Radio.Group
                label="Do you have your pathology report?"
                {...register("thyroidOtherReport")}
                value={thyroidOtherReport}
                onChange={(value) => {
                  setValue("thyroidOtherReport", value);
                  setValue("thyroidOtherReportUp", "");
                  setValue("thyroidReportFileName", "");
                  setOtherReportFile(null);
                  clearErrors("thyroidOtherReport");
                }}
                className="pt-8"
              >
                <Box
                  mt="xs"
                  className="space-y-3"
                >
                  <Radio
                    value="Yes"
                    label="Yes"
                    color="dark"
                    {...register("thyroidOtherReport")}
                  />
                  <Radio
                    value="No"
                    label="No"
                    color="dark"
                    {...register("thyroidOtherReport")}
                  />
                </Box>
              </Radio.Group>
              {errors?.thyroidOtherReport?.message ? <p className="text-sm text-danger mt-2">{errors?.thyroidOtherReport?.message}</p> : ""}
            </div>
          </div>
        )}
        {showThyroidOtherReportUp && (
          <div className="pt-6">
            <h6 className="extra-form-text-medium text-foreground mb-2">Please upload your pathology report.</h6>
            {!otherReportFile ? (
              <Dropzone
                onDrop={(files) => handleThyroidOtherReportUpload(files)}
                onReject={(rejectedFiles) => {
                  if (rejectedFiles?.[0]?.errors?.[0]?.code == "file-too-large") {
                    dmlToast.error({ title: "File size should be less than 2MB." });
                  }
                }}
                accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.pdf]}
                maxSize={2 * 1024 ** 2}
                multiple={false}
                classNames={{
                  root: "relative w-full min-h-[220px] border-dashed border border-grey bg-grey-btn w-full cursor-pointer rounded-lg",
                  inner: "absolute !inset-0 !size-full",
                }}
              >
                <Group
                  justify="center"
                  gap="md"
                  mih={220}
                  className="flex-col text-center pointer-events-none"
                >
                  <IconUpload
                    style={{
                      width: 52,
                      height: 52,
                    }}
                    stroke={1.5}
                  />
                  <Text>Drag & drop or click to upload</Text>
                </Group>
              </Dropzone>
            ) : (
              <div className="flex">
                <EditableDocumentTag
                  docName={thyroidReportFileName || ""}
                  removable={true}
                  leftIconClass="icon-pdf"
                  onRemove={() => removeThyroidOtherFile()}
                />
              </div>
            )}

            {errors?.thyroidOtherReportUp?.message ? <p className="text-sm text-danger mt-2">{errors?.thyroidOtherReportUp?.message}</p> : ""}
          </div>
        )}
      </form>

      <div className="flex justify-between mt-6">
        <div className="flex gap-6 sm:ms-auto sm:mx-0 mx-auto">
          <Button
            px={0}
            variant="outline"
            onClick={onBack}
            className="sm:w-[256px] w-[120px]"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="sm:w-[256px] w-[120px]"
            form="step10Form"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default StepTen;
