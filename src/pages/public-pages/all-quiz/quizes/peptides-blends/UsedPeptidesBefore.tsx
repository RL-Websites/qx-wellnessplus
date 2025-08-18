import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface IUsedPeptidesBeforeProps {
  onNext: (data: UsedPeptidesFormType) => void;
  onBack: () => void;
  defaultValues?: UsedPeptidesFormType;
}

const options = ["Yes", "No"];

const schema = yup.object({
  usedPeptides: yup.string().required("Please select an option."),
});

type UsedPeptidesFormType = yup.InferType<typeof schema>;

const UsedPeptidesBefore = ({ onNext, onBack, defaultValues }: IUsedPeptidesBeforeProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UsedPeptidesFormType>({
    defaultValues: {
      usedPeptides: defaultValues?.usedPeptides || "",
    },
    resolver: yupResolver(schema),
  });

  const selected = watch("usedPeptides");

  const onSubmit = (data: UsedPeptidesFormType) => {
    onNext(data);
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="UsedPeptidesBeforeForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-semibold text-foreground font-poppins">Have you used peptide therapies before?</h2>

          <Radio.Group
            value={selected}
            onChange={(value) => setValue("usedPeptides", value, { shouldValidate: true })}
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
                        ${selected === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                      `,
                    }}
                    label={
                      <div className="relative text-center">
                        <span className="text-foreground font-poppins">{option}</span>
                        {selected === option && (
                          <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 right-0  -translate-y-1/2">
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

          {errors.usedPeptides && <div className="text-danger text-sm mt-2 text-center">{errors.usedPeptides.message}</div>}
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
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UsedPeptidesBefore;
