import type {
  Pokemon,
  PokemonList,
  ApiPokemonResponse,
  PokemonListItem
} from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';
const POKEMON_LIMIT = 151; // Original 151 Pokémon

// Cache object to store API responses
const cache: {
  pokemon: Map<string | number, Pokemon>;
  sprites: Map<number, string>;
} = {
  pokemon: new Map(),
  sprites: new Map(),
};

/**
 * Fetches data for all original 151 Pokémon
 * @returns Promise<PokemonListItem[]> Array of Pokémon data
 */
export const fetchAllPokemon = async (): Promise<PokemonListItem[]> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${POKEMON_LIMIT}`);
    if (!response.ok) throw new Error('Failed to fetch Pokémon list');
    
    const data: PokemonList = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching Pokémon list:', error);
    throw error;
  }
};

/**
 * Fetches detailed data for a specific Pokémon
 * @param idOrName - Pokémon ID or name
 * @returns Promise<Pokemon> Pokémon data
 */
export const fetchPokemonDetails = async (idOrName: number | string): Promise<Pokemon> => {
  try {
    // Check cache first
    if (cache.pokemon.has(idOrName)) {
      return cache.pokemon.get(idOrName)!;
    }

    const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
    if (!response.ok) throw new Error(`Failed to fetch Pokémon ${idOrName}`);
    
    const data: ApiPokemonResponse = await response.json();
    
    // Format the data to include only what we need
    const formattedData: Pokemon = {
      id: data.id,
      name: data.name,
      types: data.types?.map(type => type.type.name) || [],
      sprites: {
        front: data.sprites?.front_default,
        // Use the pixel art sprites from Gen VII games
        pixel: data.sprites?.versions?.['generation-vii']?.icons?.front_default || null
      },
      stats: (data.stats || []).reduce((acc, stat) => {
        acc[stat.stat.name] = stat.base_stat;
        return acc;
      }, {} as { [key: string]: number })
    };

    // Store in cache
    cache.pokemon.set(idOrName, formattedData);
    return formattedData;
  } catch (error) {
    console.error(`Error fetching Pokémon ${idOrName}:`, error);
    throw error;
  }
};

/**
 * Fetches sprite URL for a specific Pokémon
 * @param id - Pokémon ID
 * @returns Promise<string> Sprite URL
 */
export const getPokemonSprite = async (id: number): Promise<string> => {
  try {
    // Check cache first
    if (cache.sprites.has(id)) {
      return cache.sprites.get(id)!;
    }

    const pokemon = await fetchPokemonDetails(id);
    const spriteUrl = pokemon.sprites.pixel || pokemon.sprites.front;
    
    if (!spriteUrl) {
      throw new Error(`No sprite available for Pokémon ${id}`);
    }
    
    // Store in cache
    cache.sprites.set(id, spriteUrl);
    return spriteUrl;
  } catch (error) {
    console.error(`Error fetching sprite for Pokémon ${id}:`, error);
    throw error;
  }
};

/**
 * Clears the cache
 */
export const clearCache = (): void => {
  cache.pokemon.clear();
  cache.sprites.clear();
};

/**
 * Optional: Prefetch all Pokémon data
 * @returns Promise<boolean> Success status
 */
export const prefetchAllPokemon = async (): Promise<boolean> => {
  try {
    const allPokemon = await fetchAllPokemon();
    await Promise.all(
      allPokemon.map(async (pokemon) => {
        await fetchPokemonDetails(pokemon.name);
      })
    );
    return true;
  } catch (error) {
    console.error('Error prefetching Pokémon data:', error);
    throw error;
  }
};