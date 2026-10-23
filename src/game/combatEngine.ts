// src/game/combatEngine.ts

export type CombatAction = 'ATTACK' | 'DEFEND' | 'MAGIC' | 'HEAL';

export interface GameState {
  playerHealth: number;
  monsterHealth: number;
  playerLevel: number;
  turnCount: number;
  lastMove: string | null;
}

export const initialGameState: GameState = {
  playerHealth: 100,
  monsterHealth: 100,
  playerLevel: 1,
  turnCount: 0,
  lastMove: null,
};

/**
 * Maps a chess move to a combat action.
 * Logic: Simple mapping for MVP phase.
 */
export function calculateCombatOutcome(move: string, currentState: GameState): { action: CombatAction, damage: number } {
  // Mock logic: Mapping chess pieces/moves to actions
  if (move.includes('Q')) return { action: 'ATTACK', damage: 20 }; // Queen is powerful
  if (move.includes('N')) return { action: 'MAGIC', damage: 15 }; // Knight is strategic
  
  return { action: 'ATTACK', damage: 5 };
}

export function updateGameState(action: CombatAction, damage: number, state: GameState): GameState {
  return {
    ...state,
    monsterHealth: Math.max(0, state.monsterHealth - damage),
    turnCount: state.turnCount + 1,
  };
}
