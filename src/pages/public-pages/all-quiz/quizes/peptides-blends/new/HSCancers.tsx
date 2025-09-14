import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const hscancersSchema = yup.object({
  hscancers: yup.string().required("Please select cancer history."),
});

export type HSCancersSchemaType = yup.InferType<typeof hscancersSchema>;

interface IHSCancersProps {
  onNext: (data: HSCancersSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: HSCancersSchemaType;
}

const HSCancers = ({ onNext, onBack, defaultValues }: IHSCancersProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<HSCancersSchemaType>({
    defaultValues: {
      hscancers: defaultValues?.hscancers || "",
    },
    resolver: yupResolver(hscancersSchema),
  });

  const hscancers = watch("hscancers");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("hscancers", value, { shouldValidate: true });
    clearErrors("hscancers");
  };

  const onSubmit = (data: HSCancersSchemaType) => {
    onNext({ ...data, eligible: data.hscancers === "Yes" });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="hscancersForm"
        onSubmit={handleSubmit(onSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-poppins font-semibold text-foreground animate-title">Do you have a history of prostate or hormone-sensitive cancers?</h2>

          <Radio.Group
            value={hscancers}
            onChange={handleSelect}
            className="mt-6 w-full animate-content"
          >
            <div className="grid md:grid-cols-2 w-full gap-5">
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(hscancers, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {hscancers === option && (
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

          {errors.hscancers && <Text className="text-red-500 text-sm mt-5 text-center">{errors.hscancers.message}</Text>}
        </div>

        <div className="flex justify-center gap-6 pt-4 animate-btns">
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
            form="hscancersForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HSCancers;
