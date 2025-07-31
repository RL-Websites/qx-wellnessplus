import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step5Schema = yup.object({
  isPregnant: yup.string().required("Please select at least one value."),
});

export type step5SchemaType = yup.InferType<typeof step5Schema>;
interface StepFiveProps {
  onNext: (data: any) => void;
  onBack: () => void;
  defaultValues?: step5SchemaType;
}

const StepFive = ({ onNext, onBack, defaultValues }: StepFiveProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isPregnant: defaultValues?.isPregnant || "",
    },
    resolver: yupResolver(step5Schema),
  });

  const doesDiet = watch("isPregnant");

  return (
    <>
      <form
        id="stepFiveForm"
        onSubmit={handleSubmit(onNext)}
        className="card divide-y pt-10 space-y-10 min-h-[200px]"
      >
        <Radio.Group
          value={doesDiet}
          {...register("isPregnant")}
          onChange={(value) => {
            setValue("isPregnant", value);
            clearErrors("isPregnant");
          }}
          label="Are you currently?"
          error={getErrorMessage(errors?.isPregnant)}
        >
          <Box
            mt="xs"
            className="space-y-4"
          >
            <Radio
              value="Pregnant"
              label="Pregnant"
              color="dark"
              {...register("isPregnant")}
            />
            <Radio
              value="Planning to become pregnant"
              label="Planning to become pregnant"
              color="dark"
              {...register("isPregnant")}
            />
            <Radio
              value="Breastfeeding"
              label="Breastfeeding"
              color="dark"
              {...register("isPregnant")}
            />
            <Radio
              value="None of the above"
              label="None of the above"
              color="dark"
              {...register("isPregnant")}
            />
          </Box>
        </Radio.Group>
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
            form="stepFiveForm"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default StepFive;
