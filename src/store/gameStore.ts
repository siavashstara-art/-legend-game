import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, Monster, Equipment, MonsterCard, BattleRecord } from '../types/game';

interface GameStore {
  player: Player;
  monster: Monster;
  combatMode: 'pvp' | 'pve' | 'idle';
  monsterCards: MonsterCard[];
  battleHistory: BattleRecord[];
  
  // Actions
  attackMonster: () => void;
  equipItem: (item: Equipment) => void;
  purchasePackage: (cost: number, statBoost: Partial<Player['stats']>) => void;
  runBattle: (playerCard: MonsterCard, enemyCard: MonsterCard) => void;
}

export const executeTurnBasedBattle = (playerCard: MonsterCard, enemyCard: MonsterCard) => {
  let playerHp = playerCard.healthPoints;
  let enemyHp = enemyCard.healthPoints;

  while (playerHp > 0 && enemyHp > 0) {
    enemyHp -= playerCard.powerLevel;
    if (enemyHp <= 0) break;
    playerHp -= enemyCard.powerLevel;
  }

  const isPlayerWinner = playerHp > 0;
  return {
    isVictory: isPlayerWinner,
    earnedStars: isPlayerWinner ? 10 : 2,
    finalPlayerHp: Math.max(0, playerHp),
    finalEnemyHp: Math.max(0, enemyHp),
  };
};

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
      monsterCards: [
        { id: 'm1', name: 'Fire Dragon', powerLevel: 50, healthPoints: 200, elementCategory: 'Fire', isUnlocked: true },
        { id: 'm2', name: 'Water Serpent', powerLevel: 40, healthPoints: 250, elementCategory: 'Water', isUnlocked: true },
        { id: 'm3', name: 'Earth Golem', powerLevel: 30, healthPoints: 300, elementCategory: 'Earth', isUnlocked: true },
        { id: 'm4', name: 'Light Angel', powerLevel: 60, healthPoints: 150, elementCategory: 'Light', isUnlocked: false },
      ],
      battleHistory: [],

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
            speed: state.player.stats.speed + item.stats.speed,
            strength: state.player.stats.strength + item.stats.strength,
            defense: state.player.stats.defense + item.stats.defense,
            technique: state.player.stats.technique + item.stats.technique,
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

      runBattle: (playerCard, enemyCard) => set((state) => {
        const result = executeTurnBasedBattle(playerCard, enemyCard);
        const newRecord: BattleRecord = {
          id: crypto.randomUUID(),
          playerMonsterName: playerCard.name,
          enemyMonsterName: enemyCard.name,
          isVictory: result.isVictory,
          earnedStars: result.earnedStars,
          timestamp: Date.now(),
        };
        return {
          battleHistory: [newRecord, ...state.battleHistory]
        };
      }),
    }),
    {
      name: 'game-storage',
    }
  )
);
