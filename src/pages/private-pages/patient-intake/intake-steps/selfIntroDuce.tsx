"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Textarea } from "@mantine/core";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

export const selfIntroSchema = yup.object({
  selfIntro: yup.string().required("Please write something about your self."),
});

export type selfIntroSchemaType = yup.InferType<typeof selfIntroSchema>;

interface SelfIntroProps {
  onNext: (data: selfIntroSchemaType) => void;
  onBack: () => void;
  defaultValues?: selfIntroSchemaType;
  isLoading?: boolean;
  isFinalStep?: string;
}

const SelfIntroDuce: React.FC<SelfIntroProps> = ({ onNext, onBack, defaultValues, isLoading = false, isFinalStep }) => {
  const MAX_CHARS = 2000;

  const {
    control,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<selfIntroSchemaType>({
    resolver: yupResolver(selfIntroSchema),
    defaultValues: { selfIntro: defaultValues?.selfIntro || "" },
    mode: "onSubmit",
  });

  const value = watch("selfIntro") ?? "";

  return (
    <div>
      <form
        id="stepOneForm"
        onSubmit={handleSubmit(onNext)}
        className="card-common space-y-8 min-h-[200px]"
        noValidate
      >
        <h4 className="text-xl text-foreground font-semibold">Here's your first message to your doctor. Please introduce yourself and feel free to:</h4>

        <ul className="list-inside list-disc text-base text-foreground font-medium">
          <li>Ask any questions you have</li>
          <li>List any medical problem you have which were not discussed above</li>
          <li>Include anything else you would like the doctor to know</li>
        </ul>

        <div>
          <Controller
            name="selfIntro"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                resize="vertical"
                autosize
                placeholder="Write something..."
                minRows={5}
                aria-invalid={!!errors.selfIntro}
                aria-describedby={errors.selfIntro ? "selfIntro-error" : undefined}
              />
            )}
          />
          <div className="flex items-center justify-between pt-3">
            <p className={errors.selfIntro ? "text-red-500" : "text-gray-500"}>
              {value.length} / {MAX_CHARS}
            </p>

            {errors.selfIntro ? (
              <p
                id="selfIntro-error"
                className="text-red-500"
              >
                {errors.selfIntro.message}
              </p>
            ) : null}
          </div>
        </div>
      </form>

      <div className="flex justify-between mt-6">
        <div className="flex gap-6 sm:ms-auto sm:mx-0 mx-auto">
          <Button
            px={0}
            variant="outline"
            onClick={onBack}
            className="sm:w-[256px] w-[120px]"
          >
            Back
          </Button>

          <Button
            type="submit"
            className="sm:w-[256px] w-[120px]"
            form="stepOneForm"
            loading={isLoading}
          >
            {isFinalStep ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelfIntroDuce;
