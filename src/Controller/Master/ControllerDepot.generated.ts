
import ControllerBase from "../ControllerBaseTable"
import JsonReq from "../../Model/Shared/JsonReq";
import sql from "mssql";
import Model from "../../Model/Master/DepotModel"
import Schema from "../../Model/Shared/Schema";
import SchemaData from "../../Schema/Master/Depot.json"
import Document from "../../Common/Document";
import fs from 'fs';
class ControllerDepotGenerated extends ControllerBase {
    constructor() {
        super();
        this.tableNameFull = "T_M_DEPOT";
        this.tableName = "DEPOT";
        this.tableNameNormal = "Depot";
        this.generateDate = "24/05/2024 ";
        this.generateBy = "Threerapat"
        this.version = "Beta";
    }


    protected async GetRequestSave(json: any, state: string): Promise<any> {
        let entity: Model = json
        let request = await this.CreateRequest(entity.Tran);
        if (state === "edit") {
            request.input("ORIGINAL_DEPOT_CODE", sql.VarChar, entity.OriginalDepotCode)
        }
        request.input("CREATE_DATE", sql.DateTime, entity.CreateDate)
        request.input("CREATE_USER", sql.VarChar, entity.CreateUser)
        request.input("DEPOT_CODE", sql.VarChar, entity.DepotCode)
        request.input("DEPOT_COLOR_CODE", sql.VarChar, entity.DepotColorCode)
        request.input("DEPOT_COLOR_NAME", sql.VarChar, entity.DepotColorName)
        request.input("DEPOT_NAME", sql.VarChar, entity.DepotName)
        request.input("NOTE1", sql.VarChar, entity.Note1)
        request.input("PROVINCE_CODE", sql.VarChar, entity.ProvinceCode)
        request.input("REGION_CODE", sql.VarChar, entity.RegionCode)
        request.input("UPDATE_DATE", sql.DateTime, entity.UpdateDate)
        request.input("UPDATE_USER", sql.VarChar, entity.UpdateUser)
        return request
    }

    protected async GetRequestByPrimaryKey(json: any): Promise<any> {
        let entity: Model = json
        let request = await this.CreateRequest(entity.Tran);
        request.input("DEPOT_CODE", sql.VarChar, entity.DepotCode)
        return request
    }

    protected async GetEntitySave(json: any, data: any): Promise<{}> {
        return json
    }

    protected async GetSchema(): Promise<Schema[]> {
        let data: any[] = SchemaData
        let listSchema: Schema[] = data
        return listSchema;
    }

    protected DocumentBody(): string {
        let documentText: string = super.DocumentBody();
        return documentText
    }

    protected GetColumnDocument(state: string): string {
        let columnDocument: string
        let entity: Model = new Model();
        const user: string = "admin";
        const currentDate: Date = new Date();
        const valueTemp = "T";

        entity.DepotCode = valueTemp
        entity.DepotColorCode = valueTemp
        entity.DepotColorName = valueTemp
        entity.DepotName = valueTemp
        entity.Note1 = valueTemp
        entity.ProvinceCode = valueTemp
        entity.RegionCode = valueTemp
        entity.UpdateDate = currentDate
        entity.UpdateUser = user
        entity.CreateDate = currentDate
        entity.CreateUser = user
        if (state === "edit") {
            entity.OriginalDepotCode = valueTemp
        }
        columnDocument = JSON.stringify(entity)
        return columnDocument;
    }

    protected GetColumnDocumentPrimaryKey(): string {
        let columnDocument: string
        let entity: Model = new Model();
        // PK
        entity.DepotCode = "TEST";
        //
        columnDocument = JSON.stringify(entity)
        return columnDocument
    }

}


export default ControllerDepotGenerated;
