import { IOtpVerificationPayload, IResendOtpPayload } from "@/common/api/models/interfaces/Auth.model";
import authApiRepository from "@/common/api/repositories/authRepository";
import dmlToast from "@/common/configs/toaster.config";
import useAuthToken from "@/common/hooks/useAuthToken";
import { userAtom } from "@/common/states/user.atom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Image, Input, PinInput, Text, Title } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { userEmailAtom } from "./states/email.atom";

const otpSchema = yup.object({
  otp: yup
    .string()
    .required(({ label }) => `${label} is required.`)
    .length(4)
    .label("OTP"),
});

const VerifyUser = () => {
  const [disableOtpInput, setDisableOtpInput] = useState(false);
  const [userData, setUserDataAtom] = useAtom(userAtom);
  const [timeLeft, setTimeLeft] = useState(0);
  const [pinInputKey, setPinInputKey] = useState(Date.now());
  const [userEmail] = useAtom(userEmailAtom);

  type LoginSchemaType = yup.InferType<typeof otpSchema>;
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm({ resolver: yupResolver(otpSchema) });

  const { authAccessCode, setAccessToken, removeAuthAccessCode } = useAuthToken();
  const otpExpired = localStorage.getItem("otpExpired");

  const initializeTimer = () => {
    if (otpExpired) {
      const currentTime = Date.now();
      const expiredTime = new Date(otpExpired).getTime();
      const second = (expiredTime - currentTime) / 1000;
      setTimeLeft(second);
    } else {
      setTimeLeft(0);
    }
  };

  useEffect(() => {
    initializeTimer();
  }, [otpExpired]);

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${Math.round(remainingSeconds).toString().padStart(2, "0")}`;
  };

  const verifyOtpMutation = useMutation({
    mutationFn: (payload: IOtpVerificationPayload) => authApiRepository.verifyOtp(payload),
  });

  const navigate = useNavigate();

  const getAuthQuery = useMutation({
    mutationFn: () => authApiRepository.authUser(),
    onSuccess: (res) => {
      if (res?.status === 200 && res?.data?.data) {
        setUserDataAtom(res?.data?.data);
      }
    },
  });

  const resentOtpMutation = useMutation({
    mutationFn: (payload: IResendOtpPayload) => authApiRepository.resendOtp(payload),
  });

  const onSubmitOtp = (data: LoginSchemaType) => {
    verifyOtpMutation.mutate(
      { ...data, ...{ accessCode: authAccessCode()?.toString() } },
      {
        onSuccess: (res) => {
          removeAuthAccessCode();
          setAccessToken(res?.data?.data?.access_token);

          // if (res?.data?.data?.user?.userable_type == "spa_clinic") {
          //   localStorage.setItem("isSpaClinic", "1");
          // }
          getAuthQuery.mutate(undefined, {
            onSettled: (res) => {
              console.log(res);
              localStorage.removeItem("otpExpired");
              window.location.href = "/";
            },
          });
        },
        onError: (error: any) => {
          dmlToast.error({
            title: error.response?.data?.message,
          });
        },
      }
    );
  };

  const resendOtp = (data: any) => {
    resentOtpMutation.mutate(data, {
      onSuccess: (res) => {
        localStorage.setItem("otpExpired", res?.data?.data?.expired);
        dmlToast.success({
          title: res.data.message,
        });
        setTimeLeft(120);
        setValue("otp", "");
        setPinInputKey(Date.now());
      },
      onError: (error: any) => {
        dmlToast.error({
          title: error.response?.data?.message,
        });
      },
    });
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
        <div className="auth-content-col-inner">
          <Title className="relative auth-title auth-underline !mb-5">OTP Verification</Title>
          <Text className="title-description">Enter OTP code sent to {userEmail}</Text>
          <form
            className="w-full"
            onSubmit={handleSubmit(onSubmitOtp)}
          >
            <Input.Wrapper
              label="OTP"
              required
              error={errors.otp?.message ? errors.otp?.message : false}
            >
              <PinInput
                key={pinInputKey}
                type="number"
                placeholder=""
                autoFocus={true}
                disabled={disableOtpInput}
                length={4}
                size="md"
                gap={27}
                radius={8}
                onChange={(value) => {
                  if (value) {
                    setValue("otp", value);
                    clearErrors();
                  } else {
                    setValue("otp", "");
                  }
                }}
              />
            </Input.Wrapper>

            <Button
              size="lg"
              type="submit"
              loading={verifyOtpMutation.isPending}
              className="auth-btn"
            >
              Verify & Proceed
            </Button>
          </form>

          {timeLeft > 0 ? (
            <Text
              ta="center"
              fw={500}
              size="sm"
              mt="25"
              c="#0C0C0D"
            >
              Resend OTP in {formatTime(timeLeft)}
            </Text>
          ) : (
            <Button
              className="mt-5"
              onClick={() => {
                resendOtp({ accessCode: authAccessCode()?.toString() });
              }}
              variant="outline"
              loading={resentOtpMutation.isPending}
            >
              Resend
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyUser;
