import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const symptomHistorySchema = yup.object({
  excessiveShedding: yup.string().required("Please select an option."),
  previousTreatments: yup.string().required("Please select an option."),
  otherSymptoms: yup.string().required("Please select at least one symptom."),
});

export type symptomHistorySchemaType = yup.InferType<typeof symptomHistorySchema>;

interface SymptomHistoryProps {
  onNext: (data: symptomHistorySchemaType) => void;
  onBack: () => void;
  defaultValues?: symptomHistorySchemaType;
}

const SymptomHistory = ({ onNext, onBack, defaultValues }: SymptomHistoryProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<symptomHistorySchemaType>({
    resolver: yupResolver(symptomHistorySchema),
    defaultValues: {
      excessiveShedding: defaultValues?.excessiveShedding || "",
      previousTreatments: defaultValues?.previousTreatments || "",
      otherSymptoms: defaultValues?.otherSymptoms || "",
    },
  });

  const excessiveShedding = watch("excessiveShedding");
  const previousTreatments = watch("previousTreatments");
  const otherSymptoms = watch("otherSymptoms");

  const selectedSymptoms = otherSymptoms ? otherSymptoms.split(", ") : [];

  const renderOptions = (fieldValue: string, fieldName: keyof symptomHistorySchemaType, options: string[]) =>
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
                <i className="icon-tick text-sm/none"></i>
              </span>
            )}
          </div>
        }
      />
    ));

  return (
    <form
      id="symptomHistoryForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      {/* Q1 */}
      <Radio.Group
        label="Do you notice excessive hair shedding while combing/washing?"
        value={excessiveShedding}
        onChange={(value) => {
          setValue("excessiveShedding", value);
          clearErrors("excessiveShedding");
        }}
        classNames={{
          error: "sm:!text-end !text-start w-full",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">{renderOptions(excessiveShedding, "excessiveShedding", ["Yes", "No"])}</div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.excessiveShedding)}</p>
      </Radio.Group>

      {/* Q2 */}
      <Radio.Group
        label="Have you tried hair loss treatments before?"
        value={previousTreatments}
        onChange={(value) => {
          setValue("previousTreatments", value);
          clearErrors("previousTreatments");
        }}
        classNames={{
          error: "sm:!text-end !text-start w-full",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">{renderOptions(previousTreatments, "previousTreatments", ["Yes — effective", "Yes — not effective", "No"])}</div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.previousTreatments)}</p>
      </Radio.Group>

      {/* Q3 */}
      <div>
        <h3 className="sm:text-2xl text-lg font-semibold text-foreground font-poppins mb-6">Are you experiencing other symptoms? (Select all that apply)</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          {["Scalp itching/flaking", "Hair breakage", "Weight changes, fatigue, or hormonal symptoms", "None"].map((option) => {
            const isChecked = selectedSymptoms.includes(option);
            return (
              <div
                key={option}
                onClick={() => {
                  let updatedSymptoms = [...selectedSymptoms];
                  if (isChecked) {
                    updatedSymptoms = updatedSymptoms.filter((v) => v !== option);
                  } else {
                    updatedSymptoms.push(option);
                  }
                  setValue("otherSymptoms", updatedSymptoms.join(", "));
                  clearErrors("otherSymptoms");
                }}
                className={`cursor-pointer border rounded-2xl px-6 py-4 flex justify-between items-center transition-all ${
                  isChecked ? "border-primary bg-white text-black shadow-sm" : "border-grey-medium bg-transparent text-black"
                }`}
              >
                <span className="text-base font-medium font-poppins">{option}</span>
                <Checkbox
                  checked={isChecked}
                  readOnly
                  size="md"
                  radius="md"
                  classNames={{
                    input: isChecked ? "bg-primary border-primary text-white" : "bg-transparent border-foreground",
                  }}
                />
              </div>
            );
          })}
        </div>
        {errors.otherSymptoms && <div className="text-danger text-sm mt-2 text-center">{errors.otherSymptoms.message}</div>}
      </div>

      {/* Navigation Buttons */}
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
          form="symptomHistoryForm"
          className="w-[200px]"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default SymptomHistory;
