import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object({
  hasSleepApnea: yup.string().required("Please select Yes or No."),
  apneaType: yup.string().when("hasSleepApnea", {
    is: "Yes",
    then: (schema) => schema.required("Please specify if you're using CPAP."),
    otherwise: (schema) => schema.notRequired(),
  }),
});

type SleepApneaFormType = yup.InferType<typeof schema>;

interface SleepApneaProps {
  onNext: (data: SleepApneaFormType) => void;
  onBack: () => void;
  defaultValues?: SleepApneaFormType;
}

const SleepApnea = ({ onNext, onBack, defaultValues }: SleepApneaProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SleepApneaFormType>({
    defaultValues: {
      hasSleepApnea: defaultValues?.hasSleepApnea || "",
      apneaType: defaultValues?.apneaType || "",
    },
    resolver: yupResolver(schema),
  });

  const hasSleepApnea = watch("hasSleepApnea");
  const apneaType = watch("apneaType");

  const onSubmit = (data: SleepApneaFormType) => {
    onNext(data);
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="SleepApneaForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <h2 className="text-center text-3xl font-semibold text-foreground font-poppins">Do you have diagnosed sleep apnea?</h2>

        {/* Main Yes/No */}
        <Radio.Group
          value={hasSleepApnea}
          onChange={(value) => {
            setValue("hasSleepApnea", value as "Yes" | "No", { shouldValidate: true });
            if (value === "No") setValue("apneaType", "");
          }}
          className="mt-6"
        >
          <Grid gutter="md">
            {["Yes", "No"].map((option) => (
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
                      ${hasSleepApnea === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                    `,
                  }}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {hasSleepApnea === option && (
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

        {errors.hasSleepApnea && <p className="text-danger text-sm mt-2 text-center">{errors.hasSleepApnea.message}</p>}

        {/* Follow-up if Yes */}
        {hasSleepApnea === "Yes" && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2 text-center">Are you using CPAP?</h3>

            <Radio.Group
              value={apneaType}
              onChange={(value) => setValue("apneaType", value as "using CPAP" | "not using CPAP", { shouldValidate: true })}
            >
              <Grid gutter="md">
                {["using CPAP", "not using CPAP"].map((option) => (
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
                          ${apneaType === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                        `,
                      }}
                      label={
                        <div className="relative text-center">
                          <span className="text-foreground font-poppins">{option}</span>
                          {apneaType === option && (
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

            {errors.apneaType && <p className="text-danger text-sm mt-2 text-center">{errors.apneaType.message}</p>}
          </div>
        )}

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
            form="SleepApneaForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SleepApnea;
