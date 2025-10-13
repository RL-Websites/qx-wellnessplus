import { BaseWebDatePickerOverrides } from "@/common/configs/baseWebOverrides";
import { InputErrorMessage } from "@/common/configs/inputErrorMessage";
import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { selectedCategoryAtom } from "@/common/states/category.atom";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input } from "@mantine/core";
import { BaseProvider, LightTheme } from "baseui";
import { Datepicker as UberDatePicker } from "baseui/datepicker";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Client as Styletron } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";
import * as yup from "yup";

interface IDobProps {
  onNext: (data: dobSchemaType) => void;
  onBack: () => void;
  direction?: "forward" | "backward"; // ✅ Add this

  defaultValues?: dobSchemaType;
}

type dobSchemaType = {
  date_of_birth: Date;
};

export default function DateOfBirth({ onNext, onBack, defaultValues, direction }: IDobProps) {
  const engine = new Styletron();
  const [dob, setDob] = useState<any>(defaultValues?.date_of_birth ?? null);
  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const selectedCategory = useAtomValue(selectedCategoryAtom);

  const ageLimit = selectedCategory?.includes("Testosterone") ? 22 : 18;

  const maxValidDate = new Date();
  maxValidDate.setFullYear(maxValidDate.getFullYear() - ageLimit);

  const maxDate = new Date(maxValidDate);
  const minDate = new Date("1920-01-01");

  const dobSchema = yup.object({
    date_of_birth: yup
      .date()
      .typeError("Please enter a valid date")
      .required(`Please enter your date of birth & age must be at least ${ageLimit} years old`)
      .max(maxValidDate, `You must be at least ${ageLimit} years old`),
  });

  const handleFormSubmit = (data: dobSchemaType) => {
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

  const {
    clearErrors,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<dobSchemaType>({
    resolver: yupResolver(dobSchema),
    defaultValues,
  });

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <h2 className={`heading-text text-foreground uppercase text-center ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>Date of Birth</h2>
      {selectedCategory?.includes("Testosterone") ? (
        <p className={`text-xl text-foreground font-poppins text-center pt-5 ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
          For Testosterone Therapy, you must be {ageLimit} years or older.
        </p>
      ) : (
        <p className={`text-xl text-foreground font-poppins text-center pt-5 ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
          We cannot prescribe any medication if you are under {ageLimit} years old
        </p>
      )}
      <div className={`card-common card-common-width relative z-10 delay-1000 duration-500 ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}>
        <form
          id="dobForm"
          className="w-full"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <Input.Wrapper
            label="Date of Birth"
            error={getErrorMessage(errors.date_of_birth)}
            withAsterisk
            classNames={{ ...InputErrorMessage, error: "animate-pulseFade" }}
          >
            <div className={`${errors?.date_of_birth ? "baseWeb-error" : ""} dml-Input-wrapper dml-Input-Calendar relative`}>
              <StyletronProvider value={engine}>
                <BaseProvider theme={LightTheme}>
                  <UberDatePicker
                    aria-label="Select a date"
                    placeholder="MM/DD/YYYY"
                    formatString="MM/dd/yyyy"
                    highlightedDate={maxDate}
                    maxDate={maxDate}
                    minDate={minDate}
                    value={dob}
                    mask="99/99/9999"
                    error={!!errors.date_of_birth}
                    onChange={(data) => {
                      if (data?.date) {
                        setDob([data.date]);
                        setValue("date_of_birth", data.date, { shouldValidate: true });
                        clearErrors("date_of_birth");
                      }
                    }}
                    overrides={BaseWebDatePickerOverrides}
                  />
                </BaseProvider>
              </StyletronProvider>
            </div>
          </Input.Wrapper>
        </form>
      </div>

      <div className={`flex justify-center md:gap-6 gap-3 md:pt-8 pt-5 relative z-0 ${getAnimationClass("btns", isExiting, isBackExiting, direction)}`}>
        <Button
          variant="outline"
          className="w-[200px] animated-btn"
          component={Link}
          to="/category"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="w-[200px] animated-btn"
          form="dobForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
