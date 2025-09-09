import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Grid } from "@mantine/core";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface HealthHistoryProps {
  onNext: (data: HealthHistoryFormType) => void;
  onBack: () => void;
  defaultValues?: HealthHistoryFormType;
}

const schema = yup.object({
  healthHistory: yup.array().of(yup.string()).min(1, "Please select at least one option.").required(),
});

type HealthHistoryFormType = yup.InferType<typeof schema>;

const HealthHistory = ({ onNext, onBack, defaultValues }: HealthHistoryProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HealthHistoryFormType>({
    defaultValues: {
      healthHistory: defaultValues?.healthHistory || [],
    },
    resolver: yupResolver(schema),
  });

  // Options with "None of these" at bottom
  const options = useMemo(
    () => [
      "Pancreatitis",
      "Medullary thyroid cancer (disqualifier)",
      "Multiple endocrine neoplasia (disqualifier)",
      "Wilson's disease",
      "MTHFR",
      "Vitiligo",
      "Erectile dysfunction",
      "Growth hormone deficiency",
      "Growth hormone excess",
      "Addison's disease",
      "None of these",
    ],
    []
  );

  const selectedValues = watch("healthHistory");

  const toggleValue = (value: string) => {
    let updated: string[] = [];

    if (value === "None of these") {
      updated = selectedValues.includes(value) ? [] : [value];
    } else {
      const filtered = selectedValues.filter((v) => v !== "None of these");
      if (selectedValues.includes(value)) {
        updated = filtered.filter((v) => v !== value);
      } else {
        updated = [...filtered, value];
      }
    }

    setValue("healthHistory", updated, { shouldValidate: true });
  };

  const onSubmit = (data: HealthHistoryFormType) => {
    onNext(data);
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="HealthHistoryForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-semibold text-foreground font-poppins animate-title">Health History (Please select all that apply):</h2>

          <Grid
            gutter="md"
            className="mt-6 animate-content"
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

          {errors.healthHistory && <div className="text-danger text-sm mt-2 text-center">{errors.healthHistory.message}</div>}
        </div>

        <div className="flex justify-center gap-6 pt-4 animate-btns">
          <Button
            variant="outline"
            className="w-[200px]"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="w-[200px]"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HealthHistory;
