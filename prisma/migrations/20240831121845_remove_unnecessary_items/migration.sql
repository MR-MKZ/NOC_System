/*
  Warnings:

  - You are about to drop the column `action_delay` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `decider_id` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `heade_id` on the `Team` table. All the data in the column will be lost.
  - Added the required column `head_id` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_decider_id_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_heade_id_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "action_delay",
DROP COLUMN "decider_id";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "heade_id",
ADD COLUMN     "head_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_head_id_fkey" FOREIGN KEY ("head_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
