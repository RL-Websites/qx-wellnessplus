import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface PeptideTherapyDurationProps {
  onNext: (data: PeptideTherapyDurationFormType) => void;
  onBack: () => void;
  defaultValues?: PeptideTherapyDurationFormType;
}

const options = ["Less than 1 month", "1–3 months", "4–6 months", "More than 6 months"];

const schema = yup.object({
  therapyDuration: yup.string().required("Please select a duration"),
});

export type PeptideTherapyDurationFormType = yup.InferType<typeof schema>;

const PeptideTherapyDuration = ({ onNext, onBack, defaultValues }: PeptideTherapyDurationProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PeptideTherapyDurationFormType>({
    defaultValues: {
      therapyDuration: defaultValues?.therapyDuration || "",
    },
    resolver: yupResolver(schema),
  });

  const therapyDuration = watch("therapyDuration");

  const onSubmit = (data: PeptideTherapyDurationFormType) => {
    onNext(data);
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="PeptideTherapyDurationForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <h2 className="text-center text-3xl font-semibold text-foreground font-poppins">How long have you been on your current or previous peptide therapy?</h2>

        <Radio.Group
          value={therapyDuration}
          onChange={(value) => setValue("therapyDuration", value, { shouldValidate: true })}
          className="mt-6"
        >
          <Grid gutter="md">
            {options.map((option) => (
              <Grid.Col
                span={12}
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
                      ${therapyDuration === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                    `,
                  }}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {therapyDuration === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
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

        {errors.therapyDuration && <p className="text-danger text-sm mt-2 text-center">{errors.therapyDuration.message}</p>}

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
            form="PeptideTherapyDurationForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PeptideTherapyDuration;
