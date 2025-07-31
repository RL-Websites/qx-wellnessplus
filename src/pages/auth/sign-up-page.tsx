import { ISignUpRequestPayload } from "@/common/api/models/interfaces/Auth.model";
import authApiRepository from "@/common/api/repositories/authRepository";
import doctorApiRepository from "@/common/api/repositories/doctorRepository";
import dmlToast from "@/common/configs/toaster.config";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Image, Input, PasswordInput, Text, Title } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";

const signUpSchema = yup.object({
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

type signUPdSchemaType = yup.InferType<typeof signUpSchema>;

function SignUpPage() {
  const [isTyping, setIsTyping] = useState(false);
  const [queryParams, setQueryParams] = useSearchParams();
  const [doctorDetails, setDoctorDetails] = useState<any>({});
  const uid = queryParams.get("u_id");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const passwordValue = watch("password");

  const doctorDetailsQuery = useQuery({
    enabled: !!uid,
    queryKey: ["doctorDetails"],
    queryFn: () => doctorApiRepository.getDoctorDetails(uid, { page: "sign_up" }),
  });

  useEffect(() => {
    if (doctorDetailsQuery.isFetched) {
      if (doctorDetailsQuery?.data?.status === 200) {
        setDoctorDetails(doctorDetailsQuery.data?.data?.data);
      }
    }
  }, [doctorDetailsQuery.isFetched, doctorDetailsQuery.data]);

  // Use useEffect to trigger validation on each password change
  useEffect(() => {
    if (passwordValue) {
      setIsTyping(true);
    }
    if (isTyping) {
      trigger("password");
    }
  }, [passwordValue, isTyping, trigger]);

  const signUpMutation = useMutation({
    mutationFn: (payload: ISignUpRequestPayload) => {
      return authApiRepository.signUpRequest(payload);
    },
  });

  const onSubmit = (data: signUPdSchemaType) => {
    const finalData = { ...data, ...{ type: "doctor", u_id: uid } };
    signUpMutation.mutate(finalData, {
      onSuccess: (res) => {
        dmlToast.success({
          title: res?.data?.message,
        });
        navigate("/login");
      },
      onError: (error: any) => {
        dmlToast.error({
          title: error?.response?.data?.message,
        });
      },
    });
  };

  return (
    <div className="auth">
      <div className="auth-thumbnail-col">
        <div className="auth-thumbnail-col-inner">
          <Image
            src="/images/logo.svg"
            className="auth-image"
          />
        </div>
      </div>
      <div className="auth-content-col">
        <div className="auth-content-col-inner">
          <Title className="relative auth-title auth-underline">Sign Up to SalesPlus </Title>
          <Text className="title-description">Sign up with the email address you were invited to</Text>
          <form
            className="w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input.Wrapper
              label="Email Address"
              required
            >
              <Input
                type="email"
                readOnly
                defaultValue={doctorDetails?.email}
              />
            </Input.Wrapper>
            <Input.Wrapper
              label="Phone Number"
              required
              mt="12"
            >
              <Input
                type="text"
                defaultValue={doctorDetails?.phone}
                readOnly
              />
            </Input.Wrapper>
            <Input.Wrapper
              label="Password"
              mt="12"
              required
              error={errors.password?.message ? errors.password?.message : false}
            >
              <PasswordInput
                visibilityToggleIcon={({ reveal }) => (reveal ? <i className="icon-view text-2xl"></i> : <i className="icon-view-off text-2xl"></i>)}
                {...register("password")}
              />
            </Input.Wrapper>
            <Input.Wrapper
              label="Confirm password"
              mt="12"
              required
              error={errors.confirmPassword?.message ? errors.confirmPassword?.message : false}
            >
              <PasswordInput
                visibilityToggleIcon={({ reveal }) => (reveal ? <i className="icon-view text-2xl"></i> : <i className="icon-view-off text-2xl"></i>)}
                {...register("confirmPassword")}
              />
            </Input.Wrapper>
            <Button
              size="lg"
              type="submit"
              className="auth-btn"
              loading={signUpMutation.isPending}
            >
              Sign Up
            </Button>
          </form>
          <Group
            className="text-fs-sm text-foreground"
            justify="center"
            mt={20}
            gap={10}
          >
            Already have an account?
            <Link
              className="underline"
              to="/login"
            >
              Log In
            </Link>
          </Group>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
