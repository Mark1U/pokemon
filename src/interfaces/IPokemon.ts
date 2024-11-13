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
        front_female: string | null;
        front_shiny: string;
        front_shiny_female: string | null;
    };
    types: IType[];
}
