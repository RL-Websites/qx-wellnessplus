import { Navigate, RouteObject } from "react-router-dom";
import HomePage from "./home/home.page";

export const WebAppRoute: RouteObject[] = [
  {
    path: "",
    element: <Navigate to="./home" />,
  },
  {
    path: "home",
    element: <HomePage />,
  },
];
