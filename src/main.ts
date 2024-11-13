import { IApiResult } from "./interfaces/IApiResult";
import { IPokemon } from "./interfaces/IPokemon";
import { IPokemonInfo } from "./interfaces/IPokemonInfo";
import { IResult } from "./interfaces/IResult";

const searchInput = document.querySelector("#searchInput") as HTMLInputElement;
const buttonDiv = document.querySelector("#buttonDiv") as HTMLDivElement;
const output = document.querySelector("#output") as HTMLDivElement;

const BASE_URL: string = "https://pokeapi.co/api/v2";
const allPokemonArr: IPokemonInfo[] = [];
const typeBtnColors: string[] = ["#B3B3B3", "#FF9900", "#909090", "#5A1E64", "#3BB900", "#1C1C1C", "#00458A", "#FFE600", "#FFC2F9", "#E40000", "#57921C", "#965A00", "#6AD2FF", "#B3B3B3", "#70DF00", "#AB00AE", "#FF81F2", "#E1B237", "#2A4950", "#00A0E4", "#000000", "#FFFFFF", "#EBEBEB"];

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

async function fetchTypes() {
    const response = await fetch(`${BASE_URL}/type`);
    const types: IApiResult = await response.json();
    console.log(types);

    const typeResult = types.results.slice(0, 18).sort()

    types.results.slice(0, 18).sort().forEach((type, index) => {
        const button = document.createElement("button");
        button.textContent = type.name;
        button.className = "button-type";
        button.style.backgroundColor = typeBtnColors[index];
        button.addEventListener("click", () => {
            const modifiedArr = allPokemonArr.filter((pokemon) => pokemon.types.includes(type.name));
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
