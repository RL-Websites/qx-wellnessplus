import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const weightLossPregnantSchema = yup.object({
  weightLossPregnant: yup.string().required("Please select an option."),
});

export type weightLossPregnantSchemaType = yup.InferType<typeof weightLossPregnantSchema>;

interface IWeightLossPregnantProps {
  onNext: (data: weightLossPregnantSchemaType) => void;
  onBack: () => void;
  defaultValues?: weightLossPregnantSchemaType;
}

const WeightLossPregnant = ({ onNext, onBack, defaultValues }: IWeightLossPregnantProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<weightLossPregnantSchemaType>({
    defaultValues: {
      weightLossPregnant: defaultValues?.weightLossPregnant || "",
    },
    resolver: yupResolver(weightLossPregnantSchema),
  });

  const weightLossPregnant = watch("weightLossPregnant");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("weightLossPregnant", value, { shouldValidate: true });
    clearErrors("weightLossPregnant");
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="weightLossPregnantForm"
        onSubmit={handleSubmit(onNext)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-poppins font-semibold text-foreground animate-title">Are you currently pregnant or trying to get pregnant?</h2>

          <Radio.Group
            value={weightLossPregnant}
            onChange={handleSelect}
            className="mt-6 animate-content"
            error={errors?.weightLossPregnant?.message}
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
                      ${weightLossPregnant === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                    `,
                  }}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {weightLossPregnant === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
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
            form="weightLossPregnantForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WeightLossPregnant;
