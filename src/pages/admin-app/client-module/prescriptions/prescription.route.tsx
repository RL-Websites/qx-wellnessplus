import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import { Prescriptions } from "./prescription-list/prescriptions.page";

const PrescriptionDetailsPage = lazy(() => import("./details/prescription-details.page"));

export const PrescriptionsRoute: RouteObject[] = [
  {
    path: "",
    element: <Prescriptions />,
  },
  {
    path: ":id/details",
    element: <PrescriptionDetailsPage />,
  },
];
