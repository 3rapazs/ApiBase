import EntityBase from "../Shared/EntityBase";

class ImexporterModelGenerated extends EntityBase {

    public ImexporterId: number; // Primary Key
    public CmpTaxNo?: string; // Nullable
    public CmpBrnNo: number;
    public CmpNameThai: string;
    public CmpNameEng?: string;
    public StreetAndNo?: string;
    public DistrictName?: string;
    public SubProvinceName?: string;
    public ProvinceName?: string;
    public PostCode?: string;
    public Telephone?: string;
    public Fax?: string;
    public EmailAddress?: string;
    public IsExporter: boolean;
    public IsImporter: boolean;
    public Note?: string;
    public CreateDate: Date;
    public CreateUser: string;
    public UpdateDate: Date;
    public UpdateUser: string;

    // PK
    public OriginalImexporterId: string
}
export default ImexporterModelGenerated;