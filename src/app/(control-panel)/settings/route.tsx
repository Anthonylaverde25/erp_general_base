import { lazy } from "react";
import { Navigate, Outlet } from "react-router";
import { FuseRouteItemType } from "@fuse/utils/FuseUtils";

const SettingsAppView = lazy(
  () => import("./components/views/SettingsAppView"),
);
const SettingPage = lazy(
  () => import("@/ui/admin-settings/pages/SettingPage"),
);
const SecurityTabView = lazy(
  () => import("./components/views/SecurityTabView"),
);
const PlanBillingTabView = lazy(
  () => import("./components/views/PlanBillingTabView"),
);
const NotificationsTabView = lazy(
  () => import("./components/views/NotificationsTabView"),
);
const TeamTabView = lazy(() => import("@/ui/users/pages/TeamTabView"));
const RolesTabView = lazy(() => import("@/ui/roles/pages/RoleTabView"));
const BankAccountTabView = lazy(
  () => import("@/ui/bank_accounts/pages/BankAccountTabView"),
);

/**
 * The Settings App Route.
 */
const Route: FuseRouteItemType = {
  path: "apps/settings",
  element: (
    <SettingsAppView>
      <Outlet />
    </SettingsAppView>
  ),
  children: [
    {
      path: "account",
      element: <SettingPage />,
    },
    {
      path: "security",
      element: <SecurityTabView />,
    },
    {
      path: "plan-billing",
      element: <PlanBillingTabView />,
    },
    {
      path: "security",
      element: <SecurityTabView />,
    },
    {
      path: "notifications",
      element: <NotificationsTabView />,
    },
    {
      path: "team",
      element: <TeamTabView />,
    },
    {
      path: "roles",
      element: <RolesTabView />,
    },
    {
      path: "bank-accounts",
      element: <BankAccountTabView />,
    },
    {
      path: "",
      element: <Navigate to="account" />,
    },
  ],
};

export default Route;
