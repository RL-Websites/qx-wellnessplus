import { RouteObject } from "react-router-dom";
import QuizPage from "./all-quiz/quiz.page";

import CategoryPage from "./category/category.page";
import IneligibleUser from "./ineligible-user/ineligible-user.page";
import LoadingPage from "./loading/loading.page";
import Login from "./login/login.page";
import MedicationsPage from "./medication/medications.page";
import OrderSummary from "./order-summary/order-summary.page";
import RegistrationPage from "./registration/registration.page";

export const PublicPagesRoute: RouteObject[] = [
  {
    path: "category",
    element: <CategoryPage />,
  },
  {
    path: "medications",
    element: <MedicationsPage />,
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
  {
    path: "order-summary",
    element: <OrderSummary />,
  },
  {
    path: "quiz",
    element: <QuizPage />,
  },
  {
    path: "ineligible-user",
    element: <IneligibleUser />,
  },
];
