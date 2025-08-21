import { IForgetPassPayload } from "@/common/api/models/interfaces/Auth.model";
import authApiRepository from "@/common/api/repositories/authRepository";
import SuccessContent from "@/common/components/SuccessContent";
import dmlToast from "@/common/configs/toaster.config";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { NavLink as RdNavLink } from "react-router-dom";
import * as yup from "yup";

// schema declaration with yup resolver
const forgetPasswordSchema = yup.object({
  email: yup
    .string()
    .email()
    .required(({ label }) => `Please write your ${label}  address`)
    .label("Email"),
});

type ForgetPasswordSchemaType = yup.InferType<typeof forgetPasswordSchema>;

const ForgetPasswordPage = () => {
  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgetPasswordSchema),
  });

  const forgetMutation = useMutation({
    mutationFn: (payload: IForgetPassPayload) => {
      return authApiRepository.forgetPassword(payload);
    },
  });

  const onSubmit = (data: ForgetPasswordSchemaType) => {
    const payload = { email: data.email, domain_app: "dosvana_qx" };
    forgetMutation.mutate(payload, {
      onSuccess: (res) => {
        dmlToast.success({
          title: res?.data?.message,
        });
      },
      onError: (error: any) => {
        dmlToast.show({
          title: error?.response?.data?.message,
        });
      },
    });
    console.log(data);
  };

  return (
    <div className="lg:pt-16 md:pt-10 pt-4">
      <h2 className="heading-text  text-foreground uppercase  text-center">Forgot Password</h2>
      <div className=" card-common-width mx-auto flex flex-col lg:gap-7 md:gap-5 gap-3">
        <div>
          {forgetMutation.isSuccess ? (
            <SuccessContent />
          ) : (
            <div>
              <form
                className="w-full "
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="mt-10 w-full border-dashed border border-primary  rounded-lg bg-primary-secondary p-5">
                  <p className="text-center text-lg">
                    If you forgot your password an email with a password reset link will be sent to you. Click on the link in that email and you will be taken to a page where you
                    can then create a new password.
                  </p>
                </div>
                <div className="card-common">
                  <Input.Wrapper
                    label="Email Address"
                    required
                    error={errors.email?.message ? errors.email?.message : false}
                    classNames={{
                      label: "!text-sm md:!text-base lg:!text-lg",
                    }}
                  >
                    <Input
                      type="email"
                      {...register("email")}
                    />
                  </Input.Wrapper>
                </div>

                <div className=" card-common-width  mx-auto  mt-10">
                  <div className="flex justify-between gap-6">
                    <Button
                      variant="outline"
                      className="w-[200px]"
                      component={RdNavLink}
                      to={`/login`}
                    >
                      Back
                    </Button>
                    <Button
                      size="md"
                      type="submit"
                      className="bg-primary text-white rounded-xl lg:w-[206px]"
                      loading={forgetMutation.isPending}
                    >
                      Send Reset Link
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
