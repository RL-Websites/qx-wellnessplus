import { RouteObject } from "react-router-dom";
import ChangePassword from "./change-password";
import ForgetPassword from "./forget-password";
import LoginPage from "./login.page";
import SignUpPage from "./sign-up-page";

export const AuthRoute: RouteObject[] = [
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "change-password",
    element: <ChangePassword />,
  },
  {
    path: "sign-up",
    element: <SignUpPage />,
  },
];
