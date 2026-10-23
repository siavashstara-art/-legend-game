import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, Monster, Equipment } from '../types/game';

interface GameStore {
  player: Player;
  monster: Monster;
  combatMode: 'pvp' | 'pve' | 'idle';
  
  // Actions
  attackMonster: () => void;
  equipItem: (item: Equipment) => void;
  purchasePackage: (cost: number, statBoost: Partial<Player['stats']>) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      player: {
        id: 'p1',
        name: 'Hero',
        health: 100,
        maxHealth: 100,
        stats: { speed: 10, strength: 10, defense: 10, technique: 10 },
        inventory: [],
        coins: 1000,
      },
      monster: {
        id: 'm1',
        name: 'Big Monster',
        health: 500,
        maxHealth: 500,
        attackPower: 20,
      },
      combatMode: 'idle',

      attackMonster: () => set((state) => {
        const damage = state.player.stats.strength;
        const newMonsterHealth = Math.max(0, state.monster.health - damage);
        return { monster: { ...state.monster, health: newMonsterHealth } };
      }),

      equipItem: (item) => set((state) => ({
        player: {
          ...state.player,
          inventory: [...state.player.inventory, item],
          stats: {
            speed: state.player.stats.speed + item.stats.stats.speed,
            strength: state.player.stats.strength + item.stats.stats.strength,
            defense: state.player.stats.defense + item.stats.stats.defense,
            technique: state.player.stats.technique + item.stats.stats.technique,
          }
        }
      })),

      purchasePackage: (cost, statBoost) => set((state) => {
        if (state.player.coins < cost) return state;
        return {
          player: {
            ...state.player,
            coins: state.player.coins - cost,
            stats: {
              speed: state.player.stats.speed + (statBoost.speed || 0),
              strength: state.player.stats.strength + (statBoost.strength || 0),
              defense: state.player.stats.defense + (statBoost.defense || 0),
              technique: state.player.stats.technique + (statBoost.technique || 0),
            }
          }
        };
      }),
    }),
    {
      name: 'game-storage', // name of the item in the storage (must be unique)
    }
  )
);
