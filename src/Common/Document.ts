import Result from "../Model/Shared/Result"
class Document {

    public DocumentStart(tableNameNormal: string): string {
        let document =
            `
        <head>
        <title>Api Document  [${tableNameNormal}]</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        </head>
        <body class="container">
        <div class="mx-auto">
        <br>
        `

        return document
    }

    public DocumentHeader(tableNameNormal: string, generateBy: string, generateDate: string, version: string): string {
        let document =
            `
       <div class="card">
    <div class="card-header">
      <h2>Api Document [${tableNameNormal}] </h2>
    </div>
    <div class="card-body">
      <p class="card-text">
Generate Date : ${generateDate}<br>
Generate By : ${generateBy}<br>
Version : ${version}<br>
      </p>
    </div>
  </div>
  <br>
        `

        return document
    }

    public DocumentEnd(): string {
        let document =
            `
        </div>
        </body>
        </html>
        `

        return document
    }


    public CreateCardDocument(method: string, path: string, jsonBody: string, jsonReturn: string, remark: string) {

        let jsonBodyText: string = jsonBody.toString();
        jsonBodyText = jsonBodyText.replaceAll("{", "")
        jsonBodyText = jsonBodyText.replaceAll("}", "")
        jsonBodyText = jsonBodyText.replaceAll(",", ",<br>")
        jsonBodyText += "<br>"
        // jsonBody = jsonBody.replaceAll("{", "")
        // console.log(typeof jsonBody)
        // if (typeof jsonBody === "object") {
        //     console.log(jsonBody);
        // }

        // jsonBodyText = jsonBodyText.replaceAll("}", "")
        // jsonBodyText = jsonBodyText.replaceAll(",", ",<br>")
        // jsonBodyText += "<br>"
        // for (let i = 0; i < jsonBody.length; i++) {
        //     if (jsonBodyText) {
        //         jsonBodyText += ",<br>"
        //     }
        //     jsonBodyText += `"${jsonBody[i]}" : ""`
        // }
        // jsonBodyText += "<br>"

        switch (method.toUpperCase()) {
            case "GET": {
                method = `<button class="btn btn-primary" style="width: 100px;">${method}</button>`
                break;
            }
            case "POST": {
                method = `<button class="btn btn-success" style="width: 100px;">${method}</button>`
                break;
            }
            case "PUT": {
                method = `<button class="btn btn-warning" style="width: 100px;">${method}</button>`
                break;
            }
            case "DELETE": {
                method = `<button class="btn btn-danger" style="width: 100px;">${method}</button>`
                break;
            }
            default: {
                //statements; 
                break;
            }
        }

        let document = `
         <div class="card">
        <div class="card-header">
          <h2>${method} Path [../${path}] </h2>
        </div>
        <div class="card-body">
          <p class="card-text">
           <b>Json Body =</b> <br>
           {<br>
           ${jsonBodyText}
           }
           <hr>
           <b>Json Return = </b><br>
           
           ${jsonReturn}
           
           <hr>
           <b>Remark : </b>
           ${remark}
          </p>
        </div>
      </div>
      <br>
        `
        return document;
    }


    public DocumentJsonReturn(): string {
        let result: Result = new Result();
        result.Message = ""
        result.IsSuccess = false
        result.ErrorMessages = []
        result.Count = 0
        result.Data = []
        result.EntitySave = {}
        let document = JSON.stringify(result);
        let documentArr = document.split(",")
        document = "";
        for (let i = 0; i < documentArr.length; i++) {
            if (document) {
                document += ",<br>"
            }
            document += `${documentArr[i]}`

        }
        document = document.replace(`{"`, `{<br>"`)
        document = document.replace(`0}`, `0<br>}`)
        return document
    }


}

export default Document;