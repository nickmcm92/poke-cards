export interface PokemonSprites {
  front: string | null;
  pixel: string | null;
}

export interface PokemonStats {
  [key: string]: number;
}

export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprites: PokemonSprites;
  stats: PokemonStats;
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonList {
  count: number;
  results: PokemonListItem[];
}

// API Response Types
export interface ApiPokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface ApiPokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface ApiPokemonSprites {
  front_default: string | null;
  versions?: {
    'generation-vii'?: {
      icons?: {
        front_default?: string | null;
      };
    };
  };
}

export interface ApiPokemonResponse {
  id: number;
  name: string;
  types: ApiPokemonType[];
  sprites: ApiPokemonSprites;
  stats: ApiPokemonStat[];
}