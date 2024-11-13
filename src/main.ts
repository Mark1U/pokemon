import { IApiResult } from "./interfaces/IApiResult";
import { IPokemon } from "./interfaces/IPokemon";
import { IPokemonInfo } from "./interfaces/IPokemonInfo";
import { IResult } from "./interfaces/IResult";

const output = document.querySelector("#output") as HTMLDivElement;

const BASE_URL: string = "https://pokeapi.co/api/v2";
const allPokemonArr: IPokemonInfo[] = [];

async function fetchPokemon(limit: number, offset: number) {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    const apiresult: IApiResult = await response.json();
    await apiresult.results.forEach((pokemon: IResult) => {
        fetchPokemonDetails(pokemon.url);
    });
    console.log(allPokemonArr);

    displayPokemon(allPokemonArr);
}

function fetchPokemonDetails(url: string) {
    const response = fetch(url);
    const pokemon: IPokemon = response.json();
    allPokemonArr.push({ id: pokemon.id, name: pokemon.name, imgUrl: pokemon.sprites.front_default, types: pokemon.types.map((type) => type.type.name) });
}

function displayPokemon(pokemonArr: IPokemonInfo[]) {
    output.innerHTML = "";
    pokemonArr.forEach((pokemon) => {
        console.log("innerhalb der funktion");
        output.innerHTML += `
        <article>
            <div class="img-container">
                <img src="${pokemon.imgUrl}" class="pokemon-img">
            </div>
            <div class="info-container">
                <p>#${pokemon.id.toString().padStart(3, "0")}</p>
                <p>${pokemon.name}</p>
            </div>
        </article>
        `;
    });
}

fetchPokemon(20, 0);
