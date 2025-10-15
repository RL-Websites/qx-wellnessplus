import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { Button, Grid, Radio } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface HypertensionMedProps {
  onNext: (data: HypertensionMedFormType) => void;
  onBack: () => void;
  defaultValues?: HypertensionMedFormType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

type HypertensionMedFormType = {
  takingHypertensionMed: string;
};

const options = ["Yes", "No"];

const HypertensionMedication = ({ onNext, onBack, defaultValues, direction }: HypertensionMedProps) => {
  const { setValue, handleSubmit, watch } = useForm<HypertensionMedFormType>({
    defaultValues: {
      takingHypertensionMed: defaultValues?.takingHypertensionMed || "",
    },
  });

  const selected = watch("takingHypertensionMed");

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: HypertensionMedFormType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      onNext(data);
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
        id="HypertensionMedicationForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className={`text-center text-3xl font-semibold text-foreground font-poppins ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
            Are you taking high blood pressure medication for hypertension?
          </h2>

          <Radio.Group
            value={selected}
            onChange={(value) => setValue("takingHypertensionMed", value, { shouldValidate: true })}
            className={`mt-6 ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
          >
            <Grid gutter="md">
              {options.map((option) => (
                <Grid.Col
                  span={6}
                  key={option}
                >
                  <Radio
                    value={option}
                    classNames={{
                      root: "relative w-full",
                      radio: "hidden",
                      inner: "hidden",
                      labelWrapper: "w-full",
                      error: "animate-pulseFade",
                      label: `
                        block w-full h-full px-6 py-4 rounded-2xl border text-center text-base font-medium cursor-pointer
                        ${selected === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                      `,
                    }}
                    label={
                      <div className="relative text-center">
                        <span className="text-foreground font-poppins">{option}</span>
                        {selected === option && (
                          <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                            <i className="icon-tick text-sm/none"></i>
                          </span>
                        )}
                      </div>
                    }
                  />
                </Grid.Col>
              ))}
            </Grid>
          </Radio.Group>
        </div>

        <div className={`flex justify-center gap-6 pt-4 ${getAnimationClass("btns", isExiting, isBackExiting, direction)}`}>
          <Button
            variant="outline"
            className="w-[200px] animated-btn"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="w-[200px] animated-btn"
            form="HypertensionMedicationForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HypertensionMedication;
