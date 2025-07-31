import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const ClientsPage = lazy(() => import("./client-list/clients.page"));
const ClientDetailsPage = lazy(() => import("./client-details/client-details.page"));

export const ClientRoute: RouteObject[] = [
  {
    path: "",
    element: <ClientsPage />,
  },
  {
    path: ":id/details",
    element: <ClientDetailsPage />,
  },
];
