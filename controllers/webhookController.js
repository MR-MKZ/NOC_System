import { processAlerts } from "../services/alertService.js";
import { callAiWebhook } from "../interfaces/aiWebhook.js";
import { handleError } from "../utils/errorHandler.js";
import { messages } from "../config/messages.js";

const webhookController = async (req, res) => {
  if (!req.user.isService) {
    return res.status(messages.UNAUTHORIZED.code).json({ error: messages.UNAUTHORIZED.message });
  }

  try {        
    const aiWebhookData = await processAlerts(req.body.alerts, req.body.status, req.body.orgId, req.headers.test);
    for (const alert of aiWebhookData) {
        await callAiWebhook(alert);
    }
    
    return res.status(200).json({ message: "Webhook received" });
  } catch (error) {
    console.log(error);
    handleError(error, res);
  }
}

export default webhookController;