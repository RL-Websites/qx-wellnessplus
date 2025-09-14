import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const medicalHistorySchema = yup.object({
  familyHistory: yup.string().required("Please select if you have a family history of hair loss."),
  recentStress: yup.string().required("Please select if you had recent stress, illness, or surgery."),
  chronicCondition: yup.string().required("Please select if you have any chronic medical condition."),
  takingMeds: yup.string().required("Please select if you are currently taking any medications."),
  medsDetails: yup.string().when("takingMeds", {
    is: "Yes",
    then: (schema) => schema.required("Please specify your medications or supplements."),
    otherwise: (schema) => schema.optional(),
  }),
});

export type medicalHistorySchemaType = yup.InferType<typeof medicalHistorySchema>;

interface MedicalHistoryProps {
  onNext: (data: medicalHistorySchemaType) => void;
  onBack: () => void;
  defaultValues?: medicalHistorySchemaType;
}

const MedicalHistory = ({ onNext, onBack, defaultValues }: MedicalHistoryProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<medicalHistorySchemaType>({
    resolver: yupResolver(medicalHistorySchema),
    defaultValues: {
      familyHistory: defaultValues?.familyHistory || "",
      recentStress: defaultValues?.recentStress || "",
      chronicCondition: defaultValues?.chronicCondition || "",
      takingMeds: defaultValues?.takingMeds || "",
      medsDetails: defaultValues?.medsDetails || "",
    },
  });

  const familyHistory = watch("familyHistory");
  const recentStress = watch("recentStress");
  const chronicCondition = watch("chronicCondition");
  const takingMeds = watch("takingMeds");
  const medsDetails = watch("medsDetails");

  const handleSelect = (field: keyof medicalHistorySchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  const renderOptions = (fieldValue: string, fieldName: keyof medicalHistorySchemaType, options: string[]) =>
    options.map((option) => (
      <Radio
        key={option}
        value={option}
        classNames={getBaseWebRadios(fieldValue, option)}
        label={
          <div className="relative text-center">
            <span className="text-foreground font-poppins">{option}</span>
            {fieldValue === option && (
              <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                <i className="icon-tick text-sm/none" />
              </span>
            )}
          </div>
        }
      />
    ));

  return (
    <form
      id="medicalHistoryForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      {/* Q1 */}
      <Radio.Group
        label="Do you have a family history of hair loss?"
        value={familyHistory}
        onChange={(val) => handleSelect("familyHistory", val)}
        classNames={{
          root: "w-full",
          error: "sm:!text-end !text-start w-full",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">{renderOptions(familyHistory, "familyHistory", ["Yes", "No"])}</div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.familyHistory)}</p>
      </Radio.Group>

      {/* Q2 */}
      <Radio.Group
        label="Have you had recent stress, illness, or surgery?"
        value={recentStress}
        onChange={(val) => handleSelect("recentStress", val)}
        classNames={{
          root: "w-full",
          error: "sm:!text-end !text-start w-full",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">{renderOptions(recentStress, "recentStress", ["Yes", "No"])}</div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.recentStress)}</p>
      </Radio.Group>

      {/* Q3 */}
      <Radio.Group
        label="Do you have any chronic medical conditions?"
        value={chronicCondition}
        onChange={(val) => handleSelect("chronicCondition", val)}
        classNames={{
          root: "w-full",
          error: "sm:!text-end !text-start w-full",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {renderOptions(chronicCondition, "chronicCondition", ["Thyroid disease", "Hormonal imbalance (PCOS, low testosterone, etc.)", "Autoimmune condition", "None"])}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.chronicCondition)}</p>
      </Radio.Group>

      {/* Q4 */}
      <Radio.Group
        label="Are you currently taking any medications or supplements?"
        value={takingMeds}
        onChange={(val) => handleSelect("takingMeds", val)}
        classNames={{
          root: "w-full",
          error: "sm:!text-end !text-start w-full",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">{renderOptions(takingMeds, "takingMeds", ["Yes", "No"])}</div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.takingMeds)}</p>
      </Radio.Group>

      {/* Conditional input */}
      {takingMeds === "Yes" && (
        <div>
          <TextInput
            label="Please specify the medications or supplements you are taking:"
            placeholder="e.g., Finasteride — 1mg — daily"
            value={medsDetails}
            {...register("medsDetails")}
            onChange={(e) => {
              setValue("medsDetails", e.currentTarget.value);
              if (e.currentTarget.value) clearErrors("medsDetails");
            }}
            className="pt-6 w-full"
          />
          <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.medsDetails)}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 pt-6">
        <Button
          variant="outline"
          className="w-[200px]"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="submit"
          form="medicalHistoryForm"
          className="w-[200px]"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default MedicalHistory;
