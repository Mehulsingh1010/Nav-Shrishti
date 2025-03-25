import { BankDetailsForm } from "../_components/bank-details-form"
import { SellerDashboardShell } from "../_components/seller-dashboard-shell"




export default function BankDetailsPage() {
  return (
    <SellerDashboardShell>
      <div className="w-full max-w-5xl mx-auto">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#B34700]">Bank Details</h1>
            <p className="text-muted-foreground">Manage your bank account information for payments</p>
          </div>
          <BankDetailsForm />
        </div>
      </div>
    </SellerDashboardShell>
  )
}

