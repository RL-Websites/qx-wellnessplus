import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step13Schema = yup.object({
  endocrineNeoplasia: yup.string().required("Please select at least one value."),
});

export type step13SchemaType = yup.InferType<typeof step13Schema>;

interface StepThirteenProps {
  onNext: (data: step13SchemaType) => void;
  onBack: () => void;
  defaultValues?: step13SchemaType;
}

const StepThirteen = ({ onNext, onBack, defaultValues }: StepThirteenProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<step13SchemaType>({
    defaultValues: {
      endocrineNeoplasia: defaultValues?.endocrineNeoplasia || "",
    },
    resolver: yupResolver(step13Schema),
  });

  const endocrineNeoplasia = watch("endocrineNeoplasia");

  const handleSelect = (value: string) => {
    setValue("endocrineNeoplasia", value, { shouldValidate: true });
    clearErrors("endocrineNeoplasia");
  };

  return (
    <form
      id="step13Form"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      <Radio.Group
        value={endocrineNeoplasia}
        onChange={handleSelect}
        label="Do you have a personal or family history of multiple endocrine neoplasia?"
        classNames={{
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(endocrineNeoplasia, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {endocrineNeoplasia === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.endocrineNeoplasia)}</p>
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
          form="step13Form"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StepThirteen;
