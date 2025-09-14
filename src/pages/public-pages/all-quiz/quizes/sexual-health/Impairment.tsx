import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const impairmentSchema = yup.object({
  impairment: yup.string().required("Please select an option."),
});

export type ImpairmentSchemaType = yup.InferType<typeof impairmentSchema>;

interface IImpairmentProps {
  onNext: (data: ImpairmentSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: ImpairmentSchemaType;
}

const Impairment = ({ onNext, onBack, defaultValues }: IImpairmentProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<ImpairmentSchemaType>({
    defaultValues: {
      impairment: defaultValues?.impairment || "",
    },
    resolver: yupResolver(impairmentSchema),
  });

  const impairment = watch("impairment");
  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("impairment", value, { shouldValidate: true });
    clearErrors("impairment");
  };

  const onSubmit = (data: ImpairmentSchemaType) => {
    onNext({ ...data, eligible: data.impairment === "Yes" });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="impairmentForm"
        onSubmit={handleSubmit(onSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-poppins font-semibold text-foreground animate-title">Do you have severe liver or renal impairment?</h2>

          <Radio.Group
            value={impairment}
            onChange={handleSelect}
            className="mt-6 w-full animate-content"
          >
            <div className="grid md:grid-cols-2 gap-5 w-full">
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(impairment, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {impairment === option && (
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

          {errors.impairment && <Text className="text-red-500 text-sm mt-5 text-center">{errors.impairment.message}</Text>}
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
            form="impairmentForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Impairment;
