import { IServerErrorResponse } from "@/common/api/models/interfaces/ApiResponse.model";
import { IRegistrationRequestPayload } from "@/common/api/models/interfaces/Auth.model";
import authApiRepository from "@/common/api/repositories/authRepository";
import { InputErrorMessage } from "@/common/configs/inputErrorMessage";
import dmlToast from "@/common/configs/toaster.config";
import useAuthToken from "@/common/hooks/useAuthToken";
import { cartItemsAtom } from "@/common/states/product.atom";
import { user_id, userAtom } from "@/common/states/user.atom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, PasswordInput } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";

const registrationSchema = yup.object({
  firstName: yup
    .string()
    .required(({ label }) => `${label} is required.`)
    .label("First Name"),
  lastName: yup
    .string()
    .required(({ label }) => `${label} is required.`)
    .label("Last Name"),
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
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

type registrationSchemaType = yup.InferType<typeof registrationSchema>;

const RegistrationPage = () => {
  const { setAccessToken, getAccessToken } = useAuthToken();
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const [userData, setUserDataAtom] = useAtom(userAtom);
  const [userId, setUserId] = useAtom(user_id);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname == "/registration" && getAccessToken()) {
      navigate("/order-summary");
    }
  }, [location]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registrationSchemaType>({
    resolver: yupResolver(registrationSchema),
  });

  const RegistrationMutation = useMutation({
    mutationFn: (payload: IRegistrationRequestPayload) => {
      return authApiRepository.patientRegistration(payload);
    },
  });

  useEffect(() => {
    if (!userData) {
      navigate("/registration");
    }
  }, [userData]);

  const onSubmit = (data: registrationSchemaType) => {
    const payload = { first_name: data.firstName, last_name: data.lastName, email: data.emailAddress, password: data.password, confirm_password: data.confirmPassword };
    RegistrationMutation.mutate(payload, {
      onSuccess: (res) => {
        setAccessToken(res?.data.access_token);
        setUserDataAtom(res?.data?.user);
        setUserId(res?.data?.user_id);
        if (cartItems?.length > 0) {
          navigate("/complete-order");
        } else {
          navigate("/category");
        }
      },

      onError: (error) => {
        const err = error as AxiosError<IServerErrorResponse>;
        dmlToast.error({
          title: err?.code == "ERR_NETWORK" ? "There was a server error. Please try again later" : err?.response?.data?.message,
        });
      },
    });
  };

  return (
    <div className="lg:pt-16 md:pt-10 pt-4">
      <h2 className="heading-text  text-foreground uppercase  text-center">Registration</h2>
      <form
        className="w-full "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="card-common card-common-width flex flex-col lg:gap-7 md:gap-5 gap-3">
          <p className="font-semibold lg:text-3xl md:text-xl text-base text-foreground ">Registration Details</p>
          <Input.Wrapper
            label="First Name"
            required
            error={errors.firstName?.message ? errors.firstName?.message : false}
            classNames={InputErrorMessage}
          >
            <Input
              type="text"
              {...register("firstName")}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="Last Name"
            required
            error={errors.lastName?.message ? errors.lastName?.message : false}
            classNames={InputErrorMessage}
          >
            <Input
              type="text"
              {...register("lastName")}
            />
          </Input.Wrapper>
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
            mt="12"
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
          <Input.Wrapper
            label="Confirm password"
            mt="12"
            required
            error={errors.confirmPassword?.message ? errors.confirmPassword?.message : false}
            classNames={InputErrorMessage}
          >
            <PasswordInput
              visibilityToggleIcon={({ reveal }) => (reveal ? <i className="icon-view text-2xl"></i> : <i className="icon-view-off text-2xl"></i>)}
              {...register("confirmPassword")}
              classNames={InputErrorMessage}
            />
          </Input.Wrapper>
        </div>
        <div className="card-common-width  mx-auto mt-10">
          <div className="flex justify-between">
            <Button
              size="md"
              className="lg:w-[206px]"
              variant="outline"
              component={Link}
              to={`/login`}
            >
              Back
            </Button>
            <Button
              size="md"
              type="submit"
              className="bg-primary text-white rounded-xl lg:w-[206px]"
              loading={RegistrationMutation.isPending}
            >
              Register Now
            </Button>
          </div>
          <p className="text-xl text-foreground font-semibold mt-6 text-center">
            <span className="text-primary font-normal font-poppins">Already have an account? </span>
            <Link
              to="/login"
              className="text-foreground underline"
            >
              Please Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegistrationPage;
