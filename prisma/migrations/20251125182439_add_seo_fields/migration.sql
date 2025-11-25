-- DropForeignKey
ALTER TABLE "SitePage" DROP CONSTRAINT "SitePage_tenantId_fkey";

-- AlterTable
ALTER TABLE "SitePage" ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaKeywords" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "ogImage" TEXT;

-- CreateIndex
CREATE INDEX "SitePage_tenantId_idx" ON "SitePage"("tenantId");

-- AddForeignKey
ALTER TABLE "SitePage" ADD CONSTRAINT "SitePage_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
