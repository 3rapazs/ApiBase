import Model from "../Model/Shared/ConfigDB";
import SetConfig from "./AppConfig";

const ConfigDB: Model = {
    user: SetConfig.user,
    password: SetConfig.password,
    server: SetConfig.server,
    database: SetConfig.database,
    options: {
        encrypt: SetConfig.options.encrypt,
        trustedconnection: SetConfig.options.trustedconnection,
        enableArithAbort: SetConfig.options.enableArithAbort,
        instancename: SetConfig.options.instancename,
    },
    port: SetConfig.port
}



export default ConfigDB;
