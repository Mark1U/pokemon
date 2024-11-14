import { IResult } from "./IResult";

export interface IType {
    slot?: number;
    type: IResult;
}

export interface IPokemon {
    id: number;
    name: string;
    sprites: {
        front_default: string;
        other: {
            "official-artwork": {
                front_default: string;
            };
        };
    };
    types: IType[];
}
