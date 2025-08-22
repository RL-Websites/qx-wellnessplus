import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const TestosteroneStepTwoSchema = yup.object({
  takingMedications: yup.string().required("Please select at least one value."),
  medicationsList: yup.string().when("takingMedications", {
    is: "Yes",
    then: (s) => s.required("Please list your current medications and dosages."),
  }),
  useSubstances: yup.string().required("Please select at least one value."),
  libido: yup.string().required("Please select at least one value."),
});

export type TestosteroneStepTwoSchemaType = yup.InferType<typeof TestosteroneStepTwoSchema>;

interface Props {
  onNext: (data: TestosteroneStepTwoSchemaType) => void;
  onBack: () => void;
  defaultValues?: Partial<TestosteroneStepTwoSchemaType>;
}

const TestosteroneStepTwo = ({ onNext, onBack, defaultValues }: Props) => {
  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<TestosteroneStepTwoSchemaType>({
    defaultValues: {
      takingMedications: defaultValues?.takingMedications || "",
      medicationsList: defaultValues?.medicationsList || "",
      useSubstances: defaultValues?.useSubstances || "",
      libido: defaultValues?.libido || "",
    },
    resolver: yupResolver(TestosteroneStepTwoSchema),
  });

  const takingMedications = watch("takingMedications");
  const showMedicationList = takingMedications === "Yes";
  const useSubstances = watch("useSubstances");
  const libido = watch("libido");

  const handleSelect = (field: keyof TestosteroneStepTwoSchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  return (
    <form
      id="TestosteroneStepTwoForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      {/* Q5 */}
      <Radio.Group
        value={takingMedications}
        onChange={(v) => {
          handleSelect("takingMedications", v);
          clearErrors("medicationsList");
        }}
        label="Are you currently taking any medications? (List if yes)"
        error={getErrorMessage(errors.takingMedications)}
        classNames={{
          root: "sm:!grid !block",
          error: "sm:!text-end !text-start w-full",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(takingMedications, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {takingMedications === option && (
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

      {showMedicationList && (
        <Input.Wrapper
          label="Please list your medications (name — dosage — frequency). If unknown, write “unknown”."
          withAsterisk
          error={getErrorMessage(errors.medicationsList)}
          className="pt-1"
          classNames={{
            label: "text-lg sm:text-xl lg:text-2xl pb-2 block",
            error: "text-red-600 text-sm pt-1",
          }}
        >
          <Input
            type="text"
            placeholder="e.g., Metformin — 500mg — daily; Lisinopril — 10mg — daily"
            {...register("medicationsList")}
            className="rounded-md border-gray-300 px-3 py-2"
          />
        </Input.Wrapper>
      )}

      {/* Q6 */}
      <Radio.Group
        value={useSubstances}
        onChange={(val) => handleSelect("useSubstances", val)}
        label="Do you smoke, drink alcohol, or use recreational drugs?"
        error={getErrorMessage(errors.useSubstances)}
        classNames={{
          root: "sm:!grid !block",
          error: "sm:!text-end !text-start w-full",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(useSubstances, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {useSubstances === option && (
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

      {/* Q7 */}
      <Radio.Group
        value={libido}
        onChange={(val) => handleSelect("libido", val)}
        label="How is your sexual desire (libido)?"
        error={getErrorMessage(errors.libido)}
        classNames={{
          root: "sm:!grid !block",
          error: "sm:!text-end !text-start w-full",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Normal", "Reduced", "Absent"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(libido, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {libido === option && (
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
          form="TestosteroneStepTwoForm"
          className="w-[200px]"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default TestosteroneStepTwo;
