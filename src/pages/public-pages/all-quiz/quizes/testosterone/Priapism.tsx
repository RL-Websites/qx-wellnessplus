import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Radio, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const priapismSchema = yup.object({
  priapism: yup.string().required("Please select an option."),
});

export type PriapismSchemaType = yup.InferType<typeof priapismSchema>;

interface IPriapismProps {
  onNext: (data: PriapismSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: PriapismSchemaType;
}

const Priapism = ({ onNext, onBack, defaultValues }: IPriapismProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<PriapismSchemaType>({
    defaultValues: {
      priapism: defaultValues?.priapism || "",
    },
    resolver: yupResolver(priapismSchema),
  });

  const priapism = watch("priapism");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("priapism", value, { shouldValidate: true });
    clearErrors("priapism");
  };

  const onSubmit = (data: PriapismSchemaType) => {
    onNext({ ...data, eligible: data.priapism === "Yes" });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="priapismForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-poppins font-semibold text-foreground">Have you ever experienced priapism lasting &gt; 4 hours?</h2>

          <Radio.Group
            value={priapism}
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
                      ${priapism === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                    `,
                  }}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {priapism === option && (
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

          {errors.priapism && <Text className="text-red-500 text-sm mt-5 text-center">{errors.priapism.message}</Text>}
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
            form="priapismForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Priapism;
