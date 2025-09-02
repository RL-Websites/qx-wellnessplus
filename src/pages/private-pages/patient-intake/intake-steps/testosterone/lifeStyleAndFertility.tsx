import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const lifestyleFertilitySchema = yup.object({
  takingMedsSH: yup.string().required("Please select at least one value."),
  medsListSH: yup.string().when("takingMedsSH", {
    is: "Yes",
    then: (schema) => schema.required("Please list the medications you are taking."),
    otherwise: (schema) => schema.optional(),
  }),
  usesSubstances: yup.string().required("Please select at least one value."),
  substanceDetails: yup.string().when("usesSubstances", {
    is: "Yes",
    then: (schema) => schema.required("Please provide details."),
    otherwise: (schema) => schema.optional(),
  }),
  hasChildrenOrPlans: yup.string().required("Please select at least one value."),
});

export type LifestyleFertilitySchemaType = yup.InferType<typeof lifestyleFertilitySchema>;

interface LifestyleAndFertilityProps {
  onNext: (data: LifestyleFertilitySchemaType) => void;
  onBack: () => void;
  defaultValues?: Partial<LifestyleFertilitySchemaType>;
  isFinalStep?: string;
}

const LifestyleAndFertility = ({ onNext, onBack, defaultValues, isFinalStep }: LifestyleAndFertilityProps) => {
  const {
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<LifestyleFertilitySchemaType>({
    resolver: yupResolver(lifestyleFertilitySchema),
    defaultValues: {
      takingMedsSH: defaultValues?.takingMedsSH || "",
      medsListSH: defaultValues?.medsListSH || "",
      usesSubstances: defaultValues?.usesSubstances || "",
      substanceDetails: defaultValues?.substanceDetails || "",
      hasChildrenOrPlans: defaultValues?.hasChildrenOrPlans || "",
    },
  });

  const takingMedsSH = watch("takingMedsSH");
  const usesSubstances = watch("usesSubstances");
  const hasChildrenOrPlans = watch("hasChildrenOrPlans");

  const handleSelect = (field: keyof LifestyleFertilitySchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  return (
    <form
      id="lifestyleFertilityForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      {/* Q8 */}
      <Radio.Group
        value={takingMedsSH}
        onChange={(val) => handleSelect("takingMedsSH", val)}
        label="Are you currently taking any medications (especially anticoagulants, steroids, or hormone therapy)?"
        classNames={{
          root: "w-full",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(takingMedsSH, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {takingMedsSH === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.takingMedsSH)}</p>
      </Radio.Group>

      {takingMedsSH === "Yes" && (
        <TextInput
          label="Please list the medications you are taking:"
          placeholder="e.g. Aspirin, Prednisone"
          value={watch("medsListSH")}
          onChange={(e) => handleSelect("medsListSH", e.currentTarget.value)}
          error={getErrorMessage(errors?.medsListSH)}
          className="pt-4 w-full"
        />
      )}

      {/* Q9 */}
      <Radio.Group
        value={usesSubstances}
        onChange={(val) => handleSelect("usesSubstances", val)}
        label="Do you consume alcohol or use recreational drugs?"
        classNames={{
          root: "w-full",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2 pt",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(usesSubstances, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {usesSubstances === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.usesSubstances)}</p>
      </Radio.Group>

      {usesSubstances === "Yes" && (
        <TextInput
          label="Please provide details about your alcohol or drug use:"
          placeholder="e.g. Occasional wine, cannabis use"
          value={watch("substanceDetails")}
          onChange={(e) => handleSelect("substanceDetails", e.currentTarget.value)}
          error={getErrorMessage(errors?.substanceDetails)}
          className="pt-4 w-full"
        />
      )}

      {/* Q10 */}
      <Radio.Group
        value={hasChildrenOrPlans}
        onChange={(val) => handleSelect("hasChildrenOrPlans", val)}
        label="Do you have children or plan to have children in the future? (Testosterone therapy may affect fertility.)"
        classNames={{
          root: "w-full",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2 pt",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(hasChildrenOrPlans, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {hasChildrenOrPlans === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.hasChildrenOrPlans)}</p>
      </Radio.Group>

      {/* Navigation */}
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
          form="lifestyleFertilityForm"
          className="w-[200px]"
        >
          {isFinalStep ? "Submit" : "Next"}
        </Button>
      </div>
    </form>
  );
};

export default LifestyleAndFertility;
