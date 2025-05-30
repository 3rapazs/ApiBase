import Model from "../Model/Shared/ConfigDB";
import ConfigSys from "./ConfigSys";
const SetConfig: Model = {
    user: ConfigSys.IsEncrypt ? "OvTXFp1AY64=" : "sa",
    password: ConfigSys.IsEncrypt ? "Pk9RrNcHzXU8tsl1S2AtaA==" : "CdsSql2019",
    server: ConfigSys.IsEncrypt ? "3FKrLMqA1Zf2sMZ2Ve+Gbg==" : "CDS-DEV-03",
    database: ConfigSys.IsEncrypt ? "KX/BngLnufHF/iXmbvjcuA==" : "ProjectBase",
    options: {
        encrypt: false,
        trustedconnection: true,
        enableArithAbort: true,
        instancename: ConfigSys.IsEncrypt ? "5ebTN+oEzlY=" : "SQL2019",
    },
    port: 1433
}



export default SetConfig;
