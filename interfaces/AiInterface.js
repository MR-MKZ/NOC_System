import axios from "axios";
import { getPack, updatePackById } from "../models/packModel.js";

const url = process.env.AI_BASE_URL;

const headers = {
    "Content-Type": "application/json"
}

const getPredict = async (data) => {
    const response = await axios.post(`${url}/predict`, data, { headers });

    let pack = await updatePackById({
        id: data.id,
        data: {
            ai_predict: {
                predict: response.data.predict,
                feedback: -1
            }
        }
    })

    return response
}

const sendFeedback = async (packId, feedback) => {
    const pack = await getPack({ id: packId });

    if (!pack || !pack.notifications || pack.notifications.length === 0) {
        throw new Error("Pack or notifications not found");
    }

    const updatedAiPredict = {
        ...pack.ai_predict,
        feedback: feedback,
    };

    await updatePackById({
        id: packId,
        data: {
            ai_predict: updatedAiPredict
        },
    });

    let type;

    const Alert = false;
    const Incident = true;
    
    if (pack.ai_predict?.predict === Alert) {
        type = feedback === 0 ? "Incident" : "Alert";
    } else if (pack.ai_predict?.predict === Incident) {
        type = feedback === 0 ? "Alert" : "Incident";
    } else {
        throw new Error("Invalid predict value in ai_predict");
    }

    const data = {
        id: pack.id,
        fingerprint: pack.fingerprint,
        text: pack.notifications[0]["text"],
        service: pack.notifications[0]["service"],
        type: type,
        priority: pack.priority,
        status: type === "Alert" ? "Alert" : "Pending",
    };
    
    try {
        const response = await axios.post(`${url}/feedback?feedback=${feedback}`, data, { headers });
        return response.data;
    } catch (error) {
        console.error("Failed to send feedback:", error);
        throw error;
    }
};


export default {
    getPredict,
    sendFeedback
}