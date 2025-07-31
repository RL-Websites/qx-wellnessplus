import { RouteObject } from "react-router-dom";
import DetailsPage from "./order-details/details.page";
import OrderHistoryPage from "./order-list/order-history.page";

export const OrderRoute: RouteObject[] = [
  {
    path: "",
    element: <OrderHistoryPage />,
  },
  {
    path: ":id/details",
    element: <DetailsPage />,
  },
];
