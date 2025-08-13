import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const scalpInfectionsSchema = yup.object({
  scalpInfactions: yup.string().required("Please select an option."),
});

export type scalpInfectionsSchemaType = yup.InferType<typeof scalpInfectionsSchema>;

interface IScalpInfectionsProps {
  onNext: (data: scalpInfectionsSchemaType) => void;
  onBack: () => void;
  defaultValues?: scalpInfectionsSchemaType;
}

const ScalpInfectionsTestosterone = ({ onNext, onBack, defaultValues }: IScalpInfectionsProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<scalpInfectionsSchemaType>({
    defaultValues: {
      scalpInfactions: defaultValues?.scalpInfactions || "",
    },
    resolver: yupResolver(scalpInfectionsSchema),
  });

  const scalpInfactions = watch("scalpInfactions");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("scalpInfactions", value, { shouldValidate: true });
    clearErrors("scalpInfactions");
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="scalpInfectionsForm"
        onSubmit={handleSubmit(onNext)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-poppins font-semibold text-foreground">Do you have a history of scalp infections (e.g., seborrheic dermatitis)?</h2>

          <Radio.Group
            value={scalpInfactions}
            onChange={handleSelect}
            className="mt-6"
            error={errors?.scalpInfactions?.message}
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
                    ${scalpInfactions === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                  `,
                  }}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {scalpInfactions === option && (
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
            form="scalpInfectionsForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ScalpInfectionsTestosterone;
