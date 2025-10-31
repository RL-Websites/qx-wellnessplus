import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Radio, TextInput } from "@mantine/core";
import { useState } from "react";
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
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
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

const PrimaryGoalForPeptidesTherapy = ({ onNext, onBack, defaultValues, direction }: IPrimaryGoalForPeptidesTherapyProps) => {
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

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: PrimaryGoalForPeptidesTherapySchemaType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      onNext(data);
      setIsExiting(false);
    }, animationDelay); // ✅ Matches animation duration (400ms + 100ms delay)
  };

  const handleBackClick = () => {
    setIsBackExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      setIsBackExiting(false);
      onBack();
    }, animationDelay);
  };
  const [isErrorFading, setIsErrorFading] = useState(false);

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="PrimaryGoalForPeptidesTherapyForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className={`text-center text-3xl font-semibold text-foreground font-poppins ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
            What is your primary goal for peptide therapy?
          </h2>

          <Radio.Group
            value={selected}
            onChange={(value) =>
              setValue("PrimaryGoalForPeptidesTherapy", value, {
                shouldValidate: true,
              })
            }
            className={`mt-6 ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
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
              className={`mt-4 ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
            />
          )}

          {errors.PrimaryGoalForPeptidesTherapy && <div className="text-danger text-sm mt-2 text-center animate-pulseFade">{errors.PrimaryGoalForPeptidesTherapy.message}</div>}
        </div>

        <div className={`flex justify-center gap-6 pt-4 ${getAnimationClass("btns", isExiting, isBackExiting, direction)}`}>
          <Button
            variant="outline"
            className="w-[200px] animated-btn"
            onClick={handleBackClick}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="w-[200px] animated-btn"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PrimaryGoalForPeptidesTherapy;
