import sql from "mssql";
import config from "../Config/ConfigDB";
import configSys from "../Config/ConfigSys";
import JsonReq from "../Model/Shared/JsonReq";
import Result from '../Model/Shared/Result';
import ErrorMessage from "../Model/Shared/ErrorMessage";
import Document from "../Common/Document";
import DisplayName from "@/Model/Shared/DisplayName";
import DisplayNameData from "@/Display/DisplayName.json"
import Utility from "@/Common/Utility";
enum GetType {
  GetAll,
  Find,
  GetCount,
  GetPaged,
  GetByAny
}

class ControllerBase {

  //#region Fields

  protected tableNameFull: string;
  protected tableName: string;
  protected tableNameNormal: string;
  protected language: string = configSys.Language
  protected messageSuccess: string = "Success";
  protected generateDate: string;
  protected generateBy: string;
  protected version: string;
  protected utility: Utility = new Utility();
  //#endregion


  //#region Constructor

  constructor() {

  }

  //#endregion

  //#region Protected

  protected async CreateRequest(tran) {
    let request
    if (tran == null) {
      let pool = await sql.connect(config);
      request = pool.request();
    }
    else {
      request = tran.request();
    }
    return request;
  }

  //#endregion

  //#region Public

  public async GetAll(json: JsonReq): Promise<Result> {
    let result: Result = await this.GetData(json, GetType.GetAll)
    return result;
  }

  public async Find(json: JsonReq): Promise<Result> {
    let result: Result = await this.GetData(json, GetType.Find)
    return result;
  }

  public async GetCount(json: JsonReq): Promise<Result> {
    let result: Result = await this.GetData(json, GetType.GetCount)
    return result;
  }

  public async GetPaged(json: JsonReq): Promise<Result> {
    let result: Result = await this.GetData(json, GetType.GetPaged)
    return result;
  }

  public async GetByAny(json: JsonReq): Promise<Result> {
    let result: Result = await this.GetData(json, GetType.GetByAny)
    return result;
  }

  public Document(): string {
    let documnet: Document = new Document();
    let documentText: string = "";
    documentText += documnet.DocumentStart(this.tableNameNormal)
    documentText += documnet.DocumentHeader(this.tableNameNormal, this.generateBy, this.generateDate, this.version)
    documentText += this.DocumentBody()
    documentText += documnet.DocumentEnd()
    return documentText
  }

  public async GetDisplayName(): Promise<DisplayName[]> {
    const data: any[] = DisplayNameData
    const listDisplayNameAll: DisplayName[] = data
    const result: DisplayName[] = listDisplayNameAll.filter(u => u.TableName === this.tableNameFull);
    return result;
  }

  //#endregion

  //#region  Private

