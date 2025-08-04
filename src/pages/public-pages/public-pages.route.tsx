import { Navigate, RouteObject } from "react-router-dom";
import CategoryPage from "./category/category.page";
import HomePage from "./home/home.page";
import RegistrationPage from "./registration/registration.page";

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
  {
    path: "registration",
    element: <RegistrationPage />,
  },
];
