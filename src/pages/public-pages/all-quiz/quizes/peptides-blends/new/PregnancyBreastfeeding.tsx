import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const pregnancyBreastfeedingSchema = yup.object({
  pregnancyBreastfeeding: yup.string().required("Please select an option."),
});

export type PregnancyBreastfeedingSchemaType = yup.InferType<typeof pregnancyBreastfeedingSchema>;

interface IPregnancyBreastfeedingProps {
  onNext: (data: PregnancyBreastfeedingSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: PregnancyBreastfeedingSchemaType;
}

const PregnancyBreastfeeding = ({ onNext, onBack, defaultValues }: IPregnancyBreastfeedingProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<PregnancyBreastfeedingSchemaType>({
    defaultValues: {
      pregnancyBreastfeeding: defaultValues?.pregnancyBreastfeeding || "",
    },
    resolver: yupResolver(pregnancyBreastfeedingSchema),
  });

  const pregnancyBreastfeeding = watch("pregnancyBreastfeeding");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("pregnancyBreastfeeding", value, { shouldValidate: true });
    clearErrors("pregnancyBreastfeeding");
  };

  const onSubmit = (data: PregnancyBreastfeedingSchemaType) => {
    onNext({ ...data, eligible: data.pregnancyBreastfeeding === "Yes" });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="pregnancyBreastfeedingForm"
        onSubmit={handleSubmit(onSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-poppins font-semibold text-foreground">Are you pregnant, planning pregnancy, or currently breastfeeding?</h2>

          <Radio.Group
            value={pregnancyBreastfeeding}
            onChange={handleSelect}
            className="mt-6 w-full"
          >
            <div className="grid md:grid-cols-2 w-full gap-5">
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
                      ${pregnancyBreastfeeding === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                    `,
                  }}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {pregnancyBreastfeeding === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                          <i className="icon-tick text-sm/none"></i>
                        </span>
                      )}
                    </div>
                  }
                />
              ))}
            </div>
          </Radio.Group>

          {errors.pregnancyBreastfeeding && <Text className="text-red-500 text-sm mt-5 text-center">{errors.pregnancyBreastfeeding.message}</Text>}
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
            form="pregnancyBreastfeedingForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PregnancyBreastfeeding;
