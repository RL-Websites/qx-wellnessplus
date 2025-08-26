import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const scalpInfectionsTwoSchema = yup.object({
  scalpInfactions: yup.string().required("Please select an option."),
});

export type scalpInfectionsTwoSchemaType = yup.InferType<typeof scalpInfectionsTwoSchema>;

interface IScalpInfectionsTwoProps {
  onNext: (data: scalpInfectionsTwoSchemaType) => void;
  onBack: () => void;
  defaultValues?: scalpInfectionsTwoSchemaType;
}

const ScalpInfectionsTwo = ({ onNext, onBack, defaultValues }: IScalpInfectionsTwoProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<scalpInfectionsTwoSchemaType>({
    defaultValues: {
      scalpInfactions: defaultValues?.scalpInfactions || "",
    },
    resolver: yupResolver(scalpInfectionsTwoSchema),
  });

  const scalpInfactions = watch("scalpInfactions");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("scalpInfactions", value, { shouldValidate: true });
    clearErrors("scalpInfactions");
  };

  return (
    <form
      id="scalpInfectionsTwoForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-xl mx-auto space-y-6"
    >
      <div>
        <h2 className="text-center text-3xl font-poppins font-semibold text-foreground">Do you have any untreated scalp infections (e.g., fungal)? </h2>

        <Radio.Group
          value={scalpInfactions}
          onChange={handleSelect}
          className="mt-6 w-full"
          error={errors?.scalpInfactions?.message}
        >
          <div className="grid md:grid-cols-2 w-full gap-5">
            {options.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(scalpInfactions, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {scalpInfactions === option && (
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
          form="scalpInfectionsTwoForm"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default ScalpInfectionsTwo;
