import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step9Schema = yup.object({
  triglyceride: yup.string().required("Please select at least one value."),
  hypertension: yup.string().required("Please select at least one value."),
  warfarin: yup.string().required("Please select at least one value."),
  thyroidism: yup.string().required("Please select at least one value."),
});

export type step9SchemaType = yup.InferType<typeof step9Schema>;
interface Step9Props {
  onNext: (data: any) => void;
  onBack: () => void;
  defaultValues?: step9SchemaType;
}

const StepNine = ({ onNext, onBack, defaultValues }: Step9Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      triglyceride: defaultValues?.triglyceride || "",
      hypertension: defaultValues?.hypertension || "",
      warfarin: defaultValues?.warfarin || "",
      thyroidism: defaultValues?.thyroidism || "",
    },
    resolver: yupResolver(step9Schema),
  });

  const triglyceride = watch("triglyceride");
  const hypertension = watch("hypertension");
  const warfarin = watch("warfarin");
  const thyroidism = watch("thyroidism");

  return (
    <>
      <form
        id="step9Form"
        onSubmit={handleSubmit(onNext)}
        className="card divide-y pt-10 space-y-10 min-h-[200px]"
      >
        <Radio.Group
          label="Did you ever have a fasting triglyceride level above 500?"
          value={triglyceride}
          {...register("triglyceride")}
          onChange={(value) => {
            console.log(value);
            setValue("triglyceride", value);
            clearErrors("triglyceride");
          }}
          error={getErrorMessage(errors?.triglyceride)}
        >
          <Box
            mt="xs"
            className="space-y-4"
          >
            <Radio
              value="Yes"
              label="Yes"
              color="dark"
              {...register("triglyceride")}
            />
            <Radio
              value="No"
              label="No"
              color="dark"
              {...register("triglyceride")}
            />
          </Box>
        </Radio.Group>

        <Radio.Group
          label="Are you taking high blood pressure medication for Hypertension?"
          value={hypertension}
          {...register("hypertension")}
          className="pt-8"
          onChange={(value) => {
            console.log(value);
            setValue("hypertension", value);
            clearErrors("hypertension");
          }}
          error={getErrorMessage(errors?.hypertension)}
        >
          <Box
            mt="xs"
            className="space-y-4"
          >
            <Radio
              value="Yes"
              label="Yes"
              color="dark"
              {...register("hypertension")}
            />
            <Radio
              value="No"
              label="No"
              color="dark"
              {...register("hypertension")}
            />
          </Box>
        </Radio.Group>
        <Radio.Group
          label="Are you on Warfarin?"
          className="pt-8"
          value={warfarin}
          {...register("warfarin")}
          onChange={(value) => {
            console.log(value);
            setValue("warfarin", value);
            clearErrors("warfarin");
          }}
          error={getErrorMessage(errors?.warfarin)}
        >
          <Box
            mt="xs"
            className="space-y-4"
          >
            <Radio
              value="Yes"
              label="Yes"
              color="dark"
              {...register("warfarin")}
            />
            <Radio
              value="No"
              label="No"
              color="dark"
              {...register("warfarin")}
            />
          </Box>
        </Radio.Group>
        <Radio.Group
          label="Do you have a history of any of the following?"
          className="pt-8"
          value={thyroidism}
          {...register("thyroidism")}
          onChange={(value) => {
            console.log(value);
            setValue("thyroidism", value);
            clearErrors("thyroidism");
          }}
          error={getErrorMessage(errors?.thyroidism)}
        >
          <Box
            mt="xs"
            className="space-y-4"
          >
            <Radio
              value="Hypothyroidism"
              label="Hypothyroidism"
              color="dark"
              {...register("thyroidism")}
            />
            <Radio
              value="Hyperthyroidism"
              label="Hyperthyroidism"
              color="dark"
              {...register("thyroidism")}
            />
            <Radio
              value="Graves disease"
              label="Graves disease"
              color="dark"
              {...register("thyroidism")}
            />
            <Radio
              value="Thyroid nodules"
              label="Thyroid nodules"
              color="dark"
              {...register("thyroidism")}
            />
            <Radio
              value="No"
              label="No"
              color="dark"
              {...register("thyroidism")}
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
            form="step9Form"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default StepNine;
