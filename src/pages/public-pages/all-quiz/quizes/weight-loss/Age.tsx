import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input } from "@mantine/core";
import { useState } from "react";
import { get, useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const ageWeightLossSchema = yup.object({
  ageWeightLoss: yup.string().required("Please add your age for weight loss"),
});

export type ageWeightLossSchemaType = yup.InferType<typeof ageWeightLossSchema>;

interface IAgeWeightLossProps {
  onNext: (data: ageWeightLossSchemaType) => void;
  onBack: () => void;
  defaultValues?: ageWeightLossSchemaType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const AgeWeightLoss = ({ onNext, onBack, defaultValues, direction }: IAgeWeightLossProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<ageWeightLossSchemaType>({
    defaultValues: {
      ageWeightLoss: defaultValues?.ageWeightLoss || "",
    },
    resolver: yupResolver(ageWeightLossSchema),
  });

  const ageWeightLoss = watch("ageWeightLoss");

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (errors.ageWeightLoss) {
      setIsErrorFading(true);
      setTimeout(() => {
        setValue("ageWeightLoss", value, { shouldValidate: true });
        clearErrors("ageWeightLoss");
        setIsErrorFading(false);
      }, 300);
    } else {
      setValue("ageWeightLoss", value, { shouldValidate: true });
    }
  };

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: ageWeightLossSchemaType) => {
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
          What is your age for weight loss?
        </h2>
        <form
          id="ageWeightLossForm"
          onSubmit={handleSubmit(handleFormSubmit)}
          className={`max-w-xl mx-auto space-y-6 card-common ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
        >
          <div>
            <Input.Wrapper
              label="Your Age for Weight Loss"
              required
              error={errors.ageWeightLoss?.message ? errors.ageWeightLoss?.message : false}
              classNames={{
                label: "!text-sm md:!text-base lg:!text-lg",
                error: `${isErrorFading ? "error-fade-out" : "animate-pulseFade"}`,
              }}
            >
              <Input
                type="text"
                {...register("ageWeightLoss")}
                onChange={handleSelect}
              />
            </Input.Wrapper>
          </div>
        </form>
      </div>
      <div className={`flex justify-center md:gap-6 gap-3 md:pt-8 pt-5 delay-[1400] duration-500 ${getAnimationClass("btns", isExiting, isBackExiting, direction)}`}>
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
          form="ageWeightLossForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AgeWeightLoss;
