import { BaseWebDatePickerOverrides } from "@/common/configs/baseWebOverrides";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input } from "@mantine/core";
import { BaseProvider, LightTheme } from "baseui";
import { Datepicker as UberDatePicker } from "baseui/datepicker";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Client as Styletron } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";
import * as yup from "yup";

const injectionDateSchema = yup.object({
  injection_date: yup.date().required("Please select your injection date").max(new Date(), "Injection date cannot be in the future"),
});

type InjectionDateSchemaType = yup.InferType<typeof injectionDateSchema>;

interface IInjectionDateProps {
  onNext: (data: InjectionDateSchemaType) => void;
  onBack: () => void;
  defaultValues?: InjectionDateSchemaType;
}

export default function InjectionDate({ onNext, onBack, defaultValues }: IInjectionDateProps) {
  const engine = new Styletron();
  const [injectionDate, setInjectionDate] = useState<any>(defaultValues?.injection_date ?? null);

  const maxDate = new Date();
  const minDate = new Date("1920-01-01");

  const {
    clearErrors,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<InjectionDateSchemaType>({
    resolver: yupResolver(injectionDateSchema),
    defaultValues,
  });

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <h2 className="text-center text-3xl font-poppins font-semibold text-foreground">When was your last injection?</h2>
      <div className="card-common card-common-width relative z-10">
        <form
          id="injectionDateForm"
          className="w-full"
          onSubmit={handleSubmit(onNext)}
        >
          <Input.Wrapper
            label="Injection Date"
            error={getErrorMessage(errors.injection_date)}
            withAsterisk
            className="sm:col-span-1 col-span-2"
          >
            <div className={`${errors?.injection_date ? "baseWeb-error" : ""} dml-Input-wrapper dml-Input-Calendar relative`}>
              <StyletronProvider value={engine}>
                <BaseProvider theme={LightTheme}>
                  <UberDatePicker
                    aria-label="Select injection date"
                    placeholder="MM/DD/YYYY"
                    formatString="MM/dd/yyyy"
                    highlightedDate={maxDate}
                    maxDate={maxDate}
                    minDate={minDate}
                    value={injectionDate}
                    mask="99/99/9999"
                    error={!!errors.injection_date}
                    onChange={(data) => {
                      if (data?.date) {
                        setInjectionDate([data.date]);
                        setValue("injection_date", data.date, { shouldValidate: true });
                        clearErrors("injection_date");
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
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="w-[200px]"
          form="injectionDateForm"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
