import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Grid, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface PeptidesTakenBeforeProps {
  onNext: (data: PeptidesTakenBeforeFormType) => void;
  onBack: () => void;
  defaultValues?: PeptidesTakenBeforeFormType;
}

const options = ["BPC-157", "TB-500", "Ipamorelin", "CJC-1295", "GHK-Cu", "Other"];

const schema = yup.object({
  peptidesTaken: yup.array().of(yup.string()).min(1, "Please select at least one option."),
  peptidesOther: yup.string().when("peptidesTaken", {
    is: (val: string[]) => val?.includes("Other"),
    then: (schema) => schema.required("Please specify the peptide."),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export type PeptidesTakenBeforeFormType = yup.InferType<typeof schema>;

const PeptidesTakenBefore = ({ onNext, onBack, defaultValues }: PeptidesTakenBeforeProps) => {
  const {
    handleSubmit,
    setValue,
    register,
    watch,
    formState: { errors },
  } = useForm<PeptidesTakenBeforeFormType>({
    defaultValues: {
      peptidesTaken: defaultValues?.peptidesTaken || [],
      peptidesOther: defaultValues?.peptidesOther || "",
    },
    resolver: yupResolver(schema),
  });

  const selectedValues = watch("peptidesTaken");
  const showOtherInput = selectedValues.includes("Other");

  const toggleValue = (value: string) => {
    const newValues = selectedValues.includes(value) ? selectedValues.filter((v) => v !== value) : [...selectedValues, value];

    setValue("peptidesTaken", newValues, { shouldValidate: true });

    if (!newValues.includes("Other")) {
      setValue("peptidesOther", "");
    }
  };

  const onSubmit = (data: PeptidesTakenBeforeFormType) => {
    onNext(data);
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="PeptidesTakenBeforeForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <h2 className="text-center text-3xl font-semibold text-foreground font-poppins">If you have taken peptide therapy before, what type(s) have you taken?</h2>

        <Grid
          gutter="md"
          className="mt-6"
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

        {errors.peptidesTaken && <p className="text-danger text-sm mt-2 text-center">{errors.peptidesTaken.message}</p>}

        {showOtherInput && (
          <TextInput
            {...register("peptidesOther")}
            placeholder="Please specify other peptides"
            className="mt-4"
            error={errors.peptidesOther?.message}
          />
        )}

        <div className="flex justify-center gap-6 pt-6">
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

export default PeptidesTakenBefore;
