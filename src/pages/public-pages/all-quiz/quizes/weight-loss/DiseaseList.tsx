import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Grid } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const diseaseListSchema = yup.object({
  diseaseList: yup.array().min(1, "Please select at least one option.").of(yup.string()).required(),
});

export type DiseaseListSchemaType = yup.InferType<typeof diseaseListSchema>;

interface IDiseaseListProps {
  onNext: (data: DiseaseListSchemaType) => void;
  onBack: () => void;
  defaultValues?: DiseaseListSchemaType;
}

const DiseaseList = ({ onNext, onBack, defaultValues }: IDiseaseListProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DiseaseListSchemaType>({
    defaultValues: {
      diseaseList: defaultValues?.diseaseList || [],
    },
    resolver: yupResolver(diseaseListSchema),
  });

  const selectedValues = watch("diseaseList");

  const options = [
    "Medullary Thyroid Carcinoma (MTC)",
    "Multiple Endocrine Neoplasia Type 2 (MEN2)",
    "Pancreatitis",
    "Kidney disease (moderate/severe)",
    "Liver disease (moderate/severe)",
    "Severe GI disorders (e.g., gastroparesis)",
    "Diabetic retinopathy",
    "Type 1 Diabetes",
    "Active cancer (undergoing treatment)",
    "History of eating disorders",
    "History of substance abuse or addiction",
    "None of the above",
  ];

  // const toggleValue = (value: string) => {
  //   const updated = selectedValues.includes(value) ? selectedValues.filter((v) => v !== value) : [...selectedValues, value];
  //   setValue("diseaseList", updated, { shouldValidate: true });
  // };

  const toggleValue = (value: string) => {
    let updated: (string | undefined)[] = [];

    if (value === "None of the above") {
      updated = selectedValues?.includes(value) ? [] : [value];
    } else {
      updated = selectedValues?.includes(value) ? selectedValues.filter((v) => v !== value) : [...selectedValues.filter((v) => v !== "None of the above"), value];
    }
    setValue(
      "diseaseList",
      updated.filter((v): v is string => !!v),
      { shouldValidate: true }
    );
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="diseaseListForm"
        onSubmit={handleSubmit(onNext)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-semibold text-foreground font-poppins">Do you have or have had any of the following?</h2>

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

          {errors.diseaseList && <div className="text-danger text-sm mt-2 text-center">{errors.diseaseList.message}</div>}
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
            form="diseaseListForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DiseaseList;
