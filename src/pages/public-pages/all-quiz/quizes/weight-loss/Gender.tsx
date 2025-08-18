"use client";

import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { selectedCategoryAtom } from "@/common/states/category.atom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Radio, Text } from "@mantine/core";
import { useAtom } from "jotai";
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
}

export default function GenderWeightLoss({ onNext, onBack, defaultValues }: IGenderWeightLossProps) {
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
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
  };

  const handleFormSubmit = (data: GenderWeightLossSchemaType) => {
    onNext({
      ...data,
      inEligibleUser: data.genderWeightLoss === "Female",
    });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <h2 className="heading-text text-foreground uppercase text-center">Gender</h2>

      <div className="card-common-width mx-auto mt-10">
        <form
          id="genderWeightLossForm"
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
          {errors.genderWeightLoss && <Text className="text-red-500 text-sm mt-5 text-center">Please select your gender.</Text>}
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
          form="genderWeightLossForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
