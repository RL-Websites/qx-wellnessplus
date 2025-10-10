import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { prevGlpMedDetails } from "@/common/states/product.atom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useAtom } from "jotai";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const multipleMedicineSchema = yup.object({
  selectedMedicine: yup.string().required("Please select an option."),
});

export type multipleMedicineSchemaType = yup.InferType<typeof multipleMedicineSchema>;

interface IMultipleMedicineProps {
  onNext: (data: multipleMedicineSchemaType) => void;
  onBack: () => void;
  defaultValues?: multipleMedicineSchemaType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const MultipleMedicine = ({ onNext, onBack, defaultValues, direction }: IMultipleMedicineProps) => {
  const [prevGlpDetails, setPrevGlpDetails] = useAtom(prevGlpMedDetails);
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<multipleMedicineSchemaType>({
    defaultValues: {
      selectedMedicine: defaultValues?.selectedMedicine || "",
    },
    resolver: yupResolver(multipleMedicineSchema),
  });

  const selectedMedicine = watch("selectedMedicine");

  const options = ["Semaglutide", "Tirzepatide"];

  const handleSelect = (value: string) => {
    setValue("selectedMedicine", value, { shouldValidate: true });
    setPrevGlpDetails((prev) => ({ ...prev, preferredMedType: value }));
    clearErrors("selectedMedicine");
  };

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: multipleMedicineSchemaType) => {
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
        id="multipleMedicineForm"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className={`text-center text-3xl font-poppins font-semibold text-foreground ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
            Are you interested in Semaglutide or Tirzepatide?
          </h2>

          <Radio.Group
            value={selectedMedicine}
            onChange={handleSelect}
            className={`mt-6 w-full ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
          >
            <div className="grid md:grid-cols-2 w-full gap-5">
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
                      ${selectedMedicine === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                    `,
                  }}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {selectedMedicine === option && (
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
          {errors.selectedMedicine && <Text className="text-red-500 text-sm mt-5 text-center animate-pulseFade">{errors.selectedMedicine.message}</Text>}
          <div className={`space-y-2.5 pt-4 ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}>
            <p className="text-xl text-foreground font-medium font-poppins">
              <span className="font-semibold">Semaglutide:</span> A proven GLP-1 medication that reduces appetite and supports steady weight loss. Often considered a good starting
              option for beginners.
            </p>
            <p className="text-xl text-foreground font-medium font-poppins">
              <span className="font-semibold">Tirzepatide:</span> A newer dual-action (GLP-1 + GIP) medication that can lead to stronger results. Typically seen as an advanced
              option for patients seeking greater weight loss.
            </p>
          </div>
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
            form="multipleMedicineForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MultipleMedicine;
