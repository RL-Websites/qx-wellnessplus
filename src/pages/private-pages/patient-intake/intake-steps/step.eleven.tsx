import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@mantine/core";
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
interface Step11Props {
  onNext: (data: any) => void;
  onBack: () => void;
  defaultValues?: step11SchemaType;
}

const StepEleven = ({ onNext, onBack, defaultValues }: Step11Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
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

  return (
    <>
      <form
        id="step11Form"
        onSubmit={handleSubmit(onNext)}
        className="card divide-y pt-10 space-y-10 min-h-[200px]"
      >
        {/* Gallbladder Question */}
        <div>
          <p className="text-base font-medium mb-4">Do you have a personal history of gallbladder disease?</p>
          <div className="flex flex-col space-y-4">
            {["Yes", "No"].map((option) => (
              <label
                key={option}
                className={`block w-full px-6 py-4 rounded-2xl border text-center cursor-pointer
                  ${gallbladder === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                `}
              >
                <input
                  type="radio"
                  value={option}
                  {...register("gallbladder")}
                  className="hidden"
                  onChange={() => {
                    setValue("gallbladder", option);
                    setValue("removedGallbladder", "");
                    setValue("whenGallbladderRemoved", "");
                    clearErrors("gallbladder");
                  }}
                />
                {option}
              </label>
            ))}
          </div>
          {errors?.gallbladder?.message && <p className="text-sm text-danger mt-2">{errors.gallbladder.message}</p>}
        </div>

        {/* Removed Gallbladder Question */}
        {gallbladder === "Yes" && (
          <div>
            <p className="text-base font-medium mt-6 mb-4">Did you have your gallbladder removed?</p>
            <div className="flex flex-col space-y-4">
              {["Yes", "No"].map((option) => (
                <label
                  key={option}
                  className={`block w-full px-6 py-4 rounded-2xl border text-center cursor-pointer
                    ${removedGallbladder === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                  `}
                >
                  <input
                    type="radio"
                    value={option}
                    {...register("removedGallbladder")}
                    className="hidden"
                    onChange={() => {
                      setValue("removedGallbladder", option);
                      setValue("whenGallbladderRemoved", "");
                      clearErrors("removedGallbladder");
                    }}
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors?.removedGallbladder?.message && <p className="text-sm text-danger mt-2">{errors.removedGallbladder.message}</p>}
          </div>
        )}

        {/* When Removed Question */}
        {removedGallbladder === "Yes" && (
          <div>
            <p className="text-base font-medium mt-6 mb-4">When did you have your gallbladder removed?</p>
            <div className="flex flex-col space-y-4">
              {["Within the last 2 months", "More than 2 months ago"].map((option) => (
                <label
                  key={option}
                  className={`block w-full px-6 py-4 rounded-2xl border text-center cursor-pointer
                    ${whenGallbladderRemoved === option ? "border-primary bg-white text-black" : "border-grey bg-transparent text-black"}
                  `}
                >
                  <input
                    type="radio"
                    value={option}
                    {...register("whenGallbladderRemoved")}
                    className="hidden"
                    onChange={() => {
                      setValue("whenGallbladderRemoved", option);
                      clearErrors("whenGallbladderRemoved");
                    }}
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors?.whenGallbladderRemoved?.message && <p className="text-sm text-danger mt-2">{errors.whenGallbladderRemoved.message}</p>}
          </div>
        )}
      </form>

      <div className="flex justify-between mt-6">
        <div className="flex gap-6 sm:ms-auto sm:mx-0 mx-auto">
          <Button
            px={0}
            variant="outline"
            onClick={onBack}
            className="sm:w-[256px] w-[120px]"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="sm:w-[256px] w-[120px]"
            form="step11Form"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default StepEleven;
