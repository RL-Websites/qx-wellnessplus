import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step1Schema = yup.object({
  primaryGoal: yup.string().required("Please select at least one primary goal."),
  amountOfWeightLoss: yup.string().required("Please select at least one range of weight."),
  exerciseTimes: yup.string().required("Please select at least one frequency of exercise."),
});

export type step1SchemaType = yup.InferType<typeof step1Schema>;

interface StepOneProps {
  onNext: (data: step1SchemaType) => void;
  onBack: () => void;
  defaultValues?: step1SchemaType;
}

const StepOne = ({ onNext, onBack, defaultValues }: StepOneProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<step1SchemaType>({
    resolver: yupResolver(step1Schema),
    defaultValues: {
      primaryGoal: defaultValues?.primaryGoal || "",
      amountOfWeightLoss: defaultValues?.amountOfWeightLoss || "",
      exerciseTimes: defaultValues?.exerciseTimes || "",
    },
  });

  const primaryGoal = watch("primaryGoal");
  const amountOfWeightLoss = watch("amountOfWeightLoss");
  const exerciseTimes = watch("exerciseTimes");

  // const showThyroidType = familyHistory === "yes";
  // const showReportQuestion = thyroidType === "papillary";
  // const showUploadField = hasReport === "yes";

  return (
    <>
      <form
        id="stepOneForm"
        onSubmit={handleSubmit(onNext)}
        className="card divide-y pt-10 space-y-10 min-h-[200px]"
      >
        <Radio.Group
          value={primaryGoal}
          {...register("primaryGoal")}
          onChange={(value) => {
            setValue("primaryGoal", value);
            if (value) {
              clearErrors("primaryGoal");
            }
          }}
          label="What is your primary goal for weight loss?"
          error={getErrorMessage(errors?.primaryGoal)}
        >
          <div className="space-y-3 mt-2">
            <Radio
              value="Overall health improvement"
              label="Overall health improvement"
              color="dark"
              {...register("primaryGoal")}
            />
            <Radio
              value="Specific weight loss target"
              label="Specific weight loss target"
              color="dark"
              {...register("primaryGoal")}
            />
            <Radio
              value="Increased energy"
              label="Increased energy"
              color="dark"
              {...register("primaryGoal")}
            />
            <Radio
              value="Improved body composition"
              label="Improved body composition"
              color="dark"
              {...register("primaryGoal")}
            />
          </div>
        </Radio.Group>

        <Radio.Group
          value={amountOfWeightLoss}
          {...register("amountOfWeightLoss")}
          onChange={(value) => {
            setValue("amountOfWeightLoss", value);
            clearErrors("amountOfWeightLoss");
          }}
          label="How much weight would you like to lose?"
          className="pt-10"
          error={getErrorMessage(errors?.amountOfWeightLoss)}
        >
          <div className="space-y-3 mt-2">
            <Radio
              value="10-20 lbs"
              label="10-20 lbs"
              color="dark"
              {...register("amountOfWeightLoss")}
            />
            <Radio
              value="20-30 lbs"
              label="20-30 lbs"
              color="dark"
              {...register("amountOfWeightLoss")}
            />
            <Radio
              value="30-40 lbs"
              label="30-40 lbs"
              color="dark"
              {...register("amountOfWeightLoss")}
            />
            <Radio
              value="40-50 lbs"
              label="40-50 lbs"
              color="dark"
              {...register("amountOfWeightLoss")}
            />
            <Radio
              value="50+ lbs"
              label="50+ lbs"
              color="dark"
              {...register("amountOfWeightLoss")}
            />
          </div>
        </Radio.Group>

        <Radio.Group
          value={exerciseTimes}
          {...register("exerciseTimes")}
          onChange={(value) => {
            setValue("exerciseTimes", value);
            clearErrors("exerciseTimes");
          }}
          label="How often do you exercise?"
          className="pt-10"
          error={getErrorMessage(errors?.exerciseTimes)}
        >
          <div className="space-y-3 mt-2">
            <Radio
              value="1-2 times per week"
              label="1-2 times per week"
              color="dark"
              {...register("exerciseTimes")}
            />
            <Radio
              value="3-4 times per week"
              label="3-4 times per week"
              color="dark"
              {...register("exerciseTimes")}
            />
            <Radio
              value="5+ times per week"
              label="5+ times per week"
              color="dark"
              {...register("exerciseTimes")}
            />
            <Radio
              value="Never"
              label="Never"
              color="dark"
              {...register("exerciseTimes")}
            />
          </div>
        </Radio.Group>
      </form>
      <div className="flex justify-between gap-6 sm:mx-0 mx-auto mt-6">
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
          form="stepOneForm"
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default StepOne;
