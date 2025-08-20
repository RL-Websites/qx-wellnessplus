"use client";

import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { selectedCategoryAtom } from "@/common/states/category.atom";
import { selectedGenderAtom } from "@/common/states/gender.atom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const GenderPeptidesSchema = yup.object({
  genderPeptides: yup.string().required("Please select your gender"),
});

export type GenderPeptidesSchemaType = yup.InferType<typeof GenderPeptidesSchema>;

interface IGenderPeptidesProps {
  onNext: (data: GenderPeptidesSchemaType & { inEligibleUser?: boolean }) => void;
  onBack: () => void;
  defaultValues?: GenderPeptidesSchemaType;
}

export default function GenderPeptides({ onNext, onBack, defaultValues }: IGenderPeptidesProps) {
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const [selectedGender, setSelectedGender] = useAtom(selectedGenderAtom);
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<GenderPeptidesSchemaType>({
    defaultValues: {
      genderPeptides: defaultValues?.genderPeptides || "",
    },
    resolver: yupResolver(GenderPeptidesSchema),
  });

  const genderPeptides = watch("genderPeptides");
  const options = ["Male", "Female"];

  const handleSelect = (value: string) => {
    if (selectedCategory?.includes("Hair Growth")) {
      const newCat = value === "Male" ? ["Hair Growth (Male)"] : ["Hair Growth (Female)"];
      setSelectedCategory(newCat);
    }
    setValue("genderPeptides", value, { shouldValidate: true });
    clearErrors("genderPeptides");
    setSelectedGender(value);
  };

  const handleFormSubmit = (data: GenderPeptidesSchemaType) => {
    onNext({
      ...data,
      inEligibleUser: data.genderPeptides === "Female",
    });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <h2 className="heading-text text-foreground uppercase text-center">Gender</h2>

      <div className="card-common-width-lg mx-auto mt-10">
        <form
          id="genderPeptidesForm"
          onSubmit={handleSubmit(handleFormSubmit)}
          className="w-full"
        >
          <Radio.Group
            value={genderPeptides}
            onChange={handleSelect}
            className="mt-6 w-full"
          >
            <div className="grid md:grid-cols-2 w-full gap-5">
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(genderPeptides, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {genderPeptides === option && (
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
          {errors.genderPeptides && <Text className="text-red-500 text-sm mt-5 text-center">{errors.genderPeptides.message}</Text>}
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
          form="genderPeptidesForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
