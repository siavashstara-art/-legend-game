import React from 'react';
import { Swords, X, Play, Trophy, Sparkles, Award, ShieldAlert, CheckCircle } from 'lucide-react';
import { PieceStyle, BoardTheme } from '../types/chess.ts';

export interface MythicScenario {
  id: string;
  titleFa: string;
  titleEn: string;
  civId: PieceStyle;
  boardTheme: BoardTheme;
  flag: string;
  fen: string;
  turn: 'w' | 'b';
  objectiveFa: string;
  objectiveEn: string;
  loreFa: string;
  loreEn: string;
  rewardCoins: number;
}

export const SCENARIOS: MythicScenario[] = [
  {
    id: 'akbar_birbal',
    titleFa: 'تدبیر اکبر شاه گورکانی و بیربال دانا',
    titleEn: 'Wisdom of Emperor Akbar & Birbal',
    civId: 'india',
    boardTheme: 'taj_mahal',
    flag: '🇮🇳',
    // Scholar's checkmate in 1: Queen delivers mate on f7
    fen: 'r1bqkb1r/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 4',
    turn: 'w',
    objectiveFa: 'مات در ۱ حرکت (با ملکه حوا یا رخ قلعه سرخ به خانه f7 حمله کنید)',
    objectiveEn: 'Checkmate in 1 move (Attack f7 with Queen / Royal Hawa)',
    loreFa: 'در باغ‌های آگرا و در سایه گنبدهای تاج‌محل، بیربال دانا با یک تدبیر شگفت‌انگیز اکبر شاه را در آستانه پیروزی قاطع قرار می‌دهد.',
    loreEn: 'In the majestic gardens of Agra, wise Birbal unveils a lightning tactical strike for Emperor Akbar.',
    rewardCoins: 150
  },
  {
    id: 'peter_tsar',
    titleFa: 'شبیخون زمستانی تزار پتر کبیر در پترزبورگ',
    titleEn: 'Winter Strike of Tsar Peter the Great',
    civId: 'russia',
    boardTheme: 'hermitage',
    flag: '🇷🇺',
    // Anastasia's mate pattern setup
    fen: 'r4rk1/1pp2ppp/p7/4N3/1b1q4/8/PP2QPPP/R1B2RK1 w - - 0 15',
    turn: 'w',
    objectiveFa: 'مانور اسب قزاق بوگاتیر و تسخیر مرکز میدان نبرد',
    objectiveEn: 'Maneuver the Cossack Bogatyr knight to shatter the enemy flank',
    loreFa: 'تزار پتر کبیر در سرمای کاخ زمستانی ارمیتاژ و تالار مالاکیت، اساتید بزرگ شطرنج سن پترزبورگ را به یک نبرد تمام‌عیار دعوت می‌کند.',
    loreEn: 'Tsar Peter rallies the imperial chess masters across the snowy malachite halls of Saint Petersburg.',
    rewardCoins: 180
  },
  {
    id: 'suleiman_siege',
    titleFa: 'محاصره قلعه توپقاپی سلطان سلیمان قانونی',
    titleEn: 'Topkapi Rampart Siege of Suleiman the Magnificent',
    civId: 'ottoman',
    boardTheme: 'topkapi',
    flag: '🇹🇷',
    fen: 'r1bq1rk1/pp1nbppp/4pn2/2pp4/2PP4/2NBPN2/PP3PPP/R1BQK2R w KQ - 0 8',
    turn: 'w',
    objectiveFa: 'پیشروی رخ‌های مستحکم عثمانی و گشودن خطوط مرکزی',
    objectiveEn: 'Advance the imperial Ottoman rampart rooks into the center',
    loreFa: 'سلطان سلیمان و ملکه خرم سلطان در دیوان همایونی کاخ توپقاپی، لشکر یانیساری را برای فتح تخته سازماندهی می‌کنند.',
    loreEn: 'Suleiman the Magnificent and Empress Hurrem deploy the Janissary vanguard in the grand Topkapi court.',
    rewardCoins: 160
  },
  {
    id: 'cyrus_immortal',
    titleFa: 'شاهین زرین کوروش بزرگ در پاسارگاد',
    titleEn: 'Golden Falcon of Cyrus the Great at Pasargadae',
    civId: 'achaemenid',
    boardTheme: 'apadana',
    flag: '🇮🇷',
    fen: 'rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    turn: 'w',
    objectiveFa: 'تثبیت دژ آپادانا و حمله سواره‌نظام پارس',
    objectiveEn: 'Consolidate the Apadana center and launch the Persian cavalry attack',
    loreFa: 'فرمانده بزرگ هخامنشی با تکیه بر اصول منشور آزادی و خرد کهن چترنگ، نبرد اندیشه‌ها را رهبری می‌کند.',
    loreEn: 'The Achaemenid Sovereign commands the battle of intellect with the ancient wisdom of Chatrang.',
    rewardCoins: 200
  }
];

