import { IForgetPassPayload } from "@/common/api/models/interfaces/Auth.model";
import authApiRepository from "@/common/api/repositories/authRepository";
import SuccessContent from "@/common/components/SuccessContent";
import { InputErrorMessage } from "@/common/configs/inputErrorMessage";
import dmlToast from "@/common/configs/toaster.config";
import { animationDelay } from "@/common/constants/constants";
import { isExitingAtomForgot, isExitingAtomLogin } from "@/common/states/animation.atom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink as RdNavLink, useNavigate } from "react-router-dom";
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
  const [isExiting, setIsExiting] = useAtom(isExitingAtomLogin);
  const [isExitingForgot, setIsExitingForgot] = useAtom(isExitingAtomForgot);
  const navigate = useNavigate();

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgetPasswordSchema),
  });
  const handleBackClick = () => {
    setIsExitingForgot(true);

    setTimeout(() => {
      setIsExitingForgot(false);
      navigate("/login");
      //navigate("/category");
    }, animationDelay);
  };

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
        // setIsExitingForgot(true);

        // setTimeout(() => {}, animationDelay);
      },
      onError: (error: any) => {
        dmlToast.error({
          title: error?.response?.data?.message,
        });
      },
    });
    console.log(data);
  };

  return (
    <div className={`register-main ${isExitingForgot ? "register-main-exit" : ""}`}>
      <h2 className="lg:text-[70px] md:text-6xl text-4xl text-foreground uppercase text-center">Forgot Password</h2>
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
                <div className="mt-[30px] w-full border-dashed border border-primary  rounded-lg bg-primary-secondary md:p-5 p-4">
                  <p className="text-center text-lg">
                    If you forgot your password an email with a password reset link will be sent to you. Click on the link in that email and you will be taken to a page where you
                    can then create a new password.
                  </p>
                </div>
                <div className="card-common mt-8">
                  <Input.Wrapper
                    label="Email Address"
                    required
                    error={errors.email?.message ? errors.email?.message : false}
                    classNames={InputErrorMessage}
                  >
                    <Input
                      type="email"
                      {...register("email")}
                    />
                  </Input.Wrapper>
                </div>

                <div className=" card-common-width  mx-auto  mt-8">
                  <div className="flex md:justify-between justify-center md:gap-6 gap-3">
                    <Button
                      variant="outline"
                      className="md:min-w-[200px] min-w-[150px] animated-btn"
                      onClick={handleBackClick}
                    >
                      Back
                    </Button>

                    <Button
                      size="md"
                      type="submit"
                      className="bg-primary text-white rounded-xl md:w-[200px] min-w-[150px] animated-btn"
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
