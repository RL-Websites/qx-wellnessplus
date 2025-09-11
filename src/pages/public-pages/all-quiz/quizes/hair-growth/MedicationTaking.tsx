import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const MedicationTakingSchema = yup.object({
  medicationTaking: yup.string().required("Please select an option."),
});

export type MedicationTakingSchemaType = yup.InferType<typeof MedicationTakingSchema>;

interface IMedicationTakingProps {
  onNext: (data: MedicationTakingSchemaType) => void;
  onBack: () => void;
  defaultValues?: MedicationTakingSchemaType;
}

const MedicationTaking = ({ onNext, onBack, defaultValues }: IMedicationTakingProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<MedicationTakingSchemaType>({
    defaultValues: {
      medicationTaking: defaultValues?.medicationTaking || "",
    },
    resolver: yupResolver(MedicationTakingSchema),
  });

  const medicationTaking = watch("medicationTaking");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("medicationTaking", value, { shouldValidate: true });
    clearErrors("medicationTaking");
  };

  return (
    <form
      id="MedicationTaking"
      onSubmit={handleSubmit(onNext)}
      className="card-common-width-lg mx-auto space-y-6"
    >
      <div>
        <h2 className="text-center text-3xl font-poppins font-semibold text-foreground animate-title">Are you currently taking medications known to cause hair loss?</h2>

        <Radio.Group
          value={medicationTaking}
          onChange={handleSelect}
          className="mt-6 w-full animate-content"
        >
          <div className="grid md:grid-cols-2 w-full gap-5">
            {options.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(medicationTaking, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {medicationTaking === option && (
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
        {errors.medicationTaking && <Text className="text-red-500 text-sm mt-5 text-center">{errors.medicationTaking.message}</Text>}
      </div>

      <div className="flex justify-center gap-6 pt-4 animate-btns">
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
          form="MedicationTaking"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default MedicationTaking;
