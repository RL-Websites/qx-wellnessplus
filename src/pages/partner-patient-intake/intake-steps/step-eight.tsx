import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step8Schema = yup.object({
  medicalCondition: yup.string().required("Please select at least one value."),
  cardioVascularDisease: yup.string().when("medicalCondition", {
    is: "Cardiovascular Disease",
    then: (schema) => schema.required("Please select if you have any cardiovascular disease."),
  }),
  highCholesterol: yup.string().when("cardioVascularDisease", {
    is: "High cholesterol",
    then: (schema) => schema.required("Please select if you have high cholesterol."),
  }),
});

export type step8SchemaType = yup.InferType<typeof step8Schema>;
interface Step8Props {
  onNext: (data: any) => void;
  onBack: () => void;
  defaultValues?: step8SchemaType;
}

const StepEight = ({ onNext, onBack, defaultValues }: Step8Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      medicalCondition: defaultValues?.medicalCondition || "",
      cardioVascularDisease: defaultValues?.cardioVascularDisease || "",
      highCholesterol: defaultValues?.highCholesterol || "",
    },
    resolver: yupResolver(step8Schema),
  });

  const medicalCondition = watch("medicalCondition");
  const showCardioVascularDisease = medicalCondition === "Cardiovascular Disease";
  const cardioVascularDisease = watch("cardioVascularDisease");
  const showHighCholesterol = cardioVascularDisease === "High cholesterol";
  const highCholesterol = watch("highCholesterol");

  return (
    <>
      <form
        id="step8Form"
        onSubmit={handleSubmit(onNext)}
        className="card divide-y pt-10 space-y-10 min-h-[200px]"
      >
        <Radio.Group
          label="Do you suffer from any of these medical conditions?"
          value={medicalCondition}
          {...register("medicalCondition")}
          onChange={(value) => {
            console.log(value);
            setValue("medicalCondition", value);
            setValue("cardioVascularDisease", "");
            setValue("highCholesterol", "");
            clearErrors("medicalCondition");
          }}
          error={getErrorMessage(errors?.medicalCondition)}
        >
          <Box
            mt="xs"
            className="space-y-4"
          >
            <Radio
              value="Cardiovascular Disease"
              label="Cardiovascular Disease"
              color="dark"
              {...register("medicalCondition")}
            />
            <Radio
              value="Fatty liver disease"
              label="Fatty liver disease"
              color="dark"
              {...register("medicalCondition")}
            />
            <Radio
              value="Polycystic ovarian syndrome"
              label="Polycystic ovarian syndrome"
              color="dark"
              {...register("medicalCondition")}
            />
            <Radio
              value="None of the above"
              label="None of the above"
              color="dark"
              {...register("medicalCondition")}
            />
          </Box>
        </Radio.Group>

        {showCardioVascularDisease && (
          <div>
            <Radio.Group
              label="Select all the conditions that apply to you."
              value={cardioVascularDisease}
              {...register("cardioVascularDisease")}
              onChange={(value) => {
                setValue("cardioVascularDisease", value);
                setValue("highCholesterol", "");
                clearErrors("cardioVascularDisease");
              }}
              className="pt-10"
            >
              <Box
                mt="xs"
                className="space-y-3"
              >
                <Radio
                  value="Atherosclerosis"
                  label="Atherosclerosis"
                  color="dark"
                  {...register("cardioVascularDisease")}
                />
                <Radio
                  value="Atrial fibrillation"
                  label="Atrial fibrillation"
                  color="dark"
                  {...register("cardioVascularDisease")}
                />
                <Radio
                  value="Arrhythmia"
                  label="Arrhythmia"
                  color="dark"
                  {...register("cardioVascularDisease")}
                />
                <Radio
                  value="History of MI"
                  label="History of MI"
                  color="dark"
                  {...register("cardioVascularDisease")}
                />
                <Radio
                  value="Stents"
                  label="Stents"
                  color="dark"
                  {...register("cardioVascularDisease")}
                />
                <Radio
                  value="CABG"
                  label="CABG"
                  color="dark"
                  {...register("cardioVascularDisease")}
                />
                <Radio
                  value="High cholesterol"
                  label="High cholesterol"
                  color="dark"
                  {...register("cardioVascularDisease")}
                />
                <Radio
                  value="None of the above"
                  label="None of the above"
                  color="dark"
                  {...register("cardioVascularDisease")}
                />
              </Box>
            </Radio.Group>
            {errors?.cardioVascularDisease?.message ? <p className="text-sm text-danger mt-2">{errors?.cardioVascularDisease?.message}</p> : ""}
          </div>
        )}
        {showHighCholesterol && (
          <div>
            <Radio.Group
              label="Do you have cholesterol greater than 240 or are you on a cholesterol medication?"
              {...register("highCholesterol")}
              value={highCholesterol}
              onChange={(value) => {
                setValue("highCholesterol", value);
                clearErrors("highCholesterol");
              }}
              className="pt-10"
            >
              <Box
                mt="xs"
                className="space-y-3"
              >
                <Radio
                  value="On medication"
                  label="On medication"
                  color="dark"
                  {...register("highCholesterol")}
                />
                <Radio
                  value="Greater than 240 without medication"
                  label="Greater than 240 without medication"
                  color="dark"
                  {...register("highCholesterol")}
                />
                <Radio
                  value="Neither"
                  label="Neither"
                  color="dark"
                  {...register("highCholesterol")}
                />
              </Box>
            </Radio.Group>
            {errors?.highCholesterol?.message ? <p className="text-sm text-danger mt-2">{errors?.highCholesterol?.message}</p> : ""}
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
            form="step8Form"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default StepEight;
