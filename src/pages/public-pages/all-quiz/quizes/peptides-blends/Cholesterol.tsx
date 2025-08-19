import { Button, Grid, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";

interface CholesterolProps {
  onNext: (data: CholesterolFormType) => void;
  onBack: () => void;
  defaultValues?: CholesterolFormType;
}

type CholesterolFormType = {
  cholesterolStatus: "On medication" | "Greater than 240 without medication" | "Neither" | "";
};

const options = ["On medication", "Greater than 240 without medication", "Neither"];

const Cholesterol = ({ onNext, onBack, defaultValues }: CholesterolProps) => {
  const { setValue, handleSubmit, watch } = useForm<CholesterolFormType>({
    defaultValues: {
      cholesterolStatus: defaultValues?.cholesterolStatus || "",
    },
  });

  const selected = watch("cholesterolStatus");

  const onSubmit = (data: CholesterolFormType) => {
    onNext(data);
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="CholesterolForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-semibold text-foreground font-poppins">Do you have cholesterol greater than 240 mg/dL or are you on cholesterol medication?</h2>

          <Radio.Group
            value={selected}
            onChange={(value) => setValue("cholesterolStatus", value, { shouldValidate: true })}
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
            form="CholesterolForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Cholesterol;
