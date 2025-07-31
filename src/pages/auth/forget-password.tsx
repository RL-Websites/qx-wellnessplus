import { IForgetPassPayload } from "@/common/api/models/interfaces/Auth.model";
import authApiRepository from "@/common/api/repositories/authRepository";
import SuccessContent from "@/common/components/SuccessContent";
import dmlToast from "@/common/configs/toaster.config";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Image, Input, Text, Title } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as yup from "yup";

// schema declaration with yup resolver
const forgetPasswordSchema = yup.object({
  email: yup
    .string()
    .email()
    .required(({ label }) => `${label} is required`)
    .label("Email"),
});

type ForgetPasswordSchemaType = yup.InferType<typeof forgetPasswordSchema>;

const ForgetPassword = () => {
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
    const payload = { email: data.email };
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
    <div className="auth">
      <div className="auth-thumbnail-col">
        <div className="auth-thumbnail-col-inner">
          <Image
            src="/images/wellness-logo.svg"
            className="auth-image"
          />
        </div>
      </div>
      <div className="auth-content-col">
        {forgetMutation.isSuccess ? (
          <SuccessContent />
        ) : (
          <div className="auth-content-col-inner">
            <Title className="relative auth-title auth-underline after:!w-[65%]">Forgot Password</Title>

            <Text className="title-description">Enter the email address associated with your account to reset your password.</Text>
            <form
              className="w-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input.Wrapper
                label="Email Address"
                required
                error={errors.email?.message ? errors.email?.message : false}
              >
                <Input
                  type="email"
                  {...register("email")}
                />
              </Input.Wrapper>

              <Button
                size="lg"
                type="submit"
                loading={forgetMutation.isPending}
                className="auth-btn"
              >
                Send Reset Instructions
              </Button>
            </form>

            <div className="flex justify-center mt-[26px]">
              <p className="link-text-sm text-foreground font-medium">
                Go back to
                <Link
                  className="underline  pl-2"
                  to="/login"
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
