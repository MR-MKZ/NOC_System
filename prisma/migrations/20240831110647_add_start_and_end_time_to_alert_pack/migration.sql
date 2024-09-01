/*
  Warnings:

  - You are about to drop the column `priority` on the `AlertPack` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AlertPack" DROP COLUMN "priority",
ADD COLUMN     "end_at" TIMESTAMP(3),
ADD COLUMN     "start_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "type" SET DEFAULT 'Alert';

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "priority" "Priority",
ALTER COLUMN "type" SET DEFAULT 'Alert';
