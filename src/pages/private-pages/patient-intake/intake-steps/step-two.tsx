import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step2Schema = yup.object({
  doesDiet: yup.string().required("Please select at least one value."),
  agreeGlpExercise: yup.string().when("doesDiet", {
    is: "No",
    then: (schema) => schema.required("Please select at least one value."),
    otherwise: (schema) => schema.nullable(),
  }),
});

export type step2SchemaType = yup.InferType<typeof step2Schema>;

interface StepTwoProps {
  onNext: (data: step2SchemaType) => void;
  onBack: () => void;
  defaultValues?: step2SchemaType;
}

const StepTwo = ({ onNext, onBack, defaultValues }: StepTwoProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<step2SchemaType>({
    defaultValues: {
      doesDiet: defaultValues?.doesDiet || "",
      agreeGlpExercise: defaultValues?.agreeGlpExercise || "",
    },
    resolver: yupResolver(step2Schema),
  });

  const doesDiet = watch("doesDiet");
  const agreeGlpExercise = watch("agreeGlpExercise");
  const showAgreeGlpExercise = doesDiet === "No";

  const doesDietOptions = ["Yes", "No"];
  const agreeOptions = ["Yes", "No"];

  const handleSelect = (field: keyof step2SchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  return (
    <form
      id="stepTwoForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      <Radio.Group
        value={doesDiet}
        onChange={(value) => {
          handleSelect("doesDiet", value);
          if (value === "Yes") {
            clearErrors("agreeGlpExercise");
          }
        }}
        label="Are you willing to follow a weight loss dietary plan/reduce calories and exercise?"
        error={getErrorMessage(errors?.doesDiet)}
        classNames={{ label: "!text-3xl pb-2" }}
      >
        <div className="grid grid-cols-2 gap-5">
          {doesDietOptions.map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(doesDiet, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {doesDiet === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 right-0  -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
      </Radio.Group>

      {showAgreeGlpExercise && (
        <Radio.Group
          value={agreeGlpExercise}
          onChange={(value) => handleSelect("agreeGlpExercise", value)}
          label="I acknowledge that GLP medications are most effective when used in conjunction with exercise."
          error={getErrorMessage(errors?.agreeGlpExercise)}
          classNames={{ label: "!text-3xl pt-10 pb-2" }}
        >
          <div className="grid grid-cols-2 gap-5">
            {agreeOptions.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(agreeGlpExercise, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {agreeGlpExercise === option && (
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 right-0  -translate-y-1/2">
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
          form="stepTwoForm"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StepTwo;
