import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step3Schema = yup.object({
  hadPrevWeightLoss: yup.string().required("Please select at least one value."),
  descPrevWeightLoss: yup.string().when("hadPrevWeightLoss", {
    is: "Yes",
    then: (schema) => schema.required("Please select at least one value."),
  }),
});

export type step3SchemaType = yup.InferType<typeof step3Schema>;

interface StepThreeProps {
  onNext: (data: step3SchemaType) => void;
  onBack: () => void;
  defaultValues?: step3SchemaType;
}

const StepThree = ({ onNext, onBack, defaultValues }: StepThreeProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<step3SchemaType>({
    defaultValues: {
      hadPrevWeightLoss: defaultValues?.hadPrevWeightLoss || "",
      descPrevWeightLoss: defaultValues?.descPrevWeightLoss || "",
    },
    resolver: yupResolver(step3Schema),
  });

  const hadPrevWeightLoss = watch("hadPrevWeightLoss");
  const descPrevWeightLoss = watch("descPrevWeightLoss");
  const showDescPrevWeightLoss = hadPrevWeightLoss === "Yes";

  const handleSelect = (field: keyof step3SchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  const hadPrevOptions = ["Yes", "No"];
  const descOptions = [
    "Was able to lose weight and kept off the weight for a while",
    "Was able to lose weight but regained the weight shortly after",
    "Was unable to lose even though I followed my dietary and exercise goals",
    "Was unable to lose weight and I was unable to follow my dietary and exercise goals",
  ];

  return (
    <form
      id="stepThreeForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      <Radio.Group
        value={hadPrevWeightLoss}
        onChange={(value) => {
          handleSelect("hadPrevWeightLoss", value);
          setValue("descPrevWeightLoss", "");
          clearErrors("descPrevWeightLoss");
        }}
        label="Have you had any previous weight loss attempts or programs?"
        error={getErrorMessage(errors?.hadPrevWeightLoss)}
        classNames={{
          root: "sm:!grid !block w-full",
          error: "sm:!text-end !text-start w-full",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid grid-cols-2 gap-5">
          {hadPrevOptions.map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(hadPrevWeightLoss, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {hadPrevWeightLoss === option && (
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

      {showDescPrevWeightLoss && (
        <Radio.Group
          value={descPrevWeightLoss}
          onChange={(value) => handleSelect("descPrevWeightLoss", value)}
          label="Please select the statement that best describes your previous weight loss attempts."
          error={getErrorMessage(errors?.descPrevWeightLoss)}
          classNames={{
            root: "sm:!grid !block w-full",
            error: "sm:!text-end !text-start w-full",
            label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
          }}
        >
          <div className="grid grid-cols-1 gap-5">
            {descOptions.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(descPrevWeightLoss, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {descPrevWeightLoss === option && (
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
          form="stepThreeForm"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StepThree;
