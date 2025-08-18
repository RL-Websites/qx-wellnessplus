import EditableDocumentTag from "@/common/components/EditableDocumentTag";
import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import dmlToast from "@/common/configs/toaster.config";
import { compressFileToBase64 } from "@/utils/fileUpload";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Grid, Input, Radio, Text } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconUpload } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { stepSixteenTeenSchema } from "../schemas/stepSixteenSchema";

export type step16SchemaType = yup.InferType<typeof stepSixteenTeenSchema>;

interface StepSixteenProps {
  onNext: (data: step16SchemaType) => void;
  onBack: () => void;
  defaultValues?: step16SchemaType;
  isLoading?: boolean;
}

const StepSixteen = ({ onNext, onBack, defaultValues, isLoading = false }: StepSixteenProps) => {
  const [sema_previousRxDocument, setSema_previousRxDocument] = useState<string | null>();
  const [tirz_previousRxDocument, setTirz_previousRxDocument] = useState<string | null>();
  const [takenPrevSema_previousRxDocument, setTakenPrevSema_previousRxDocument] = useState<string | null>();
  const [takenPrevTirz_previousRxDocument, setTakenPrevTirz_previousRxDocument] = useState<string | null>();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<step16SchemaType>({
    defaultValues: {
      takenGlpMedication: defaultValues?.takenGlpMedication || "",
      heightWhenStartGlp: defaultValues?.heightWhenStartGlp || "",
      weightWhenStartGlp: defaultValues?.weightWhenStartGlp || "",
      currentWeightLossMedication: defaultValues?.currentWeightLossMedication || "",
      sema_lastWeightLossMedicationDoase: defaultValues?.sema_lastWeightLossMedicationDoase || "",
      sema_lastWeightLossMedicationDoaseOther: defaultValues?.sema_lastWeightLossMedicationDoaseOther || "",
      sema_hasPdfForPreviousRx: defaultValues?.sema_hasPdfForPreviousRx || "",
      sema_previousRxDocument: defaultValues?.sema_previousRxDocument || "",
      sema_previousRxDocName: defaultValues?.sema_previousRxDocName || "",
      tirz_lastWeightLossMedicationDoase: defaultValues?.tirz_lastWeightLossMedicationDoase || "",
      tirz_lastWeightLossMedicationDoaseOther: defaultValues?.tirz_lastWeightLossMedicationDoaseOther || "",
      tirz_hasPdfForPreviousRx: defaultValues?.tirz_hasPdfForPreviousRx || "",
      tirz_previousRxDocument: defaultValues?.tirz_previousRxDocument || "",
      tirz_previousRxDocName: defaultValues?.tirz_previousRxDocName || "",
      howLongTakeGlpMedication: defaultValues?.howLongTakeGlpMedication || "",
      howLongTakeGlpCurrentDosage: defaultValues?.howLongTakeGlpCurrentDosage || "",
      wouldYouLikeContinueGlpCurrentDosage: defaultValues?.wouldYouLikeContinueGlpCurrentDosage || "",
      stayCurrent_howLongTakeGlpCurrentDosage: defaultValues?.stayCurrent_howLongTakeGlpCurrentDosage || "",
      moveUp_wouldLikeToMoveUp: defaultValues?.moveUp_wouldLikeToMoveUp || "",
      haveTakenMedicationAsPrescribed: defaultValues?.haveTakenMedicationAsPrescribed || "",
      No_haveDeviated: defaultValues?.No_haveDeviated || "",
      glpSideEffect: defaultValues?.glpSideEffect || "",
      glpDrugEffectManageWeight: defaultValues?.glpDrugEffectManageWeight || "",
      glpHowLongTaken: defaultValues?.glpHowLongTaken || "",
      glpStartingHeight: defaultValues?.glpStartingHeight || "",
      glpStartingWeight: defaultValues?.glpStartingWeight || "",
      takenPrevGlpMedication: defaultValues?.takenPrevGlpMedication || "",
      takenPrevSema_lastDosage: defaultValues?.takenPrevSema_lastDosage || "",
      takenPrevSema_lastDosageOther: defaultValues?.takenPrevSema_lastDosageOther || "",
      takenPrevSema_hasPdfForPreviousRx: defaultValues?.takenPrevSema_hasPdfForPreviousRx || "",
      takenPrevSema_previousRxDocument: defaultValues?.takenPrevSema_previousRxDocument || "",
      takenPrevSema_previousRxDocName: defaultValues?.takenPrevSema_previousRxDocName || "",
      takenPrevTirz_lastWeightLossMedicationDoase: defaultValues?.takenPrevTirz_lastWeightLossMedicationDoase || "",
      takenPrevTirz_lastWeightLossMedicationDoaseOther: defaultValues?.takenPrevTirz_lastWeightLossMedicationDoaseOther || "",
      takenPrevTirz_hasPdfForPreviousRx: defaultValues?.takenPrevTirz_hasPdfForPreviousRx || "",
      takenPrevTirz_previousRxDocument: defaultValues?.takenPrevTirz_previousRxDocument || "",
      takenPrevTirz_previousRxDocName: defaultValues?.takenPrevTirz_previousRxDocName || "",
      takenPrevGlp_sideEffect: defaultValues?.takenPrevGlp_sideEffect || "",
      takenPrevGlp_howEffective: defaultValues?.takenPrevGlp_howEffective || "",
    },
    resolver: yupResolver(stepSixteenTeenSchema),
  });

  useEffect(() => {
    defaultValues?.sema_previousRxDocument && setSema_previousRxDocument(defaultValues.sema_previousRxDocument);
    defaultValues?.tirz_previousRxDocument && setTirz_previousRxDocument(defaultValues.tirz_previousRxDocument);
    defaultValues?.takenPrevSema_previousRxDocument && setTakenPrevSema_previousRxDocument(defaultValues.takenPrevSema_previousRxDocument);
    defaultValues?.takenPrevTirz_previousRxDocument && setTakenPrevTirz_previousRxDocument(defaultValues.takenPrevTirz_previousRxDocument);
  }, [defaultValues]);

  // Watch all necessary values
  const takenGlpMedication = watch("takenGlpMedication");
  const currentWeightLossMedication = watch("currentWeightLossMedication");
  const sema_lastWeightLossMedicationDoase = watch("sema_lastWeightLossMedicationDoase");
  const tirz_lastWeightLossMedicationDoase = watch("tirz_lastWeightLossMedicationDoase");
  const sema_hasPdfForPreviousRx = watch("sema_hasPdfForPreviousRx");
  const tirz_hasPdfForPreviousRx = watch("tirz_hasPdfForPreviousRx");
  const wouldYouLikeContinueGlpCurrentDosage = watch("wouldYouLikeContinueGlpCurrentDosage");
  const haveTakenMedicationAsPrescribed = watch("haveTakenMedicationAsPrescribed");
  const takenPrevGlpMedication = watch("takenPrevGlpMedication");
  const takenPrevSema_lastDosage = watch("takenPrevSema_lastDosage");
  const takenPrevTirz_lastWeightLossMedicationDoase = watch("takenPrevTirz_lastWeightLossMedicationDoase");
  const takenPrevSema_hasPdfForPreviousRx = watch("takenPrevSema_hasPdfForPreviousRx");
  const takenPrevTirz_hasPdfForPreviousRx = watch("takenPrevTirz_hasPdfForPreviousRx");
  const sema_previousRxDocName = watch("sema_previousRxDocName");
  const tirz_previousRxDocName = watch("tirz_previousRxDocName");
  const takenPrevSema_previousRxDocName = watch("takenPrevSema_previousRxDocName");
  const takenPrevTirz_previousRxDocName = watch("takenPrevTirz_previousRxDocName");
  const glpSideEffect = watch("glpSideEffect");
  const takenPrevGlp_sideEffect = watch("takenPrevGlp_sideEffect");

  // File upload handlers
  const handleUpFileForPrevRXOfSema = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setValue("sema_previousRxDocName", file.name);
      compressFileToBase64(files, (base64) => {
        setSema_previousRxDocument(base64);
        setValue("sema_previousRxDocument", base64);
      });
    }
  };

  const handleUpFileForPrevRXOfTirz = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setValue("tirz_previousRxDocName", file.name);
      compressFileToBase64(files, (base64) => {
        setTirz_previousRxDocument(base64);
        setValue("tirz_previousRxDocument", base64);
      });
    }
  };

  const handleUpFileForPrevRXOfPrevSema = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setValue("takenPrevSema_previousRxDocName", file.name);
      compressFileToBase64(files, (base64) => {
        setTakenPrevSema_previousRxDocument(base64);
        setValue("takenPrevSema_previousRxDocument", base64);
      });
    }
  };

  const handleUpFileForPrevRXOfPrevTirz = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setValue("takenPrevTirz_previousRxDocName", file.name);
      compressFileToBase64(files, (base64) => {
        setTakenPrevTirz_previousRxDocument(base64);
        setValue("takenPrevTirz_previousRxDocument", base64);
      });
    }
  };

  // File removal handlers
  const removeSemaPreviousRxDocument = () => {
    setValue("sema_previousRxDocName", "");
    setValue("sema_previousRxDocument", "");
    setSema_previousRxDocument(null);
  };

  const removeTirzPreviousRxDocument = () => {
    setValue("tirz_previousRxDocName", "");
    setValue("tirz_previousRxDocument", "");
    setTirz_previousRxDocument(null);
  };

  const removePrevSemaPreviousRxDocument = () => {
    setValue("takenPrevSema_previousRxDocName", "");
    setValue("takenPrevSema_previousRxDocument", "");
    setTakenPrevSema_previousRxDocument(null);
  };

  const removePrevTirzPreviousRxDocument = () => {
    setValue("takenPrevTirz_previousRxDocName", "");
    setValue("takenPrevTirz_previousRxDocument", "");
    setTakenPrevTirz_previousRxDocument(null);
  };

  // Helper function for radio selection
  const handleSelect = (field: keyof step16SchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  // Helper function for checkbox group
  const handleCheckboxChange = (field: keyof step16SchemaType, values: string[]) => {
    const valueString = values.join(", ");
    setValue(field, valueString, { shouldValidate: true });
    clearErrors(field);
  };

  return (
    <form
      id="step16Form"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      {/* Main GLP-1 Medication Question */}
      <Radio.Group
        value={takenGlpMedication}
        onChange={(value) => {
          handleSelect("takenGlpMedication", value);
          // Reset dependent fields when changing this value
          setValue("heightWhenStartGlp", "");
          setValue("weightWhenStartGlp", "");
          setValue("currentWeightLossMedication", "");
          setValue("sema_lastWeightLossMedicationDoase", "");
          setValue("sema_lastWeightLossMedicationDoaseOther", "");
          setValue("sema_hasPdfForPreviousRx", "");
          setValue("sema_previousRxDocument", "");
          setValue("tirz_lastWeightLossMedicationDoase", "");
          setValue("tirz_lastWeightLossMedicationDoaseOther", "");
          setValue("tirz_hasPdfForPreviousRx", "");
          setValue("tirz_previousRxDocument", "");
          setValue("howLongTakeGlpMedication", "");
          setValue("howLongTakeGlpCurrentDosage", "");
          setValue("wouldYouLikeContinueGlpCurrentDosage", "");
          setValue("stayCurrent_howLongTakeGlpCurrentDosage", "");
          setValue("moveUp_wouldLikeToMoveUp", "");
          setValue("haveTakenMedicationAsPrescribed", "");
          setValue("No_haveDeviated", "");
          setValue("glpHowLongTaken", "");
          setValue("glpStartingHeight", "");
          setValue("glpStartingWeight", "");
          setValue("takenPrevGlpMedication", "");
          setValue("takenPrevSema_lastDosage", "");
          setValue("takenPrevSema_lastDosageOther", "");
          setValue("takenPrevSema_hasPdfForPreviousRx", "");
          setValue("takenPrevSema_previousRxDocument", "");
          setValue("takenPrevTirz_lastWeightLossMedicationDoase", "");
          setValue("sema_previousRxDocName", "");
          setValue("tirz_previousRxDocName", "");
          setValue("takenPrevSema_previousRxDocName", "");
          setValue("takenPrevTirz_previousRxDocName", "");
          setSema_previousRxDocument(null);
          setTirz_previousRxDocument(null);
          setTakenPrevSema_previousRxDocument(null);
          setTakenPrevTirz_previousRxDocument(null);
        }}
        label="Have you taken a GLP-1 medication?"
        error={getErrorMessage(errors?.takenGlpMedication)}
        classNames={{
          root: "sm:!grid !block",
          error: "sm:!text-end !text-start w-full",
          label: "sm:!text-3xl pb-2",
        }}
      >
        <div className="grid grid-cols-1 gap-5">
          {["Yes", "Not within 30 days, but previously", "I have never taken GLPs"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(takenGlpMedication, option)}
              label={
                <div className="relative text-center w-full">
                  <span className="text-foreground font-poppins">{option}</span>
                  {takenGlpMedication === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white absolute top-1/2 right-3 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
      </Radio.Group>

      {/* Yes Path */}
      {takenGlpMedication === "Yes" && (
        <>
          {/* Height and Weight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input.Wrapper
              label="What was your height when you started the GLP-1 medication? (In inches)"
              error={getErrorMessage(errors?.heightWhenStartGlp)}
            >
              <Input
                {...register("heightWhenStartGlp")}
                className="border-grey rounded-lg"
              />
            </Input.Wrapper>

            <Input.Wrapper
              label="What was your weight when you started the GLP-1 medication? (In pounds)"
              error={getErrorMessage(errors?.weightWhenStartGlp)}
            >
              <Input
                {...register("weightWhenStartGlp")}
                placeholder="e.g., 170 lbs"
                className="border-grey rounded-lg"
              />
            </Input.Wrapper>
          </div>

          {/* Current Weight Loss Medication */}
          <Radio.Group
            value={currentWeightLossMedication}
            onChange={(value) => {
              handleSelect("currentWeightLossMedication", value);
              // Reset dependent fields
              setValue("sema_lastWeightLossMedicationDoase", "");
              setValue("sema_lastWeightLossMedicationDoaseOther", "");
              setValue("sema_hasPdfForPreviousRx", "");
              setValue("sema_previousRxDocument", "");
              setValue("tirz_lastWeightLossMedicationDoase", "");
              setValue("tirz_lastWeightLossMedicationDoaseOther", "");
              setValue("tirz_hasPdfForPreviousRx", "");
              setValue("tirz_previousRxDocument", "");
              setValue("sema_previousRxDocName", "");
              setValue("tirz_previousRxDocName", "");
              setSema_previousRxDocument(null);
              setTirz_previousRxDocument(null);
            }}
            label="Which weight loss medication are you currently taking?"
            error={getErrorMessage(errors?.currentWeightLossMedication)}
            classNames={{
              root: "sm:!grid !block",
              error: "sm:!text-end !text-start w-full",
              label: "sm:!text-3xl pb-2",
            }}
          >
            <div className="grid grid-cols-1 gap-5">
              {["Semaglutide (Wegovy, Ozempic, Generic)", "Tirzepatide (Mounjaro, Zepbound, Generic)", "Liraglutide (Saxenda)", "Other Weight Loss Medication"].map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(currentWeightLossMedication, option)}
                  label={
                    <div className="relative text-center w-full">
                      <span className="text-foreground font-poppins">{option}</span>
                      {currentWeightLossMedication === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white absolute top-1/2 right-3 -translate-y-1/2">
                          <i className="icon-tick text-sm/none"></i>
                        </span>
                      )}
                    </div>
                  }
                />
              ))}
            </div>
          </Radio.Group>

          {/* Semaglutide Section */}
          {currentWeightLossMedication === "Semaglutide (Wegovy, Ozempic, Generic)" && (
            <>
              <Radio.Group
                value={sema_lastWeightLossMedicationDoase}
                onChange={(value) => handleSelect("sema_lastWeightLossMedicationDoase", value)}
                label="What was the last dosage you took?"
                error={getErrorMessage(errors?.sema_lastWeightLossMedicationDoase)}
                classNames={{
                  root: "sm:!grid !block",
                  error: "sm:!text-end !text-start w-full",
                  label: "sm:!text-3xl pb-2",
                }}
              >
                <div className="grid grid-cols-1 gap-5">
                  {["0.25mg weekly", "0.5mg weekly", "0.75mg weekly", "1mg weekly", "1.5mg weekly", "1.7mg weekly", "2mg weekly", "2.5mg weekly", "Other"].map((option) => (
                    <Radio
                      key={option}
                      value={option}
                      classNames={getBaseWebRadios(sema_lastWeightLossMedicationDoase, option)}
                      label={
                        <div className="relative text-center w-full">
                          <span className="text-foreground font-poppins">{option}</span>
                          {sema_lastWeightLossMedicationDoase === option && (
                            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white absolute top-1/2 right-3 -translate-y-1/2">
                              <i className="icon-tick text-sm/none"></i>
                            </span>
                          )}
                        </div>
                      }
                    />
                  ))}
                </div>
              </Radio.Group>

              {sema_lastWeightLossMedicationDoase === "Other" && (
                <Input.Wrapper
                  label="Specify dosage"
                  error={getErrorMessage(errors?.sema_lastWeightLossMedicationDoaseOther)}
                >
                  <Input
                    {...register("sema_lastWeightLossMedicationDoaseOther")}
                    className="border-grey rounded-lg"
                  />
                </Input.Wrapper>
              )}

              <Radio.Group
                value={sema_hasPdfForPreviousRx}
                onChange={(value) => {
                  handleSelect("sema_hasPdfForPreviousRx", value);
                  if (value === "No") {
                    removeSemaPreviousRxDocument();
                  }
                }}
                label="Do you have a PDF of your previous script, or a picture of your current vial?"
                error={getErrorMessage(errors?.sema_hasPdfForPreviousRx)}
                classNames={{
                  root: "sm:!grid !block",
                  error: "sm:!text-end !text-start w-full",
                  label: "sm:!text-3xl pb-2",
                }}
              >
                <div className="grid grid-cols-2 gap-5">
                  {["Yes", "No"].map((option) => (
                    <Radio
                      key={option}
                      value={option}
                      classNames={getBaseWebRadios(sema_hasPdfForPreviousRx, option)}
                      label={
                        <div className="relative text-center w-full">
                          <span className="text-foreground font-poppins">{option}</span>
                          {sema_hasPdfForPreviousRx === option && (
                            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white absolute top-1/2 right-3 -translate-y-1/2">
                              <i className="icon-tick text-sm/none"></i>
                            </span>
                          )}
                        </div>
                      }
                    />
                  ))}
                </div>
              </Radio.Group>

              {sema_hasPdfForPreviousRx === "Yes" && (
                <div className="space-y-4">
                  <Text className="text-foreground font-poppins !text-3xl">Please upload your script or a picture of your current vial.</Text>
                  {!sema_previousRxDocument ? (
                    <Dropzone
                      onDrop={(files) => handleUpFileForPrevRXOfSema(files)}
                      onReject={(rejectedFiles) => {
                        if (rejectedFiles?.[0]?.errors?.[0]?.code == "file-too-large") {
                          dmlToast.error({ title: "File size should be less than 2MB." });
                        }
                      }}
                      accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.pdf]}
                      multiple={false}
                      className="border-dashed border-gray-300 rounded-lg bg-gray-50 min-h-[220px] flex items-center justify-center"
                    >
                      <div className="flex flex-col items-center gap-4">
                        <IconUpload
                          size={52}
                          stroke={1.5}
                        />
                        <Text>Drag & drop or click to upload</Text>
                      </div>
                    </Dropzone>
                  ) : (
                    <EditableDocumentTag
                      docName={sema_previousRxDocName || ""}
                      removable={true}
                      leftIconClass="icon-pdf"
                      onRemove={() => removeSemaPreviousRxDocument()}
                    />
                  )}
                  {errors?.sema_previousRxDocument?.message && <Text className="text-sm text-red-500">{errors.sema_previousRxDocument.message}</Text>}
                </div>
              )}
            </>
          )}

          {/* Tirzepatide Section */}
          {currentWeightLossMedication === "Tirzepatide (Mounjaro, Zepbound, Generic)" && (
            <>
              <Radio.Group
                value={tirz_lastWeightLossMedicationDoase}
                onChange={(value) => handleSelect("tirz_lastWeightLossMedicationDoase", value)}
                label="What was the last dosage you took?"
                error={getErrorMessage(errors?.tirz_lastWeightLossMedicationDoase)}
                classNames={{
                  root: "sm:!grid !block",
                  error: "sm:!text-end !text-start w-full",
                  label: "sm:!text-3xl pb-2",
                }}
              >
                <div className="grid grid-cols-1 gap-5">
                  {["2.5mg weekly", "5mg weekly", "7.5mg weekly", "10mg weekly", "12.5mg weekly", "15mg weekly", "Other"].map((option) => (
                    <Radio
                      key={option}
                      value={option}
                      classNames={getBaseWebRadios(tirz_lastWeightLossMedicationDoase, option)}
                      label={
                        <div className="relative text-center w-full">
                          <span className="text-foreground font-poppins">{option}</span>
                          {tirz_lastWeightLossMedicationDoase === option && (
                            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white absolute top-1/2 right-3 -translate-y-1/2">
                              <i className="icon-tick text-sm/none"></i>
                            </span>
                          )}
                        </div>
                      }
                    />
                  ))}
                </div>
              </Radio.Group>

              {tirz_lastWeightLossMedicationDoase === "Other" && (
                <Input.Wrapper
                  label="Specify dosage"
                  error={getErrorMessage(errors?.tirz_lastWeightLossMedicationDoaseOther)}
                >
                  <Input
                    {...register("tirz_lastWeightLossMedicationDoaseOther")}
                    className="border-grey rounded-lg"
                  />
                </Input.Wrapper>
              )}

              <Radio.Group
                value={tirz_hasPdfForPreviousRx}
                onChange={(value) => {
                  handleSelect("tirz_hasPdfForPreviousRx", value);
                  if (value === "No") {
                    removeTirzPreviousRxDocument();
                  }
                }}
                label="Do you have a PDF of your previous script, or a picture of your current vial?"
                error={getErrorMessage(errors?.tirz_hasPdfForPreviousRx)}
                classNames={{
                  root: "sm:!grid !block",
                  error: "sm:!text-end !text-start w-full",
                  label: "sm:!text-3xl pb-2",
                }}
              >
                <div className="grid grid-cols-2 gap-5">
                  {["Yes", "No"].map((option) => (
                    <Radio
                      key={option}
                      value={option}
                      classNames={getBaseWebRadios(tirz_hasPdfForPreviousRx, option)}
                      label={
                        <div className="relative text-center w-full">
                          <span className="text-foreground font-poppins">{option}</span>
                          {tirz_hasPdfForPreviousRx === option && (
                            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white absolute top-1/2 right-3 -translate-y-1/2">
                              <i className="icon-tick text-sm/none"></i>
                            </span>
                          )}
                        </div>
                      }
                    />
                  ))}
                </div>
              </Radio.Group>

              {tirz_hasPdfForPreviousRx === "Yes" && (
                <div className="space-y-4">
                  <Text className="text-foreground font-poppins !text-3xl">Please upload your script or a picture of your current vial.</Text>
                  {!tirz_previousRxDocument ? (
                    <Dropzone
                      onDrop={(files) => handleUpFileForPrevRXOfTirz(files)}
                      onReject={(rejectedFiles) => {
                        if (rejectedFiles?.[0]?.errors?.[0]?.code == "file-too-large") {
                          dmlToast.error({ title: "File size should be less than 2MB." });
                        }
                      }}
                      accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.pdf]}
                      multiple={false}
                      className="border-dashed border-gray-300 rounded-lg bg-gray-50 min-h-[220px] flex items-center justify-center"
                    >
                      <div className="flex flex-col items-center gap-4">
                        <IconUpload
                          size={52}
                          stroke={1.5}
                        />
                        <Text>Drag & drop or click to upload</Text>
                      </div>
                    </Dropzone>
                  ) : (
                    <EditableDocumentTag
                      docName={tirz_previousRxDocName || ""}
                      removable={true}
                      leftIconClass="icon-pdf"
                      onRemove={() => removeTirzPreviousRxDocument()}
                    />
                  )}
                  {errors?.tirz_previousRxDocument?.message && <Text className="text-sm text-red-500">{errors.tirz_previousRxDocument.message}</Text>}
                </div>
              )}
            </>
          )}

          {/* How long taking medication */}
          <Radio.Group
            value={watch("howLongTakeGlpMedication")}
            onChange={(value) => handleSelect("howLongTakeGlpMedication", value)}
            label="How long have you been taking the medication consecutively?"
            error={getErrorMessage(errors?.howLongTakeGlpMedication)}
            classNames={{
              root: "sm:!grid !block",
              error: "sm:!text-end !text-start w-full",
              label: "sm:!text-3xl pb-2",
            }}
          >
            <div className="grid grid-cols-1 gap-5">
              {["One Month", "Two Months", "Three Months", "Four Months", "Five Months", "Six Months", "More than Six Months"].map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(watch("howLongTakeGlpMedication"), option)}
                  label={
                    <div className="relative text-center w-full">
                      <span className="text-foreground font-poppins">{option}</span>
                      {watch("howLongTakeGlpMedication") === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white absolute top-1/2 right-3 -translate-y-1/2">
                          <i className="icon-tick text-sm/none"></i>
                        </span>
                      )}
                    </div>
                  }
                />
              ))}
            </div>
          </Radio.Group>

          {/* Current dose duration */}
          <Radio.Group
            value={watch("howLongTakeGlpCurrentDosage")}
            onChange={(value) => handleSelect("howLongTakeGlpCurrentDosage", value)}
            label="How long have you been on your current dose?"
            error={getErrorMessage(errors?.howLongTakeGlpCurrentDosage)}
            classNames={{
              root: "sm:!grid !block",
              error: "sm:!text-end !text-start w-full",
              label: "sm:!text-3xl pb-2",
            }}
          >
            <div className="grid grid-cols-1 gap-5">
              {["Less than one month", "One Month", "Two Months", "Three Months", "Four Months", "Five Months", "Six Months", "More than Six Months"].map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(watch("howLongTakeGlpCurrentDosage"), option)}
                  label={
                    <div className="relative text-center w-full">
                      <span className="text-foreground font-poppins">{option}</span>
                      {watch("howLongTakeGlpCurrentDosage") === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white absolute top-1/2 right-3 -translate-y-1/2">
                          <i className="icon-tick text-sm/none"></i>
                        </span>
                      )}
                    </div>
                  }
                />
              ))}
            </div>
          </Radio.Group>

          {/* Continue current dose */}
          <Radio.Group
            value={wouldYouLikeContinueGlpCurrentDosage}
            onChange={(value) => handleSelect("wouldYouLikeContinueGlpCurrentDosage", value)}
            label="Would you like to continue your current dose, move up to the next dose, or titrate down?"
            error={getErrorMessage(errors?.wouldYouLikeContinueGlpCurrentDosage)}
            classNames={{
              root: "sm:!grid !block",
              error: "sm:!text-end !text-start w-full",
              label: "sm:!text-3xl pb-2",
            }}
          >
            <div className="grid grid-cols-1 gap-5">
              {["Stay on current dose", "Move up", "Titrate down"].map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(wouldYouLikeContinueGlpCurrentDosage, option)}
                  label={
                    <div className="relative text-center w-full">
                      <span className="text-foreground font-poppins">{option}</span>
                      {wouldYouLikeContinueGlpCurrentDosage === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white absolute top-1/2 right-3 -translate-y-1/2">
                          <i className="icon-tick text-sm/none"></i>
                        </span>
                      )}
                    </div>
                  }
                />
              ))}
            </div>
          </Radio.Group>

          {/* Stay current options */}
          {wouldYouLikeContinueGlpCurrentDosage === "Stay on current dose" && (
            <Radio.Group
              value={watch("stayCurrent_howLongTakeGlpCurrentDosage")}
              onChange={(value) => handleSelect("stayCurrent_howLongTakeGlpCurrentDosage", value)}
              label="How long would you like to stay on your current dose?"
              error={getErrorMessage(errors?.stayCurrent_howLongTakeGlpCurrentDosage)}
              classNames={{
                root: "sm:!grid !block",
                error: "sm:!text-end !text-start w-full",
                label: "sm:!text-3xl pb-2",
              }}
            >
              <div className="grid grid-cols-1 gap-5">
                {["One month, then titrate up the next two months", "Two months, then titrate up the third month", "All three months"].map((option) => (
                  <Radio
                    key={option}
                    value={option}
                    classNames={getBaseWebRadios(watch("stayCurrent_howLongTakeGlpCurrentDosage"), option)}
                    label={
                      <div className="relative text-center w-full">
                        <span className="text-foreground font-poppins">{option}</span>
                        {watch("stayCurrent_howLongTakeGlpCurrentDosage") === option && (
                          <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white absolute top-1/2 right-3 -translate-y-1/2">
                            <i className="icon-tick text-sm/none"></i>
                          </span>
                        )}
                      </div>
                    }
                  />
                ))}
              </div>
            </Radio.Group>
          )}

          {/* Move up options */}
          {wouldYouLikeContinueGlpCurrentDosage === "Move up" && (
            <Radio.Group
              value={watch("moveUp_wouldLikeToMoveUp")}
              onChange={(value) => handleSelect("moveUp_wouldLikeToMoveUp", value)}
              label="How would you like to move up your dose?"
              error={getErrorMessage(errors?.moveUp_wouldLikeToMoveUp)}
              classNames={{
                root: "sm:!grid !block",
                error: "sm:!text-end !text-start w-full",
                label: "sm:!text-3xl pb-2",
              }}
            >
              <div className="grid grid-cols-1 gap-5">
                {[
                  "Increase dosage monthly (regular schedule)",
                  "Increase dose the first month, then maintain that dose",
                  "Increase dose each month for 2 months, then maintain",
                  "Increase dose every other month until max dose",
                ].map((option) => (
                  <Radio
                    key={option}
                    value={option}
                    classNames={getBaseWebRadios(watch("moveUp_wouldLikeToMoveUp"), option)}
                    label={
                      <div className="relative text-center w-full">
                        <span className="text-foreground font-poppins">{option}</span>
                        {watch("moveUp_wouldLikeToMoveUp") === option && (
                          <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white absolute top-1/2 right-3 -translate-y-1/2">
                            <i className="icon-tick text-sm/none"></i>
                          </span>
                        )}
                      </div>
                    }
                  />
                ))}
              </div>
            </Radio.Group>
          )}

          {/* Taken as prescribed */}
          <Radio.Group
            value={haveTakenMedicationAsPrescribed}
            onChange={(value) => handleSelect("haveTakenMedicationAsPrescribed", value)}
            label="Have you taken the medication as prescribed?"
            error={getErrorMessage(errors?.haveTakenMedicationAsPrescribed)}
            classNames={{
              root: "sm:!grid !block",
              error: "sm:!text-end !text-start w-full",
              label: "sm:!text-3xl pb-2",
            }}
          >
            <div className="grid grid-cols-2 gap-5">
              {["Yes", "No"].map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(watch("haveTakenMedicationAsPrescribed"), option)}
                  label={
                    <div className="relative text-center w-full">
                      <span className="text-foreground font-poppins">{option}</span>
                      {haveTakenMedicationAsPrescribed === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white absolute top-1/2 right-3 -translate-y-1/2">
                          <i className="icon-tick text-sm/none"></i>
                        </span>
                      )}
                    </div>
                  }
                />
              ))}
            </div>
          </Radio.Group>

          {/* Deviation explanation */}
          {haveTakenMedicationAsPrescribed === "No" && (
            <Input.Wrapper
              label="Please explain how you have deviated from the dosing instructions"
              error={getErrorMessage(errors?.No_haveDeviated)}
            >
              <Input
                {...register("No_haveDeviated")}
                className="border-grey rounded-lg"
              />
            </Input.Wrapper>
          )}

          {/* Side effects */}
          <div className="space-y-4">
            <Text className="text-foreground font-poppins !text-3xl">Have you experienced any of the following side effects?</Text>
            <Grid
              gutter="md"
              className="mt-4"
            >
              {["Nausea", "Vomiting", "Diarrhea", "Constipation", "Reduced Appetite", "Depression", "Suicidal thoughts", "Hair loss", "No side effects", "Other"].map((option) => {
                const isChecked = glpSideEffect ? glpSideEffect.split(", ").includes(option) : false;
                return (
                  <Grid.Col
                    span={6}
                    key={option}
                  >
                    <div
                      onClick={() => {
                        const currentValues = glpSideEffect ? glpSideEffect.split(", ") : [];
                        const updatedValues = isChecked ? currentValues.filter((v) => v !== option) : [...currentValues, option];
                        setValue("glpSideEffect", updatedValues.join(", "), { shouldValidate: true });
                      }}
                      className={`cursor-pointer border rounded-2xl px-6 py-4 flex justify-between items-center transition-all ${
                        isChecked ? "border-primary bg-white text-black shadow-sm" : "border-gray-300 bg-transparent text-black"
                      }`}
                    >
                      <span className="text-base font-medium font-poppins">{option}</span>
                      <Checkbox
                        checked={isChecked}
                        readOnly
                        size="md"
                        radius="md"
                        classNames={{
                          input: isChecked ? "bg-primary border-primary text-white" : "bg-transparent",
                        }}
                      />
                    </div>
                  </Grid.Col>
                );
              })}
            </Grid>
            {errors?.glpSideEffect?.message && <div className="text-danger text-sm mt-2 text-center">{errors.glpSideEffect.message}</div>}
          </div>

          <div className="space-y-4">
            <Text className="text-foreground font-poppins !text-3xl">Did you experience any of the following side effects?</Text>
            <Grid
              gutter="md"
              className="mt-4"
            >
              {["Nausea", "Vomiting", "Diarrhea", "Constipation", "Reduced Appetite", "Depression", "Suicidal thoughts", "Hair loss", "No side effects", "Other"].map((option) => {
                const isChecked = takenPrevGlp_sideEffect ? takenPrevGlp_sideEffect.split(", ").includes(option) : false;
                return (
                  <Grid.Col
                    span={6}
                    key={option}
                  >
                    <div
                      onClick={() => {
                        const currentValues = takenPrevGlp_sideEffect ? takenPrevGlp_sideEffect.split(", ") : [];
                        const updatedValues = isChecked ? currentValues.filter((v) => v !== option) : [...currentValues, option];
                        setValue("takenPrevGlp_sideEffect", updatedValues.join(", "), { shouldValidate: true });
                      }}
                      className={`cursor-pointer border rounded-2xl px-6 py-4 flex justify-between items-center transition-all ${
                        isChecked ? "border-primary bg-white text-black shadow-sm" : "border-gray-300 bg-transparent text-black"
                      }`}
                    >
                      <span className="text-base font-medium font-poppins">{option}</span>
                      <Checkbox
                        checked={isChecked}
                        readOnly
                        size="md"
                        radius="md"
                        classNames={{
                          input: isChecked ? "bg-primary border-primary text-white" : "bg-transparent",
                        }}
                      />
                    </div>
                  </Grid.Col>
                );
              })}
            </Grid>
            {errors?.takenPrevGlp_sideEffect?.message && <div className="text-danger text-sm mt-2 text-center">{errors.takenPrevGlp_sideEffect.message}</div>}
          </div>

          {/* Effectiveness */}
          <Radio.Group
            value={watch("glpDrugEffectManageWeight")}
            onChange={(value) => handleSelect("glpDrugEffectManageWeight", value)}
            label="How effective do you feel the medication has been in managing your weight"
            error={getErrorMessage(errors?.glpDrugEffectManageWeight)}
            classNames={{
              root: "sm:!grid !block",
              error: "sm:!text-end !text-start w-full",
              label: "sm:!text-3xl pb-2",
            }}
          >
            <div className="grid grid-cols-1 gap-5">
              {["Very Effective", "Somewhat Effective", "Not Effective"].map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(watch("glpDrugEffectManageWeight"), option)}
                  label={
                    <div className="relative text-center w-full">
                      <span className="text-foreground font-poppins">{option}</span>
                      {watch("glpDrugEffectManageWeight") === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white absolute top-1/2 right-3 -translate-y-1/2">
                          <i className="icon-tick text-sm/none"></i>
                        </span>
                      )}
                    </div>
                  }
                />
              ))}
            </div>
          </Radio.Group>
        </>
      )}

      {/* Not within 30 days, but previously Path */}
      {takenGlpMedication === "Not within 30 days, but previously" && (
        <>
          {/* Time since stopping */}
          <Radio.Group
            value={watch("glpHowLongTaken")}
            onChange={(value) => handleSelect("glpHowLongTaken", value)}
            label="How long has it been since you stopped taking your GLP medication"
            error={getErrorMessage(errors?.glpHowLongTaken)}
            classNames={{
              root: "sm:!grid !block",
              error: "sm:!text-end !text-start w-full",
              label: "sm:!text-3xl pb-2",
            }}
          >
            <div className="grid grid-cols-1 gap-5">
              {["2-5 months", "6-9 months", "10-11 months", "12+ months"].map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(watch("glpHowLongTaken"), option)}
                  label={
                    <div className="relative text-center w-full">
                      <span className="text-foreground font-poppins">{option}</span>
                      {watch("glpHowLongTaken") === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white absolute top-1/2 right-3 -translate-y-1/2">
                          <i className="icon-tick text-sm/none"></i>
                        </span>
                      )}
                    </div>
                  }
                />
              ))}
            </div>
          </Radio.Group>

          {/* Height and Weight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input.Wrapper
              label="What was your height when you started the GLP-1 medication? (In inches)"
              error={getErrorMessage(errors?.glpStartingHeight)}
            >
              <Input
                {...register("glpStartingHeight")}
                className="border-grey rounded-lg"
              />
            </Input.Wrapper>

            <Input.Wrapper
              label="What was your weight when you started the GLP-1 medication? (In Pounds)"
              error={getErrorMessage(errors?.glpStartingWeight)}
            >
              <Input
                {...register("glpStartingWeight")}
                placeholder="e.g., 170 lbs"
                className="border-grey rounded-lg"
              />
            </Input.Wrapper>
          </div>

          {/* Previous GLP medication */}
          <Radio.Group
            value={takenPrevGlpMedication}
            onChange={(value) => {
              handleSelect("takenPrevGlpMedication", value);
              // Reset dependent fields
              setValue("takenPrevSema_lastDosage", "");
              setValue("takenPrevSema_lastDosageOther", "");
              setValue("takenPrevSema_hasPdfForPreviousRx", "");
              setValue("takenPrevSema_previousRxDocument", "");
              setValue("takenPrevTirz_lastWeightLossMedicationDoase", "");
              setValue("takenPrevTirz_lastWeightLossMedicationDoaseOther", "");
              setValue("takenPrevTirz_hasPdfForPreviousRx", "");
              setValue("takenPrevTirz_previousRxDocument", "");
              setValue("takenPrevSema_previousRxDocName", "");
              setValue("takenPrevTirz_previousRxDocName", "");
              setTakenPrevSema_previousRxDocument(null);
              setTakenPrevTirz_previousRxDocument(null);
            }}
            label="What GLP medication have you previously taken?"
            error={getErrorMessage(errors?.takenPrevGlpMedication)}
            classNames={{
              root: "sm:!grid !block",
              error: "sm:!text-end !text-start w-full",
              label: "sm:!text-3xl pb-2",
            }}
          >
            <div className="grid grid-cols-1 gap-5">
              {["Semaglutide (Wegovy, Ozempic, Generic)", "Tirzepatide (Mounjaro, Zepbound, Generic)", "Liraglutide (Saxenda)", "Other Weight Loss Medication"].map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(takenPrevGlpMedication, option)}
                  label={
                    <div className="relative text-center w-full">
                      <span className="text-foreground font-poppins">{option}</span>
                      {takenPrevGlpMedication === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white absolute top-1/2 right-3 -translate-y-1/2">
                          <i className="icon-tick text-sm/none"></i>
                        </span>
                      )}
                    </div>
                  }
                />
              ))}
            </div>
          </Radio.Group>

          {/* Previous Semaglutide Section */}
          {takenPrevGlpMedication === "Semaglutide (Wegovy, Ozempic, Generic)" && (
            <>
              <Radio.Group
                value={takenPrevSema_lastDosage}
                onChange={(value) => handleSelect("takenPrevSema_lastDosage", value)}
                label="What was the last dosage you took?"
                error={getErrorMessage(errors?.takenPrevSema_lastDosage)}
                classNames={{
                  root: "sm:!grid !block",
                  error: "sm:!text-end !text-start w-full",
                  label: "sm:!text-3xl pb-2",
                }}
              >
                <div className="grid grid-cols-1 gap-5">
                  {["0.25mg weekly", "0.5mg weekly", "0.75mg weekly", "1mg weekly", "1.5mg weekly", "1.7mg weekly", "2mg weekly", "2.5mg weekly", "Other"].map((option) => (
                    <Radio
                      key={option}
                      value={option}
                      classNames={getBaseWebRadios(takenPrevSema_lastDosage, option)}
                      label={
                        <div className="relative text-center w-full">
                          <span className="text-foreground font-poppins">{option}</span>
                          {takenPrevSema_lastDosage === option && (
                            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white absolute top-1/2 right-3 -translate-y-1/2">
                              <i className="icon-tick text-sm/none"></i>
                            </span>
                          )}
                        </div>
                      }
                    />
                  ))}
                </div>
              </Radio.Group>

              {takenPrevSema_lastDosage === "Other" && (
                <Input.Wrapper
                  label="Specify dosage"
                  error={getErrorMessage(errors?.takenPrevSema_lastDosageOther)}
                >
                  <Input
                    {...register("takenPrevSema_lastDosageOther")}
                    className="border-grey rounded-lg"
                  />
                </Input.Wrapper>
              )}

              <Radio.Group
                value={takenPrevSema_hasPdfForPreviousRx}
                onChange={(value) => {
                  handleSelect("takenPrevSema_hasPdfForPreviousRx", value);
                  if (value === "No") {
                    removePrevSemaPreviousRxDocument();
                  }
                }}
                label="Do you have a PDF of your previous script, or a picture of your current vial?"
                error={getErrorMessage(errors?.takenPrevSema_hasPdfForPreviousRx)}
                classNames={{
                  root: "sm:!grid !block",
                  error: "sm:!text-end !text-start w-full",
                  label: "sm:!text-3xl pb-2",
                }}
              >
                <div className="grid grid-cols-2 gap-5">
                  {["Yes", "No"].map((option) => (
                    <Radio
                      key={option}
                      value={option}
                      classNames={getBaseWebRadios(takenPrevSema_hasPdfForPreviousRx, option)}
                      label={
                        <div className="relative text-center w-full">
                          <span className="text-foreground font-poppins">{option}</span>
                          {takenPrevSema_hasPdfForPreviousRx === option && (
                            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white absolute top-1/2 right-3 -translate-y-1/2">
                              <i className="icon-tick text-sm/none"></i>
                            </span>
                          )}
                        </div>
                      }
                    />
                  ))}
                </div>
              </Radio.Group>

              {takenPrevSema_hasPdfForPreviousRx === "Yes" && (
                <div className="space-y-4">
                  <Text className="text-foreground font-poppins !text-3xl">Please upload your script or a picture of your current vial.</Text>
                  {!takenPrevSema_previousRxDocument ? (
                    <Dropzone
                      onDrop={(files) => handleUpFileForPrevRXOfPrevSema(files)}
                      onReject={(rejectedFiles) => {
                        if (rejectedFiles?.[0]?.errors?.[0]?.code == "file-too-large") {
                          dmlToast.error({ title: "File size should be less than 2MB." });
                        }
                      }}
                      accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.pdf]}
                      multiple={false}
                      className="border-dashed border-gray-300 rounded-lg bg-gray-50 min-h-[220px] flex items-center justify-center"
                    >
                      <div className="flex flex-col items-center gap-4">
                        <IconUpload
                          size={52}
                          stroke={1.5}
                        />
                        <Text>Drag & drop or click to upload</Text>
                      </div>
                    </Dropzone>
                  ) : (
                    <EditableDocumentTag
                      docName={takenPrevSema_previousRxDocName || ""}
                      removable={true}
                      leftIconClass="icon-pdf"
                      onRemove={() => removePrevSemaPreviousRxDocument()}
                    />
                  )}
                  {errors?.takenPrevSema_previousRxDocument?.message && <Text className="text-sm text-red-500">{errors.takenPrevSema_previousRxDocument.message}</Text>}
                </div>
              )}
            </>
          )}

          {/* Previous Tirzepatide Section */}
          {takenPrevGlpMedication === "Tirzepatide (Mounjaro, Zepbound, Generic)" && (
            <>
              <Radio.Group
                value={takenPrevTirz_lastWeightLossMedicationDoase}
                onChange={(value) => handleSelect("takenPrevTirz_lastWeightLossMedicationDoase", value)}
                label="What was the last dosage you took?"
                error={getErrorMessage(errors?.takenPrevTirz_lastWeightLossMedicationDoase)}
                classNames={{
                  root: "sm:!grid !block",
                  error: "sm:!text-end !text-start w-full",
                  label: "sm:!text-3xl pb-2",
                }}
              >
                <div className="grid grid-cols-1 gap-5">
                  {["2.5mg weekly", "5mg weekly", "7.5mg weekly", "10mg weekly", "12.5mg weekly", "15mg weekly", "Other"].map((option) => (
                    <Radio
                      key={option}
                      value={option}
                      classNames={getBaseWebRadios(takenPrevTirz_lastWeightLossMedicationDoase, option)}
                      label={
                        <div className="relative text-center w-full">
                          <span className="text-foreground font-poppins">{option}</span>
                          {takenPrevTirz_lastWeightLossMedicationDoase === option && (
                            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white absolute top-1/2 right-3 -translate-y-1/2">
                              <i className="icon-tick text-sm/none"></i>
                            </span>
                          )}
                        </div>
                      }
                    />
                  ))}
                </div>
              </Radio.Group>

              {takenPrevTirz_lastWeightLossMedicationDoase === "Other" && (
                <Input.Wrapper
                  label="Specify dosage"
                  error={getErrorMessage(errors?.takenPrevTirz_lastWeightLossMedicationDoaseOther)}
                >
                  <Input
                    {...register("takenPrevTirz_lastWeightLossMedicationDoaseOther")}
                    className="border-grey rounded-lg"
                  />
                </Input.Wrapper>
              )}

              <Radio.Group
                value={takenPrevTirz_hasPdfForPreviousRx}
                onChange={(value) => {
                  handleSelect("takenPrevTirz_hasPdfForPreviousRx", value);
                  if (value === "No") {
                    removePrevTirzPreviousRxDocument();
                  }
                }}
                label="Do you have a PDF of your previous script, or a picture of your current vial?"
                error={getErrorMessage(errors?.takenPrevTirz_hasPdfForPreviousRx)}
                classNames={{
                  root: "sm:!grid !block",
                  error: "sm:!text-end !text-start w-full",
                  label: "sm:!text-3xl pb-2",
                }}
              >
                <div className="grid grid-cols-2 gap-5">
                  {["Yes", "No"].map((option) => (
                    <Radio
                      key={option}
                      value={option}
                      classNames={getBaseWebRadios(takenPrevTirz_hasPdfForPreviousRx, option)}
                      label={
                        <div className="relative text-center w-full">
                          <span className="text-foreground font-poppins">{option}</span>
                          {takenPrevTirz_hasPdfForPreviousRx === option && (
                            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white absolute top-1/2 right-3 -translate-y-1/2">
                              <i className="icon-tick text-sm/none"></i>
                            </span>
                          )}
                        </div>
                      }
                    />
                  ))}
                </div>
              </Radio.Group>

              {takenPrevTirz_hasPdfForPreviousRx === "Yes" && (
                <div className="space-y-4">
                  <Text className="text-foreground font-poppins !text-3xl">Please upload your script or a picture of your current vial.</Text>
                  {!takenPrevTirz_previousRxDocument ? (
                    <Dropzone
                      onDrop={(files) => handleUpFileForPrevRXOfPrevTirz(files)}
                      onReject={(rejectedFiles) => {
                        if (rejectedFiles?.[0]?.errors?.[0]?.code == "file-too-large") {
                          dmlToast.error({ title: "File size should be less than 2MB." });
                        }
                      }}
                      accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.pdf]}
                      multiple={false}
                      className="border-dashed border-gray-300 rounded-lg bg-gray-50 min-h-[220px] flex items-center justify-center"
                    >
                      <div className="flex flex-col items-center gap-4">
                        <IconUpload
                          size={52}
                          stroke={1.5}
                        />
                        <Text>Drag & drop or click to upload</Text>
                      </div>
                    </Dropzone>
                  ) : (
                    <EditableDocumentTag
                      docName={takenPrevTirz_previousRxDocName || ""}
                      removable={true}
                      leftIconClass="icon-pdf"
                      onRemove={() => removePrevTirzPreviousRxDocument()}
                    />
                  )}
                  {errors?.takenPrevTirz_previousRxDocument?.message && <Text className="text-sm text-red-500">{errors.takenPrevTirz_previousRxDocument.message}</Text>}
                </div>
              )}
            </>
          )}

          {/* Previous side effects */}
          <div className="space-y-4">
            <Text className="text-foreground font-poppins !text-3xl">Did you experience any of the following side effects?</Text>
            <Grid
              gutter="md"
              className="mt-4"
            >
              {["Nausea", "Vomiting", "Diarrhea", "Constipation", "Reduced Appetite", "Depression", "Suicidal thoughts", "Hair loss", "No side effects", "Other"].map((option) => {
                const isChecked = takenPrevGlp_sideEffect ? takenPrevGlp_sideEffect.split(", ").includes(option) : false;
                return (
                  <Grid.Col
                    span={6}
                    key={option}
                  >
                    <div
                      onClick={() => {
                        const currentValues = takenPrevGlp_sideEffect ? takenPrevGlp_sideEffect.split(", ") : [];
                        const updatedValues = isChecked ? currentValues.filter((v) => v !== option) : [...currentValues, option];
                        setValue("takenPrevGlp_sideEffect", updatedValues.join(", "), { shouldValidate: true });
                      }}
                      className={`cursor-pointer border rounded-2xl px-6 py-4 flex justify-between items-center transition-all ${
                        isChecked ? "border-primary bg-white text-black shadow-sm" : "border-gray-300 bg-transparent text-black"
                      }`}
                    >
                      <span className="text-base font-medium font-poppins">{option}</span>
                      <Checkbox
                        checked={isChecked}
                        readOnly
                        size="md"
                        radius="md"
                        classNames={{
                          input: isChecked ? "bg-primary border-primary text-white" : "bg-transparent",
                        }}
                      />
                    </div>
                  </Grid.Col>
                );
              })}
            </Grid>
            {errors?.takenPrevGlp_sideEffect?.message && <div className="text-danger text-sm mt-2 text-center">{errors.takenPrevGlp_sideEffect.message}</div>}
          </div>

          {/* Previous effectiveness */}
          <Radio.Group
            value={watch("takenPrevGlp_howEffective")}
            onChange={(value) => handleSelect("takenPrevGlp_howEffective", value)}
            label="How effective do you feel the medication has been in managing your weight?"
            error={getErrorMessage(errors?.takenPrevGlp_howEffective)}
            classNames={{
              root: "sm:!grid !block",
              error: "sm:!text-end !text-start w-full",
              label: "sm:!text-3xl pb-2",
            }}
          >
            <div className="grid grid-cols-1 gap-5">
              {["Very Effective", "Somewhat Effective", "Not Effective"].map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(watch("takenPrevGlp_howEffective"), option)}
                  label={
                    <div className="relative text-center w-full">
                      <span className="text-foreground font-poppins">{option}</span>
                      {watch("takenPrevGlp_howEffective") === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white absolute top-1/2 right-3 -translate-y-1/2">
                          <i className="icon-tick text-sm/none"></i>
                        </span>
                      )}
                    </div>
                  }
                />
              ))}
            </div>
          </Radio.Group>
        </>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-6 pt-4">
        <Button
          variant="outline"
          className="w-[200px]"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="w-[200px]"
          form="step16Form"
          loading={isLoading}
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StepSixteen;
