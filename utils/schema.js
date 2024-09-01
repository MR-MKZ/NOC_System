import * as yup from "yup"

export const packPrioritySchema = yup.object().shape({
    id: yup.number().required("Pack id is required"),
    priority: yup.string().oneOf(['Low', 'Medium', 'High'], "Priority is not valid.").required("Priority is required")
})