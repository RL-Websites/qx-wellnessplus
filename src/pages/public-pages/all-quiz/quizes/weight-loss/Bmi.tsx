import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const bmiSchema = yup.object({
  bmi: yup.number().typeError("BMI must be a number").required("Please add your current BMI").min(25, "BMI must be at least 25 to proceed"),
});

export type bmiSchemaType = yup.InferType<typeof bmiSchema>;

interface IBMIProps {
  onNext: (data: bmiSchemaType) => void;
  onBack: () => void;
  defaultValues?: bmiSchemaType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const BMI = ({ onNext, onBack, defaultValues, direction }: IBMIProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<bmiSchemaType>({
    defaultValues: {
      bmi: defaultValues?.bmi || "",
    },
    resolver: yupResolver(bmiSchema),
  });

  const bmi = watch("bmi");

  const handleSelect = (value: string) => {
    setValue("bmi", value, { shouldValidate: true });
    clearErrors("bmi");
  };

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: bmiSchemaType) => {
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
          What is your current BMI?
        </h2>
        <form
          id="bmiForm"
          onSubmit={handleSubmit(handleFormSubmit)}
          className={`max-w-xl mx-auto space-y-6 card-common ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
        >
          <div>
            <Input.Wrapper
              label="Your BMI"
              required
              error={errors.bmi?.message ? errors.bmi?.message : false}
              classNames={{
                label: "!text-sm md:!text-base lg:!text-lg",
                error: "animate-pulseFade",
              }}
            >
              <Input
                type="number"
                step="0.1"
                min={0}
                {...register("bmi")}
              />
            </Input.Wrapper>
          </div>
        </form>
      </div>
      <div className={`flex justify-center md:gap-6 gap-3 md:pt-8 pt-5 delay-[700] duration-500 ${getAnimationClass("btns", isExiting, isBackExiting, direction)}`}>
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
          form="bmiForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default BMI;
