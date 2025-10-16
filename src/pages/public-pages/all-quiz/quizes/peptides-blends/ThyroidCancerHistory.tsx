import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { Button, Grid, Radio, TextInput } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ThyroidCancerHistoryProps {
  onNext: (data: ThyroidCancerHistoryFormType) => void;
  onBack: () => void;
  defaultValues?: ThyroidCancerHistoryFormType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

type ThyroidCancerHistoryFormType = {
  hasThyroidCancerHistory: "Yes" | "No" | "";
  thyroidCancerType?: string;
  thyroidCancerOther?: string;
};

const subOptions = ["Medullary (disqualifier)", "Papillary", "Follicular", "Other"];

const ThyroidCancerHistory = ({ onNext, onBack, defaultValues, direction }: ThyroidCancerHistoryProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm<ThyroidCancerHistoryFormType>({
    defaultValues: {
      hasThyroidCancerHistory: defaultValues?.hasThyroidCancerHistory || "",
      thyroidCancerType: defaultValues?.thyroidCancerType || "",
      thyroidCancerOther: defaultValues?.thyroidCancerOther || "",
    },
  });

  const hasThyroidHistory = watch("hasThyroidCancerHistory");
  const selectedType = watch("thyroidCancerType");

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: ThyroidCancerHistoryFormType) => {
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
        id="ThyroidCancerHistoryForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className={`text-center text-3xl font-semibold text-foreground font-poppins ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
            Do you have a personal or family history of thyroid cancer?
          </h2>

          {/* Yes / No selection */}
          <Radio.Group
            value={hasThyroidHistory}
            onChange={(value) => {
              setValue("hasThyroidCancerHistory", value as "Yes" | "No", {
                shouldValidate: true,
              });

              if (value === "No") {
                setValue("thyroidCancerType", "");
                setValue("thyroidCancerOther", "");
              }
            }}
            className={`mt-6 {getAnimationClass("content", isExiting, isBackExiting, direction)}`}
          >
            <Grid gutter="md">
              {["Yes", "No"].map((option) => (
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
                        ${hasThyroidHistory === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                      `,
                    }}
                    label={
                      <div className="relative text-center">
                        <span className="text-foreground font-poppins">{option}</span>
                        {hasThyroidHistory === option && (
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

          {/* Show sub-options if "Yes" selected */}
          {hasThyroidHistory === "Yes" && (
            <div className="mt-6">
              <h3 className={`text-lg font-medium mt-6 mb-2 text-center ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>Please select the cancer type</h3>

              <Radio.Group
                value={selectedType}
                onChange={(value) => {
                  setValue("thyroidCancerType", value);
                  if (value !== "Other") {
                    setValue("thyroidCancerOther", "");
                  }
                }}
                classNames={{
                  error: "animate-pulseFade", // Style the error message
                }}
              >
                <Grid gutter="md">
                  {subOptions.map((option) => (
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
                            ${selectedType === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                          `,
                        }}
                        label={
                          <div className="relative text-center">
                            <span className="text-foreground font-poppins">{option}</span>
                            {selectedType === option && (
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

              {/* Show input field if "Other" selected */}
              {selectedType === "Other" && (
                <TextInput
                  label="Please specify"
                  {...register("thyroidCancerOther")}
                  placeholder="Enter other thyroid cancer type"
                  className={`mt-4 getAnimationClass("content", isExiting, isBackExiting, direction)}`}
                />
              )}
            </div>
          )}
        </div>

        <div className={`flex justify-center gap-6 pt-6 ${getAnimationClass("btns", isExiting, isBackExiting, direction)}`}>
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
            form="ThyroidCancerHistoryForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ThyroidCancerHistory;
