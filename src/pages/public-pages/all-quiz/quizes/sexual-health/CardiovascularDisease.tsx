import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const cardiovascularDiseaseSchema = yup.object({
  cardiovascularDisease: yup.string().required("Please select cardiovascular history."),
});

export type CardiovascularDiseaseSchemaType = yup.InferType<typeof cardiovascularDiseaseSchema>;

interface ICardiovascularDiseaseProps {
  onNext: (data: CardiovascularDiseaseSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: CardiovascularDiseaseSchemaType;
}

const CardiovascularDisease = ({ onNext, onBack, defaultValues }: ICardiovascularDiseaseProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<CardiovascularDiseaseSchemaType>({
    defaultValues: {
      cardiovascularDisease: defaultValues?.cardiovascularDisease || "",
    },
    resolver: yupResolver(cardiovascularDiseaseSchema),
  });

  const cardiovascularDisease = watch("cardiovascularDisease");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("cardiovascularDisease", value, { shouldValidate: true });
    clearErrors("cardiovascularDisease");
  };

  const onSubmit = (data: CardiovascularDiseaseSchemaType) => {
    onNext({ ...data, eligible: data.cardiovascularDisease === "Yes" });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="cardiovascularDiseaseForm"
        onSubmit={handleSubmit(onSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-poppins font-semibold text-foreground">Do you have uncontrolled cardiovascular disease?</h2>

          <Radio.Group
            value={cardiovascularDisease}
            onChange={handleSelect}
            className="mt-6 w-full"
          >
            <div className="grid md:grid-cols-2 gap-5 w-full">
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(cardiovascularDisease, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {cardiovascularDisease === option && (
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
          {errors.cardiovascularDisease && <Text className="text-red-500 text-sm mt-5 text-center">{errors.cardiovascularDisease.message}</Text>}
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
            form="cardiovascularDiseaseForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CardiovascularDisease;
