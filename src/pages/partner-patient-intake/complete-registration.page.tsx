import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import partnerPatientRepository from "@/common/api/repositories/partnerPatientRepository";
import AllreadySubmitted from "@/common/components/Registration/AllreadySubmitted";
import RegistrationFooter from "@/common/components/Registration/RegistrationFooter";
import RegistrationHeader from "@/common/components/Registration/RegistrationHeader";
import RegistrationSuccess from "@/common/components/Registration/RegistrationSuccess";
import dmlToast from "@/common/configs/toaster.config";
import { getErrorMessage } from "@/utils/helper.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Anchor, Button, Checkbox, Input, LoadingOverlay, PasswordInput } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import * as yup from "yup";

const createManualPassSchema = yup.object({
  password: yup
    .string()
    .required("You need to provide a password")
    .min(8, "Password must have at least 8 characters")
    .matches(/^(?=.*\d).*$/, "Password must contain at least one numerical value")
    .matches(/^((?=.*[a-z]){1}).*$/, "Password must contain at least one lower case alphabetical character")
    .matches(/^((?=.*[A-Z]){1}).*$/, "Password must contain at least one upper case alphabetical character")
    .matches(/^(?=.*[!@#$%^&()\-+=\{\};:,<.>]).*$/, "Password must contain at least one special character")
    .label("Password"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("You need to confirm your Password"),
  terms: yup.boolean().oneOf([true], "You must agree to the terms and conditions to proceed."),
});

type CreateManualPassFormFieldTypes = yup.InferType<typeof createManualPassSchema>;

function PartnerPatientCompleteRegistration() {
  const [patientDetails, setPatientDetails] = useState<any | null>();
  const [agreed, setAgreed] = useState(false);
  const [queryParams] = useSearchParams();
  const prescriptionUId = queryParams.get("prescription_u_id");

  const patientDetailsQuery = useQuery({
    queryKey: ["partner-patient-complete-pass-query", prescriptionUId],
    queryFn: () => partnerPatientRepository.publicGetPatientDetails({ u_id: prescriptionUId || "" }),
    enabled: !!prescriptionUId,
  });

  useEffect(() => {
    if (patientDetailsQuery?.data?.data?.status_code == 200 && patientDetailsQuery?.data?.data?.data) {
      setPatientDetails(patientDetailsQuery?.data?.data?.data);
    }
  }, [patientDetailsQuery.data?.data?.data]);

  const {
    register,
    setValue,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<CreateManualPassFormFieldTypes>({
    resolver: yupResolver(createManualPassSchema),
  });

  const clientPassUpdateMn = useMutation({
    mutationFn: (payload: any) => partnerPatientRepository.patientPasswordSetup(payload),
  });

  const handlePassSubmit = (data: CreateManualPassFormFieldTypes) => {
    if (patientDetails?.patient?.u_id) {
      const payload: any = {
        u_id: patientDetails?.patient?.u_id,
        password: data.password || "",
        confirm_password: data.confirm_password || "",
      };
      clientPassUpdateMn.mutate(payload, {
        onSuccess: (res) => {
          console.log(res);
        },
        onError: (err) => {
          const error = err as AxiosError<IServerErrorResponse>;
          dmlToast.error({
            title: error?.response?.data?.message,
          });
        },
      });
    }
  };

  const handleError = (err) => {
    console.log(err);
  };

  return (
    <>
      {patientDetailsQuery?.isLoading ? (
        <LoadingOverlay />
      ) : patientDetails?.patient?.status == "invited" ? (
        <section className="bg-background xl:px-0 px-4  min-h-screen flex flex-col">
          {!clientPassUpdateMn.isSuccess ? (
            <>
              <RegistrationHeader
                title="Complete Registration"
                userType={patientDetails?.type}
                tagLine="Please fill up the form to complete your registration"
              />
              <div className="dr-header-container pb-8 w-full">
                <div className="py-5 px-10 bg-tag-bg rounded-xl text-center">
                  <p className="text-fs-lg text-tag-bg-deep">
                    Register with a password to securely track your order, view updates, and access everything in one place — quick, simple, and safe.
                  </p>
                </div>
                <form
                  className="space-y-6 mt-5"
                  onSubmit={handleSubmit(handlePassSubmit, handleError)}
                >
                  <div className="card">
                    <div className="card-title with-border">
                      <h6 className="text-foreground">Set Password</h6>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 mt-5">
                      <div className="md:col-span-2">
                        <Input.Wrapper label="Your ID">
                          <Input
                            type="text"
                            readOnly
                            placeholder=""
                            defaultValue={patientDetails?.patient?.email}
                            classNames={{
                              input: "pl-0",
                            }}
                          />
                        </Input.Wrapper>
                      </div>
                      <div className="md:col-span-1">
                        <Input.Wrapper
                          label="Password"
                          required
                          error={getErrorMessage(errors?.password)}
                        >
                          <PasswordInput
                            {...register("password")}
                            visibilityToggleIcon={({ reveal }) =>
                              reveal ? <i className="icon-view text-2xl leading-none"></i> : <i className="icon-view-off text-2xl leading-none"></i>
                            }
                            classNames={{
                              input: errors?.password?.message ? "!border-1 !border-danger" : "",
                            }}
                          />
                        </Input.Wrapper>
                      </div>
                      <div className="md:col-span-1">
                        <Input.Wrapper
                          label="Confirm Password"
                          required
                          error={getErrorMessage(errors.confirm_password)}
                        >
                          <PasswordInput
                            {...register("confirm_password")}
                            visibilityToggleIcon={({ reveal }) =>
                              reveal ? <i className="icon-view text-2xl leading-none"></i> : <i className="icon-view-off text-2xl leading-none"></i>
                            }
                            classNames={{
                              input: errors?.confirm_password?.message ? "!border-1 !border-danger" : "",
                            }}
                          />
                        </Input.Wrapper>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Checkbox
                      label={
                        <>
                          By selecting this you are confirming that you have read, understood and agree to the{" "}
                          <Anchor
                            href="https://salesplusrx.com/terms-and-conditions"
                            target="_blank"
                            inherit
                          >
                            terms and conditions.
                          </Anchor>
                        </>
                      }
                      {...register("terms")}
                      checked={agreed}
                      onChange={(event) => {
                        setAgreed(event.currentTarget.checked);
                        setValue("terms", event.currentTarget.checked);
                        if (event.currentTarget.checked) {
                          clearErrors("terms");
                        }
                      }}
                    />
                    <p className="text-danger text-fs-sm mt-2">{errors?.terms?.message || ""}</p>
                  </div>
                  <div className="flex justify-between mt-6">
                    <div className="flex gap-3 ms-auto">
                      <Button
                        w={256}
                        type="submit"
                        loading={clientPassUpdateMn?.isPending}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <RegistrationSuccess
              needApproval={false}
              updateTitle="Your account is ready now. Please login."
            />
          )}
          <RegistrationFooter />
        </section>
      ) : (
        <AllreadySubmitted
          title="Complete Registration"
          userType={patientDetails?.type}
          tagLine="Your request was successfully submitted"
        />
      )}
    </>
  );
}

export default PartnerPatientCompleteRegistration;
