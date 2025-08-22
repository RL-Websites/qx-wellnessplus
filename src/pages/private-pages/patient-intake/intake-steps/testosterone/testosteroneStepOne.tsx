import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const TestosteroneStepOneSchema = yup.object({
  edDuration: yup.string().required("Please select at least one value."),
  erectionFrequency: yup.string().required("Please select at least one value."),
  morningErections: yup.string().required("Please select at least one value."),
  diagnosedCondition: yup.string().required("Please select at least one value."),
});

export type TestosteroneStepOneSchemaType = yup.InferType<typeof TestosteroneStepOneSchema>;

interface Props {
  onNext: (data: TestosteroneStepOneSchemaType) => void;
  onBack: () => void;
  defaultValues?: Partial<TestosteroneStepOneSchemaType>;
}

const TestosteroneStepOne = ({ onNext, onBack, defaultValues }: Props) => {
  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<TestosteroneStepOneSchemaType>({
    defaultValues: {
      edDuration: defaultValues?.edDuration || "",
      erectionFrequency: defaultValues?.erectionFrequency || "",
      morningErections: defaultValues?.morningErections || "",
      diagnosedCondition: defaultValues?.diagnosedCondition || "",
    },
    resolver: yupResolver(TestosteroneStepOneSchema),
  });

  const edDuration = watch("edDuration");
  const erectionFrequency = watch("erectionFrequency");
  const morningErections = watch("morningErections");
  const diagnosedCondition = watch("diagnosedCondition");

  const handleSelect = (field: keyof TestosteroneStepOneSchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  return (
    <form
      id="TestosteroneStepOneForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      {/* Q1 */}
      <Radio.Group
        value={edDuration}
        onChange={(val) => handleSelect("edDuration", val)}
        label="How long have you been experiencing erectile difficulties?"
        error={getErrorMessage(errors.edDuration)}
        classNames={{
          root: "sm:!grid !block",
          error: "sm:!text-end !text-start w-full",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2 pt",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Less than 3 months", "3–6 months", "More than 6 months"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(edDuration, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {edDuration === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
      </Radio.Group>

      {/* Q2 */}
      <Radio.Group
        value={erectionFrequency}
        onChange={(val) => handleSelect("erectionFrequency", val)}
        label="How often are you able to achieve and maintain an erection?"
        error={getErrorMessage(errors.erectionFrequency)}
        classNames={{
          root: "sm:!grid !block",
          error: "sm:!text-end !text-start w-full",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Always", "Sometimes", "Rarely", "Never"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(erectionFrequency, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {erectionFrequency === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
      </Radio.Group>

      {/* Q3 */}
      <Radio.Group
        value={morningErections}
        onChange={(val) => handleSelect("morningErections", val)}
        label="Do you wake up with morning or nighttime erections?"
        error={getErrorMessage(errors.morningErections)}
        classNames={{
          root: "sm:!grid !block",
          error: "sm:!text-end !text-start w-full",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes, regularly", "Sometimes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(morningErections, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {morningErections === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
      </Radio.Group>

      {/* Q4 */}
      <Radio.Group
        value={diagnosedCondition}
        onChange={(val) => handleSelect("diagnosedCondition", val)}
        label="Do you have any diagnosed health conditions?"
        error={getErrorMessage(errors.diagnosedCondition)}
        classNames={{
          root: "sm:!grid !block",
          error: "sm:!text-end !text-start w-full",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Diabetes", "High blood pressure", "Heart disease", "None"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(diagnosedCondition, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {diagnosedCondition === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
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
          form="TestosteroneStepOneForm"
          className="w-[200px]"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default TestosteroneStepOne;
