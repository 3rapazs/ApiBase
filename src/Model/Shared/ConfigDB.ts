class Config {
    public user: string
    public password: string
    public server: string
    public database: string
    public options: {
        encrypt: boolean
        trustedconnection: boolean
        enableArithAbort: boolean
        instancename: string
    }
    public port: number
}

export default Config;