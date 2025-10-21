import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Radio } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface AlcoholConsumptionProps {
  onNext: (data: AlcoholFormType) => void;
  onBack: () => void;
  defaultValues?: AlcoholFormType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const alcoholOptions = ["3+ drinks per day", "1–2 drinks per day", "3–5 drinks per week", "1–2 drinks per week", "None"];

const schema = yup.object({
  alcohol: yup.string().required("Please select your alcohol consumption level."),
});

type AlcoholFormType = yup.InferType<typeof schema>;

const AlcoholConsumption = ({ onNext, onBack, defaultValues, direction }: AlcoholConsumptionProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AlcoholFormType>({
    defaultValues: {
      alcohol: defaultValues?.alcohol || "",
    },
    resolver: yupResolver(schema),
  });

  const selected = watch("alcohol");

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: AlcoholFormType) => {
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
        id="AlcoholConsumptionForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className={`text-center text-3xl font-semibold text-foreground font-poppins ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
            How much alcohol do you drink?
          </h2>

          <Radio.Group
            value={selected}
            onChange={(value) => setValue("alcohol", value, { shouldValidate: true })}
            className={`mt-6 ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
          >
            <Grid gutter="md">
              {alcoholOptions.map((option) => (
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

          {errors.alcohol && <div className={`text-danger text-sm mt-2 text-center ${isErrorFading ? "error-fade-out" : "animate-pulseFade"}`}>{errors.alcohol.message}</div>}
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

export default AlcoholConsumption;
