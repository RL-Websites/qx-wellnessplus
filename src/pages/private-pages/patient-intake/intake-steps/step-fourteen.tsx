import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Grid, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step14Schema = yup.object({
  diabeticStatus: yup.string().required("Please select at least one value."),
  takeDiabeticDrugName: yup.string().when("diabeticStatus", {
    is: "Yes",
    then: (schema) => schema.required("Please select what drugs do you use?"),
  }),
  takeDiabeticHemoglobin: yup.string().when("diabeticStatus", {
    is: "Yes",
    then: (schema) => schema.required("Please mention drugs name you use."),
  }),
});

export type step14SchemaType = yup.InferType<typeof step14Schema>;

interface StepFourteenProps {
  onNext: (data: step14SchemaType) => void;
  onBack: () => void;
  defaultValues?: step14SchemaType;
}

const StepFourteen = ({ onNext, onBack, defaultValues }: StepFourteenProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<step14SchemaType>({
    defaultValues: {
      diabeticStatus: defaultValues?.diabeticStatus || "",
      takeDiabeticDrugName: defaultValues?.takeDiabeticDrugName || "",
      takeDiabeticHemoglobin: defaultValues?.takeDiabeticHemoglobin || "",
    },
    resolver: yupResolver(step14Schema),
  });

  const diabeticStatus = watch("diabeticStatus");
  const selectedDrugs = watch("takeDiabeticDrugName")?.split(", ") || [];
  const hemoglobinValue = watch("takeDiabeticHemoglobin");
  const showFollowUps = diabeticStatus === "Yes";

  const toggleDrug = (value: string) => {
    let updated: string[];
    if (selectedDrugs.includes(value)) {
      updated = selectedDrugs.filter((v) => v !== value);
    } else {
      updated = [...selectedDrugs, value];
    }
    setValue("takeDiabeticDrugName", updated.join(", "), { shouldValidate: true });
    clearErrors("takeDiabeticDrugName");
  };

  return (
    <form
      id="step14Form"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      {/* Main question */}
      <Radio.Group
        value={diabeticStatus}
        onChange={(val) => {
          setValue("diabeticStatus", val, { shouldValidate: true });
          setValue("takeDiabeticDrugName", "");
          setValue("takeDiabeticHemoglobin", "");
          clearErrors("diabeticStatus");
        }}
        label="Are you pre-diabetic or diabetic?"
        error={getErrorMessage(errors?.diabeticStatus)}
        classNames={{ label: "!text-3xl pb-2" }}
      >
        <div className="grid grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(diabeticStatus, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {diabeticStatus === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 right-3 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
      </Radio.Group>

      {/* Conditional: Drug options styled like StepTwo */}
      {showFollowUps && (
        <div>
          <h3 className="text-2xl font-semibold text-foreground font-poppins text-center">Are you currently taking any of the following medications? (Select all that apply)</h3>
          <Grid
            gutter="md"
            className="mt-6"
          >
            {["Insulin", "GLP-1 receptor agonists", "Sulfonylureas", "None of the above"].map((option) => {
              const isChecked = selectedDrugs.includes(option);
              return (
                <Grid.Col
                  span={6}
                  key={option}
                >
                  <div
                    onClick={() => toggleDrug(option)}
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
          {errors.takeDiabeticDrugName && <div className="text-danger text-sm mt-2 text-center">{errors.takeDiabeticDrugName.message}</div>}
        </div>
      )}

      {/* Conditional: Hemoglobin question */}
      {showFollowUps && (
        <Radio.Group
          value={hemoglobinValue}
          onChange={(val) => setValue("takeDiabeticHemoglobin", val, { shouldValidate: true })}
          label="What is your hemoglobin A1C?"
          error={getErrorMessage(errors?.takeDiabeticHemoglobin)}
          classNames={{ label: "!text-2xl pb-2" }}
        >
          <div className="grid grid-cols-2 gap-5">
            {["Below 5.7% (Normal)", "5.7-6.4% (Prediabetes)", "Above 6.5% (Diabetes)", "Unknown"].map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(hemoglobinValue, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {hemoglobinValue === option && (
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 right-3 -translate-y-1/2">
                        <i className="icon-tick text-sm/none"></i>
                      </span>
                    )}
                  </div>
                }
              />
            ))}
          </div>
        </Radio.Group>
      )}

      {/* Navigation */}
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
          form="step14Form"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StepFourteen;
