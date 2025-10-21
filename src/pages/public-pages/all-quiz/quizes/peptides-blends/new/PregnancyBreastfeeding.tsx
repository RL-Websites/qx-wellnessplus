import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const pregnancyBreastfeedingSchema = yup.object({
  pregnancyBreastfeeding: yup.string().required("Please select an option."),
});

export type PregnancyBreastfeedingSchemaType = yup.InferType<typeof pregnancyBreastfeedingSchema>;

interface IPregnancyBreastfeedingProps {
  onNext: (data: PregnancyBreastfeedingSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: PregnancyBreastfeedingSchemaType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const PregnancyBreastfeeding = ({ onNext, onBack, defaultValues, direction }: IPregnancyBreastfeedingProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<PregnancyBreastfeedingSchemaType>({
    defaultValues: {
      pregnancyBreastfeeding: defaultValues?.pregnancyBreastfeeding || "",
    },
    resolver: yupResolver(pregnancyBreastfeedingSchema),
  });

  const pregnancyBreastfeeding = watch("pregnancyBreastfeeding");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    if (errors.pregnancyBreastfeeding) {
      setIsErrorFading(true);
      setTimeout(() => {
        setValue("pregnancyBreastfeeding", value, { shouldValidate: true });
        clearErrors("pregnancyBreastfeeding");
        setIsErrorFading(false);
      }, 300);
    } else {
      setValue("pregnancyBreastfeeding", value, { shouldValidate: true });
    }
  };

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);
  const [isErrorFading, setIsErrorFading] = useState(false);

  const handleFormSubmit = (data: PregnancyBreastfeedingSchemaType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      onNext({ ...data, eligible: data.pregnancyBreastfeeding === "Yes" });
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
        id="pregnancyBreastfeedingForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className={`text-center text-3xl font-poppins font-semibold text-foreground ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
            Are you pregnant, planning pregnancy, or currently breastfeeding?
          </h2>

          <Radio.Group
            value={pregnancyBreastfeeding}
            onChange={handleSelect}
            className={`mt-6 w-full ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
          >
            <div className="grid md:grid-cols-2 w-full gap-5">
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(pregnancyBreastfeeding, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {pregnancyBreastfeeding === option && (
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

          {errors.pregnancyBreastfeeding && (
            <Text className={`text-red-500 text-sm mt-5 text-center ${isErrorFading ? "error-fade-out" : "animate-pulseFade"}`}>{errors.pregnancyBreastfeeding.message}</Text>
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
            form="pregnancyBreastfeedingForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PregnancyBreastfeeding;
