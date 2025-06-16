import ErrorMessage from "@/Model/Shared/ErrorMessage";

class Utility {

    public GetDateOnly(date: Date | null): Date {
        const dateText = date?.toString().split("T")[0] || "";
        const result = new Date(dateText);
        return result
    }

    public GetDatetimeZoneTh(date: Date | null): Date {
        const dateText = date?.toLocaleString('th-TH', {
            timeZone: 'Asia/Bangkok',
        })
        const result = new Date(dateText || "");
        return result
    }

    public GetDatetimeTextZoneTh(date: Date | null): string {
        const result = date?.toLocaleString('th-TH', {
            timeZone: 'Asia/Bangkok',
        })
        return result || ""
    }

    public GetValue(e): any {
        let value: any

        // console.log("sss" + e.target.type)


        let type: string = "";

        if (!e.target) {
            type = e.target.type
        }
        else {

        }

        switch (e.target.type) {
            case "checkbox":
                value = e.target.checked;
                break;
            case "Date":
                if (e.value) {
                    value = new Date(e.value.getTime() + 7 * 60 * 60 * 1000);
                }
                break;
            default:
                value = e.target.value;
                break;
        }
        return value;
    }

    public GetErrorMessageByModelName(
        errorMessage: ErrorMessage[],
        modalName: string
    ): string {
        let result: string = "";
        const err = errorMessage.filter((u) => u.MessageKey === modalName);
        if (err.length > 0) {
            console.log(err.length)
            for (let i = 0; i < err.length; i++) {
                result += `*${err[i].MessageDescription}\n`
            }
        }
        return result;
    }

    public GetModelName(columnName: string): string {
        return columnName
            .toLowerCase()
            .replace(/[-_ ]+(\w)/g, (_, c) => c.toUpperCase())
            .replace(/^(\w)/, (_, c) => c.toUpperCase());
    }

    public GetCurrentDate(): Date {
        const now = new Date();
        const result: Date = new Date(now.getTime() + 7 * 60 * 60 * 1000);
        return result;
    }

    public GetDate(valueDate: Date): Date {
        const now = new Date();
        const result: Date = new Date(now.getTime() + 7 * 60 * 60 * 1000);
        return result;
    }


    public GetDateText(dateValue: any): string {
        const date : Date = new Date(dateValue)
        let result: string = "";
        if (date) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มที่ 0
            const year = date.getFullYear();
            const hours = String(date.getHours()-7).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            result = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        }
        return result;
    }



}


export default Utility;
