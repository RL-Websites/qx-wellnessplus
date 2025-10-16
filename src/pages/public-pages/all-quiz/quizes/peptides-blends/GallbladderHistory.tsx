import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { Button, Grid, Radio, Text } from "@mantine/core";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

interface GallbladderHistoryProps {
  onNext: (data: GallbladderHistoryFormType & { disqualified: boolean }) => void;
  onBack: () => void;
  defaultValues?: GallbladderHistoryFormType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

type GallbladderHistoryFormType = {
  hasGallbladderHistory: "Yes" | "No" | "";
  gallbladderDetail?: string;
};

const subOptions = ["Gallbladder removed within last 2 months (disqualifier)", "Gallbladder removed more than 2 months ago"];

const GallbladderHistory = ({ onNext, onBack, defaultValues, direction }: GallbladderHistoryProps) => {
  const {
    handleSubmit,
    setValue,
    control,
    register,
    clearErrors,
    formState: { errors },
  } = useForm<GallbladderHistoryFormType>({
    defaultValues: {
      hasGallbladderHistory: defaultValues?.hasGallbladderHistory || "",
      gallbladderDetail: defaultValues?.gallbladderDetail || "",
    },
  });

  const hasHistory = useWatch({ name: "hasGallbladderHistory", control });
  const detail = useWatch({ name: "gallbladderDetail", control });

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);
  const [isDetailErrorFading, setIsDetailErrorFading] = useState(false);
  const handleFormSubmit = (data: GallbladderHistoryFormType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      const disqualified = data.gallbladderDetail === subOptions[0];
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

  const handleHistorySelect = (value: string) => {
    if (errors.hasGallbladderHistory) {
      setIsErrorFading(true);
      setTimeout(() => {
        setValue("hasGallbladderHistory", value as "Yes" | "No", { shouldValidate: true });
        setValue("gallbladderDetail", "");
        clearErrors("hasGallbladderHistory");
        setIsErrorFading(false);
      }, 300);
    } else {
      setValue("hasGallbladderHistory", value as "Yes" | "No", { shouldValidate: true });
      setValue("gallbladderDetail", "");
    }
  };

  const handleDetailSelect = (value: string) => {
    if (errors.gallbladderDetail) {
      setIsDetailErrorFading(true);
      setTimeout(() => {
        setValue("gallbladderDetail", value, { shouldValidate: true });
        clearErrors("gallbladderDetail");
        setIsDetailErrorFading(false);
      }, 300);
    } else {
      setValue("gallbladderDetail", value, { shouldValidate: true });
    }
  };
  const [isErrorFading, setIsErrorFading] = useState(false);

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="GallbladderHistoryForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className={`text-center text-3xl font-semibold text-foreground font-poppins ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
            Do you have a personal history of gallbladder disease?
          </h2>

          {/* Step 1: Yes / No */}
          <Radio.Group
            value={hasHistory}
            onChange={handleHistorySelect}
            className={`mt-6 ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
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
                        ${hasHistory === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                      `,
                    }}
                    label={
                      <div className="relative text-center">
                        <span className="text-foreground font-poppins">{option}</span>
                        {hasHistory === option && (
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

          {errors.hasGallbladderHistory && (
            <Text className={`text-red-500 text-sm mt-5 text-center ${isErrorFading ? "error-fade-out" : "animate-pulseFade"}`}>{errors.hasGallbladderHistory.message}</Text>
          )}

          {/* Step 2: Detail selection if "Yes" */}
          {hasHistory === "Yes" && (
            <div className="mt-6">
              <h3 className={`text-lg font-medium mb-2 text-center ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>Please specify</h3>
              <Radio.Group
                value={detail}
                onChange={handleDetailSelect}
                className={`${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
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
                          error: "animate-pulseFade",
                          labelWrapper: "w-full",
                          label: `
                            block w-full h-full px-6 py-4 rounded-2xl border text-center text-base font-medium cursor-pointer
                            ${detail === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                          `,
                        }}
                        label={
                          <div className="relative text-center">
                            <span className="text-foreground font-poppins">{option}</span>
                            {detail === option && (
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
              {errors.gallbladderDetail && (
                <Text className={"text-red-500 text-sm mt-5 text-center " + (isDetailErrorFading ? "error-fade-out" : "animate-pulseFade")}>
                  {errors.gallbladderDetail.message}
                </Text>
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
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GallbladderHistory;
