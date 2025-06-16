import ErrorMessage from "../Model/Shared/ErrorMessage";
import Schema from "../Model/Shared/Schema";
import ConfigSys from "../Config/ConfigSys";
import DisplayName from "@/Model/Shared/DisplayName";
class ValidateSave {

    private _language: string = ConfigSys.Language;

    public async ValidateSave(json: any, schemaList: Schema[], displayNameCollection: DisplayName[]): Promise<ErrorMessage[]> {
        let errorMessage: ErrorMessage[] = []
        let err: ErrorMessage;
        let schema: Schema;
        let value: any;
        let display: string = "";
        let messageDescription = "";
        let displayName: DisplayName
        for (let i = 0; i < schemaList.length; i++) {
            schema = schemaList[i];
            value = json[schema.ModelName]


            displayName = displayNameCollection.find(u => u.ModelName === schema.ModelName);
            display = schema.ModelName;
            if (displayName) {
                switch (this._language) {
                    case "TH":
                        display = displayName.DisplyTh;
                        break;
                    case "EN":
                        display = displayName.DisplyEn;
                        break;
                    case "OT":
                        display = displayName.DisplyOt;
                        break;
                    default:
                        break;
                }
            }



            // Validate AllowDBNull
            if (schema.IsNotNull && !value && !schema.IsIdentity && schema.DataTypeTs === "string") {
                err = new ErrorMessage();
                err.MessageKey = schema.ModelName;
                err.MessageTopic = schema.ModelName;
                switch (this._language) {
                    case "TH":
                        messageDescription = `ข้อมูลนี้ ${display} ไม่สามารถว่างได้`
                        break;
                    case "EN":
                        messageDescription = `ข้อมูลนี้ ${display} ไม่สามารถว่างได้`
                        break;
                    case "OT":
                        messageDescription = `ข้อมูลนี้ ${display} ไม่สามารถว่างได้`
                        break;
                    default:
                        break;
                }
                err.MessageDescription = messageDescription;
                errorMessage.push(err);
            }



            // Validate Max Lenght
            if (schema.DataTypeTs.toUpperCase() === "STRING" && value != null && value.toString().length > schema.CharacterMaximumLength) {
                err = new ErrorMessage();
                err.MessageKey = schema.ModelName;
                err.MessageTopic = schema.ModelName;
                switch (this._language) {
                    case "TH":
                        messageDescription = `ข้อมูล ${display} มีความยาวเกินกำหนด (${schema.CharacterMaximumLength}) (Over)`
                        break;
                    case "EN":
                        messageDescription = `ข้อมูล ${display} มีความยาวเกินกำหนด (${schema.CharacterMaximumLength}) (Over)`
                        break;
                    case "OT":
                        messageDescription = `ข้อมูล ${display} มีความยาวเกินกำหนด (${schema.CharacterMaximumLength}) (Over)`
                        break;
                    default:
                        break;
                }
                err.MessageDescription = messageDescription;
                errorMessage.push(err);
            }

            // Validate NCHAR/CHAR
            if (schema.DataTypeDb.toUpperCase() === "NCHAR" || schema.DataTypeDb.toUpperCase() === "CHAR") {
                if (value != null && value.length != schema.CharacterMaximumLength) {
                    err = new ErrorMessage();
                    err.MessageKey = schema.ModelName;
                    err.MessageTopic = schema.ModelName;
                    switch (this._language) {
                        case "TH":
                            messageDescription = `ข้อมูล ${display} ความยาวของข้อมูลต้องเท่ากับ (${schema.CharacterMaximumLength}) หลัก`
                            break;
                        case "EN":
                            messageDescription = `ข้อมูล ${display} ความยาวของข้อมูลต้องเท่ากับ (${schema.CharacterMaximumLength}) หลัก`
                            break;
                        case "OT":
                            messageDescription = `ข้อมูล ${display} ความยาวของข้อมูลต้องเท่ากับ (${schema.CharacterMaximumLength}) หลัก`
                            break;
                        default:
                            break;
                    }
                    err.MessageDescription = messageDescription;
                    errorMessage.push(err);
                }
            }

            // Validate Date/DateTime
            if (schema.DataTypeDb.toUpperCase() === "DATE" || schema.DataTypeDb.toUpperCase() === "DATETIME") {
                if (value) {
                    let valid = (new Date(value)).getTime() > 0;
                    if (!valid) {
                        err = new ErrorMessage();
                        err.MessageKey = schema.ModelName;
                        err.MessageTopic = schema.ModelName;
                        switch (this._language) {
                            case "TH":
                                messageDescription = `ข้อมูล ${display} รูปแบบวันที่ไม่ถูกต้อง`
                                break;
                            case "EN":
                                messageDescription = `ข้อมูล ${display} รูปแบบวันที่ไม่ถูกต้อง`
                                break;
                            case "OT":
                                messageDescription = `ข้อมูล ${display} รูปแบบวันที่ไม่ถูกต้อง`
                                break;
                            default:
                                break;
                        }
                        err.MessageDescription = messageDescription;
                        errorMessage.push(err);
                    }
                }
                else if (schema.IsNotNull) {
                    err = new ErrorMessage();
                    err.MessageKey = schema.ModelName;
                    err.MessageTopic = schema.ModelName;
                    switch (this._language) {
                        case "TH":
                            messageDescription = `ข้อมูลนี้ ${display} ไม่สามารถว่างได้`
                            break;
                        case "EN":
                            messageDescription = `ข้อมูลนี้ ${display} ไม่สามารถว่างได้`
                            break;
                        case "OT":
                            messageDescription = `ข้อมูลนี้ ${display} ไม่สามารถว่างได้`
                            break;
                        default:
                            break;
                    }
                    err.MessageDescription = messageDescription;
                    errorMessage.push(err);
                }
            }

        }
        return errorMessage
    }



    private async GetModelName(columnName: string): Promise<string> {
        return columnName
            .toLowerCase()
            .replace(/[-_ ]+(\w)/g, (_, c) => c.toUpperCase())
            .replace(/^(\w)/, (_, c) => c.toUpperCase());
    }

}

export default ValidateSave;