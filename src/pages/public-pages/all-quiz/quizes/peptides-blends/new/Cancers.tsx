import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const cancersSchema = yup.object({
  cancers: yup.string().required("Please select an option."),
});

export type CancersSchemaType = yup.InferType<typeof cancersSchema>;

interface ICancersProps {
  onNext: (data: CancersSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: CancersSchemaType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const Cancers = ({ onNext, onBack, defaultValues, direction }: ICancersProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<CancersSchemaType>({
    defaultValues: {
      cancers: defaultValues?.cancers || "",
    },
    resolver: yupResolver(cancersSchema),
  });

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const cancers = watch("cancers");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("cancers", value, { shouldValidate: true });
    clearErrors("cancers");
  };

  const handleFormSubmit = (data: CancersSchemaType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      onNext({ ...data, eligible: data.cancers === "Yes" });
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
        id="cancersForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className={`text-center text-3xl font-poppins font-semibold text-foreground ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
            Do you have a history of breast, ovarian, or other hormone-sensitive cancers?
          </h2>

          <Radio.Group
            value={cancers}
            onChange={handleSelect}
            className={`mt-6 w-full ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
          >
            <div className="grid md:grid-cols-2  w-full gap-5">
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(cancers, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {cancers === option && (
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

          {errors.cancers && <Text className="text-red-500 text-sm mt-5 text-center animation-pulseFade">{errors.cancers.message}</Text>}
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
            form="cancersForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Cancers;
