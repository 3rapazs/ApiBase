//Run
//bun --watch src/server.ts
//Build
//bun run build

//#region Import
import express from "express";
import bodyParser from "body-parser";
import { Request, Response } from "express";
import cors from "cors";
import ConfigSys from "../src/Config/ConfigSys"
//#endregion Import

//#region Set App
const app = express();
const port: number = 9001;
const pathApi = ConfigSys.PathApi;
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

//#endregion Set App

import routesDepot from "../src/Routes/Master/RoutesDepot"
app.use(`${pathApi}/Depot`, routesDepot);

import routesUser from "../src/Routes/Security/RoutesUser"
app.use(`${pathApi}/User`, routesUser);

import routesImexporter from "../src/Routes/Master/RoutesImexporter"
app.use(`${pathApi}/Imexporter`, routesImexporter);

import routesVArea from "./Routes/View/Master/RoutesVArea"
app.use(`${pathApi}/VArea`, routesVArea);

import routesArea from "./Routes/Master/RoutesArea"
app.use(`${pathApi}/Area`, routesArea);

app.get("/", async (req: Request, res: Response) => {
  res.send("Welcome");
});

app.get("/test", async (req: Request, res: Response) => {
  res.send("cds");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
