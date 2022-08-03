import { useState, useEffect } from "react";
import axios from "axios";

export default function Pokemon() {
  const [pokemon, setPokemon] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(
        "https://bp-pokemons.herokuapp.com?idAuthor=1"
      );
      console.log(response.data);
      setPokemon(response.data);
    };
    getData();
  }, []);

  return (
    <div>
      <h1 className="text-white">Pokemon</h1>
      {pokemon.length && (
        <div data-testid="pokemon-table">
          {pokemon.map((pokemon) => (
            <div className="text-white" key={pokemon.id}>
              <h1>{pokemon.name}</h1>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
