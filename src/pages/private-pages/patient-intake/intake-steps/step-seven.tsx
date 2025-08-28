import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step7Schema = yup.object({
  amountOfAlcohol: yup.string().required("Please select at least one value."),
});

export type step7SchemaType = yup.InferType<typeof step7Schema>;

interface Step7Props {
  onNext: (data: step7SchemaType) => void;
  onBack: () => void;
  defaultValues?: step7SchemaType;
}

const StepSeven = ({ onNext, onBack, defaultValues }: Step7Props) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<step7SchemaType>({
    defaultValues: {
      amountOfAlcohol: defaultValues?.amountOfAlcohol || "",
    },
    resolver: yupResolver(step7Schema),
  });

  const amountOfAlcohol = watch("amountOfAlcohol");

  const options = ["3+ drinks per day", "1-2 drinks per day", "1-2 drinks per week", "3-5 drinks per week", "None"];

  const handleSelect = (value: string) => {
    setValue("amountOfAlcohol", value, { shouldValidate: true });
    clearErrors("amountOfAlcohol");
  };

  return (
    <form
      id="step7Form"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      <Radio.Group
        value={amountOfAlcohol}
        label="How much alcohol do you drink?"
        classNames={{
          root: "w-full",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {options.map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(amountOfAlcohol, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {amountOfAlcohol === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
              onChange={() => handleSelect(option)}
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.amountOfAlcohol)}</p>
      </Radio.Group>

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
          form="step7Form"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StepSeven;
