-- AlterTable
ALTER TABLE "CustomRole"
ADD COLUMN "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[];
