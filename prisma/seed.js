import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

const roles = [
    { name: 'مدیر', englishName: 'admin' },
    { name: 'پشتیبانی', englishName: 'support' },
    { name: 'کاربر', englishName: 'user' }
];

// const categories = [
//     { name: 'تکنیکی', description: 'مشکلات فنی' },
//     { name: 'مالی', description: 'مسائل مالی' },
//     { name: 'عمومی', description: 'سوالات عمومی' }
// ];

// const priorities = [
//     { level: 'high', description: 'اولویت بالا' },
//     { level: 'medium', description: 'اولویت متوسط' },
//     { level: 'low', description: 'اولویت پایین' }
// ];

const users = [
    {
        name: "مهران",
        username: "admin",
        password: "$2b$10$nFJrIN8awhhCoiWOOa9cUe54Exip4a.8K6Uux3zpeH86i0QbvsyLq",
        email: "admin@example.com",
        roleId: 1 // Assuming roleId is 1 for admin
    },
    {
        name: "علیرضا",
        username: "support",
        password: "$2b$10$nFJrIN8awhhCoiWOOa9cUe54Exip4a.8K6Uux3zpeH86i0QbvsyLq",
        email: "support@example.com",
        roleId: 2 // Assuming roleId is 2 for support
    },
    {
        name: "محمد",
        username: "user",
        password: "$2b$10$nFJrIN8awhhCoiWOOa9cUe54Exip4a.8K6Uux3zpeH86i0QbvsyLq",
        email: "user@example.com",
        roleId: 3 // Assuming roleId is 3 for user
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
    for (const role of roles) {
        await prisma.role.create({ data: role });
    }

    // for (const category of categories) {
    //     await prisma.category.create({ data: category });
    // }

    // for (const priority of priorities) {
    //     await prisma.priority.create({ data: priority });
    // }

    for (const user of users) {
        await prisma.user.create({ data: user });
    }

    // for (const ticket of tickets) {
    //     await prisma.ticket.create({ data: ticket });
    // }

    // for (const ticketMessage of ticketMessages) {
    //     await prisma.ticketMessage.create({ data: ticketMessage });
    // }

    console.log('Seeding finished.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
