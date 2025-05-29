class JsonReq {
    public Tran: any
    public WhereClause: string;
    public OrderBy: string;
    public Top: number;
    public PageIndex: number;
    public PageSize: number;
    public ValueToFind: string;
}

export default JsonReq;