import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const thyroidLiverKidneyDiseaseSchema = yup.object({
  thyroidLiverKidneyDisease: yup.string().required("Please select an option."),
});

export type ThyroidLiverKidneyDiseaseSchemaType = yup.InferType<typeof thyroidLiverKidneyDiseaseSchema>;

interface IThyroidLiverKidneyDiseaseProps {
  onNext: (data: ThyroidLiverKidneyDiseaseSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: ThyroidLiverKidneyDiseaseSchemaType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const ThyroidLiverKidneyDisease = ({ onNext, onBack, defaultValues, direction }: IThyroidLiverKidneyDiseaseProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<ThyroidLiverKidneyDiseaseSchemaType>({
    defaultValues: {
      thyroidLiverKidneyDisease: defaultValues?.thyroidLiverKidneyDisease || "",
    },
    resolver: yupResolver(thyroidLiverKidneyDiseaseSchema),
  });

  const thyroidLiverKidneyDisease = watch("thyroidLiverKidneyDisease");

  const options = ["No", "Yes"];

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);
  const [isErrorFading, setIsErrorFading] = useState(false);

  const handleFormSubmit = (data: ThyroidLiverKidneyDiseaseSchemaType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      onNext({ ...data, eligible: data.thyroidLiverKidneyDisease === "Yes" });
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

  const handleSelect = (value: string) => {
    if (errors.thyroidLiverKidneyDisease) {
      setIsErrorFading(true);
      setTimeout(() => {
        setValue("thyroidLiverKidneyDisease", value, { shouldValidate: true });
        clearErrors("thyroidLiverKidneyDisease");
        setIsErrorFading(false);
      }, 300);
    } else {
      setValue("thyroidLiverKidneyDisease", value, { shouldValidate: true });
    }
  };

  const onSubmit = (data: ThyroidLiverKidneyDiseaseSchemaType) => {};

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="thyroidLiverKidneyDiseaseForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className={`text-center text-3xl font-poppins font-semibold text-foreground ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
            Do you have uncontrolled thyroid, liver, or kidney disease?
          </h2>

          <Radio.Group
            value={thyroidLiverKidneyDisease}
            onChange={handleSelect}
            className={`mt-6 w-full ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
          >
            <div className="grid md:grid-cols-2 w-full gap-5">
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(thyroidLiverKidneyDisease, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {thyroidLiverKidneyDisease === option && (
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

          {errors.thyroidLiverKidneyDisease && (
            <Text className={`text-red-500 text-sm mt-5 text-center ${isErrorFading ? "error-fade-out" : "animate-pulseFade"}`}>{errors.thyroidLiverKidneyDisease.message}</Text>
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
            form="thyroidLiverKidneyDiseaseForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ThyroidLiverKidneyDisease;
