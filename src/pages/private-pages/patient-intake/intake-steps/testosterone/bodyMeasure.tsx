import { heightAtom } from "@/common/states/height.atom";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, NumberInput } from "@mantine/core";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const bodyMeasureSchema = yup.object({
  measurement: yup.object({
    height_feet: yup
      .string()
      .required(({ label }) => `${label} is required`)
      .label("Feet"),
    height_inch: yup
      .string()
      .required(({ label }) => `${label} is required`)
      .label("Inches"),
    weight: yup
      .string()
      .required(({ label }) => `${label} is required`)
      .label("Weight"),
  }),
});

export type BodyMeasureSchemaType = yup.InferType<typeof bodyMeasureSchema>;

interface BodyMeasureProps {
  onNext: (data: BodyMeasureSchemaType) => void;
  onBack?: () => void;
  defaultValues?: BodyMeasureSchemaType;
  isLoading?: boolean;
}

const BodyMeasure = ({ onNext, onBack, defaultValues, isLoading = false }: BodyMeasureProps) => {
  const [heightObj, setHeightObj] = useAtom(heightAtom);
  const [heightFeet, setHeightFeet] = useState<string>("");
  const [heightInch, setHeightInch] = useState<string>("");
  const [weight, setWeight] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<BodyMeasureSchemaType>({
    resolver: yupResolver(bodyMeasureSchema),
    defaultValues: {
      measurement: {
        height_feet: defaultValues?.measurement?.height_feet || "",
        height_inch: defaultValues?.measurement?.height_inch || "",
        weight: defaultValues?.measurement?.weight || "",
      },
    },
  });

  useEffect(() => {
    if (defaultValues?.measurement?.height_feet) {
      setValue("measurement.height_feet", defaultValues.measurement.height_feet);
      setHeightFeet(defaultValues.measurement.height_feet || "");
      setValue("measurement.height_inch", defaultValues.measurement.height_inch);
      setHeightInch(defaultValues.measurement.height_inch || "");
      setValue("measurement.weight", defaultValues.measurement.weight);
      setWeight(defaultValues.measurement.weight || "");
    } else {
      setValue("measurement.height_feet", heightObj?.height_feet?.toString() || "");
      setHeightFeet(heightObj?.height_feet?.toString() || "");
      setValue("measurement.height_inch", heightObj?.height_inch?.toString() || "");
      setHeightInch(heightObj?.height_inch?.toString() || "");
    }
  }, [defaultValues, heightObj, setValue]);

  return (
    <form
      id="stepBodyMeasureForm"
      onSubmit={handleSubmit(onNext)}
      className="card-common pt-12 space-y-8"
    >
      <div className="card-title with-border">
        <h6 className="text-[30px] font-semibold text-foreground font-poppins">Body Measurements</h6>
      </div>

      <Input.Wrapper
        label="Current Height"
        required
        className="md:col-span-1 col-span-2"
        styles={{
          label: { fontWeight: 500, marginBottom: "0.5rem" },
        }}
        withAsterisk
      >
        <div className="grid grid-cols-2 gap-5">
          <NumberInput
            placeholder="Feet"
            value={heightFeet}
            {...register("measurement.height_feet")}
            onChange={(value) => {
              const v = value?.toString() || "";
              setHeightFeet(v);
              setValue("measurement.height_feet", v);
              if (v) clearErrors("measurement.height_feet");
            }}
            min={0}
            max={99}
            hideControls
            clampBehavior="strict"
          />

          <NumberInput
            placeholder="Inches"
            value={heightInch}
            {...register("measurement.height_inch")}
            onChange={(value) => {
              const v = value?.toString() || "";
              setHeightInch(v);
              setValue("measurement.height_inch", v);
              if (v) clearErrors("measurement.height_inch");
            }}
            min={0}
            max={11}
            hideControls
            clampBehavior="strict"
          />
        </div>

        <div className="mt-2 text-danger text-sm">{getErrorMessage(errors.measurement?.height_feet) || getErrorMessage(errors.measurement?.height_inch)}</div>
      </Input.Wrapper>

      <NumberInput
        className="md:col-span-1 col-span-2"
        classNames={{
          root: "sm:!grid !block w-full",
          error: "sm:!text-end !text-start w-full",
        }}
        label="Current Weight (lbs)"
        value={weight}
        {...register("measurement.weight")}
        onChange={(value) => {
          if (value) {
            const v = value.toString();
            setWeight(v);
            setValue("measurement.weight", v);
            clearErrors("measurement.weight");
          }
        }}
        max={999}
        min={0}
        error={getErrorMessage(errors.measurement?.weight)}
        clampBehavior="strict"
        hideControls
        allowNegative={false}
        allowDecimal={true}
        withAsterisk
      />

      <div className="flex justify-center gap-6 pt-4">
        <Button
          type="submit"
          className="w-[200px]"
          form="stepBodyMeasureForm"
          loading={isLoading}
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default BodyMeasure;
