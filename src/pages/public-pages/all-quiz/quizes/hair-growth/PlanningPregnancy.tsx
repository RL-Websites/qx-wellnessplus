import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const planningPregnancySchema = yup.object({
  planningPregnancy: yup.string().required("Please select an option."),
});

export type planningPregnancySchemaType = yup.InferType<typeof planningPregnancySchema>;

interface IPlanningPregnancyProps {
  onNext: (data: planningPregnancySchemaType) => void;
  onBack: () => void;
  defaultValues?: planningPregnancySchemaType;
  direction?: "forward" | "backward"; // ✅ Add this
}

const PlanningPregnancy = ({ onNext, onBack, defaultValues, direction }: IPlanningPregnancyProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<planningPregnancySchemaType>({
    defaultValues: {
      planningPregnancy: defaultValues?.planningPregnancy || "",
    },
    resolver: yupResolver(planningPregnancySchema),
  });

  const planningPregnancy = watch("planningPregnancy");

  const options = ["No", "Yes"];
  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: planningPregnancySchemaType) => {
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

  const handleSelect = (value: string) => {
    setValue("planningPregnancy", value, { shouldValidate: true });
    clearErrors("planningPregnancy");
  };

  return (
    <form
      id="planningPregnancyForm"
      onSubmit={handleSubmit(handleFormSubmit)}
      className="card-common-width-lg mx-auto space-y-6"
    >
      <div>
        <h2
          className={`text-center text-3xl font-poppins font-semibold text-foreground ${
            isExiting ? "animate-title-exit" : isBackExiting ? "animate-title-exit-back" : direction === "forward" ? "animate-title-enter-right" : "animate-title-enter-left"
          }`}
        >
          Are you currently pregnant or planning pregnancy within 3 months?
        </h2>

        <Radio.Group
          value={planningPregnancy}
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
                classNames={getBaseWebRadios(planningPregnancy, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {planningPregnancy === option && (
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
        {errors.planningPregnancy && <Text className="text-red-500 text-sm mt-5 text-center animate-pulseFade">{errors.planningPregnancy.message}</Text>}
      </div>

      <div
        className={`flex justify-center gap-6 pt-4 ${
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
          form="planningPregnancyForm"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default PlanningPregnancy;
