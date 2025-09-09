import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface LastDosageProps {
  onNext: (data: LastDosageFormType) => void;
  onBack: () => void;
  defaultValues?: LastDosageFormType;
}

// Schema + Type
const schema = yup.object({
  lastDosage: yup.string().required("Please enter your last dosage."),
});

type LastDosageFormType = yup.InferType<typeof schema>;

const LastDosage = ({ onNext, onBack, defaultValues }: LastDosageProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LastDosageFormType>({
    defaultValues: {
      lastDosage: defaultValues?.lastDosage || "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: LastDosageFormType) => {
    onNext(data);
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="LastDosageForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <h2 className="text-center text-3xl font-semibold text-foreground font-poppins animate-title">What was your last dosage?</h2>

        <TextInput
          {...register("lastDosage")}
          placeholder="Enter your last dosage (e.g., 2 mg, 10 IU)"
          error={errors.lastDosage?.message}
          className="mt-6 animate-content"
        />

        <div className="flex justify-center gap-6 pt-6 animate-btns">
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
            form="LastDosageForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LastDosage;
