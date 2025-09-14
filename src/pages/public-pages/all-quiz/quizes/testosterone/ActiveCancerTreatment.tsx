import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const activeCancerTreatmentSchema = yup.object({
  activeCancerTreatment: yup.string().required("Please select an option."),
});

export type ActiveCancerTreatmentSchemaType = yup.InferType<typeof activeCancerTreatmentSchema>;

interface IActiveCancerTreatmentProps {
  onNext: (data: ActiveCancerTreatmentSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: ActiveCancerTreatmentSchemaType;
}

const ActiveCancerTreatment = ({ onNext, onBack, defaultValues }: IActiveCancerTreatmentProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<ActiveCancerTreatmentSchemaType>({
    defaultValues: {
      activeCancerTreatment: defaultValues?.activeCancerTreatment || "",
    },
    resolver: yupResolver(activeCancerTreatmentSchema),
  });

  const activeCancerTreatment = watch("activeCancerTreatment");
  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("activeCancerTreatment", value, { shouldValidate: true });
    clearErrors("activeCancerTreatment");
  };

  const onSubmit = (data: ActiveCancerTreatmentSchemaType) => {
    onNext({ ...data, eligible: data.activeCancerTreatment === "Yes" });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="activeCancerTreatmentForm"
        onSubmit={handleSubmit(onSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-poppins font-semibold text-foreground animate-title">Are you currently under active cancer treatment?</h2>

          <Radio.Group
            value={activeCancerTreatment}
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
                      ${activeCancerTreatment === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                    `,
                  }}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {activeCancerTreatment === option && (
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

          {errors.activeCancerTreatment && <Text className="text-red-500 text-sm mt-5 text-center">{errors.activeCancerTreatment.message}</Text>}
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
            form="activeCancerTreatmentForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ActiveCancerTreatment;
