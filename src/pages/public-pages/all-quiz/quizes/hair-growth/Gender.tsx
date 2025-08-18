"use client";

import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { selectedCategoryAtom } from "@/common/states/category.atom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Radio, Text } from "@mantine/core";
import { useAtom } from "jotai";
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
}

export default function GenderHairGrowth({ onNext, onBack, defaultValues }: IGenderHairGrowthProps) {
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
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
      <h2 className="heading-text text-foreground uppercase text-center">Gender</h2>

      <div className="card-common-width mx-auto mt-10">
        <form
          id="genderHairGrowthForm"
          onSubmit={handleSubmit(onNext)}
          className="w-full"
        >
          <Radio.Group
            value={genderHairGrowth}
            onChange={handleSelect}
            className="mt-6"
          >
            <Group grow>
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(genderHairGrowth, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {genderHairGrowth === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 right-0  -translate-y-1/2">
                          <i className="icon-tick text-sm/none"></i>
                        </span>
                      )}
                    </div>
                  }
                />
              ))}
            </Group>
          </Radio.Group>
          {errors.genderHairGrowth && <Text className="text-red-500 text-sm mt-5 text-center">Please select your gender.</Text>}
        </form>
      </div>

      <div className="flex justify-center gap-6 pt-8">
        <Button
          variant="outline"
          className="w-[200px]"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="w-[200px]"
          form="genderHairGrowthForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
