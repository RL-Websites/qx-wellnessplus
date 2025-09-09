import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const ageWeightLossSchema = yup.object({
  ageWeightLoss: yup.string().required("Please add your age for weight loss"),
});

export type ageWeightLossSchemaType = yup.InferType<typeof ageWeightLossSchema>;

interface IAgeWeightLossProps {
  onNext: (data: ageWeightLossSchemaType) => void;
  onBack: () => void;
  defaultValues?: ageWeightLossSchemaType;
}

const AgeWeightLoss = ({ onNext, onBack, defaultValues }: IAgeWeightLossProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<ageWeightLossSchemaType>({
    defaultValues: {
      ageWeightLoss: defaultValues?.ageWeightLoss || "",
    },
    resolver: yupResolver(ageWeightLossSchema),
  });

  const ageWeightLoss = watch("ageWeightLoss");

  const handleSelect = (value: string) => {
    setValue("ageWeightLoss", value, { shouldValidate: true });
    clearErrors("ageWeightLoss");
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <div className=" card-common-width mx-auto ">
        <h2 className="text-center text-3xl font-poppins font-semibold text-foreground animate-title">What is your age for weight loss?</h2>
        <form
          id="ageWeightLossForm"
          onSubmit={handleSubmit(onNext)}
          className="max-w-xl mx-auto space-y-6 card-common animate-content"
        >
          <div>
            <Input.Wrapper
              label="Your Age for Weight Loss"
              required
              error={errors.ageWeightLoss?.message ? errors.ageWeightLoss?.message : false}
              classNames={{
                label: "!text-sm md:!text-base lg:!text-lg",
              }}
            >
              <Input
                type="text"
                {...register("ageWeightLoss")}
              />
            </Input.Wrapper>
          </div>
        </form>
      </div>
      <div className="flex justify-center md:gap-6 gap-3 md:pt-8 pt-5 delay-[1400] duration-500 animate-fadeInUp">
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
          form="ageWeightLossForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AgeWeightLoss;
