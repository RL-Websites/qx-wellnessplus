import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const MedicationTakingSchema = yup.object({
  medicationTaking: yup.string().required("Please select an option."),
});

export type MedicationTakingSchemaType = yup.InferType<typeof MedicationTakingSchema>;

interface IMedicationTakingProps {
  onNext: (data: MedicationTakingSchemaType) => void;
  onBack: () => void;
  defaultValues?: MedicationTakingSchemaType;
  direction?: "forward" | "backward"; // ✅ Add this
}

const MedicationTaking = ({ onNext, onBack, defaultValues, direction }: IMedicationTakingProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<MedicationTakingSchemaType>({
    defaultValues: {
      medicationTaking: defaultValues?.medicationTaking || "",
    },
    resolver: yupResolver(MedicationTakingSchema),
  });

  const medicationTaking = watch("medicationTaking");
  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: MedicationTakingSchemaType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      setIsExiting(false);
      onNext(data);
    }, 750); // ✅ Matches animation duration (400ms + 100ms delay)
  };

  const handleBackClick = () => {
    setIsBackExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      setIsBackExiting(false);
      onBack();
    }, 750);
  };

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("medicationTaking", value, { shouldValidate: true });
    clearErrors("medicationTaking");
  };

  return (
    <form
      id="MedicationTaking"
      onSubmit={handleSubmit(handleFormSubmit)}
      className="card-common-width-lg mx-auto space-y-6"
    >
      <div>
        <h2
          className={`text-center text-3xl font-poppins font-semibold text-foreground ${
            isExiting ? "animate-title-exit" : isBackExiting ? "animate-title-exit-back" : direction === "forward" ? "animate-title-enter-right" : "animate-title-enter-left"
          }`}
        >
          Are you currently taking medications known to cause hair loss?
        </h2>

        <Radio.Group
          value={medicationTaking}
          onChange={handleSelect}
          className={`mt-6 w-full ${
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
                classNames={getBaseWebRadios(medicationTaking, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {medicationTaking === option && (
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
        {errors.medicationTaking && <Text className="text-red-500 text-sm mt-5 text-center animate-fadeInUp">{errors.medicationTaking.message}</Text>}
      </div>

      <div
        className={`flex justify-center gap-6 pt-4  ${
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
          form="MedicationTaking"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default MedicationTaking;
