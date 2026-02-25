import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardLayout from "../layout/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/auth/Login";
import CustomerManagement from "../pages/dashboard/CustomerManagement";
import ProductsManagement from "../pages/dashboard/ProductsManagement";
import CategoriesManagement from "../pages/dashboard/CategoriesManagement";
import OrdersManagement from "../pages/dashboard/OrdersManagement";
import PaymentManagement from "../pages/dashboard/PaymentManagement";
import PromotionsDiscounts from "../pages/dashboard/PromotionsDiscounts";
import ProductPopularity from "../pages/dashboard/ProductPopularity";
import Settings from "../pages/dashboard/Settings";
import Profile from "../pages/dashboard/Profile";
import ShopManagement from "../pages/dashboard/ShopManagement";


const router = createBrowserRouter([
  {
    path: "/",
    element:  <Navigate to="/dashboard" replace />,
  },
  { path: "/login", element: <Login /> },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "customers",
        element: <CustomerManagement />,
      },
      {
        path: "products",
        element: <ProductsManagement />,
      },
      {
        path: "shop-management",
        element: <ShopManagement />,
      },
      {
        path: "categories",
        element: <CategoriesManagement />,
      },
      {
        path: "orders",
        element: <OrdersManagement />,
      },
      {
        path: "payment",
        element: <PaymentManagement />,
      },
      {
        path: "promotions",
        element: <PromotionsDiscounts />,
      },
      {
        path: "product-popularity",
        element: <ProductPopularity />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);

export default router;
