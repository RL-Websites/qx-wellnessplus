import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step13Schema = yup.object({
  endocrineNeoplasia: yup.string().required("Please select at least one value."),
});

export type step13SchemaType = yup.InferType<typeof step13Schema>;
interface Step13Props {
  onNext: (data: any) => void;
  onBack: () => void;
  defaultValues?: step13SchemaType;
}

const StepThirteen = ({ onNext, onBack, defaultValues }: Step13Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      endocrineNeoplasia: defaultValues?.endocrineNeoplasia || "",
    },
    resolver: yupResolver(step13Schema),
  });

  const endocrineNeoplasia = watch("endocrineNeoplasia");

  return (
    <>
      <form
        id="step13Form"
        onSubmit={handleSubmit(onNext)}
        className="card divide-y pt-10 space-y-10 min-h-[200px]"
      >
        <Radio.Group
          label="Do you have a personal or family history of multiple endocrine neoplasia?"
          value={endocrineNeoplasia}
          {...register("endocrineNeoplasia")}
          onChange={(value) => {
            console.log(value);
            setValue("endocrineNeoplasia", value);
            clearErrors("endocrineNeoplasia");
          }}
          error={getErrorMessage(errors?.endocrineNeoplasia)}
        >
          <Box
            mt="xs"
            className="space-y-4"
          >
            <Radio
              value="Yes"
              label="Yes"
              color="dark"
              {...register("endocrineNeoplasia")}
            />
            <Radio
              value="No"
              label="No"
              color="dark"
              {...register("endocrineNeoplasia")}
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
            form="step13Form"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default StepThirteen;
