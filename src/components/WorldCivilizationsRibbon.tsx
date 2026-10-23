import React from 'react';
import { Globe2, Sparkles, Shield } from 'lucide-react';
import { PieceStyle } from '../types/chess.ts';

interface WorldCivilizationsRibbonProps {
  onSelectCivilization: (style: PieceStyle) => void;
  onOpenModal: () => void;
  activeStyle: PieceStyle;
  lang?: string;
}

interface CivFlagItem {
  id: PieceStyle;
  countryFa: string;
  countryEn: string;
  flag: string;
  nativeChessName: string;
  subLabel: string;
  borderColor: string;
  bgGradient: string;
}

const CIV_FLAGS: CivFlagItem[] = [
  {
    id: 'achaemenid',
    countryFa: 'امپراتوری پارس',
    countryEn: 'Achaemenid Persia',
    flag: '🇮🇷',
    nativeChessName: 'همجهان شطرنج',
    subLabel: 'کوروش بزرگ • آپادانا',
    borderColor: 'border-amber-500/60',
    bgGradient: 'from-amber-950/80 via-stone-900 to-amber-950/80'
  },
  {
    id: 'samanid',
    countryFa: 'سامانیان بخارا',
    countryEn: 'Samanid Empire',
    flag: '🇹🇯',
    nativeChessName: 'Ҷаҳоншоҳмот',
    subLabel: 'تاجیکستان & ازبکستان',
    borderColor: 'border-sky-500/60',
    bgGradient: 'from-sky-950/80 via-slate-900 to-sky-950/80'
  },
  {
    id: 'mesopotamia',
    countryFa: 'بین‌النهرین باستان',
    countryEn: 'Ancient Mesopotamia',
    flag: '🇮🇶',
    nativeChessName: 'Gilgamesh Ur Game',
    subLabel: 'بابل و سومر باستان',
    borderColor: 'border-amber-600/60',
    bgGradient: 'from-amber-950/90 via-stone-900 to-amber-950/90'
  },
  {
    id: 'india',
    countryFa: 'امپراتوری هند',
    countryEn: 'Mughal India',
    flag: '🇮🇳',
    nativeChessName: 'चतुरंग (Chaturanga)',
    subLabel: 'اکبر شاه گورکانی • تاج‌محل',
    borderColor: 'border-orange-500/60',
    bgGradient: 'from-orange-950/80 via-slate-900 to-orange-950/80'
  },
  {
    id: 'ottoman',
    countryFa: 'امپراتوری عثمانی',
    countryEn: 'Ottoman Empire',
    flag: '🇹🇷',
    nativeChessName: 'Satranç-ı Kebir',
    subLabel: 'سلطان سلیمان قانونی',
    borderColor: 'border-red-500/60',
    bgGradient: 'from-red-950/80 via-slate-900 to-red-950/80'
  },
  {
    id: 'arabia',
    countryFa: 'عربستان و تدمر',
    countryEn: 'Ancient Arabia',
    flag: '🇸🇦',
    nativeChessName: 'الشطرنج النبطي',
    subLabel: 'بانو زنوبیا • دژ پترا',
    borderColor: 'border-emerald-600/60',
    bgGradient: 'from-emerald-950/90 via-slate-900 to-emerald-950/90'
  },
  {
    id: 'russia',
    countryFa: 'امپراتوری روسیه',
    countryEn: 'Russian Empire',
    flag: '🇷🇺',
    nativeChessName: 'Царские Шахматы',
    subLabel: 'پتر کبیر • تزارها',
    borderColor: 'border-blue-600/60',
    bgGradient: 'from-blue-950/90 via-slate-900 to-blue-950/90'
  },
  {
    id: 'england',
    countryFa: 'انگلستان کاملوت',
    countryEn: 'Mythic Britain',
    flag: '🇬🇧',
    nativeChessName: 'Royal Mythic Chess',
    subLabel: 'شاه آرتور & شوالیه‌ها',
    borderColor: 'border-emerald-500/60',
    bgGradient: 'from-emerald-950/80 via-slate-900 to-emerald-950/80'
  },
  {
    id: 'china',
    countryFa: 'چین باستان',
    countryEn: 'Ancient China',
    flag: '🇨🇳',
    nativeChessName: '象戯 (Xiangqi)',
    subLabel: 'امپراتوری اژدها',
    borderColor: 'border-yellow-600/60',
    bgGradient: 'from-amber-950/90 via-red-950/90 to-amber-950/90'
  },
  {
    id: 'rome',
    countryFa: 'روم باستان',
    countryEn: 'Roman Empire',
    flag: '🇮🇹',
    nativeChessName: 'Latrunculi Mythica',
    subLabel: 'ژولیوس سزار • کلوسیوم',
    borderColor: 'border-rose-500/60',
    bgGradient: 'from-rose-950/80 via-slate-900 to-rose-950/80'
  },
  {
    id: 'greece',
    countryFa: 'یونان باستان',
    countryEn: 'Ancient Greece',
    flag: '🇬🇷',
    nativeChessName: 'Ζατρίκιον Μυθικόν',
    subLabel: 'اسکندر & اساطیر المپ',
    borderColor: 'border-blue-500/60',
    bgGradient: 'from-blue-950/80 via-slate-900 to-blue-950/80'
  },
  {
    id: 'egypt',
    countryFa: 'مصر باستان',
    countryEn: 'Ancient Egypt',
    flag: '🇪🇬',
    nativeChessName: '𓈙𓏏𓂋𓈖𓆓 Senet',
    subLabel: 'فرعون رامسس • اهرام',
    borderColor: 'border-yellow-500/60',
    bgGradient: 'from-yellow-950/80 via-slate-900 to-yellow-950/80'
  },
  {
    id: 'japan',
    countryFa: 'ژاپن سامورایی',
    countryEn: 'Samurai Japan',
    flag: '🇯🇵',
    nativeChessName: '神話将棋',
    subLabel: 'شیوگون & سامورایی',
    borderColor: 'border-red-600/60',
    bgGradient: 'from-red-950/90 via-slate-900 to-red-950/90'
  },
  {
    id: 'nordic',
    countryFa: 'اساطیر نورس',
    countryEn: 'Norse Vikings',
    flag: '🇸🇪',
    nativeChessName: 'Skáktəfl (Viking)',
    subLabel: 'اودین & وایکینگ‌ها',
    borderColor: 'border-cyan-600/60',
    bgGradient: 'from-cyan-950/90 via-slate-900 to-cyan-950/90'
  }
];

