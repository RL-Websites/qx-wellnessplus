import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Radio, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface PrescriptionMedicationsProps {
  onNext: (data: PrescriptionMedicationsFormType & { disqualified: boolean }) => void;
  onBack: () => void;
  defaultValues?: PrescriptionMedicationsFormType;
}

// Schema using Yup
const schema = yup.object({
  medicationType: yup.string().required("Please select a medication option."),
  otherMedication: yup.string().when("medicationType", {
    is: "Other",
    then: (schema) => schema.required("Please specify the medication."),
    otherwise: (schema) => schema.notRequired(),
  }),
});

type PrescriptionMedicationsFormType = yup.InferType<typeof schema>;

const PrescriptionMedications = ({ onNext, onBack, defaultValues }: PrescriptionMedicationsProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm<PrescriptionMedicationsFormType>({
    defaultValues: {
      medicationType: defaultValues?.medicationType || "",
      otherMedication: defaultValues?.otherMedication || "",
    },
    resolver: yupResolver(schema),
  });

  const medicationType = watch("medicationType");

  const onSubmit = (data: PrescriptionMedicationsFormType) => {
    const disqualified = data.medicationType === "Insulin";
    onNext({ ...data, disqualified });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="PrescriptionMedicationsForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <h2 className="text-center text-3xl font-semibold text-foreground font-poppins animate-title">Are you currently taking any prescription medications?</h2>

        <Radio.Group
          value={medicationType}
          onChange={(value) => {
            setValue("medicationType", value as "Insulin" | "Other" | "None", {
              shouldValidate: true,
            });
            if (value !== "Other") {
              setValue("otherMedication", "");
            }
          }}
          className="mt-6 animate-content"
        >
          <Grid gutter="md">
            {["Insulin (may be disqualifier depending on therapy)", "Other prescription medications", "None"].map((label, idx) => {
              const valueMap = ["Insulin", "Other", "None"];
              const value = valueMap[idx];
              return (
                <Grid.Col
                  span={12}
                  key={value}
                >
                  <Radio
                    value={value}
                    classNames={{
                      root: "relative w-full",
                      radio: "hidden",
                      inner: "hidden",
                      labelWrapper: "w-full",
                      label: `
                        block w-full h-full px-6 py-4 rounded-2xl border text-left text-base font-medium cursor-pointer
                        ${medicationType === value ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                      `,
                    }}
                    label={
                      <div className="relative">
                        <span className="text-foreground font-poppins">{label}</span>
                        {medicationType === value && (
                          <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                            <i className="icon-tick text-sm/none"></i>
                          </span>
                        )}
                      </div>
                    }
                  />

                  {/* Conditionally render input for "Other" */}
                  {value === "Other" && medicationType === "Other" && (
                    <TextInput
                      {...register("otherMedication")}
                      placeholder="Please specify other medication"
                      error={errors.otherMedication?.message}
                      className="mt-2"
                    />
                  )}
                </Grid.Col>
              );
            })}
          </Grid>
        </Radio.Group>

        {errors.medicationType && <p className="text-danger text-sm mt-2 text-center">{errors.medicationType.message}</p>}

        <div className="flex justify-center gap-6 pt-6 animate-btns">
          <Button
            variant="outline"
            className="w-[200px]"
            onClick={onBack}
            type="button"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="w-[200px]"
            form="PrescriptionMedicationsForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PrescriptionMedications;
