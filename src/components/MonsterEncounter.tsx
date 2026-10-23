import React from 'react';
import { useGameStore } from '../store/gameStore';

export const MonsterEncounter: React.FC = () => {
  const { monster, player, attackMonster } = useGameStore();

  return (
    <div className="p-6 bg-slate-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Battle: {monster.name}</h2>
      
      <div className="flex gap-8">
        <div className="flex-1">
          <h3 className="text-xl">Hero: {player.name}</h3>
          <p>Health: {player.health}/{player.maxHealth}</p>
          <p>Strength: {player.stats.strength}</p>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl">Monster: {monster.name}</h3>
          <p>Health: {monster.health}/{monster.maxHealth}</p>
          <div className="w-full bg-gray-700 h-4 rounded-full mt-2">
            <div 
              className="bg-red-500 h-4 rounded-full" 
              style={{ width: `${(monster.health / monster.maxHealth) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <button 
        onClick={attackMonster}
        className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition"
      >
        Attack!
      </button>
    </div>
  );
};
