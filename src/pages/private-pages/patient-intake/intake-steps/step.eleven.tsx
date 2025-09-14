import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const step11Schema = yup.object({
  gallbladder: yup.string().required("Please select at least one value."),
  removedGallbladder: yup.string().when("gallbladder", {
    is: "Yes",
    then: (schema) => schema.required("Please select at least one value."),
  }),
  whenGallbladderRemoved: yup.string().when("removedGallbladder", {
    is: "Yes",
    then: (schema) => schema.required("Please select at least one value."),
  }),
});

export type step11SchemaType = yup.InferType<typeof step11Schema>;

interface StepElevenProps {
  onNext: (data: step11SchemaType) => void;
  onBack: () => void;
  defaultValues?: step11SchemaType;
}

const StepEleven = ({ onNext, onBack, defaultValues }: StepElevenProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<step11SchemaType>({
    defaultValues: {
      gallbladder: defaultValues?.gallbladder || "",
      removedGallbladder: defaultValues?.removedGallbladder || "",
      whenGallbladderRemoved: defaultValues?.whenGallbladderRemoved || "",
    },
    resolver: yupResolver(step11Schema),
  });

  const gallbladder = watch("gallbladder");
  const removedGallbladder = watch("removedGallbladder");
  const whenGallbladderRemoved = watch("whenGallbladderRemoved");

  const showRemovedGallbladder = gallbladder === "Yes";
  const showWhenRemoved = removedGallbladder === "Yes";

  const yesNoOptions = ["Yes", "No"];
  const removedTimeOptions = ["Within the last 2 months", "More than 2 months ago"];

  const handleSelect = (field: keyof step11SchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
    if (field === "gallbladder") {
      setValue("removedGallbladder", "");
      setValue("whenGallbladderRemoved", "");
    }
    if (field === "removedGallbladder") {
      setValue("whenGallbladderRemoved", "");
    }
  };

  return (
    <form
      id="step11Form"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      {/* Gallbladder history */}
      <Radio.Group
        value={gallbladder}
        label="Do you have a personal history of gallbladder disease?"
        classNames={{
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid sm:grid-cols-2 gap-5">
          {yesNoOptions.map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(gallbladder, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {gallbladder === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
              onChange={() => handleSelect("gallbladder", option)}
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.gallbladder)}</p>
      </Radio.Group>

      {/* Gallbladder removed */}
      {showRemovedGallbladder && (
        <Radio.Group
          value={removedGallbladder}
          label="Did you have your gallbladder removed?"
          classNames={{
            label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
          }}
        >
          <div className="grid sm:grid-cols-2 gap-5">
            {yesNoOptions.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(removedGallbladder, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {removedGallbladder === option && (
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                        <i className="icon-tick text-sm/none"></i>
                      </span>
                    )}
                  </div>
                }
                onChange={() => handleSelect("removedGallbladder", option)}
              />
            ))}
          </div>
          <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.removedGallbladder)}</p>
        </Radio.Group>
      )}

      {/* When removed */}
      {showWhenRemoved && (
        <Radio.Group
          value={whenGallbladderRemoved}
          label="When did you have your gallbladder removed?"
          classNames={{
            label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
          }}
        >
          <div className="grid sm:grid-cols-2 gap-5">
            {removedTimeOptions.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(whenGallbladderRemoved, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {whenGallbladderRemoved === option && (
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                        <i className="icon-tick text-sm/none"></i>
                      </span>
                    )}
                  </div>
                }
                onChange={() => handleSelect("whenGallbladderRemoved", option)}
              />
            ))}
          </div>
          <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.whenGallbladderRemoved)}</p>
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
          form="step11Form"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StepEleven;
