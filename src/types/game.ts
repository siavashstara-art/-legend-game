export interface Stats {
  speed: number;
  strength: number;
  defense: number;
  technique: number;
}

export interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor';
  stats: Stats;
}

export interface Player {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  stats: Stats;
  inventory: Equipment[];
  coins: number;
}

export interface Monster {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  attackPower: number;
}

export interface GameState {
  player: Player;
  monster: Monster;
  combatMode: 'pvp' | 'pve' | 'idle';
  // ...
}
