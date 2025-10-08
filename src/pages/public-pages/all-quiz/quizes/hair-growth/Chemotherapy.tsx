import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const chemotherapySchema = yup.object({
  chemotherapy: yup.string().required("Please select an option."),
});

export type chemotherapySchemaType = yup.InferType<typeof chemotherapySchema>;

interface IChemotherapyProps {
  onNext: (data: chemotherapySchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: chemotherapySchemaType;
  direction?: "forward" | "backward"; // ✅ Add this
}

const Chemotherapy = ({ onNext, onBack, defaultValues, direction }: IChemotherapyProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<chemotherapySchemaType>({
    defaultValues: {
      chemotherapy: defaultValues?.chemotherapy || "",
    },
    resolver: yupResolver(chemotherapySchema),
  });

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: chemotherapySchemaType) => {
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

  const chemotherapy = watch("chemotherapy");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("chemotherapy", value, { shouldValidate: true });
    clearErrors("chemotherapy");
  };

  return (
    <form
      id="chemotherapyForm"
      onSubmit={handleSubmit(handleFormSubmit)}
      className="card-common-width-lg mx-auto space-y-6"
    >
      <div>
        <h2
          className={`text-center text-3xl font-poppins font-semibold text-foreground ${
            isExiting ? "animate-title-exit" : isBackExiting ? "animate-title-exit-back" : direction === "forward" ? "animate-title-enter-right" : "animate-title-enter-left"
          }`}
        >
          Have you undergone chemotherapy or radiation in the last 6 months?
        </h2>

        <Radio.Group
          value={chemotherapy}
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
                classNames={getBaseWebRadios(chemotherapy, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {chemotherapy === option && (
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
        {errors.chemotherapy && <Text className="text-red-500 text-sm mt-5 text-center">{errors.chemotherapy.message}</Text>}
      </div>

      <div
        className={`flex justify-center gap-6 pt-4 ${
          isExiting ? "animate-btns-exit" : isBackExiting ? "animate-btns-exit-back" : direction === "forward" ? "animate-btns-enter-right" : "animate-btns-enter-left"
        }`}
      >
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
          form="chemotherapyForm"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default Chemotherapy;
