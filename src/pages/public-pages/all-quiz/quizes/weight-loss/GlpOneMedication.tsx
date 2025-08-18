import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const glpOneMedicationSchema = yup.object({
  takesGlpOneMedication: yup.string().required("Please select your GLP-1 medication status"),
  glpOneMedicationDetails: yup.string().when("takesGlpOneMedication", {
    is: "Yes",
    then: (schema) => schema.required("Please select which GLP-1 medication you use"),
  }),
});

export type glpOneMedicationSchemaType = yup.InferType<typeof glpOneMedicationSchema>;

interface GlpOneMedicationProps {
  onNext: (data: glpOneMedicationSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: glpOneMedicationSchemaType;
}

const GlpOneMedication = ({ onNext, onBack, defaultValues }: GlpOneMedicationProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<glpOneMedicationSchemaType>({
    defaultValues: {
      takesGlpOneMedication: defaultValues?.takesGlpOneMedication || "",
      glpOneMedicationDetails: defaultValues?.glpOneMedicationDetails || "",
    },
    resolver: yupResolver(glpOneMedicationSchema),
  });

  const takesGlpOneMedication = watch("takesGlpOneMedication");
  const glpOneMedicationDetails = watch("glpOneMedicationDetails");
  const showDetails = takesGlpOneMedication === "Yes";

  const handleSelect = (field: keyof glpOneMedicationSchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  const takesGlpOptions = ["No", "Yes"];
  const glpDetailsOptions = ["Semaglutide", "Tirzepatide"];

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="glpOneMedicationForm"
        onSubmit={handleSubmit(onNext)}
        className="max-w-xl mx-auto space-y-10"
      >
        <Radio.Group
          value={takesGlpOneMedication}
          onChange={(value) => {
            handleSelect("takesGlpOneMedication", value);
            setValue("glpOneMedicationDetails", "");
            clearErrors("glpOneMedicationDetails");
          }}
          label="Are you currently or have you ever taken
GLP-1 medication?"
          classNames={{ label: "!text-3xl pb-2 text-center" }}
        >
          <div className="grid md:grid-cols-2 gap-5 w-full">
            {takesGlpOptions.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(takesGlpOneMedication, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {takesGlpOneMedication === option && (
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 right-0  -translate-y-1/2">
                        <i className="icon-tick text-sm/none"></i>
                      </span>
                    )}
                  </div>
                }
              />
            ))}
          </div>
        </Radio.Group>

        {errors.takesGlpOneMedication && <Text className="text-red-500 text-sm mt-5 text-center">{errors.takesGlpOneMedication.message}</Text>}

        {showDetails && (
          <Radio.Group
            value={glpOneMedicationDetails}
            onChange={(value) => handleSelect("glpOneMedicationDetails", value)}
            label="Which GLP-1 medication do you use?"
            classNames={{ label: "!text-3xl  pb-2" }}
          >
            <div className="grid grid-cols-1 gap-5">
              {glpDetailsOptions.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(glpOneMedicationDetails, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {glpOneMedicationDetails === option && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 right-0  -translate-y-1/2">
                          <i className="icon-tick text-sm/none"></i>
                        </span>
                      )}
                    </div>
                  }
                />
              ))}
            </div>
          </Radio.Group>
        )}
        {errors.glpOneMedicationDetails && <Text className="text-red-500 text-sm mt-5 text-center">{errors.glpOneMedicationDetails.message}</Text>}

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
            form="glpOneMedicationForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GlpOneMedication;
