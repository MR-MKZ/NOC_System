import { prismaClientInstance as prisma } from "../../config/database.js"

async function getFirstAndLastDates() {
    const firstAlertDate = await prisma.alertPack.findFirst({
        select: { start_at: true },
        orderBy: { start_at: 'asc' }
    });

    const lastAlertDate = await prisma.alertPack.findFirst({
        select: { start_at: true },
        orderBy: { start_at: 'desc' }
    });

    const firstIncidentDate = await prisma.notification.findFirst({
        where: { type: 'Incident' },
        select: { alert_create_time: true },
        orderBy: { alert_create_time: 'asc' }
    });

    const lastIncidentDate = await prisma.notification.findFirst({
        where: { type: 'Incident' },
        select: { alert_create_time: true },
        orderBy: { alert_create_time: 'desc' }
    });

    return {
        firstDate: new Date(Math.min(firstAlertDate?.start_at || 0, firstIncidentDate?.alert_create_time || 0)),
        lastDate: new Date(Math.max(lastAlertDate?.start_at || 0, lastIncidentDate?.alert_create_time || 0))
    };
}

function generateDateRanges(startDate, endDate, rangeCount = 10) {
    const ranges = [];
    const timeDiff = (endDate - startDate) / rangeCount;

    for (let i = 0; i < rangeCount; i++) {
        const rangeStart = new Date(startDate.getTime() + i * timeDiff);
        const rangeEnd = new Date(startDate.getTime() + (i + 1) * timeDiff);
        ranges.push({ start: rangeStart, end: rangeEnd });
    }

    return ranges;
}

async function getAlertAndIncidentCounts(ranges) {
    const result = {};

    for (const range of ranges) {
        const alertCount = await prisma.notification.count({
            where: {
                alert_create_time: { gte: range.start, lt: range.end },
                type: "Alert"
            }
        });

        const incidentCount = await prisma.notification.count({
            where: {
                alert_create_time: { gte: range.start, lt: range.end },
                type: 'Incident'
            }
        });

        // Format date for the chart
        const dateKey = `${range.start.getFullYear()}/${range.start.getMonth() + 1}/${range.start.getDate()}`;
        result[dateKey] = [alertCount, incidentCount];
    }

    return result;
}

async function getAlertIncidentCountOnDate() {
    // Step 1: Get first and last dates
    const { firstDate, lastDate } = await getFirstAndLastDates();

    // Step 2: Generate dynamic date ranges
    const dateRanges = generateDateRanges(firstDate, lastDate);

    // Step 3: Get counts of alerts and incidents in each date range
    const data = await getAlertAndIncidentCounts(dateRanges);

    return data;
}


// Get counts for Pie Chart (Alerts vs Incidents) excluding Done and Resolved statuses
async function getOpenAlertsIncidentsCount() {
    const alertCount = await prisma.alertPack.count({
        where: {
            type: 'Alert',
            status: { notIn: ['Done', 'Resolved'] }
        }
    });

    const incidentCount = await prisma.alertPack.count({
        where: {
            type: 'Incident',
            status: { notIn: ['Done', 'Resolved'] }
        }
    });

    return {
        alerts: alertCount,
        incidents: incidentCount
    };
}

async function getTopTeamsIncidentStatus() {
    const topTeams = await prisma.alertPack.groupBy({
        by: ['assigned_team_id'],
        _count: {
            id: true,
        },
        where: {
            status: {
                in: ['Resolved', 'Done'],
            },
        },
        orderBy: {
            _count: {
                id: 'desc',
            },
        },
        take: 5,
    });

    const teamIncidentStatus = [];

    for (const team of topTeams) {
        if (team.assigned_team_id) {
            // Fetch the team name
            const teamInfo = await prisma.team.findUnique({
                where: {
                    id: team.assigned_team_id,
                },
                select: {
                    name: true,
                },
            });

            const openIncidents = await prisma.alertPack.count({
                where: {
                    assigned_team_id: team.assigned_team_id,
                    status: {
                        in: ['Alert', 'Pending', 'InProgress'],
                    },
                },
            });

            const finishedIncidents = team._count.id;

            teamIncidentStatus.push({
                team: teamInfo?.name || 'Unknown Team',
                openIncidents: openIncidents,
                closedIncidents: finishedIncidents,
            });
        }
    }

    return teamIncidentStatus;
}

export default {
    getAlertIncidentCountOnDate,
    getOpenAlertsIncidentsCount,
    getTopTeamsIncidentStatus
}