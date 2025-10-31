import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useState } from "react";
import { get, useForm } from "react-hook-form";
import * as yup from "yup";

export const impairmentSchema = yup.object({
  impairment: yup.string().required("Please select an option."),
});

export type ImpairmentSchemaType = yup.InferType<typeof impairmentSchema>;

interface IImpairmentProps {
  onNext: (data: ImpairmentSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: ImpairmentSchemaType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const Impairment = ({ onNext, onBack, defaultValues, direction }: IImpairmentProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<ImpairmentSchemaType>({
    defaultValues: {
      impairment: defaultValues?.impairment || "",
    },
    resolver: yupResolver(impairmentSchema),
  });

  const impairment = watch("impairment");
  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    if (errors.impairment) {
      setIsErrorFading(true);
      setTimeout(() => {
        setValue("impairment", value, { shouldValidate: true });
        clearErrors("impairment");
        setIsErrorFading(false);
      }, 300);
    } else {
      setValue("impairment", value, { shouldValidate: true });
    }
  };

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: ImpairmentSchemaType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      onNext({ ...data, eligible: data.impairment === "Yes" });
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
      <form
        id="impairmentForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className={`text-center text-3xl font-poppins font-semibold text-foreground ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
            Do you have severe liver or renal impairment?
          </h2>

          <Radio.Group
            value={impairment}
            onChange={handleSelect}
            className={`mt-6 w-full ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
          >
            <div className="grid md:grid-cols-2 gap-5 w-full">
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(impairment, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {impairment === option && (
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

          {errors.impairment && (
            <Text className={`text-red-500 text-sm mt-5 text-center ${isErrorFading ? "error-fade-out" : "animate-pulseFade"}`}>{errors.impairment.message}</Text>
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
            form="impairmentForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Impairment;
