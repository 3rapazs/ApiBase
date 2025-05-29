import ErrorMessage from "../Model/Shared/ErrorMessage";
import Schema from "../Model/Shared/Schema";
import ConfigSys from "../Config/ConfigSys";
class ValidateSave {

    private _language: string = ConfigSys.Language;

    public async ValidateSave(json: any, schemaList: Schema[]): Promise<ErrorMessage[]> {
        let errorMessage: ErrorMessage[] = []
        let err: ErrorMessage;
        let schema: Schema;
        let value: any;
        let display: string = "";
        let messageDescription = "";

        for (let i = 0; i < schemaList.length; i++) {
            schema = schemaList[i];
            schema.ModelName = await this.GetModelName(schema.ColumnName)
            value = json[schema.ModelName]

            // console.log(schema.ModelName + '-' + value)
            // console.log(schema.IsNotNull)
            // console.log(!value)
            // console.log(value)

            if (value === undefined) {
                value = "";
            }

            // switch (this._language) {
            //     case "TH":
            //         display = schema.DisplayTh;
            //         break;
            //     case "EN":
            //         display = schema.DisplayEn;
            //         break;
            //     case "OT":
            //         display = schema.DisplayOther;
            //         break;
            //     default:
            //         break;
            // }
            display = schema.ModelName;

            // Validate AllowDBNull
            if (schema.IsNotNull && !value && !schema.IsIdentity && schema.DataTypeTs === "string") {
                err = new ErrorMessage();
                err.MessageKey = schema.ColumnName;
                err.MessageTopic = schema.ColumnName;
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
                err.MessageKey = schema.ColumnName;
                err.MessageTopic = schema.ColumnName;
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
                    err.MessageKey = schema.ColumnName;
                    err.MessageTopic = schema.ColumnName;
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
                if (value != null) {
                    let valid = (new Date(value)).getTime() > 0;
                    if (!valid) {
                        err = new ErrorMessage();
                        err.MessageKey = schema.ColumnName;
                        err.MessageTopic = schema.ColumnName;
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