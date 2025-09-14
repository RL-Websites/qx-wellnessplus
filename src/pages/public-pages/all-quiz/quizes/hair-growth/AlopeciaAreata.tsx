import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const AlopeciaAreataSchema = yup.object({
  alopeciaAreata: yup.string().required("Please select an option."),
});

export type AlopeciaAreataSchemaType = yup.InferType<typeof AlopeciaAreataSchema>;

interface IAlopeciaAreataProps {
  onNext: (data: AlopeciaAreataSchemaType) => void;
  onBack: () => void;
  defaultValues?: AlopeciaAreataSchemaType;
}

const AlopeciaAreata = ({ onNext, onBack, defaultValues }: IAlopeciaAreataProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<AlopeciaAreataSchemaType>({
    defaultValues: {
      alopeciaAreata: defaultValues?.alopeciaAreata || "",
    },
    resolver: yupResolver(AlopeciaAreataSchema),
  });

  const alopeciaAreata = watch("alopeciaAreata");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("alopeciaAreata", value, { shouldValidate: true });
    clearErrors("alopeciaAreata");
  };

  return (
    <form
      id="AlopeciaAreataForm"
      onSubmit={handleSubmit(onNext)}
      className="card-common-width-lg mx-auto space-y-6"
    >
      <div>
        <h2 className="text-center text-3xl font-poppins font-semibold text-foreground animate-title">Do you have any form of alopecia areata? </h2>

        <Radio.Group
          value={alopeciaAreata}
          onChange={handleSelect}
          className="mt-6 w-full animate-content"
        >
          <div className="grid md:grid-cols-2 w-full gap-5">
            {options.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(alopeciaAreata, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {alopeciaAreata === option && (
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
        {errors.alopeciaAreata && <Text className="text-red-500 text-sm mt-5 text-center">{errors.alopeciaAreata.message}</Text>}
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
          form="AlopeciaAreataForm"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default AlopeciaAreata;
