import { IResult } from "./IResult";

export interface IApiResult {
    count: number;
    next: string;
    previous: string | null;
    results: IResult[];
}
