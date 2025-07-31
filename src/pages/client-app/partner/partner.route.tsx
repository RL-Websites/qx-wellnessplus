import { RouteObject } from "react-router-dom";
import PartnerDetailsPage from "./partner-details/partner-details.page";
import PartnerList from "./partner-list/partners";

export const PartnerRoute: RouteObject[] = [
  {
    path: "",
    element: <PartnerList />,
  },
  {
    path: ":id/details",
    element: <PartnerDetailsPage />,
  },
];
