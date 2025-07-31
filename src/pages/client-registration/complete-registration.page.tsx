import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import addClientApiRepository from "@/common/api/repositories/clientRepositoiry";
import { CreateManualPassFormFieldTypes, createManualPassSchema, CreatePasswordFormFieldTypes } from "@/common/components/prescriber/commonSchema";
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
import { FormProvider, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

function ClientCompleteRegistration() {
  const [clientDetails, setClientDetails] = useState<any | null>();
  const [agreed, setAgreed] = useState(false);
  const [queryParams] = useSearchParams();
  const slug = queryParams.get("slug");

  const clientDetailsQuery = useQuery({
    queryKey: ["fullPrescriberInviteData", slug],
    queryFn: () => addClientApiRepository.getPublicPartnerClientDetails(slug),
    enabled: !!slug,
  });

  useEffect(() => {
    if (clientDetailsQuery.isFetched && clientDetailsQuery?.data?.data?.status_code == 200) {
      setClientDetails(clientDetailsQuery?.data?.data?.data);
    }
  }, [clientDetailsQuery.data?.data?.data]);

  const createPassFormMethods = useForm<CreateManualPassFormFieldTypes>({
    resolver: yupResolver(createManualPassSchema),
    mode: "onTouched",
  });

  const {
    register,
    setValue,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = createPassFormMethods;

  const clientPassUpdateMn = useMutation({
    mutationFn: (payload: any) => addClientApiRepository.clientPasswordSetUp(payload),
  });

  const handlePassSubmit = async (data: CreatePasswordFormFieldTypes) => {
    if (clientDetails?.slug) {
      const payload: any = {
        slug: clientDetails.slug,
        token: clientDetails.token,
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

  return (
    <>
      {clientDetailsQuery?.isLoading ? (
        <LoadingOverlay />
      ) : clientDetails?.status == "invited" ? (
        <section className="bg-background xl:px-0 px-4 min-h-screen flex flex-col">
          {!clientPassUpdateMn.isSuccess ? (
            <>
              <RegistrationHeader
                title="Complete Registration"
                userType={clientDetails?.type}
                tagLine="Please fill up the form to complete your registration"
              />
              <div className="dr-header-container pb-8 w-full">
                <FormProvider {...createPassFormMethods}>
                  <form
                    className="space-y-6"
                    onSubmit={handleSubmit(handlePassSubmit)}
                  >
                    <div className="card">
                      <div className="card-title with-border">
                        <h6 className="text-foreground">Create Password</h6>
                      </div>
                      <div className="grid gap-6 lg:grid-cols-2 mt-5">
                        <div className="col-span-2">
                          <Input.Wrapper
                            className="w-full"
                            label="Your ID"
                          >
                            <Input
                              type="text"
                              readOnly
                              placeholder=""
                              defaultValue={clientDetails?.email}
                              classNames={{
                                input: "pl-0",
                              }}
                            />
                          </Input.Wrapper>
                        </div>
                        <div className="md:col-span-1 col-span-2">
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
                        <div className="md:col-span-1 col-span-2">
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
                      <div className="flex gap-3 sm:ms-auto sm:mx-0 mx-auto">
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
                </FormProvider>
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
          userType={clientDetails?.type}
          tagLine="Your account has been created successfully."
        />
      )}
    </>
  );
}

export default ClientCompleteRegistration;
