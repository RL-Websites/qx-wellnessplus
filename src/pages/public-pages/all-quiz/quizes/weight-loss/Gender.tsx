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

export const GenderWeightLossSchema = yup.object({
  genderWeightLoss: yup.string().required("Please select your gender for weight loss"),
});

export type GenderWeightLossSchemaType = yup.InferType<typeof GenderWeightLossSchema>;

interface IGenderWeightLossProps {
  onNext: (data: GenderWeightLossSchemaType & { inEligibleUser?: boolean }) => void;
  onBack: () => void;
  defaultValues?: GenderWeightLossSchemaType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

export default function GenderWeightLoss({ onNext, onBack, defaultValues, direction }: IGenderWeightLossProps) {
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const [selectedGender, setSelectedGender] = useAtom(selectedGenderAtom);

  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<GenderWeightLossSchemaType>({
    defaultValues: {
      genderWeightLoss: defaultValues?.genderWeightLoss || "",
    },
    resolver: yupResolver(GenderWeightLossSchema),
  });

  const genderWeightLoss = watch("genderWeightLoss");
  const options = ["Male", "Female"];

  const handleSelect = (value: string) => {
    if (errors.genderWeightLoss) {
      setIsErrorFading(true);
      setTimeout(() => {
        if (selectedCategory?.includes("Hair Growth")) {
          if (value === "Male") {
            const newCat = ["Hair Growth (Male)"];
            setSelectedCategory(newCat);
          }
          if (value === "Female") {
            const newCat = ["Hair Growth (Female)"];
            setSelectedCategory(newCat);
          }
        }
        setValue("genderWeightLoss", value, { shouldValidate: true });
        clearErrors("genderWeightLoss");
        setSelectedGender(value);
        setIsErrorFading(false);
      }, 300);
    } else {
      if (selectedCategory?.includes("Hair Growth")) {
        if (value === "Male") {
          const newCat = ["Hair Growth (Male)"];
          setSelectedCategory(newCat);
        }
        if (value === "Female") {
          const newCat = ["Hair Growth (Female)"];
          setSelectedCategory(newCat);
        }
      }
      setValue("genderWeightLoss", value, { shouldValidate: true });
      setSelectedGender(value);
    }
  };

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: GenderWeightLossSchemaType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      onNext({
        ...data,
        inEligibleUser: data.genderWeightLoss === "Female",
      });
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
      <h2 className={`heading-text text-foreground uppercase text-center ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>Gender</h2>

      <div className={`card-common-width-lg mx-auto mt-10 ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}>
        <form
          id="genderWeightLossForm"
          onSubmit={handleSubmit(handleFormSubmit)}
          className="w-full"
        >
          <Radio.Group
            value={genderWeightLoss}
            onChange={handleSelect}
            className="mt-6 w-full"
          >
            <div className="grid md:grid-cols-2 w-full gap-5">
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(genderWeightLoss, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {genderWeightLoss === option && (
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
          {errors.genderWeightLoss && (
            <Text className={`text-red-500 text-sm mt-5 text-center ${isErrorFading ? "error-fade-out" : "animate-pulseFade"}`}>Please select your gender.</Text>
          )}
        </form>
      </div>

      <div className={`flex justify-center gap-6 pt-8 ${getAnimationClass("btns", isExiting, isBackExiting, direction)}`}>
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
          form="genderWeightLossForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
