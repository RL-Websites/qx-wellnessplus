import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step5Schema = yup.object({
  isPregnant: yup.string().required("Please select at least one value."),
});

export type step5SchemaType = yup.InferType<typeof step5Schema>;

interface StepFiveProps {
  onNext: (data: step5SchemaType) => void;
  onBack: () => void;
  defaultValues?: step5SchemaType;
}

const StepFive = ({ onNext, onBack, defaultValues }: StepFiveProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<step5SchemaType>({
    defaultValues: {
      isPregnant: defaultValues?.isPregnant || "",
    },
    resolver: yupResolver(step5Schema),
  });

  const isPregnant = watch("isPregnant");

  const options = ["Pregnant", "Planning to become pregnant", "Breastfeeding", "None of the above"];

  const handleSelect = (value: string) => {
    setValue("isPregnant", value, { shouldValidate: true });
    clearErrors("isPregnant");
  };

  return (
    <form
      id="stepFiveForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      <Radio.Group
        value={isPregnant}
        label="Are you currently?"
        error={getErrorMessage(errors?.isPregnant)}
        classNames={{
          root: "sm:!grid !block",
          error: "sm:!text-end !text-start w-full",
          label: "sm:!text-3xl pb-2",
        }}
      >
        <div className="grid grid-cols-2 gap-5">
          {options.map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(isPregnant, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {isPregnant === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 right-0  -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
              onChange={() => handleSelect(option)}
            />
          ))}
        </div>
      </Radio.Group>

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
          form="stepFiveForm"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StepFive;
