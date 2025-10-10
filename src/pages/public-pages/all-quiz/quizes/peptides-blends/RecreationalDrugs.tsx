import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Radio, TextInput } from "@mantine/core";
import { useState } from "react";
import { get, useForm } from "react-hook-form";
import * as yup from "yup";

interface IRecreationalDrugsProps {
  onNext: (data: RecreationalDrugsFormType & { disqualified: boolean }) => void;
  onBack: () => void;
  defaultValues?: RecreationalDrugsFormType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const initialOptions = ["Yes", "No"];

const followupOptions = ["Cocaine (disqualifier)", "Marijuana", "Methamphetamine (disqualifier)", "Other"];

const schema = yup.object({
  usesDrugs: yup.string().required("Please select Yes or No."),
  drugType: yup.string().when("usesDrugs", {
    is: "Yes",
    then: (schema) => schema.required("Please select a substance."),
    otherwise: (schema) => schema.notRequired(),
  }),
  customDrug: yup.string().when("drugType", {
    is: "Other",
    then: (schema) => schema.required("Please specify the substance."),
    otherwise: (schema) => schema.notRequired(),
  }),
});

type RecreationalDrugsFormType = yup.InferType<typeof schema>;

const RecreationalDrugs = ({ onNext, onBack, defaultValues, direction }: IRecreationalDrugsProps) => {
  const {
    handleSubmit,
    setValue,
    register,
    watch,
    formState: { errors },
  } = useForm<RecreationalDrugsFormType>({
    defaultValues: {
      usesDrugs: defaultValues?.usesDrugs || "",
      drugType: defaultValues?.drugType || "",
      customDrug: defaultValues?.customDrug || "",
    },
    resolver: yupResolver(schema),
  });

  const usesDrugs = watch("usesDrugs");
  const drugType = watch("drugType");
  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: RecreationalDrugsFormType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      const disqualified = data.drugType === "Cocaine (disqualifier)" || data.drugType === "Methamphetamine (disqualifier)";
      onNext({ ...data, disqualified });
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

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="RecreationalDrugsForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className={`text-center text-3xl font-semibold text-foreground font-poppins ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
            Do you use recreational drugs?
          </h2>

          {/* Step 1: Yes / No */}
          <Radio.Group
            value={usesDrugs}
            onChange={(value) => {
              setValue("usesDrugs", value, { shouldValidate: true });
              setValue("drugType", ""); // Reset sub-selection
              setValue("customDrug", ""); // Reset custom input
            }}
            className={`mt-6 ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
          >
            <Grid gutter="md">
              {initialOptions.map((option) => (
                <Grid.Col
                  span={6}
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
                        ${usesDrugs === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                      `,
                    }}
                    label={
                      <div className="relative text-center">
                        <span className="text-foreground font-poppins">{option}</span>
                        {usesDrugs === option && (
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

          {errors.usesDrugs && <div className="text-danger text-sm mt-2 text-center animate-pulseFade">{errors.usesDrugs.message}</div>}
        </div>

        {/* Step 2: Substance detail if "Yes" selected */}
        {usesDrugs === "Yes" && (
          <div>
            <h3 className={`text-lg font-medium mt-6 mb-2 text-center ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>Which substances?</h3>

            <Radio.Group
              value={drugType}
              onChange={(value) => {
                setValue("drugType", value, { shouldValidate: true });
                if (value !== "Other") setValue("customDrug", "");
              }}
              className={`${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
            >
              <Grid gutter="md">
                {followupOptions.map((option) => (
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
                          ${drugType === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                        `,
                      }}
                      label={
                        <div className="relative text-center">
                          <span className="text-foreground font-poppins">{option}</span>
                          {drugType === option && (
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

            {errors.drugType && <div className="text-danger text-sm mt-2 text-center animate-pulseFade">{errors.drugType.message}</div>}

            {drugType === "Other" && (
              <TextInput
                {...register("customDrug")}
                placeholder="Please specify the substance"
                error={errors.customDrug?.message}
                className={`mt-4 ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
              />
            )}
          </div>
        )}

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

export default RecreationalDrugs;
