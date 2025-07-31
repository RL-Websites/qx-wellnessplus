import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step7Schema = yup.object({
  amountOfAlcohol: yup.string().required("Please select at least one value."),
});

export type step7SchemaType = yup.InferType<typeof step7Schema>;
interface Step7Props {
  onNext: (data: any) => void;
  onBack: () => void;
  defaultValues?: step7SchemaType;
}

const StepSeven = ({ onNext, onBack, defaultValues }: Step7Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amountOfAlcohol: defaultValues?.amountOfAlcohol || "",
    },
    resolver: yupResolver(step7Schema),
  });

  const amountOfAlcohol = watch("amountOfAlcohol");

  return (
    <>
      <form
        id="step7Form"
        onSubmit={handleSubmit(onNext)}
        className="card divide-y pt-10 space-y-10 min-h-[200px]"
      >
        <Radio.Group
          label="How much alcohol do you drink?"
          value={amountOfAlcohol}
          {...register("amountOfAlcohol")}
          onChange={(value) => {
            console.log(value);
            setValue("amountOfAlcohol", value);
            clearErrors("amountOfAlcohol");
          }}
          error={getErrorMessage(errors?.amountOfAlcohol)}
        >
          <Box
            mt="xs"
            className="space-y-4"
          >
            <Radio
              value="3+ drinks per day"
              label="3+ drinks per day"
              color="dark"
              {...register("amountOfAlcohol")}
            />
            <Radio
              value="1-2 drinks per day"
              label="1-2 drinks per day"
              color="dark"
              {...register("amountOfAlcohol")}
            />
            <Radio
              value="1-2 drinks per week"
              label="1-2 drinks per week"
              color="dark"
              {...register("amountOfAlcohol")}
            />
            <Radio
              value="3-5 drinks per week"
              label="3-5 drinks per week"
              color="dark"
              {...register("amountOfAlcohol")}
            />
            <Radio
              value="None"
              label="None"
              color="dark"
              {...register("amountOfAlcohol")}
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
            form="step7Form"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default StepSeven;
