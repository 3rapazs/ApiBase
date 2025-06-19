import jwt from 'jsonwebtoken';
import ControllerBase from "../Security/ControllerUser.generated"
import ErrorMessage from "../../Model/Shared/ErrorMessage";
import Model from "../../Model/Security/UserModel"
import Document from "../../Common/Document";
import UserModel from "../../Model/Security/UserModel";
import JsonReq from "../../Model/Shared/JsonReq";
import ConfigSys from '../../Config/ConfigSys';
import TripleDES from '../../Common/TripleDES'
import Result from '@/Model/Shared/Result';
class ControllerUser extends ControllerBase {

    protected async ValidateSaveManual(json: any): Promise<ErrorMessage[]> {
        let entity: Model = json
        let errorMessage: ErrorMessage[] = []

        // let err: ErrorMessage = new ErrorMessage();
        // err.MessageKey = "test";
        // err.MessageTopic = "test";
        // err.MessageDescription = "ห้ามแก้"
        // errorMessage.push(err);

        return errorMessage
    }


    protected async ValidateDelete(json: any): Promise<ErrorMessage[]> {
        let entity: Model = json
        let errorMessage: ErrorMessage[] = []

        // let err: ErrorMessage;
        // err = new ErrorMessage();
        // err.MessageDescription = "ห้ามลบ"
        // errorMessage.push(err);

        return errorMessage
    }

    protected DocumentBody(): string {
        let documnet: Document = new Document();
        let documentText: string = super.DocumentBody();

        let document: string = "";
        let method: string;
        let path: string;
        let jsonBody: string;
        let jsonReturn: string;
        let remark: string;
        let jsonReq = {}
        let jsonRes = {}

        // Login
        method = "post"
        path = `${this.tableNameNormal}/Login`
        jsonReq = {
            UserId: "UserId",
            Password: "Password",
        }
        jsonBody = JSON.stringify(jsonReq)
        jsonRes = {
            token: ""
        }
        jsonReturn = JSON.stringify(jsonRes)
        remark = "";
        documentText += documnet.CreateCardDocument(method, path, jsonBody, jsonReturn, remark)

        return documentText
    }


    public async Login(json: UserModel): Promise<Result> {
        const result: Result = new Result();
        const tripleDES = new TripleDES();
        const user: string = json.UserId;
        const passwordEncrypted: string = tripleDES.EncryptTripleDES(json.Password);
        const entity = await this.GetRecordByUserPassword(user, passwordEncrypted);
        let secret: string = ConfigSys.Secret;
        let expiresIn: string = ConfigSys.ExpiresIn;
        let token: string = "";
        if (entity) {
            const user = {
                userId: entity.UserId,
                RoleId: entity.RoleId
            }
            try {
                token = await jwt.sign(user, secret, { expiresIn: expiresIn })
                result.IsSuccess = true;
                result.Data = [];
                const data: any = { "Token": token, "RoleId": entity.RoleId }
                result.Data = data

            } catch (error) {

            }
        }
        else {
            result.IsSuccess = false;
            result.Message = "ไม่พบข้อมูลผู้ใช้ระบบ"
        }
        return result
    }

    private async GetRecordByUserPassword(user: string, password: string): Promise<UserModel> {
        const whereClause: string = `USER_ID = '${user}' AND PASSWORD = '${password}'`
        const jsonReq: JsonReq = new JsonReq();
        jsonReq.WhereClause = whereClause;
        jsonReq.Top = 1;
        const res = await this.Find(jsonReq)
        let entity: UserModel
        if (res.Data.length > 0) {
            const list: UserModel[] = res.Data;
            entity = list[0]
        }
        return entity;
    }

}


export default ControllerUser;
