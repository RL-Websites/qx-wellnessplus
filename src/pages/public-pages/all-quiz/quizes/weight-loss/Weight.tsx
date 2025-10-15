import { InputErrorMessage } from "@/common/configs/inputErrorMessage";
import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const weightLossWeightSchema = yup.object({
  weightlossweight: yup.string().required("Please add your current weight"),
});

export type weightLossWeightSchemaType = yup.InferType<typeof weightLossWeightSchema>;

interface IWeightLossWeightProps {
  onNext: (data: weightLossWeightSchemaType) => void;
  onBack: () => void;
  defaultValues?: weightLossWeightSchemaType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const WeightLossWeight = ({ onNext, onBack, defaultValues, direction }: IWeightLossWeightProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<weightLossWeightSchemaType>({
    defaultValues: {
      weightlossweight: defaultValues?.weightlossweight || "",
    },
    resolver: yupResolver(weightLossWeightSchema),
  });

  const weightLossWeight = watch("weightlossweight");

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (errors.weightlossweight) {
      setIsErrorFading(true);
      setTimeout(() => {
        setValue("weightlossweight", value, { shouldValidate: true });
        clearErrors("weightlossweight");
        setIsErrorFading(false);
      }, 300);
    } else {
      setValue("weightlossweight", value, { shouldValidate: true });
    }
  };

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: weightLossWeightSchemaType) => {
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
  const [isErrorFading, setIsErrorFading] = useState(false);

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <div className=" card-common-width mx-auto ">
        <h2 className={`text-center text-3xl font-poppins font-semibold text-foreground ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
          What is your current weight?
        </h2>
        <form
          id="weightLossWeightForm"
          onSubmit={handleSubmit(handleFormSubmit)}
          className={`max-w-xl mx-auto space-y-6 card-common ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
        >
          <div>
            <Input.Wrapper
              label="Your Weight (lbs)"
              required
              error={errors.weightlossweight?.message ? errors.weightlossweight?.message : false}
              classNames={{ ...InputErrorMessage, error: `${isErrorFading ? "error-fade-out" : "animate-pulseFade"}` }}
            >
              <Input
                type="text"
                {...register("weightlossweight", {
                  onChange: handleSelect,
                })}
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
          form="weightLossWeightForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default WeightLossWeight;
