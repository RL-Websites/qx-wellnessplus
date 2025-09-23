import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Radio, Textarea } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const MedsAllergySchema = yup.object({
  hasAllergy: yup.string().required("Please select at least one value."),
  nameAllergy: yup.string().when("hasAllergy", {
    is: "Yes",
    then: (schema) => schema.required("Please mention the allergies you previously had."),
  }),
  prescribed: yup.string().required("Please select at least one value."),
  medicines: yup.string().when("prescribed", {
    is: "Yes",
    then: (schema) => schema.required("Please mention the medicines you previously taken."),
  }),
});

export type MedsAllergySchemaType = yup.InferType<typeof MedsAllergySchema>;

interface MedsAllergyProps {
  onNext: (data: MedsAllergySchemaType) => void;
  onBack: () => void;
  defaultValues?: MedsAllergySchemaType;
}

const MedsAllergy = ({ onNext, onBack, defaultValues }: MedsAllergyProps) => {
  const MAX_CHARS = 500;
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    register,
    formState: { errors },
  } = useForm<MedsAllergySchemaType>({
    defaultValues: {
      hasAllergy: defaultValues?.hasAllergy || "",
      nameAllergy: defaultValues?.nameAllergy || "",
      prescribed: defaultValues?.prescribed || "",
      medicines: defaultValues?.medicines || "",
    },
    resolver: yupResolver(MedsAllergySchema),
  });

  const hasAllergy = watch("hasAllergy");
  const prescribed = watch("prescribed");
  const allergyMedicineList = watch("nameAllergy") ?? "";

  const showAllergyNames = hasAllergy === "Yes";
  const showMedicineNames = prescribed === "Yes";

  const yesNoOptions = ["Yes", "No"];

  const handleSelect = (field: keyof MedsAllergySchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    clearErrors(field);
  };

  return (
    <form
      id="MedsAllergyForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-[800px] mx-auto space-y-10 pt-10"
    >
      {/* Allergy Section */}
      <Radio.Group
        value={hasAllergy}
        onChange={(value) => {
          handleSelect("hasAllergy", value);
          setValue("nameAllergy", "");
        }}
        label="Do you have any allergy?"
        classNames={{
          root: "w-full",
          label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
        }}
      >
        <div className="grid grid-cols-2 gap-5">
          {yesNoOptions.map((option) => (
            <Radio
              key={option}
              value={option}
              classNames={getBaseWebRadios(hasAllergy, option)}
              label={
                <div className="relative text-center">
                  <span className="text-foreground font-poppins">{option}</span>
                  {hasAllergy === option && (
                    <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                      <i className="icon-tick text-sm/none"></i>
                    </span>
                  )}
                </div>
              }
            />
          ))}
        </div>
        <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.hasAllergy)}</p>
      </Radio.Group>

      {showAllergyNames && (
        <div className="pt-8">
          <Textarea
            {...register("nameAllergy")}
            label="Please list any allergies you have (example: Sneezing, Runny Nose, Skin Rash, Difficulty Breathing and etc.):"
            resize="vertical"
            autosize
            placeholder="Write something..."
            minRows={5}
            aria-invalid={!!errors.nameAllergy}
            aria-describedby={errors.nameAllergy ? "selfIntro-error" : undefined}
          />

          <div className="flex items-center justify-between pt-3">
            <p className={errors.nameAllergy ? "text-red-500" : "text-gray-500"}>
              {allergyMedicineList.length} / {MAX_CHARS}
            </p>

            {errors.nameAllergy ? (
              <p
                id="selfIntro-error"
                className="text-red-500"
              >
                {errors.nameAllergy.message}
              </p>
            ) : null}
          </div>
        </div>
      )}

      {/* Prescribed Medicines Section */}
      <div>
        <p className="text-foreground text-base pb-6">
          Please list any prescribed and over-the-counter medications you take. It is important that you list <b>ALL medications AND dosages</b> you are currently taking. If you do
          not take any prescribed or OTC medications or supplements, select “No”.
        </p>
        <Radio.Group
          value={prescribed}
          onChange={(value) => {
            handleSelect("prescribed", value);
            setValue("medicines", "");
          }}
          label="Do you take any prescribed medications?"
          classNames={{
            label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
          }}
        >
          <div className="grid grid-cols-2 gap-5">
            {yesNoOptions.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(prescribed, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {prescribed === option && (
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                        <i className="icon-tick text-sm/none"></i>
                      </span>
                    )}
                  </div>
                }
              />
            ))}
          </div>
          <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.prescribed)}</p>
        </Radio.Group>
      </div>

      {showMedicineNames && (
        <div>
          <Input.Wrapper
            label="Please specify the medications you take (Example: Amoxicillin - 500mg - 7 days, Ibuprofen - 200mg - 5 days, Tylenol - unknown)"
            withAsterisk
            className="pt-8"
            classNames={{
              label: "lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2",
            }}
          >
            <Input
              type="text"
              {...register("medicines")}
            />
          </Input.Wrapper>
          <p className="text-sm text-danger text-center mt-3">{getErrorMessage(errors?.medicines)}</p>
        </div>
      )}

      {/* Buttons */}
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
          form="MedsAllergyForm"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default MedsAllergy;
