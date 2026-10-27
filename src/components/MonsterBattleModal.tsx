import React from 'react';
import MonsterBattleScreen from './MonsterBattleScreen';
import { X } from 'lucide-react';

interface MonsterBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MonsterBattleModal: React.FC<MonsterBattleModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-[#14110f] rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto relative border border-amber-500/60 shadow-2xl animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-3 left-3 z-10 p-2 rounded-full bg-stone-900/90 text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer border border-stone-700"
          title="بستن پنجره معبد متحد"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        <MonsterBattleScreen />
      </div>
    </div>
  );
};
