import { RouteObject } from "react-router-dom";
import CompleteOrderPage from "./complete-order/CompleteOrder.page";
import PatientIntake from "./patient-intake/patient-intake";

export const PrivatePagesRoute: RouteObject[] = [
  {
    path: "complete-order",
    element: <CompleteOrderPage />,
  },
  {
    path: "patient-intake",
    element: <PatientIntake />,
  },
];
