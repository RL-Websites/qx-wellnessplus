import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Grid, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const testosteroneHistorySchema = yup.object({
  takenTestosterone: yup.string().required("Please select at least one value."),
  testosteroneForms: yup.string().when("takenTestosterone", {
    is: "Yes",
    then: (schema) => schema.required("Please select at least one form of testosterone therapy."),
    otherwise: (schema) => schema.optional(),
  }),
  hasCancerHistory: yup.string().required("Please select at least one value."),
  hasCardioHistory: yup.string().required("Please select at least one value."),
});

export type TestosteroneHistorySchemaType = yup.InferType<typeof testosteroneHistorySchema>;

interface TestosteroneHistoryProps {
  onNext: (data: TestosteroneHistorySchemaType) => void;
  onBack: () => void;
  defaultValues?: Partial<TestosteroneHistorySchemaType>;
  isLoading?: boolean;
}

const TestosteroneHistory = ({ onNext, onBack, defaultValues, isLoading = false }: TestosteroneHistoryProps) => {
  const {
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<TestosteroneHistorySchemaType>({
    resolver: yupResolver(testosteroneHistorySchema),
    defaultValues: {
      takenTestosterone: defaultValues?.takenTestosterone || "",
      testosteroneForms: defaultValues?.testosteroneForms || "",
      hasCancerHistory: defaultValues?.hasCancerHistory || "",
      hasCardioHistory: defaultValues?.hasCardioHistory || "",
    },
  });

  const takenTestosterone = watch("takenTestosterone");
  const selectedForms = watch("testosteroneForms")?.split(", ") || [];
  const hasCancerHistory = watch("hasCancerHistory");
  const hasCardioHistory = watch("hasCardioHistory");

  const testosteroneOptions = ["Injections", "Gels", "Patches", "Oral"];

  const toggleForm = (value: string) => {
    let updated: string[];
    if (selectedForms.includes(value)) {
      updated = selectedForms.filter((v) => v !== value);
    } else {
      updated = [...selectedForms, value];
    }
    setValue("testosteroneForms", updated.join(", "), { shouldValidate: true });
    clearErrors("testosteroneForms");
  };

  const handleSelect = (field: keyof TestosteroneHistorySchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  return (
    <form
      id="testosteroneHistoryForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      <Radio.Group
        value={takenTestosterone}
        onChange={(val) => handleSelect("takenTestosterone", val)}
        label="Have you taken testosterone therapy before?"
        classNames={{ label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2" }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(takenTestosterone, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {takenTestosterone === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.takenTestosterone)}</p>
      </Radio.Group>

      {takenTestosterone === "Yes" && (
        <div>
          <h3 className="sm:text-2xl text-lg font-semibold text-foreground font-poppins">What form did you take? (Select all that apply)</h3>
          <Grid
            gutter="md"
            className="mt-6"
          >
            {testosteroneOptions.map((option) => {
              const isChecked = selectedForms.includes(option);
              return (
                <Grid.Col
                  span={{ sm: 6 }}
                  key={option}
                >
                  <div
                    onClick={() => toggleForm(option)}
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
          {errors.testosteroneForms && <div className="text-danger text-sm mt-2 text-center">{errors.testosteroneForms.message}</div>}
        </div>
      )}

      <Radio.Group
        value={hasCancerHistory}
        onChange={(val) => handleSelect("hasCancerHistory", val)}
        label="Do you have a history of prostate cancer, breast cancer, or high PSA levels?"
        classNames={{ label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2" }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(hasCancerHistory, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {hasCancerHistory === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.hasCancerHistory)}</p>
      </Radio.Group>

      <Radio.Group
        value={hasCardioHistory}
        onChange={(val) => handleSelect("hasCardioHistory", val)}
        label="Do you currently have or have a history of heart disease, stroke, or blood clotting disorders?"
        classNames={{ label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2" }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(hasCardioHistory, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {hasCardioHistory === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.hasCardioHistory)}</p>
      </Radio.Group>

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
          form="testosteroneHistoryForm"
          className="w-[200px]"
          loading={isLoading}
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default TestosteroneHistory;
