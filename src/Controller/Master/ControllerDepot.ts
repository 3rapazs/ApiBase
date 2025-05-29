
import ControllerBase from "../Master/ControllerDepot.generated"
import ErrorMessage from "../../Model/Shared/ErrorMessage";
import Model from "../../Model/Master/DepotModel"
import Document from "../../Common/Document";
class ControllerDepot extends ControllerBase {

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

    protected GetColumnDocument(state: string): string {
        let columnDocument: string = super.GetColumnDocument(state)
        let entity: Model = JSON.parse(columnDocument);
        columnDocument = JSON.stringify(entity)
        return columnDocument;
    }

    protected GetColumnDocumentPrimaryKey(): string {
        let columnDocument: string = super.GetColumnDocumentPrimaryKey()
        let entity: Model = JSON.parse(columnDocument);
        columnDocument = JSON.stringify(entity)
        return columnDocument
    }

    protected DocumentBody(): string {
        let documnet: Document = new Document();
        let documentText: string = super.DocumentBody();

        let document: string = "";
        let method: string;
        let path: string;
        let jsonBody: string[];
        let jsonReturn: string;
        let remark: string;

        // Document 
        // method = "post"
        // path = `${this.tableNameNormal}/`
        // jsonBody = []
        // jsonReturn = documnet.DocumentJsonReturn();
        // remark = "";
        // documentText += documnet.CreateCardDocument(method, path, jsonBody, jsonReturn, remark)

        return documentText
    }





}


export default ControllerDepot;
