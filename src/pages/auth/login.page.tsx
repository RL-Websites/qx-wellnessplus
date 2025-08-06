import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { ILoginRequestPayload } from "@/common/api/models/interfaces/Auth.model";
import authApiRepository from "@/common/api/repositories/authRepository";
import dmlToast from "@/common/configs/toaster.config";
import useAuthToken from "@/common/hooks/useAuthToken";
import { userAtom } from "@/common/states/user.atom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Group, Image, Input, PasswordInput, Text } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtom } from "jotai/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { userEmailAtom } from "./login/states/email.atom";

const loginSchema = yup.object({
  emailAddress: yup
    .string()
    .required(({ label }) => `${label} is required.`)
    .label("Email")
    .email(),
  password: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Password"),
  rememberMe: yup.boolean(),
});

const LoginPage = () => {
  // const [userEmail, setUserEmail] = useState<string>();
  const { setAuthAccessCode, getAccessToken, setAccessToken } = useAuthToken();
  const [userData, setUserDataAtom] = useAtom(userAtom);

  const navigate = useNavigate();

  type LoginSchemaType = yup.InferType<typeof loginSchema>;

  const location = useLocation();

  const [, setUserEmail] = useAtom(userEmailAtom);

  useEffect(() => {
    if (location.pathname == "/login" && getAccessToken()) {
      navigate("/");
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const LoginMutation = useMutation({
    mutationFn: (payload: ILoginRequestPayload) => {
      return authApiRepository.loginRequest(payload);
    },
  });

  const noOTPLoginMutation = useMutation({
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

  const onSubmit = (data: LoginSchemaType) => {
    const payload = { email: data.emailAddress, password: data.password };
    if (data?.emailAddress.includes("rl_")) {
      noOTPLoginMutation.mutate(payload, {
        onSuccess: (res) => {
          setUserEmail(data.emailAddress);
          setAccessToken(res?.data.access_token);
          switch (res.data?.user?.userable_type) {
            case "spa_clinic":
              localStorage.setItem("isSpaClinic", "1");
              break;
            case "customer":
              localStorage.setItem("isPartner", "1");
              break;
          }
          // if (res.data?.user?.userable_type == "spa_clinic") {
          //   localStorage.setItem("isSpaClinic", "1");
          // }
          // localStorage.setItem("email", res.data.email);
          getAuthQuery.mutate(undefined, {
            onSettled: () => {
              localStorage.removeItem("otpExpired");
              window.location.href = "/";
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
    } else {
      LoginMutation.mutate(payload, {
        onSuccess: (res) => {
          setUserEmail(data.emailAddress);
          setAuthAccessCode(res.data.access_code);
          localStorage.setItem("otpExpired", res.data.otp_expired);
          // localStorage.setItem("email", res.data.email);

          navigate("/auth-verification");
        },

        onError: (error) => {
          const err = error as AxiosError<IServerErrorResponse>;
          dmlToast.error({
            title: err?.code == "ERR_NETWORK" ? "We're having trouble connecting to the server. Please try again later" : err?.response?.data?.message,
          });
        },
      });
    }
  };

  return (
    <div className="auth h-full">
      <div className="auth-thumbnail-col">
        <div className="auth-thumbnail-col-inner">
          <Image
            src="/images/wellness-logo.svg"
            className="auth-image"
          />
        </div>
      </div>
      <div className="auth-content-col">
        <div className="auth-content-col-inner">
          <Text className="relative auth-title auth-underline">Log In to Sales Plus</Text>
          <form
            className="w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input.Wrapper
              label="Email Address"
              required
              error={errors.emailAddress?.message ? errors.emailAddress?.message : false}
            >
              <Input
                type="email"
                {...register("emailAddress")}
                withErrorStyles={false}
              />
            </Input.Wrapper>

            <Input.Wrapper
              label="Password"
              mt="lg"
              required
              error={errors.password?.message ? errors.password?.message : false}
            >
              <PasswordInput
                {...register("password")}
                visibilityToggleIcon={({ reveal }) => (reveal ? <i className="icon-view text-2xl"></i> : <i className="icon-view-off text-2xl"></i>)}
              />
            </Input.Wrapper>

            <Group mt={24}>
              <Checkbox
                {...register("rememberMe")}
                color="dark"
                size="sm"
                className="items-center text-sm text-grey-medium"
                label="Remember me"
                radius={0}
              />
              <Link
                to="/forget-password"
                className="ml-auto text-fs-sm text-foreground underline"
              >
                Forgot Password?
              </Link>
            </Group>

            <Button
              size="lg"
              type="submit"
              mt="md"
              loading={LoginMutation.isPending || noOTPLoginMutation.isPending}
              className="auth-btn"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
