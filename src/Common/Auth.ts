
import e, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import sql from "mssql";
import config from "../Config/ConfigDB";
import UserLogin from "../Model/Shared/UserLogin"
import ConfigSys from '../Config/ConfigSys';

class AuthenticateJWT {

    private SECRET_KEY: string = ConfigSys.Secret


    public authenticate(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[0];

        if (!token) {
            res.status(403)
            res.send("Token Is Not Null");
        }
        try {
            const res = jwt.verify(token, ConfigSys.Secret);
            next();
        } catch (error) {
            res.status(403)
            res.send(error.message);
        }

    }


    public authenticateJWT(programCode: string, action: string) {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            try {

                const authHeader = req.headers.authorization;
                const token = authHeader?.split(' ')[0];

                if (!token) {
                    res.status(403)
                    res.send("Token Is Not Null");
                }

                const user: UserLogin = jwt.verify(token, this.SECRET_KEY);
                (req as any).user = user;
                let roleId: number = user.RoleId;
                let isUse: boolean = await this.IsUse(roleId, programCode, action)
                if (isUse) {
                    next();
                }
                else {
                    res.status(403)
                    res.send("Not Permit Use");
                }
            } catch (error) {
                res.status(403)
                res.send(error.message);
            }
        }

    }



    private async IsUse(roleId: number, programCode: string, action: string): Promise<boolean> {
        let count: number = 0;
        let result: boolean = false;
        let pool = await sql.connect(config);
        let request = pool.request();
        let query = `SELECT COUNT(*) AS COUNT_ROW FROM T_S_ROLE_DTL
        WHERE ROLE_ID = '${roleId}' AND [PROGRAM_CODE] = '${programCode}' AND ACTION_CODE = '${action}' `
        let data
        try {
            const pool = new sql.ConnectionPool(config).connect();
            const db = await pool;
            data = await db.request().query(query);
            let rows = data.recordset
            count = rows[0]["COUNT_ROW"]
            if (count > 0) {
                result = true;
            }
        } catch (error) { }
        return result;
    }
}
export default AuthenticateJWT;