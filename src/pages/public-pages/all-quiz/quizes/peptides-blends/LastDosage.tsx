import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextInput } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface LastDosageProps {
  onNext: (data: LastDosageFormType) => void;
  onBack: () => void;
  defaultValues?: LastDosageFormType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

// Schema + Type
const schema = yup.object({
  lastDosage: yup.string().required("Please enter your last dosage."),
});

type LastDosageFormType = yup.InferType<typeof schema>;

const LastDosage = ({ onNext, onBack, defaultValues, direction }: LastDosageProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LastDosageFormType>({
    defaultValues: {
      lastDosage: defaultValues?.lastDosage || "",
    },
    resolver: yupResolver(schema),
  });

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: LastDosageFormType) => {
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
        id="LastDosageForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <h2 className={`text-center text-3xl font-semibold text-foreground font-poppins ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
          What was your last dosage?
        </h2>

        <TextInput
          {...register("lastDosage")}
          placeholder="Enter your last dosage (e.g., 2 mg, 10 IU)"
          error={errors.lastDosage?.message}
          className={`mt-6 ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
          classNames={{
            error: "animate-pulseFade",
          }}
        />

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
            form="LastDosageForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LastDosage;
