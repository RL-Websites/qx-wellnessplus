import { Button, Grid, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";

interface PregnancyStatusProps {
  onNext: (data: PregnancyStatusFormType & { disqualified: boolean }) => void;
  onBack: () => void;
  defaultValues?: PregnancyStatusFormType;
}

type PregnancyStatusFormType = {
  status: "Pregnant (disqualifier)" | "Planning to become pregnant (disqualifier)" | "Breastfeeding (disqualifier)" | "None of the above" | "";
};

const options = ["Pregnant (disqualifier)", "Planning to become pregnant (disqualifier)", "Breastfeeding (disqualifier)", "None of the above"];

const PregnancyStatus = ({ onNext, onBack, defaultValues }: PregnancyStatusProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PregnancyStatusFormType>({
    defaultValues: {
      status: defaultValues?.status || "",
    },
  });

  const status = watch("status");

  const onSubmit = (data: PregnancyStatusFormType) => {
    const disqualified =
      data.status === "Pregnant (disqualifier)" || data.status === "Planning to become pregnant (disqualifier)" || data.status === "Breastfeeding (disqualifier)";
    onNext({ ...data, disqualified });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="PregnancyStatusForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <h2 className="text-center text-3xl font-semibold text-foreground font-poppins">Are you currently pregnant, planning to become pregnant, or breastfeeding?</h2>

        <Radio.Group
          value={status}
          onChange={(value) => setValue("status", value as PregnancyStatusFormType["status"], { shouldValidate: true })}
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
                      ${status === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                    `,
                  }}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {status === option && (
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

        {errors.status && <div className="text-danger text-sm mt-2 text-center">{errors.status.message}</div>}

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
            form="PregnancyStatusForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PregnancyStatus;
