-- AlterTable
ALTER TABLE "AlertPack" ADD COLUMN     "type" "NotifTypes";

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "receive_time" SET DEFAULT CURRENT_TIMESTAMP;
