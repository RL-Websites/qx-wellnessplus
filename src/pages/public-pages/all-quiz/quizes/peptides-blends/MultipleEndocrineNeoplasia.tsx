import { Button, Grid, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";

interface MENHistoryProps {
  onNext: (data: MENFormType & { disqualified: boolean }) => void;
  onBack: () => void;
  defaultValues?: MENFormType;
}

type MENFormType = {
  hasMENHistory: "Yes (disqualifier)" | "No" | "";
};

const options = ["Yes (disqualifier)", "No"];

const MultipleEndocrineNeoplasia = ({ onNext, onBack, defaultValues }: MENHistoryProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MENFormType>({
    defaultValues: {
      hasMENHistory: defaultValues?.hasMENHistory || "",
    },
  });

  const selected = watch("hasMENHistory");

  const onSubmit = (data: MENFormType) => {
    const disqualified = data.hasMENHistory === "Yes (disqualifier)";
    onNext({ ...data, disqualified });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="MENHistoryForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-semibold text-foreground font-poppins">Do you have a personal or family history of Multiple Endocrine Neoplasia (MEN)?</h2>

          <Radio.Group
            value={selected}
            onChange={(value) => setValue("hasMENHistory", value as MENFormType["hasMENHistory"], { shouldValidate: true })}
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
                        ${selected === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                      `,
                    }}
                    label={
                      <div className="relative text-center">
                        <span className="text-foreground font-poppins">{option}</span>
                        {selected === option && (
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

          {errors.hasMENHistory && <p className="text-danger text-sm mt-2 text-center">{errors.hasMENHistory.message}</p>}
        </div>

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
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MultipleEndocrineNeoplasia;
