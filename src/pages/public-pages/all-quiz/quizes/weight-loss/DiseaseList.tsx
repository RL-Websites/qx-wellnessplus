import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Grid } from "@mantine/core";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const diseaseListSchema = yup.object({
  diseaseList: yup.array().of(yup.string()).min(1, "Please select at least one option.").required(),
});

export type DiseaseListSchemaType = yup.InferType<typeof diseaseListSchema>;

interface IDiseaseListProps {
  onNext: (data: DiseaseListSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: DiseaseListSchemaType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const DiseaseList = ({ onNext, onBack, defaultValues, direction }: IDiseaseListProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DiseaseListSchemaType>({
    defaultValues: {
      diseaseList: defaultValues?.diseaseList || [],
    },
    resolver: yupResolver(diseaseListSchema),
  });

  const selectedValues = watch("diseaseList");

  const options = useMemo(
    () => [
      "Medullary Thyroid Carcinoma (MTC)",
      "Multiple Endocrine Neoplasia Type 2 (MEN2)",
      "Pancreatitis",
      "Kidney disease (moderate/severe)",
      "Liver disease (moderate/severe)",
      "Severe GI disorders (e.g., gastroparesis)",
      "Diabetic retinopathy",
      "Type 1 Diabetes",
      "Active cancer (undergoing treatment)",
      "History of eating disorders",
      "History of substance abuse or addiction",
      "None of the above",
    ],
    []
  );

  // const toggleValue = (value: string) => {
  //   const updated = selectedValues.includes(value) ? selectedValues.filter((v) => v !== value) : [...selectedValues, value];
  //   setValue("diseaseList", updated, { shouldValidate: true });
  // };

  const toggleValue = (value: string) => {
    let updated: (string | undefined)[] = [];

    if (value === "None of the above") {
      updated = selectedValues.includes(value) ? [] : [value];
    } else {
      const filtered = selectedValues.filter((v) => v !== "None of the above");
      updated = selectedValues.includes(value) ? filtered.filter((v) => v !== value) : [...filtered, value];
    }

    setValue(
      "diseaseList",
      updated.filter((v): v is string => typeof v === "string"), // ✅ FIXED HERE
      { shouldValidate: true }
    );
  };

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: DiseaseListSchemaType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      const isEligible = data.diseaseList.length === 1 && data.diseaseList[0] === "None of the above";
      onNext({ ...data, eligible: isEligible });
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
        id="diseaseListForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className={`text-center text-3xl font-semibold text-foreground font-poppins ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
            Do you have or have had any of the following?
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

          {errors.diseaseList && <div className="text-danger text-sm mt-2 text-center animate-pulseFade">{errors.diseaseList.message}</div>}
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
            form="diseaseListForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DiseaseList;
