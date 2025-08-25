"use client";

import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { selectedCategoryAtom } from "@/common/states/category.atom";
import { selectedGenderAtom } from "@/common/states/gender.atom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const GenderTestosteroneSchema = yup.object({
  genderTestosterone: yup.string().required("Please select your gender for testosterone support"),
});

export type GenderTestosteroneSchemaType = yup.InferType<typeof GenderTestosteroneSchema>;

interface IGenderTestosteroneProps {
  onNext: (data: GenderTestosteroneSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: GenderTestosteroneSchemaType;
}

export default function GenderTestosterone({ onNext, onBack, defaultValues }: IGenderTestosteroneProps) {
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const [selectedGender, setSelectedGender] = useAtom(selectedGenderAtom);
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<GenderTestosteroneSchemaType>({
    defaultValues: {
      genderTestosterone: defaultValues?.genderTestosterone || "",
    },
    resolver: yupResolver(GenderTestosteroneSchema),
  });

  const genderTestosterone = watch("genderTestosterone");
  const options = ["Male", "Female"];

  const handleSelect = (value: string) => {
    setValue("genderTestosterone", value, { shouldValidate: true });
    clearErrors("genderTestosterone");
    setSelectedGender(value);
  };

  const handleFormSubmit = (data: GenderTestosteroneSchemaType) => {
    onNext({
      ...data,
      // eligible: data.genderTestosterone === "Female",
    });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <h2 className="heading-text text-foreground uppercase text-center">Gender</h2>

      <div className="card-common-width-lg mx-auto mt-10">
        <form
          id="genderTestosteroneForm"
          onSubmit={handleSubmit(handleFormSubmit)}
          className="w-full"
        >
          <Radio.Group
            value={genderTestosterone}
            onChange={handleSelect}
            className="mt-6 w-full"
          >
            <div className="grid md:grid-cols-2 gap-5 w-full">
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(genderTestosterone, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {genderTestosterone === option && (
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
          {errors.genderTestosterone && <Text className="text-red-500 text-sm mt-5 text-center">Please select your gender.</Text>}
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
