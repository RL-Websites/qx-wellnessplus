import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step4Schema = yup.object({
  anyEatingDisorder: yup.string().required("Please select at least one value."),
  currentDiagnose: yup.string().when("anyEatingDisorder", {
    is: "Yes, currently diagnosed",
    then: (schema) => schema.required("Please select what you are diagnosed with?"),
  }),
  currentDiagOther: yup.string().when("currentDiagnose", {
    is: "Other",
    then: (schema) => schema.required("Please mention your diagnoses."),
  }),
  pastDiagnose: yup.string().when("anyEatingDisorder", {
    is: "Yes, in the past",
    then: (schema) => schema.required("Please select what you were diagnosed with?"),
  }),
  pastDiagBullmia: yup.string().when("pastDiagnose", {
    is: "Bulimia",
    then: (schema) => schema.required("Please select how long has it been since you were diagnosed."),
  }),
  pastDiagOther: yup.string().when("pastDiagnose", {
    is: "Other",
    then: (schema) => schema.required("Please mention what you were diagnosed with?"),
  }),
});

export type step4SchemaType = yup.InferType<typeof step4Schema>;

interface StepFourProps {
  onNext: (data: step4SchemaType) => void;
  onBack: () => void;
  defaultValues?: step4SchemaType;
}

const StepFour = ({ onNext, onBack, defaultValues }: StepFourProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
    register,
  } = useForm<step4SchemaType>({
    defaultValues: {
      anyEatingDisorder: defaultValues?.anyEatingDisorder || "",
      currentDiagnose: defaultValues?.currentDiagnose || "",
      currentDiagOther: defaultValues?.currentDiagOther || "",
      pastDiagnose: defaultValues?.pastDiagnose || "",
      pastDiagBullmia: defaultValues?.pastDiagBullmia || "",
      pastDiagOther: defaultValues?.pastDiagOther || "",
    },
    resolver: yupResolver(step4Schema),
  });

  const anyEatingDisorder = watch("anyEatingDisorder");
  const currentDiagnose = watch("currentDiagnose");
  const pastDiagnose = watch("pastDiagnose");
  const pastDiagBullmia = watch("pastDiagBullmia");

  const showCurrentDiagnose = anyEatingDisorder === "Yes, currently diagnosed";
  const showCurrentDiagOther = currentDiagnose === "Other";
  const showPastDiagnose = anyEatingDisorder === "Yes, in the past";
  const showPastDiagBullmia = pastDiagnose === "Bulimia";
  const showPastDiagOther = pastDiagnose === "Other";

  const anyEatingOptions = ["Yes, currently diagnosed", "Yes, in the past", "No, but I have experienced disordered eating behaviors", "No, never"];

  const diagnoseOptions = ["Binge Eating", "Bulimia", "Anorexia Nervosa", "Other"];
  const bullmiaDurationOptions = ["Less than 12 months ago", "More than 12 months ago"];

  const handleSelect = (field: keyof step4SchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  return (
    <form
      id="step4Form"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      {/* Any Eating Disorder */}
      <Radio.Group
        value={anyEatingDisorder}
        onChange={(value) => {
          handleSelect("anyEatingDisorder", value);
          setValue("currentDiagnose", "");
          setValue("currentDiagOther", "");
          setValue("pastDiagnose", "");
          setValue("pastDiagBullmia", "");
          setValue("pastDiagOther", "");
        }}
        label="Have you been diagnosed with any eating disorders or have a history of disordered eating?"
        error={getErrorMessage(errors?.anyEatingDisorder)}
        classNames={{
          root: "sm:!grid !block",
          error: "sm:!text-end !text-start w-full",
          label: "sm:!text-3xl pb-2",
        }}
      >
        <div className="grid grid-cols-1 gap-5">
          {anyEatingOptions.map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(anyEatingDisorder, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {anyEatingDisorder === option && (
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

      {/* Current Diagnose */}
      {showCurrentDiagnose && (
        <Radio.Group
          value={currentDiagnose}
          onChange={(value) => {
            handleSelect("currentDiagnose", value);
            setValue("currentDiagOther", "");
          }}
          label="What are you diagnosed with?"
          error={getErrorMessage(errors?.currentDiagnose)}
          classNames={{ label: "!text-3xl pt-10 pb-2" }}
        >
          <div className="grid grid-cols-2 gap-5">
            {diagnoseOptions.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(currentDiagnose, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {currentDiagnose === option && (
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

      {showCurrentDiagOther && (
        <Input.Wrapper
          label="Please Specify what are you diagnosed with?"
          withAsterisk
          className="pt-8"
          error={getErrorMessage(errors.currentDiagOther)}
        >
          <Input
            type="text"
            {...register("currentDiagOther")}
          />
        </Input.Wrapper>
      )}

      {/* Past Diagnose */}
      {showPastDiagnose && (
        <Radio.Group
          value={pastDiagnose}
          onChange={(value) => {
            handleSelect("pastDiagnose", value);
            setValue("pastDiagBullmia", "");
            setValue("pastDiagOther", "");
          }}
          label="What were you diagnosed with?"
          error={getErrorMessage(errors?.pastDiagnose)}
          classNames={{ label: "!text-3xl pt-10 pb-2" }}
        >
          <div className="grid grid-cols-2 gap-5">
            {diagnoseOptions.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(pastDiagnose, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {pastDiagnose === option && (
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

      {showPastDiagBullmia && (
        <Radio.Group
          value={pastDiagBullmia}
          onChange={(value) => handleSelect("pastDiagBullmia", value)}
          label="How long has it been since you were diagnosed?"
          error={getErrorMessage(errors?.pastDiagBullmia)}
          classNames={{ label: "!text-3xl pt-10 pb-2" }}
        >
          <div className="grid grid-cols-2 gap-5">
            {bullmiaDurationOptions.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(pastDiagBullmia, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {pastDiagBullmia === option && (
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

      {showPastDiagOther && (
        <Input.Wrapper
          label="Please specify what were you diagnosed with?"
          withAsterisk
          className="pt-8"
          error={getErrorMessage(errors.pastDiagOther)}
        >
          <Input
            type="text"
            {...register("pastDiagOther")}
          />
        </Input.Wrapper>
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
          form="step4Form"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StepFour;
