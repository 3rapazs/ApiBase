
import ErrorMessage from "./ErrorMessage";
class Result {
    public IsSuccess: boolean;
    public ErrorMessages: ErrorMessage[];
    public Message: string;
    public EntitySave: {};
    public Data: [];
    public Count: number;
}

export default Result;