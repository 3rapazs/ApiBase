
import ControllerBase from "../Controller/ControllerBase"
import Result from '../Model/Shared/Result';
import Schema from "../Model/Shared/Schema";
import ErrorMessage from "../Model/Shared/ErrorMessage";
import ValidateSave from "../Common/ValidateSave";
import JsonReq from "../Model/Shared/JsonReq";
import sql from "mssql";
import Document from "../Common/Document";
import DisplayName from "@/Model/Shared/DisplayName";
import EntityBase from "@/Model/Shared/EntityBase";
import DisplayNameData from "@/Display/DisplayName.json"
class ControllerBaseTable extends ControllerBase {


    //#region Public

    public async ValidateSave(json: any): Promise<ErrorMessage[]> {
        // ValidateSave
        let validateSave: ValidateSave = new ValidateSave();
        let schemaCollection: Schema[] = await this.GetSchema();
        let displayNameCollection: DisplayName[] = await this.GetDisplayName();
        let errorMessage: ErrorMessage[] = await validateSave.ValidateSave(json, schemaCollection, displayNameCollection)
        // ValidateSaveManual
        errorMessage.push(...await this.ValidateSaveManual(json))
        return errorMessage;
    }

    public async Save(json: any): Promise<Result> {
        let result: Result = new Result
        try {
            const entity: EntityBase = json
            if (entity) {
                switch (entity.EntityState.toLocaleLowerCase()) {
                    case "edit":
                        result = await this.Update(json);
                        break;
                    case "add":
                        result = await this.Insert(json);
                        break;

                    default:
                        break;
                }
            }


        } catch (error) {
            result.IsSuccess = false
            result.Message = error.message
            let err: ErrorMessage
            err.MessageDescription = error.message;
            result.ErrorMessages = []
            result.ErrorMessages.push(err);
        }
        return result;
    }



    public async Insert(json: any): Promise<Result> {
        let result: Result = new Result
        try {

            // ValidateSave
            let errorMessage: ErrorMessage[] = await this.ValidateSave(json);
            if (errorMessage.length > 0) {
                result.IsSuccess = false
                result.ErrorMessages = errorMessage;
                result.Message = errorMessage[0].MessageDescription
                return result
            }

            // Check Duplication
            let entityDuplication: Result = await this.GetRecord(json)
            if (entityDuplication.Data.length > 0) {
                result.IsSuccess = false
                let err: ErrorMessage = new ErrorMessage();
                err.MessageDescription = "ข้อมูลซ้ำในระบบ"
                result.ErrorMessages = []
                result.ErrorMessages.push(err);
                result.Message = result.ErrorMessages[0].MessageDescription
                return result
            }


            let storedName: string = `USP_${this.tableName}_INS`;
            let request = await this.GetRequestSave(json, "add");
            let data = await request.execute(storedName);
            result.IsSuccess = true
            result.EntitySave = await this.GetEntitySave(json, data);
            result.Message = this.messageSuccess;
        } catch (error) {
            result.IsSuccess = false
            result.Message = error.message
            let err: ErrorMessage
            err.MessageDescription = error.message;
            result.ErrorMessages = []
            result.ErrorMessages.push(err);
        }
        return result;
    }

    public async Update(json: any): Promise<Result> {
        let result: Result = new Result
        try {
            // ValidateSave
            let errorMessage: ErrorMessage[] = await this.ValidateSave(json);
            if (errorMessage.length > 0) {
                result.IsSuccess = false
                result.ErrorMessages = errorMessage;
                result.Message = errorMessage[0].MessageDescription
                return result
            }

            let storedName: string = `USP_${this.tableName}_UPD`;
            let request = await this.GetRequestSave(json, "edit");
            let data = await request.execute(storedName);
            result.IsSuccess = true
            result.EntitySave = await this.GetEntitySave(json, data);
            result.Message = this.messageSuccess;
        } catch (error) {
            result.IsSuccess = false
            result.Message = error.message
            let err: ErrorMessage
            err.MessageDescription = error.message;
            result.ErrorMessages = []
            result.ErrorMessages.push(err);
        }
        return result;
    }

    public async GetRecord(json: any): Promise<Result> {
        let result: Result = new Result
        try {
            let storedName: string = `USP_${this.tableName}_GET_BY_PK`;
            let request = await this.GetRequestByPrimaryKey(json);
            let data = await request.execute(storedName);
            result.Data = data.recordset
            result.IsSuccess = true
            if (result.Data.length > 0) {
                result.EntitySave = result.Data
            }
            result.Message = this.messageSuccess;
        } catch (error) {
            result.IsSuccess = false
            result.Message = error.message
            let err: ErrorMessage
            err.MessageDescription = error.message;
            result.ErrorMessages = []
            result.ErrorMessages.push(err);
        }
        return result;
    }

