import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const step1Schema = yup.object({
  primaryGoal: yup.string().required("Please select an option."),
});

export type step1SchemaType = yup.InferType<typeof step1Schema>;

interface IStepOneProps {
  onNext: (data: step1SchemaType) => void;
  onBack: () => void;
  defaultValues?: step1SchemaType;
}

const StepOne = ({ onNext, onBack, defaultValues }: IStepOneProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<step1SchemaType>({
    defaultValues: {
      primaryGoal: defaultValues?.primaryGoal || "",
    },
    resolver: yupResolver(step1Schema),
  });

  const primaryGoal = watch("primaryGoal");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("primaryGoal", value, { shouldValidate: true });
    clearErrors("primaryGoal");
  };

  return (
    <form
      id="stepOneForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-xl mx-auto space-y-6"
    >
      <div>
        <h2 className="text-center text-3xl font-poppins font-semibold text-foreground">What is your primary goal for weight loss?</h2>

        <Radio.Group
          value={primaryGoal}
          onChange={handleSelect}
          className="mt-6"
          error={errors?.primaryGoal?.message}
        >
          <Group grow>
            {options.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={{
                  root: "relative w-full",
                  radio: "hidden",
                  inner: "hidden",
                  labelWrapper: "w-full",
                  label: `
                    block w-full h-full px-6 py-4 rounded-2xl border text-center text-base font-medium cursor-pointer
                    ${primaryGoal === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                  `,
                }}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {primaryGoal === option && (
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 right-3 -translate-y-1/2">
                        <i className="icon-tick text-sm/none"></i>
                      </span>
                    )}
                  </div>
                }
              />
            ))}
          </Group>
        </Radio.Group>
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
          form="stepOneForm"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StepOne;
