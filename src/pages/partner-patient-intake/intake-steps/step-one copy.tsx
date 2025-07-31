import { getErrorMessage } from "@/utils/helper.utils";
import { Button, Group, Input, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import { stepSchemaType } from "../validationSchema";

interface StepOneProps {
  onNext: (data: stepSchemaType) => void;
  defaultValues?: stepSchemaType;
}

const StepOne = ({ onNext, defaultValues }: StepOneProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<stepSchemaType>({
    defaultValues: {
      familyHistory: defaultValues?.familyHistory || "no",
      thyroidType: defaultValues?.thyroidType || "",
      hasReport: defaultValues?.hasReport || "",
      reportFile: defaultValues?.reportFile || "",
    },
  });

  const familyHistory = watch("familyHistory");
  const thyroidType = watch("thyroidType");
  const hasReport = watch("hasReport");

  const showThyroidType = familyHistory === "yes";
  const showReportQuestion = thyroidType === "papillary";
  const showUploadField = hasReport === "yes";

  return (
    <>
      <form
        id="stepOneForm"
        onSubmit={handleSubmit(onNext)}
        className="card divide-y pt-10 space-y-10 min-h-[200px]"
      >
        <Radio.Group
          name="familyHistory"
          value={familyHistory}
          onChange={(value) => {
            setValue("familyHistory", value);
            clearErrors("familyHistory");
          }}
          label="15. Do you have a personal or family history of thyroid cancer?"
          error={getErrorMessage(errors?.familyHistory)}
        >
          <Group mt="xs">
            <Radio
              value="yes"
              label="Yes"
              color="dark"
              {...register("familyHistory")}
            />
            <Radio
              value="no"
              label="No"
              color="dark"
              {...register("familyHistory")}
            />
          </Group>
        </Radio.Group>

        {showThyroidType && (
          <Radio.Group
            name="thyroidType"
            value={thyroidType}
            onChange={(value) => {
              setValue("thyroidType", value);
              clearErrors("thyroidType");
            }}
            label="15.1 What type of thyroid cancer?"
            className="pt-10"
            error={getErrorMessage(errors?.thyroidType)}
          >
            <div className="space-y-3 mt-2">
              <Radio
                value="medullary"
                label="Medullary"
              />
              <Radio
                value="papillary"
                label="Papillary"
                color="dark"
              />
              <Radio
                value="follicular"
                label="Follicular"
                color="dark"
              />
              <Radio
                value="other"
                label="Other"
                color="dark"
              />
            </div>
          </Radio.Group>
        )}

        {showReportQuestion && (
          <Radio.Group
            name="hasReport"
            value={hasReport}
            onChange={(value) => {
              setValue("hasReport", value);
              clearErrors("hasReport");
            }}
            label="15.1.1 Do you have your pathology report?"
            className="pt-10"
            error={getErrorMessage(errors?.hasReport)}
          >
            <Group mt="xs">
              <Radio
                value="yes"
                label="Yes"
                color="dark"
              />
              <Radio
                value="no"
                label="No"
                color="dark"
              />
            </Group>
          </Radio.Group>
        )}

        {showUploadField && (
          <Input.Wrapper
            className="pt-10"
            label="15.1.1.1 Upload your pathology report"
            withAsterisk
            error={getErrorMessage(errors.reportFile)}
          >
            <Input
              {...register("reportFile")}
              error={getErrorMessage(errors.reportFile?.message)}
              type="text"
            />
          </Input.Wrapper>
        )}
      </form>
      <div className="flex justify-between mt-6">
        <div className="flex gap-3 ms-auto">
          <Button
            type="submit"
            form="stepOneForm"
            w={256}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default StepOne;
