const prisma = require('../config/database');

async function cleanup() {
    const tableNames = [
        'User',
        'Role',
        'Team',
        'Notification',
        'AlertPack',
        'IncidentReport'
    ];

    for (const tableName of tableNames) {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`);
    }

    console.log('Database cleanup and reset completed.');
}

cleanup()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
