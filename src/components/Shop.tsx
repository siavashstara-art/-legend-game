import React from 'react';
import { useGameStore } from '../store/gameStore';

export const Shop: React.FC = () => {
  const { player, purchasePackage } = useGameStore();

  const packages = [
    { name: 'Sword Polish', cost: 100, boost: { strength: 5 } },
    { name: 'Armor Hardening', cost: 150, boost: { defense: 5 } },
    { name: 'Training Session', cost: 200, boost: { speed: 5, technique: 5 } },
  ];

  return (
    <div className="p-6 bg-slate-800 text-white rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">Shop</h2>
      <p className="mb-4">Coins: {player.coins}</p>
      
      <div className="grid grid-cols-1 gap-4">
        {packages.map((pkg, index) => (
          <div key={index} className="flex justify-between items-center bg-slate-700 p-4 rounded">
            <span>{pkg.name} (Cost: {pkg.cost})</span>
            <button 
              onClick={() => purchasePackage(pkg.cost, pkg.boost)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
