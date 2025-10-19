import { Pokemon } from './pokemon';

export interface CardCollection {
  [pokemonId: number]: {
    count: number;
    firstAcquired: string;
    lastAcquired: string;
    pokemon: Pokemon;
  }
}

export interface PlayerState {
  money: number;
  collection: CardCollection;
}

export interface GameSettings {
  workCooldown: number;  // in milliseconds
  workReward: number;    // money earned per work
  packPrice: number;     // cost of a card pack
  cardsPerPack: number; // number of cards in each pack
}

export interface GameStore {
  // Player State
  player: PlayerState;
  // Game Settings
  settings: GameSettings;
  
  // Actions
  // Player actions
  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => void;
  addCardToCollection: (pokemon: Pokemon) => void;
  
  // Settings actions
  updateSettings: (settings: Partial<GameSettings>) => void;
  resetSettings: () => void;
}

export const DEFAULT_SETTINGS: GameSettings = {
  workCooldown: 5000,  // 5 seconds
  workReward: 5,       // $5 per work
  packPrice: 20,       // $20 per pack
  cardsPerPack: 5      // 5 cards per pack
};