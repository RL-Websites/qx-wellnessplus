import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step8Schema = yup.object({
  medicalCondition: yup.string().required("Please select at least one value."),
  cardioVascularDisease: yup.string().when("medicalCondition", {
    is: "Cardiovascular Disease",
    then: (schema) => schema.required("Please select if you have any cardiovascular disease."),
  }),
  highCholesterol: yup.string().when("cardioVascularDisease", {
    is: "High cholesterol",
    then: (schema) => schema.required("Please select if you have high cholesterol."),
  }),
});

export type step8SchemaType = yup.InferType<typeof step8Schema>;

interface Step8Props {
  onNext: (data: step8SchemaType) => void;
  onBack: () => void;
  defaultValues?: step8SchemaType;
}

const StepEight = ({ onNext, onBack, defaultValues }: Step8Props) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<step8SchemaType>({
    defaultValues: {
      medicalCondition: defaultValues?.medicalCondition || "",
      cardioVascularDisease: defaultValues?.cardioVascularDisease || "",
      highCholesterol: defaultValues?.highCholesterol || "",
    },
    resolver: yupResolver(step8Schema),
  });

  const medicalCondition = watch("medicalCondition");
  const cardioVascularDisease = watch("cardioVascularDisease");
  const highCholesterol = watch("highCholesterol");

  const showCardioVascularDisease = medicalCondition === "Cardiovascular Disease";
  const showHighCholesterol = cardioVascularDisease === "High cholesterol";

  const handleSelect = (field: keyof step8SchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    if (field === "medicalCondition") {
      setValue("cardioVascularDisease", "");
      setValue("highCholesterol", "");
    }
    if (field === "cardioVascularDisease") {
      setValue("highCholesterol", "");
    }
    clearErrors(field);
  };

  const renderRadioGroup = (field: keyof step8SchemaType, label: string, value: string, options: string[], errorMsg?: string) => (
    <Radio.Group
      value={value}
      label={label}
      error={errorMsg}
      classNames={{
        root: "sm:!grid !block w-full",
        error: "sm:!text-end !text-start w-full",
        label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
      }}
    >
      <div className="grid sm:grid-cols-2 gap-5">
        {options.map((option) => (
          <Radio
            key={option}
            value={option}
            classNames={getBaseWebRadios(value, option)}
            label={
              <div className="relative text-center">
                <span className="text-foreground font-poppins">{option}</span>
                {value === option && (
                  <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                    <i className="icon-tick text-sm/none"></i>
                  </span>
                )}
              </div>
            }
            onChange={() => handleSelect(field, option)}
          />
        ))}
      </div>
    </Radio.Group>
  );

  return (
    <form
      id="step8Form"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      {renderRadioGroup(
        "medicalCondition",
        "Do you suffer from any of these medical conditions?",
        medicalCondition,
        ["Cardiovascular Disease", "Fatty liver disease", "Polycystic ovarian syndrome", "None of the above"],
        getErrorMessage(errors?.medicalCondition)
      )}

      {showCardioVascularDisease &&
        renderRadioGroup(
          "cardioVascularDisease",
          "Select all the conditions that apply to you.",
          cardioVascularDisease,
          ["Atherosclerosis", "Atrial fibrillation", "Arrhythmia", "History of MI", "Stents", "CABG", "High cholesterol", "None of the above"],
          getErrorMessage(errors?.cardioVascularDisease)
        )}

      {showHighCholesterol &&
        renderRadioGroup(
          "highCholesterol",
          "Do you have cholesterol greater than 240 or are you on a cholesterol medication?",
          highCholesterol,
          ["On medication", "Greater than 240 without medication", "Neither"],
          getErrorMessage(errors?.highCholesterol)
        )}

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
          form="step8Form"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StepEight;
