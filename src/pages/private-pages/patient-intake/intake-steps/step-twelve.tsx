import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step12Schema = yup.object({
  pancreatitis: yup.string().required("Please select at least one value."),
  gallstones: yup.string().when("pancreatitis", {
    is: "Yes",
    then: (schema) => schema.required("Please select at least one value."),
  }),
  removedGallbladderGallstones: yup.string().when("gallstones", {
    is: "Yes",
    then: (schema) => schema.required("Please select at least one value."),
  }),
});

export type step12SchemaType = yup.InferType<typeof step12Schema>;

interface StepTwelveProps {
  onNext: (data: step12SchemaType) => void;
  onBack: () => void;
  defaultValues?: step12SchemaType;
}

const StepTwelve = ({ onNext, onBack, defaultValues }: StepTwelveProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<step12SchemaType>({
    defaultValues: {
      pancreatitis: defaultValues?.pancreatitis || "",
      gallstones: defaultValues?.gallstones || "",
      removedGallbladderGallstones: defaultValues?.removedGallbladderGallstones || "",
    },
    resolver: yupResolver(step12Schema),
  });

  const pancreatitis = watch("pancreatitis");
  const gallstones = watch("gallstones");
  const removedGallbladderGallstones = watch("removedGallbladderGallstones");

  const showGallstones = pancreatitis === "Yes";
  const showRemovedGallbladder = gallstones === "Yes";

  const handleSelect = (field: keyof step12SchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  return (
    <form
      id="step12Form"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      <Radio.Group
        value={pancreatitis}
        onChange={(value) => {
          handleSelect("pancreatitis", value);
          setValue("gallstones", "");
          setValue("removedGallbladderGallstones", "");
          clearErrors("gallstones");
          clearErrors("removedGallbladderGallstones");
        }}
        label="Do you have a personal history of acute or chronic pancreatitis?"
        error={getErrorMessage(errors?.pancreatitis)}
        classNames={{
          root: "sm:!grid !block",
          error: "sm:!text-end !text-start w-full",
          label: "sm:!text-3xl pb-2",
        }}
      >
        <div className="grid grid-cols-2 gap-5">
          {["Yes", "No"].map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(pancreatitis, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {pancreatitis === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 right-3 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
      </Radio.Group>

      {showGallstones && (
        <Radio.Group
          value={gallstones}
          onChange={(value) => {
            handleSelect("gallstones", value);
            setValue("removedGallbladderGallstones", "");
            clearErrors("removedGallbladderGallstones");
          }}
          label="Did you have your gallbladder removed due to pancreatitis from gallstones?"
          error={getErrorMessage(errors?.gallstones)}
          classNames={{ label: "!text-3xl pt-10 pb-2" }}
        >
          <div className="grid grid-cols-2 gap-5">
            {["Yes", "No"].map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(gallstones, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {gallstones === option && (
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 right-3 -translate-y-1/2">
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

      {showRemovedGallbladder && (
        <Radio.Group
          value={removedGallbladderGallstones}
          onChange={(value) => handleSelect("removedGallbladderGallstones", value)}
          label="When did you have your gallbladder removed?"
          error={getErrorMessage(errors?.removedGallbladderGallstones)}
          classNames={{ label: "!text-3xl pt-10 pb-2" }}
        >
          <div className="grid grid-cols-1 gap-5">
            {["Within the last 2 months", "More than 2 months ago"].map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(removedGallbladderGallstones, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {removedGallbladderGallstones === option && (
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 right-3 -translate-y-1/2">
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
          form="step12Form"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StepTwelve;
