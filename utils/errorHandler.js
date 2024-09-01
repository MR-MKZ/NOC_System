import { PrismaClientValidationError } from "@prisma/client/runtime/library";

export function handleError(error, res) {
  if (error instanceof PrismaClientValidationError) {
    return res.status(400).json({ error: "structure is invalid" });
  } else {
    console.log(error);
    return res.status(500).json({ error: "Internal server error, please try again later" });
  }
}