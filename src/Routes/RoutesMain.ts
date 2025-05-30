//#region Import

import express from "express";
import { Request, Response } from "express";
import ConfigSys from "@/Config/ConfigSys";

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









//#region Export Default
export default router;
//#endregion Export Default