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
  direction?: "forward" | "backward"; // ✅ New prop for direction
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

  const age = watch("age");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("age", value, { shouldValidate: true });
    clearErrors("age");
  };

  const handleFormSubmit = (data: ageSchemaType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      setIsExiting(false);
      onNext(data);
    }, 750); // ✅ Matches animation duration (400ms + 100ms delay)
  };

  const handleBackClick = () => {
    setIsBackExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      setIsBackExiting(false);
      onBack();
    }, 750);
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <div className=" card-common-width mx-auto mt-6">
        <h2
          className={`text-center text-3xl font-poppins font-semibold text-foreground ${
            isExiting ? "animate-title-exit" : isBackExiting ? "animate-title-exit-back" : direction === "forward" ? "animate-title-enter-right" : "animate-title-enter-left"
          }`}
        >
          What is your age?
        </h2>
        <form
          id="ageForm"
          onSubmit={handleSubmit(handleFormSubmit)}
          className={`max-w-xl mx-auto space-y-6 card-common ${
            isExiting
              ? "animate-content-exit"
              : isBackExiting
              ? "animate-content-exit-back"
              : direction === "forward"
              ? "animate-content-enter-right"
              : "animate-content-enter-left"
          }`}
        >
          <div>
            <Input.Wrapper
              label="Your Age"
              required
              error={errors.age?.message ? errors.age?.message : false}
              classNames={{
                label: "!text-sm md:!text-base lg:!text-lg",
                error: "animate-fadeInUp",
              }}
            >
              <Input
                type="text"
                {...register("age")}
              />
            </Input.Wrapper>
          </div>

          <div
            className={`flex justify-center md:gap-6 gap-3 md:pt-8 pt-5 ${
              isExiting ? "animate-btns-exit" : isBackExiting ? "animate-btns-exit-back" : direction === "forward" ? "animate-btns-enter-right" : "animate-btns-enter-left"
            }`}
          >
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
