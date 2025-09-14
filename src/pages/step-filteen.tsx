import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step15Schema = yup.object({
  cpapWithDiagonSedSleep: yup.string().required("Please select at least one value."),
  haveBariantricSurgery: yup.string().required("Please select at least one value."),
});

export type step15SchemaType = yup.InferType<typeof step15Schema>;

interface StepFifteenProps {
  onNext: (data: step15SchemaType) => void;
  onBack: () => void;
  defaultValues?: step15SchemaType;
  isLoading?: boolean;
}

const StepFifteen = ({ onNext, onBack, defaultValues, isLoading = false }: StepFifteenProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<step15SchemaType>({
    defaultValues: {
      cpapWithDiagonSedSleep: defaultValues?.cpapWithDiagonSedSleep || "",
      haveBariantricSurgery: defaultValues?.haveBariantricSurgery || "",
    },
    resolver: yupResolver(step15Schema),
  });

  const cpapWithDiagonSedSleep = watch("cpapWithDiagonSedSleep");
  const haveBariantricSurgery = watch("haveBariantricSurgery");

  const handleSelect = (field: keyof step15SchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  return (
    <form
      id="step15Form"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      <Radio.Group
        value={cpapWithDiagonSedSleep}
        onChange={(val) => handleSelect("cpapWithDiagonSedSleep", val)}
        label="Are you on CPAP with diagnosed Sleep Apnea?"
        classNames={{
          root: "!block",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid md:grid-cols-2 gap-5">
          {["Yes", "No", "I am not using a CPAP, but I have been diagnosed with Sleep Apnea"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(cpapWithDiagonSedSleep, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {cpapWithDiagonSedSleep === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.cpapWithDiagonSedSleep)}</p>
      </Radio.Group>

      <Radio.Group
        value={haveBariantricSurgery}
        onChange={(val) => handleSelect("haveBariantricSurgery", val)}
        label="Have you had bariatric surgery within the last 12 months?"
        classNames={{
          root: "!block",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(haveBariantricSurgery, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {haveBariantricSurgery === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.haveBariantricSurgery)}</p>
      </Radio.Group>
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
          form="step15Form"
          loading={isLoading}
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StepFifteen;
