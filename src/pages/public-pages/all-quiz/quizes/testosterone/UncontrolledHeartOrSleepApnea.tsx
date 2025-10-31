import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const uncontrolledHeartOrSleepApneaSchema = yup.object({
  heartOrSleepApnea: yup.string().required("Please select an option."),
});

export type UncontrolledHeartOrSleepApneaSchemaType = yup.InferType<typeof uncontrolledHeartOrSleepApneaSchema>;

interface IUncontrolledHeartOrSleepApneaProps {
  onNext: (data: UncontrolledHeartOrSleepApneaSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: UncontrolledHeartOrSleepApneaSchemaType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const UncontrolledHeartOrSleepApnea = ({ onNext, onBack, defaultValues, direction }: IUncontrolledHeartOrSleepApneaProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<UncontrolledHeartOrSleepApneaSchemaType>({
    defaultValues: {
      heartOrSleepApnea: defaultValues?.heartOrSleepApnea || "",
    },
    resolver: yupResolver(uncontrolledHeartOrSleepApneaSchema),
  });

  const heartOrSleepApnea = watch("heartOrSleepApnea");
  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    if (errors.heartOrSleepApnea) {
      setIsErrorFading(true);
      setTimeout(() => {
        setValue("heartOrSleepApnea", value, { shouldValidate: true });
        clearErrors("heartOrSleepApnea");
        setIsErrorFading(false);
      }, 300);
    } else {
      setValue("heartOrSleepApnea", value, { shouldValidate: true });
    }
  };

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: UncontrolledHeartOrSleepApneaSchemaType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      setIsExiting(false);
      onNext({ ...data, eligible: data.heartOrSleepApnea === "No" });
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
        id="uncontrolledHeartOrSleepApneaForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className={`text-center text-3xl font-poppins font-semibold text-foreground ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
            Have you been diagnosed with uncontrolled heart disease or severe sleep apnea?
          </h2>

          <Radio.Group
            value={heartOrSleepApnea}
            onChange={handleSelect}
            className={`mt-6 w-full ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
          >
            <div className="grid md:grid-cols-2 gap-5 w-full">
              {options.map((option) => (
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
                      ${heartOrSleepApnea === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                    `,
                  }}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {heartOrSleepApnea === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                          <i className="icon-tick text-sm/none"></i>
                        </span>
                      )}
                    </div>
                  }
                />
              ))}
            </div>
          </Radio.Group>

          {errors.heartOrSleepApnea && (
            <Text className={`text-red-500 text-sm mt-5 text-center ${isErrorFading ? "error-fade-out" : "animate-pulseFade"}`}>{errors.heartOrSleepApnea.message}</Text>
          )}
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
            form="uncontrolledHeartOrSleepApneaForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UncontrolledHeartOrSleepApnea;
