import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Grid, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface SideEffectsProps {
  onNext: (data: SideEffectsFormType) => void;
  onBack: () => void;
  defaultValues?: SideEffectsFormType;
}

const options = ["Nausea", "Headaches", "Joint pain", "Swelling at injection site", "Fatigue", "No side effects", "Other"];

const schema = yup.object({
  sideEffects: yup.array().of(yup.string()).min(1, "Please select at least one side effect."),
  sideEffectsOther: yup.string().when("sideEffects", (sideEffects: string[], schema) => {
    return sideEffects && sideEffects.includes("Other") ? schema.required("Please specify other side effects.") : schema.notRequired();
  }),
});

export type SideEffectsFormType = yup.InferType<typeof schema>;

const SideEffects = ({ onNext, onBack, defaultValues }: SideEffectsProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm<SideEffectsFormType>({
    defaultValues: {
      sideEffects: defaultValues?.sideEffects || [],
      sideEffectsOther: defaultValues?.sideEffectsOther || "",
    },
    resolver: yupResolver(schema),
  });

  const selectedValues = watch("sideEffects") || "";
  const showOtherInput = selectedValues.includes("Other");

  // Toggle checkbox values
  const toggleValue = (value: string) => {
    let newValues = [...selectedValues];

    // If user selects "No side effects", clear other selections except "No side effects"
    if (value === "No side effects") {
      newValues = newValues.includes("No side effects") ? [] : ["No side effects"];
    } else {
      // If other value toggled and "No side effects" selected, remove "No side effects"
      if (newValues.includes("No side effects")) {
        newValues = newValues.filter((v) => v !== "No side effects");
      }
      if (newValues.includes(value)) {
        newValues = newValues.filter((v) => v !== value);
      } else {
        newValues.push(value);
      }
    }

    setValue("sideEffects", newValues, { shouldValidate: true });

    // Clear other text if "Other" is unchecked
    if (!newValues.includes("Other")) {
      setValue("sideEffectsOther", "");
    }
  };

  const onSubmit = (data: SideEffectsFormType) => {
    onNext(data);
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="SideEffectsForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <h2 className="text-center text-3xl font-semibold text-foreground font-poppins animate-title">Have you experienced any side effects?</h2>

        <Grid
          gutter="md"
          className="mt-6 animate-content"
        >
          {options.map((option) => {
            const isChecked = selectedValues.includes(option);
            return (
              <Grid.Col
                span={12}
                key={option}
              >
                <div
                  onClick={() => toggleValue(option)}
                  className={`cursor-pointer border rounded-2xl px-6 py-4 flex justify-between items-center transition-all ${
                    isChecked ? "border-primary bg-white text-black shadow-sm" : "border-gray-300 bg-transparent text-black"
                  }`}
                >
                  <span className="text-base font-medium font-poppins">{option}</span>
                  <Checkbox
                    checked={isChecked}
                    readOnly
                    size="md"
                    radius="md"
                    classNames={{
                      input: isChecked ? "bg-primary border-primary text-white" : "bg-transparent",
                    }}
                  />
                </div>
              </Grid.Col>
            );
          })}
        </Grid>

        {errors.sideEffects && <p className="text-danger text-sm mt-2 text-center">{errors.sideEffects.message}</p>}

        {showOtherInput && (
          <TextInput
            {...register("sideEffectsOther")}
            placeholder="Please specify other side effects"
            className="mt-4 animate-content"
            error={errors.sideEffectsOther?.message}
          />
        )}

        <div className="flex justify-center gap-6 pt-6 animate-btns">
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
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SideEffects;
