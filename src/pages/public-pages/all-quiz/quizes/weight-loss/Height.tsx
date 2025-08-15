import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const weightLossHeightSchema = yup.object({
  weightlossheight: yup.string().required("Please add your current height"),
});

export type weightLossHeightSchemaType = yup.InferType<typeof weightLossHeightSchema>;

interface IWeightLossHeightProps {
  onNext: (data: weightLossHeightSchemaType) => void;
  onBack: () => void;
  defaultValues?: weightLossHeightSchemaType;
}

const WeightLossHeight = ({ onNext, onBack, defaultValues }: IWeightLossHeightProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<weightLossHeightSchemaType>({
    defaultValues: {
      weightlossheight: defaultValues?.weightlossheight || "",
    },
    resolver: yupResolver(weightLossHeightSchema),
  });

  const weightLossHeight = watch("weightlossheight");

  const handleSelect = (value: string) => {
    setValue("weightlossheight", value, { shouldValidate: true });
    clearErrors("weightlossheight");
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <div className=" card-common-width mx-auto ">
        <h2 className="text-center text-3xl font-poppins font-semibold text-foreground">What is your current height?</h2>
        <form
          id="weightLossHeightForm"
          onSubmit={handleSubmit(onNext)}
          className="max-w-xl mx-auto space-y-6 card-common"
        >
          <div>
            <Input.Wrapper
              label="Your Height"
              required
              error={errors.weightlossheight?.message ? errors.weightlossheight?.message : false}
              classNames={{
                label: "!text-sm md:!text-base lg:!text-lg",
              }}
            >
              <Input
                type="text"
                {...register("weightlossheight")}
              />
            </Input.Wrapper>
          </div>
        </form>
      </div>
      <div className="flex justify-center gap-6 pt-8">
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
          form="weightLossHeightForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default WeightLossHeight;
