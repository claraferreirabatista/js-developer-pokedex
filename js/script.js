// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener("DOMContentLoaded", function () {
  // Seleciona o elemento com a classe 'pokedex' para exibir os cards de Pokémon
  const pokedex = document.querySelector(".pokedex");

  // Seleciona o elemento de entrada de texto para pesquisa
  const searchInput = document.getElementById("searchInput");

  // Função para buscar dados de Pokémon na PokeAPI
  async function buscarPokemon(numero) {
    try {
      // Faz uma solicitação à PokeAPI para obter os dados do Pokémon com o número especificado
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${numero}`
      );
      const data = await response.json(); // Converte a resposta em formato JSON
      return data; // Retorna os dados do Pokémon
    } catch (error) {
      // Em caso de erro, exibe uma mensagem de erro no console
      console.error("Erro ao buscar informações do Pokémon:", error);
      return null; // Retorna null para indicar que houve um erro
    }
  }

  // Função para obter o nome do tipo primário de um Pokémon
  function obterTipoPrimario(pokemon) {
    if (pokemon.types && pokemon.types.length > 0) {
      // Retorna o nome do tipo primário do Pokémon
      return pokemon.types[0].type.name;
    }
    // Retorna 'normal' como tipo padrão se não houver informações de tipo
    return "normal";
  }

  // Função para criar um card de Pokémon
  function criarCardPokemon(pokemon) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");
    const tipoPrimario = obterTipoPrimario(pokemon);

    // Define a cor de fundo do card com base no tipo do Pokémon
    card.style.backgroundColor = definirCorPorTipo(tipoPrimario);

    const numeroPokemon = pokemon.id.toString().padStart(3, "0"); // Formata o número do Pokémon
    const nomePokemon =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1); // Formata o nome do Pokémon

    card.innerHTML = `
    <section>
    <h2>${nomePokemon} </h2>
    <h3>#${numeroPokemon}</h3> 
    </section>
    <img src="${pokemon.sprites.front_default}" alt="${nomePokemon}">
  `;

    return card; // Retorna o elemento HTML do card de Pokémon
  }

  // Função para definir cores com base no tipo do Pokémon em inglês
  function definirCorPorTipo(tipo) {
    const coresPorTipo = {
      "bug":"#76A866",
      "dark":"#70657B",
      "dragon":"#004170",
      "electric":"#E7BF0D",
      "fairy":"#EA85E4",
      "fighting":"#D96D8C",
      "fire":"#EAAB7D",
      "flying":"#6892B0",
      "ghost":"#7587BD",
      "grass":"#729F92",
      "ground":"#E7A888",
      "ice":"#59C5B4",
      "normal":"#BF9762",
      "poison":"#B978BA",
      "psychic":"#F88C90",
      "rock":"#C7B78B",
      "steel":"#ADADAD",
      "water":"#71C3FF",
    };

    // Retorna a cor correspondente ao tipo do Pokémon, ou '#68A090' se o tipo não for encontrado
    return coresPorTipo[tipo] || "#BF9762";
  }

  // Função para renderizar os cards de Pokémon com base em uma pesquisa
  async function renderizarCardsPokemon(pesquisa = "") {
    // Limpa a lista de cards de Pokémon
    pokedex.innerHTML = "";

    for (let numero = 1; numero <= 21; numero++) {
      // Renderiza os primeiros 21 Pokémon ou os que correspondem à pesquisa
      const pokemon = await buscarPokemon(numero); // Obtém os dados do Pokémon

      if (pokemon) {
        const nomePokemon = pokemon.name.toLowerCase();

        // Verifica se o nome do Pokémon corresponde à pesquisa (ignora maiúsculas/minúsculas)
        if (nomePokemon.includes(pesquisa.toLowerCase())) {
          const card = criarCardPokemon(pokemon); // Cria um card de Pokémon com base nos dados
          pokedex.appendChild(card); // Adiciona o card à lista de cards na Pokedex
        }
      }
    }
  }

  // Inicia a renderização dos cards de Pokémon
  renderizarCardsPokemon();

  // Adiciona um ouvinte de evento de entrada de texto para a barra de pesquisa
  searchInput.addEventListener("input", function () {
    const termoPesquisa = searchInput.value;
    renderizarCardsPokemon(termoPesquisa);
  });
});
