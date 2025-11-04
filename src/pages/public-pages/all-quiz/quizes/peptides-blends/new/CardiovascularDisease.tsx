import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useState } from "react";
import { get, useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const cardiovascularDiseasePeptidesSchema = yup.object({
  cardiovascularDiseasePeptides: yup.string().required("Please select cardiovascular history."),
});

export type CardiovascularDiseasePeptidesSchemaType = yup.InferType<typeof cardiovascularDiseasePeptidesSchema>;

interface ICardiovascularDiseasePeptidesProps {
  onNext: (data: CardiovascularDiseasePeptidesSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: CardiovascularDiseasePeptidesSchemaType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const CardiovascularDiseasePeptides = ({ onNext, onBack, defaultValues, direction }: ICardiovascularDiseasePeptidesProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<CardiovascularDiseasePeptidesSchemaType>({
    defaultValues: {
      cardiovascularDiseasePeptides: defaultValues?.cardiovascularDiseasePeptides || "",
    },
    resolver: yupResolver(cardiovascularDiseasePeptidesSchema),
  });

  const [isExiting, setIsExiting] = useState(false);
  const [isErrorFading, setIsErrorFading] = useState(false);

  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: CardiovascularDiseasePeptidesSchemaType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      onNext({ ...data, eligible: data.cardiovascularDiseasePeptides === "Yes" });
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

  const cardiovascularDiseasePeptides = watch("cardiovascularDiseasePeptides");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    if (errors.cardiovascularDiseasePeptides) {
      setIsErrorFading(true);
      setTimeout(() => {
        setValue("cardiovascularDiseasePeptides", value, { shouldValidate: true });
        clearErrors("cardiovascularDiseasePeptides");
        setIsErrorFading(false);
      }, 300);
    } else {
      setValue("cardiovascularDiseasePeptides", value, { shouldValidate: true });
    }
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="cardiovascularDiseasePeptidesForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className={`text-center text-3xl font-poppins font-semibold text-foreground ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
            Do you have uncontrolled cardiovascular disease (e.g., unstable angina, recent heart attack)?
          </h2>

          <Radio.Group
            value={cardiovascularDiseasePeptides}
            onChange={handleSelect}
            className={`mt-6 w-full ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
          >
            <div className="grid md:grid-cols-2 w-full gap-5">
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(cardiovascularDiseasePeptides, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {cardiovascularDiseasePeptides === option && (
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

          {errors.cardiovascularDiseasePeptides && (
            <Text className={`text-red-500 text-sm mt-5 text-center ${isErrorFading ? "error-fade-out" : "animate-pulseFade"}`}>
              {errors.cardiovascularDiseasePeptides.message}
            </Text>
          )}
        </div>

        <div className={`flex justify-center gap-6 pt-4 ${getAnimationClass("btns", isExiting, isBackExiting, direction)}`}>
          <Button
            variant="outline"
            className="w-[200px]"
            onClick={handleBackClick}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="w-[200px]"
            form="cardiovascularDiseasePeptidesForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CardiovascularDiseasePeptides;
