import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const pcosSchema = yup.object({
  pcos: yup.string().required("Please select an option."),
});

export type pcosSchemaType = yup.InferType<typeof pcosSchema>;

interface IPcosProps {
  onNext: (data: pcosSchemaType) => void;
  onBack: () => void;
  defaultValues?: pcosSchemaType;
}

const Pcos = ({ onNext, onBack, defaultValues }: IPcosProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<pcosSchemaType>({
    defaultValues: {
      pcos: defaultValues?.pcos || "",
    },
    resolver: yupResolver(pcosSchema),
  });

  const pcos = watch("pcos");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("pcos", value, { shouldValidate: true });
    clearErrors("pcos");
  };

  return (
    <form
      id="pcosForm"
      onSubmit={handleSubmit(onNext)}
      className="card-common-width-lg mx-auto space-y-6"
    >
      <div>
        <h2 className="text-center text-3xl font-poppins font-semibold text-foreground animate-title">Do you have a history of polycystic ovary syndrome (PCOS)?</h2>

        <Radio.Group
          value={pcos}
          onChange={handleSelect}
          className="mt-6 w-full animate-content"
          error={errors?.pcos?.message}
        >
          <div className="grid md:grid-cols-2 w-full gap-5">
            {options.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(pcos, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {pcos === option && (
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
        {errors.pcos && <Text className="text-red-500 text-sm mt-5 text-center">{errors.pcos.message}</Text>}
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
          form="pcosForm"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default Pcos;
