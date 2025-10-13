import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Radio, Text } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const weightLossBreastFeedingSchema = yup.object({
  breastFeeding: yup.string().required("Please select an option."),
});

export type WeightLossBreastFeedingSchemaType = yup.InferType<typeof weightLossBreastFeedingSchema>;

interface IWeightLossBreastFeedingProps {
  onNext: (data: WeightLossBreastFeedingSchemaType) => void;
  onBack: () => void;
  defaultValues?: WeightLossBreastFeedingSchemaType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const WeightLossBreastFeeding = ({ onNext, onBack, defaultValues, direction }: IWeightLossBreastFeedingProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<WeightLossBreastFeedingSchemaType>({
    defaultValues: {
      breastFeeding: defaultValues?.breastFeeding || "",
    },
    resolver: yupResolver(weightLossBreastFeedingSchema),
  });

  const breastFeeding = watch("breastFeeding");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("breastFeeding", value, { shouldValidate: true });
    clearErrors("breastFeeding");
  };

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: WeightLossBreastFeedingSchemaType) => {
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
        id="weightLossBreastFeedingForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className={`text-center text-3xl font-poppins font-semibold text-foreground ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
            Are you currently breastfeeding?
          </h2>

          <Radio.Group
            value={breastFeeding}
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
                      ${breastFeeding === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                    `,
                  }}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {breastFeeding === option && (
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
          {errors.breastFeeding && <Text className="text-red-500 text-sm mt-5 text-center animate-pulseFade">{errors.breastFeeding.message}</Text>}
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
            form="weightLossBreastFeedingForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WeightLossBreastFeeding;
