import axios from "axios";

export const callAiWebhook = async (data) => {
    const response = await axios.post(process.env.AI_WEBHOOK, data, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    return response
}