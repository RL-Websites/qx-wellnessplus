import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const cancerHistorySchema = yup.object({
  cancerHistory: yup.string().required("Please select your cancer history."),
});

export type CancerHistorySchemaType = yup.InferType<typeof cancerHistorySchema>;

interface ICancerHistoryProps {
  onNext: (data: CancerHistorySchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: CancerHistorySchemaType;
}

const CancerHistory = ({ onNext, onBack, defaultValues }: ICancerHistoryProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<CancerHistorySchemaType>({
    defaultValues: {
      cancerHistory: defaultValues?.cancerHistory || "",
    },
    resolver: yupResolver(cancerHistorySchema),
  });

  const cancerHistory = watch("cancerHistory");
  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("cancerHistory", value, { shouldValidate: true });
    clearErrors("cancerHistory");
  };

  const onSubmit = (data: CancerHistorySchemaType) => {
    onNext({ ...data, eligible: data.cancerHistory === "No" });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="cancerHistoryForm"
        onSubmit={handleSubmit(onSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-poppins font-semibold text-foreground animate-title">Do you have a history of prostate or breast cancer?</h2>

          <Radio.Group
            value={cancerHistory}
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
                      ${cancerHistory === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                    `,
                  }}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {cancerHistory === option && (
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

          {errors.cancerHistory && <Text className="text-red-500 text-sm mt-5 text-center">{errors.cancerHistory.message}</Text>}
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
            form="cancerHistoryForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CancerHistory;