interface MythicCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadScenario: (scenario: MythicScenario) => void;
  lang: 'fa' | 'en';
}

export const MythicCampaignModal: React.FC<MythicCampaignModalProps> = ({
  isOpen,
  onClose,
  onLoadScenario,
  lang
}) => {
  if (!isOpen) return null;
  const isFa = lang === 'fa';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#181310] border-2 border-amber-500/50 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3a322b] bg-gradient-to-r from-[#241e19] to-[#1c1815]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Swords size={22} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-amber-300 flex items-center gap-2">
                <span>{isFa ? 'نبردهای داستانی و معمای اساطیر' : 'Mythological Story Battles & Puzzles'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  {isFa ? 'سناریوهای تاریخی' : 'Historical Puzzles'}
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                {isFa
                  ? 'سناریوی مورد نظر را برگزینید تا موقعیت واقعی نبرد تاریخی روی تخته بارگذاری شود'
                  : 'Select an epic historical battle position to load and solve on the board'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scenarios List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {SCENARIOS.map(scenario => (
            <div
              key={scenario.id}
              className="p-4 rounded-2xl bg-[#241e19] border border-amber-600/30 hover:border-amber-500/80 hover:bg-[#2b241e] transition-all shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3 flex-1">
                <span className="text-3xl p-2 rounded-2xl bg-stone-900 border border-stone-700 shadow-inner">
                  {scenario.flag}
                </span>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-black text-sm text-amber-300">
                      {isFa ? scenario.titleFa : scenario.titleEn}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono flex items-center gap-1">
                      <Award size={11} />
                      <span>+{scenario.rewardCoins} دریک طلا</span>
                    </span>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed">
                    {isFa ? scenario.loreFa : scenario.loreEn}
                  </p>

                  <div className="mt-2 text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-700/30">
                    <CheckCircle size={13} />
                    <span>{isFa ? scenario.objectiveFa : scenario.objectiveEn}</span>
                  </div>
                </div>
              </div>

              {/* Play Scenario Button */}
              <button
                onClick={() => {
                  onLoadScenario(scenario);
                  onClose();
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-black text-xs transition-all active:scale-95 cursor-pointer shadow-md"
              >
                <Play size={14} />
                <span>{isFa ? 'ورود به نبرد' : 'Load Battle'}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#3a322b] bg-[#14100d] flex items-center justify-between text-xs text-stone-400">
          <span className="flex items-center gap-1 text-amber-300 font-bold">
            <Sparkles size={14} />
            <span>{isFa ? 'حل هر معما امتیاز و سکه دریک اهدا می‌کند' : 'Solving scenarios awards Daric gold coins'}</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#2a231d] hover:bg-[#382f27] text-stone-300 font-bold transition-colors cursor-pointer"
          >
            {isFa ? 'بازگشت' : 'Back'}
          </button>
        </div>
      </div>
    </div>
  );
};
