import { Button, Grid, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";

interface PeptideTherapyEffectivenessProps {
  onNext: (data: PeptideTherapyEffectivenessFormType) => void;
  onBack: () => void;
  defaultValues?: PeptideTherapyEffectivenessFormType;
}

type PeptideTherapyEffectivenessFormType = {
  therapyEffectiveness: string;
};

const options = ["Very effective", "Somewhat effective", "Not effective"];

const PeptideTherapyEffectiveness = ({ onNext, onBack, defaultValues }: PeptideTherapyEffectivenessProps) => {
  const { setValue, handleSubmit, watch } = useForm<PeptideTherapyEffectivenessFormType>({
    defaultValues: {
      therapyEffectiveness: defaultValues?.therapyEffectiveness || "",
    },
  });

  const selected = watch("therapyEffectiveness");

  const onSubmit = (data: PeptideTherapyEffectivenessFormType) => {
    onNext(data);
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="PeptideTherapyEffectivenessForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-semibold text-foreground font-poppins animate-title">How effective do you feel peptide therapy has been for you?</h2>

          <Radio.Group
            value={selected}
            onChange={(value) => setValue("therapyEffectiveness", value, { shouldValidate: true })}
            className="mt-6 animate-content"
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
        </div>

        <div className="flex justify-center gap-6 pt-4 animate-btns">
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
            form="PeptideTherapyEffectivenessForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PeptideTherapyEffectiveness;
