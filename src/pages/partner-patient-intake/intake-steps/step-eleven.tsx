import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step11Schema = yup.object({
  gallbladder: yup.string().required("Please select at least one value."),
  removedGallbladder: yup.string().when("gallbladder", {
    is: "Yes",
    then: (schema) => schema.required("Please select at least one value."),
  }),
  whenGallbladderRemoved: yup.string().when("removedGallbladder", {
    is: "Yes",
    then: (schema) => schema.required("Please select at least one value."),
  }),
});

export type step11SchemaType = yup.InferType<typeof step11Schema>;
interface Step11Props {
  onNext: (data: any) => void;
  onBack: () => void;
  defaultValues?: step11SchemaType;
}

const StepEleven = ({ onNext, onBack, defaultValues }: Step11Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      gallbladder: defaultValues?.gallbladder || "",
      removedGallbladder: defaultValues?.removedGallbladder || "",
      whenGallbladderRemoved: defaultValues?.whenGallbladderRemoved || "",
    },
    resolver: yupResolver(step11Schema),
  });

  const gallbladder = watch("gallbladder");
  const showRemoveGallbladder = gallbladder === "Yes";
  const removedGallbladder = watch("removedGallbladder");
  const whenGallbladderRemoved = watch("whenGallbladderRemoved");
  const showWhenGallbladderRemoved = removedGallbladder === "Yes";

  return (
    <>
      <form
        id="step11Form"
        onSubmit={handleSubmit(onNext)}
        className="card divide-y pt-10 space-y-10 min-h-[200px]"
      >
        <Radio.Group
          label="Do you have a personal history of gallbladder disease?"
          value={gallbladder}
          {...register("gallbladder")}
          onChange={(value) => {
            console.log(value);
            setValue("gallbladder", value);
            setValue("removedGallbladder", "");
            setValue("whenGallbladderRemoved", "");
            clearErrors("gallbladder");
          }}
          error={getErrorMessage(errors?.gallbladder)}
        >
          <Box
            mt="xs"
            className="space-y-4"
          >
            <Radio
              value="Yes"
              label="Yes"
              color="dark"
              {...register("gallbladder")}
            />
            <Radio
              value="No"
              label="No"
              color="dark"
              {...register("gallbladder")}
            />
          </Box>
        </Radio.Group>

        {showRemoveGallbladder && (
          <div>
            <Radio.Group
              label="Did you have your gallbladder removed?"
              {...register("removedGallbladder")}
              value={removedGallbladder}
              onChange={(value) => {
                setValue("removedGallbladder", value);
                setValue("whenGallbladderRemoved", "");
                clearErrors("removedGallbladder");
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
                  {...register("removedGallbladder")}
                />
                <Radio
                  value="No"
                  label="No"
                  color="dark"
                  {...register("removedGallbladder")}
                />
              </Box>
            </Radio.Group>
            {errors?.removedGallbladder?.message ? <p className="text-sm text-danger mt-2">{errors?.removedGallbladder?.message}</p> : ""}
          </div>
        )}
        {showWhenGallbladderRemoved && (
          <div>
            <Radio.Group
              label="When did you have your gallbladder removed?"
              {...register("whenGallbladderRemoved")}
              value={whenGallbladderRemoved}
              onChange={(value) => {
                setValue("whenGallbladderRemoved", value);
                if (value) {
                  clearErrors("whenGallbladderRemoved");
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
                  {...register("whenGallbladderRemoved")}
                />
                <Radio
                  value="More than 2 months ago"
                  label="More than 2 months ago"
                  color="dark"
                  {...register("whenGallbladderRemoved")}
                />
              </Box>
            </Radio.Group>
            {errors?.whenGallbladderRemoved?.message ? <p className="text-sm text-danger mt-2">{errors?.whenGallbladderRemoved?.message}</p> : ""}
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
            form="step11Form"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default StepEleven;
