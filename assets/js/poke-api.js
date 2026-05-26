const pokeApi = {};

const convertPokeApiDetailToPokemon = pokeDetail => {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;

  const types = pokeDetail.types.map(typeSlot => typeSlot.type.name); // percorre a lista de tipos da API e extrai apenas o nome de cada tipo
  const [type] = types; // desestrutura o array e pega o primeiro tipo como tipo principal do pokemon

  pokemon.types = types; // atribui a lista completa de tipos ao pokemon
  pokemon.type = type; // atribui o tipo principal ao pokemon (usado para definir a cor do card)

  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

  return pokemon; // retorna o objeto pokemon já convertido e pronto para uso
};

pokeApi.getPokemonDetail = pokemon => {
  return (
    fetch(pokemon.url)
      .then(response => response.json())
      // pegamos a lista do json.results e transformamos em uma nova lista, que é a lista de promises dos detalhes dos pokemons. Com ela, virá uma linha de respostas .json
      .then(convertPokeApiDetailToPokemon)
  );
}; // lista que será utilizada no pokemons.map

pokeApi.getPokemons = (offset = 0, limit = 10) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return (
    fetch(url)
      .then(response => response.json()) // response.json() converte o body da resposta em objeto JavaScript. Retorna uma nova Promise, por isso precisamos de outro .then. Assim que for resolvida, o body vai ser convertido em json.
      .then(jsonBody => jsonBody.results) // com o body já convertido em objeto, pega apenas a propriedade results, que é a lista de pokemons.
      .then(pokemons => pokemons.map(pokeApi.getPokemonDetail)) // mapeando a lista de pokemons em uma lista de pokemon dos detalhes deles.
      .then(detailRequests => Promise.all(detailRequests))
      // esperamos que a lista seja resolvida.
      .then(pokemonsDetails => pokemonsDetails)
  );
};