  private async GetData(json: JsonReq, getType: GetType): Promise<Result> {
    let result: Result = new Result
    try {
      let storedName: string = await this.GetStoredName(getType)
      let request = await this.GetRequest(json, getType)
      let data = await request.execute(storedName);
      result.Data = data.recordset
      result.Count = await this.GetCountData(data, getType);
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

  private async GetStoredName(getType: GetType): Promise<string> {
    let storedName: string
    let tableName = this.tableNameFull;
    tableName = tableName.replaceAll("T_M_", "");
    tableName = tableName.replaceAll("T_S_", "");
    tableName = tableName.replaceAll("T_T_", "");
    tableName = tableName.replaceAll("T_R_", "");
    switch (getType) {
      case GetType.GetAll:
        storedName = `USP_${tableName}_GET_ALL`
        break;
      case GetType.Find:
        storedName = `USP_${tableName}_FND`
        break;
      case GetType.GetCount:
        storedName = `USP_${tableName}_CNT`
        break;
      case GetType.GetPaged:
        storedName = `USP_${tableName}_GET_PAGED`
        break;
      case GetType.GetByAny:
        storedName = `USP_${tableName}_GET_BY_ANY`
        break;
      default:
        break;
    }
    return storedName
  }

  private async GetRequest(json: JsonReq, getType: GetType): Promise<any> {
    let request = await this.CreateRequest(json.Tran);
    switch (getType) {
      case GetType.GetAll:
        request.input("ORDER_BY", sql.VarChar, json.OrderBy)
        request.input("TOP", sql.Int, json.Top)
        break;
      case GetType.Find:
        request.input("WHERE_CLAUSE", sql.VarChar, json.WhereClause)
        request.input("ORDER_BY", sql.VarChar, json.OrderBy)
        request.input("TOP", sql.Int, json.Top)
        break;
      case GetType.GetPaged:
        if (!json.PageIndex) {
          json.PageSize = configSys.PageSize
        }
        if (!json.PageIndex) {
          json.PageIndex = 0
        }
        request.input("WHERE_CLAUSE", sql.VarChar, json.WhereClause)
        request.input("ORDER_BY", sql.VarChar, json.OrderBy)
        request.input("PAGE_INDEX", sql.Int, json.PageIndex)
        request.input("PAGE_SIZE", sql.Int, json.PageSize)
        request.output("COUNT_TOTAL", sql.Int, 0)

        break;
      case GetType.GetCount:
        request.input("WHERE_CLAUSE", sql.VarChar, json.WhereClause)
        break;
      case GetType.GetByAny:
        if (!json.PageIndex) {
          json.PageSize = configSys.PageSize
        }
        if (!json.PageIndex) {
          json.PageIndex = 0
        }
        request.input("WHERE_CLAUSE", sql.VarChar, json.WhereClause)
        request.input("ORDER_BY", sql.VarChar, json.OrderBy)
        request.input("PAGE_INDEX", sql.Int, json.PageIndex)
        request.input("PAGE_SIZE", sql.Int, json.PageSize)
        request.input("VALUE_TO_FIND", sql.VarChar, json.ValueToFind)
        request.output("COUNT_TOTAL", sql.Int, 0)
        break;
      default:
        break;
    }
    return request
  }

  private async GetCountData(data: any, getType: GetType): Promise<number> {
    let count: number = 0
    if (getType === GetType.GetPaged || getType === GetType.GetByAny) {
      count = data.output['COUNT_TOTAL'];
    }
    else if (getType === GetType.GetCount) {
      count = data.recordset[0]["COUNT_TOTAL"]
    }
    else {
      count = data.recordset.length
    }
    return count
  }

  //#endregion

  //#region Protected

  protected DocumentBody(): string {
    let documentText: string = "";
    let documnet: Document = new Document();

    let document: string = "";
    let method: string;
    let path: string;
    let jsonBody: string;
    let jsonReturn: string;
    let remark: string;

    // Document GetAll
    method = "post"
    path = `${this.tableNameNormal}/GetAll`
    jsonBody = this.GetJsonBody(GetType.GetAll)
    jsonReturn = documnet.DocumentJsonReturn();
    remark = "";
    documentText += documnet.CreateCardDocument(method, path, jsonBody, jsonReturn, remark)

    // Document Find
    method = "post"
    path = `${this.tableNameNormal}/Find`
    jsonBody = this.GetJsonBody(GetType.Find)
    jsonReturn = documnet.DocumentJsonReturn();
    remark = "";
    documentText += documnet.CreateCardDocument(method, path, jsonBody, jsonReturn, remark)

    // Document GetPaged
    method = "post"
    path = `${this.tableNameNormal}/GetPaged`
    jsonBody = this.GetJsonBody(GetType.GetPaged)
    jsonReturn = documnet.DocumentJsonReturn();
    remark = "";
    documentText += documnet.CreateCardDocument(method, path, jsonBody, jsonReturn, remark)

    // Document GetCount
    method = "post"
    path = `${this.tableNameNormal}/GetCount`
    jsonBody = this.GetJsonBody(GetType.GetCount)
    jsonReturn = documnet.DocumentJsonReturn();
    remark = "";
    documentText += documnet.CreateCardDocument(method, path, jsonBody, jsonReturn, remark)

    // Document GetByAny
    method = "post"
    path = `${this.tableNameNormal}/GetByAny`
    jsonBody = this.GetJsonBody(GetType.GetByAny)
    jsonReturn = documnet.DocumentJsonReturn();
    remark = "";
    documentText += documnet.CreateCardDocument(method, path, jsonBody, jsonReturn, remark)

    return documentText;
  }

  private GetJsonBody(getType: GetType): string {
    let result: string = "";
    let entity: JsonReq = new JsonReq();
    switch (getType) {
      case GetType.GetAll:
        entity.Top = 0;
        entity.OrderBy = "";
        break;
      case GetType.Find:
        entity.WhereClause = "0=0 "
        entity.Top = 0;
        entity.OrderBy = "";
        break;
      case GetType.GetPaged:
        entity.WhereClause = "0=0 "
        entity.Top = 0;
        entity.OrderBy = "";
        entity.PageSize = configSys.PageSize
        entity.PageIndex = 0;
        break;
      case GetType.GetCount:
        entity.WhereClause = "0=0 "
        break;
      case GetType.GetByAny:
        entity.WhereClause = "0=0 "
        entity.Top = 0;
        entity.OrderBy = "";
        entity.PageSize = configSys.PageSize
        entity.ValueToFind = "";
        break;
      default:
        break;
    }

    result = JSON.stringify(entity)
    return result;
  }

  //#endregion

}


export default ControllerBase;
