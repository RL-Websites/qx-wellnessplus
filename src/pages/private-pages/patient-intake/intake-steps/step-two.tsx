import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Grid } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step2Schema = yup.object({
  history: yup.array().min(1, "Please select at least one option.").of(yup.string()).required(),
});

export type Step2SchemaType = yup.InferType<typeof step2Schema>;

interface IStepTwoProps {
  onNext: (data: Step2SchemaType) => void;
  onBack: () => void;
  defaultValues?: Step2SchemaType;
}

const StepTwo = ({ onNext, onBack, defaultValues }: IStepTwoProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step2SchemaType>({
    defaultValues: {
      history: defaultValues?.history || [],
    },
    resolver: yupResolver(step2Schema),
  });

  const selectedValues = watch("history");

  const options = ["Heart disease or stroke", "Liver or kidney disease", "Cancer", "Thyroid disorders"];

  const toggleValue = (value: string) => {
    const updated = selectedValues.includes(value) ? selectedValues.filter((v) => v !== value) : [...selectedValues, value];
    setValue("history", updated, { shouldValidate: true });
  };

  return (
    <form
      id="stepTwoForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-xl mx-auto space-y-6"
    >
      <div>
        <h2 className="text-center text-2xl font-semibold text-foreground">Do you have any history of:</h2>

        <Grid
          gutter="md"
          className="mt-6"
        >
          {options.map((option) => {
            const isChecked = selectedValues.includes(option);
            return (
              <Grid.Col
                span={6}
                key={option}
              >
                <div
                  onClick={() => toggleValue(option)}
                  className={`cursor-pointer border rounded-2xl px-6 py-4 flex justify-between items-center transition-all ${
                    isChecked ? "border-violet-600 bg-white text-black shadow-sm" : "border-gray-300 bg-white text-black"
                  }`}
                >
                  <span className="text-base font-medium font-poppins">{option}</span>
                  <Checkbox
                    checked={isChecked}
                    readOnly
                    size="md"
                    radius="md"
                    classNames={{
                      input: isChecked ? "bg-violet-600 border-violet-600 text-white" : undefined,
                    }}
                  />
                </div>
              </Grid.Col>
            );
          })}
        </Grid>

        {errors.history && <div className="text-red-500 text-sm mt-2 text-center">{errors.history.message}</div>}
      </div>

      <div className="flex justify-center gap-6 pt-4">
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
          form="stepTwoForm"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StepTwo;
