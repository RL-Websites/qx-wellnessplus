import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { SettingsRoute } from "./settings/settings.route";

const ProfilePage = lazy(() => import("./users/profile.page"));
const NotificationsPage = lazy(() => import("./notifications/notifications.page"));

export const AdminAppRoute: RouteObject[] = [
  {
    path: "",
    element: <Navigate to="./dashboard" />,
  },
  {
    path: "profile",
    element: <ProfilePage />,
  },
  {
    path: "notifications",
    element: <NotificationsPage />,
  },
  {
    path: "settings",
    children: SettingsRoute,
  },
  // {
  //   path: "clinic",
  //   children: ClinicModuleRoute,
  // },
];
