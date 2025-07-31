import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const PartnerList = lazy(() => import("./partner-list/partners"));
const PartnerDetailsPage = lazy(() => import("./partner-details/partner-details.page"));

export const PartnerRoute: RouteObject[] = [
  {
    path: "",
    element: <PartnerList />,
  },
  {
    path: ":id/details",
    element: <PartnerDetailsPage />,
  },
];
