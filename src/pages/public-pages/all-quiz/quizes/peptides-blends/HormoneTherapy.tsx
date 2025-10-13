import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Radio } from "@mantine/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface HormoneTherapyProps {
  onNext: (data: HormoneTherapyFormType) => void;
  onBack: () => void;
  defaultValues?: HormoneTherapyFormType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

// ✅ Validation Schema
const schema = yup.object({
  takingHormoneTherapy: yup.string().required("Please select Yes or No."),
});

type HormoneTherapyFormType = yup.InferType<typeof schema>;

const HormoneTherapy = ({ onNext, onBack, defaultValues, direction }: HormoneTherapyProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HormoneTherapyFormType>({
    defaultValues: {
      takingHormoneTherapy: defaultValues?.takingHormoneTherapy || "",
    },
    resolver: yupResolver(schema),
  });

  const takingHormoneTherapy = watch("takingHormoneTherapy");
  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: HormoneTherapyFormType) => {
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

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="HormoneTherapyForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <h2 className={`text-center text-3xl font-semibold text-foreground font-poppins ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
          Are you currently taking hormone therapy, supplements, or other performance enhancers?
        </h2>

        <Radio.Group
          value={takingHormoneTherapy}
          onChange={(value) =>
            setValue("takingHormoneTherapy", value as "Yes" | "No", {
              shouldValidate: true,
            })
          }
          className={`mt-6 `}
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
                      ${takingHormoneTherapy === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                    `,
                  }}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {takingHormoneTherapy === option && (
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

        {errors.takingHormoneTherapy && <p className="animate-pulseFade text-danger text-sm mt-2 text-center">{errors.takingHormoneTherapy.message}</p>}

        <div className={`flex justify-center gap-6 pt-6 ${getAnimationClass("btns", isExiting, isBackExiting, direction)}`}>
          <Button
            variant="outline"
            className="w-[200px] animated-btn"
            onClick={handleBackClick}
            type="button"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="w-[200px] animated-btn"
            form="HormoneTherapyForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HormoneTherapy;
