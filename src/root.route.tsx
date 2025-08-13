import { lazy } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import AuthGuard from "./common/components/AuthGuard";
import UserNotFoundPage from "./common/components/UserNotFound";
import HomeLayout from "./common/layouts/HomeLayout";
import { AdminAppRoute } from "./pages/admin-app/admin-app.route";
import { AuthRoute } from "./pages/auth/auth.route";

import { PrivatePagesRoute } from "./pages/private-pages/private-pages.route";
import HomePage from "./pages/public-pages/home/home.page";
import { PublicPagesRoute } from "./pages/public-pages/public-pages.route";
const PanelNavigator = lazy(() => import("./common/components/NavigateToPanel"));
const NotFoundPage = lazy(() => import("./common/components/not-found.page"));

export const RootRoute = createBrowserRouter([
  // {
  //   path: "",
  //   element: <PanelNavigator />,
  // },
  {
    path: "",
    element: <HomePage />,
  },
  {
    path: "",
    children: AuthRoute,
  },

  {
    path: "",
    element: (
      <HomeLayout>
        <Outlet />
      </HomeLayout>
    ),
    children: PublicPagesRoute,
  },
  {
    path: "",
    element: (
      <HomeLayout>
        <AuthGuard userType={["patient"]} />
      </HomeLayout>
    ),
    children: PrivatePagesRoute,
  },
  {
    path: "",
    element: <AuthGuard userType={["admin"]} />,
    children: AdminAppRoute,
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
