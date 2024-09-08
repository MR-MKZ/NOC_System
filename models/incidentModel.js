import { prismaClientInstance as prisma } from "../config/database.js";
import { BadRequestException, NotFoundException } from "../utils/customException.js";
import teamModel from "./teamModel.js";
import { getPack } from "./packModel.js"
import userModel from "./userModel.js";

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
        throw new BadRequestException({
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

    await prisma.alertPack.update({
        where: {
            id: packId
        },
        data: {
            master_memberId: masterMember,
            status: "InProgress"
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
        let allowedUsers = !(await userModel.findUsers(members)).some(user => user.team_id != pack.assigned_team_id);        

        if (!allowedUsers) {
            await prisma.alertPack.update({
                where: {
                    id: packId
                },
                data: {
                    master_member: {
                        disconnect: true
                    },
                    status: "Pending"
                }
            })

            await prisma.user.update({
                where: {
                    id: masterMember
                },
                data: {
                    pack: {
                        disconnect: true
                    }
                }
            })

            throw new BadRequestException({
                msg: "some of members are not in assigned pack team"
            })
        }

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

export default {
    findById,
    updateById,
    deleteById,
    create,
    assignToMember
}