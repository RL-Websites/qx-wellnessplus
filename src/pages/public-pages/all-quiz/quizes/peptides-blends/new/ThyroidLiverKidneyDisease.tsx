import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const thyroidLiverKidneyDiseaseSchema = yup.object({
  thyroidLiverKidneyDisease: yup.string().required("Please select an option."),
});

export type ThyroidLiverKidneyDiseaseSchemaType = yup.InferType<typeof thyroidLiverKidneyDiseaseSchema>;

interface IThyroidLiverKidneyDiseaseProps {
  onNext: (data: ThyroidLiverKidneyDiseaseSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: ThyroidLiverKidneyDiseaseSchemaType;
}

const ThyroidLiverKidneyDisease = ({ onNext, onBack, defaultValues }: IThyroidLiverKidneyDiseaseProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<ThyroidLiverKidneyDiseaseSchemaType>({
    defaultValues: {
      thyroidLiverKidneyDisease: defaultValues?.thyroidLiverKidneyDisease || "",
    },
    resolver: yupResolver(thyroidLiverKidneyDiseaseSchema),
  });

  const thyroidLiverKidneyDisease = watch("thyroidLiverKidneyDisease");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("thyroidLiverKidneyDisease", value, { shouldValidate: true });
    clearErrors("thyroidLiverKidneyDisease");
  };

  const onSubmit = (data: ThyroidLiverKidneyDiseaseSchemaType) => {
    onNext({ ...data, eligible: data.thyroidLiverKidneyDisease === "Yes" });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="thyroidLiverKidneyDiseaseForm"
        onSubmit={handleSubmit(onSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-poppins font-semibold text-foreground">Do you have uncontrolled thyroid, liver, or kidney disease?</h2>

          <Radio.Group
            value={thyroidLiverKidneyDisease}
            onChange={handleSelect}
            className="mt-6 w-full"
          >
            <div className="grid md:grid-cols-2 w-full gap-5">
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(thyroidLiverKidneyDisease, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {thyroidLiverKidneyDisease === option && (
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

          {errors.thyroidLiverKidneyDisease && <Text className="text-red-500 text-sm mt-5 text-center">{errors.thyroidLiverKidneyDisease.message}</Text>}
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
            form="thyroidLiverKidneyDiseaseForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ThyroidLiverKidneyDisease;
