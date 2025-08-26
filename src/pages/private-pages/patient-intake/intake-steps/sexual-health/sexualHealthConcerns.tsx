import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const sexualHealthSchema = yup.object({
  concernSH: yup.string().required("Please select a sexual health concern."),
  otherConcern: yup.string().when("concernSH", {
    is: "Other",
    then: (schema) => schema.required("Please specify your concern."),
    otherwise: (schema) => schema.optional(),
  }),
  durationSH: yup.string().required("Please enter how long you've experienced this issue."),
  onSexMeds: yup.string().required("Please select at least one value."),
});

export type SexualHealthSchemaType = yup.InferType<typeof sexualHealthSchema>;

interface SexualHealthConcernsProps {
  onNext: (data: SexualHealthSchemaType) => void;
  onBack: () => void;
  defaultValues?: Partial<SexualHealthSchemaType>;
}

const SexualHealthConcerns = ({ onNext, onBack, defaultValues }: SexualHealthConcernsProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<SexualHealthSchemaType>({
    resolver: yupResolver(sexualHealthSchema),
    defaultValues: {
      concernSH: defaultValues?.concernSH || "",
      otherConcern: defaultValues?.otherConcern || "",
      durationSH: defaultValues?.durationSH || "",
      onSexMeds: defaultValues?.onSexMeds || "",
    },
  });

  const concernSH = watch("concernSH");
  const onSexMeds = watch("onSexMeds");

  const concernOptions = ["Erectile dysfunction", "Low libido", "Hormonal imbalance", "Other"];
  const yesNoOptions = ["Yes", "No"];

  const handleSelect = (field: keyof SexualHealthSchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  return (
    <form
      id="sexualHealthForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      <Radio.Group
        value={concernSH}
        onChange={(val) => handleSelect("concernSH", val)}
        label="What sexual health concern are you seeking help with?"
        classNames={{ label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2" }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {concernOptions.map((option) => (
            <Radio
              key={option}
              value={option}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {concernSH === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
              classNames={getBaseWebRadios(concernSH, option)}
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.concernSH)}</p>
      </Radio.Group>

      {concernSH === "Other" && (
        <TextInput
          label="Please specify your concern:"
          placeholder="Describe your concern"
          value={watch("otherConcern")}
          onChange={(e) => handleSelect("otherConcern", e.currentTarget.value)}
          error={getErrorMessage(errors?.otherConcern)}
          className="pt-6"
        />
      )}

      <TextInput
        type="number"
        label="How long have you been experiencing this issue? (in months)"
        placeholder="e.g. 6"
        value={watch("durationSH")}
        onChange={(e) => handleSelect("durationSH", e.currentTarget.value)}
        error={getErrorMessage(errors?.durationSH)}
        className="pt-10"
      />

      <Radio.Group
        value={onSexMeds}
        onChange={(val) => handleSelect("onSexMeds", val)}
        label="Do you currently take any medications for sexual health (e.g., Viagra, Cialis, hormone therapy)?"
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
                  {onSexMeds === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
              classNames={getBaseWebRadios(onSexMeds, option)}
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.onSexMeds)}</p>
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
          form="sexualHealthForm"
          className="w-[200px]"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default SexualHealthConcerns;
