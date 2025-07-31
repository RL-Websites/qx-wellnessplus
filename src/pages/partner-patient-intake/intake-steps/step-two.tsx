import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step2Schema = yup.object({
  doesDiet: yup.string().required("Please select at least one value."),
  agreeGlpExercise: yup.string().when("doesDiet", {
    is: "No",
    then: (schema) => schema.required("Please select at least one value."),
    otherwise: (schema) => schema.nullable(),
  }),
});

export type step2SchemaType = yup.InferType<typeof step2Schema>;
interface StepTwoProps {
  onNext: (data: any) => void;
  onBack: () => void;
  defaultValues?: step2SchemaType;
}

const StepTwo = ({ onNext, onBack, defaultValues }: StepTwoProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      doesDiet: defaultValues?.doesDiet,
      agreeGlpExercise: defaultValues?.agreeGlpExercise,
    },
    resolver: yupResolver(step2Schema),
  });

  const doesDiet = watch("doesDiet");
  const agreeGlpExercise = watch("agreeGlpExercise");
  const showAgreeGlpExercise = doesDiet === "No";

  return (
    <>
      <form
        id="stepTwoForm"
        onSubmit={handleSubmit(onNext)}
        className="card divide-y pt-10 space-y-10 min-h-[200px]"
      >
        <Radio.Group
          value={doesDiet}
          {...register("doesDiet")}
          onChange={(value) => {
            setValue("doesDiet", value);
            clearErrors("doesDiet");
            if (value == "Yes") {
              clearErrors("agreeGlpExercise");
            }
          }}
          label="Are you willing to follow a weight loss dietary plan/reduce calories and exercise?"
          error={getErrorMessage(errors?.doesDiet)}
        >
          <Group mt="xs">
            <Radio
              value="Yes"
              label="Yes"
              color="dark"
              {...register("doesDiet")}
            />
            <Radio
              value="No"
              label="No"
              color="dark"
              {...register("doesDiet")}
            />
          </Group>
        </Radio.Group>

        {showAgreeGlpExercise && (
          <Radio.Group
            value={agreeGlpExercise}
            {...register("agreeGlpExercise")}
            onChange={(value) => {
              setValue("agreeGlpExercise", value);
              clearErrors("agreeGlpExercise");
            }}
            className="pt-10"
            label="I acknowledge that GLP medications are most effective when used in conjunction with exercise."
            error={getErrorMessage(errors?.agreeGlpExercise)}
          >
            <Group mt="xs">
              <Radio
                value="Yes"
                label="Yes"
                color="dark"
                {...register("agreeGlpExercise")}
              />
              <Radio
                value="No"
                label="No"
                color="dark"
                {...register("agreeGlpExercise")}
              />
            </Group>
          </Radio.Group>
        )}
      </form>

      <div className="flex justify-between mt-6">
        <div className="flex gap-6 sm:ms-auto sm:mx-0 mx-auto">
          <Button
            px={0}
            variant="outline"
            onClick={onBack}
            className="sm:w-[256px] w-[120px]"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="sm:w-[256px] w-[120px]"
            form="stepTwoForm"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default StepTwo;
