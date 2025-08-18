import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Radio, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface IPhysicalActivityLevelProps {
  onNext: (data: PhysicalActivityFormType) => void;
  onBack: () => void;
  defaultValues?: PhysicalActivityFormType;
}

const options = ["Sedentary", "Lightly active", "Moderately active", "Very active", "Super active", "Other"];

const schema = yup.object({
  activityLevel: yup.string().required("Please select your physical activity level."),
  customActivity: yup.string().when("activityLevel", {
    is: "Other",
    then: (schema) => schema.required("Please describe your activity level."),
    otherwise: (schema) => schema.notRequired(),
  }),
});

type PhysicalActivityFormType = yup.InferType<typeof schema>;

const PhysicalActivityLevel = ({ onNext, onBack, defaultValues }: IPhysicalActivityLevelProps) => {
  const {
    handleSubmit,
    setValue,
    register,
    watch,
    formState: { errors },
  } = useForm<PhysicalActivityFormType>({
    defaultValues: {
      activityLevel: defaultValues?.activityLevel || "",
      customActivity: defaultValues?.customActivity || "",
    },
    resolver: yupResolver(schema),
  });

  const selected = watch("activityLevel");

  const onSubmit = (data: PhysicalActivityFormType) => {
    onNext(data);
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="PhysicalActivityLevelForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-semibold text-foreground font-poppins">What is your typical physical activity level?</h2>

          <Radio.Group
            value={selected}
            onChange={(value) => setValue("activityLevel", value, { shouldValidate: true })}
            className="mt-6"
          >
            <Grid gutter="md">
              {options.map((option) => (
                <Grid.Col
                  span={12}
                  key={option}
                >
                  <Radio
                    value={option}
                    classNames={{
                      root: "relative w-full",
                      radio: "hidden",
                      inner: "hidden",
                      labelWrapper: "w-full",
                      label: `
                        block w-full h-full px-6 py-4 rounded-2xl border text-center text-base font-medium cursor-pointer
                        ${selected === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                      `,
                    }}
                    label={
                      <div className="relative text-center">
                        <span className="text-foreground font-poppins">{option}</span>
                        {selected === option && (
                          <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 right-0  -translate-y-1/2">
                            <i className="icon-tick text-sm/none"></i>
                          </span>
                        )}
                      </div>
                    }
                  />
                </Grid.Col>
              ))}
            </Grid>
          </Radio.Group>

          {selected === "Other" && (
            <TextInput
              {...register("customActivity")}
              placeholder="Describe your activity level"
              error={errors.customActivity?.message}
              className="mt-4"
            />
          )}

          {errors.activityLevel && <div className="text-danger text-sm mt-2 text-center">{errors.activityLevel.message}</div>}
        </div>

        <div className="flex justify-center gap-6 pt-4">
          <Button
            variant="outline"
            className="w-[200px]"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="w-[200px]"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PhysicalActivityLevel;
