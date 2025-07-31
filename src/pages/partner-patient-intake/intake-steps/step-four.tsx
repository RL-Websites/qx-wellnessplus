import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Input, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step4Schema = yup.object({
  anyEatingDisorder: yup.string().required("Please select at least one value."),
  currentDiagnose: yup.string().when("anyEatingDisorder", {
    is: "Yes, currently diagnosed",
    then: (schema) => schema.required("Please select what you are diagnosed with?"),
  }),
  currentDiagOther: yup.string().when("currentDiagnose", {
    is: "Other",
    then: (schema) => schema.required("Please mention your diagnoses."),
  }),
  pastDiagnose: yup.string().when("anyEatingDisorder", {
    is: "Yes, in the past",
    then: (schema) => schema.required("Please select what you were diagnosed with?"),
  }),
  pastDiagBullmia: yup.string().when("pastDiagnose", {
    is: "Bulimia",
    then: (schema) => schema.required("Please select how long has it been since you were diagnosed."),
  }),
  pastDiagOther: yup.string().when("pastDiagnose", {
    is: "Other",
    then: (schema) => schema.required("Please mention what you were diagnosed with?"),
  }),
});

export type step4SchemaType = yup.InferType<typeof step4Schema>;
interface Step4Props {
  onNext: (data: any) => void;
  onBack: () => void;
  defaultValues?: step4SchemaType;
}

