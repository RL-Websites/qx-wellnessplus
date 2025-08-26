import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const planningPregnancySchema = yup.object({
  planningPregnancy: yup.string().required("Please select an option."),
});

export type planningPregnancySchemaType = yup.InferType<typeof planningPregnancySchema>;

interface IPlanningPregnancyProps {
  onNext: (data: planningPregnancySchemaType) => void;
  onBack: () => void;
  defaultValues?: planningPregnancySchemaType;
}

const PlanningPregnancy = ({ onNext, onBack, defaultValues }: IPlanningPregnancyProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<planningPregnancySchemaType>({
    defaultValues: {
      planningPregnancy: defaultValues?.planningPregnancy || "",
    },
    resolver: yupResolver(planningPregnancySchema),
  });

  const planningPregnancy = watch("planningPregnancy");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("planningPregnancy", value, { shouldValidate: true });
    clearErrors("planningPregnancy");
  };

  return (
    <form
      id="planningPregnancyForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-xl mx-auto space-y-6"
    >
      <div>
        <h2 className="text-center text-3xl font-poppins font-semibold text-foreground">Are you currently pregnant or planning pregnancy within 3 months?</h2>

        <Radio.Group
          value={planningPregnancy}
          onChange={handleSelect}
          className="mt-6 w-full"
          error={errors?.planningPregnancy?.message}
        >
          <div className="grid md:grid-cols-2 w-full gap-5">
            {options.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(planningPregnancy, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {planningPregnancy === option && (
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
          form="planningPregnancyForm"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default PlanningPregnancy;
