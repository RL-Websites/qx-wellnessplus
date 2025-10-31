import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const kidneyDiseaseSchema = yup.object({
  kidneyDisease: yup.string().required("Please select kidney disease history."),
});

export type KidneyDiseaseSchemaType = yup.InferType<typeof kidneyDiseaseSchema>;

interface IKidneyDiseaseProps {
  onNext: (data: KidneyDiseaseSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: KidneyDiseaseSchemaType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const KidneyDisease = ({ onNext, onBack, defaultValues, direction }: IKidneyDiseaseProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<KidneyDiseaseSchemaType>({
    defaultValues: {
      kidneyDisease: defaultValues?.kidneyDisease || "",
    },
    resolver: yupResolver(kidneyDiseaseSchema),
  });

  const kidneyDisease = watch("kidneyDisease");

  const options = ["No", "Yes"];
  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);
  const [isErrorFading, setIsErrorFading] = useState(false);

  const handleSelect = (value: string) => {
    if (errors.kidneyDisease) {
      setIsErrorFading(true);
      setTimeout(() => {
        setValue("kidneyDisease", value, { shouldValidate: true });
        clearErrors("kidneyDisease");
        setIsErrorFading(false);
      }, 300);
    } else {
      setValue("kidneyDisease", value, { shouldValidate: true });
    }
  };

  const handleFormSubmit = (data: KidneyDiseaseSchemaType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      onNext({ ...data, eligible: data.kidneyDisease === "Yes" });
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
        id="kidneyDiseaseForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className={`text-center text-3xl font-poppins font-semibold text-foreground ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
            Do you have active pancreatitis or severe liver/kidney disease?
          </h2>

          <Radio.Group
            value={kidneyDisease}
            onChange={handleSelect}
            className={`mt-6 w-full ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
          >
            <div className="grid md:grid-cols-2 w-full gap-5">
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(kidneyDisease, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {kidneyDisease === option && (
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

          {errors.kidneyDisease && (
            <Text className={`text-red-500 text-sm mt-5 text-center ${isErrorFading ? "error-fade-out" : "animate-pulseFade"}`}>{errors.kidneyDisease.message}</Text>
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
            form="kidneyDiseaseForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default KidneyDisease;
