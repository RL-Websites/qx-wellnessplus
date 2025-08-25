import EditableDocumentTag from "@/common/components/EditableDocumentTag";
import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import dmlToast from "@/common/configs/toaster.config";
import { compressFileToBase64 } from "@/utils/fileUpload";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Anchor, Button, Input, Radio, Text } from "@mantine/core";
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
  papillaryReportUp: yup.mixed().nullable().optional(),
  papillaryReportFileName: yup.string().nullable().optional(),
  // papillaryReportUp: yup.string().when("papillaryReport", {
  //   is: "Yes",
  //   then: (schema) => schema.required("Please upload your pathology report."),
  // }),
  // papillaryReportFileName: yup.string().when("papillaryReport", {
  //   is: "Yes",
  //   then: (schema) => schema.required("Please upload your pathology report."),
  // }),
  follicularReport: yup.string().when("thyroidCancerType", {
    is: "Follicular",
    then: (schema) => schema.required("Please mention if you have the report."),
  }),
  follicularReportUp: yup.mixed().nullable().optional(),
  follicularReportFileName: yup.string().nullable().optional(),
  // follicularReportUp: yup.string().when("follicularReport", {
  //   is: "Yes",
  //   then: (schema) => schema.required("Please upload your pathology report."),
  // }),
  // follicularReportFileName: yup.string().when("follicularReport", {
  //   is: "Yes",
  //   then: (schema) => schema.required("Please upload your pathology report."),
  // }),
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

interface StepTenProps {
  onNext: (data: step10SchemaType) => void;
  onBack: () => void;
  defaultValues?: step10SchemaType;
}

