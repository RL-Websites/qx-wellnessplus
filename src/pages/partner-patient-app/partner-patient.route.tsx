import { Navigate, RouteObject } from "react-router-dom";
import DashboardPage from "./dashboard/dashboard";
import MyProfile from "./my-profile/my-profile";
import { OrderRoute } from "./order-history/order.route";

export const PartnerPatientRoute: RouteObject[] = [
  {
    path: "",
    element: <Navigate to="./dashboard" />,
  },
  {
    path: "dashboard",
    element: <DashboardPage />,
  },
  {
    path: "orders",
    children: OrderRoute,
  },
  {
    path: "profile",
    element: <MyProfile />,
  },
];
