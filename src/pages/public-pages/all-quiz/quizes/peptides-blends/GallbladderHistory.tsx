import { Button, Grid, Radio } from "@mantine/core";
import { useForm, useWatch } from "react-hook-form";

interface GallbladderHistoryProps {
  onNext: (data: GallbladderHistoryFormType & { disqualified: boolean }) => void;
  onBack: () => void;
  defaultValues?: GallbladderHistoryFormType;
}

type GallbladderHistoryFormType = {
  hasGallbladderHistory: "Yes" | "No" | "";
  gallbladderDetail?: string;
};

const subOptions = ["Gallbladder removed within last 2 months (disqualifier)", "Gallbladder removed more than 2 months ago"];

const GallbladderHistory = ({ onNext, onBack, defaultValues }: GallbladderHistoryProps) => {
  const {
    handleSubmit,
    setValue,
    control,
    register,
    formState: { errors },
  } = useForm<GallbladderHistoryFormType>({
    defaultValues: {
      hasGallbladderHistory: defaultValues?.hasGallbladderHistory || "",
      gallbladderDetail: defaultValues?.gallbladderDetail || "",
    },
  });

  const hasHistory = useWatch({ name: "hasGallbladderHistory", control });
  const detail = useWatch({ name: "gallbladderDetail", control });

  const onSubmit = (data: GallbladderHistoryFormType) => {
    const disqualified = data.gallbladderDetail === subOptions[0];
    onNext({ ...data, disqualified });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="GallbladderHistoryForm"
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-semibold text-foreground font-poppins animate-title">Do you have a personal history of gallbladder disease?</h2>

          {/* Step 1: Yes / No */}
          <Radio.Group
            value={hasHistory}
            onChange={(value) => {
              setValue("hasGallbladderHistory", value as "Yes" | "No");
              setValue("gallbladderDetail", "");
            }}
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
                        ${hasHistory === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                      `,
                    }}
                    label={
                      <div className="relative text-center">
                        <span className="text-foreground font-poppins">{option}</span>
                        {hasHistory === option && (
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

          {/* Step 2: Detail selection if "Yes" */}
          {hasHistory === "Yes" && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2 text-center animate-title">Please specify</h3>
              <Radio.Group
                value={detail}
                onChange={(value) => setValue("gallbladderDetail", value)}
                className="animate-content"
              >
                <Grid gutter="md">
                  {subOptions.map((option) => (
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
                            ${detail === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                          `,
                        }}
                        label={
                          <div className="relative text-center">
                            <span className="text-foreground font-poppins">{option}</span>
                            {detail === option && (
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
          )}
        </div>

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
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GallbladderHistory;
