import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Radio, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// ---------------------------
// ✅ Schema and Type
// ---------------------------
const schema = yup.object({
  hasAllergies: yup.string().required("Please select Yes or No."),
  allergyList: yup.string().when("hasAllergies", {
    is: "Yes",
    then: (schema) => schema.required("Please specify your medication allergies."),
    otherwise: (schema) => schema.notRequired(),
  }),
});

type MedicationAllergiesFormType = yup.InferType<typeof schema>;

interface MedicationAllergiesProps {
  onNext: (data: MedicationAllergiesFormType) => void;
  onBack: () => void;
  defaultValues?: MedicationAllergiesFormType;
}

// ---------------------------
// ✅ Component
// ---------------------------
const MedicationAllergies = ({ onNext, onBack, defaultValues }: MedicationAllergiesProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm<MedicationAllergiesFormType>({
    defaultValues: {
      hasAllergies: defaultValues?.hasAllergies || "",
      allergyList: defaultValues?.allergyList || "",
    },
    resolver: yupResolver(schema),
  });

  const hasAllergies = watch("hasAllergies");

  const onSubmit = (data: MedicationAllergiesFormType) => {
    onNext(data);
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="MedicationAllergiesForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <h2 className="text-center text-3xl font-semibold text-foreground font-poppins">Do you have any known allergies to medications?</h2>

        {/* Yes / No Radio Selection */}
        <Radio.Group
          value={hasAllergies}
          onChange={(value) => {
            setValue("hasAllergies", value as "Yes" | "No", {
              shouldValidate: true,
            });
            if (value === "No") {
              setValue("allergyList", "");
            }
          }}
          className="mt-6"
        >
          <Grid gutter="md">
            {["Yes", "No"].map((label, idx) => {
              const value = idx === 0 ? "Yes" : "No";
              return (
                <Grid.Col
                  span={6}
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
                        ${hasAllergies === value ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                      `,
                    }}
                    label={
                      <div className="relative">
                        <span className="text-foreground font-poppins">{label}</span>
                        {hasAllergies === value && (
                          <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                            <i className="icon-tick text-sm/none"></i>
                          </span>
                        )}
                      </div>
                    }
                  />
                </Grid.Col>
              );
            })}
          </Grid>
        </Radio.Group>

        {errors.hasAllergies && <p className="text-danger text-sm mt-2 text-center">{errors.hasAllergies.message}</p>}

        {/* Allergy Text Input if "Yes" */}
        {hasAllergies === "Yes" && (
          <div>
            <h3 className="text-lg font-medium mt-6 mb-2 text-center">Please Specify</h3>
            <TextInput
              {...register("allergyList")}
              placeholder="List your medication allergies"
              error={errors.allergyList?.message}
              className="mt-2"
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-6 pt-6">
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
            form="MedicationAllergiesForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MedicationAllergies;
