import * as yup from "yup"

export const packPrioritySchema = yup.object().shape({
    id: yup.number().required("Pack id is required"),
    priority: yup.string().oneOf(['Low', 'Medium', 'High'], "Priority is not valid.").required("Priority is required")
})

export const createIncidentSchema = yup.object().shape({
    packId: yup.number().required("Pack id is required"),
    teamId: yup.number().required("Team id is required"),
    notifications: yup.array().of(
        yup.number().positive().required()
    ).min(1, 'Notification must contain at least 1 item').required("Notification is required")
})

export const assignIncidentSchema = yup.object().shape({
    packId: yup.number().required("Pack id is required"),
    headId: yup.number().required("Pack id is required"),
    masterMember: yup.number().required("Master member id is required"),
    members: yup.array().of(
        yup.number()
            .typeError("Each member must be a number")
            .positive("Each member must be a positive number")
            .integer("Each member must be an integer")
            .required("Member id is required")
            .strict()
    )
})

export const resolveIncidentSchema = yup.object().shape({
    packId: yup.number().required("pack id id is required"),
    userId: yup.number().required("user id id is required")
})

export const updateTeamValidation = yup.object().shape({
    name: yup.string(),
    headId: yup.number()
})

export const deleteTeamValidation = yup.number()

export const addUserValidation = yup.object().shape({
    userId: yup.number().required("User id is required"),
    teamId: yup.number().required("Team id is required")
})

export const userSchema = yup.object().shape({
    username: yup.string().trim().required("Username is required"),
    password: yup.string().min(8).trim().required("Password is required"),
    email: yup.string().email().required("Email is required"),
    role: yup.string().oneOf(["Team_724", "Head", "Member"], "User role should be one of this options: Team_724, Head, Member").required("User role is required")
})

export const updateUserSchema = yup.object().shape({
    username: yup.string().trim(),
    password: yup.string().min(8).trim(),
    email: yup.string().email(),
    role_id: yup.string().oneOf(["Team_724", "Head", "Member"], "User role should be one of this options: Team_724, Head, Member")
})

export const getUserSchema = yup.number()

export const getAllUsersRoleSchema = yup.string().oneOf(["Admin", "Team_724", "Head", "Member"], "Role is not valid")