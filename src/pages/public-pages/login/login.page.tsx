import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { ILoginRequestPayload } from "@/common/api/models/interfaces/Auth.model";
import authApiRepository from "@/common/api/repositories/authRepository";
import dmlToast from "@/common/configs/toaster.config";
import useAuthToken from "@/common/hooks/useAuthToken";
import { cartItemsAtom } from "@/common/states/product.atom";
import { userAtom } from "@/common/states/user.atom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, PasswordInput } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";

const loginSchema = yup.object({
  emailAddress: yup
    .string()
    .required(({ label }) => `${label} is required.`)
    .label("Email")
    .email(),
  password: yup
    .string()
    .required("You need to add a password")
    .min(8, "Password must have at least 8 characters")
    .matches(/^(?=.*\d).*$/, "Password must contain at least one numerical value")
    .matches(/^((?=.*[a-z]){1}).*$/, "Password must contain at least one lower case alphabetical character")
    .matches(/^((?=.*[A-Z]){1}).*$/, "Password must contain at least one upper case alphabetical character")
    .matches(/^(?=.*[!@#$%^&()\-+=\{\};:,<.>]).*$/, "Password must contain at least one upper case special character")
    .label("Password"),
});

type loginSchemaType = yup.InferType<typeof loginSchema>;

const Login = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [queryParams, setQueryParams] = useSearchParams();
  const [doctorDetails, setDoctorDetails] = useState<any>({});
  const { getAccessToken, setAccessToken } = useAuthToken();
  const [cartItems] = useAtom(cartItemsAtom);
  const [userData, setUserDataAtom] = useAtom(userAtom);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname == "/login" && getAccessToken()) {
      navigate("/order-summary");
    }
  }, [location]);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<loginSchemaType>({
    resolver: yupResolver(loginSchema),
  });

  const passwordValue = watch("password");

  const LoginMutation = useMutation({
    mutationFn: (payload: ILoginRequestPayload) => {
      return authApiRepository.noOtpLogin(payload);
    },
  });

  const getAuthQuery = useMutation({
    mutationFn: () => authApiRepository.authUser(),
    onSuccess: (res) => {
      if (res?.status === 200 && res?.data?.data) {
        setUserDataAtom(res?.data?.data);
      }
    },
  });

  const onSubmit = (data: loginSchemaType) => {
    // const finalData = { ...data, ...{ type: "admin", u_id: uid } };
    const payload = { email: data.emailAddress, password: data.password };
    LoginMutation.mutate(payload, {
      onSuccess: (res) => {
        // setUserEmail(data.emailAddress);
        setAccessToken(res?.data.access_token);

        getAuthQuery.mutate(undefined, {
          onSettled: () => {
            localStorage.removeItem("otpExpired");
            if (cartItems?.length > 0) {
              navigate("/order-summary");
            } else {
              navigate("/category");
            }
          },
        });
      },

      onError: (error) => {
        const err = error as AxiosError<IServerErrorResponse>;
        dmlToast.error({
          title: err.response?.data.message,
        });
      },
    });
  };

  return (
    <div className="lg:pt-16 md:pt-10 pt-4">
      <h2 className="heading-text  text-foreground uppercase  text-center">Login</h2>
      <form
        className="w-full "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="card-common card-common-width flex flex-col lg:gap-7 md:gap-5 gap-3">
          <p className="font-semibold lg:text-3xl md:text-xl text-base text-foreground ">Login Details</p>

          <Input.Wrapper
            label="Email Address"
            required
            error={errors.emailAddress?.message ? errors.emailAddress?.message : false}
            classNames={{
              label: "!text-sm md:!text-base lg:!text-lg",
            }}
          >
            <Input
              type="email"
              {...register("emailAddress")}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="Password"
            mt="12"
            required
            error={errors.password?.message ? errors.password?.message : false}
            classNames={{
              label: "!text-sm md:!text-base lg:!text-lg",
            }}
          >
            <PasswordInput
              visibilityToggleIcon={({ reveal }) => (reveal ? <i className="icon-view text-2xl"></i> : <i className="icon-view-off text-2xl"></i>)}
              {...register("password")}
            />
          </Input.Wrapper>
        </div>
        <div className="text-center mt-10">
          <Button
            size="md"
            type="submit"
            className="bg-primary text-white rounded-xl lg:w-[206px]"
          >
            Login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
