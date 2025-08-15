import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const glpOneMedicationSchema = yup.object({
  glpOneMedication: yup.string().required("Please select an option."),
});

export type GlpOneMedicationSchemaType = yup.InferType<typeof glpOneMedicationSchema>;

interface IGlpOneMedicationProps {
  onNext: (data: GlpOneMedicationSchemaType) => void;
  onBack: () => void;
  defaultValues?: GlpOneMedicationSchemaType;
}

const GlpOneMedication = ({ onNext, onBack, defaultValues }: IGlpOneMedicationProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<GlpOneMedicationSchemaType>({
    defaultValues: {
      glpOneMedication: defaultValues?.glpOneMedication || "",
    },
    resolver: yupResolver(glpOneMedicationSchema),
  });

  const glpOneMedication = watch("glpOneMedication");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("glpOneMedication", value, { shouldValidate: true });
    clearErrors("glpOneMedication");
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="glpOneMedicationForm"
        onSubmit={handleSubmit(onNext)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-poppins font-semibold text-foreground">Are you currently or have you ever taken GLP-1 medication?</h2>

          <Radio.Group
            value={glpOneMedication}
            onChange={handleSelect}
            className="mt-6"
            error={errors?.glpOneMedication?.message}
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
                      ${glpOneMedication === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                    `,
                  }}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {glpOneMedication === option && (
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
            form="glpOneMedicationForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GlpOneMedication;
