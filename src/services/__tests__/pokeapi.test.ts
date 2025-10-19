import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchAllPokemon, fetchPokemonDetails, getPokemonSprite, clearCache } from '../pokeapi';
import type { PokemonList, ApiPokemonResponse } from '../../types/pokemon';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe('PokeAPI Service', () => {
  beforeEach(() => {
    // Clear all mocks and cache before each test
    vi.clearAllMocks();
    clearCache();
  });

  describe('fetchAllPokemon', () => {
    it('should fetch all 151 original Pokemon', async () => {
      // Mock successful response
      const mockResponse: PokemonList = {
        count: 151,
        results: Array(151).fill(null).map((_, i) => ({
          name: `pokemon${i + 1}`,
          url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`
        }))
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await fetchAllPokemon();
      
      expect(result).toHaveLength(151);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=151'
      );
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(fetchAllPokemon()).rejects.toThrow('Failed to fetch Pokémon list');
    });
  });

  describe('fetchPokemonDetails', () => {
    const mockPokemonData: ApiPokemonResponse = {
      id: 1,
      name: 'bulbasaur',
      types: [
        { slot: 1, type: { name: 'grass', url: '' } },
        { slot: 2, type: { name: 'poison', url: '' } }
      ],
      sprites: {
        front_default: 'front.png',
        versions: {
          'generation-vii': {
            icons: {
              front_default: 'pixel.png'
            }
          }
        }
      },
      stats: [
        { base_stat: 45, effort: 0, stat: { name: 'hp', url: '' } },
        { base_stat: 49, effort: 0, stat: { name: 'attack', url: '' } }
      ]
    };

    it('should fetch and format Pokemon details', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemonData)
      });

      const result = await fetchPokemonDetails(1);

      expect(result).toEqual({
        id: 1,
        name: 'bulbasaur',
        types: ['grass', 'poison'],
        sprites: {
          front: 'front.png',
          pixel: 'pixel.png'
        },
        stats: {
          hp: 45,
          attack: 49
        }
      });
    });

    it('should use cache for subsequent requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemonData)
      });

      // First call
      await fetchPokemonDetails(1);
      // Second call (should use cache)
      await fetchPokemonDetails(1);

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(fetchPokemonDetails(9999)).rejects.toThrow('Failed to fetch Pokémon 9999');
    });
  });

  describe('getPokemonSprite', () => {
    it('should prefer pixel sprite over front sprite', async () => {
      const mockPokemon: ApiPokemonResponse = {
        id: 1,
        name: 'test',
        sprites: {
          front_default: 'front.png',
          versions: {
            'generation-vii': {
              icons: {
                front_default: 'pixel.png'
              }
            }
          }
        },
        types: [],
        stats: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemon)
      });

      const sprite = await getPokemonSprite(1);
      expect(sprite).toBe('pixel.png');
    });

    it('should fallback to front sprite if pixel not available', async () => {
      const mockPokemon: ApiPokemonResponse = {
        id: 1,
        name: 'test',
        sprites: {
          front_default: 'front.png',
          versions: {
            'generation-vii': {
              icons: {
                front_default: null
              }
            }
          }
        },
        types: [],
        stats: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemon)
      });

      const sprite = await getPokemonSprite(1);
      expect(sprite).toBe('front.png');
    });

    it('should use cache for subsequent sprite requests', async () => {
      const mockPokemon: ApiPokemonResponse = {
        id: 1,
        name: 'test',
        sprites: {
          front_default: 'front.png',
          versions: {
            'generation-vii': {
              icons: {
                front_default: 'pixel.png'
              }
            }
          }
        },
        types: [],
        stats: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemon)
      });

      // First call
      await getPokemonSprite(1);
      // Second call (should use cache)
      await getPokemonSprite(1);

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});