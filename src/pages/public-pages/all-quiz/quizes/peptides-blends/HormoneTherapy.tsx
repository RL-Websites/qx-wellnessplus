import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface HormoneTherapyProps {
  onNext: (data: HormoneTherapyFormType) => void;
  onBack: () => void;
  defaultValues?: HormoneTherapyFormType;
}

// ✅ Validation Schema
const schema = yup.object({
  takingHormoneTherapy: yup.string().required("Please select Yes or No."),
});

type HormoneTherapyFormType = yup.InferType<typeof schema>;

const HormoneTherapy = ({ onNext, onBack, defaultValues }: HormoneTherapyProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HormoneTherapyFormType>({
    defaultValues: {
      takingHormoneTherapy: defaultValues?.takingHormoneTherapy || "",
    },
    resolver: yupResolver(schema),
  });

  const takingHormoneTherapy = watch("takingHormoneTherapy");

  const onSubmit = (data: HormoneTherapyFormType) => {
    onNext(data);
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="HormoneTherapyForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <h2 className="text-center text-3xl font-semibold text-foreground font-poppins animate-title">
          Are you currently taking hormone therapy, supplements, or other performance enhancers?
        </h2>

        <Radio.Group
          value={takingHormoneTherapy}
          onChange={(value) =>
            setValue("takingHormoneTherapy", value as "Yes" | "No", {
              shouldValidate: true,
            })
          }
          className="mt-6 animate-content"
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
                      ${takingHormoneTherapy === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                    `,
                  }}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {takingHormoneTherapy === option && (
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

        {errors.takingHormoneTherapy && <p className="text-danger text-sm mt-2 text-center">{errors.takingHormoneTherapy.message}</p>}

        <div className="flex justify-center gap-6 pt-6 animate-btns">
          <Button
            variant="outline"
            className="w-[200px]"
            onClick={onBack}
            type="button"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="w-[200px]"
            form="HormoneTherapyForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HormoneTherapy;