const StepTen = ({ onNext, onBack, defaultValues }: StepTenProps) => {
  const [papillaryReportFile, setPapillaryReportFile] = useState<any>(null);
  const [follicularReportFile, setFollicularReportFile] = useState<any>(null);
  const [otherReportFile, setOtherReportFile] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<step10SchemaType>({
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
  const thyroidCancerType = watch("thyroidCancerType");
  const papillaryReport = watch("papillaryReport");
  const follicularReport = watch("follicularReport");
  const thyroidOtherReport = watch("thyroidOtherReport");

  const showThyroidCancerType = thyroidCancer === "Yes";
  const showPapillaryReport = thyroidCancerType === "Papillary";
  const showPapillaryReportUp = papillaryReport === "Yes";
  const showFollicularReport = thyroidCancerType === "Follicular";
  const showFollicularReportUp = follicularReport === "Yes";
  const showThyroidCancerOther = thyroidCancerType === "Other";
  const showThyroidOtherReportUp = thyroidOtherReport === "Yes";

  const handleSelect = (field: keyof step10SchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);

    // Reset dependent fields
    if (field === "thyroidCancer") {
      setValue("thyroidCancerType", "");
      setValue("papillaryReport", "");
      setValue("papillaryReportUp", "");
      setValue("papillaryReportFileName", "");
      setValue("follicularReport", "");
      setValue("follicularReportUp", "");
      setValue("follicularReportFileName", "");
      setValue("thyroidCancerOther", "");
      setValue("thyroidOtherReport", "");
      setValue("thyroidOtherReportUp", "");
      setValue("thyroidReportFileName", "");
      setPapillaryReportFile(null);
      setFollicularReportFile(null);
      setOtherReportFile(null);
    }
    if (field === "thyroidCancerType") {
      setValue("papillaryReport", "");
      setValue("papillaryReportUp", "");
      setValue("papillaryReportFileName", "");
      setValue("follicularReport", "");
      setValue("follicularReportUp", "");
      setValue("follicularReportFileName", "");
      setValue("thyroidCancerOther", "");
      setValue("thyroidOtherReport", "");
      setValue("thyroidOtherReportUp", "");
      setValue("thyroidReportFileName", "");
      setPapillaryReportFile(null);
      setFollicularReportFile(null);
      setOtherReportFile(null);
    }
  };

  const handleFileUpload = (files: File[], field: string, setFile: any, setValueField: string, setNameField: string) => {
    if (files.length > 0) {
      const file = files[0];
      setValue(setNameField as keyof step10SchemaType, file.name);
      compressFileToBase64(files, (base64) => {
        setFile(base64);
        setValue(setValueField as keyof step10SchemaType, base64);
      });
    }
  };

  const removeFile = (setFile: any, setValueField: string, setNameField: string) => {
    setValue(setValueField as keyof step10SchemaType, "");
    setValue(setNameField as keyof step10SchemaType, "");
    setFile(null);
  };

  const radioOptions = ["Yes", "No"];
  const thyroidTypes = ["Medullary", "Papillary", "Follicular", "Other"];

  return (
    <form
      id="step10Form"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      {/* Thyroid Cancer */}
      <Radio.Group
        label="Do you have a personal or family history of thyroid cancer?"
        value={thyroidCancer}
        onChange={(val) => handleSelect("thyroidCancer", val)}
        classNames={{
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {radioOptions.map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(thyroidCancer, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {thyroidCancer === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.thyroidCancer)}</p>
      </Radio.Group>

      {/* Thyroid Cancer Type */}
      {showThyroidCancerType && (
        <Radio.Group
          label="What type of thyroid cancer?"
          value={thyroidCancerType}
          onChange={(val) => handleSelect("thyroidCancerType", val)}
          classNames={{
            label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
          }}
        >
          <div className="grid sm:grid-cols-2 gap-5">
            {thyroidTypes.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(thyroidCancerType, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {thyroidCancerType === option && (
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                        <i className="icon-tick text-sm/none"></i>
                      </span>
                    )}
                  </div>
                }
              />
            ))}
          </div>
          <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.thyroidCancerType)}</p>
        </Radio.Group>
      )}

      {/* Papillary Report */}
      {showPapillaryReport && (
        <Radio.Group
          label="Do you have any recent lab reports?"
          description="Note: While this step is optional, providing your recent lab report can help our licensed prescribers better understand your health status and may allow them to recommend the most accurate treatment plan for you."
          value={papillaryReport}
          onChange={(val) => handleSelect("papillaryReport", val)}
          classNames={{
            root: "!block",
            description: "text-sm text-foreground",
            label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
          }}
        >
          <div className="grid sm:grid-cols-2 gap-5">
            {radioOptions.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(papillaryReport, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {papillaryReport === option && (
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                        <i className="icon-tick text-sm/none"></i>
                      </span>
                    )}
                  </div>
                }
              />
            ))}
          </div>
          <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.papillaryReport)}</p>
        </Radio.Group>
      )}

      {showPapillaryReportUp && (
        <div className="">
          <h6 className="extra-form-text-medium text-foreground mb-2">Please upload your Papillary pathology report</h6>
          {!papillaryReportFile ? (
            <Dropzone
              onDrop={(files) => handleFileUpload(files, "papillaryReportUp", setPapillaryReportFile, "papillaryReportUp", "papillaryReportFileName")}
              onReject={(files) => {
                if (files?.[0]?.errors?.[0]?.code === "file-too-large") dmlToast.error({ title: "File size should be less than 2MB." });
              }}
              accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.pdf]}
              multiple={false}
              classNames={{
                root: "relative w-full min-h-[220px] border-dashed border border-grey bg-grey-btn w-full cursor-pointer rounded-lg",
                inner: "absolute !inset-0 !size-full",
              }}
            >
              <div className="flex flex-col items-center justify-center h-full pointer-events-none">
                <i className="icon-document-upload text-[52px] text-grey" />
                <Text className="font-semibold text-grey">Drag & drop or click to upload</Text>
                <div className="d-inline-flex leading-none text-sm">or</div>
                <Anchor className="underline">Browse Files</Anchor>
              </div>
            </Dropzone>
          ) : (
            <div className="flex flex-wrap">
              <EditableDocumentTag
                docName={"papillaryReportFileName"}
                removable
                leftIconClass="icon-pdf"
                onRemove={() => removeFile(setPapillaryReportFile, "papillaryReportUp", "papillaryReportFileName")}
              />
            </div>
          )}
        </div>
      )}

      {/* Follicular Report */}
      {showFollicularReport && (
        <Radio.Group
          label="Do you have accurate lab report?"
          value={follicularReport}
          onChange={(val) => handleSelect("follicularReport", val)}
          classNames={{
            label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
          }}
        >
          <div className="grid grid-cols-2 gap-5">
            {radioOptions.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(follicularReport, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {follicularReport === option && (
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                        <i className="icon-tick text-sm/none"></i>
                      </span>
                    )}
                  </div>
                }
              />
            ))}
          </div>
          <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.follicularReport)}</p>
        </Radio.Group>
      )}

      {showFollicularReportUp && (
        <div className="pt-6">
          <h6 className="extra-form-text-medium text-foreground mb-2">Please upload your Follicular pathology report</h6>
          {!follicularReportFile ? (
            <Dropzone
              onDrop={(files) => handleFileUpload(files, "follicularReportUp", setFollicularReportFile, "follicularReportUp", "follicularReportFileName")}
              onReject={(files) => {
                if (files?.[0]?.errors?.[0]?.code === "file-too-large") dmlToast.error({ title: "File size should be less than 2MB." });
              }}
              accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.pdf]}
              multiple={false}
              classNames={{
                root: "relative w-full min-h-[220px] border-dashed border border-grey bg-grey-btn w-full cursor-pointer rounded-lg",
                inner: "absolute !inset-0 !size-full",
              }}
            >
              <div className="flex flex-col items-center justify-center h-full pointer-events-none">
                <i className="icon-document-upload text-[52px] text-grey" />
                <Text className="font-semibold text-grey">Drag & drop or click to upload</Text>
                <div className="d-inline-flex leading-none text-sm">or</div>
                <Anchor className="underline">Browse Files</Anchor>
              </div>
            </Dropzone>
          ) : (
            <div className="flex flex-wrap">
              <EditableDocumentTag
                docName={"follicularReportFileName"}
                removable
                leftIconClass="icon-pdf"
                onRemove={() => removeFile(setFollicularReportFile, "follicularReportUp", "follicularReportFileName")}
              />
            </div>
          )}
        </div>
      )}

      {/* Other Thyroid Cancer */}
      {showThyroidCancerOther && (
        <div>
          <Input.Wrapper
            label="Please specify what type of thyroid cancer?"
            withAsterisk
            error={getErrorMessage(errors.thyroidCancerOther)}
            classNames={{
              root: "sm:!grid !block w-full",
              error: "sm:!text-end !text-start w-full",
              label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
            }}
          >
            <Input
              type="text"
              {...register("thyroidCancerOther")}
            />
          </Input.Wrapper>

          <Radio.Group
            label="Do you have your pathology report?"
            value={thyroidOtherReport}
            onChange={(val) => handleSelect("thyroidOtherReport", val)}
            error={getErrorMessage(errors.thyroidOtherReport)}
            classNames={{
              root: "sm:!grid !block w-full",
              error: "sm:!text-end !text-start w-full",
              label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
            }}
          >
            <div className="grid grid-cols-2 gap-5">
              {radioOptions.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(thyroidOtherReport, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {thyroidOtherReport === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                          <i className="icon-tick text-sm/none"></i>
                        </span>
                      )}
                    </div>
                  }
                />
              ))}
            </div>
          </Radio.Group>

          {showThyroidOtherReportUp && (
            <div className="pt-6">
              <h6 className="extra-form-text-medium text-foreground mb-2">Please upload your pathology report</h6>
              {!otherReportFile ? (
                <Dropzone
                  onDrop={(files) => handleFileUpload(files, "thyroidOtherReportUp", setOtherReportFile, "thyroidOtherReportUp", "thyroidReportFileName")}
                  onReject={(files) => {
                    if (files?.[0]?.errors?.[0]?.code === "file-too-large") dmlToast.error({ title: "File size should be less than 2MB." });
                  }}
                  accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.pdf]}
                  multiple={false}
                  classNames={{
                    root: "relative w-full min-h-[220px] border-dashed border border-grey bg-grey-btn w-full cursor-pointer rounded-lg",
                    inner: "absolute !inset-0 !size-full",
                  }}
                >
                  <div className="flex flex-col items-center justify-center h-full pointer-events-none">
                    <IconUpload
                      style={{ width: 52, height: 52 }}
                      stroke={1.5}
                    />
                    <span>Drag & drop or click to upload</span>
                  </div>
                </Dropzone>
              ) : (
                <EditableDocumentTag
                  docName={"thyroidReportFileName"}
                  removable
                  leftIconClass="icon-pdf"
                  onRemove={() => removeFile(setOtherReportFile, "thyroidOtherReportUp", "thyroidReportFileName")}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-center gap-6 pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="w-[200px]"
        >
          Back
        </Button>
        <Button
          type="submit"
          form="step10Form"
          className="w-[200px]"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StepTen;
