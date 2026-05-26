const pokemonList = document.getElementById('pokemonList'); // busca o elemento HTML com id "pokemonList" e guarda na variável

const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 151; // paginação
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map(type => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItems(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join('');
    pokemonList.innerHTML += newHtml;
  });
}
// .map passa cada pokemon pela função pokemon, gerando um array de strings HTML
// .join("") une todas as strings em uma só, sem separador
// += adiciona o resultado ao HTML já existente na lista

loadPokemonItems(offset, limit); // carrega os primeiros pokemons ao abrir a página

loadMoreButton.addEventListener('click', () => {
  offset += limit; // avança o offset para a próxima página

  const qtdRecordNextPage = offset + limit; // calcula até qual pokemon a próxima página carregaria

  if (qtdRecordNextPage >= maxRecords) {
    // se a próxima página ultrapassar o total de pokemons...
    const newLimit = maxRecords - offset; //calcula quantos pokemons faltam para completar a lista
    loadPokemonItems(offset, newLimit); // carrega apenas os pokemons restantes, sem ultrapassar o limite

    loadMoreButton.parentElement.removeChild(loadMoreButton); // removendo o botão
  } else {
    loadPokemonItems(offset, limit); // se ainda há pokemons, carrega a próxima página normalmente
  }
});
