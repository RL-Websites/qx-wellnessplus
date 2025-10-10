import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { heightAtom } from "@/common/states/height.atom";
import { calculateBMI } from "@/utils/bmi.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input } from "@mantine/core";
import { useAtom } from "jotai";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const weightLossHeightSchema = yup.object({
  weightlossheightFeet: yup.string().required("Please enter your height in feet").matches(/^\d+$/, "Feet must be a number"),
  weightlossheightInch: yup.string().required("Please enter your height in inches").matches(/^\d+$/, "Inches must be a number"),
});

export type weightLossHeightSchemaType = yup.InferType<typeof weightLossHeightSchema>;

interface IWeightLossHeightProps {
  onNext: (data: weightLossHeightSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: weightLossHeightSchemaType & { weightlossweight?: string };
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const WeightLossHeight = ({ onNext, onBack, defaultValues, direction }: IWeightLossHeightProps) => {
  const [height, setHeight] = useAtom(heightAtom);
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<weightLossHeightSchemaType>({
    defaultValues: {
      weightlossheightFeet: defaultValues?.weightlossheightFeet || "",
      weightlossheightInch: defaultValues?.weightlossheightInch || "",
    },
    resolver: yupResolver(weightLossHeightSchema),
  });

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: weightLossHeightSchemaType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      const weight = Number(defaultValues?.weightlossweight);
      const feet = Number(data.weightlossheightFeet);
      const inch = Number(data.weightlossheightInch);

      if (isNaN(weight) || isNaN(feet) || isNaN(inch)) {
        alert("Please enter valid numbers for height and weight.");
        return;
      }

      const bmi = calculateBMI(weight, feet, inch);

      const height = { height_feet: Number(data.weightlossheightFeet), height_inch: Number(data.weightlossheightInch) };
      setHeight(height);

      onNext({ ...data, eligible: bmi >= 25 });
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
          What is your current height?
        </h2>

        <form
          id="weightLossHeightForm"
          onSubmit={handleSubmit(handleFormSubmit)}
          className={`max-w-xl mx-auto space-y-6 card-common ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
        >
          <div className="grid grid-cols-1  gap-5">
            <Input.Wrapper
              required
              error={errors.weightlossheightFeet?.message || false}
              classNames={{
                label: "!text-sm md:!text-base lg:!text-lg",
                root: "sm:!grid !block",
                error: "sm:!text-end !text-start w-full animate-pulseFade",
              }}
              className="w-full"
            >
              <Input
                placeholder="Feet"
                type="text"
                {...register("weightlossheightFeet")}
              />
            </Input.Wrapper>

            <Input.Wrapper
              required
              error={errors.weightlossheightInch?.message || false}
              classNames={{
                label: "!text-sm md:!text-base lg:!text-lg",
                root: "sm:!grid !block",
                error: "sm:!text-end !text-start w-full animate-pulseFade",
              }}
              className="w-full"
            >
              <Input
                placeholder="Inches"
                type="text"
                {...register("weightlossheightInch")}
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
          form="weightLossHeightForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default WeightLossHeight;
