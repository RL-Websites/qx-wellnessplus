import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Grid, Input } from "@mantine/core";
import { useForm } from "react-hook-form";

import * as yup from "yup";

export const step3Schema = yup.object({
  history1: yup.array().of(yup.string()).min(1, "Please select at least one option.").required(),
  discribe: yup.string().when("history1", {
    is: (val: string[]) => val?.includes("Other"),
    then: (schema) => schema.required("Please describe your condition."),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export type Step3SchemaType = yup.InferType<typeof step3Schema>;

interface IStepThreeProps {
  onNext: (data: Step3SchemaType) => void;
  onBack: () => void;
  defaultValues?: Step3SchemaType;
  isLoading?: boolean;
}

const StepThree = ({ onNext, onBack, defaultValues, isLoading = false }: IStepThreeProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm<Step3SchemaType>({
    defaultValues: {
      history1: defaultValues?.history1 || [],
      discribe: defaultValues?.discribe || "",
    },
    resolver: yupResolver(step3Schema),
  });

  const selectedValues = watch("history1");
  const isOtherSelected = selectedValues.includes("Other");

  const options = ["Heart disease or stroke", "Liver or kidney disease", "Cancer", "Thyroid disorders", "Other"];

  const toggleValue = (value: string) => {
    const updated = selectedValues.includes(value) ? selectedValues.filter((v) => v !== value) : [...selectedValues, value];
    setValue("history1", updated, { shouldValidate: true });
  };

  return (
    <form
      id="stepThreeForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-xl mx-auto space-y-6"
    >
      <div>
        <h2 className="text-center text-2xl font-semibold text-foreground font-poppins">Do you have any history of:</h2>

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

        {errors.history1 && <div className="text-red-500 text-sm mt-2 text-center">{errors.history1.message}</div>}

        {isOtherSelected && (
          <div className="mt-4">
            <Input.Wrapper
              label="Discribe"
              withAsterisk
              className="sm:col-span-1 col-span-2"
              error={errors?.discribe?.message}
            >
              <Input
                type="text"
                {...register("discribe")}
                error={Boolean(errors?.discribe?.message)}
              />
            </Input.Wrapper>
          </div>
        )}
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
          form="stepThreeForm"
          loading={isLoading}
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StepThree;
