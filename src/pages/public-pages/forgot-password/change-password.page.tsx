import { IResetPasswordPayload } from "@/common/api/models/interfaces/Auth.model";
import authApiRepository from "@/common/api/repositories/authRepository";
import dmlToast from "@/common/configs/toaster.config";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, PasswordInput } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink as RdNavLink, useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";

const changePasswordSchema = yup.object({
  password: yup
    .string()
    .required("You need to add a password")
    .min(8, "Password must have at least 8 characters")
    .matches(/^(?=.*\d).*$/, "Password must contain at least one numerical value")
    .matches(/^((?=.*[a-z]){1}).*$/, "Password must contain at least one lower case alphabetical character")
    .matches(/^((?=.*[A-Z]){1}).*$/, "Password must contain at least one upper case alphabetical character")
    .matches(/^(?=.*[!@#$%^&()\-+=\{\};:,<.>]).*$/, "Password must contain at least one special character")
    .label("Password"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

type ChangePasswordSchemaType = yup.InferType<typeof changePasswordSchema>;

const ChangePasswordPage = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [queryParams, setQueryParams] = useSearchParams();
  const [sendTimeParams] = useSearchParams();
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });

  const passwordValue = watch("password");
  const navigate = useNavigate();

  // Use useEffect to trigger validation on each password change
  useEffect(() => {
    if (passwordValue) {
      setIsTyping(true);
    }
    if (isTyping) {
      trigger("password");
    }
  }, [passwordValue, isTyping, trigger]);

  const ChangePasswordMutation = useMutation({
    mutationFn: (payload: IResetPasswordPayload) => {
      return authApiRepository.resetPassword(payload);
    },
  });

  const onSubmit = (data: ChangePasswordSchemaType) => {
    const code = queryParams.get("code");
    const sendTime = sendTimeParams.get("send_time");

    const payload = { new_password: data.password, new_password_confirmation: data.confirmPassword, u_id: code, send_time: sendTime };

    ChangePasswordMutation.mutate(payload, {
      onSuccess: (res) => {
        dmlToast.success({
          title: "The password has been changed successfully",
        });
        navigate("/");
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
    <div className="">
      <h2 className="lg:text-[70px] md:text-6xl text-4xl text-foreground uppercase text-center">Reset Password</h2>
      <form
        className="w-full -mt-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="card-common card-common-width">
          <Input.Wrapper
            label="Password"
            required
            error={errors.password?.message ? errors.password?.message : false}
          >
            <PasswordInput
              {...register("password")}
              visibilityToggleIcon={({ reveal }) => (reveal ? <i className="icon-view text-2xl"></i> : <i className="icon-view-off text-2xl"></i>)}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="Confirm password"
            required
            error={errors.confirmPassword?.message ? errors.confirmPassword?.message : false}
          >
            <PasswordInput
              {...register("confirmPassword")}
              visibilityToggleIcon={({ reveal }) => (reveal ? <i className="icon-view text-2xl"></i> : <i className="icon-view-off text-2xl"></i>)}
            />
          </Input.Wrapper>
        </div>

        <div className=" card-common-width  mx-auto  mt-10">
          <div className="flex justify-between gap-6">
            <Button
              variant="outline"
              className="w-[200px]"
              component={RdNavLink}
              to={`/forgot-password`}
            >
              Back
            </Button>
            <Button
              size="md"
              type="submit"
              className="bg-primary text-white rounded-xl lg:w-[206px]"
              loading={ChangePasswordMutation.isPending}
            >
              Send Reset Link
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
