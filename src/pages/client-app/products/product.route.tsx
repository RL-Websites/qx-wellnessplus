import { RouteObject } from "react-router-dom";
import AddProductPage from "./add-product/add-product.page";
import ProductDetailsPage from "./details/product-details.page";
import ProductPageList from "./product-list/product-list.page";

export const ProductRoute: RouteObject[] = [
  {
    path: "",
    element: <ProductPageList />,
  },
  {
    path: "details/:id",
    element: <ProductDetailsPage />,
  },
  {
    path: "add-product",
    element: <AddProductPage />,
  },
  {
    path: "edit-product/:id",
    element: <AddProductPage />,
  },
];
