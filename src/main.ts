import { IApiResult } from "./interfaces/IApiResult";
import { IPokemon } from "./interfaces/IPokemon";
import { IPokemonInfo } from "./interfaces/IPokenmonInfo";
import { IResult } from "./interfaces/IResult";

const BASE_URL: string = "https://pokeapi.co/api/v2";
const allPokemonArr: IPokemonInfo[] = [];

function fetchPokemon(limit: number, offset: number) {
    fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
        .then((response) => response.json())
        .then((apiResult: IApiResult) => {
            apiResult.results.forEach((pokemon: IResult) => {
                fetchPokemonDetails(pokemon.url);
            });
        })
        .finally(() => {
            console.log(allPokemonArr);
        });
}

function fetchPokemonDetails(url: string) {
    fetch(url)
        .then((response) => response.json())
        .then((pokemon: IPokemon) => {
            allPokemonArr.push({ id: pokemon.id, name: pokemon.name, imgUrl: pokemon.sprites.front_default, types: pokemon.types.map((type) => type.type.name) });
        });
}

fetchPokemon(20, 0);
