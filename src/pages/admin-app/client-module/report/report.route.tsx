import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const ReportList = lazy(() => import("./reports/report-list"));

export const ReportsRoute: RouteObject[] = [
  {
    path: "",
    element: <ReportList />,
  },
];
