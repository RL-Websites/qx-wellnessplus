import { Navigate, RouteObject } from "react-router-dom";
import ExistingPrescribe from "./common/prescribe/existing-prescribe/existing-prescribe";
import NewPrescribePage from "./common/prescribe/new-prescribe/new-prescribe.page";
import PrescribePatientPage from "./common/prescribe/prescribe-patient.page";
import Dashboard from "./dashboard/dashboard";
import HelpfulDocuments from "./documets/helpful-documents";
import MyProfile from "./my-profile/my-profile";
import Orders from "./orders/orders";
import { PatientRoute } from "./patient/patient.route";
import { ProductRoute } from "./products/product.route";
import { StandardUsers } from "./standard-users/standard-users";

export const PartnerAppRoute: RouteObject[] = [
  {
    path: "",
    element: <Navigate to="./dashboard" />,
  },
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "patients",
    children: PatientRoute,
  },
  {
    path: "add-patient",
    element: <PrescribePatientPage />,
  },
  {
    path: "add-patient/existing-patient",
    element: <ExistingPrescribe />,
  },
  {
    path: "add-patient/new-patient",
    element: <NewPrescribePage />,
  },
  {
    path: "standard-users",
    element: <StandardUsers />,
  },
  {
    path: "products",
    children: ProductRoute,
  },
  {
    path: "orders",
    element: <Orders />,
  },
  {
    path: "documents",
    element: <HelpfulDocuments />,
  },
  {
    path: "profile",
    element: <MyProfile />,
  },
];
