import { BaseWebDatePickerOverrides } from "@/common/configs/baseWebOverrides";
import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { InputErrorMessage } from "@/common/configs/inputErrorMessage";
import { prevGlpMedDetails } from "@/common/states/product.atom";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Radio, Text } from "@mantine/core";
import { BaseProvider, LightTheme } from "baseui";
import { Datepicker as UberDatePicker } from "baseui/datepicker";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Client as Styletron } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";
import * as yup from "yup";

const injectionDateSchema = yup.object({
  injection_date: yup.date().required("Please select your injection date").max(new Date(), "Injection date cannot be in the future"),
  lastDose: yup.string().required("Please select the last dosage you took."),
});

type InjectionDateSchemaType = yup.InferType<typeof injectionDateSchema>;

interface IInjectionDateProps {
  onNext: (data: InjectionDateSchemaType) => void;
  onBack: () => void;
  defaultValues?: InjectionDateSchemaType;
}

export default function InjectionDate({ onNext, onBack, defaultValues }: IInjectionDateProps) {
  const engine = new Styletron();
  const [prevGlpDetails, setPrevGlpDetails] = useAtom(prevGlpMedDetails);
  const [injectionDate, setInjectionDate] = useState<any>(defaultValues?.injection_date ?? null);
  const [lastDoseOptions, setLastDoseOptions] = useState(["0.25 mg", "0.50 mg", "1 mg", "1.7 mg", "2.4 mg"]);

  const maxDate = new Date();
  const minDate = new Date("1920-01-01");
  const {
    clearErrors,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<InjectionDateSchemaType>({
    resolver: yupResolver(injectionDateSchema),
    defaultValues: {
      injection_date: defaultValues?.injection_date,
      lastDose: defaultValues?.lastDose || "",
    },
  });

  useEffect(() => {
    if (prevGlpDetails?.medType && prevGlpDetails?.medType == "Tirzepatide") {
      setLastDoseOptions(["2.5 mg", "5 mg", "7.5 mg", "10 mg", "12.5 mg", "15 mg"]);
    } else {
      setLastDoseOptions(["0.25 mg", "0.50 mg", "1 mg", "1.7 mg", "2.4 mg"]);
    }
  }, [prevGlpDetails?.medType]);

  const lastDose = watch("lastDose");

  const handleSelect = (field: keyof InjectionDateSchemaType, value: string) => {
    setValue(field, value, { shouldValidate: true });
    const dose = value.split(" ")[0];
    setPrevGlpDetails((prev) => ({ ...prev, lastDose: dose }));
    clearErrors(field);
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="injectionDateForm"
        className="w-full"
        onSubmit={handleSubmit(onNext)}
      >
        <h2 className="text-center lg:!text-3xl md:!text-2xl sm:text-xl text-lg font-poppins font-semibold text-foreground">When was the last time you used your medication?</h2>
        <div className="card-common card-common-width relative z-10">
          <Input.Wrapper
            label="Medication Date"
            error={getErrorMessage(errors.injection_date)}
            withAsterisk
            classNames={InputErrorMessage}
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
                        setPrevGlpDetails((prev) => ({ ...prev, lastDoseDate: data.date }));
                        clearErrors("injection_date");
                      }
                    }}
                    overrides={BaseWebDatePickerOverrides}
                  />
                </BaseProvider>
              </StyletronProvider>
            </div>
          </Input.Wrapper>
        </div>

        <Radio.Group
          value={lastDose}
          onChange={(value) => {
            handleSelect("lastDose", value);
          }}
          label="What was your last dosage?"
          className="mt-10 w-full"
          classNames={{
            root: "!block",
            error: "sm:!text-end !text-start w-full",
            label: "block lg:!text-3xl md:!text-2xl sm:text-xl text-lg pb-2 text-center font-semibold text-foreground",
          }}
        >
          <div className="grid md:grid-cols-2 gap-5 w-full">
            {lastDoseOptions.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={getBaseWebRadios(lastDose, option)}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {lastDose === option && (
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

        {errors.lastDose && <Text className="text-red-500 text-sm mt-5 text-center">{errors.lastDose.message}</Text>}
      </form>
      <div className="flex justify-center md:gap-6 gap-3 md:pt-8 pt-5 relative z-0">
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
