import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { prevGlpMedDetails } from "@/common/states/product.atom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useAtom } from "jotai";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const glpOneMedicationSchema = yup.object({
  takesGlpOneMedication: yup.string().required("Please select your GLP-1 medication status"),
  glpOneMedicationDetails: yup.string().when("takesGlpOneMedication", {
    is: "Yes",
    then: (schema) => schema.required("Please select which GLP-1 medication you use"),
  }),
});

export type glpOneMedicationSchemaType = yup.InferType<typeof glpOneMedicationSchema>;

interface GlpOneMedicationProps {
  onNext: (data: glpOneMedicationSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: glpOneMedicationSchemaType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const GlpOneMedication = ({ onNext, onBack, defaultValues, direction }: GlpOneMedicationProps) => {
  const [prevGlpDetails, setPrevGlpDetails] = useAtom(prevGlpMedDetails);
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<glpOneMedicationSchemaType>({
    defaultValues: {
      takesGlpOneMedication: defaultValues?.takesGlpOneMedication || "",
      glpOneMedicationDetails: defaultValues?.glpOneMedicationDetails || "",
    },
    resolver: yupResolver(glpOneMedicationSchema),
  });

  const takesGlpOneMedication = watch("takesGlpOneMedication");
  const glpOneMedicationDetails = watch("glpOneMedicationDetails");
  const showDetails = takesGlpOneMedication === "Yes";

  const handleSelect = (field: keyof glpOneMedicationSchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    if (field == "glpOneMedicationDetails") {
      setPrevGlpDetails((prev) => ({ ...prev, currentMedType: value }));
    }
    clearErrors(field);
  };

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: glpOneMedicationSchemaType) => {
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

  const takesGlpOptions = ["No", "Yes"];
  const glpDetailsOptions = ["Semaglutide", "Tirzepatide"];

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="glpOneMedicationForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="card-common-width-lg mx-auto space-y-10"
      >
        <Radio.Group
          value={takesGlpOneMedication}
          onChange={(value) => {
            handleSelect("takesGlpOneMedication", value);
            setValue("glpOneMedicationDetails", "");
            clearErrors("glpOneMedicationDetails");
          }}
          label="Are you currently or have you ever taken
GLP-1 medication?"
          classNames={{
            root: "sm:!grid !block",
            error: "sm:!text-end !text-start w-full",
            label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2 text-center",
          }}
          className={`${getAnimationClass("title", isExiting, isBackExiting, direction)}`}
        >
          <div className={`grid md:grid-cols-2 gap-5 w-full ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}>
            {takesGlpOptions.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(takesGlpOneMedication, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {takesGlpOneMedication === option && (
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

        {errors.takesGlpOneMedication && <Text className="text-red-500 text-sm mt-5 text-center animate-pulseFade">{errors.takesGlpOneMedication.message}</Text>}

        {showDetails && (
          <Radio.Group
            value={glpOneMedicationDetails}
            onChange={(value) => handleSelect("glpOneMedicationDetails", value)}
            label="Which GLP-1 medication do you use?"
            classNames={{
              root: " !block mt-6 w-full",
              error: "sm:!text-end !text-start w-full",
              label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2 text-center w-full",
            }}
            className={`${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
          >
            <div className="grid md:grid-cols-2 gap-5 w-full">
              {glpDetailsOptions.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(glpOneMedicationDetails, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {glpOneMedicationDetails === option && (
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
        )}
        {errors.glpOneMedicationDetails && <Text className="text-red-500 text-sm mt-5 text-center animate-pulseFade">{errors.glpOneMedicationDetails.message}</Text>}

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
            form="glpOneMedicationForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GlpOneMedication;
