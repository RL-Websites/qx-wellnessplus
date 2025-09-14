import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Grid, Radio, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const sexualHealthFinalSchema = yup.object({
  hasLiverKidneyIssues: yup.string().required("Please select at least one value."),
  lifestyleFactors: yup.string().required("Please select at least one value."),
  lifestyleDetails: yup.string().when("lifestyleFactors", {
    is: "Yes",
    then: (schema) => schema.required("Please provide details."),
    otherwise: (schema) => schema.optional(),
  }),
  sexualHealthGoals: yup.string().required("Please select at least one goal for treatment."),
});

export type SexualHealthFinalSchemaType = yup.InferType<typeof sexualHealthFinalSchema>;

interface SexualHealthFinalProps {
  onNext: (data: SexualHealthFinalSchemaType) => void;
  onBack: () => void;
  defaultValues?: Partial<SexualHealthFinalSchemaType>;
  isLoading?: boolean;
  isFinalStep?: string;
}

const goalOptions = ["Better performance", "Increased libido", "Hormonal balance", "Overall wellness"];

const SexualHealthFinal = ({ onNext, onBack, defaultValues, isLoading = false, isFinalStep }: SexualHealthFinalProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<SexualHealthFinalSchemaType>({
    resolver: yupResolver(sexualHealthFinalSchema),
    defaultValues: {
      hasLiverKidneyIssues: defaultValues?.hasLiverKidneyIssues || "",
      lifestyleFactors: defaultValues?.lifestyleFactors || "",
      lifestyleDetails: defaultValues?.lifestyleDetails || "",
      sexualHealthGoals: defaultValues?.sexualHealthGoals || "",
    },
  });

  const hasLiverKidneyIssues = watch("hasLiverKidneyIssues");
  const lifestyleFactors = watch("lifestyleFactors");
  const lifestyleDetails = watch("lifestyleDetails");
  const sexualHealthGoals = watch("sexualHealthGoals");
  const selectedGoals = sexualHealthGoals ? sexualHealthGoals.split(", ").filter((g) => g.trim() !== "") : [];
  console.log(selectedGoals);

  const handleSelect = (field: keyof SexualHealthFinalSchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  const toggleGoal = (goal: string) => {
    let updated: string[];
    if (selectedGoals.includes(goal)) {
      updated = selectedGoals.filter((g) => g !== goal);
    } else {
      updated = [...selectedGoals, goal];
    }
    setValue("sexualHealthGoals", updated.filter(Boolean).join(", "), { shouldValidate: true });
    clearErrors("sexualHealthGoals");
  };

  return (
    <form
      id="sexualHealthFinalForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      {/* Liver/Kidney Question */}
      <Radio.Group
        value={hasLiverKidneyIssues}
        onChange={(val) => handleSelect("hasLiverKidneyIssues", val)}
        label="Do you have any history of liver or kidney disease?"
        classNames={{ root: "w-full", label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2" }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(hasLiverKidneyIssues, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {hasLiverKidneyIssues === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.hasLiverKidneyIssues)}</p>
      </Radio.Group>

      {/* Lifestyle Factors Question */}
      <Radio.Group
        value={lifestyleFactors}
        onChange={(val) => handleSelect("lifestyleFactors", val)}
        label="Do you have any lifestyle factors affecting sexual health (smoking, heavy alcohol use, stress, lack of sleep)?"
        classNames={{ root: "w-full", label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2" }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(lifestyleFactors, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {lifestyleFactors === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.lifestyleFactors)}</p>
      </Radio.Group>

      {/* Lifestyle Details (conditional) */}
      {lifestyleFactors === "Yes" && (
        <TextInput
          label="Please describe the lifestyle factors affecting your sexual health:"
          placeholder="e.g. Smoking, stress from work, poor sleep"
          value={lifestyleDetails}
          onChange={(e) => handleSelect("lifestyleDetails", e.currentTarget.value)}
          error={getErrorMessage(errors?.lifestyleDetails)}
          className="pt-6 w-full"
        />
      )}

      {/* Sexual Health Goals */}
      <div>
        <h3 className="sm:text-2xl text-lg font-semibold text-foreground font-poppins">What are your goals for sexual health treatment?</h3>
        <Grid
          gutter="md"
          className="mt-4"
        >
          {goalOptions.map((goal) => {
            const isChecked = selectedGoals.includes(goal);
            return (
              <Grid.Col
                span={{ sm: 6 }}
                key={goal}
              >
                <div
                  onClick={() => toggleGoal(goal)}
                  className={`cursor-pointer border rounded-2xl px-6 py-4 flex justify-between items-center transition-all ${
                    isChecked ? "border-primary bg-white text-black shadow-sm" : "border-grey-medium bg-transparent text-black"
                  }`}
                >
                  <span className="text-base font-medium font-poppins">{goal}</span>
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
              </Grid.Col>
            );
          })}
        </Grid>
        {errors.sexualHealthGoals && <div className="text-danger text-sm mt-2 text-center">{errors.sexualHealthGoals.message}</div>}
      </div>

      {/* Navigation */}
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
          form="sexualHealthFinalForm"
          className="w-[200px]"
          loading={isLoading}
        >
          {isFinalStep ? "Submit" : "Next"}
        </Button>
      </div>
    </form>
  );
};

export default SexualHealthFinal;
