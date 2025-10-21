import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const ThyroidDiseaseSchema = yup.object({
  thyroidDisease: yup.string().required("Please select an option."),
});

export type ThyroidDiseaseSchemaType = yup.InferType<typeof ThyroidDiseaseSchema>;

interface IThyroidDiseaseProps {
  onNext: (data: ThyroidDiseaseSchemaType) => void;
  onBack: () => void;
  defaultValues?: ThyroidDiseaseSchemaType;
  direction?: "forward" | "backward"; // ✅ Add this
}

const ThyroidDisease = ({ onNext, onBack, defaultValues, direction }: IThyroidDiseaseProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<ThyroidDiseaseSchemaType>({
    defaultValues: {
      thyroidDisease: defaultValues?.thyroidDisease || "",
    },
    resolver: yupResolver(ThyroidDiseaseSchema),
  });

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);
  const [isErrorFading, setIsErrorFading] = useState(false);

  const handleFormSubmit = (data: ThyroidDiseaseSchemaType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      setIsExiting(false);
      onNext(data);
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

  const thyroidDisease = watch("thyroidDisease");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    if (errors.thyroidDisease) {
      setIsErrorFading(true);
      setTimeout(() => {
        setValue("thyroidDisease", value, { shouldValidate: true });
        clearErrors("thyroidDisease");
        setIsErrorFading(false);
      }, 300);
    } else {
      setValue("thyroidDisease", value, { shouldValidate: true });
    }
  };

  return (
    <form
      id="thyroidDisease"
      onSubmit={handleSubmit(handleFormSubmit)}
      className="card-common-width-lg  mx-auto space-y-6"
    >
      <div>
        <h2 className={`text-center text-3xl font-poppins font-semibold text-foreground ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
          Do you have severe uncontrolled thyroid disease?
        </h2>

        <Radio.Group
          value={thyroidDisease}
          onChange={handleSelect}
          className={`mt-6 w-full ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
        >
          <div className="grid md:grid-cols-2 w-full gap-5">
            {options.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(thyroidDisease, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {thyroidDisease === option && (
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                        <i className="icon-tick text-sm/none"></i>
                      </span>
                    )}
                  </div>
                }
              />
            ))}
          </div>
        </Radio.Group>
        {errors.thyroidDisease && (
          <Text className={`text-red-500 text-sm mt-5 text-center ${isErrorFading ? "error-fade-out" : "animate-pulseFade"}`}>{errors.thyroidDisease.message}</Text>
        )}
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
          form="thyroidDisease"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default ThyroidDisease;
