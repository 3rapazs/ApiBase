//#region คำสั่ง Cmd
//Run
//bun --watch src/server.ts
//Build
//bun run build
//#endregion

//#region Import
import express from "express";
import bodyParser from "body-parser";
import { Request, Response } from "express";
import cors from "cors";
import ConfigSys from "../src/Config/ConfigSys"
//#endregion Import

//#region Set App
const app = express();
const port: number = ConfigSys.Port;
const pathApi = ConfigSys.PathApi;
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

//#endregion Set App

//#region Main Routes
import routesMain from "../src/Routes/RoutesMain"
app.use(`${pathApi}/`, routesMain);
//#endregion Main Routes

//#region Master Routes


//[Add By Threerapat On Version 0111 [30/05/2025 15:28:57] ]
import routesArea from "@/Routes/Master/RoutesArea"
app.use(`${pathApi}/Area`, routesArea);


//#endregion Master Routes

//#region Security Routes

import routesUser from "../src/Routes/Security/RoutesUser"
app.use(`${pathApi}/User`, routesUser);

//#endregion Security Routes

//#region Transaction Routes
//#endregion Transaction Routes

//#region View Routes

//#region Master Routes

import routesVArea from "./Routes/View/Master/RoutesVArea"
app.use(`${pathApi}/VArea`, routesVArea);

//#endregion Master Routes

//#region Security Routes
//#endregion Security Routes

//#region Report Routes
//#endregion Report Routes

//#region Transaction Routes
//#endregion Transaction Routes

//#endregion View Routes

//#region app.listen

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

//#endregion app.listen