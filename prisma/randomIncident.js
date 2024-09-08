import { prismaClientInstance as prisma } from "../config/database.js";

import { Status, NotifTypes } from '@prisma/client';

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

for (let x = 0; x < 300; x++) {
    await updateAlertPackAndNotifications()
    console.log(`random incident created. No${x}`);
}
