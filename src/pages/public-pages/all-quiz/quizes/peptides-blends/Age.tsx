import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const ageSchema = yup.object({
  age: yup.string().required("Please add your age"),
});

export type ageSchemaType = yup.InferType<typeof ageSchema>;

interface IAgeProps {
  onNext: (data: ageSchemaType) => void;
  onBack: () => void;
  defaultValues?: ageSchemaType;
}

const Age = ({ onNext, onBack, defaultValues }: IAgeProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<ageSchemaType>({
    defaultValues: {
      age: defaultValues?.age || "",
    },
    resolver: yupResolver(ageSchema),
  });

  const age = watch("age");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("age", value, { shouldValidate: true });
    clearErrors("age");
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <div className=" card-common-width mx-auto mt-6">
        <h2 className="text-center text-3xl font-poppins font-semibold text-foreground animate-title">What is your age?</h2>
        <form
          id="ageForm"
          onSubmit={handleSubmit(onNext)}
          className="max-w-xl mx-auto space-y-6 card-common"
        >
          <div className="animate-content">
            <Input.Wrapper
              label="Your Age"
              required
              error={errors.age?.message ? errors.age?.message : false}
              classNames={{
                label: "!text-sm md:!text-base lg:!text-lg",
              }}
            >
              <Input
                type="text"
                {...register("age")}
              />
            </Input.Wrapper>
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
              form="ageForm"
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Age;
