import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Radio, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const multipleMedicineSchema = yup.object({
  selectedMedicine: yup.string().required("Please select an option."),
});

export type multipleMedicineSchemaType = yup.InferType<typeof multipleMedicineSchema>;

interface IMultipleMedicineProps {
  onNext: (data: multipleMedicineSchemaType) => void;
  onBack: () => void;
  defaultValues?: multipleMedicineSchemaType;
}

const MultipleMedicine = ({ onNext, onBack, defaultValues }: IMultipleMedicineProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<multipleMedicineSchemaType>({
    defaultValues: {
      selectedMedicine: defaultValues?.selectedMedicine || "",
    },
    resolver: yupResolver(multipleMedicineSchema),
  });

  const selectedMedicine = watch("selectedMedicine");

  const options = ["Semaglutide", "Tirzepatide"];

  const handleSelect = (value: string) => {
    setValue("selectedMedicine", value, { shouldValidate: true });
    clearErrors("selectedMedicine");
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="multipleMedicineForm"
        onSubmit={handleSubmit(onNext)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-poppins font-semibold text-foreground">Are you interested in Semaglutide or Tirzepatide?</h2>

          <Radio.Group
            value={selectedMedicine}
            onChange={handleSelect}
            className="mt-6"
          >
            <Group grow>
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={{
                    root: "relative w-full",
                    radio: "hidden",
                    inner: "hidden",
                    labelWrapper: "w-full",
                    label: `
                      block w-full h-full px-6 py-4 rounded-2xl border text-center text-base font-medium cursor-pointer
                      ${selectedMedicine === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                    `,
                  }}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {selectedMedicine === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 right-0  -translate-y-1/2">
                          <i className="icon-tick text-sm/none"></i>
                        </span>
                      )}
                    </div>
                  }
                />
              ))}
            </Group>
          </Radio.Group>
          {errors.selectedMedicine && <Text className="text-red-500 text-sm mt-5 text-center">{errors.selectedMedicine.message}</Text>}
        </div>

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
            form="multipleMedicineForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MultipleMedicine;
