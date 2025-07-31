import { RouteObject } from "react-router-dom";
import ProductDetailsPage from "../products/details/product-details.page";
import PatientDetailsPage from "./patient-details/patient-details";
import Patients from "./patients/patients";
import ProductPageList from "./products/product-list.page";

export const PatientRoute: RouteObject[] = [
  {
    path: "",
    element: <Patients />,
  },
  {
    path: ":id/details",
    element: <PatientDetailsPage />,
  },
  {
    path: "products",
    element: <ProductPageList />,
  },
  {
    path: "details/:id",
    element: <ProductDetailsPage />,
  },
];
