import { RouteObject } from "react-router-dom";
import CompleteOrderPage from "./complete-order/CompleteOrder.page";

export const PrivatePagesRoute: RouteObject[] = [
  {
    path: "complete-order",
    element: <CompleteOrderPage />,
  },
];
