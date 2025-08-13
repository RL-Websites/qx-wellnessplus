import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai/react";
import authApiRepository from "../api/repositories/authRepository";
import { userAtom } from "../states/user.atom";

export default function useAuthToken() {
  const getAccessToken = () => localStorage.getItem("accessToken");
  const [, setUserData] = useAtom(userAtom);

  const setAccessToken = (token: string) => {
    localStorage.setItem("accessToken", token);
  };

  const removeAccessToken = () => localStorage.removeItem("accessToken");

  //auth access code using for auth cridential check and otp verification
  const authAccessCode = () => localStorage.getItem("authAccessCode");

  const setAuthAccessCode = (token: string) => {
    localStorage.setItem("authAccessCode", token);
  };

  const removeAuthAccessCode = () => localStorage.removeItem("authAccessCode");
  const removeFcmToken = () => localStorage.removeItem("fcmToken");
  const removeOtpExpired = () => localStorage.removeItem("otpExpired");
  const removeStoredEmail = () => localStorage.removeItem("email");
  const removeCurrentUser = () => {
    localStorage.removeItem("currentUser");
    setUserData(null);
  };

  const logoutMutation = useMutation({
    mutationFn: () => authApiRepository.logout(),
    onSuccess: () => {
      removeAccessToken();
      localStorage.removeItem("isSpaClinic");
      localStorage.removeItem("isPartner");
      // removeCurrentUser();
      removeFcmToken();
      removeOtpExpired();
      removeStoredEmail();
      removeAuthAccessCode();
    },
    onError: () => {
      removeAccessToken();
      // removeCurrentUser();
      removeFcmToken();
      removeOtpExpired();
      removeStoredEmail();
      removeAuthAccessCode();
    },
  });
  const removeAllAndLogout = () => {
    logoutMutation.mutate();
  };

  return {
    getAccessToken,
    setAccessToken,
    removeAccessToken,
    authAccessCode,
    setAuthAccessCode,
    removeAuthAccessCode,
    removeCurrentUser,
    removeFcmToken,
    removeOtpExpired,
    removeStoredEmail,
    removeAllAndLogout,
  };
}
