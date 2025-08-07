"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Stack, Text } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const genderOptions = ["Male", "Female"];

const genderSchema = yup.object({
  gender: yup.string().required("Please select your gender"),
});

type FormValues = yup.InferType<typeof genderSchema>;

export default function Gender() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(genderSchema),
    defaultValues: {
      gender: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <h2 className="heading-text text-foreground uppercase text-center">Gender</h2>
      <h4 className="mt-12 text-center text-3xl font-poppins font-semibold text-foreground">May I ask your preferred gender identity?</h4>

      <div className="card-common-width mx-auto mt-6">
        <form
          className="w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Radio.Group {...field}>
                <Stack
                  gap="sm"
                  justify="center"
                  align="center"
                  className="flex-row gap-4"
                >
                  {genderOptions.map((gender) => (
                    <Radio.Card
                      key={gender}
                      value={gender}
                      radius="md"
                      className={`dml-radiobtn ${field.value === gender ? "bg-white" : ""}`}
                    >
                      <Text
                        fw={500}
                        className="text-foreground text-center"
                      >
                        {gender}
                      </Text>
                    </Radio.Card>
                  ))}
                </Stack>
              </Radio.Group>
            )}
          />
          {errors.gender && <Text className="text-red-500 text-sm mt-5 text-center">{errors.gender.message}</Text>}

          <div className="mt-10 text-center">
            <Button
              type="submit"
              size="md"
              className="bg-primary text-white rounded-xl lg:w-[206px]"
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
