import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface BodyMetricsFormProps {
  onNext: (data: BodyMetricsFormType) => void;
  onBack: () => void;
  defaultValues?: BodyMetricsFormType;
}

type BodyMetricsFormType = {
  heightInches: string;
  weightPounds: string;
  bodyComposition?: string | null; // <-- make optional or nullable
};

const schema = yup.object({
  heightInches: yup.string().required("Height is required"),
  weightPounds: yup.string().required("Weight is required"),
  bodyComposition: yup.string().notRequired(),
});

const BodyMetrics = ({ onNext, onBack, defaultValues }: BodyMetricsFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BodyMetricsFormType>({
    resolver: yupResolver<BodyMetricsFormType>(schema),
    defaultValues: {
      heightInches: defaultValues?.heightInches || "",
      weightPounds: defaultValues?.weightPounds || "",
      bodyComposition: defaultValues?.bodyComposition || "",
    },
  });

  const onSubmit = (data: BodyMetricsFormType) => {
    onNext(data);
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16 max-w-xl mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <h2 className="text-center text-3xl font-semibold text-foreground font-poppins">Please enter the following information:</h2>

        <TextInput
          label="Height (inches)"
          placeholder="Enter your height in inches"
          {...register("heightInches")}
          error={errors.heightInches?.message}
        />

        <TextInput
          label="Weight (pounds)"
          placeholder="Enter your weight in pounds"
          {...register("weightPounds")}
          error={errors.weightPounds?.message}
        />

        <TextInput
          label="Body composition (if known)"
          placeholder="Enter your body composition (optional)"
          {...register("bodyComposition")}
          error={errors.bodyComposition?.message}
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
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BodyMetrics;
