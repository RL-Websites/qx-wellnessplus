import { getBaseWebRadios } from "@/common/configs/baseWebRedios";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export const cancersSchema = yup.object({
  cancers: yup.string().required("Please select an option."),
});

export type CancersSchemaType = yup.InferType<typeof cancersSchema>;

interface ICancersProps {
  onNext: (data: CancersSchemaType & { eligible?: boolean }) => void;
  onBack: () => void;
  defaultValues?: CancersSchemaType;
}

const Cancers = ({ onNext, onBack, defaultValues }: ICancersProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<CancersSchemaType>({
    defaultValues: {
      cancers: defaultValues?.cancers || "",
    },
    resolver: yupResolver(cancersSchema),
  });

  const cancers = watch("cancers");

  const options = ["No", "Yes"];

  const handleSelect = (value: string) => {
    setValue("cancers", value, { shouldValidate: true });
    clearErrors("cancers");
  };

  const onSubmit = (data: CancersSchemaType) => {
    onNext({ ...data, eligible: data.cancers === "Yes" });
  };

  return (
    <div className="px-4 pt-4 md:pt-10 lg:pt-16">
      <form
        id="cancersForm"
        onSubmit={handleSubmit(onSubmit)}
        className="card-common-width-lg mx-auto space-y-6"
      >
        <div>
          <h2 className="text-center text-3xl font-poppins font-semibold text-foreground animate-title">
            Do you have a history of breast, ovarian, or other hormone-sensitive cancers?
          </h2>

          <Radio.Group
            value={cancers}
            onChange={handleSelect}
            className="mt-6 w-full animate-content"
          >
            <div className="grid md:grid-cols-2  w-full gap-5">
              {options.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  classNames={getBaseWebRadios(cancers, option)}
                  label={
                    <div className="relative text-center">
                      <span className="text-foreground font-poppins">{option}</span>
                      {cancers === option && (
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

          {errors.cancers && <Text className="text-red-500 text-sm mt-5 text-center">{errors.cancers.message}</Text>}
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
            form="cancersForm"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Cancers;
