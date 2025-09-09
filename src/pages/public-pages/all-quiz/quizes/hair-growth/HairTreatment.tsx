import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const hairTreatmentSchema = yup.object({
  hairTreatment: yup.string().required("Please select an option."),
});

export type hairTreatmentSchemaType = yup.InferType<typeof hairTreatmentSchema>;

interface IHairTreatmentProps {
  onNext: (data: hairTreatmentSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: hairTreatmentSchemaType;
}

const HairTreatment = ({ onNext, onBack, defaultValues }: IHairTreatmentProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<hairTreatmentSchemaType>({
    defaultValues: {
      hairTreatment: defaultValues?.hairTreatment || "",
    },
    resolver: yupResolver(hairTreatmentSchema),
  });

  const hairTreatment = watch("hairTreatment");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("hairTreatment", value, { shouldValidate: true });
    clearErrors("hairTreatment");
  };

  return (
    <form
      id="hairTreatmentForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-xl mx-auto space-y-6"
    >
      <div>
        <h2 className="text-center text-3xl font-poppins font-semibold text-foreground animate-title">Do you have a history of hair treatment?</h2>

        <Radio.Group
          value={hairTreatment}
          onChange={handleSelect}
          className="mt-6 w-full animate-content"
          error={errors?.hairTreatment?.message}
        >
          <div className="grid md:grid-cols-2 w-full gap-5">
            {options.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(hairTreatment, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {hairTreatment === option && (
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
          form="hairTreatmentForm"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default HairTreatment;
