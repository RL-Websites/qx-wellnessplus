import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface EndocrineAutoimmuneProps {
  onNext: (data: EndocrineAutoimmuneFormType) => void;
  onBack: () => void;
  defaultValues?: EndocrineAutoimmuneFormType;
}

const options = ["Yes", "No"];

const schema = yup.object({
  endocrineAutoimmuneDisorder: yup.string().required("Please select an option."),
});

type EndocrineAutoimmuneFormType = yup.InferType<typeof schema>;

const EndocrineAutoimmuneDisorders = ({ onNext, onBack, defaultValues }: EndocrineAutoimmuneProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EndocrineAutoimmuneFormType>({
    defaultValues: {
      endocrineAutoimmuneDisorder: defaultValues?.endocrineAutoimmuneDisorder || "",
    },
    resolver: yupResolver(schema),
  });

  const selected = watch("endocrineAutoimmuneDisorder");

  const onSubmit = (data: EndocrineAutoimmuneFormType) => {
    onNext(data);
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="EndocrineAutoimmuneForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-semibold text-foreground font-poppins">Do you have any known endocrine or autoimmune disorders?</h2>

          <Radio.Group
            value={selected}
            onChange={(value) => setValue("endocrineAutoimmuneDisorder", value, { shouldValidate: true })}
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

          {errors.endocrineAutoimmuneDisorder && <div className="text-danger text-sm mt-2 text-center">{errors.endocrineAutoimmuneDisorder.message}</div>}
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

export default EndocrineAutoimmuneDisorders;
