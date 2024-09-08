import { prismaClientInstance as prisma } from "../config/database.js";

import { Status, NotifTypes } from '@prisma/client';
import logUpdate from "log-update";

async function updateAlertPackAndNotifications() {
    const alertPacks = await prisma.alertPack.findMany({
        include: { notifications: true }
    });

    if (alertPacks.length === 0) {
        console.log('No AlertPacks found.');
        return;
    }

    const randomAlertPack = alertPacks[Math.floor(Math.random() * alertPacks.length)];

    await prisma.alertPack.update({
        where: { id: randomAlertPack.id },
        data: {
            type: NotifTypes.Incident,
            status: (randomAlertPack.status !== Status.Resolved && randomAlertPack.status !== Status.Done)
                ? Status.Pending
                : randomAlertPack.status,
            assigned_team_id: await getRandomTeamId(),
        },
    });

    if (randomAlertPack.notifications.length > 0) {
        const randomNotification = randomAlertPack.notifications[Math.floor(Math.random() * randomAlertPack.notifications.length)];
        await prisma.notification.update({
            where: { id: randomNotification.id },
            data: {
                type: NotifTypes.Incident,
            },
        });
    }
}

async function getRandomTeamId() {
    const teams = await prisma.team.findMany();
    if (teams.length === 0) {
        return null;
    }
    const randomTeam = teams[Math.floor(Math.random() * teams.length)];
    return randomTeam.id;
}

let total = 1200

for (let x = 0; x < total; x++) {
    await updateAlertPackAndNotifications()
    logUpdate(`Progress: ${((x * 100) / total).toFixed(1)}%`)
}

console.log(`Process completed at ${new Date().toLocaleTimeString()}`);