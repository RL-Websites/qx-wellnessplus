import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const bmiSchema = yup.object({
  bmi: yup.number().typeError("BMI must be a number").required("Please add your current BMI").min(25, "BMI must be at least 25 to proceed"),
});

export type bmiSchemaType = yup.InferType<typeof bmiSchema>;

interface IBMIProps {
  onNext: (data: bmiSchemaType) => void;
  onBack: () => void;
  defaultValues?: bmiSchemaType;
}

const BMI = ({ onNext, onBack, defaultValues }: IBMIProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<bmiSchemaType>({
    defaultValues: {
      bmi: defaultValues?.bmi || "",
    },
    resolver: yupResolver(bmiSchema),
  });

  const bmi = watch("bmi");

  const handleSelect = (value: string) => {
    setValue("bmi", value, { shouldValidate: true });
    clearErrors("bmi");
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <div className="card-common-width mx-auto">
        <h2 className="text-center text-3xl font-poppins font-semibold text-foreground animate-title">What is your current BMI?</h2>
        <form
          id="bmiForm"
          onSubmit={handleSubmit(onNext)}
          className="max-w-xl mx-auto space-y-6 card-common animate-content"
        >
          <div>
            <Input.Wrapper
              label="Your BMI"
              required
              error={errors.bmi?.message ? errors.bmi?.message : false}
              classNames={{
                label: "!text-sm md:!text-base lg:!text-lg",
              }}
            >
              <Input
                type="number"
                step="0.1"
                min={0}
                {...register("bmi")}
              />
            </Input.Wrapper>
          </div>
        </form>
      </div>
      <div className="flex justify-center md:gap-6 gap-3 md:pt-8 pt-5 delay-[700] duration-500 animate-fadeInUp">
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
          form="bmiForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default BMI;
