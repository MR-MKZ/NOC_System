import { prismaClientInstance as prisma } from "../config/database.js";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../utils/customException.js";
import teamModel from "./teamModel.js";
import { getPack } from "./packModel.js"
import userModel from "./userModel.js";
import calculateProgressTime from "../utils/calculateProgressTime.js"

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

const create = async (packId, teamId, notifIds) => {
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

    await prisma.notification.updateMany({
        where: {
            id: {
                in: notifIds
            }
        },
        data: {
            type: "Incident"
        }
    })

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

const assignToMember = async (packId, headId, masterMember, members) => {
    let pack = await getPack({ id: packId })
    let head = await userModel.findById(headId)
    let user = await userModel.findById(masterMember)
    if (!pack) {
        throw new NotFoundException({
            msg: "Pack not found"
        })
    }

    if (pack.assigned_team_id != head.team_id) {
        throw new UnauthorizedException({
            msg: "You are not head of this team"
        })
    }

    if (!pack.assigned_team_id) {
        throw new BadRequestException({
            msg: "pack is not incident"
        })
    }

    if (pack.master_memberId) {
        throw new BadRequestException({
            msg: "pack already has master member"
        })
    }

    if (pack.assigned_team_id != user.team_id) {
        throw new BadRequestException({
            msg: "pack is not for master member's team"
        })
    }

    if (members.length > 0) {
        let users = await userModel.findUsers(members)
        let allowedUsers = !users.some(user => user.team_id != pack.assigned_team_id);

        if (users.length < members.length) {
            let missingIds = members.filter(id => !users.some(user => user.id === id));
            throw new BadRequestException({
                msg: "some of members are not exist",
                data: missingIds
            })
        }

        if (!allowedUsers) {
            throw new BadRequestException({
                msg: "some of members are not in assigned pack team"
            })
        }
    }

    await prisma.alertPack.update({
        where: {
            id: packId
        },
        data: {
            master_memberId: masterMember,
            status: "InProgress",
            in_progress_time: new Date()
        }
    })

    await prisma.user.update({
        where: {
            id: masterMember
        },
        data: {
            pack_id: packId
        }
    })

    if (members.length > 0) {
        await prisma.user.updateMany({
            where: {
                id: {
                    in: members
                }
            },
            data: {
                pack_id: packId
            }
        })
    }
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

const resolveById = async (id, userId) => {
    let incidentPack = await findById(id)

    if (!incidentPack) {
        throw new NotFoundException({
            msg: "Pack not found"
        })
    }

    if (incidentPack.master_memberId != userId) {
        throw new UnauthorizedException({
            msg: "You are not master member of this incident!"
        })
    }

    const elapsed_time = calculateProgressTime(incidentPack.in_progress_time, new Date())

    return await prisma.alertPack.update({
        where: {
            id: id,
            status: "InProgress"
        },
        data: {
            status: "Done",
            finish_time: new Date(),
            elapsed_time: elapsed_time,
            end_at: new Date()
        }
    })
}

export default {
    findById,
    updateById,
    deleteById,
    create,
    assignToMember,
    resolveById
}