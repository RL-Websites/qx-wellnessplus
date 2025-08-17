import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const hairGrowthBreastFeedingSchema = yup.object({
  breastFeeding: yup.string().required("Please select an option."),
});

export type HairGrowthBreastFeedingSchemaType = yup.InferType<typeof hairGrowthBreastFeedingSchema>;

interface IHairGrowthBreastFeedingProps {
  onNext: (data: HairGrowthBreastFeedingSchemaType) => void;
  onBack: () => void;
  defaultValues?: HairGrowthBreastFeedingSchemaType;
}

const HairGrowthBreastFeeding = ({ onNext, onBack, defaultValues }: IHairGrowthBreastFeedingProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<HairGrowthBreastFeedingSchemaType>({
    defaultValues: {
      breastFeeding: defaultValues?.breastFeeding || "",
    },
    resolver: yupResolver(hairGrowthBreastFeedingSchema),
  });

  const breastFeeding = watch("breastFeeding");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("breastFeeding", value, { shouldValidate: true });
    clearErrors("breastFeeding");
  };

  return (
    <form
      id="hairGrowthBreastFeedingForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-xl mx-auto space-y-6"
    >
      <div>
        <h2 className="text-center text-3xl font-poppins font-semibold text-foreground">Are you breastfeeding?</h2>

        <Radio.Group
          value={breastFeeding}
          onChange={handleSelect}
          className="mt-6"
          error={errors?.breastFeeding?.message}
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
                    ${breastFeeding === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                  `,
                }}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {breastFeeding === option && (
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
          form="hairGrowthBreastFeedingForm"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default HairGrowthBreastFeeding;
