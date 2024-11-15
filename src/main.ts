import { IApiResult } from "./interfaces/IApiResult";
import { IPokemon } from "./interfaces/IPokemon";
import { IPokemonInfo } from "./interfaces/IPokemonInfo";
import { IResult } from "./interfaces/IResult";
import { typeColor } from "./constants/typeColor";

const searchInput = document.querySelector("#searchInput") as HTMLInputElement;
const buttonDiv = document.querySelector("#buttonDiv") as HTMLDivElement;
const output = document.querySelector("#output") as HTMLDivElement;
const modal = document.getElementById("pokemonModal");
const pokemonData = document.getElementById("pokemonData");
const span = document.getElementsByClassName("close")[0];
const searchCount = document.getElementById("searchCount");
const logo = document.getElementById("logo");
const typeImg = document.getElementById("typeImg");

const BASE_URL: string = "https://pokeapi.co/api/v2";
const allPokemonArr: IPokemonInfo[] = [];
let typeArr: string[] = [];

async function fetchPokemon(limit: number, offset: number) {
    storeCounter = 0;
    fetchCounter = 0;
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    const apiresult: IApiResult = await response.json();
    const fetchPromises = apiresult.results.map((pokemon: IResult) => fetchPokemonDetails(pokemon.url));
    await Promise.all(fetchPromises);
    console.log({ storeCounter, fetchCounter });
    displayPokemon(allPokemonArr);
}

let storeCounter = 0;
let fetchCounter = 0;

async function fetchPokemonDetails(url: string) {
    const pokemonStore = localStorage.getItem(url);
    if (pokemonStore) {
        allPokemonArr.push(JSON.parse(pokemonStore));
        storeCounter++;
    } else {
        fetchCounter++;
        const response = await fetch(url);
        const pokemon: IPokemon = await response.json();
        const data = { id: pokemon.id, name: pokemon.name, imgUrl: pokemon.sprites.other["official-artwork"].front_default, types: pokemon.types.map((type) => type.type.name) };
        allPokemonArr.push(data);
        localStorage.setItem(url, JSON.stringify(data));
    }
}

function displayPokemon(pokemonArr: IPokemonInfo[]) {
    output.innerHTML = "";
    searchCount!.textContent = `${pokemonArr.length} / ${allPokemonArr.length}`;
    pokemonArr.slice(0, 200).forEach((pokemon) => {
        const article = document.createElement("article");
        article.innerHTML = `
            <div class="img-container">
                <img src="${pokemon.imgUrl}" class="pokemon-img">
            </div>
            <div class="info-container">
                <p>#${pokemon.id.toString().padStart(3, "0")}</p>
                <p class='pokemonName'>${pokemon.name}</p>
            </div>`;

        article.addEventListener("click", () => {
            pokemonData!.innerHTML = ` <div class="img-container">
            <img src="${pokemon.imgUrl}" class="pokemon-img">
        </div>
        <div class='typeBtnNav'>
            <button style='color:white;background-color:${typeColor.get(pokemon.types[0]) || "#fff"}' id='btnType1' class='button-type' >${pokemon.types[0] || "-"}</button>
            <button style='color:white;background-color:${typeColor.get(pokemon.types[1]) || "#fff"}'id='btnType2' class='button-type' >${pokemon.types[1] || "-"}</button>
        </div>
        <div class="info-container">
            <p>#${pokemon.id.toString().padStart(3, "0")}</p>
            <p class='pokemonName'>${pokemon.name}</p>
        </div>`

            modal!.style.display = "block";
        });
        output.appendChild(article);
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
            searchInput.value = "";
            const modifiedArr = allPokemonArr.filter((pokemon) => pokemon.types.includes(typeName));
            displayPokemon(modifiedArr);
        });
        buttonDiv.appendChild(button);
    });
}

searchInput.addEventListener("input", () => {
    const modifiedArr = allPokemonArr.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchInput.value.trim().toLowerCase()) || pokemon.id.toString().includes(searchInput.value.trim().replace('#', ''))
    );
    displayPokemon(modifiedArr);
});

span.addEventListener("click", () => {
    modal!.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target == modal) {
        modal!.style.display = "none";
    }
});

typeImg?.addEventListener("click", () => {
    const shuffled = [...allPokemonArr].sort(() => 0.5 - Math.random());
    displayPokemon(shuffled.slice(0, 48));
});

logo?.addEventListener("click", () => {
    const rndArr = allPokemonArr.slice(0, 200);
    displayPokemon(rndArr);
});

const scrollTop = document.querySelector('#scrollTop')
scrollTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

fetchTypes();
fetchPokemon(1509, 0);
