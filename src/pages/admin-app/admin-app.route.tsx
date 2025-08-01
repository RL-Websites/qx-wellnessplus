import { Navigate, RouteObject } from "react-router-dom";

export const AdminAppRoute: RouteObject[] = [
  {
    path: "",
    element: <Navigate to="./dashboard" />,
  },
];
