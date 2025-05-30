import Model from "../Model/Shared/ConfigDB";
import SetConfig from "./AppConfig";
import TripleDES from "@/Common/TripleDES";
import ConfigSys from "./ConfigSys";
const tripleDES: TripleDES = new TripleDES();
const ConfigDB: Model = {
    user: ConfigSys.IsEncrypt ? tripleDES.DecryptTripleDES(SetConfig.user) : SetConfig.user,
    password: ConfigSys.IsEncrypt ? tripleDES.DecryptTripleDES(SetConfig.password) : SetConfig.password,
    server: ConfigSys.IsEncrypt ? tripleDES.DecryptTripleDES(SetConfig.server) : SetConfig.server,
    database: ConfigSys.IsEncrypt ? tripleDES.DecryptTripleDES(SetConfig.database) : SetConfig.database,
    options: {
        encrypt: SetConfig.options.encrypt,
        trustedconnection: SetConfig.options.trustedconnection,
        enableArithAbort: SetConfig.options.enableArithAbort,
        instancename: ConfigSys.IsEncrypt ? tripleDES.DecryptTripleDES(SetConfig.options.instancename) : SetConfig.options.instancename,
    },
    port: SetConfig.port
}



export default ConfigDB;
