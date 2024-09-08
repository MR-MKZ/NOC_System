-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pack_id" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "AlertPack"("id") ON DELETE SET NULL ON UPDATE CASCADE;
