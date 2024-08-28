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

// const tickets = [
//     {
//         title: "مشکل اتصال به شبکه",
//         description: "کاربران نمی‌توانند به شبکه متصل شوند.",
//         status: "باز",
//         priorityId: 1, // Assuming priorityId is 1 for high priority
//         categoryId: 1, // Assuming categoryId is 1 for technical
//         createdBy: 1 // Assuming createdBy is 1 for admin
//     },
//     {
//         title: "مشکل پرداخت",
//         description: "پرداخت‌ها از طریق درگاه بانکی با مشکل مواجه شده است.",
//         status: "در حال بررسی",
//         priorityId: 2, // Assuming priorityId is 2 for medium priority
//         categoryId: 2, // Assuming categoryId is 2 for financial
//         createdBy: 2 // Assuming createdBy is 2 for support
//     }
// ];

// const ticketMessages = [
//     {
//         ticketId: 1, // Assuming ticketId is 1 for first ticket
//         message: "این مشکل در حال بررسی است.",
//         userId: 1 // Assuming userId is 1 for admin
//     },
//     {
//         ticketId: 2, // Assuming ticketId is 2 for second ticket
//         message: "مشکل تا حدی برطرف شده است.",
//         userId: 2 // Assuming userId is 2 for support
//     }
// ];

async function main() {
    console.time("seeding")
    
    for (const role of roles) {
        await prisma.role.create({ data: role });
    }

    for (const user of users) {
        await prisma.user.create({ data: user });
    }

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
