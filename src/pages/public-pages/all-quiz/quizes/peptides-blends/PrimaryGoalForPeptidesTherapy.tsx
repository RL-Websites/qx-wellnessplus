import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Radio, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const PrimaryGoalForPeptidesTherapySchema = yup.object({
  PrimaryGoalForPeptidesTherapy: yup.string().required("Please select your primary goal."),
  PrimaryGoalForPeptidesTherapyOther: yup.string().when("PrimaryGoalForPeptidesTherapy", {
    is: "Other",
    then: (schema) => schema.required("Please specify your goal."),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export type PrimaryGoalForPeptidesTherapySchemaType = yup.InferType<typeof PrimaryGoalForPeptidesTherapySchema>;

interface IPrimaryGoalForPeptidesTherapyProps {
  onNext: (data: PrimaryGoalForPeptidesTherapySchemaType) => void;
  onBack: () => void;
  defaultValues?: PrimaryGoalForPeptidesTherapySchemaType;
}

const options = [
  "Improve overall health",
  "Sleep improvement",
  "Recovery from injury/training",
  "Skin & hair health",
  "Energy & vitality",
  "Muscle gain / strength improvement",
  "Fat loss / body composition improvement",
  "Anti-aging / longevity",
  "Hormone balance",
  "Other",
];

const PrimaryGoalForPeptidesTherapy = ({ onNext, onBack, defaultValues }: IPrimaryGoalForPeptidesTherapyProps) => {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PrimaryGoalForPeptidesTherapySchemaType>({
    defaultValues: {
      PrimaryGoalForPeptidesTherapy: defaultValues?.PrimaryGoalForPeptidesTherapy || "",
      PrimaryGoalForPeptidesTherapyOther: defaultValues?.PrimaryGoalForPeptidesTherapyOther || "",
    },
    resolver: yupResolver(PrimaryGoalForPeptidesTherapySchema),
  });

  const selected = watch("PrimaryGoalForPeptidesTherapy");

  const onSubmit = (data: PrimaryGoalForPeptidesTherapySchemaType) => {
    onNext(data);
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="PrimaryGoalForPeptidesTherapyForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-semibold text-foreground font-poppins">What is your primary goal for peptide therapy?</h2>

          <Radio.Group
            value={selected}
            onChange={(value) =>
              setValue("PrimaryGoalForPeptidesTherapy", value, {
                shouldValidate: true,
              })
            }
            className="mt-6"
          >
            <Grid gutter="md">
              {options.map((option) => (
                <Grid.Col
                  span={12}
                  key={option}
                >
                  <Radio
                    key={option}
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
                          <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
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
              label="Please specify"
              placeholder="Enter your goal"
              {...register("PrimaryGoalForPeptidesTherapyOther")}
              error={errors.PrimaryGoalForPeptidesTherapyOther?.message}
              className="mt-4"
            />
          )}

          {errors.PrimaryGoalForPeptidesTherapy && <div className="text-danger text-sm mt-2 text-center">{errors.PrimaryGoalForPeptidesTherapy.message}</div>}
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

export default PrimaryGoalForPeptidesTherapy;
