"use client";

import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { selectedCategoryAtom } from "@/common/states/category.atom";
import { selectedGenderAtom } from "@/common/states/gender.atom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useAtom } from "jotai";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation Schema
export const GenderHairGrowthSchema = yup.object({
  genderHairGrowth: yup.string().required("Please select your gender for hair growth"),
});

export type GenderHairGrowthSchemaType = yup.InferType<typeof GenderHairGrowthSchema>;

interface IGenderHairGrowthProps {
  onNext: (data: GenderHairGrowthSchemaType) => void;
  onBack: () => void;
  defaultValues?: GenderHairGrowthSchemaType;
  direction?: "forward" | "backward"; // ✅ Add this
}

export default function GenderHairGrowth({ onNext, onBack, defaultValues, direction }: IGenderHairGrowthProps) {
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const [selectedGender, setSelectedGender] = useAtom(selectedGenderAtom);
  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<GenderHairGrowthSchemaType>({
    defaultValues: {
      genderHairGrowth: defaultValues?.genderHairGrowth || "",
    },
    resolver: yupResolver(GenderHairGrowthSchema),
  });

  const handleFormSubmit = (data: GenderHairGrowthSchemaType) => {
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

  const genderHairGrowth = watch("genderHairGrowth");
  const options = ["Male", "Female"];

  const handleSelect = (value: string) => {
    if (value === "Male") {
      setSelectedCategory(["Hair Growth (Male)"]);
    } else if (value === "Female") {
      setSelectedCategory(["Hair Growth (Female)"]);
    }

    setValue("genderHairGrowth", value, { shouldValidate: true });
    clearErrors("genderHairGrowth");
    setSelectedGender(value);
  };

  // const handleSelect = (value: string) => {
  //   if (selectedCategory?.includes("Hair Growth")) {
  //     if (value === "Male") {
  //       setSelectedCategory(["Hair Growth (Male)"]);
  //     } else if (value === "Female") {
  //       setSelectedCategory(["Hair Growth (Female)"]);
  //     }
  //   }

  //   setValue("genderHairGrowth", value, { shouldValidate: true });
  //   clearErrors("genderHairGrowth");
  // };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <h2
        className={`heading-text text-foreground uppercase text-center  ${
          isExiting ? "animate-title-exit" : isBackExiting ? "animate-title-exit-back" : direction === "forward" ? "animate-title-enter-right" : "animate-title-enter-left"
        }`}
      >
        Gender
      </h2>

      <div
        className={`card-common-width-lg mx-auto mt-10 ${
          isExiting ? "animate-content-exit" : isBackExiting ? "animate-content-exit-back" : direction === "forward" ? "animate-content-enter-right" : "animate-content-enter-left"
        }`}
      >
        <form
          id="genderHairGrowthForm"
          onSubmit={handleSubmit(handleFormSubmit)}
          className="w-full"
        >
          <Radio.Group
            value={genderHairGrowth}
            onChange={handleSelect}
            className="mt-6 w-full"
          >
            <div className="grid md:grid-cols-2 w-full gap-5">
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(genderHairGrowth, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {genderHairGrowth === option && (
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
          {errors.genderHairGrowth && <Text className="text-red-500 text-sm mt-5 text-center animate-fadeInUp">Please select your gender.</Text>}
        </form>
      </div>

      <div
        className={`flex justify-center md:gap-6 gap-3 md:pt-8 pt-5  ${
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
          form="genderHairGrowthForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
