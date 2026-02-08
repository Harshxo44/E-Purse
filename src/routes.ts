import { createBrowserRouter } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Expenses } from "./pages/Expenses";
import { Analytics } from "./pages/Analytics";
import { Budgets } from "./pages/Budgets";
import { Settings } from "./pages/Settings";
import { MainLayout } from "./components/layout/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "expenses", Component: Expenses },
      { path: "analytics", Component: Analytics },
      { path: "budgets", Component: Budgets },
      { path: "settings", Component: Settings },
    ],
  },
]);
