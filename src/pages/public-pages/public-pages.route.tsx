import { Navigate, RouteObject } from "react-router-dom";
import CategoryPage from "./category/category.page";
import HomePage from "./home/home.page";

export const PublicPagesRoute: RouteObject[] = [
  {
    path: "",
    element: <Navigate to="./home" />,
  },
  {
    path: "home",
    element: <HomePage />,
  },
  {
    path: "category",
    element: <CategoryPage />,
  },
];
