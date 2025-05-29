
import ControllerBase from "../ControllerBaseTable"
import JsonReq from "../../Model/Shared/JsonReq";
import sql from "mssql";
import Model from "../../Model/Security/UserModel"
import Schema from "../../Model/Shared/Schema";
// import SchemaData from "../../Schema/Master/Depot.json"
import Document from "../../Common/Document";
import { readFileSync } from 'fs';
class ControllerUserGenerated extends ControllerBase {
    constructor() {
        super();
        this.tableNameFull = "T_M_USER";
        this.tableName = "USER";
        this.tableNameNormal = "User";
        this.generateDate = "24/05/2024 ";
        this.generateBy = "Threerapat"
        this.version = "Beta";
    }


    protected async GetRequestSave(json: any, state: string): Promise<any> {
        let entity: Model = json
        let request = await this.CreateRequest(entity.Tran);
        // if (state === "edit") {
        //     request.input("ORIGINAL_DEPOT_CODE", sql.VarChar, entity.OriginalDepotCode)
        // }
        // request.input("CREATE_DATE", sql.DateTime, entity.CreateDate)
        // request.input("CREATE_USER", sql.VarChar, entity.CreateUser)
        // request.input("DEPOT_CODE", sql.VarChar, entity.DepotCode)
        // request.input("DEPOT_COLOR_CODE", sql.VarChar, entity.DepotColorCode)
        // request.input("DEPOT_COLOR_NAME", sql.VarChar, entity.DepotColorName)
        // request.input("DEPOT_NAME", sql.VarChar, entity.DepotName)
        // request.input("NOTE1", sql.VarChar, entity.Note1)
        // request.input("PROVINCE_CODE", sql.VarChar, entity.ProvinceCode)
        // request.input("REGION_CODE", sql.VarChar, entity.RegionCode)
        // request.input("UPDATE_DATE", sql.DateTime, entity.UpdateDate)
        // request.input("UPDATE_USER", sql.VarChar, entity.UpdateUser)
        return request
    }

    protected async GetRequestByPrimaryKey(json: any): Promise<any> {
        let entity: Model = json
        let request = await this.CreateRequest(entity.Tran);
        request.input("DEPOT_CODE", sql.VarChar, entity.UserId)
        return request
    }

    protected async GetEntitySave(json: any, data: any): Promise<{}> {
        return json
    }

    protected async GetSchema(): Promise<Schema[]> {
        const raw = readFileSync("../../../../Schema/Master/Depot.json", 'utf-8');
        const data = JSON.parse(raw);
        return data;
    }

    protected DocumentBody(): string {
        let documentText: string = super.DocumentBody();
        return documentText
    }

    protected GetColumnDocument(state: string): string {
        let columnDocument: string
        let entity: Model = new Model();

        // entity.CreateDate = new Date();
        // entity.CreateUser = "TEST"
        // entity.DepotCode = "TEST"
        // entity.DepotColorCode = "TEST"
        // entity.DepotColorName = "TEST"
        // entity.DepotName = "TEST"
        // entity.Note1 = "TEST"
        // entity.ProvinceCode = "TEST"
        // entity.RegionCode = "TEST"
        // entity.UpdateDate = new Date();
        // entity.UpdateUser = "TEST"
        // if (state === "edit") {
        //     entity.OriginalDepotCode = "TEST"
        // }
        columnDocument = JSON.stringify(entity)
        return columnDocument;
    }

    protected GetColumnDocumentPrimaryKey(): string {
        let columnDocument: string
        let entity: Model = new Model();
        // PK
        // entity.DepotCode = "TEST";
        //
        columnDocument = JSON.stringify(entity)
        return columnDocument
    }

}


export default ControllerUserGenerated;