const StepFour = ({ onNext, onBack, defaultValues }: Step4Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      anyEatingDisorder: defaultValues?.anyEatingDisorder || "",
      currentDiagnose: defaultValues?.currentDiagnose || "",
      currentDiagOther: defaultValues?.currentDiagOther || "",
      pastDiagnose: defaultValues?.pastDiagnose || "",
      pastDiagBullmia: defaultValues?.pastDiagBullmia || "",
      pastDiagOther: defaultValues?.pastDiagOther || "",
    },
    resolver: yupResolver(step4Schema),
  });

  const anyEatingDisorder = watch("anyEatingDisorder");
  const showCurrentDiagnose = anyEatingDisorder === "Yes, currently diagnosed";
  const currentDiagnose = watch("currentDiagnose");
  const showCurrentDiagOther = currentDiagnose == "Other";
  // const currentDiagOther = watch("currentDiagOther");
  const showPastDiagnose = anyEatingDisorder == "Yes, in the past";
  const pastDiagnose = watch("pastDiagnose");
  const showPastDiagBullmia = pastDiagnose == "Bulimia";
  const pastDiagBullmia = watch("pastDiagBullmia");
  const showPastDiagOther = pastDiagnose == "Other";

  return (
    <>
      <form
        id="step4Form"
        onSubmit={handleSubmit(onNext)}
        className="card divide-y pt-10 space-y-10 min-h-[200px]"
      >
        <Radio.Group
          label="Have you been diagnosed with any eating disorders or have a history of disordered eating?"
          value={anyEatingDisorder}
          {...register("anyEatingDisorder")}
          onChange={(value) => {
            console.log(value);
            setValue("anyEatingDisorder", value);
            setValue("currentDiagOther", "");
            setValue("currentDiagnose", "");
            setValue("pastDiagnose", "");
            setValue("pastDiagBullmia", "");
            setValue("pastDiagOther", "");
            clearErrors("anyEatingDisorder");
          }}
          error={getErrorMessage(errors?.anyEatingDisorder)}
        >
          <Box
            mt="xs"
            className="space-y-4"
          >
            <Radio
              value="Yes, currently diagnosed"
              label="Yes, currently diagnosed"
              color="dark"
              {...register("anyEatingDisorder")}
            />
            <Radio
              value="Yes, in the past"
              label="Yes, in the past"
              color="dark"
              {...register("anyEatingDisorder")}
            />
            <Radio
              value="No, but I have experienced disordered eating behaviors"
              label="No, but I have experienced disordered eating behaviors"
              color="dark"
              {...register("anyEatingDisorder")}
            />
            <Radio
              value="No, never"
              label="No, never"
              color="dark"
              {...register("anyEatingDisorder")}
            />
          </Box>
        </Radio.Group>

        {showCurrentDiagnose && (
          <div>
            <Radio.Group
              label="What are you diagnosed with?"
              {...register("currentDiagnose")}
              value={currentDiagnose}
              onChange={(value) => {
                setValue("currentDiagnose", value);
                setValue("currentDiagOther", "");
                clearErrors("currentDiagnose");
              }}
              className="pt-10"
            >
              <Box
                mt="xs"
                className="space-y-3"
              >
                <Radio
                  value="Binge Eating"
                  label="Binge Eating"
                  color="dark"
                  {...register("currentDiagnose")}
                />
                <Radio
                  value="Bulimia"
                  label="Bulimia"
                  color="dark"
                  {...register("currentDiagnose")}
                />
                <Radio
                  value="Anorexia Nervosa"
                  label="Anorexia Nervosa"
                  color="dark"
                  {...register("currentDiagnose")}
                />
                <Radio
                  value="Other"
                  label="Other"
                  color="dark"
                  {...register("currentDiagnose")}
                />
              </Box>
            </Radio.Group>
            {errors?.currentDiagnose?.message ? <p className="text-sm text-danger mt-2">{errors?.currentDiagnose?.message}</p> : ""}
          </div>
        )}
        {showCurrentDiagOther && (
          <Input.Wrapper
            label="Please Specify what are you diagnosed with?"
            withAsterisk
            className="pt-8"
            error={getErrorMessage(errors.currentDiagOther)}
          >
            <Input
              type="text"
              {...register("currentDiagOther")}
            />
          </Input.Wrapper>
        )}

        {showPastDiagnose && (
          <div>
            <Radio.Group
              label="What were you diagnosed with?"
              {...register("pastDiagnose")}
              value={pastDiagnose}
              onChange={(value) => {
                setValue("pastDiagnose", value);
                setValue("pastDiagBullmia", "");
                setValue("pastDiagOther", "");
                clearErrors("pastDiagnose");
              }}
              className="pt-10"
            >
              <Box
                mt="xs"
                className="space-y-3"
              >
                <Radio
                  value="Binge Eating"
                  label="Binge Eating"
                  color="dark"
                  {...register("pastDiagnose")}
                />
                <Radio
                  value="Bulimia"
                  label="Bulimia"
                  color="dark"
                  {...register("pastDiagnose")}
                />
                <Radio
                  value="Anorexia Nervosa"
                  label="Anorexia Nervosa"
                  color="dark"
                  {...register("pastDiagnose")}
                />
                <Radio
                  value="Other"
                  label="Other"
                  color="dark"
                  {...register("pastDiagnose")}
                />
              </Box>
            </Radio.Group>
            {errors?.pastDiagnose?.message ? <p className="text-sm text-danger mt-2">{errors?.pastDiagnose?.message}</p> : ""}
          </div>
        )}
        {showPastDiagBullmia && (
          <div>
            <Radio.Group
              label="How long has it been since you were diagnosed?"
              {...register("pastDiagBullmia")}
              value={pastDiagBullmia}
              onChange={(value) => {
                setValue("pastDiagBullmia", value);
                clearErrors("pastDiagBullmia");
              }}
              className="pt-10"
            >
              <Box
                mt="xs"
                className="space-y-3"
              >
                <Radio
                  value="Less than 12 months ago"
                  label="Less than 12 months ago"
                  color="dark"
                  {...register("pastDiagBullmia")}
                />
                <Radio
                  value="More than 12 months ago"
                  label="More than 12 months ago"
                  color="dark"
                  {...register("pastDiagBullmia")}
                />
              </Box>
            </Radio.Group>
            {errors?.pastDiagBullmia?.message ? <p className="text-sm text-danger mt-2">{errors?.pastDiagBullmia?.message}</p> : ""}
          </div>
        )}
        {showPastDiagOther && (
          <Input.Wrapper
            label="Please specify what were you diagnosed with?"
            withAsterisk
            className="pt-8"
            error={getErrorMessage(errors.pastDiagOther)}
          >
            <Input
              type="text"
              {...register("pastDiagOther")}
            />
          </Input.Wrapper>
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
            form="step4Form"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default StepFour;
