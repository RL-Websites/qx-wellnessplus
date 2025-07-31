import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { SettingsRoute } from "../settings/settings.route";
import { ClientRoute } from "./client/client.route";
import { PartnerRoute } from "./partner/partner.route";
import { PrescriptionsRoute } from "./prescriptions/prescription.route";
import { ReportsRoute } from "./report/report.route";

const DashboardPage = lazy(() => import("./dashboard/dashboard"));

const ClientModuleRoute: RouteObject[] = [
  {
    path: "",
    element: <Navigate to={"/dashboard"} />,
  },
  {
    path: "dashboard",
    element: <DashboardPage />,
  },
  {
    path: "client",
    children: ClientRoute,
  },
  {
    path: "partner-account",
    children: PartnerRoute,
  },
  {
    path: "prescriptions",
    children: PrescriptionsRoute,
  },
  {
    path: "reports",
    children: ReportsRoute,
  },
  {
    path: "settings",
    children: SettingsRoute,
  },
];

export default ClientModuleRoute;
