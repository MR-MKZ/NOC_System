import { processAlerts } from "../services/alertService.js";
import { messages } from "../config/messages.js";

const webhookController = async (req, res) => {
  if (!req.user.isService) {
    return res.status(messages.UNAUTHORIZED.code).json({ error: messages.UNAUTHORIZED.message });
  }

  try {        
    await processAlerts(req.body.alerts, req.body.status, req.body.orgId, req.headers.test);
    
    return res.status(200).json({ message: "Webhook received" });
  } catch (error) {
    if (error instanceof PrismaClientValidationError) {
      return res.status(400).json({ error: "structure is invalid" });
    } else {
      console.log(error);
      return res.status(500).json({ error: "Internal server error, please try again later" });
    }
  }
}

export default webhookController;