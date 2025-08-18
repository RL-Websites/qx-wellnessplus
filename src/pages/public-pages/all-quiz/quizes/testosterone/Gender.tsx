"use client";

import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { selectedCategoryAtom } from "@/common/states/category.atom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Radio, Text } from "@mantine/core";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const GenderTestosteroneSchema = yup.object({
  genderWeightLoss: yup.string().required("Please select your gender for testosterone support"),
});

export type GenderTestosteroneSchemaType = yup.InferType<typeof GenderTestosteroneSchema>;

interface IGenderTestosteroneProps {
  onNext: (data: GenderTestosteroneSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: GenderTestosteroneSchemaType;
}

export default function GenderTestosterone({ onNext, onBack, defaultValues }: IGenderTestosteroneProps) {
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<GenderTestosteroneSchemaType>({
    defaultValues: {
      genderWeightLoss: defaultValues?.genderWeightLoss || "",
    },
    resolver: yupResolver(GenderTestosteroneSchema),
  });

  const genderWeightLoss = watch("genderWeightLoss");
  const options = ["Male", "Female"];

  const handleSelect = (value: string) => {
    if (selectedCategory?.includes("Hair Growth")) {
      if (value === "Male") {
        setSelectedCategory(["Hair Growth (Male)"]);
      }
      if (value === "Female") {
        setSelectedCategory(["Hair Growth (Female)"]);
      }
    }
    setValue("genderWeightLoss", value, { shouldValidate: true });
    clearErrors("genderWeightLoss");
  };

  const handleFormSubmit = (data: GenderTestosteroneSchemaType) => {
    onNext({
      ...data,
      eligible: data.genderWeightLoss === "Female",
    });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <h2 className="heading-text text-foreground uppercase text-center">Gender</h2>

      <div className="card-common-width mx-auto mt-10">
        <form
          id="genderTestosteroneForm"
          onSubmit={handleSubmit(handleFormSubmit)}
          className="w-full"
        >
          <Radio.Group
            value={genderWeightLoss}
            onChange={handleSelect}
            className="mt-6"
          >
            <Group grow>
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
            </Group>
          </Radio.Group>
          {errors.genderWeightLoss && <Text className="text-red-500 text-sm mt-5 text-center">Please select your gender.</Text>}
        </form>
      </div>

      <div className="flex justify-center md:gap-6 gap-3 md:pt-8 pt-5">
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
          form="genderTestosteroneForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
