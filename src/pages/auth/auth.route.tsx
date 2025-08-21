import { RouteObject } from "react-router-dom";
import LoginPage from "./login.page";
import VerifyUser from "./login/verify-otp";
import SignUpPage from "./sign-up-page";

export const AuthRoute: RouteObject[] = [
  {
    path: "login-in",
    element: <LoginPage />,
  },
  {
    path: "auth-verification",
    element: <VerifyUser />,
  },
  // {
  //   path: "forget-password",
  //   element: <ForgetPassword />,
  // },
  // {
  //   path: "change-password",
  //   element: <ChangePassword />,
  // },
  {
    path: "sign-up",
    element: <SignUpPage />,
  },
];
