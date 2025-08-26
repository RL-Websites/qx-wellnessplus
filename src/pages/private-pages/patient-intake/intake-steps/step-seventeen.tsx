import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Grid, Input, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const pepTideHistoryList = [
  "None of these",
  "Pancreatitis",
  "Medullary thyroid cancer",
  "Multiple endocrine neoplasia",
  "Wilson's disease",
  "MTHFR",
  "Vitiligo",
  "Erectile dysfunction",
  "Growth hormone deficiency",
  "Growth hormone excess",
  "Addison's  disease",
];

export const step17Schema = yup.object({
  peptidePrimaryGoal: yup.string().required("Please mention your primary goal."),
  peptideTherapyUsed: yup.string().required("Please select at least one value."),
  hormoneSensitiveCancers: yup.string().required("Please select at least one value."),
  endocrineAutoimmune: yup.string().required("Please select at least one value."),
  hormoneTherapySupple: yup.string().required("Please select at least one value."),
  physicActLevel: yup.string().required("Please mention your physical activity level."),
  peptideHealthHistory: yup.string().required("At least one option must be selected"),
});

export type Step17SchemaType = yup.InferType<typeof step17Schema>;

interface StepSeventeenProps {
  onNext: (data: Step17SchemaType) => void;
  onBack: () => void;
  defaultValues?: Step17SchemaType;
  isLoading?: boolean;
}

const StepSeventeen = ({ onNext, onBack, defaultValues, isLoading = false }: StepSeventeenProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm<Step17SchemaType>({
    defaultValues: {
      peptidePrimaryGoal: defaultValues?.peptidePrimaryGoal || "",
      peptideTherapyUsed: defaultValues?.peptideTherapyUsed || "",
      hormoneSensitiveCancers: defaultValues?.hormoneSensitiveCancers || "",
      endocrineAutoimmune: defaultValues?.endocrineAutoimmune || "",
      hormoneTherapySupple: defaultValues?.hormoneTherapySupple || "",
      physicActLevel: defaultValues?.physicActLevel || "",
      peptideHealthHistory: defaultValues?.peptideHealthHistory || "",
    },
    resolver: yupResolver(step17Schema),
  });

  const peptideTherapyUsed = watch("peptideTherapyUsed");
  const hormoneSensitiveCancers = watch("hormoneSensitiveCancers");
  const endocrineAutoimmune = watch("endocrineAutoimmune");
  const hormoneTherapySupple = watch("hormoneTherapySupple");
  const selectedHistory = watch("peptideHealthHistory")?.split(", ") || [];

  const toggleHistory = (value: string) => {
    let updated: string[];
    if (selectedHistory.includes(value)) {
      updated = selectedHistory.filter((v) => v !== value);
    } else {
      updated = [...selectedHistory, value];
    }
    setValue("peptideHealthHistory", updated.join(", "), { shouldValidate: true });
    clearErrors("peptideHealthHistory");
  };

  const handleSelect = (field: keyof Step17SchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  return (
    <form
      id="step17Form"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      <div>
        <Input.Wrapper
          label="What is your primary goal with peptide therapy?"
          withAsterisk
          classNames={{
            root: "sm:!grid !block",
            error: "sm:!text-end !text-start w-full",
            label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
          }}
        >
          <Input
            type="text"
            {...register("peptidePrimaryGoal")}
          />
        </Input.Wrapper>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.peptidePrimaryGoal)}</p>
      </div>

      {/* Peptide therapy used */}
      <Radio.Group
        value={peptideTherapyUsed}
        onChange={(val) => handleSelect("peptideTherapyUsed", val)}
        label="Have you used peptide therapies before?"
        classNames={{
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(peptideTherapyUsed, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {peptideTherapyUsed === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.peptideTherapyUsed)}</p>
      </Radio.Group>

      {/* Hormone-sensitive cancers */}
      <Radio.Group
        value={hormoneSensitiveCancers}
        onChange={(val) => handleSelect("hormoneSensitiveCancers", val)}
        label="Do you have any history of hormone-sensitive cancers (e.g. breast, prostate)?"
        classNames={{
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(hormoneSensitiveCancers, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {hormoneSensitiveCancers === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.hormoneSensitiveCancers)}</p>
      </Radio.Group>

      {/* Endocrine / autoimmune */}
      <Radio.Group
        value={endocrineAutoimmune}
        onChange={(val) => handleSelect("endocrineAutoimmune", val)}
        label="Do you have any known endocrine or autoimmune disorders?"
        classNames={{
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(endocrineAutoimmune, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {endocrineAutoimmune === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.endocrineAutoimmune)}</p>
      </Radio.Group>

      {/* Hormone therapy / supplements */}
      <Radio.Group
        value={hormoneTherapySupple}
        onChange={(val) => handleSelect("hormoneTherapySupple", val)}
        label="Are you currently taking hormone therapy, supplements, or other performance enhancers?"
        classNames={{
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(hormoneTherapySupple, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {hormoneTherapySupple === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.hormoneTherapySupple)}</p>
      </Radio.Group>

      <div>
        <Input.Wrapper
          label="What is your typical physical activity level?"
          withAsterisk
          error={getErrorMessage(errors.physicActLevel)}
          classNames={{
            root: "sm:!grid !block",
            error: "sm:!text-end !text-start w-full",
            label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
          }}
        >
          <Input
            type="text"
            {...register("physicActLevel")}
          />
        </Input.Wrapper>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.physicActLevel)}</p>
      </div>

      <div>
        <h3 className="sm:text-2xl text-lg font-semibold text-foreground font-poppins">Health History (Needed for Peptide Treatments) (Select all that apply)</h3>
        <Grid
          gutter="md"
          className="mt-6"
        >
          {pepTideHistoryList.map((option) => {
            const isChecked = selectedHistory.includes(option);
            return (
              <Grid.Col
                span={{ sm: 6 }}
                key={option}
              >
                <div
                  onClick={() => toggleHistory(option)}
                  className={`cursor-pointer border rounded-2xl px-6 py-4 flex justify-between items-center transition-all ${
                    isChecked ? "border-primary bg-white text-black shadow-sm" : "border-grey-medium bg-transparent text-black"
                  }`}
                >
                  <span className="text-base font-medium font-poppins">{option}</span>
                  <Checkbox
                    checked={isChecked}
                    readOnly
                    size="md"
                    radius="md"
                    classNames={{
                      input: isChecked ? "bg-primary border-primary text-white" : "bg-transparent border-foreground",
                    }}
                  />
                </div>
              </Grid.Col>
            );
          })}
        </Grid>
        {errors.peptideHealthHistory && <div className="text-danger text-sm mt-2 text-center">{errors.peptideHealthHistory.message}</div>}
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
          form="step17Form"
          loading={isLoading}
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StepSeventeen;
