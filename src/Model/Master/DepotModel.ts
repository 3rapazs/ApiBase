import EntityBase from "../Shared/EntityBase";

class DepotModel extends EntityBase {
    public CreateDate: Date;
    public CreateUser: string;
    public DepotCode: string;
    public DepotColorCode: string;
    public DepotColorName: string;
    public DepotName: string;
    public Note1: string;
    public ProvinceCode: string;
    public RegionCode: string;
    public UpdateDate: Date;
    public UpdateUser: string;
    // PK
    public OriginalDepotCode: string
}
export default DepotModel;