import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const uncontrolledHeartOrSleepApneaSchema = yup.object({
  heartOrSleepApnea: yup.string().required("Please select an option."),
});

export type UncontrolledHeartOrSleepApneaSchemaType = yup.InferType<typeof uncontrolledHeartOrSleepApneaSchema>;

interface IUncontrolledHeartOrSleepApneaProps {
  onNext: (data: UncontrolledHeartOrSleepApneaSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: UncontrolledHeartOrSleepApneaSchemaType;
}

const UncontrolledHeartOrSleepApnea = ({ onNext, onBack, defaultValues }: IUncontrolledHeartOrSleepApneaProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<UncontrolledHeartOrSleepApneaSchemaType>({
    defaultValues: {
      heartOrSleepApnea: defaultValues?.heartOrSleepApnea || "",
    },
    resolver: yupResolver(uncontrolledHeartOrSleepApneaSchema),
  });

  const heartOrSleepApnea = watch("heartOrSleepApnea");
  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("heartOrSleepApnea", value, { shouldValidate: true });
    clearErrors("heartOrSleepApnea");
  };

  const onSubmit = (data: UncontrolledHeartOrSleepApneaSchemaType) => {
    onNext({ ...data, eligible: data.heartOrSleepApnea === "No" });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="uncontrolledHeartOrSleepApneaForm"
        onSubmit={handleSubmit(onSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-poppins font-semibold text-foreground animate-title">
            Have you been diagnosed with uncontrolled heart disease or severe sleep apnea?
          </h2>

          <Radio.Group
            value={heartOrSleepApnea}
            onChange={handleSelect}
            className="mt-6 w-full animate-content"
          >
            <div className="grid md:grid-cols-2 gap-5 w-full">
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
                      ${heartOrSleepApnea === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                    `,
                  }}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {heartOrSleepApnea === option && (
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

          {errors.heartOrSleepApnea && <Text className="text-red-500 text-sm mt-5 text-center">{errors.heartOrSleepApnea.message}</Text>}
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
            form="uncontrolledHeartOrSleepApneaForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UncontrolledHeartOrSleepApnea;
