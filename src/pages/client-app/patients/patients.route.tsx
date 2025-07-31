import { RouteObject } from "react-router-dom";
import PatientDetailsPage from "./patient-details/patient-details";
import PatientList from "./patient-list/patient-list";

export const PatientsRoute: RouteObject[] = [
  {
    path: "",
    element: <PatientList />,
  },
  {
    path: ":id/details",
    element: <PatientDetailsPage />,
  },
];