export const WorldCivilizationsRibbon: React.FC<WorldCivilizationsRibbonProps> = ({
  onSelectCivilization,
  onOpenModal,
  activeStyle,
  lang = 'fa'
}) => {
  const isFa = lang === 'fa';

  return (
    <div className="w-full my-1 space-y-1 dir-rtl">
      
      {/* Top Small Label */}
      <div className="flex items-center justify-between px-1 text-[11px] font-bold text-amber-300">
        <span className="flex items-center gap-1.5">
          <Globe2 className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span>{isFa ? 'پرچم ۱۴ امپراتوری و مهد تمدن جهان:' : '14 World Empires & Cradles of Civilization:'}</span>
        </span>
        <button
          onClick={onOpenModal}
          className="text-[10px] text-amber-400/90 hover:text-amber-200 underline font-mono cursor-pointer"
        >
          {isFa ? 'مشاهده دیوان تمدن‌ها 🌍' : 'View All Civilizations 🌍'}
        </button>
      </div>

      {/* Horizontal Scrollable Ribbon Bar */}
      <div className="w-full overflow-x-auto no-scrollbar py-1 flex items-center gap-2 px-0.5 select-none">
        {CIV_FLAGS.map((civ) => {
          const isActive = activeStyle === civ.id;

          return (
            <button
              key={civ.id}
              onClick={() => {
                onSelectCivilization(civ.id);
                onOpenModal();
              }}
              className={`shrink-0 flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer shadow-md bg-gradient-to-r ${civ.bgGradient} ${
                isActive
                  ? `${civ.borderColor} ring-2 ring-amber-400/50 scale-105 shadow-amber-500/20`
                  : 'border-amber-500/20 hover:border-amber-500/50 hover:scale-102 opacity-85 hover:opacity-100'
              }`}
              title={`${civ.countryFa} (${civ.subLabel}) - ${civ.nativeChessName}`}
            >
              {/* Flag Badge */}
              <span className="text-lg leading-none shrink-0 drop-shadow">
                {civ.flag}
              </span>

              {/* Native Script Title & Ruler */}
              <div className="flex flex-col text-right leading-tight">
                <span className="text-xs font-black text-amber-200 tracking-tight whitespace-nowrap font-serif">
                  {civ.nativeChessName}
                </span>
                <span className="text-[9px] text-stone-300/80 font-medium whitespace-nowrap">
                  {isFa ? civ.countryFa : civ.countryEn} ({civ.subLabel})
                </span>
              </div>

              {isActive && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
};
