import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const cardiovascularDiseasePeptidesSchema = yup.object({
  cardiovascularDiseasePeptides: yup.string().required("Please select cardiovascular history."),
});

export type CardiovascularDiseasePeptidesSchemaType = yup.InferType<typeof cardiovascularDiseasePeptidesSchema>;

interface ICardiovascularDiseasePeptidesProps {
  onNext: (data: CardiovascularDiseasePeptidesSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: CardiovascularDiseasePeptidesSchemaType;
}

const CardiovascularDiseasePeptides = ({ onNext, onBack, defaultValues }: ICardiovascularDiseasePeptidesProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<CardiovascularDiseasePeptidesSchemaType>({
    defaultValues: {
      cardiovascularDiseasePeptides: defaultValues?.cardiovascularDiseasePeptides || "",
    },
    resolver: yupResolver(cardiovascularDiseasePeptidesSchema),
  });

  const cardiovascularDiseasePeptides = watch("cardiovascularDiseasePeptides");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("cardiovascularDiseasePeptides", value, { shouldValidate: true });
    clearErrors("cardiovascularDiseasePeptides");
  };

  const onSubmit = (data: CardiovascularDiseasePeptidesSchemaType) => {
    onNext({ ...data, eligible: data.cardiovascularDiseasePeptides === "Yes" });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="cardiovascularDiseasePeptidesForm"
        onSubmit={handleSubmit(onSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-poppins font-semibold text-foreground">
            Do you have uncontrolled cardiovascular disease (e.g., unstable angina, recent heart attack)?
          </h2>

          <Radio.Group
            value={cardiovascularDiseasePeptides}
            onChange={handleSelect}
            className="mt-6 w-full"
          >
            <div className="grid md:grid-cols-2 w-full gap-5">
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(cardiovascularDiseasePeptides, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {cardiovascularDiseasePeptides === option && (
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

          {errors.cardiovascularDiseasePeptides && <Text className="text-red-500 text-sm mt-5 text-center">{errors.cardiovascularDiseasePeptides.message}</Text>}
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
            form="cardiovascularDiseasePeptidesForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CardiovascularDiseasePeptides;
