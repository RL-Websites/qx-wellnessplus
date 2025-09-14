import { InputErrorMessage } from "@/common/configs/inputErrorMessage";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const weightLossWeightSchema = yup.object({
  weightlossweight: yup.string().required("Please add your current weight"),
});

export type weightLossWeightSchemaType = yup.InferType<typeof weightLossWeightSchema>;

interface IWeightLossWeightProps {
  onNext: (data: weightLossWeightSchemaType) => void;
  onBack: () => void;
  defaultValues?: weightLossWeightSchemaType;
}

const WeightLossWeight = ({ onNext, onBack, defaultValues }: IWeightLossWeightProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<weightLossWeightSchemaType>({
    defaultValues: {
      weightlossweight: defaultValues?.weightlossweight || "",
    },
    resolver: yupResolver(weightLossWeightSchema),
  });

  const weightLossWeight = watch("weightlossweight");

  const handleSelect = (value: string) => {
    setValue("weightlossweight", value, { shouldValidate: true });
    clearErrors("weightlossweight");
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <div className=" card-common-width mx-auto ">
        <h2 className="text-center text-3xl font-poppins font-semibold text-foreground animate-title">What is your current weight?</h2>
        <form
          id="weightLossWeightForm"
          onSubmit={handleSubmit(onNext)}
          className="max-w-xl mx-auto space-y-6 card-common animate-content"
        >
          <div>
            <Input.Wrapper
              label="Your Weight (lbs)"
              required
              error={errors.weightlossweight?.message ? errors.weightlossweight?.message : false}
              classNames={InputErrorMessage}
            >
              <Input
                type="text"
                {...register("weightlossweight")}
              />
            </Input.Wrapper>
          </div>
        </form>
      </div>
      <div className="flex justify-center md:gap-6 gap-3 md:pt-8 pt-5 animate-btns">
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
          form="weightLossWeightForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default WeightLossWeight;
