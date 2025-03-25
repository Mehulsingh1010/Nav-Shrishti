import React from "react";
import { SellerDashboardShell } from "./_components/seller-dashboard-shell";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SellerDashboardShell>{children}</SellerDashboardShell>
    </div>
  );
}

export default layout;
