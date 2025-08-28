import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step9Schema = yup.object({
  triglyceride: yup.string().required("Please select at least one value."),
  hypertension: yup.string().required("Please select at least one value."),
  warfarin: yup.string().required("Please select at least one value."),
  thyroidism: yup.string().required("Please select at least one value."),
});

export type step9SchemaType = yup.InferType<typeof step9Schema>;

interface StepNineProps {
  onNext: (data: step9SchemaType) => void;
  onBack: () => void;
  defaultValues?: step9SchemaType;
  isLoading?: boolean;
}

const StepNine = ({ onNext, onBack, defaultValues, isLoading = false }: StepNineProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<step9SchemaType>({
    defaultValues: {
      triglyceride: defaultValues?.triglyceride || "",
      hypertension: defaultValues?.hypertension || "",
      warfarin: defaultValues?.warfarin || "",
      thyroidism: defaultValues?.thyroidism || "",
    },
    resolver: yupResolver(step9Schema),
  });

  const triglyceride = watch("triglyceride");
  const hypertension = watch("hypertension");
  const warfarin = watch("warfarin");
  const thyroidism = watch("thyroidism");

  const handleSelect = (field: keyof step9SchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  const questions = [
    {
      name: "triglyceride",
      label: "Did you ever have a fasting triglyceride level above 500?",
      options: ["Yes", "No"],
      value: triglyceride,
    },
    {
      name: "hypertension",
      label: "Are you taking high blood pressure medication for Hypertension?",
      options: ["Yes", "No"],
      value: hypertension,
    },
    {
      name: "warfarin",
      label: "Are you on Warfarin?",
      options: ["Yes", "No"],
      value: warfarin,
    },
    {
      name: "thyroidism",
      label: "Do you have a history of any of the following?",
      options: ["Hypothyroidism", "Hyperthyroidism", "Graves disease", "Thyroid nodules", "No"],
      value: thyroidism,
    },
  ];

  return (
    <form
      id="step9Form"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      {questions.map((q) => (
        <Radio.Group
          key={q.name}
          value={q.value}
          onChange={(val) => handleSelect(q.name as keyof step9SchemaType, val)}
          label={q.label}
          classNames={{
            root: "w-full",
            label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
          }}
        >
          <div className="grid sm:grid-cols-2 gap-5">
            {q.options.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(q.value, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {q.value === option && (
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                        <i className="icon-tick text-sm/none"></i>
                      </span>
                    )}
                  </div>
                }
              />
            ))}
          </div>
          <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors[q.name as keyof step9SchemaType])}</p>
        </Radio.Group>
      ))}

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
          form="step9Form"
          loading={isLoading}
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StepNine;
