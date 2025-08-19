import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Radio, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const nitroglycerinSchema = yup.object({
  nitroglycerin: yup.string().required("Please select an option."),
});

export type NitroglycerinSchemaType = yup.InferType<typeof nitroglycerinSchema>;

interface INitroglycerinProps {
  onNext: (data: NitroglycerinSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: NitroglycerinSchemaType;
}

const Nitroglycerin = ({ onNext, onBack, defaultValues }: INitroglycerinProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<NitroglycerinSchemaType>({
    defaultValues: {
      nitroglycerin: defaultValues?.nitroglycerin || "",
    },
    resolver: yupResolver(nitroglycerinSchema),
  });

  const nitroglycerin = watch("nitroglycerin");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("nitroglycerin", value, { shouldValidate: true });
    clearErrors("nitroglycerin");
  };

  const onSubmit = (data: NitroglycerinSchemaType) => {
    onNext({ ...data, eligible: data.nitroglycerin === "Yes" });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="nitroglycerinForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-poppins font-semibold text-foreground">Are you currently taking nitrates or nitroglycerin? </h2>

          <Radio.Group
            value={nitroglycerin}
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
                      ${nitroglycerin === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                    `,
                  }}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {nitroglycerin === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                          <i className="icon-tick text-sm/none"></i>
                        </span>
                      )}
                    </div>
                  }
                />
              ))}
            </Group>
          </Radio.Group>

          {errors.nitroglycerin && <Text className="text-red-500 text-sm mt-5 text-center">{errors.nitroglycerin.message}</Text>}
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
            form="nitroglycerinForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Nitroglycerin;
