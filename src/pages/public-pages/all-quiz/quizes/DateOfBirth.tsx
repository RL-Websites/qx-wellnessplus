import { BaseWebDatePickerOverrides } from "@/common/configs/baseWebOverrides";
import { selectedCategoryAtom } from "@/common/states/category.atom";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input } from "@mantine/core";
import { BaseProvider, LightTheme } from "baseui";
import { Datepicker as UberDatePicker } from "baseui/datepicker";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Client as Styletron } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";
import * as yup from "yup";

const dobSchema = yup.object({
  date_of_birth: yup
    .date()
    .required("Please enter your date of birth & age must be at least 18 years old")
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), "You must be at least 18 years old"),
});

type dobSchemaType = yup.InferType<typeof dobSchema>;

interface IDobProps {
  onNext: (data: dobSchemaType) => void;
  onBack: () => void;
  defaultValues?: dobSchemaType;
}

export default function DateOfBirth({ onNext, onBack, defaultValues }: IDobProps) {
  const engine = new Styletron();
  const [dob, setDob] = useState<any>(defaultValues?.date_of_birth ?? null);
  const selectedCategory = useAtomValue(selectedCategoryAtom);
  // console.log(selectedCategory);

  const maxDate = new Date();

  if (selectedCategory === "Testosterone") {
    maxDate.setFullYear(maxDate.getFullYear() - 22);
  } else {
    maxDate.setFullYear(maxDate.getFullYear() - 18);
  }

  const minDate = new Date("1920-01-01");

  const {
    clearErrors,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<dobSchemaType>({
    resolver: yupResolver(dobSchema),
    defaultValues,
  });

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <h2 className="heading-text text-foreground uppercase text-center">Date of Birth</h2>
      <div className="card-common card-common-width relative z-10">
        <form
          id="dobForm"
          className="w-full"
          onSubmit={handleSubmit(onNext)}
        >
          <Input.Wrapper
            label="Date of Birth"
            error={getErrorMessage(errors.date_of_birth)}
            withAsterisk
            className="sm:col-span-1 col-span-2"
          >
            <div className={`${errors?.date_of_birth ? "baseWeb-error" : ""} dml-Input-wrapper dml-Input-Calendar relative`}>
              <StyletronProvider value={engine}>
                <BaseProvider theme={LightTheme}>
                  <UberDatePicker
                    aria-label="Select a date"
                    placeholder="MM/DD/YYYY"
                    formatString="MM/dd/yyyy"
                    highlightedDate={maxDate}
                    maxDate={maxDate}
                    minDate={minDate}
                    value={dob}
                    mask="99/99/9999"
                    error={!!errors.date_of_birth}
                    onChange={(data) => {
                      if (data?.date) {
                        setDob([data.date]);
                        setValue("date_of_birth", data.date, { shouldValidate: true });
                        clearErrors("date_of_birth");
                      }
                    }}
                    overrides={BaseWebDatePickerOverrides}
                  />
                </BaseProvider>
              </StyletronProvider>
            </div>
          </Input.Wrapper>
        </form>
      </div>
      <div className="flex justify-center gap-6 pt-8 relative z-0">
        <Button
          variant="outline"
          className="w-[200px]"
          component={Link}
          to="/category"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="w-[200px]"
          form="dobForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
