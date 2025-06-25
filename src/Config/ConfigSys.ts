import Model from "../Model/Shared/ConfigSys";

const ConfigSys: Model = new Model();

//System
ConfigSys.Language = "TH"; //["TH","EN","OT"]
ConfigSys.PageSize = 10;
ConfigSys.PathApi = ""; // ต้องมี /ด้วย [/V1]
ConfigSys.Secret = "3rapazsSecret";
ConfigSys.ExpiresIn = '1d'//"1000d";
ConfigSys.DocumentKey = "Cds123"; // Key สำหรับอ่าน Document ???/document?key={DocumentKey}
ConfigSys.Port = 9001; // Port Deploy
ConfigSys.AppName = "Api Express";
ConfigSys.IsEncrypt = false; // เข้ารหัส SQL 

//Version
ConfigSys.Version = "Beta";
ConfigSys.BuildDate = "";
ConfigSys.VersionDescription = "";

//ReleaseNote
ConfigSys.ReleaseNote = `









`;

export default ConfigSys;
