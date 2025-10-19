import { useCallback } from 'react';
import { useStore } from '../store';
import { fetchPokemonDetails } from '../services/pokeapi';
import type { Pokemon } from '../types/pokemon';

export const usePackPurchase = () => {
  const { settings, player, spendMoney, addCardToCollection } = useStore();

  const purchasePack = useCallback(async () => {
    try {
      // Check if player has enough money
      if (player.money < settings.packPrice) {
        throw new Error('Not enough money to purchase a pack');
      }

      // Spend the money first
      spendMoney(settings.packPrice);

      // Generate random Pokémon IDs (1-151)
      const randomPokemonIds = Array.from(
        { length: settings.cardsPerPack },
        () => Math.floor(Math.random() * 151) + 1
      );

      // Fetch all Pokémon in parallel
      const pokemonPromises = randomPokemonIds.map(id => fetchPokemonDetails(id));
      const pokemonCards = await Promise.all(pokemonPromises);

      // Add each card to collection
      pokemonCards.forEach(pokemon => {
        addCardToCollection(pokemon);
      });

      return pokemonCards;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to purchase pack: ${error.message}`);
      }
      throw new Error('Failed to purchase pack');
    }
  }, [settings.packPrice, settings.cardsPerPack, player.money, spendMoney, addCardToCollection]);

  return {
    purchasePack,
    canPurchase: player.money >= settings.packPrice,
    packPrice: settings.packPrice,
    cardsPerPack: settings.cardsPerPack
  };
};