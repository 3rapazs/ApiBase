﻿
///***********************************************************************************
///Copyright by [CDSCOM]
///On Version Template [1.0.1]
///On Version Program [0111]
///Generated by: Threerapat
///Generated on: 27/06/2025 14:51:43
///***********************************************************************************

import ControllerBase from "./ControllerBank.Generated"
import ErrorMessage from "@/Model/Shared/ErrorMessage";
import Model from "@/Model/Master/BankModel"
import Document from "@/Common/Document";

import Schema from "@/Model/Shared/Schema";
import SchemaData from "@/Schema/Master/Bank.json"

class ControllerBank extends ControllerBase {
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
export default ControllerBank;
