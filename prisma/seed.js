import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

const roles = [
    { name: 'Admin' },    // roleId: 1
    { name: 'Team_724' }, // roleId: 2
    { name: 'Head' },     // roleId: 3
    { name: 'Member' }    // roleId: 4
];

const users = [
    {
        username: "admin",
        password: "$2b$10$nFJrIN8awhhCoiWOOa9cUe54Exip4a.8K6Uux3zpeH86i0QbvsyLq",
        email: "admin@example.com",
        role_id: 1 // Assuming roleId 1 for admin
    },
    {
        username: "team724",
        password: "$2b$10$nFJrIN8awhhCoiWOOa9cUe54Exip4a.8K6Uux3zpeH86i0QbvsyLq",
        email: "724@example.com",
        role_id: 2 // Assuming roleId 2 for team 724
    },
    {
        username: "team.head",
        password: "$2b$10$nFJrIN8awhhCoiWOOa9cUe54Exip4a.8K6Uux3zpeH86i0QbvsyLq",
        email: "head@example.com",
        role_id: 3 // Assuming roleId 3 for head
    },
    {
        username: "member",
        password: "$2b$10$nFJrIN8awhhCoiWOOa9cUe54Exip4a.8K6Uux3zpeH86i0QbvsyLq",
        email: "member@example.com",
        role_id: 4 // Assuming roleId 4 for member
    }
];

const team724 = {
    name: "724",
    head_id: 2
}

async function main() {
    console.time("seeding")
    
    for (const role of roles) {
        await prisma.role.create({ data: role });
    }

    for (const user of users) {
        await prisma.user.create({ data: user });
    }

    await prisma.team.create({
        data: team724
    })

    console.timeEnd("seeding")
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
