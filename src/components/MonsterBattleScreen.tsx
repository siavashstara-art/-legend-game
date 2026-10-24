import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { MonsterCard } from '../types/game';

const MonsterBattleScreen: React.FC = () => {
  const { monsterCards, runBattle, battleHistory } = useGameStore();
  const [selectedPlayerMonster, setSelectedPlayerMonster] = useState<MonsterCard | null>(null);

  const handleStartBattle = (enemyCard: MonsterCard) => {
    if (!selectedPlayerMonster) {
      alert('Please select your monster first!');
      return;
    }
    runBattle(selectedPlayerMonster, enemyCard);
  };

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Monster Battle Arena</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Select Your Monster</h2>
        <div className="grid grid-cols-2 gap-4">
          {monsterCards.filter(m => m.isUnlocked).map(monster => (
            <button
              key={monster.id}
              onClick={() => setSelectedPlayerMonster(monster)}
              className={`p-4 rounded border ${selectedPlayerMonster?.id === monster.id ? 'border-yellow-500 bg-gray-800' : 'border-gray-700 bg-gray-900'}`}
            >
              <h3 className="font-bold">{monster.name}</h3>
              <p>Power: {monster.powerLevel}</p>
              <p>HP: {monster.healthPoints}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Enemies</h2>
        <div className="grid grid-cols-2 gap-4">
          {monsterCards.filter(m => !m.isUnlocked || m.id !== selectedPlayerMonster?.id).map(monster => (
            <div key={monster.id} className="p-4 rounded border border-gray-700 bg-gray-800">
              <h3 className="font-bold">{monster.name}</h3>
              <p>Power: {monster.powerLevel}</p>
              <p>HP: {monster.healthPoints}</p>
              <button 
                onClick={() => handleStartBattle(monster)}
                className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded"
              >
                Challenge
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Battle History</h2>
        <div className="space-y-2">
          {battleHistory.slice(0, 5).map(record => (
            <div key={record.id} className="p-2 bg-gray-800 rounded text-sm">
              <p>{record.playerMonsterName} vs {record.enemyMonsterName}</p>
              <p className={record.isVictory ? 'text-green-400' : 'text-red-400'}>
                {record.isVictory ? 'Victory!' : 'Defeat!'} (+{record.earnedStars} stars)
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonsterBattleScreen;
