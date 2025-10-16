"use client";

import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { selectedCategoryAtom } from "@/common/states/category.atom";
import { selectedGenderAtom } from "@/common/states/gender.atom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useAtom } from "jotai";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const GenderSexualHealthSchema = yup.object({
  genderSexualHealth: yup.string().required("Please select your gender for sexual health"),
});

export type GenderSexualHealthSchemaType = yup.InferType<typeof GenderSexualHealthSchema>;

interface IGenderSexualHealthProps {
  onNext: (data: GenderSexualHealthSchemaType) => void;
  onBack: () => void;
  defaultValues?: GenderSexualHealthSchemaType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

export default function GenderSexualHealth({ onNext, onBack, defaultValues, direction }: IGenderSexualHealthProps) {
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const [selectedGender, setSelectedGender] = useAtom(selectedGenderAtom);

  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<GenderSexualHealthSchemaType>({
    defaultValues: {
      genderSexualHealth: defaultValues?.genderSexualHealth || "",
    },
    resolver: yupResolver(GenderSexualHealthSchema),
  });

  const genderSexualHealth = watch("genderSexualHealth");
  const options = ["Male", "Female"];

  const handleSelect = (value: string) => {
    if (errors.genderSexualHealth) {
      setIsErrorFading(true);
      setTimeout(() => {
        if (value === "Male") {
          setSelectedCategory(["Sexual Health (Male)"]);
        } else if (value === "Female") {
          setSelectedCategory(["Sexual Health (Female)"]);
        }
        setValue("genderSexualHealth", value, { shouldValidate: true });
        clearErrors("genderSexualHealth");
        setSelectedGender(value);
        setIsErrorFading(false);
      }, 300);
    } else {
      if (value === "Male") {
        setSelectedCategory(["Sexual Health (Male)"]);
      } else if (value === "Female") {
        setSelectedCategory(["Sexual Health (Female)"]);
      }
      setValue("genderSexualHealth", value, { shouldValidate: true });
      setSelectedGender(value);
    }
  };

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: GenderSexualHealthSchemaType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      setIsExiting(false);
      onNext(data);
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
      <h2 className={`heading-text text-foreground uppercase text-center ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>Gender</h2>

      <div className={`card-common-width-lg mx-auto mt-10 ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}>
        <form
          id="genderSexualHealthForm"
          onSubmit={handleSubmit(handleFormSubmit)}
          className="w-full"
        >
          <Radio.Group
            value={genderSexualHealth}
            onChange={handleSelect}
            className="mt-6 w-full"
          >
            <div className="grid md:grid-cols-2 w-full gap-5">
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(genderSexualHealth, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {genderSexualHealth === option && (
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
          {errors.genderSexualHealth && (
            <Text className={`text-red-500 text-sm mt-5 text-center ${isErrorFading ? "error-fade-out" : "animate-pulseFade"}`}>Please select your gender.</Text>
          )}
        </form>
      </div>

      <div className={`flex justify-center md:gap-6 gap-3 md:pt-8 pt-5 ${getAnimationClass("btns", isExiting, isBackExiting, direction)}`}>
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
          form="genderSexualHealthForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
