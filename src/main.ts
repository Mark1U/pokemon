import { IApiResult } from "./interfaces/IApiResult";
import { IPokemon } from "./interfaces/IPokemon";
import { IPokemonInfo } from "./interfaces/IPokemonInfo";
import { IResult } from "./interfaces/IResult";
import { typeColor } from "./constants/typeColor";

const searchInput = document.querySelector("#searchInput") as HTMLInputElement;
const buttonDiv = document.querySelector("#buttonDiv") as HTMLDivElement;
const output = document.querySelector("#output") as HTMLDivElement;

const BASE_URL: string = "https://pokeapi.co/api/v2";
const allPokemonArr: IPokemonInfo[] = [];
let typeArr: string[] = [];

async function fetchPokemon(limit: number, offset: number) {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    const apiresult: IApiResult = await response.json();
    const fetchPromises = apiresult.results.map((pokemon: IResult) => fetchPokemonDetails(pokemon.url));
    await Promise.all(fetchPromises);
    console.log(fetchPromises);
    console.log(allPokemonArr);
    displayPokemon(allPokemonArr);
}

async function fetchPokemonDetails(url: string) {
    const response = await fetch(url);
    const pokemon: IPokemon = await response.json();
    allPokemonArr.push({ id: pokemon.id, name: pokemon.name, imgUrl: pokemon.sprites.other["official-artwork"].front_default, types: pokemon.types.map((type) => type.type.name) });
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

async function fetchTypes() {
    const response = await fetch(`${BASE_URL}/type`);
    const types: IApiResult = await response.json();
    console.log(types);

    typeArr = types.results
        .slice(0, 18)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((item) => item.name);

    typeArr.forEach((typeName) => {
        const button = document.createElement("button");
        button.textContent = typeName;
        button.className = "button-type";
        button.style.backgroundColor = typeColor.get(typeName) || "#777";
        button.addEventListener("click", () => {
            const modifiedArr = allPokemonArr.filter((pokemon) => pokemon.types.includes(typeName));
            displayPokemon(modifiedArr);
        });
        buttonDiv.appendChild(button);
    });
}

searchInput.addEventListener("input", () => {
    const modifiedArr = allPokemonArr.filter((pokemon) => pokemon.name.toLowerCase().includes(searchInput.value.trim().toLowerCase()));
    displayPokemon(modifiedArr);
});

fetchTypes();
fetchPokemon(151, 0);
