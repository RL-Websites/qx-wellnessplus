import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const dobSchema = yup.object({
  dob: yup
    .date()
    .required("Please enter your date of birth & age must be at least 18 years old")
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), "You must be at least 18 years old"),
});

type dobSchemaType = yup.InferType<typeof dobSchema>;

interface IDobProps {
  onNext: (data: dobSchemaType) => void;
  onBack: () => void;
  defaultValues?: dobSchemaType;
}

export default function DateOfBirth({ onNext, onBack, defaultValues }: IDobProps) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<dobSchemaType>({
    defaultValues: {
      dob: defaultValues?.dob,
    },
    resolver: yupResolver(dobSchema),
  });

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <h2 className="heading-text text-foreground uppercase text-center">Date of Birth</h2>
      <div className="card-common card-common-width">
        <form
          id="dobForm"
          className="w-full"
          onSubmit={handleSubmit(onNext)}
        >
          <Controller
            name="dob"
            control={control}
            render={({ field }) => (
              <Input.Wrapper
                label="Date of Birth"
                className="md:col-span-1 col-span-2"
                error={errors.dob?.message}
                withAsterisk
              >
                <DateInput
                  {...field}
                  clearable
                  maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
                  rightSection={!field.value ? <i className="icon-calender-1 text-2xl"></i> : null}
                />
              </Input.Wrapper>
            )}
          />
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
          form="dobForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
