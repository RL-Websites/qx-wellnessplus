import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const SettingsPage = lazy(() => import("./settings.page"));
const IcdCodesPage = lazy(() => import("./system-codes/icd-codes.page"));
const CptCodePage = lazy(() => import("./system-codes/cpt-code.page"));
const UserListPage = lazy(() => import("./user-list.page"));
const ReceivedApiLogsPage = lazy(() => import("./received-api-logs/received-api-logs"));

export const SettingsRoute: RouteObject[] = [
  {
    path: "",
    element: <SettingsPage />,
  },
  {
    path: "icd-codes",
    element: <IcdCodesPage />,
  },
  {
    path: "cpt-codes",
    element: <CptCodePage />,
  },
  {
    path: "user-list",
    element: <UserListPage />,
  },
  {
    path: "received-api-logs",
    element: <ReceivedApiLogsPage />,
  },
];
