-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Alert', 'Resolved', 'Pending', 'InProgress', 'Done');

-- CreateEnum
CREATE TYPE "NotifTypes" AS ENUM ('Alert', 'Incident');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('Admin', 'Team_724', 'Head', 'Member');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('High', 'Medium', 'Low');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" "Roles" NOT NULL DEFAULT 'Member',

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "heade_id" INTEGER NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "decider_id" INTEGER,
    "type" "NotifTypes",
    "text" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "service_addr" TEXT NOT NULL,
    "receive_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action_delay" TEXT,
    "alert_create_time" TIMESTAMP(3) NOT NULL,
    "resolve_time" TIMESTAMP(3),
    "values" JSONB NOT NULL,
    "org_id" INTEGER NOT NULL,
    "pack_id" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertPack" (
    "id" SERIAL NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "type" "NotifTypes",
    "master_memberId" INTEGER,
    "assigned_team_id" INTEGER,
    "status" "Status" NOT NULL DEFAULT 'Alert',
    "priority" "Priority",
    "in_progress_time" TIMESTAMP(3),
    "finish_time" TIMESTAMP(3),
    "elapsed_time" TEXT,

    CONSTRAINT "AlertPack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentReport" (
    "id" SERIAL NOT NULL,
    "incident_title" TEXT NOT NULL,
    "incident_service" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "Soloution" TEXT NOT NULL,
    "elapsed_time" TEXT NOT NULL,
    "resources" TEXT NOT NULL,

    CONSTRAINT "IncidentReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_heade_id_fkey" FOREIGN KEY ("heade_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_decider_id_fkey" FOREIGN KEY ("decider_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "AlertPack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertPack" ADD CONSTRAINT "AlertPack_master_memberId_fkey" FOREIGN KEY ("master_memberId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertPack" ADD CONSTRAINT "AlertPack_assigned_team_id_fkey" FOREIGN KEY ("assigned_team_id") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
