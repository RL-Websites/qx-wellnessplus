import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Input, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step6Schema = yup.object({
  takesDrug: yup.string().required("Please select at least one value."),
  whatDrugs: yup.string().when("takesDrug", {
    is: "Yes",
    then: (schema) => schema.required("Please select what drugs do you use?"),
  }),
  whatDrugsOther: yup.string().when("whatDrugs", {
    is: "Other",
    then: (schema) => schema.required("Please mention drugs name you use."),
  }),
});

export type step6SchemaType = yup.InferType<typeof step6Schema>;
interface Step6Props {
  onNext: (data: any) => void;
  onBack: () => void;
  defaultValues?: step6SchemaType;
}

const StepSix = ({ onNext, onBack, defaultValues }: Step6Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      takesDrug: defaultValues?.takesDrug || "",
      whatDrugs: defaultValues?.whatDrugs || "",
      whatDrugsOther: defaultValues?.whatDrugsOther || "",
    },
    resolver: yupResolver(step6Schema),
  });

  const takesDrug = watch("takesDrug");
  const showWhatDrugs = takesDrug === "Yes";
  const whatDrugs = watch("whatDrugs");
  const showWhatDrugsOther = whatDrugs === "Other";

  return (
    <>
      <form
        id="step4Form"
        onSubmit={handleSubmit(onNext)}
        className="card divide-y pt-10 space-y-10 min-h-[200px]"
      >
        <Radio.Group
          label="Do you use recreational drugs?"
          value={takesDrug}
          {...register("takesDrug")}
          onChange={(value) => {
            console.log(value);
            setValue("takesDrug", value);
            setValue("whatDrugs", "");
            setValue("whatDrugsOther", "");
            clearErrors("takesDrug");
          }}
          error={getErrorMessage(errors?.takesDrug)}
        >
          <Box
            mt="xs"
            className="space-y-4"
          >
            <Radio
              value="Yes"
              label="Yes"
              color="dark"
              {...register("takesDrug")}
            />
            <Radio
              value="No"
              label="No"
              color="dark"
              {...register("takesDrug")}
            />
          </Box>
        </Radio.Group>

        {showWhatDrugs && (
          <div>
            <Radio.Group
              label="What drugs do you use?"
              {...register("whatDrugs")}
              value={whatDrugs}
              onChange={(value) => {
                setValue("whatDrugs", value);
                setValue("whatDrugsOther", "");
                clearErrors("whatDrugs");
              }}
              className="pt-10"
            >
              <Box
                mt="xs"
                className="space-y-3"
              >
                <Radio
                  value="Cocaine"
                  label="Cocaine"
                  color="dark"
                  {...register("whatDrugs")}
                />
                <Radio
                  value="Marijuana"
                  label="Marijuana"
                  color="dark"
                  {...register("whatDrugs")}
                />
                <Radio
                  value="Methamphetamine"
                  label="Methamphetamine"
                  color="dark"
                  {...register("whatDrugs")}
                />
                <Radio
                  value="Other"
                  label="Other"
                  color="dark"
                  {...register("whatDrugs")}
                />
              </Box>
            </Radio.Group>
            {errors?.whatDrugs?.message ? <p className="text-sm text-danger mt-2">{errors?.whatDrugs?.message}</p> : ""}
          </div>
        )}
        {showWhatDrugsOther && (
          <Input.Wrapper
            label="Please specify what drugs do you use?"
            withAsterisk
            className="pt-8"
            error={getErrorMessage(errors.whatDrugsOther)}
          >
            <Input
              type="text"
              {...register("whatDrugsOther")}
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

export default StepSix;
