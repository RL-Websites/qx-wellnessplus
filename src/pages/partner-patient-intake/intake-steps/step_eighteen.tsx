import EditableDocumentTag from "@/common/components/EditableDocumentTag";
import dmlToast from "@/common/configs/toaster.config";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Checkbox, Group, Input, Radio, Text } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconUpload } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { stepEightTeenSchema } from "../schema/stepEightTeenSchema";

export type step18SchemaType = yup.InferType<typeof stepEightTeenSchema>;
interface Step18Props {
  onNext: (data: any) => void;
  onBack: () => void;
  defaultValues?: step18SchemaType;
}

const StepEighteen = ({ onNext, onBack, defaultValues }: Step18Props) => {
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
  } = useForm({
    defaultValues: {
      takenGlpMedication: defaultValues?.takenGlpMedication || "",
      heightWhenStartGlp: defaultValues?.heightWhenStartGlp || "",
      weightWhenStartGlp: defaultValues?.weightWhenStartGlp || "",
      currentWeightLossMedication: defaultValues?.currentWeightLossMedication || "",
      // Semaglutide
      sema_lastWeightLossMedicationDoase: defaultValues?.sema_lastWeightLossMedicationDoase || "",
      sema_lastWeightLossMedicationDoaseOther: defaultValues?.sema_lastWeightLossMedicationDoaseOther || "",
      sema_hasPdfForPreviousRx: defaultValues?.sema_hasPdfForPreviousRx || "",
      sema_previousRxDocument: defaultValues?.sema_previousRxDocument || "",
      sema_previousRxDocName: defaultValues?.sema_previousRxDocName || "",
      // Tirzepatide
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
    resolver: yupResolver(stepEightTeenSchema),
  });

  useEffect(() => {
    defaultValues?.sema_previousRxDocument && setSema_previousRxDocument(defaultValues.sema_previousRxDocument);
    defaultValues?.tirz_previousRxDocument && setTirz_previousRxDocument(defaultValues.tirz_previousRxDocument);
    defaultValues?.takenPrevSema_previousRxDocument && setTakenPrevSema_previousRxDocument(defaultValues.takenPrevSema_previousRxDocument);
    defaultValues?.takenPrevTirz_previousRxDocument && setTakenPrevTirz_previousRxDocument(defaultValues.takenPrevTirz_previousRxDocument);
  }, [defaultValues]);

  const takenGlpMedication = watch("takenGlpMedication");
  const glpSideEffect = watch("glpSideEffect");
  const currentWeightLossMedication = watch("currentWeightLossMedication");
  const sema_lastWeightLossMedicationDoase = watch("sema_lastWeightLossMedicationDoase");
  const tirz_lastWeightLossMedicationDoase = watch("tirz_lastWeightLossMedicationDoase");
  const wouldYouLikeContinueGlpCurrentDosage = watch("wouldYouLikeContinueGlpCurrentDosage");
  const haveTakenMedicationAsPrescribed = watch("haveTakenMedicationAsPrescribed");
  const takenPrevGlpMedication = watch("takenPrevGlpMedication");
  const takenPrevSema_lastDosage = watch("takenPrevSema_lastDosage");
  const takenPrevTirz_lastWeightLossMedicationDoase = watch("takenPrevTirz_lastWeightLossMedicationDoase");
  const takenPrevGlp_sideEffect = watch("takenPrevGlp_sideEffect");
  const glpHowLongTaken = watch("glpHowLongTaken");
  const glpDrugEffectManageWeight = watch("glpDrugEffectManageWeight");
  const takenPrevGlp_howEffective = watch("takenPrevGlp_howEffective");
  const takenPrevSema_hasPdfForPreviousRx = watch("takenPrevSema_hasPdfForPreviousRx");
  const tirz_hasPdfForPreviousRx = watch("tirz_hasPdfForPreviousRx");
  const sema_previousRxDocName = watch("sema_previousRxDocName");
  const tirz_previousRxDocName = watch("tirz_previousRxDocName");
  const takenPrevSema_previousRxDocName = watch("takenPrevSema_previousRxDocName");
  const takenPrevTirz_previousRxDocName = watch("takenPrevTirz_previousRxDocName");

  // const glpStartingHeight = watch("glpStartingHeight");
  // const glpStartingWeight = watch("glpStartingWeight");

  const fileToBase64 = (file: File, callback: (result: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result as string);
    reader.onerror = (error) => console.error("Error converting file: ", error);
  };

  const handleUpFileForPrevRXOfSema = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setValue("sema_previousRxDocName", file.name);
      fileToBase64(file, (base64) => {
        setSema_previousRxDocument(base64);
        setValue("sema_previousRxDocument", base64);
        // setFrontBase64(base64);
      });
    }
  };
  const handleUpFileForPrevRXOfTirz = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setValue("tirz_previousRxDocName", file.name);
      fileToBase64(file, (base64) => {
        setTirz_previousRxDocument(base64);
        setValue("tirz_previousRxDocument", base64);
        // setFrontBase64(base64);
      });
    }
  };
  const handleUpFileForPrevRXOfPrevSema = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setValue("takenPrevSema_previousRxDocName", file.name);
      fileToBase64(file, (base64) => {
        setTakenPrevSema_previousRxDocument(base64);
        setValue("takenPrevSema_previousRxDocument", base64);
        // setFrontBase64(base64);
      });
    }
  };
  const handleUpFileForPrevRXOfPrevTirz = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setValue("takenPrevTirz_previousRxDocName", file.name);
      fileToBase64(file, (base64) => {
        setTakenPrevTirz_previousRxDocument(base64);
        setValue("takenPrevTirz_previousRxDocument", base64);
        // setFrontBase64(base64);
      });
    }
  };

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

  return (
    <>
      <form
        id="step18Form"
        onSubmit={handleSubmit(onNext)}
        className="card divide-y pt-10 space-y-10 min-h-[200px]"
      >
        <Radio.Group
          label="Have you taken a GLP-1 medication?"
          value={takenGlpMedication}
          onChange={(value) => {
            setValue("takenGlpMedication", value);
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

            if (value) {
              clearErrors("takenGlpMedication");
            }
          }}
          error={getErrorMessage(errors?.takenGlpMedication)}
        >
          <Box
            mt="xs"
            className="space-y-4"
          >
            <Radio
              value="Yes"
              label="Yes"
              color="dark"
            />
            <Radio
              value="Not within 30 days, but previously"
              label="Not within 30 days, but previously"
              color="dark"
            />
            <Radio
              value="I have never taken GLPs"
              label="I have never taken GLPs"
              color="dark"
            />
          </Box>
        </Radio.Group>

        {takenGlpMedication === "Yes" && (
          <>
            <Input.Wrapper
              label="What was your height when you started the GLP-1 medication? (In inches)"
              className="pt-6"
              error={getErrorMessage(errors?.heightWhenStartGlp)}
            >
              <Input {...register("heightWhenStartGlp")} />
            </Input.Wrapper>

            <Input.Wrapper
              label="What was your weight when you started the GLP-1 medication?  (In pounds)"
              className="pt-6"
              error={getErrorMessage(errors?.weightWhenStartGlp)}
            >
              <Input
                {...register("weightWhenStartGlp")}
                placeholder="e.g., 170 lbs"
              />
            </Input.Wrapper>

            <Radio.Group
              label="Which weight loss medication are you currently taking?"
              className="pt-6"
              value={currentWeightLossMedication}
              onChange={(value) => {
                setValue("currentWeightLossMedication", value);
                setValue("sema_lastWeightLossMedicationDoase", "");
                setValue("sema_lastWeightLossMedicationDoaseOther", "");
                setValue("sema_hasPdfForPreviousRx", "");
                setValue("sema_previousRxDocument", "");
                setValue("tirz_lastWeightLossMedicationDoase", "");
                setValue("tirz_hasPdfForPreviousRx", "");
                setValue("tirz_previousRxDocument", "");
                setValue("sema_previousRxDocName", "");
                setValue("tirz_previousRxDocName", "");
                setSema_previousRxDocument(null);
                setTirz_previousRxDocument(null);
                if (value) {
                  clearErrors("currentWeightLossMedication");
                }
              }}
              error={getErrorMessage(errors?.currentWeightLossMedication)}
            >
              <Box
                mt="xs"
                className="space-y-4"
              >
                {["Semaglutide (Wegovy, Ozempic, Generic)", "Tirzepatide (Mounjaro, Zepbound, Generic)", "Liraglutide (Saxenda)", "Other Weight Loss Medication"].map((option) => (
                  <Radio
                    key={option}
                    value={option}
                    label={option}
                    color="dark"
                  />
                ))}
              </Box>
            </Radio.Group>

            {/* SEMAGLUTIDE Section */}
            {currentWeightLossMedication == "Semaglutide (Wegovy, Ozempic, Generic)" && (
              <>
                <Radio.Group
                  label="What was the last dosage you took?"
                  className="pt-6"
                  value={watch("sema_lastWeightLossMedicationDoase")}
                  onChange={(value) => {
                    setValue("sema_lastWeightLossMedicationDoase", value);
                    clearErrors("sema_lastWeightLossMedicationDoase");
                  }}
                  error={getErrorMessage(errors?.sema_lastWeightLossMedicationDoase)}
                >
                  <Box
                    mt="xs"
                    className="space-y-4"
                  >
                    {["0.25mg weekly", "0.5mg weekly", "0.75mg weekly", "1mg weekly", "1.5mg weekly", "1.7mg weekly", "2mg weekly", "2.5mg weekly", "Other"].map((option) => (
                      <Radio
                        key={option}
                        value={option}
                        label={option}
                        color="dark"
                      />
                    ))}
                  </Box>
                </Radio.Group>
                {sema_lastWeightLossMedicationDoase === "Other" && (
                  <Input.Wrapper
                    label="Specify dosage"
                    className="pt-6"
                    error={getErrorMessage(errors?.sema_lastWeightLossMedicationDoaseOther)}
                  >
                    <Input {...register("sema_lastWeightLossMedicationDoaseOther")} />
                  </Input.Wrapper>
                )}
                <Radio.Group
                  label="Do you have a PDF of your previous script, or a picture of your current vial"
                  className="pt-6"
                  value={watch("sema_hasPdfForPreviousRx")}
                  onChange={(value) => {
                    setValue("sema_hasPdfForPreviousRx", value);
                    setValue("sema_previousRxDocument", "");
                    setValue("sema_previousRxDocName", "");
                    setSema_previousRxDocument(null);
                    clearErrors("sema_hasPdfForPreviousRx");
                    clearErrors("sema_previousRxDocument");
                  }}
                  error={getErrorMessage(errors?.sema_hasPdfForPreviousRx)}
                >
                  <Box
                    mt="xs"
                    className="space-y-4"
                  >
                    <Radio
                      value="Yes"
                      label="Yes"
                      color="dark"
                      {...register("sema_hasPdfForPreviousRx")}
                    />
                    <Radio
                      value="No"
                      label="No"
                      color="dark"
                      {...register("sema_hasPdfForPreviousRx")}
                    />
                  </Box>
                </Radio.Group>
                {watch("sema_hasPdfForPreviousRx") === "Yes" && (
                  // <Input.Wrapper
                  //   label="22.3.2.1. Upload script/vial photo"
                  //   className="pt-6"
                  //   error={getErrorMessage(errors?.sema_previousRxDocument)}
                  // >
                  //   <input
                  //     type="file"
                  //     {...register("sema_previousRxDocument")}
                  //   />
                  // </Input.Wrapper>
                  <div className="pt-6">
                    <h6 className="extra-form-text-medium text-foreground mb-2">Please upload your script or a picture of your current vial.</h6>
                    {!sema_previousRxDocument ? (
                      <Dropzone
                        onDrop={(files) => handleUpFileForPrevRXOfSema(files)}
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
                          docName={sema_previousRxDocName || ""}
                          removable={true}
                          leftIconClass="icon-pdf"
                          onRemove={() => removeSemaPreviousRxDocument()}
                        />
                      </div>
                    )}
                    {errors?.sema_previousRxDocument?.message ? <p className="text-sm text-danger mt-2">{errors?.sema_previousRxDocument?.message}</p> : ""}
                  </div>
                )}
              </>
            )}

            {currentWeightLossMedication == "Tirzepatide (Mounjaro, Zepbound, Generic)" && (
              <>
                <Radio.Group
                  label="What was the last dosage you took?"
                  value={tirz_lastWeightLossMedicationDoase}
                  className="pt-6"
                  {...register("tirz_lastWeightLossMedicationDoase")}
                  onChange={(value) => {
                    setValue("tirz_lastWeightLossMedicationDoase", value);
                    clearErrors("tirz_lastWeightLossMedicationDoase");
                  }}
                  error={getErrorMessage(errors?.tirz_lastWeightLossMedicationDoase)}
                >
                  <Box
                    mt="xs"
                    className="space-y-4"
                  >
                    {["2.5mg weekly", "5mg weekly", "7.5mg weekly", "10mg weekly", "12.5mg weekly", "15mg weekly", "Other"].map((option) => (
                      <Radio
                        key={option}
                        value={option}
                        label={option}
                        color="dark"
                        {...register("tirz_lastWeightLossMedicationDoase")}
                      />
                    ))}
                  </Box>
                </Radio.Group>
                {tirz_lastWeightLossMedicationDoase == "Other" && (
                  <Input.Wrapper
                    label="Specify dosage"
                    className="pt-6"
                    error={getErrorMessage(errors?.tirz_lastWeightLossMedicationDoase)}
                  >
                    <Input {...register("tirz_lastWeightLossMedicationDoaseOther")} />
                  </Input.Wrapper>
                )}
                <Radio.Group
                  label="Do you have a PDF of your previous script, or a picture of your current vial"
                  className="pt-6"
                  value={tirz_hasPdfForPreviousRx}
                  {...register("tirz_hasPdfForPreviousRx")}
                  onChange={(value) => {
                    setValue("tirz_hasPdfForPreviousRx", value);
                    setValue("tirz_previousRxDocument", "");
                    setValue("tirz_previousRxDocName", "");
                    setTirz_previousRxDocument(null);
                    clearErrors("tirz_hasPdfForPreviousRx");
                    clearErrors("tirz_previousRxDocument");
                  }}
                  error={getErrorMessage(errors?.tirz_hasPdfForPreviousRx)}
                >
                  <Box
                    mt="xs"
                    className="space-y-4"
                  >
                    <Radio
                      value="Yes"
                      label="Yes"
                      color="dark"
                      {...register("tirz_hasPdfForPreviousRx")}
                    />
                    <Radio
                      value="No"
                      label="No"
                      color="dark"
                      {...register("tirz_hasPdfForPreviousRx")}
                    />
                  </Box>
                </Radio.Group>
                {watch("tirz_hasPdfForPreviousRx") === "Yes" && (
                  <div className="pt-6">
                    <h6 className="extra-form-text-medium text-foreground mb-2">Please upload your script or a picture of your current vial.</h6>
                    {!tirz_previousRxDocument ? (
                      <Dropzone
                        onDrop={(files) => handleUpFileForPrevRXOfTirz(files)}
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
                          docName={tirz_previousRxDocName || ""}
                          removable={true}
                          leftIconClass="icon-pdf"
                          onRemove={() => removeTirzPreviousRxDocument()}
                        />
                      </div>
                    )}
                    {errors?.tirz_previousRxDocument?.message ? <p className="text-sm text-danger mt-2">{errors?.tirz_previousRxDocument?.message}</p> : ""}
                  </div>
                )}
              </>
            )}

            {/* Tirzepatide, other conditional blocks would go here */}

            <Radio.Group
              label="How long have you been taking the medication consecutively?"
              className="pt-6"
              value={watch("howLongTakeGlpMedication")}
              onChange={(value) => {
                setValue("howLongTakeGlpMedication", value);
                clearErrors("howLongTakeGlpMedication");
              }}
              error={getErrorMessage(errors?.howLongTakeGlpMedication)}
            >
              <Box
                mt="xs"
                className="space-y-4"
              >
                {["One Month", "Two Months", "Three Months", "Four Months", "Five Months", "Six Months", "More than Six Months"].map((option) => (
                  <Radio
                    key={option}
                    value={option}
                    label={option}
                    {...register("howLongTakeGlpMedication")}
                    color="dark"
                  />
                ))}
              </Box>
            </Radio.Group>

            <Radio.Group
              label="How long have you been on your current dose?"
              className="pt-6"
              value={watch("howLongTakeGlpCurrentDosage")}
              onChange={(value) => {
                setValue("howLongTakeGlpCurrentDosage", value);
                clearErrors("howLongTakeGlpCurrentDosage");
              }}
              error={getErrorMessage(errors?.howLongTakeGlpCurrentDosage)}
            >
              <Box
                mt="xs"
                className="space-y-4"
              >
                {["Less than one month", "One Month", "Two Months", "Three Months", "Four Months", "Five Months", "Six Months", "More than Six Months"].map((option) => (
                  <Radio
                    key={option}
                    value={option}
                    label={option}
                    {...register("howLongTakeGlpCurrentDosage")}
                    color="dark"
                  />
                ))}
              </Box>
            </Radio.Group>

            <Radio.Group
              label="Would you like to continue your current dose, move up to the next dose, or titrate down?"
              className="pt-6"
              value={wouldYouLikeContinueGlpCurrentDosage}
              onChange={(value) => {
                setValue("wouldYouLikeContinueGlpCurrentDosage", value);
                clearErrors("wouldYouLikeContinueGlpCurrentDosage");
              }}
              error={getErrorMessage(errors?.wouldYouLikeContinueGlpCurrentDosage)}
            >
              <Box
                mt="xs"
                className="space-y-4"
              >
                {["Stay on current dose", "Move up", "Titrate down"].map((option) => (
                  <Radio
                    key={option}
                    value={option}
                    label={option}
                    color="dark"
                  />
                ))}
              </Box>
            </Radio.Group>

            {wouldYouLikeContinueGlpCurrentDosage === "Stay on current dose" && (
              <Radio.Group
                label="How long would you like to stay on your current dose??"
                className="pt-6"
                {...register("stayCurrent_howLongTakeGlpCurrentDosage")}
                onChange={(value) => {
                  setValue("stayCurrent_howLongTakeGlpCurrentDosage", value);
                  if (value) {
                    clearErrors("stayCurrent_howLongTakeGlpCurrentDosage");
                  }
                }}
                error={getErrorMessage(errors?.stayCurrent_howLongTakeGlpCurrentDosage)}
              >
                <Box
                  mt="xs"
                  className="space-y-4"
                >
                  {["One month, then titrate up the next two months", "Two months, then titrate up the third month", "All three months"].map((option) => (
                    <Radio
                      key={option}
                      value={option}
                      label={option}
                      color="dark"
                      {...register("stayCurrent_howLongTakeGlpCurrentDosage")}
                    />
                  ))}
                </Box>
              </Radio.Group>
            )}

            {wouldYouLikeContinueGlpCurrentDosage === "Move up" && (
              <Radio.Group
                label="How would you like to move up your dose?"
                className="pt-6"
                value={watch("moveUp_wouldLikeToMoveUp")}
                {...register("moveUp_wouldLikeToMoveUp")}
                onChange={(value) => setValue("moveUp_wouldLikeToMoveUp", value)}
                error={getErrorMessage(errors?.moveUp_wouldLikeToMoveUp)}
              >
                <Box
                  mt="xs"
                  className="space-y-4"
                >
                  {[
                    "Increase dosage monthly (regular schedule)",
                    "Increase dose the first month, then maintain that dose",
                    "Increase dose each month for 2 months, then maintain",
                    "Increase dose every other month until max dose",
                  ].map((option) => (
                    <Radio
                      key={option}
                      value={option}
                      label={option}
                      {...register("moveUp_wouldLikeToMoveUp")}
                      color="dark"
                    />
                  ))}
                </Box>
              </Radio.Group>
            )}

            <Radio.Group
              label="Have you taken the medication as prescribed?"
              className="pt-6"
              value={haveTakenMedicationAsPrescribed}
              onChange={(value) => {
                setValue("haveTakenMedicationAsPrescribed", value);
                if (value) {
                  clearErrors("haveTakenMedicationAsPrescribed");
                }
              }}
              error={getErrorMessage(errors?.haveTakenMedicationAsPrescribed)}
            >
              <Box
                mt="xs"
                className="space-y-4"
              >
                <Radio
                  value="Yes"
                  label="Yes"
                  color="dark"
                />
                <Radio
                  value="No"
                  label="No"
                  color="dark"
                />
              </Box>
            </Radio.Group>

            {haveTakenMedicationAsPrescribed === "No" && (
              <Input.Wrapper
                label="Please explain how you have deviated from the dosing instructions"
                className="pt-6"
                error={getErrorMessage(errors?.No_haveDeviated)}
              >
                <Input {...register("No_haveDeviated")} />
              </Input.Wrapper>
            )}

            <Checkbox.Group
              label="Have you experienced any of the following side effects?"
              value={glpSideEffect ? glpSideEffect?.split(", ") || [] : []}
              error={getErrorMessage(errors?.glpSideEffect)}
              onChange={(valueArray) => {
                const valueString = valueArray.join(", ");
                setValue("glpSideEffect", valueString);
                // setValue("takeDiabeticHemoglobin", "");
                clearErrors("glpSideEffect");
              }}
              className="pt-6"
            >
              <Box
                mt="xs"
                className="space-y-3"
              >
                {["Nausea", "Vomiting", "Diarrhea", "Constipation", "Reduced Appetite", "Depression", "Suicidal thoughts", "Hair loss", "No side effects", "Other"].map(
                  (option) => (
                    <Checkbox
                      key={option}
                      value={option}
                      label={option}
                      color="dark"
                    />
                  )
                )}
              </Box>
            </Checkbox.Group>

            <Radio.Group
              label="How effective do you feel the medication has been in managing your weight"
              className="pt-6"
              value={glpDrugEffectManageWeight}
              onChange={(value) => {
                setValue("glpDrugEffectManageWeight", value);
                if (value) {
                  clearErrors("glpDrugEffectManageWeight");
                }
              }}
              error={getErrorMessage(errors?.glpDrugEffectManageWeight)}
            >
              <Box
                mt="xs"
                className="space-y-4"
              >
                {["Very Effective", "Somewhat Effective", "Not Effective"].map((option) => (
                  <Radio
                    key={option}
                    value={option}
                    label={option}
                    color="dark"
                  />
                ))}
              </Box>
            </Radio.Group>
          </>
        )}

        {takenGlpMedication == "Not within 30 days, but previously" && (
          <>
            <Radio.Group
              label="How long has it been since you stopped taking your GLP medication"
              className="pt-6"
              value={glpHowLongTaken}
              onChange={(value) => {
                setValue("glpHowLongTaken", value);
                if (value) {
                  clearErrors("glpHowLongTaken");
                }
              }}
              error={getErrorMessage(errors?.glpHowLongTaken)}
            >
              <Box
                mt="xs"
                className="space-y-4"
              >
                {["2-5 months", "6-9 months", "10-11 months", "12+ months"].map((option) => (
                  <Radio
                    key={option}
                    value={option}
                    label={option}
                    color="dark"
                  />
                ))}
              </Box>
            </Radio.Group>

            <Input.Wrapper
              label="What was your height when you started the GLP-1 medication? (In inches)"
              className="pt-6"
              error={getErrorMessage(errors?.glpStartingHeight)}
            >
              <Input {...register("glpStartingHeight")} />
            </Input.Wrapper>

            <Input.Wrapper
              label="What was your weight when you started the GLP-1 medication? (In Pounds)"
              className="pt-6"
              error={getErrorMessage(errors?.glpStartingWeight)}
            >
              <Input
                {...register("glpStartingWeight")}
                placeholder="e.g., 170 lbs"
              />
            </Input.Wrapper>

            <Radio.Group
              label="What GLP medication have you previously taken?"
              className="pt-6"
              value={takenPrevGlpMedication}
              {...register("takenPrevGlpMedication")}
              onChange={(value) => {
                setValue("takenPrevGlpMedication", value);
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

                if (value) {
                  clearErrors("takenPrevGlpMedication");
                }
              }}
              error={getErrorMessage(errors?.takenPrevGlpMedication)}
            >
              <Box
                mt="xs"
                className="space-y-4"
              >
                {["Semaglutide (Wegovy, Ozempic, Generic)", "Tirzepatide (Mounjaro, Zepbound, Generic)", "Liraglutide (Saxenda)", "Other Weight Loss Medication"].map((option) => (
                  <Radio
                    key={option}
                    value={option}
                    label={option}
                    color="dark"
                    {...register("takenPrevGlpMedication")}
                  />
                ))}
              </Box>
            </Radio.Group>

            {/* SEMAGLUTIDE Section */}
            {takenPrevGlpMedication == "Semaglutide (Wegovy, Ozempic, Generic)" && (
              <>
                <Radio.Group
                  label="What was the last dosage you took?"
                  className="pt-6"
                  value={takenPrevSema_lastDosage}
                  onChange={(value) => {
                    setValue("takenPrevSema_lastDosage", value);
                    clearErrors("takenPrevSema_lastDosage");
                  }}
                  error={getErrorMessage(errors?.takenPrevSema_lastDosage)}
                >
                  <Box
                    mt="xs"
                    className="space-y-4"
                  >
                    {["0.25mg weekly", "0.5mg weekly", "0.75mg weekly", "1mg weekly", "1.5mg weekly", "1.7mg weekly", "2mg weekly", "2.5mg weekly", "Other"].map((option) => (
                      <Radio
                        key={option}
                        value={option}
                        label={option}
                        color="dark"
                      />
                    ))}
                  </Box>
                </Radio.Group>
                {takenPrevSema_lastDosage === "Other" && (
                  <Input.Wrapper
                    label="Specify dosage"
                    className="pt-6"
                    error={getErrorMessage(errors?.takenPrevSema_lastDosageOther)}
                  >
                    <Input {...register("takenPrevSema_lastDosageOther")} />
                  </Input.Wrapper>
                )}
                <Radio.Group
                  label="Do you have a PDF of your previous script, or a picture of your current vial"
                  value={takenPrevSema_hasPdfForPreviousRx}
                  className="pt-6"
                  onChange={(value) => {
                    setValue("takenPrevSema_hasPdfForPreviousRx", value);
                    setValue("takenPrevSema_previousRxDocument", "");
                    setValue("takenPrevSema_previousRxDocName", "");
                    setTakenPrevSema_previousRxDocument(null);
                    if (value) {
                      clearErrors("takenPrevSema_hasPdfForPreviousRx");
                    }
                    clearErrors("takenPrevSema_previousRxDocument");
                  }}
                  error={getErrorMessage(errors?.takenPrevSema_hasPdfForPreviousRx)}
                >
                  <Box
                    mt="xs"
                    className="space-y-4"
                  >
                    <Radio
                      value="Yes"
                      label="Yes"
                      color="dark"
                    />
                    <Radio
                      value="No"
                      label="No"
                      color="dark"
                    />
                  </Box>
                </Radio.Group>
                {watch("takenPrevSema_hasPdfForPreviousRx") === "Yes" && (
                  <div className="pt-6">
                    <h6 className="extra-form-text-medium text-foreground mb-2">Please upload your script or a picture of your current vial.</h6>
                    {!takenPrevSema_previousRxDocument ? (
                      <Dropzone
                        onDrop={(files) => handleUpFileForPrevRXOfPrevSema(files)}
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
                          docName={takenPrevSema_previousRxDocName || ""}
                          removable={true}
                          leftIconClass="icon-pdf"
                          onRemove={() => removePrevSemaPreviousRxDocument()}
                        />
                      </div>
                    )}
                    {errors?.takenPrevSema_previousRxDocument?.message ? <p className="text-sm text-danger mt-2">{errors?.takenPrevSema_previousRxDocument?.message}</p> : ""}
                  </div>
                )}
              </>
            )}

            {takenPrevGlpMedication == "Tirzepatide (Mounjaro, Zepbound, Generic)" && (
              <>
                <Radio.Group
                  label="What was the last dosage you took?"
                  className="pt-6"
                  value={takenPrevTirz_lastWeightLossMedicationDoase}
                  onChange={(value) => {
                    setValue("takenPrevTirz_lastWeightLossMedicationDoase", value);
                    clearErrors("takenPrevTirz_lastWeightLossMedicationDoase");
                  }}
                  error={getErrorMessage(errors?.takenPrevTirz_lastWeightLossMedicationDoase)}
                >
                  <Box
                    mt="xs"
                    className="space-y-4"
                  >
                    {["2.5mg weekly", "5mg weekly", "7.5mg weekly", "10mg weekly", "12.5mg weekly", "15mg weekly", "Other"].map((option) => (
                      <Radio
                        key={option}
                        value={option}
                        label={option}
                        color="dark"
                      />
                    ))}
                  </Box>
                </Radio.Group>
                {takenPrevTirz_lastWeightLossMedicationDoase == "Other" && (
                  <Input.Wrapper
                    label="Specify dosage"
                    className="pt-6"
                    error={getErrorMessage(errors?.takenPrevTirz_lastWeightLossMedicationDoaseOther)}
                  >
                    <Input {...register("takenPrevTirz_lastWeightLossMedicationDoaseOther")} />
                  </Input.Wrapper>
                )}
                <Radio.Group
                  label="Do you have a PDF of your previous script, or a picture of your current vial"
                  className="pt-6"
                  {...register("takenPrevTirz_hasPdfForPreviousRx")}
                  onChange={(value) => {
                    setValue("takenPrevTirz_hasPdfForPreviousRx", value);
                    setValue("takenPrevTirz_previousRxDocument", "");
                    setValue("takenPrevTirz_previousRxDocName", "");
                    setTakenPrevTirz_previousRxDocument(null);
                    if (value) {
                      clearErrors("takenPrevTirz_hasPdfForPreviousRx");
                    }
                    clearErrors("takenPrevTirz_previousRxDocument");
                  }}
                  error={getErrorMessage(errors?.takenPrevTirz_hasPdfForPreviousRx)}
                >
                  <Box
                    mt="xs"
                    className="space-y-4"
                  >
                    <Radio
                      value="Yes"
                      label="Yes"
                      color="dark"
                      {...register("takenPrevTirz_hasPdfForPreviousRx")}
                    />
                    <Radio
                      value="No"
                      label="No"
                      color="dark"
                      {...register("takenPrevTirz_hasPdfForPreviousRx")}
                    />
                  </Box>
                </Radio.Group>
                {watch("takenPrevTirz_hasPdfForPreviousRx") === "Yes" && (
                  // <Input.Wrapper
                  //   label="22.13.4.1. Upload script/vial photo"
                  //   className="pt-6"
                  //   error={getErrorMessage(errors?.takenPrevTirz_previousRxDocument)}
                  // >
                  //   <input
                  //     type="file"
                  //     {...register("takenPrevTirz_previousRxDocument")}
                  //   />
                  // </Input.Wrapper>

                  <div className="pt-6">
                    <h6 className="extra-form-text-medium text-foreground mb-2">Do you have a PDF of your previous script, or a picture of your current vial?</h6>
                    {!takenPrevTirz_previousRxDocument ? (
                      <Dropzone
                        onDrop={(files) => handleUpFileForPrevRXOfPrevTirz(files)}
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
                          docName={takenPrevTirz_previousRxDocName || ""}
                          removable={true}
                          leftIconClass="icon-pdf"
                          onRemove={() => removePrevTirzPreviousRxDocument()}
                        />
                      </div>
                    )}
                    {errors?.takenPrevTirz_previousRxDocument?.message ? <p className="text-sm text-danger mt-2">{errors?.takenPrevTirz_previousRxDocument?.message}</p> : ""}
                  </div>
                )}
              </>
            )}

            <Checkbox.Group
              label="Did you experience any of the following side effects?"
              value={takenPrevGlp_sideEffect ? takenPrevGlp_sideEffect?.split(", ") || [] : []}
              error={getErrorMessage(errors?.takenPrevGlp_sideEffect)}
              onChange={(valueArray) => {
                const valueString = valueArray.join(", ");
                setValue("takenPrevGlp_sideEffect", valueString);
                // setValue("takeDiabeticHemoglobin", "");
                clearErrors("takenPrevGlp_sideEffect");
              }}
              className="pt-6"
            >
              <Box
                mt="xs"
                className="space-y-3"
              >
                {["Nausea", "Vomiting", "Diarrhea", "Constipation", "Reduced Appetite", "Depression", "Suicidal thoughts", "Hair loss", "No side effects", "Other"].map(
                  (option) => (
                    <Checkbox
                      key={option}
                      value={option}
                      label={option}
                      color="dark"
                    />
                  )
                )}
              </Box>
            </Checkbox.Group>

            <Radio.Group
              label="How effective do you feel the medication has been in managing your weight?"
              className="pt-6"
              value={takenPrevGlp_howEffective}
              onChange={(value) => {
                setValue("takenPrevGlp_howEffective", value);
                if (value) {
                  clearErrors("takenPrevGlp_howEffective");
                }
              }}
              error={getErrorMessage(errors?.takenPrevGlp_howEffective)}
            >
              <Box
                mt="xs"
                className="space-y-4"
              >
                {["Very Effective", "Somewhat Effective", "Not Effective"].map((option) => (
                  <Radio
                    key={option}
                    value={option}
                    label={option}
                    color="dark"
                  />
                ))}
              </Box>
            </Radio.Group>
          </>
        )}

        {/* Additional previous use blocks can go here for "Not within 30 days, but previously" */}
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
            form="step18Form"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default StepEighteen;
