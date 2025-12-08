import { Shell } from "@/components/layout/Shell";
import { CreateInvoiceForm } from "@/components/finance/create-invoice-form";
import { prisma } from "@/lib/prisma";
import { requireTenantMembership } from "@/lib/tenant-auth";

export default async function NewInvoicePage() {
  const { tenant } = await requireTenantMembership();

  const clients = await prisma.contact.findMany({
    where: { tenantId: tenant.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      company: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <Shell>
      <CreateInvoiceForm clients={clients} />
    </Shell>
  );
}
