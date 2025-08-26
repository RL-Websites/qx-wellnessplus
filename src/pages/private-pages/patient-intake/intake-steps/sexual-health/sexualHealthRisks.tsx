import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const sexualHealthRiskSchema = yup.object({
  hasCardioDisease: yup.string().required("Please select at least one value."),
  experiencedPriapism: yup.string().required("Please select at least one value."),
  takesNitrates: yup.string().required("Please select at least one value."),
});

export type SexualHealthRiskSchemaType = yup.InferType<typeof sexualHealthRiskSchema>;

interface SexualHealthRisksProps {
  onNext: (data: SexualHealthRiskSchemaType) => void;
  onBack: () => void;
  defaultValues?: Partial<SexualHealthRiskSchemaType>;
}

const SexualHealthRisks = ({ onNext, onBack, defaultValues }: SexualHealthRisksProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<SexualHealthRiskSchemaType>({
    resolver: yupResolver(sexualHealthRiskSchema),
    defaultValues: {
      hasCardioDisease: defaultValues?.hasCardioDisease || "",
      experiencedPriapism: defaultValues?.experiencedPriapism || "",
      takesNitrates: defaultValues?.takesNitrates || "",
    },
  });

  const hasCardioDisease = watch("hasCardioDisease");
  const experiencedPriapism = watch("experiencedPriapism");
  const takesNitrates = watch("takesNitrates");

  const handleSelect = (field: keyof SexualHealthRiskSchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  const yesNoOptions = ["Yes", "No"];

  return (
    <form
      id="sexualHealthRisksForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      <Radio.Group
        value={hasCardioDisease}
        onChange={(val) => handleSelect("hasCardioDisease", val)}
        label="Do you have a history of uncontrolled cardiovascular disease (heart attack, stroke, arrhythmia)?"
        classNames={{ label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2" }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {yesNoOptions.map((option) => (
            <Radio
              key={option}
              value={option}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {hasCardioDisease === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
              classNames={getBaseWebRadios(hasCardioDisease, option)}
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.hasCardioDisease)}</p>
      </Radio.Group>

      <Radio.Group
        value={experiencedPriapism}
        onChange={(val) => handleSelect("experiencedPriapism", val)}
        label="Have you ever experienced priapism (erection lasting more than 4 hours)?"
        classNames={{ label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2" }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {yesNoOptions.map((option) => (
            <Radio
              key={option}
              value={option}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {experiencedPriapism === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
              classNames={getBaseWebRadios(experiencedPriapism, option)}
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.experiencedPriapism)}</p>
      </Radio.Group>

      <Radio.Group
        value={takesNitrates}
        onChange={(val) => handleSelect("takesNitrates", val)}
        label="Do you currently take nitrates or nitroglycerin?"
        classNames={{ label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2" }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {yesNoOptions.map((option) => (
            <Radio
              key={option}
              value={option}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {takesNitrates === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
              classNames={getBaseWebRadios(takesNitrates, option)}
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.takesNitrates)}</p>
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
          form="sexualHealthRisksForm"
          className="w-[200px]"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default SexualHealthRisks;
