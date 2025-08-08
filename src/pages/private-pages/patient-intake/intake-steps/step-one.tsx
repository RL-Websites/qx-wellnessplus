import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const step1Schema = yup.object({
  doesDiet: yup.string().required("Please select an option."),
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
      doesDiet: defaultValues?.doesDiet || "",
    },
    resolver: yupResolver(step1Schema),
  });

  const doesDiet = watch("doesDiet");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("doesDiet", value, { shouldValidate: true });
    clearErrors("doesDiet");
  };

  return (
    <form
      id="stepOneForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-xl mx-auto space-y-6"
    >
      <div>
        <h2 className="text-center text-3xl font-poppins font-semibold text-foreground">1. Do you have a personal or family history of thyroid cancer?</h2>

        <Radio.Group
          value={doesDiet}
          onChange={handleSelect}
          className="mt-6"
          error={errors?.doesDiet?.message}
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
                    ${doesDiet === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                  `,
                }}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {doesDiet === option && (
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
