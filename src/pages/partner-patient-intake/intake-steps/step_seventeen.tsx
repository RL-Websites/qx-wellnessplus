import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step17Schema = yup.object({
  cpapWithDiagonSedSleep: yup.string().required("Please select at least one value."),
  haveBariantricSurgery: yup.string().required("Please select at least one value."),
});

export type step17SchemaType = yup.InferType<typeof step17Schema>;
interface Step6Props {
  onNext: (data: any) => void;
  onBack: () => void;
  defaultValues?: step17SchemaType;
}

const StepSeventeen = ({ onNext, onBack, defaultValues }: Step6Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      cpapWithDiagonSedSleep: defaultValues?.cpapWithDiagonSedSleep || "",
      haveBariantricSurgery: defaultValues?.haveBariantricSurgery || "",
    },
    resolver: yupResolver(step17Schema),
  });

  return (
    <>
      <form
        id="step4Form"
        onSubmit={handleSubmit(onNext)}
        className="card divide-y pt-10 space-y-10 min-h-[200px]"
      >
        <Radio.Group
          label="Are you on CPAP with diagnosed Sleep Apnea? "
          {...register("cpapWithDiagonSedSleep")}
          value={watch("cpapWithDiagonSedSleep")}
          onChange={(value) => {
            setValue("cpapWithDiagonSedSleep", value);
          }}
          error={getErrorMessage(errors?.cpapWithDiagonSedSleep)}
        >
          <Box
            mt="xs"
            className="space-y-4"
          >
            <Radio
              value="Yes"
              label="Yes"
              color="dark"
              {...register("cpapWithDiagonSedSleep")}
            />
            <Radio
              value="No"
              label="No"
              color="dark"
              {...register("cpapWithDiagonSedSleep")}
            />
            <Radio
              value="I am not using a CPAP, but I have been diagnosed with Sleep Apnea"
              label="I am not using a CPAP, but I have been diagnosed with Sleep Apnea"
              color="dark"
              {...register("cpapWithDiagonSedSleep")}
            />
          </Box>
        </Radio.Group>

        <Radio.Group
          label="Have you had bariatric surgery within the last 12 months? "
          className="pt-6"
          value={watch("haveBariantricSurgery")}
          onChange={(value) => {
            setValue("haveBariantricSurgery", value);
          }}
          error={getErrorMessage(errors?.haveBariantricSurgery)}
        >
          <Box
            mt="xs"
            className="space-y-4"
          >
            <Radio
              value="Yes"
              label="Yes"
              color="dark"
              {...register("haveBariantricSurgery")}
            />
            <Radio
              value="No"
              label="No"
              color="dark"
              {...register("haveBariantricSurgery")}
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
            form="step4Form"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default StepSeventeen;
