import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Checkbox, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step16Schema = yup.object({
  diabeticStatus: yup.string().required("Please select at least one value."),
  takeDiabeticDrugName: yup.string().when("diabeticStatus", {
    is: "Yes",
    then: (schema) => schema.required("Please select what drugs do you use?"),
  }),
  takeDiabeticHemoglobin: yup.string().when("diabeticStatus", {
    is: "Yes",
    then: (schema) => schema.required("Please mention drugs name you use."),
  }),
});

export type step16SchemaType = yup.InferType<typeof step16Schema>;
interface Step6Props {
  onNext: (data: any) => void;
  onBack: () => void;
  defaultValues?: step16SchemaType;
}

const StepSixteen = ({ onNext, onBack, defaultValues }: Step6Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      diabeticStatus: defaultValues?.diabeticStatus || "",
      takeDiabeticDrugName: defaultValues?.takeDiabeticDrugName || "",
      takeDiabeticHemoglobin: defaultValues?.takeDiabeticHemoglobin || "",
    },
    resolver: yupResolver(step16Schema),
  });

  const diabeticStatus = watch("diabeticStatus");
  const showWhatDrugs = diabeticStatus === "Yes";
  const takeDiabeticDrugName = watch("takeDiabeticDrugName");

  return (
    <>
      <form
        id="step4Form"
        onSubmit={handleSubmit(onNext)}
        className="card divide-y pt-10 space-y-10 min-h-[200px]"
      >
        <Radio.Group
          label="Are you pre-diabetic or diabetic? "
          value={diabeticStatus}
          {...register("diabeticStatus")}
          onChange={(value) => {
            setValue("diabeticStatus", value);
            setValue("takeDiabeticDrugName", "");
            setValue("takeDiabeticHemoglobin", "");
            clearErrors("diabeticStatus");
          }}
          error={getErrorMessage(errors?.diabeticStatus)}
        >
          <Box
            mt="xs"
            className="space-y-4"
          >
            <Radio
              value="Yes"
              label="Yes"
              color="dark"
              {...register("diabeticStatus")}
            />
            <Radio
              value="No"
              label="No"
              color="dark"
              {...register("diabeticStatus")}
            />
          </Box>
        </Radio.Group>

        {showWhatDrugs && (
          <Checkbox.Group
            label="Are you currently taking any of the following medications? Select all that apply"
            value={takeDiabeticDrugName ? takeDiabeticDrugName?.split(", ") || [] : []}
            error={getErrorMessage(errors?.takeDiabeticDrugName)}
            onChange={(valueArray) => {
              const valueString = valueArray.join(", ");
              setValue("takeDiabeticDrugName", valueString);
              clearErrors("takeDiabeticDrugName");
            }}
            className="pt-6"
          >
            <Box
              mt="xs"
              className="space-y-3"
            >
              {["Insulin", "GLP-1 receptor agonists", " Sulfonylureas", "None of the above"].map((option) => (
                <Checkbox
                  key={option}
                  value={option}
                  label={option}
                  color="dark"
                />
              ))}
            </Box>
          </Checkbox.Group>
        )}
        {showWhatDrugs && (
          <Radio.Group
            label="What is your hemoglobin A1C?"
            className="pt-8"
            value={watch("takeDiabeticHemoglobin")}
            onChange={(value) => {
              setValue("takeDiabeticHemoglobin", value);
              clearErrors("takeDiabeticHemoglobin");
            }}
            error={getErrorMessage(errors?.takeDiabeticHemoglobin)}
          >
            <Box
              mt="xs"
              className="space-y-4"
            >
              {["Below 5.7% (Normal)", "5.7-6.4% (Prediabetes)", "Above 6.5% (Diabetes)", "Unknown"].map((option) => (
                <Radio
                  key={option}
                  value={option}
                  label={option}
                  color="dark"
                />
              ))}
            </Box>
          </Radio.Group>
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

export default StepSixteen;
