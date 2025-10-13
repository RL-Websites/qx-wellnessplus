import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Grid } from "@mantine/core";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface MedicalConditionsProps {
  onNext: (data: MedicalConditionsFormType) => void;
  onBack: () => void;
  defaultValues?: MedicalConditionsFormType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const schema = yup.object({
  medicalConditions: yup.array().of(yup.string()).min(1, "Please select at least one option.").required(),
});

type MedicalConditionsFormType = yup.InferType<typeof schema>;

const MedicalConditions = ({ onNext, onBack, defaultValues, direction }: MedicalConditionsProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MedicalConditionsFormType>({
    defaultValues: {
      medicalConditions: defaultValues?.medicalConditions || [],
    },
    resolver: yupResolver(schema),
  });

  const options = useMemo(
    () => [
      "Atherosclerosis",
      "Atrial fibrillation",
      "Arrhythmia",
      "History of heart attack (MI)",
      "Stents",
      "CABG (bypass surgery)",
      "High cholesterol",
      "Fatty liver disease",
      "Polycystic ovarian syndrome (PCOS)",
      "None of the above",
    ],
    []
  );

  const selectedValues = watch("medicalConditions");

  const toggleValue = (value: string) => {
    let updated: string[] = [];

    if (value === "None of the above") {
      updated = selectedValues.includes(value) ? [] : [value];
    } else {
      const filtered = selectedValues.filter((v) => v !== "None of the above");
      if (selectedValues.includes(value)) {
        updated = filtered.filter((v) => v !== value);
      } else {
        updated = [...filtered, value];
      }
    }

    setValue("medicalConditions", updated, { shouldValidate: true });
  };
  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: MedicalConditionsFormType) => {
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

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="MedicalConditionsForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className={`text-center text-3xl font-semibold text-foreground font-poppins ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
            Do you suffer from any of these medical conditions?
          </h2>

          <Grid
            gutter="md"
            className={`mt-6 ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
          >
            {options.map((option) => {
              const isChecked = selectedValues.includes(option);
              return (
                <Grid.Col
                  span={12}
                  key={option}
                >
                  <div
                    onClick={() => toggleValue(option)}
                    className={`cursor-pointer border rounded-2xl px-6 py-4 flex justify-between items-center transition-all ${
                      isChecked ? "border-primary bg-white text-black shadow-sm" : "border-gray-300 bg-transparent text-black"
                    }`}
                  >
                    <span className="text-base font-medium font-poppins">{option}</span>
                    <Checkbox
                      checked={isChecked}
                      readOnly
                      size="md"
                      radius="md"
                      classNames={{
                        input: isChecked ? "bg-primary border-primary text-white" : "bg-transparent",
                      }}
                    />
                  </div>
                </Grid.Col>
              );
            })}
          </Grid>

          {errors.medicalConditions && <div className="text-danger text-sm mt-2 text-center animate-pulseFade">{errors.medicalConditions.message}</div>}
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
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MedicalConditions;
