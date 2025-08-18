import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Radio } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const customerStatusSchema = yup.object({
  customerStatus: yup.string().required("Please select an option."),
});

export type customerStatusSchemaType = yup.InferType<typeof customerStatusSchema>;

interface ICustomerStatusProps {
  onNext: (data: customerStatusSchemaType) => void;
  onBack: () => void;
  defaultValues?: customerStatusSchemaType;
}

const CustomerStatus = ({ onNext, onBack, defaultValues }: ICustomerStatusProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<customerStatusSchemaType>({
    defaultValues: {
      customerStatus: defaultValues?.customerStatus || "",
    },
    resolver: yupResolver(customerStatusSchema),
  });

  const customerStatus = watch("customerStatus");

  const options = ["Existing", "New"];

  const handleSelect = (value: string) => {
    setValue("customerStatus", value, { shouldValidate: true });
    clearErrors("customerStatus");
  };

  return (
    <form
      id="customerStatusForm"
      onSubmit={handleSubmit(onNext)}
      className="max-w-xl mx-auto space-y-6"
    >
      <div>
        <h2 className="text-center text-3xl font-poppins font-semibold text-foreground">Are you new or an existing Wellness Plus customer?</h2>

        <Radio.Group
          value={customerStatus}
          onChange={handleSelect}
          className="mt-6"
          error={errors?.customerStatus?.message}
        >
          <Group grow>
            {options.map((option) => (
              <Radio
                key={option}
                value={option}
                classNames={{
                  root: "relative w-full",
                  radio: "hidden",
                  inner: "hidden",
                  labelWrapper: "w-full",
                  label: `
                    block w-full h-full px-6 py-4 rounded-2xl border text-center text-base font-medium cursor-pointer
                    ${customerStatus === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                  `,
                }}
                label={
                  <div className="relative text-center">
                    <span className="text-foreground font-poppins">{option}</span>
                    {customerStatus === option && (
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-600 text-white absolute top-1/2 md:right-3 -right-2 -translate-y-1/2">
                        <i className="icon-tick text-sm/none"></i>
                      </span>
                    )}
                  </div>
                }
              />
            ))}
          </Group>
        </Radio.Group>
      </div>

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
          form="customerStatusForm"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default CustomerStatus;
