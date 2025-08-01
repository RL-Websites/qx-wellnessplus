import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AuthGuard from "./common/components/AuthGuard";
import UserNotFoundPage from "./common/components/UserNotFound";
import { AuthRoute } from "./pages/auth/auth.route";
import VerifyUser from "./pages/auth/login/verify-otp";
import { WebAppRoute } from "./pages/website/web-app.route";
const PanelNavigator = lazy(() => import("./common/components/NavigateToPanel"));
const NotFoundPage = lazy(() => import("./common/components/not-found.page"));

export const RootRoute = createBrowserRouter([
  {
    path: "",
    element: <PanelNavigator />,
  },
  {
    path: "",
    children: AuthRoute,
  },
  {
    path: "",
    element: <AuthGuard userType={["admin"]} />,
    children: WebAppRoute,
  },
  {
    path: "auth-verification",
    element: <VerifyUser />,
  },

  {
    path: "user-not-found",
    element: <UserNotFoundPage />,
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
