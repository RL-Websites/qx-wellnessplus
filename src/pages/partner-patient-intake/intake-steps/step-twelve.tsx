import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step12Schema = yup.object({
  pancreatitis: yup.string().required("Please select at least one value."),
  gallstones: yup.string().when("pancreatitis", {
    is: "Yes",
    then: (schema) => schema.required("Please select at least one value."),
  }),
  removedGallbladderGallstones: yup.string().when("gallstones", {
    is: "Yes",
    then: (schema) => schema.required("Please select at least one value."),
  }),
});

export type step12SchemaType = yup.InferType<typeof step12Schema>;
interface Step12Props {
  onNext: (data: any) => void;
  onBack: () => void;
  defaultValues?: step12SchemaType;
}

const StepTwelve = ({ onNext, onBack, defaultValues }: Step12Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      pancreatitis: defaultValues?.pancreatitis || "",
      gallstones: defaultValues?.gallstones || "",
      removedGallbladderGallstones: defaultValues?.removedGallbladderGallstones || "",
    },
    resolver: yupResolver(step12Schema),
  });

  const pancreatitis = watch("pancreatitis");
  const showRemoveDueGallstones = pancreatitis === "Yes";
  const gallstones = watch("gallstones");
  const showWhenRemoveDueGallstones = gallstones === "Yes";
  const removedGallbladderGallstones = watch("removedGallbladderGallstones");

  return (
    <>
      <form
        id="step12Form"
        onSubmit={handleSubmit(onNext)}
        className="card divide-y pt-10 space-y-10 min-h-[200px]"
      >
        <Radio.Group
          label="Do you have a personal history of acute or chronic pancreatitis?"
          value={pancreatitis}
          {...register("pancreatitis")}
          onChange={(value) => {
            console.log(value);
            setValue("pancreatitis", value);
            setValue("gallstones", "");
            setValue("removedGallbladderGallstones", "");
            clearErrors("pancreatitis");
          }}
          error={getErrorMessage(errors?.pancreatitis)}
        >
          <Box
            mt="xs"
            className="space-y-4"
          >
            <Radio
              value="Yes"
              label="Yes"
              color="dark"
              {...register("pancreatitis")}
            />
            <Radio
              value="No"
              label="No"
              color="dark"
              {...register("pancreatitis")}
            />
          </Box>
        </Radio.Group>

        {showRemoveDueGallstones && (
          <div>
            <Radio.Group
              label="Did you have your gallbladder removed due to pancreatitis from gallstones?"
              {...register("gallstones")}
              value={gallstones}
              onChange={(value) => {
                setValue("gallstones", value);
                setValue("removedGallbladderGallstones", "");
                clearErrors("gallstones");
              }}
              className="pt-8"
            >
              <Box
                mt="xs"
                className="space-y-3"
              >
                <Radio
                  value="Yes"
                  label="Yes"
                  color="dark"
                  {...register("gallstones")}
                />
                <Radio
                  value="No"
                  label="No"
                  color="dark"
                  {...register("gallstones")}
                />
              </Box>
            </Radio.Group>
            {errors?.gallstones?.message ? <p className="text-sm text-danger mt-2">{errors?.gallstones?.message}</p> : ""}
          </div>
        )}
        {showWhenRemoveDueGallstones && (
          <div>
            <Radio.Group
              label="When did you have your gallbladder removed?"
              {...register("removedGallbladderGallstones")}
              value={removedGallbladderGallstones}
              onChange={(value) => {
                setValue("removedGallbladderGallstones", value);
                if (value) {
                  clearErrors("removedGallbladderGallstones");
                }
              }}
              className="pt-8"
            >
              <Box
                mt="xs"
                className="space-y-3"
              >
                <Radio
                  value="Within the last 2 months"
                  label="Within the last 2 months"
                  color="dark"
                  {...register("removedGallbladderGallstones")}
                />
                <Radio
                  value="More than 2 months ago"
                  label="More than 2 months ago"
                  color="dark"
                  {...register("removedGallbladderGallstones")}
                />
              </Box>
            </Radio.Group>
            {errors?.removedGallbladderGallstones?.message ? <p className="text-sm text-danger mt-2">{errors?.removedGallbladderGallstones?.message}</p> : ""}
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
            form="step12Form"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default StepTwelve;
