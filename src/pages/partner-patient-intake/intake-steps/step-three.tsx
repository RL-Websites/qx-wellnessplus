import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Group, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step3Schema = yup.object({
  hadPrevWeightLoss: yup.string().required("Please select at least one value."),
  descPrevWeightLoss: yup.string().when("hadPrevWeightLoss", {
    is: "Yes",
    then: (schema) => schema.required("Please select at least one value."),
  }),
});

export type step3SchemaType = yup.InferType<typeof step3Schema>;
interface StepThreeProps {
  onNext: (data: any) => void;
  onBack: () => void;
  defaultValues?: step3SchemaType;
}

const StepThree = ({ onNext, onBack, defaultValues }: StepThreeProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      hadPrevWeightLoss: defaultValues?.hadPrevWeightLoss,
      descPrevWeightLoss: defaultValues?.descPrevWeightLoss,
    },
    resolver: yupResolver(step3Schema),
  });

  const hadPrevWeightLoss = watch("hadPrevWeightLoss");
  const showDescPrevWeightLoss = hadPrevWeightLoss === "Yes";
  const descPrevWeightLoss = watch("descPrevWeightLoss");

  return (
    <>
      <form
        id="stepThreeForm"
        onSubmit={handleSubmit(onNext)}
        className="card divide-y pt-10 space-y-10 min-h-[200px]"
      >
        <Radio.Group
          value={hadPrevWeightLoss}
          {...register("hadPrevWeightLoss")}
          onChange={(value) => {
            setValue("hadPrevWeightLoss", value);
            clearErrors("hadPrevWeightLoss");
            setValue("descPrevWeightLoss", "");
            clearErrors("descPrevWeightLoss");
          }}
          label="Have you had any previous weight loss attempts or programs?"
          error={getErrorMessage(errors?.hadPrevWeightLoss)}
        >
          <Group mt="xs">
            <Radio
              value="Yes"
              label="Yes"
              color="dark"
              {...register("hadPrevWeightLoss")}
            />
            <Radio
              value="No"
              label="No"
              color="dark"
              {...register("hadPrevWeightLoss")}
            />
          </Group>
        </Radio.Group>

        {showDescPrevWeightLoss && (
          <div>
            <Radio.Group
              label="Please select the statement that best describes your previous weight loss attempts."
              {...register("descPrevWeightLoss")}
              value={descPrevWeightLoss}
              onChange={(value) => {
                setValue("descPrevWeightLoss", value);
                clearErrors("descPrevWeightLoss");
              }}
              className="pt-10"
            >
              <Box
                mt="xs"
                className="space-y-3"
              >
                <Radio
                  value="Was able to lose weight and kept off the weight for a while"
                  label="Was able to lose weight and kept off the weight for a while"
                  color="dark"
                  {...register("descPrevWeightLoss")}
                />
                <Radio
                  value="Was able to lose weight but regained the weight shortly after"
                  label="Was able to lose weight but regained the weight shortly after"
                  color="dark"
                  {...register("descPrevWeightLoss")}
                />
                <Radio
                  value="Was unable to lose even though I followed my dietary and exercise goals"
                  label="Was unable to lose even though I followed my dietary and exercise goals"
                  color="dark"
                  {...register("descPrevWeightLoss")}
                />
                <Radio
                  value="Was unable to lose weight and I was unable to follow my dietary and exercise goals"
                  label="Was unable to lose weight and I was unable to follow my dietary and exercise goals"
                  color="dark"
                  {...register("descPrevWeightLoss")}
                />
              </Box>
            </Radio.Group>
            {errors?.descPrevWeightLoss?.message ? <p className="text-sm text-danger mt-2">{errors?.descPrevWeightLoss?.message}</p> : ""}
          </div>
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
            form="stepThreeForm"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default StepThree;
