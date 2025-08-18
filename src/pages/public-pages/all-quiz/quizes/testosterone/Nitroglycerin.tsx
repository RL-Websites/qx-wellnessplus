"use client";

import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
// Ensure spelling here is correct
import { selectedCategoryAtom } from "@/common/states/category.atom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Radio, Text } from "@mantine/core";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const NitroglycerinSchema = yup.object({
  genderWeightLoss: yup.string().required("Please select your gender for nitroglycerin support"),
});

export type NitroglycerinSchemaType = yup.InferType<typeof NitroglycerinSchema>;

interface INitroglycerinProps {
  onNext: (data: NitroglycerinSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: NitroglycerinSchemaType;
}

export default function Nitroglycerin({ onNext, onBack, defaultValues }: INitroglycerinProps) {
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<NitroglycerinSchemaType>({
    defaultValues: {
      genderWeightLoss: defaultValues?.genderWeightLoss || "",
    },
    resolver: yupResolver(NitroglycerinSchema),
  });

  const genderWeightLoss = watch("genderWeightLoss");
  const options = ["Male", "Female"];

  const handleSelect = (value: string) => {
    if (selectedCategory?.includes("Hair Growth")) {
      setSelectedCategory([`Hair Growth (${value})`]);
    }
    setValue("genderWeightLoss", value, { shouldValidate: true });
    clearErrors("genderWeightLoss");
  };

  const handleFormSubmit = (data: NitroglycerinSchemaType) => {
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
          id="nitroglycerinForm"
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
          {errors.genderWeightLoss && <Text className="text-red-500 text-sm mt-5 text-center">{errors.genderWeightLoss.message}</Text>}
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
          form="nitroglycerinForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
