import { InputErrorMessage } from "@/common/configs/inputErrorMessage";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const weightLossGoalSchema = yup.object({
  weightlossgoal: yup.string().required("Please add your weight loss goal"),
});

export type weightLossGoalSchemaType = yup.InferType<typeof weightLossGoalSchema>;

interface IWeightLossGoalProps {
  onNext: (data: weightLossGoalSchemaType) => void;
  onBack: () => void;
  defaultValues?: weightLossGoalSchemaType;
}

const WeightLossGoal = ({ onNext, onBack, defaultValues }: IWeightLossGoalProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<weightLossGoalSchemaType>({
    defaultValues: {
      weightlossgoal: defaultValues?.weightlossgoal || "",
    },
    resolver: yupResolver(weightLossGoalSchema),
  });

  const weightLossGoal = watch("weightlossgoal");

  const handleSelect = (value: string) => {
    setValue("weightlossgoal", value, { shouldValidate: true });
    clearErrors("weightlossgoal");
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <div className="card-common-width mx-auto">
        <h2 className="text-center text-3xl font-poppins font-semibold text-foreground">What is your ideal target weight?</h2>
        <form
          id="weightLossGoalForm"
          onSubmit={handleSubmit(onNext)}
          className="max-w-xl mx-auto space-y-6 card-common"
        >
          <div>
            <Input.Wrapper
              label="Weight Loss Goal (lbs)"
              required
              error={errors.weightlossgoal?.message ? errors.weightlossgoal?.message : false}
              classNames={InputErrorMessage}
            >
              <Input
                type="text"
                {...register("weightlossgoal")}
              />
            </Input.Wrapper>
          </div>
        </form>
      </div>
      <div className="flex justify-center md:gap-6 gap-3 md:pt-8 pt-5">
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
          form="weightLossGoalForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default WeightLossGoal;
