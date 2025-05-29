import EntityBase from "../Shared/EntityBase";

class UserModel extends EntityBase {
    public UserId: string;
    public Password: string;
    public RoleId: number;

    // PK
    public OriginalUserId: string
}
export default UserModel;