    public async Delete(json: any): Promise<Result> {
        let result: Result = new Result
        try {

            //ValidateDelete
            let errorMessage: ErrorMessage[] = await this.ValidateDelete(json)
            if (errorMessage.length > 0) {
                result.IsSuccess = false
                result.ErrorMessages = errorMessage;
                result.Message = errorMessage[0].MessageDescription
                return result
            }

            let storedName: string = `USP_${this.tableName}_DEL`;
            let request = await this.GetRequestByPrimaryKey(json);
            let data = await request.execute(storedName);
            result.Data = data.recordset
            result.IsSuccess = true
            result.Message = this.messageSuccess;
        } catch (error) {
            result.IsSuccess = false
            result.Message = error.message
            let err: ErrorMessage
            err.MessageDescription = error.message;
            result.ErrorMessages = []
            result.ErrorMessages.push(err);
        }
        return result;
    }

    public async DeleteWhere(json: JsonReq): Promise<Result> {
        let result: Result = new Result
        try {
            let storedName: string = `USP_${this.tableName}_DELW`;
            let request = await this.CreateRequest(json.Tran)
            if (!json.WhereClause) {
                json.WhereClause = "0=1";
            }
            request.input("WHERE_CLAUSE", sql.VarChar, json.WhereClause)
            let data = await request.execute(storedName);
            result.Data = data.recordset
            result.IsSuccess = true
            result.Message = this.messageSuccess;
        } catch (error) {
            result.IsSuccess = false
            result.Message = error.message
            let err: ErrorMessage
            err.MessageDescription = error.message;
            result.ErrorMessages = []
            result.ErrorMessages.push(err);
        }
        return result;
    }

    public async GetSchemaCollection(): Promise<Schema[]> {
        let schemaCollection: Schema[] = await this.GetSchema();
        return schemaCollection
    }

    protected DocumentBody(): string {
        let documentText: string = super.DocumentBody();
        let documnet: Document = new Document();

        let document: string = "";
        let method: string;
        let path: string;
        let jsonBody: string;
        let jsonReturn: string;
        let remark: string;

        // Document GetRecord
        method = "post"
        path = `${this.tableNameNormal}/GetRecord`
        jsonBody = this.GetColumnDocumentPrimaryKey()
        jsonReturn = documnet.DocumentJsonReturn();
        remark = "";
        documentText += documnet.CreateCardDocument(method, path, jsonBody, jsonReturn, remark)

        // Document Insert
        method = "post"
        path = `${this.tableNameNormal}/Insert`
        jsonBody = this.GetColumnDocument("add");
        //documentText = this.GetColumnDocumentJson();

        jsonReturn = documnet.DocumentJsonReturn();
        remark = "";
        documentText += documnet.CreateCardDocument(method, path, jsonBody, jsonReturn, remark)

        // Document Update
        method = "put"
        path = `${this.tableNameNormal}/Update`
        jsonBody = this.GetColumnDocument("edit");
        jsonReturn = documnet.DocumentJsonReturn();
        remark = "";
        documentText += documnet.CreateCardDocument(method, path, jsonBody, jsonReturn, remark)

        // Document Delete
        method = "delete"
        path = `${this.tableNameNormal}/Delete`
        jsonBody = this.GetColumnDocumentPrimaryKey()
        jsonReturn = documnet.DocumentJsonReturn();
        remark = "";
        documentText += documnet.CreateCardDocument(method, path, jsonBody, jsonReturn, remark)

        // Document DeleteWhere
        let entity: JsonReq = new JsonReq();
        entity.WhereClause = " 0=1 "
        method = "delete"
        path = `${this.tableNameNormal}/DeleteWhere`
        jsonBody = JSON.stringify(entity)
        jsonReturn = documnet.DocumentJsonReturn();
        remark = "";
        documentText += documnet.CreateCardDocument(method, path, jsonBody, jsonReturn, remark)

        return documentText
    }

    //#endregion

    //#region Protected Override 

    protected async GetSchema(): Promise<Schema[]> {
        return null;
    }

    // protected async GetDisplayName(): Promise<DisplayName[]> {
    //     return null;
    // }

    protected async GetRequestSave(json: any, state: string): Promise<any> {
        return null
    }

    protected async GetRequestByPrimaryKey(json: any): Promise<any> {
        return null
    }

    protected async GetEntitySave(json: any, data: any): Promise<{}> {
        return null
    }

    protected async ValidateSaveManual(json: any): Promise<ErrorMessage[]> {
        return null
    }

    protected async ValidateDelete(json: any): Promise<ErrorMessage[]> {
        return null
    }

    protected GetColumnDocument(state: string): string {
        return null
    }
    protected GetColumnDocumentPrimaryKey(): string {
        return null
    }


    //#endregion

}


export default ControllerBaseTable;
