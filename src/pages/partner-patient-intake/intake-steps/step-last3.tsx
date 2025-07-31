import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Radio, Text } from "@mantine/core";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import * as yup from "yup";

const stepLast3Schema = yup.object({
  agreeToPhoneConsult: yup.string().required("Please select at least one value."),
  // agreeTerms: yup.boolean().oneOf([true], "Please agree to the terms & conditions.").required("Please agree to the terms & conditions."),
  signature: yup.string().required("Please provide your signature."),
});

type stepLast3SchemaType = yup.InferType<typeof stepLast3Schema>;

interface StepCompProps {
  onNext: (data: any) => void;
  onBack: () => void;
  defaultValues?: stepLast3SchemaType;
}
const StepLast3 = ({ onNext, onBack, defaultValues }: StepCompProps) => {
  const sigCanvas = useRef<SignatureCanvas | null>(null);

  const clearSignature = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    sigCanvas.current?.clear();
    setValue("signature", "");
  };

  const saveSignature = () => {
    const base64Data = sigCanvas.current?.toDataURL("image/png");
    setValue("signature", base64Data || "", { shouldValidate: true });
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
    resolver: yupResolver(stepLast3Schema),
    defaultValues: {
      agreeToPhoneConsult: defaultValues?.agreeToPhoneConsult || "",
      // agreeTerms: defaultValues?.agreeTerms || undefined,
      signature: defaultValues?.signature || "",
    },
  });

  const agreeToPhoneConsult = watch("agreeToPhoneConsult");

  return (
    <>
      <form
        id="stepLast3Form"
        onSubmit={handleSubmit(onNext)}
        className="card divide-y pt-10 space-y-10 min-h-[200px]"
      >
        <Radio.Group
          label="Depending on state regulations, your provider may reach out to you to perform a
          consultation over the phone. Otherwise, your provider will review your intake forms and
          approve your script if all criteria are met"
          {...register("agreeToPhoneConsult")}
          value={agreeToPhoneConsult || ""}
          onChange={(value) => {
            setValue("agreeToPhoneConsult", value);
            if (value) {
              clearErrors("agreeToPhoneConsult");
            }
          }}
        >
          <div className="space-y-5 pt-5">
            <Radio
              label="I understand that my provider will only reach out via phone call if they think it is
              necessary to get more information from me. I do not need to speak to the
              provider."
              value="I understand that my provider will only reach out via phone call if they think it is necessary to get more information from me. I do not need to speak to the provider.
"
              color="dark"
              {...register("agreeToPhoneConsult")}
            ></Radio>
            <Radio
              label="I would like to speak to the provider."
              value="I would like to speak to the provider."
              color="dark"
              {...register("agreeToPhoneConsult")}
            ></Radio>
          </div>
        </Radio.Group>

        {/* <div className="pt-8">
          <p className="text-medium text-lg">
            I acknowledge that all of the information I have provided is accurate and up to date to the best of my knowledge. I understand that providing false or incomplete
            information could result in improper medical treatment. which may lead to serious illness or death.
          </p>
          <Checkbox
            className="pt-5"
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
        </div> */}

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
                  style: { touchAction: "none" },
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
            form="stepLast3Form"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default StepLast3;
