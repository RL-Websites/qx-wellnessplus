import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const step1Schema = yup.object({
  primaryGoal: yup.string().required("Please select at least one primary goal."),
  amountOfWeightLoss: yup.string().required("Please select at least one range of weight."),
  exerciseTimes: yup.string().required("Please select at least one frequency of exercise."),
});

export type step1SchemaType = yup.InferType<typeof step1Schema>;

interface IStepOneProps {
  onNext: (data: step1SchemaType) => void;
  onBack: () => void;
  defaultValues?: step1SchemaType;
}

const StepOne = ({ onNext, onBack, defaultValues }: IStepOneProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<step1SchemaType>({
    defaultValues: {
      primaryGoal: defaultValues?.primaryGoal || "",
      amountOfWeightLoss: defaultValues?.amountOfWeightLoss || "",
      exerciseTimes: defaultValues?.exerciseTimes || "",
    },
    resolver: yupResolver(step1Schema),
  });

  const primaryGoal = watch("primaryGoal");
  const amountOfWeightLoss = watch("amountOfWeightLoss");
  const exerciseTimes = watch("exerciseTimes");

  const primaryGoalOptions = [
    "Overall health improvement",
    "Specific weight loss target",
    "Increased energy",
    "Was unable to lose weight and I was unable to follow my dietary and exercise goals",
  ];

  const weightOptions = ["10-20 lbs", "20-30 lbs", "30-40 lbs", "40-50 lbs", "50+ lbs"];

  const exerciseOptions = ["1-2 times per week", "3-4 times per week", "5+ times per week", "Never"];

  const handleSelect = (field: keyof step1SchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  return (
    <form
      id="stepOneForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-6"
    >
      <div className="space-y-10">
        <Radio.Group
          value={primaryGoal}
          onChange={(value) => handleSelect("primaryGoal", value)}
          label="What is your primary goal for weight loss?"
          error={getErrorMessage(errors?.primaryGoal)}
          classNames={{
            root: "sm:!grid !block",
            error: "sm:!text-end !text-start w-full",
            label: "sm:!text-3xl pb-2",
          }}
        >
          <div className="space-y-5">
            {primaryGoalOptions.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(primaryGoal, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {primaryGoal === option && (
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 sm:right-3 -right-2 -translate-y-1/2">
                        <i className="icon-tick text-sm/none"></i>
                      </span>
                    )}
                  </div>
                }
              />
            ))}
          </div>
        </Radio.Group>
        <Radio.Group
          value={amountOfWeightLoss}
          onChange={(value) => handleSelect("amountOfWeightLoss", value)}
          label="How much weight would you like to lose?"
          error={getErrorMessage(errors?.amountOfWeightLoss)}
          classNames={{
            root: "sm:!grid !block",
            error: "sm:!text-end !text-start w-full",
            label: "sm:!text-3xl pb-2",
          }}
        >
          <div className="grid grid-cols-2 gap-5">
            {weightOptions.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(amountOfWeightLoss, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {amountOfWeightLoss === option && (
<<<<<<< HEAD
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 sm:right-3 -right-2 -translate-y-1/2">
=======
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 right-0  -translate-y-1/2">
>>>>>>> 30fafab15aab1eb268b6cdbf860111af475b51e6
                        <i className="icon-tick text-sm/none"></i>
                      </span>
                    )}
                  </div>
                }
              />
            ))}
          </div>
        </Radio.Group>
        <Radio.Group
          value={exerciseTimes}
          onChange={(value) => handleSelect("exerciseTimes", value)}
          label="How often do you exercise?"
          error={getErrorMessage(errors?.exerciseTimes)}
          classNames={{
            root: "sm:!grid !block",
            error: "sm:!text-end !text-start w-full",
            label: "sm:!text-3xl pb-2",
          }}
        >
          <div className="grid sm:grid-cols-2 gap-5">
            {exerciseOptions.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(exerciseTimes, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {exerciseTimes === option && (
<<<<<<< HEAD
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 sm:right-3 -right-2 -translate-y-1/2">
=======
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 right-0  -translate-y-1/2">
>>>>>>> 30fafab15aab1eb268b6cdbf860111af475b51e6
                        <i className="icon-tick text-sm/none"></i>
                      </span>
                    )}
                  </div>
                }
              />
            ))}
          </div>
        </Radio.Group>
      </div>

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
          form="stepOneForm"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StepOne;
