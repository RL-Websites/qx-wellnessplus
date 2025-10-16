import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { ILoginRequestPayload } from "@/common/api/models/interfaces/Auth.model";
import authApiRepository from "@/common/api/repositories/authRepository";
import { InputErrorMessage } from "@/common/configs/inputErrorMessage";
import dmlToast from "@/common/configs/toaster.config";
import useAuthToken from "@/common/hooks/useAuthToken";
import { customerAtom } from "@/common/states/customer.atom";
import { cartItemsAtom } from "@/common/states/product.atom";
import { redirectUrlAtom } from "@/common/states/redirect.atom";
import { user_id, userAtom } from "@/common/states/user.atom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Input, PasswordInput } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";

const loginSchema = yup.object({
  emailAddress: yup.string().required(`Please provide your email address.`).label("Email").email(),
  password: yup
    .string()
    .required("Please provide your password")
    .min(8, "Password must have at least 8 characters")
    .matches(/^(?=.*\d).*$/, "Password must contain at least one numerical value")
    .matches(/^((?=.*[a-z]){1}).*$/, "Password must contain at least one lower case alphabetical character")
    .matches(/^((?=.*[A-Z]){1}).*$/, "Password must contain at least one upper case alphabetical character")
    .matches(/^(?=.*[!@#$%^&()\-+=\{\};:,<.>]).*$/, "Password must contain at least one upper case special character")
    .label("Password"),
});

type loginSchemaType = yup.InferType<typeof loginSchema>;

const Login = () => {
  const { getAccessToken, setAccessToken } = useAuthToken();
  const [cartItems] = useAtom(cartItemsAtom);
  const [userData, setUserDataAtom] = useAtom(userAtom);
  const [customerData, setCustomerData] = useAtom(customerAtom);
  const [userId, setUserId] = useAtom(user_id);
  const navigate = useNavigate();
  const location = useLocation();
  const [, scrollTo] = useWindowScroll();
  const redirectUrl = useAtomValue(redirectUrlAtom);

  useEffect(() => {
    scrollTo({ y: 0 });
  }, []);

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
        setUserId(res?.data?.user_id);
        setAccessToken(res?.data.access_token);

        getAuthQuery.mutate(undefined, {
          onSettled: () => {
            localStorage.removeItem("otpExpired");
            if (redirectUrl) {
              const targetUrl = decodeURIComponent(redirectUrl);
              navigate(targetUrl, { replace: true });
            } else {
              if (cartItems?.length > 0) {
                navigate("/order-summary");
              } else {
                navigate("/category");
              }
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
    <div className="grid lg:grid-cols-2">
      <div className="lg:space-y-[30px] space-y-4 lg:text-start text-center">
        <h2 className="lg:text-[70px] md:text-6xl text-4xl text-foreground uppercase">Login</h2>
        <div className="space-y-2.5">
          <p className="font-semibold lg:text-4xl md:text-xl text-base text-foreground font-poppins">Returning Customer</p>
          <p className="text-sm md:text-base lg:text-2xl font-poppins">Log in to confirm your journey</p>
        </div>
      </div>
      <form
        className="w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="card-common mt-5 card-common-width flex flex-col md:gap-5 gap-3">
          <Input.Wrapper
            label="Email Address"
            required
            error={errors.emailAddress?.message ? errors.emailAddress?.message : false}
            classNames={InputErrorMessage}
          >
            <Input
              type="email"
              {...register("emailAddress")}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="Password"
            required
            error={errors.password?.message ? errors.password?.message : false}
            classNames={InputErrorMessage}
          >
            <PasswordInput
              visibilityToggleIcon={({ reveal }) => (reveal ? <i className="icon-view text-2xl"></i> : <i className="icon-view-off text-2xl"></i>)}
              {...register("password")}
              classNames={InputErrorMessage}
            />
          </Input.Wrapper>

          <Checkbox
            defaultChecked
            label="Remember me"
          />
        </div>
        <div className=" card-common-width  mx-auto  mt-[30px]">
          <div className="flex justify-between">
            <Button
              variant="outline"
              className="lg:w-[206px]"
              // to={cartItems?.length > 0 ? "/order-summary" : "/"}
              onClick={() => {
                if (location.key !== "default") {
                  navigate(-1);
                } else {
                  navigate("/"); // Or any other default page
                }
              }}
            >
              Back
            </Button>
            <Button
              size="md"
              type="submit"
              className="bg-primary text-white rounded-xl lg:w-[206px]"
              loading={LoginMutation.isPending}
            >
              Login
            </Button>
          </div>
          <div className="mt-6 flex md:flex-row flex-col gap-2 items-center justify-between">
            <Link
              to="/forgot-password"
              className="text-foreground underline md:text-base text-sm"
            >
              Forgot Password
            </Link>
            <p className="md:text-lg sm:text-base text-sm text-foreground font-semibold">
              <span className="text-primary font-normal">First-time Visitor? </span>
              <Link
                to="/registration"
                className="text-foreground underline font-medium"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
