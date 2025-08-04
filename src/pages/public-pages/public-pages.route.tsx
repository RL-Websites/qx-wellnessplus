import { Navigate, RouteObject } from "react-router-dom";
import CategoryPage from "./category/category.page";
import HomePage from "./home/home.page";
import LoadingPage from "./loading/loading.page";
import Login from "./login/login.page";
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
    path: "login",
    element: <Login />,
  },
  {
    path: "registration",
    element: <RegistrationPage />,
  },
  {
    path: "loading",
    element: <LoadingPage />,
  },
];
