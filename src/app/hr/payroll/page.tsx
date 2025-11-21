import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { DollarSign, Calendar, Download, CheckCircle } from "lucide-react";

const payrolls = [
  {
    id: "PAY-001",
    period: "Oct 2023",
    amount: 845000,
    status: "PENDING",
    date: "Oct 31, 2023",
  },
  {
    id: "PAY-002",
    period: "Sep 2023",
    amount: 842000,
    status: "PAID",
    date: "Sep 30, 2023",
  },
  {
    id: "PAY-003",
    period: "Aug 2023",
    amount: 838000,
    status: "PAID",
    date: "Aug 31, 2023",
  },
];

export default function PayrollPage() {
  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
            <p className="text-muted-foreground">
              Manage salaries and payment history.
            </p>
          </div>
          <Button>
            <DollarSign className="h-4 w-4 mr-2" />
            Run Payroll
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Next Payout
            </h3>
            <div className="text-3xl font-bold">$845,000</div>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Due Oct 31, 2023
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Total Employees
            </h3>
            <div className="text-3xl font-bold">124</div>
            <div className="flex items-center gap-2 mt-4 text-sm text-green-500">
              <CheckCircle className="h-4 w-4" />
              All active
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              YTD Payroll
            </h3>
            <div className="text-3xl font-bold">$8.4M</div>
            <div className="mt-4 text-sm text-muted-foreground">
              Fiscal Year 2023
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-4">Pay Period</th>
                <th className="px-6 py-4">Payment Date</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {payrolls.map((pay) => (
                <tr key={pay.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium">{pay.period}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {pay.date}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ${pay.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        pay.status === "PAID"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {pay.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Report
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
