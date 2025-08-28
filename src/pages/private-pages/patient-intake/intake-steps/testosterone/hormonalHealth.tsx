import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Grid, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const hormonalHealthSchema = yup.object({
  lowTestosterone: yup.string().required("Please select at least one value."),
  symptomsSH: yup.string().required("At least one option must be selected"),
});

export type HormonalHealthSchemaType = yup.InferType<typeof hormonalHealthSchema>;

interface HormonalHealthProps {
  onNext: (data: HormonalHealthSchemaType) => void;
  onBack: () => void;
  defaultValues?: HormonalHealthSchemaType;
  isLoading?: boolean;
}

const HormonalHealth = ({ onNext, onBack, defaultValues, isLoading = false }: HormonalHealthProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<HormonalHealthSchemaType>({
    defaultValues: {
      lowTestosterone: defaultValues?.lowTestosterone || "",
      symptomsSH: defaultValues?.symptomsSH || "",
    },
    resolver: yupResolver(hormonalHealthSchema),
  });

  const lowTestosterone = watch("lowTestosterone");
  const selectedSymptoms = watch("symptomsSH")?.split(", ") || [];

  const symptomOptions = ["Fatigue", "Low libido", "Mood changes", "Muscle loss"];

  const toggleSymptom = (value: string) => {
    let updated: string[];
    if (selectedSymptoms.includes(value)) {
      updated = selectedSymptoms.filter((v) => v !== value);
    } else {
      updated = [...selectedSymptoms, value];
    }
    setValue("symptomsSH", updated.join(", "), { shouldValidate: true });
    clearErrors("symptomsSH");
  };

  return (
    <form
      id="hormonalHealthForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      <Radio.Group
        value={lowTestosterone}
        onChange={(val) => {
          setValue("lowTestosterone", val, { shouldValidate: true });
          clearErrors("lowTestosterone");
        }}
        label="Have you ever been diagnosed with low testosterone (hypogonadism)?"
        classNames={{
          root: "w-full",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(lowTestosterone, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {lowTestosterone === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.lowTestosterone)}</p>
      </Radio.Group>

      <div>
        <h3 className="sm:text-2xl text-lg font-semibold text-foreground font-poppins">Are you currently experiencing any of the following symptoms?</h3>
        <Grid
          gutter="md"
          className="mt-6"
        >
          {symptomOptions.map((option) => {
            const isChecked = selectedSymptoms.includes(option);
            return (
              <Grid.Col
                span={{ sm: 6 }}
                key={option}
              >
                <div
                  onClick={() => toggleSymptom(option)}
                  className={`cursor-pointer border rounded-2xl px-6 py-4 flex justify-between items-center transition-all ${
                    isChecked ? "border-primary bg-white text-black shadow-sm" : "border-grey-medium bg-transparent text-black"
                  }`}
                >
                  <span className="text-base font-medium font-poppins">{option}</span>
                  <Checkbox
                    checked={isChecked}
                    readOnly
                    size="md"
                    radius="md"
                    classNames={{
                      input: isChecked ? "bg-primary border-primary text-white" : "bg-transparent border-foreground",
                    }}
                  />
                </div>
              </Grid.Col>
            );
          })}
        </Grid>
        {errors.symptomsSH && <div className="text-danger text-sm mt-2 text-center">{errors.symptomsSH.message}</div>}
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
          form="hormonalHealthForm"
          loading={isLoading}
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default HormonalHealth;
