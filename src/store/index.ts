import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { GameStore, PlayerState, GameSettings, DEFAULT_SETTINGS } from '../types/store';
import { Pokemon } from '../types/pokemon';
import { StateCreator } from 'zustand';

const initialPlayerState: PlayerState = {
  money: 0,
  collection: {}
};

type PersistedState = {
  player: PlayerState;
  settings: GameSettings;
};

type GameStorePersist = (
  config: StateCreator<GameStore>,
  options: PersistOptions<GameStore, PersistedState>
) => StateCreator<GameStore>;

export const useStore = create<GameStore>()(
  (persist as GameStorePersist)(
    (set: (fn: (state: GameStore) => Partial<GameStore>) => void) => ({
      // Initial state
      player: initialPlayerState,
      settings: DEFAULT_SETTINGS,

      // Player actions
      addMoney: (amount: number) =>
        set((state: GameStore) => ({
          ...state,
          player: {
            ...state.player,
            money: state.player.money + amount
          }
        })),

      spendMoney: (amount: number) =>
        set((state: GameStore) => {
          if (state.player.money < amount) {
            throw new Error('Insufficient funds');
          }
          return {
            ...state,
            player: {
              ...state.player,
              money: state.player.money - amount
            }
          };
        }),

      addCardToCollection: (pokemon: Pokemon) =>
        set((state: GameStore) => {
          const now = new Date().toISOString();
          const currentCard = state.player.collection[pokemon.id];

          return {
            ...state,
            player: {
              ...state.player,
              collection: {
                ...state.player.collection,
                [pokemon.id]: {
                  count: (currentCard?.count || 0) + 1,
                  firstAcquired: currentCard?.firstAcquired || now,
                  lastAcquired: now,
                  pokemon
                }
              }
            }
          };
        }),

      // Settings actions
      updateSettings: (newSettings: Partial<GameSettings>) =>
        set((state: GameStore) => ({
          ...state,
          settings: {
            ...state.settings,
            ...newSettings
          }
        })),

      resetSettings: () =>
        set((state: GameStore) => ({
          ...state,
          settings: DEFAULT_SETTINGS
        }))
    }),
    {
      name: 'pokemon-game-storage',
      // Only persist player state and settings
      partialize: (state: GameStore) => ({
        player: state.player,
        settings: state.settings
      }) as Pick<GameStore, 'player' | 'settings'>
    }
  )
);