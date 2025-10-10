import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Radio, Text } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const weightLossPregnantSchema = yup.object({
  weightLossPregnant: yup.string().required("Please select an option."),
});

export type weightLossPregnantSchemaType = yup.InferType<typeof weightLossPregnantSchema>;

interface IWeightLossPregnantProps {
  onNext: (data: weightLossPregnantSchemaType) => void;
  onBack: () => void;
  defaultValues?: weightLossPregnantSchemaType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const WeightLossPregnant = ({ onNext, onBack, defaultValues, direction }: IWeightLossPregnantProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<weightLossPregnantSchemaType>({
    defaultValues: {
      weightLossPregnant: defaultValues?.weightLossPregnant || "",
    },
    resolver: yupResolver(weightLossPregnantSchema),
  });

  const weightLossPregnant = watch("weightLossPregnant");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("weightLossPregnant", value, { shouldValidate: true });
    clearErrors("weightLossPregnant");
  };

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: weightLossPregnantSchemaType) => {
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
      <form
        id="weightLossPregnantForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className={`text-center text-3xl font-poppins font-semibold text-foreground ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
            Are you currently pregnant or trying to get pregnant?
          </h2>

          <Radio.Group
            value={weightLossPregnant}
            onChange={handleSelect}
            className={`mt-6 ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
          >
            <Group grow>
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={{
                    root: "relative w-full",
                    radio: "hidden",
                    inner: "hidden",
                    labelWrapper: "w-full",
                    label: `
                      block w-full h-full px-6 py-4 rounded-2xl border text-center text-base font-medium cursor-pointer
                      ${weightLossPregnant === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                    `,
                  }}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {weightLossPregnant === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                          <i className="icon-tick text-sm/none"></i>
                        </span>
                      )}
                    </div>
                  }
                />
              ))}
            </Group>
          </Radio.Group>
          {errors.weightLossPregnant && <Text className="text-red-500 text-sm mt-5 text-center animate-pulseFade">{errors.weightLossPregnant.message}</Text>}
        </div>

        <div className={`flex justify-center gap-6 pt-4 ${getAnimationClass("btns", isExiting, isBackExiting, direction)}`}>
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
            form="weightLossPregnantForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WeightLossPregnant;
