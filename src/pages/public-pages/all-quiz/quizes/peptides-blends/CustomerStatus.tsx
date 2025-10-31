import { animationDelay, getAnimationClass } from "@/common/constants/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Radio } from "@mantine/core";
import { useState } from "react";
import { get, useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
export const customerStatusSchema = yup.object({
  customerStatus: yup.string().required("Please select customer status"),
});

export type customerStatusSchemaType = yup.InferType<typeof customerStatusSchema>;

interface ICustomerStatusProps {
  onNext: (data: customerStatusSchemaType) => void;
  onBack: () => void;
  defaultValues?: customerStatusSchemaType;
  direction?: "forward" | "backward"; // Optional, if you want to handle direction-based animations later
}

const CustomerStatus = ({ onNext, onBack, defaultValues, direction }: ICustomerStatusProps) => {
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
    if (errors.customerStatus) {
      setIsErrorFading(true);
      setTimeout(() => {
        setValue("customerStatus", value, { shouldValidate: true });
        clearErrors("customerStatus");
        setIsErrorFading(false);
      }, 300);
    } else {
      setValue("customerStatus", value, { shouldValidate: true });
    }
  };

  const [isExiting, setIsExiting] = useState(false);
  const [isBackExiting, setIsBackExiting] = useState(false);

  const handleFormSubmit = (data: customerStatusSchemaType) => {
    setIsExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      onNext(data);
      setIsExiting(false);
    }, animationDelay); // ✅ Matches animation duration (400ms + 100ms delay)
  };

  const handleBackClick = () => {
    setIsBackExiting(true);

    // Wait for exit animation to complete
    setTimeout(() => {
      setIsBackExiting(false);
      onBack();
    }, animationDelay);
  };
  const [isErrorFading, setIsErrorFading] = useState(false);

  return (
    <form
      id="customerStatusForm"
      onSubmit={handleSubmit(handleFormSubmit)}
      className="max-w-xl mx-auto space-y-6"
    >
      <div>
        <h2 className={`text-center text-3xl font-poppins font-semibold text-foreground ${getAnimationClass("title", isExiting, isBackExiting, direction)}`}>
          Are you new or an existing Wellness Plus customer?
        </h2>

        <Radio.Group
          value={customerStatus}
          onChange={handleSelect}
          className={`mt-6 ${getAnimationClass("content", isExiting, isBackExiting, direction)}`}
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
                  error: `${isErrorFading ? "error-fade-out" : "animate-pulseFade"}`,
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

      <div className={`flex justify-center gap-6 pt-4 getAnimationClass("btns", isExiting, isBackExiting, direction)}`}>
        <Button
          variant="outline"
          className="w-[200px] animated-btn"
          onClick={handleBackClick}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="w-[200px] animated-btn"
          form="customerStatusForm"
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default CustomerStatus;
