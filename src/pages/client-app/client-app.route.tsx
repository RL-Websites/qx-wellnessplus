import { Navigate, RouteObject } from "react-router-dom";
import DashboardPage from "./dashboard/dashboard";
import MyProfile from "./my-profile/my-profile";
import Orders from "./orders/orders";
import { PartnerRoute } from "./partner/partner.route";
import { PatientsRoute } from "./patients/patients.route";
import { ProductRoute } from "./products/product.route";

const ClientAppRoute: RouteObject[] = [
  {
    path: "",
    element: <Navigate to={"./dashboard"} />,
  },
  {
    path: "dashboard",
    element: <DashboardPage />,
  },
  {
    path: "products",
    children: ProductRoute,
  },
  {
    path: "partner-accounts",
    children: PartnerRoute,
  },
  {
    path: "patients",
    children: PatientsRoute,
  },
  {
    path: "orders",
    element: <Orders />,
  },
  {
    path: "profile",
    element: <MyProfile />,
  },
];

export default ClientAppRoute;
