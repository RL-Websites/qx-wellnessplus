import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const dobSchema = yup.object({
  dob: yup.date().required("Please provide your date of birth"),
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
    formState: { errors },
  } = useForm<dobSchemaType>({
    resolver: yupResolver(dobSchema),
  });

  const onSubmit = (data: dobSchemaType) => {
    console.log(data);
  };

  return (
    <div className="lg:pt-16 md:pt-10 pt-4">
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
                  rightSection={!field.value ? <i className="icon-calender-1 text-2xl"></i> : null}
                />
              </Input.Wrapper>
            )}
          />

          <div className="flex justify-center gap-6 pt-4">
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
        </form>
      </div>
    </div>
  );
}
