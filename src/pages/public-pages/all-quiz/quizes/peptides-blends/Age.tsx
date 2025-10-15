import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const ageSchema = yup.object({
  age: yup.string().required("Please add your age"),
});

export type ageSchemaType = yup.InferType<typeof ageSchema>;

interface IAgeProps {
  onNext: (data: ageSchemaType) => void;
  onBack: () => void;
  defaultValues?: ageSchemaType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const Age = ({ onNext, onBack, defaultValues, direction }: IAgeProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<ageSchemaType>({
    defaultValues: {
      age: defaultValues?.age || "",
    },
    resolver: yupResolver(ageSchema),
  });

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);
  const [isErrorFading, setIsErrorFading] = useState(false);

  const handleFormSubmit = (data: ageSchemaType) => {
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

  const age = watch("age");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("age", value, { shouldValidate: true });
    clearErrors("age");
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errors.age) {
      setIsErrorFading(true);
      setTimeout(() => {
        clearErrors("age");
        setIsErrorFading(false);
      }, 300);
    }
    setValue("age", e.target.value, { shouldValidate: true });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <div className=" card-common-width mx-auto mt-6">
        <h2 className={`text-center text-3xl font-poppins font-semibold text-foreground ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>What is your age?</h2>
        <form
          id="ageForm"
          onSubmit={handleSubmit(handleFormSubmit)}
          className="max-w-xl mx-auto space-y-6 card-common"
        >
          <div className={`${getAnimationClass("content", isExiting, isBackExiting, direction)}`}>
            <Input.Wrapper
              label="Your Age"
              required
              error={errors.age?.message ? errors.age?.message : false}
              classNames={{
                label: "!text-sm md:!text-base lg:!text-lg",
                error: isErrorFading ? "error-fade-out" : "animate-pulseFade", // Add this
              }}
            >
              <Input
                type="text"
                {...register("age")}
                onChange={handleAgeChange}
              />
            </Input.Wrapper>
          </div>

          <div className={`flex justify-center gap-6 pt-4 ${getAnimationClass("btns", isExiting, isBackExiting, direction)}}`}>
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
              form="ageForm"
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Age;
