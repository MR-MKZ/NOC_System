import { getPack, createPack, closePack } from "../models/packModel.js";

export async function handlePack(fingerprint, status, isTest) {
  if (isTest) return null;

  let pack = await getPack({ fingerprint });
  
  if (status === "firing" && !pack) {
    pack = await createPack({ fingerprint });
  } else if (status === "resolved" && pack) {
    await closePack({ id: pack.id });
  }
  
  return pack;
}
