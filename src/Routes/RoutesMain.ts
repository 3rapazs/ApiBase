//#region Import

import express from "express";
import { Request, Response } from "express";
import ConfigSys from "@/Config/ConfigSys";
import TripleDES from "@/Common/TripleDES"
//#endregion Import

//#region Fields

const router = express.Router();


//#endregion Fields


//#region Start Url
router.get("/", (req: Request, res: Response) => {
  const message: string = `Welcome ${ConfigSys.AppName}`
  const result: string = `
    <div style="white-space: pre-line">${message}</div>
  `
  res.send(result);
});
//#endregion ReleaseNote

//#region ReleaseNote
router.get("/ReleaseNote", (req: Request, res: Response) => {
  const key = req.query.key;
  if (key === ConfigSys.DocumentKey) {
    const releaseNote: string = `=================== Version ===================
    Version: [${ConfigSys.Version}] 
    Build Date: [${ConfigSys.BuildDate}]
    Version Description: [${ConfigSys.VersionDescription}]
    =================== ReleaseNote ===================
    ${ConfigSys.ReleaseNote}
  `
    const result: string = `
    <div style = "white-space: pre-line"> ${releaseNote} </div>
      `
    res.send(result);
  }
  else {
    res.send("Not Access");
  }
});
//#endregion ReleaseNote

//#region Encrypt
router.post("/Encrypt", async (req: Request, res: Response): Promise<void> => {
  let result: string
  const message = req.body.Message
  const secret = req.body.Secret
  console.log(secret)
  if (secret === ConfigSys.Secret) {
    const tripleDES: TripleDES = new TripleDES()
    result = tripleDES.EncryptTripleDES(message);
  }
  else {
    result = "Secret Incoret"
  }

  res.send(result);
});
//#endregion Encrypt


//#region Decrypt
router.post("/Decrypt", async (req: Request, res: Response): Promise<void> => {
  let result: string
  const message = req.body.Message
  const secret = req.body.Secret
  console.log(secret)
  if (secret === ConfigSys.Secret) {
    const tripleDES: TripleDES = new TripleDES()
    result = tripleDES.DecryptTripleDES(message);
  }
  else {
    result = "Secret Incoret"
  }

  res.send(result);
});
//#endregion Decrypt




//#region Export Default
export default router;
//#endregion Export Default