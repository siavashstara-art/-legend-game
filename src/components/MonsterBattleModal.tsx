import React from 'react';
import MonsterBattleScreen from './MonsterBattleScreen';

interface MonsterBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MonsterBattleModal: React.FC<MonsterBattleModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border border-amber-700">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          Close
        </button>
        <MonsterBattleScreen />
      </div>
    </div>
  );
};
