import * as yup from "yup";

export const stepSixteenTeenSchema = yup.object({
  takenGlpMedication: yup.string().required("Please answer if you have taken a GLP-1 medication."),

  // heightWhenStartGlp: yup.string().when("takenGlpMedication", {
  //   is: "Yes",
  //   then: (schema) => schema.required("Please enter your height when you started the medication."),
  // }),

  weightWhenStartGlp: yup.string().when("takenGlpMedication", {
    is: "Yes",
    then: (schema) => schema.required("Please enter your weight when you started the medication."),
  }),

  currentWeightLossMedication: yup.string().when("takenGlpMedication", {
    is: "Yes",
    then: (schema) => schema.required("Please select your current weight loss medication."),
  }),

  // SEMAGLUTIDE path
  sema_lastWeightLossMedicationDoase: yup.string().when("currentWeightLossMedication", {
    is: "Semaglutide",
    then: (schema) => schema.required("Please select your last Semaglutide dosage."),
  }),
  sema_lastWeightLossMedicationDoaseOther: yup.string().when("sema_lastWeightLossMedicationDoase", {
    is: "Other",
    then: (schema) => schema.required("Please specify your last dosage."),
  }),
  sema_hasPdfForPreviousRx: yup.string().when("currentWeightLossMedication", {
    is: "Semaglutide",
    then: (schema) => schema.required("Please indicate if you have a script or vial picture."),
  }),
  sema_previousRxDocument: yup.mixed().nullable().optional(),
  sema_previousRxDocName: yup.mixed().nullable().optional(),
  // sema_previousRxDocument: yup.string().when("sema_hasPdfForPreviousRx", {
  //   is: "Yes",
  //   then: (schema) => schema.required("Please upload your script or vial photo."),
  // }),
  // sema_previousRxDocName: yup.string().when("sema_hasPdfForPreviousRx", {
  //   is: "Yes",
  //   then: (schema) => schema.required("Please upload your script or vial photo."),
  // }),

  // TIRZEPATIDE path
  tirz_lastWeightLossMedicationDoase: yup.string().when("currentWeightLossMedication", {
    is: "Tirzepatide",
    then: (schema) => schema.required("Please select your last Tirzepatide dosage."),
  }),
  tirz_lastWeightLossMedicationDoaseOther: yup.string().when("tirz_lastWeightLossMedicationDoase", {
    is: "Other",
    then: (schema) => schema.required("Please specify your last dosage."),
  }),
  tirz_hasPdfForPreviousRx: yup.string().when("currentWeightLossMedication", {
    is: "Tirzepatide",
    then: (schema) => schema.required("Please indicate if you have a script or vial picture."),
  }),
  tirz_previousRxDocument: yup.mixed().nullable().optional(),
  tirz_previousRxDocName: yup.mixed().nullable().optional(),
  // tirz_previousRxDocument: yup.string().when("tirz_hasPdfForPreviousRx", {
  //   is: "Yes",
  //   then: (schema) => schema.required("Please upload your script or vial photo."),
  // }),
  // tirz_previousRxDocName: yup.string().when("tirz_hasPdfForPreviousRx", {
  //   is: "Yes",
  //   then: (schema) => schema.required("Please upload your script or vial photo."),
  // }),

  howLongTakeGlpMedication: yup.string().when("takenGlpMedication", {
    is: "Yes",
    then: (schema) => schema.required("Please select how long you’ve taken the medication."),
  }),

  howLongTakeGlpCurrentDosage: yup.string().when("takenGlpMedication", {
    is: "Yes",
    then: (schema) => schema.required("Please select how long you've been on your current dose."),
  }),

  wouldYouLikeContinueGlpCurrentDosage: yup.string().when("takenGlpMedication", {
    is: "Yes",
    then: (schema) => schema.required("Please select your next dosage plan."),
  }),

  stayCurrent_howLongTakeGlpCurrentDosage: yup.string().when("wouldYouLikeContinueGlpCurrentDosage", {
    is: "Stay on current dose",
    then: (schema) => schema.required("Please indicate how long you'd like to stay on your current dose."),
  }),

  moveUp_wouldLikeToMoveUp: yup.string().when("wouldYouLikeContinueGlpCurrentDosage", {
    is: "Move up",
    then: (schema) => schema.required("Please specify how you'd like to increase your dose."),
  }),

  haveTakenMedicationAsPrescribed: yup.string().when("takenGlpMedication", {
    is: "Yes",
    then: (schema) => schema.required("Please specify if you’ve taken the medication as prescribed."),
  }),

  No_haveDeviated: yup.string().when("haveTakenMedicationAsPrescribed", {
    is: "No",
    then: (schema) => schema.required("Please describe how you deviated."),
  }),

  glpSideEffect: yup.string().when("takenGlpMedication", {
    is: "Yes",
    then: (schema) => schema.min(1, "Please select any side effects you've experienced."),
  }),

  glpDrugEffectManageWeight: yup.string().when("takenGlpMedication", {
    is: "Yes",
    then: (schema) => schema.required("Please assess the medication’s effectiveness."),
  }),

  // Prior Use (not current)
  glpHowLongTaken: yup.string().when("takenGlpMedication", {
    is: "Not within 30 days, but previously",
    then: (schema) => schema.required("Please specify when you stopped."),
  }),

  // glpStartingHeight: yup.string().when("takenGlpMedication", {
  //   is: "Not within 30 days, but previously",
  //   then: (schema) => schema.required("Please enter your starting height."),
  // }),

  glpStartingWeight: yup.string().when("takenGlpMedication", {
    is: "Not within 30 days, but previously",
    then: (schema) => schema.required("Please enter your starting weight."),
  }),

  takenPrevGlpMedication: yup.string().when("takenGlpMedication", {
    is: "Not within 30 days, but previously",
    then: (schema) => schema.required("Please select the GLP medication you previously took."),
  }),

  // Previous Semaglutide
  takenPrevSema_lastDosage: yup.string().when("takenPrevGlpMedication", {
    is: "Semaglutide",
    then: (schema) => schema.required("Please select your last dosage."),
  }),
  takenPrevSema_lastDosageOther: yup.string().when("takenPrevSema_lastDosage", {
    is: "Other",
    then: (schema) => schema.required("Please specify your dosage."),
  }),
  takenPrevSema_hasPdfForPreviousRx: yup.string().when("takenPrevGlpMedication", {
    is: "Semaglutide",
    then: (schema) => schema.required("Please indicate if you have your previous script."),
  }),
  takenPrevSema_previousRxDocument: yup.mixed().nullable().optional(),
  takenPrevSema_previousRxDocName: yup.mixed().nullable().optional(),
  // takenPrevSema_previousRxDocument: yup.string().when("takenPrevSema_hasPdfForPreviousRx", {
  //   is: "Yes",
  //   then: (schema) => schema.required("Please upload your previous script or photo."),
  // }),
  // takenPrevSema_previousRxDocName: yup.string().when("takenPrevSema_hasPdfForPreviousRx", {
  //   is: "Yes",
  //   then: (schema) => schema.required("Please upload your previous script or photo."),
  // }),

  // Previous Tirzepatide
  takenPrevTirz_lastWeightLossMedicationDoase: yup.string().when("takenPrevGlpMedication", {
    is: "Tirzepatide",
    then: (schema) => schema.required("Please select your last dosage."),
  }),
  takenPrevTirz_lastWeightLossMedicationDoaseOther: yup.string().when("takenPrevTirz_lastWeightLossMedicationDoase", {
    is: "Other",
    then: (schema) => schema.required("Please specify your dosage."),
  }),
  takenPrevTirz_hasPdfForPreviousRx: yup.string().when("takenPrevGlpMedication", {
    is: "Tirzepatide",
    then: (schema) => schema.required("Please indicate if you have your previous script."),
  }),
  takenPrevTirz_previousRxDocument: yup.mixed().optional().optional(),
  takenPrevTirz_previousRxDocName: yup.mixed().optional().optional(),
  // takenPrevTirz_previousRxDocument: yup.string().when("takenPrevTirz_hasPdfForPreviousRx", {
  //   is: "Yes",
  //   then: (schema) => schema.required("Please upload your previous script or photo."),
  // }),
  // takenPrevTirz_previousRxDocName: yup.string().when("takenPrevTirz_hasPdfForPreviousRx", {
  //   is: "Yes",
  //   then: (schema) => schema.required("Please upload your previous script or photo."),
  // }),
  takenPrevGlp_sideEffect: yup.string().when("takenGlpMedication", {
    is: "Not within 30 days, but previously",
    then: (schema) => schema.min(1, "Please select any side effects you've experienced."),
  }),
  takenPrevGlp_howEffective: yup.string().when("takenGlpMedication", {
    is: "Not within 30 days, but previously",
    then: (schema) => schema.required("Please evaluate the previous medication's effectiveness."),
  }),
});
