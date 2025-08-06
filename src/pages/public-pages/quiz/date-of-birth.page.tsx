import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const dobSchema = yup.object({
  dob: yup.date().typeError("Please provide a valid date in MM/DD/YYYY format.").required("Please provide your date of birth"),
});

type dobSchemaType = yup.InferType<typeof dobSchema>;

const DateOfBirth = () => {
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
      <div className="card-common">
        <form
          className="w-full"
          onSubmit={handleSubmit(onSubmit)}
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
                  placeholder="MM/DD/YYYY"
                  clearable
                />
              </Input.Wrapper>
            )}
          />

          <div className="text-center mt-10">
            <Button
              size="md"
              type="submit"
              className="bg-primary text-white rounded-xl lg:w-[206px]"
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DateOfBirth;
