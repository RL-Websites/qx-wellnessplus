import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const cardiovascularDiseaseSchema = yup.object({
  cardiovascularDisease: yup.string().required("Please select cardiovascular history."),
});

export type CardiovascularDiseaseSchemaType = yup.InferType<typeof cardiovascularDiseaseSchema>;

interface ICardiovascularDiseaseProps {
  onNext: (data: CardiovascularDiseaseSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: CardiovascularDiseaseSchemaType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const CardiovascularDisease = ({ onNext, onBack, defaultValues, direction }: ICardiovascularDiseaseProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<CardiovascularDiseaseSchemaType>({
    defaultValues: {
      cardiovascularDisease: defaultValues?.cardiovascularDisease || "",
    },
    resolver: yupResolver(cardiovascularDiseaseSchema),
  });

  const cardiovascularDisease = watch("cardiovascularDisease");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("cardiovascularDisease", value, { shouldValidate: true });
    clearErrors("cardiovascularDisease");
  };

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: CardiovascularDiseaseSchemaType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      setIsExiting(false);
      onNext({ ...data, eligible: data.cardiovascularDisease === "Yes" });
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
        id="cardiovascularDiseaseForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className={`text-center text-3xl font-poppins font-semibold text-foreground ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
            Do you have uncontrolled cardiovascular disease?
          </h2>

          <Radio.Group
            value={cardiovascularDisease}
            onChange={handleSelect}
            className={`mt-6 w-full ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
          >
            <div className="grid md:grid-cols-2 gap-5 w-full">
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(cardiovascularDisease, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {cardiovascularDisease === option && (
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
          {errors.cardiovascularDisease && <Text className="text-red-500 text-sm mt-5 text-center animate-pulseFade">{errors.cardiovascularDisease.message}</Text>}
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
            form="cardiovascularDiseaseForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CardiovascularDisease;
