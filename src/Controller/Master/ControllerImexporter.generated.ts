
import ControllerBase from "../ControllerBaseTable"
import sql from "mssql";
import Model from "../../Model/Master/ImexporterModel"
import Schema from "../../Model/Shared/Schema";
import SchemaData from "../../Schema/Master/Depot.json"

class ControllerImexporterGenerated extends ControllerBase {
    constructor() {
        super();
        this.tableNameFull = "T_M_IMEXPORTER";
        this.tableName = "IMEXPORTER";
        this.tableNameNormal = "Imexporter";
        this.generateDate = "24/05/2024 ";
        this.generateBy = "Threerapat"
        this.version = "Beta";
    }


    protected async GetRequestSave(json: any, state: string): Promise<any> {
        let entity: Model = json
        let request = await this.CreateRequest(entity.Tran);
        if (state === "edit") {
            request.input("IMEXPORTER_ID", sql.Int, entity.ImexporterId)
        } else {
            request.output("IMEXPORTER_ID", sql.Int)
        }
        request.input("CMP_BRN_NO", sql.Numeric(4, 0), entity.CmpBrnNo)
        request.input("CMP_NAME_ENG", sql.VarChar, entity.CmpNameEng)
        request.input("CMP_NAME_THAI", sql.VarChar, entity.CmpNameThai)
        request.input("CMP_TAX_NO", sql.VarChar, entity.CmpTaxNo)
        request.input("CREATE_DATE", sql.DateTime, entity.CreateDate)
        request.input("CREATE_USER", sql.VarChar, entity.CreateUser)
        request.input("DISTRICT_NAME", sql.VarChar, entity.DistrictName)
        request.input("EMAIL_ADDRESS", sql.VarChar, entity.EmailAddress)
        request.input("FAX", sql.VarChar, entity.Fax)
        request.input("IS_EXPORTER", sql.Bit, entity.IsExporter)
        request.input("IS_IMPORTER", sql.Bit, entity.IsImporter)
        request.input("NOTE", sql.VarChar, entity.Note)
        request.input("POST_CODE", sql.VarChar, entity.PostCode)
        request.input("PROVINCE_NAME", sql.VarChar, entity.ProvinceName)
        request.input("STREET_AND_NO", sql.VarChar, entity.StreetAndNo)
        request.input("SUB_PROVINCE_NAME", sql.VarChar, entity.SubProvinceName)
        request.input("TELEPHONE", sql.VarChar, entity.Telephone)
        request.input("UPDATE_DATE", sql.DateTime, entity.UpdateDate)
        request.input("UPDATE_USER", sql.VarChar, entity.UpdateUser)

        return request
    }

    protected async GetRequestByPrimaryKey(json: any): Promise<any> {
        let entity: Model = json
        let request = await this.CreateRequest(entity.Tran);
        request.input("IMEXPORTER_ID", sql.Int, entity.ImexporterId)
        return request
    }

    protected async GetEntitySave(json: any, data: any): Promise<{}> {
        let entity: Model = json
        let identityName: string = "IMEXPORTER_ID"
        entity.ImexporterId = data.output[identityName]
        return entity
    }

    protected async GetSchema(): Promise<Schema[]> {
        try {
            let data: any[] = SchemaData
            let listSchema: Schema[] = data
            return listSchema;
        } catch (error) {
            console.log(error)
        }
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
        entity.CmpBrnNo = 0
        entity.CmpNameEng = valueTemp
        entity.CmpNameThai = valueTemp
        entity.CmpTaxNo = valueTemp
        entity.CreateDate = currentDate
        entity.CreateUser = user
        entity.DistrictName = valueTemp
        entity.EmailAddress = valueTemp
        entity.Fax = valueTemp
        entity.ImexporterId = 0
        entity.IsExporter = false
        entity.IsImporter = false
        entity.Note = valueTemp
        entity.PostCode = valueTemp
        entity.ProvinceName = valueTemp
        entity.StreetAndNo = valueTemp
        entity.SubProvinceName = valueTemp
        entity.Telephone = valueTemp
        entity.UpdateDate = currentDate
        entity.UpdateUser = user
        columnDocument = JSON.stringify(entity)
        return columnDocument;
    }

    protected GetColumnDocumentPrimaryKey(): string {
        let columnDocument: string
        let entity: Model = new Model();
        // PK
        entity.ImexporterId = 0;
        //
        columnDocument = JSON.stringify(entity)
        return columnDocument
    }

}


export default ControllerImexporterGenerated;
