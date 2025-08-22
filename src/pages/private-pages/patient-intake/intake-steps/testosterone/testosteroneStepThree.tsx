import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const TestosteroneStepThreeSchema = yup.object({
  priorEdTreatment: yup.string().required("Please select at least one value."),
  psychStress: yup.string().required("Please select at least one value."),
  pelvicHistory: yup.string().required("Please select at least one value."),
});

export type TestosteroneStepThreeSchemaType = yup.InferType<typeof TestosteroneStepThreeSchema>;

interface Props {
  onNext: (data: TestosteroneStepThreeSchemaType) => void;
  onBack: () => void;
  defaultValues?: Partial<TestosteroneStepThreeSchemaType>;
}

const TestosteroneStepThree = ({ onNext, onBack, defaultValues }: Props) => {
  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<TestosteroneStepThreeSchemaType>({
    defaultValues: {
      priorEdTreatment: defaultValues?.priorEdTreatment || "",
      psychStress: defaultValues?.psychStress || "",
      pelvicHistory: defaultValues?.pelvicHistory || "",
    },
    resolver: yupResolver(TestosteroneStepThreeSchema),
  });

  const priorEdTreatment = watch("priorEdTreatment");
  const psychStress = watch("psychStress");
  const pelvicHistory = watch("pelvicHistory");

  const handleSelect = (field: keyof TestosteroneStepThreeSchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  return (
    <form
      id="TestosteroneStepThreeForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      {/* Q8 */}
      <Radio.Group
        value={priorEdTreatment}
        onChange={(val) => handleSelect("priorEdTreatment", val)}
        label="Have you ever tried ED medications or treatments before?"
        error={getErrorMessage(errors.priorEdTreatment)}
        classNames={{
          root: "sm:!grid !block",
          error: "sm:!text-end !text-start w-full",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes — effective", "Yes — not effective", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(priorEdTreatment, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {priorEdTreatment === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
      </Radio.Group>

      {/* Q9 */}
      <Radio.Group
        value={psychStress}
        onChange={(val) => handleSelect("psychStress", val)}
        label="Are you experiencing psychological stress, anxiety, or depression?"
        error={getErrorMessage(errors.psychStress)}
        classNames={{
          root: "sm:!grid !block",
          error: "sm:!text-end !text-start w-full",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(psychStress, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {psychStress === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
      </Radio.Group>

      {/* Q10 */}
      <Radio.Group
        value={pelvicHistory}
        onChange={(val) => handleSelect("pelvicHistory", val)}
        label="Do you have any history of surgeries or injuries affecting the pelvic area?"
        error={getErrorMessage(errors.pelvicHistory)}
        classNames={{
          root: "sm:!grid !block",
          error: "sm:!text-end !text-start w-full",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(pelvicHistory, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {pelvicHistory === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
      </Radio.Group>

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
          form="TestosteroneStepThreeForm"
          className="w-[200px]"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default TestosteroneStepThree;
