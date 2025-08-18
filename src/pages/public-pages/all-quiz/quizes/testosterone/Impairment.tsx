import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Radio, Text } from "@mantine/core";
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
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-poppins font-semibold text-foreground">Do you have severe liver or renal impairment?</h2>

          <Radio.Group
            value={impairment}
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
                      ${impairment === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                    `,
                  }}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {impairment === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 right-3 -translate-y-1/2">
                          <i className="icon-tick text-sm/none"></i>
                        </span>
                      )}
                    </div>
                  }
                />
              ))}
            </Group>
          </Radio.Group>

          {errors.impairment && <Text className="text-red-500 text-sm mt-5 text-center">{errors.impairment.message}</Text>}
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
