import { Button, Grid, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";

interface GenderSelectionProps {
  onNext: (data: GenderFormType) => void;
  onBack: () => void;
  defaultValues?: GenderFormType;
}

type GenderFormType = {
  gender: "Male" | "Female" | "";
};

const GenderSelection = ({ onNext, onBack, defaultValues }: GenderSelectionProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GenderFormType>({
    defaultValues: {
      gender: defaultValues?.gender || "",
    },
  });

  const gender = watch("gender");

  const onSubmit = (data: GenderFormType) => {
    onNext(data);
  };

  const options = ["Male", "Female"];

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="GenderSelectionForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <h2 className="text-center text-3xl font-semibold text-foreground font-poppins">What is your gender?</h2>

        <Radio.Group
          value={gender}
          onChange={(value) => setValue("gender", value as "Male" | "Female", { shouldValidate: true })}
          className="mt-6"
        >
          <Grid gutter="md">
            {options.map((option) => (
              <Grid.Col
                span={6}
                key={option}
              >
                <Radio
                  value={option}
                  classNames={{
                    root: "relative w-full",
                    radio: "hidden",
                    inner: "hidden",
                    labelWrapper: "w-full",
                    label: `
                      block w-full h-full px-6 py-4 rounded-2xl border text-center text-base font-medium cursor-pointer
                      ${gender === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                    `,
                  }}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {gender === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 right-3 -translate-y-1/2">
                          <i className="icon-tick text-sm/none"></i>
                        </span>
                      )}
                    </div>
                  }
                />
              </Grid.Col>
            ))}
          </Grid>
        </Radio.Group>

        {errors.gender && <div className="text-danger text-sm mt-2 text-center">{errors.gender.message}</div>}

        <div className="flex justify-center gap-6 pt-6">
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
            form="GenderSelectionForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GenderSelection;
