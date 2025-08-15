"use client";

import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { selectedCategoryAtom } from "@/common/states/category.atom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Radio, Text } from "@mantine/core";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const GenderSchema = yup.object({
  gender: yup.string().required("Please select your gender"),
});

export type GenderSchemaType = yup.InferType<typeof GenderSchema>;

interface IGenderProps {
  onNext: (data: GenderSchemaType & { inEligibleUser?: boolean }) => void;
  onBack: () => void;
  defaultValues?: GenderSchemaType;
}

export default function Gender({ onNext, onBack, defaultValues }: IGenderProps) {
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<GenderSchemaType>({
    defaultValues: {
      gender: defaultValues?.gender || "",
    },
    resolver: yupResolver(GenderSchema),
  });

  const gender = watch("gender");
  const options = ["Male", "Female"];

  const handleSelect = (value: string) => {
    if (selectedCategory == "Hair Growth") {
      if (value == "Male") {
        setSelectedCategory("Hair Growth (Male)");
      }
      if (value == "Female") {
        setSelectedCategory("Hair Growth (Female)");
      }
    }
    setValue("gender", value, { shouldValidate: true });
    clearErrors("gender");
  };

  const handleFormSubmit = (data: GenderSchemaType) => {
    onNext({
      ...data,
      inEligibleUser: data.gender === "Female",
    });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <h2 className="heading-text text-foreground uppercase text-center">Gender</h2>
      <h4 className="mt-12 text-center text-3xl font-poppins font-semibold text-foreground">May I ask your preferred gender identity?</h4>

      <div className="card-common-width mx-auto mt-6">
        <form
          id="genderForm"
          onSubmit={handleSubmit(handleFormSubmit)}
          className="w-full"
        >
          <Radio.Group
            value={gender}
            onChange={handleSelect}
            className="mt-6"
            error={errors?.gender?.message}
          >
            <Group grow>
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(gender, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {gender === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 right-3 -translate-y-1/2">
                          <i className="icon-tick text-sm/none"></i>
                        </span>
                      )}
                    </div>
                  }
                />
              ))}
            </Group>
          </Radio.Group>
          {errors.gender && <Text className="text-red-500 text-sm mt-5 text-center">{errors.gender.message}</Text>}
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
          form="genderForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
