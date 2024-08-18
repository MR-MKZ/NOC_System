const { Prisma } = require('@prisma/client');
const prisma = require('../config/database');

// تابع برای ایجاد پیام تیکت
exports.createTicketMessage = async (data) => {
    try {
        const newMessage = await prisma.ticketMessage.create({
            data: {
                ticketId: data.ticketId,
                message: data.message,
                userId: data.userId,
            },
        });
        return newMessage;
    } catch (error) {
        console.log(error);
        return {
            message: 'Error creating ticket message',
            error: error,
        };
    }
};
exports.getTicketMessage =async (ticketId) => {
    ticketId = Number(ticketId)
    try {
        const ticketMessages = await prisma.ticketMessage.findMany({
            where: {
                ticketId: ticketId
            },
            include: {
                user: {
               
                    select: {
                        name: true,
                        role: {
                            select:{
                                englishName:true
                            }
                        }
                    }
                }
            }
        });

        return ticketMessages
    } catch (error) {
        console.log(error);
        return {
            message: 'Error getting ticket message',
            error: error,
        };
    }
}