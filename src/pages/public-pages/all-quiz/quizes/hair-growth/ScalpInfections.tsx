import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const scalpInfectionsSchema = yup.object({
  scalpInfactions: yup.string().required("Please select an option."),
});

export type scalpInfectionsSchemaType = yup.InferType<typeof scalpInfectionsSchema>;

interface IScalpInfectionsProps {
  onNext: (data: scalpInfectionsSchemaType) => void;
  onBack: () => void;
  defaultValues?: scalpInfectionsSchemaType;
  direction?: "forward" | "backward"; // ✅ Add this
}

const ScalpInfections = ({ onNext, onBack, defaultValues, direction }: IScalpInfectionsProps) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleBackClick = () => {
    setIsBackExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      setIsBackExiting(false);
      onBack();
    }, 750);
  };

  const handleFormSubmit = (data: scalpInfectionsSchemaType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      setIsExiting(false);
      onNext(data);
    }, 750); // ✅ Matches animation duration (400ms + 100ms delay)
  };
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<scalpInfectionsSchemaType>({
    defaultValues: {
      scalpInfactions: defaultValues?.scalpInfactions || "",
    },
    resolver: yupResolver(scalpInfectionsSchema),
  });

  const scalpInfactions = watch("scalpInfactions");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("scalpInfactions", value, { shouldValidate: true });
    clearErrors("scalpInfactions");
  };

  return (
    <form
      id="scalpInfectionsForm"
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`card-common-width-lg mx-auto space-y-6 ${
        isExiting ? "animate-content-exit" : isBackExiting ? "animate-content-exit-back" : direction === "forward" ? "animate-content-enter-right" : "animate-content-enter-left"
      }`}
    >
      <div>
        <h2
          className={`text-center text-3xl font-poppins font-semibold text-foreground ${
            isExiting ? "animate-title-exit" : isBackExiting ? "animate-title-exit-back" : direction === "forward" ? "animate-title-enter-right" : "animate-title-enter-left"
          }`}
        >
          Do you have a history of scalp infections (e.g., seborrheic dermatitis)?
        </h2>

        <Radio.Group
          value={scalpInfactions}
          onChange={handleSelect}
          className={`mt-6 w-full  ${
            isExiting
              ? "animate-content-exit"
              : isBackExiting
              ? "animate-content-exit-back"
              : direction === "forward"
              ? "animate-content-enter-right"
              : "animate-content-enter-left"
          }`}
        >
          <div className="grid md:grid-cols-2 w-full gap-5">
            {options.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(scalpInfactions, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {scalpInfactions === option && (
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
        {errors.scalpInfactions && <Text className="text-red-500 text-sm mt-5 text-center animate-fadeInUp">{errors.scalpInfactions.message}</Text>}
      </div>

      <div
        className={`flex justify-center gap-6 pt-4 animate-btns  ${
          isExiting ? "animate-btns-exit" : isBackExiting ? "animate-btns-exit-back" : direction === "forward" ? "animate-btns-enter-right" : "animate-btns-enter-left"
        }`}
      >
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
          form="scalpInfectionsForm"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default ScalpInfections;
