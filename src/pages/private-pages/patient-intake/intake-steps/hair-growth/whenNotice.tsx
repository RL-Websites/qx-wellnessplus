import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const whenNoticeSchema = yup.object({
  firstNotice: yup.string().required("Please select when you first noticed hair loss."),
  hairLossType: yup.string().required("Please select your type of hair loss."),
  hairLossArea: yup.string().required("Please select where the hair loss is most noticeable."),
});

export type whenNoticeSchemaType = yup.InferType<typeof whenNoticeSchema>;

interface WhenNoticeProps {
  onNext: (data: whenNoticeSchemaType) => void;
  onBack: () => void;
  defaultValues?: whenNoticeSchemaType;
}

const WhenNotice = ({ onNext, onBack, defaultValues }: WhenNoticeProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<whenNoticeSchemaType>({
    resolver: yupResolver(whenNoticeSchema),
    defaultValues: {
      firstNotice: defaultValues?.firstNotice || "",
      hairLossType: defaultValues?.hairLossType || "",
      hairLossArea: defaultValues?.hairLossArea || "",
    },
  });

  const firstNotice = watch("firstNotice");
  const hairLossType = watch("hairLossType");
  const hairLossArea = watch("hairLossArea");

  const handleSelect = (field: keyof whenNoticeSchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  const renderOptions = (fieldValue: string, fieldName: keyof whenNoticeSchemaType, options: string[]) =>
    options.map((option) => (
      <Radio
        key={option}
        value={option}
        classNames={getBaseWebRadios(fieldValue, option)}
        label={
          <div className="relative text-center">
            <span className="text-foreground font-poppins">{option}</span>
            {fieldValue === option && (
              <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                <i className="icon-tick text-sm/none"></i>
              </span>
            )}
          </div>
        }
      />
    ));

  return (
    <form
      id="whenNoticeForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      {/* Q1 */}
      <Radio.Group
        label="When did you first notice hair loss or thinning?"
        value={firstNotice}
        onChange={(val) => handleSelect("firstNotice", val)}
        error={getErrorMessage(errors.firstNotice)}
        classNames={{
          root: "sm:!grid !block",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
          error: "sm:!text-end !text-start w-full",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">{renderOptions(firstNotice, "firstNotice", ["Less than 6 months ago", "6-12 months ago", "More than a year ago"])}</div>
      </Radio.Group>

      {/* Q2 */}
      <Radio.Group
        label="Is your hair loss:"
        value={hairLossType}
        onChange={(val) => handleSelect("hairLossType", val)}
        error={getErrorMessage(errors.hairLossType)}
        classNames={{
          root: "sm:!grid !block",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
          error: "sm:!text-end !text-start w-full",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">{renderOptions(hairLossType, "hairLossType", ["Gradual thinning", "Patchy/bald spots", "Sudden shedding"])}</div>
      </Radio.Group>

      {/* Q3 */}
      <Radio.Group
        label="Where is the hair loss most noticeable?"
        value={hairLossArea}
        onChange={(val) => handleSelect("hairLossArea", val)}
        error={getErrorMessage(errors.hairLossArea)}
        classNames={{
          root: "sm:!grid !block",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
          error: "sm:!text-end !text-start w-full",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">{renderOptions(hairLossArea, "hairLossArea", ["Front hairline", "Top of scalp", "Crown/back of head", "All over"])}</div>
      </Radio.Group>

      {/* Navigation Buttons */}
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
          form="whenNoticeForm"
          className="w-[200px]"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default WhenNotice;
