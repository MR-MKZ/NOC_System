import { PrismaClient } from '@prisma/client';

class PrismaClientSingleton {
    constructor() {
        if (!PrismaClientSingleton.instance) {
            PrismaClientSingleton.instance = new PrismaClient();
        }
    }

    /**
     * An instance of prisma client
     * @returns {import('@prisma/client').PrismaClient}
     */
    getInstance() {
        return PrismaClientSingleton.instance;
    }
}

export const prismaClientInstance = new PrismaClientSingleton().getInstance();