import { yupResolver } from "@hookform/resolvers/yup";
import { Anchor, Button, Checkbox, Text } from "@mantine/core";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import * as yup from "yup";

const stepLastSchema = yup.object({
  agreeTerms: yup.boolean().oneOf([true], "Please agree to the terms & conditions.").required("Please agree to the terms & conditions."),
  signature: yup.string().required("Please provide your signature."),
});

type stepLastSchemaType = yup.InferType<typeof stepLastSchema>;

interface StepCompProps {
  onNext: (data: any) => void;
  onBack: () => void;
  defaultValues?: stepLastSchemaType;
  isLoading?: boolean;
}
const StepLast = ({ onNext, onBack, defaultValues, isLoading = false }: StepCompProps) => {
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  // const [signature, setSignature] = useState<any>("");

  const clearSignature = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    sigCanvas.current?.clear();
    // setSignature("");
    setValue("signature", "");
    // setValue("signature", "");
    // setError("signature", { message: "Signature is required" });
  };

  const saveSignature = () => {
    const base64Data = sigCanvas.current.toDataURL("image/png");
    setValue("signature", base64Data, { shouldValidate: true });
    // setSignature(base64Data);
    clearErrors("signature");
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(stepLastSchema),
    defaultValues: {
      agreeTerms: defaultValues?.agreeTerms || undefined,
      signature: defaultValues?.signature,
    },
  });

  const agreeTerms = watch("agreeTerms");
  const signature = watch("signature");

  return (
    <>
      <form
        id="stepLastForm"
        onSubmit={handleSubmit(onNext)}
        className="card divide-y pt-10 space-y-10 min-h-[200px]"
      >
        <div>
          <Checkbox
            label={
              <>
                I have read and agree to{" "}
                <Anchor
                  href="https://salesplusrx.com/terms-and-conditions"
                  target="_blank"
                  inherit
                >
                  Terms and Conditions.
                </Anchor>
                and{" "}
                <Anchor
                  href="https://salesplusrx.com/privacy-policy"
                  target="_blank"
                  inherit
                >
                  Privacy Policy.
                </Anchor>
              </>
            }
            {...register("agreeTerms")}
          />
          {errors?.agreeTerms?.message ? <p className="text-sm text-danger mt-2">{errors?.agreeTerms?.message}</p> : ""}
        </div>

        <div className="grid md:grid-cols-2 pt-10">
          <div>
            <label className="block h6 font-semibold mb-2 text-foreground">Signature</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 relative">
              <SignatureCanvas
                ref={sigCanvas}
                penColor="#175BCC"
                maxWidth={1.5}
                onEnd={() => saveSignature()}
                canvasProps={{
                  className: "w-full h-32 bg-white rounded-lg",
                  style: { touchAction: "none", "-ms-touch-action": "none" },
                }}
              />
              <Button
                onClick={clearSignature}
                variant="transparent"
                className="absolute bottom-2 right-2 text-blue-600 text-sm underline"
              >
                Clear Signature
              </Button>
            </div>
          </div>
          <div className="md:col-span-2">
            {errors?.signature?.message && (
              <Text
                c="red"
                size="sm"
                className="mt-2"
              >
                {errors?.signature?.message?.toString() || ""}
              </Text>
            )}
          </div>
        </div>
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
            form="stepLastForm"
            loading={isLoading}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};

export default StepLast;
