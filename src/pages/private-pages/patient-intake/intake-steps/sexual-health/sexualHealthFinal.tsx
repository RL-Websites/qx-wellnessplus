import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Radio, TextInput } from "@mantine/core";
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
}

const goalOptions = ["Better performance", "Increased libido", "Hormonal balance", "Overall wellness"];

const SexualHealthFinal = ({ onNext, onBack, defaultValues }: SexualHealthFinalProps) => {
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
  const sexualHealthGoals = watch("sexualHealthGoals");

  const handleSelect = (field: keyof SexualHealthFinalSchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  return (
    <form
      id="sexualHealthFinalForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      <Radio.Group
        value={hasLiverKidneyIssues}
        onChange={(val) => handleSelect("hasLiverKidneyIssues", val)}
        label="Do you have any history of liver or kidney disease?"
        classNames={{ label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2" }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
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
              classNames={getBaseWebRadios(hasLiverKidneyIssues, option)}
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.hasLiverKidneyIssues)}</p>
      </Radio.Group>

      <Radio.Group
        value={lifestyleFactors}
        onChange={(val) => handleSelect("lifestyleFactors", val)}
        label="Do you have any lifestyle factors affecting sexual health (smoking, heavy alcohol use, stress, lack of sleep)?"
        classNames={{ label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2" }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
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
              classNames={getBaseWebRadios(lifestyleFactors, option)}
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.lifestyleFactors)}</p>
      </Radio.Group>

      {lifestyleFactors === "Yes" && (
        <TextInput
          label="Please describe the lifestyle factors affecting your sexual health:"
          placeholder="e.g. Smoking, stress from work, poor sleep"
          value={watch("lifestyleDetails")}
          onChange={(e) => handleSelect("lifestyleDetails", e.currentTarget.value)}
          error={getErrorMessage(errors?.lifestyleDetails)}
          className="pt-6"
        />
      )}

      {/* Sexual Health Goals */}
      <Checkbox.Group
        label="What are your goals for sexual health treatment?"
        value={sexualHealthGoals ? sexualHealthGoals.split(", ") : []}
        onChange={(valueArray) => handleSelect("sexualHealthGoals", valueArray.join(", "))}
        className="pt-4"
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {goalOptions.map((option) => (
            <Checkbox
              key={option}
              value={option}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {sexualHealthGoals?.split(", ").includes(option) && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
              classNames={getBaseWebRadios(sexualHealthGoals, option)}
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.sexualHealthGoals)}</p>
      </Checkbox.Group>

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
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default SexualHealthFinal;
