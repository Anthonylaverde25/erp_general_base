import { lazy } from "react";

const BankAccountsTabView = lazy(
  () => import("../components/BankAccountsTabView"),
);

export default function BankAccountTabView() {
  return <BankAccountsTabView />;
}
