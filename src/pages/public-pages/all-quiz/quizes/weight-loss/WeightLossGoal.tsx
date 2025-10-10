import { InputErrorMessage } from "@/common/configs/inputErrorMessage";
import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input } from "@mantine/core";
import { useState } from "react";
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
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const WeightLossGoal = ({ onNext, onBack, defaultValues, direction }: IWeightLossGoalProps) => {
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

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: weightLossGoalSchemaType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      onNext(data);
      setIsExiting(false);
    }, animationDelay); // ✅ Matches animation duration (400ms + 100ms delay)
  };

  const handleBackClick = () => {
    setIsBackExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      setIsBackExiting(false);
      onBack();
    }, animationDelay);
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <div className="card-common-width mx-auto">
        <h2 className={`text-center text-3xl font-poppins font-semibold text-foreground ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
          What is your ideal target weight?
        </h2>
        <form
          id="weightLossGoalForm"
          onSubmit={handleSubmit(handleFormSubmit)}
          className={`mcard-common-width-lg mx-auto space-y-6 card-common ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
        >
          <div>
            <Input.Wrapper
              label="Weight Loss Goal (lbs)"
              required
              error={errors.weightlossgoal?.message ? errors.weightlossgoal?.message : false}
              classNames={{ ...InputErrorMessage, error: "animate-pulseFade" }}
            >
              <Input
                type="text"
                {...register("weightlossgoal")}
              />
            </Input.Wrapper>
          </div>
        </form>
      </div>
      <div className={`flex justify-center md:gap-6 gap-3 md:pt-8 pt-5 ${getAnimationClass("btns", isExiting, isBackExiting, direction)}`}>
        <Button
          variant="outline"
          className="w-[200px] animated-btn"
          onClick={handleBackClick}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="w-[200px] animated-btn"
          form="weightLossGoalForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default WeightLossGoal;
