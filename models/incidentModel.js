import { prismaClientInstance as prisma } from "../config/database.js";
import { BadRequestException, NotFoundException } from "../utils/customException.js";
import teamModel from "./teamModel.js";
import { getPack } from "./packModel.js"

const findById = async (id) => {
    return await prisma.alertPack.findUnique({
        where: {
            id: id,
            type: "Incident",
            NOT: [
                {
                    status: "Done"
                }
            ]
        }
    })
}

const create = async (packId, teamId) => {
    let team = await teamModel.findById(teamId)
    if (!team) {
        throw new NotFoundException({
            msg: "Team not found"
        })
    }

    let pack = await getPack({ id: packId })
    if (!pack) {
        throw new NotFoundException({
            msg: "Pack not found"
        })
    }

    if (pack.assigned_team_id) {
        throw new BadRequestException({
            msg: "pack is already incident"
        })
    }

    return await prisma.alertPack.update({
        where: {
            id: packId
        },
        data: {
            assigned_team_id: teamId,
            status: "Pending",
            type: "Incident"
        }
    })

}

const updateById = async (id, data) => {
    return await prisma.alertPack.update({
      where: {
        id: id,
        type: "Incident",
        NOT: [
            {
                status: "Done"
            }
        ]
      },
      data: data
    })
}

const deleteById = async (id) => {
    return await prisma.alertPack.update({
        where: {
            id: id,
            type: "Incident",
            NOT: [
                {
                    status: "Done"
                }
            ]
        },
        data: {
            type: "Alert",
            status: "Alert",
            assigned_team: {
                disconnect: true
            },
            master_member: {
                disconnect: true
            }
        }
    })
}

export default {
    findById,
    updateById,
    deleteById,
    create
}