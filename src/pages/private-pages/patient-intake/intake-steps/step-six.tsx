import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step6Schema = yup.object({
  takesDrug: yup.string().required("Please select at least one value."),
  whatDrugs: yup.string().when("takesDrug", {
    is: "Yes",
    then: (schema) => schema.required("Please select what drugs do you use?"),
  }),
  whatDrugsOther: yup.string().when("whatDrugs", {
    is: "Other",
    then: (schema) => schema.required("Please mention drugs name you use."),
  }),
});

export type step6SchemaType = yup.InferType<typeof step6Schema>;

interface StepSixProps {
  onNext: (data: step6SchemaType) => void;
  onBack: () => void;
  defaultValues?: step6SchemaType;
}

const StepSix = ({ onNext, onBack, defaultValues }: StepSixProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<step6SchemaType>({
    defaultValues: {
      takesDrug: defaultValues?.takesDrug || "",
      whatDrugs: defaultValues?.whatDrugs || "",
      whatDrugsOther: defaultValues?.whatDrugsOther || "",
    },
    resolver: yupResolver(step6Schema),
  });

  const takesDrug = watch("takesDrug");
  const whatDrugs = watch("whatDrugs");

  const showWhatDrugs = takesDrug === "Yes";
  const showWhatDrugsOther = whatDrugs === "Other";

  const takesDrugOptions = ["Yes", "No"];
  const drugOptions = ["Cocaine", "Marijuana", "Methamphetamine", "Other"];

  const handleSelect = (field: keyof step6SchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
    if (field === "takesDrug") {
      setValue("whatDrugs", "");
      setValue("whatDrugsOther", "");
    }
    if (field === "whatDrugs") {
      setValue("whatDrugsOther", "");
    }
  };

  return (
    <form
      id="step6Form"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      <Radio.Group
        value={takesDrug}
        label="Do you use recreational drugs?"
        classNames={{
          root: "w-full",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid grid-cols-2 gap-5">
          {takesDrugOptions.map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(takesDrug, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {takesDrug === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
              onChange={() => handleSelect("takesDrug", option)}
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.takesDrug)}</p>
      </Radio.Group>

      {showWhatDrugs && (
        <Radio.Group
          value={whatDrugs}
          label="What drugs do you use?"
          classNames={{
            root: "w-full",
            label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
          }}
        >
          <div className="grid sm:grid-cols-2 gap-5">
            {drugOptions.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(whatDrugs, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {whatDrugs === option && (
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                        <i className="icon-tick text-sm/none"></i>
                      </span>
                    )}
                  </div>
                }
                onChange={() => handleSelect("whatDrugs", option)}
              />
            ))}
          </div>
          <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.whatDrugs)}</p>
        </Radio.Group>
      )}

      {showWhatDrugsOther && (
        <div>
          <Input.Wrapper
            label="Please specify what drugs do you use?"
            withAsterisk
            className="pt-4"
            classNames={{
              label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
            }}
          >
            <Input
              type="text"
              {...register("whatDrugsOther")}
            />
          </Input.Wrapper>
          <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.whatDrugsOther)}</p>
        </div>
      )}

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
          form="step6Form"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StepSix;
