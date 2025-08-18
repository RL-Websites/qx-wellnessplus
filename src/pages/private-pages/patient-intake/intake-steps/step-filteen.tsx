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
}

const StepFifteen = ({ onNext, onBack, defaultValues }: StepFifteenProps) => {
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
        error={getErrorMessage(errors?.cpapWithDiagonSedSleep)}
        classNames={{
          root: "sm:!grid !block",
          error: "sm:!text-end !text-start w-full",
          label: "sm:!text-3xl pb-2",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {["Yes", "No", "I am not using a CPAP, but I have been diagnosed with Sleep Apnea"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(cpapWithDiagonSedSleep, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {cpapWithDiagonSedSleep === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 right-3 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
      </Radio.Group>

      <Radio.Group
        value={haveBariantricSurgery}
        onChange={(val) => handleSelect("haveBariantricSurgery", val)}
        label="Have you had bariatric surgery within the last 12 months?"
        error={getErrorMessage(errors?.haveBariantricSurgery)}
        classNames={{
          root: "sm:!grid !block",
          error: "sm:!text-end !text-start w-full",
          label: "sm:!text-3xl pb-2",
        }}
      >
        <div className="grid grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(haveBariantricSurgery, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {haveBariantricSurgery === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 right-3 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
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
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StepFifteen;
