import Model from "../Model/Shared/ConfigDB";

const SetConfig: Model = {
    user: "sa",
    password: "CdsSql2019",
    server: "CDS-DEV-03",
    database: "ProjectBase",
    options: {
        encrypt: false,
        trustedconnection: true,
        enableArithAbort: true,
        instancename: "SQL2019",
    },
    port: null
}



export default SetConfig;
