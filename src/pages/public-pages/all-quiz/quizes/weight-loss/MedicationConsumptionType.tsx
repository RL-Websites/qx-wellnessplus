import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { prevGlpMedDetails } from "@/common/states/product.atom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useAtom } from "jotai";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const medicationConsumptionTypeSchema = yup.object({
  medicationConsumptionType: yup.string().required("Please select a medication type."),
});

export type medicationConsumptionTypeSchemaType = yup.InferType<typeof medicationConsumptionTypeSchema>;

interface IMedicationConsumptionTypeProps {
  onNext: (data: medicationConsumptionTypeSchemaType) => void;
  onBack: () => void;
  defaultValues?: medicationConsumptionTypeSchemaType;
  direction?: "forward" | "backward";
}

const MedicationConsumptionType = ({ onNext, onBack, defaultValues, direction }: IMedicationConsumptionTypeProps) => {
  const [, setPrevGlpDetails] = useAtom(prevGlpMedDetails);
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<medicationConsumptionTypeSchemaType>({
    defaultValues: {
      medicationConsumptionType: defaultValues?.medicationConsumptionType || "",
    },
    resolver: yupResolver(medicationConsumptionTypeSchema),
  });

  const medicationConsumptionType = watch("medicationConsumptionType");

  const options = ["Injection", "ODT"];

  const handleSelect = (value: string) => {
    if (errors.medicationConsumptionType) {
      setIsErrorFading(true);
      setTimeout(() => {
        setValue("medicationConsumptionType", value, { shouldValidate: true });
        setPrevGlpDetails((prev) => ({ ...prev, preferredMedConsumptionType: value.toLowerCase() }));
        clearErrors("medicationConsumptionType");
        setIsErrorFading(false);
      }, 300);
    } else {
      setValue("medicationConsumptionType", value, { shouldValidate: true });
      setPrevGlpDetails((prev) => ({ ...prev, preferredMedConsumptionType: value.toLowerCase() }));
    }
  };

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);
  const [isErrorFading, setIsErrorFading] = useState(false);

  const handleFormSubmit = (data: medicationConsumptionTypeSchemaType) => {
    setIsExiting(true);
    setTimeout(() => {
      onNext(data);
      setIsExiting(false);
    }, animationDelay);
  };

  const handleBackClick = () => {
    setIsBackExiting(true);
    setTimeout(() => {
      setIsBackExiting(false);
      onBack();
    }, animationDelay);
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="medicationConsumptionTypeForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className={`text-center text-3xl font-poppins font-semibold text-foreground ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
            Which GLP-1 medication type are you interested in?
          </h2>

          <Radio.Group
            value={medicationConsumptionType}
            onChange={handleSelect}
            className={`mt-6 w-full ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
          >
            <div className="grid md:grid-cols-2 w-full gap-5">
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(medicationConsumptionType, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {medicationConsumptionType === option && (
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
          {errors.medicationConsumptionType && (
            <Text className={`text-red-500 text-sm mt-5 text-center ${isErrorFading ? "error-fade-out" : "animate-pulseFade"}`}>
              {errors.medicationConsumptionType.message}
            </Text>
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
            form="medicationConsumptionTypeForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MedicationConsumptionType;
