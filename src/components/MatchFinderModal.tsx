import React, { useState, useEffect } from 'react';
import { 
  Users, Bot, Trophy, Search, UserCheck, Sparkles, X, 
  ChevronLeft, Swords, ShieldCheck, Flame, Globe2 
} from 'lucide-react';
import { Language } from '../types/chess.ts';

interface MatchFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayVsBot: () => void;
  onPlayWithFriend: () => void;
  onJoinLeague: () => void;
  onFindOnlineOpponent: (opponentName: string, opponentRating: number, opponentCountry: string) => void;
  playerRating: number;
  playerLevel: number;
  lang: Language;
}

export const MatchFinderModal: React.FC<MatchFinderModalProps> = ({
  isOpen,
  onClose,
  onPlayVsBot,
  onPlayWithFriend,
  onJoinLeague,
  onFindOnlineOpponent,
  playerRating,
  playerLevel,
  lang
}) => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchProgress, setSearchProgress] = useState<number>(0);
  const [foundOpponent, setFoundOpponent] = useState<{ name: string; rating: number; country: string; flag: string } | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSearching) {
      setSearchProgress(10);
      setFoundOpponent(null);

      interval = setInterval(() => {
        setSearchProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            // Found a matching rival!
            const rivals = [
              { name: 'امیر سهراب از دوشنبه', rating: playerRating + 15, country: 'TJ', flag: '🇹🇯' },
              { name: 'فرمانده بهرام از بخارا', rating: playerRating - 10, country: 'UZ', flag: '🇺🇿' },
              { name: 'آریا شاه از پاسارگاد', rating: playerRating + 25, country: 'IR', flag: '🇮🇷' },
              { name: 'اسکندر سوارکار از آتن', rating: playerRating + 5, country: 'GR', flag: '🇬🇷' },
              { name: 'سلطان بایزید از استانبول', rating: playerRating - 20, country: 'TR', flag: '🇹🇷' }
            ];
            const matched = rivals[Math.floor(Math.random() * rivals.length)];
            setFoundOpponent(matched);
            setIsSearching(false);
            return 100;
          }
          return prev + 25;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isSearching, playerRating]);

  if (!isOpen) return null;

  const isFa = lang === 'fa';
  const isTg = lang === 'tg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#1a1410] border-2 border-amber-500/80 rounded-2xl max-w-lg w-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#473424] bg-gradient-to-r from-[#291c13] via-[#1c140e] to-[#291c13]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Swords size={22} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-amber-300">
                {isFa 
                  ? 'انتخاب هم‌بازی و شیوه نبرد' 
                  : isTg 
                  ? 'Интихоби ҳамбозӣ ва тарзи набард'
                  : 'Find Opponent & Matchmaking'}
              </h3>
              <p className="text-[11px] text-stone-400">
                {isFa 
                  ? 'مایلید برایتان هم‌بازی پیدا کنیم یا با ماشین و دوستان نبرد کنید؟' 
                  : isTg
                  ? 'Мехоҳед ҳамбозӣ ёбем ё бо мошин (ҳуши сунъӣ) бозӣ мекунед?'
                  : 'How would you like to duel today?'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-3 text-xs sm:text-sm">
          
          {/* Matchmaking in Progress Screen */}
          {isSearching ? (
            <div className="p-6 text-center space-y-4 bg-[#231811] border border-amber-500/40 rounded-xl animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto flex items-center justify-center">
                <Search size={24} className="text-amber-400" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-amber-300 text-sm">
                  {isFa ? 'در حال جستجوی هم‌بازی هم‌سطح شما...' : 'Searching for a worthy opponent...'}
                </h4>
                <p className="text-xs text-stone-400">
                  {isFa 
                    ? `تطبیق با ریتینگ ${playerRating} و لول ${playerLevel} در دیوان همجهان`
                    : `Matching around ${playerRating} rating and Level ${playerLevel}`}
                </p>
              </div>

              <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden border border-stone-800">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full transition-all duration-300"
                  style={{ width: `${searchProgress}%` }}
                />
              </div>

              <button
                onClick={() => setIsSearching(false)}
                className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer"
              >
                {isFa ? 'لغو جستجو' : 'Cancel Search'}
              </button>
            </div>
          ) : foundOpponent ? (
            /* Matched Opponent Card */
            <div className="p-5 text-center space-y-4 bg-gradient-to-b from-[#2a1c12] to-[#1e130c] border-2 border-emerald-500/70 rounded-xl animate-in zoom-in-95">
              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                {isFa ? 'هم‌بازی پیدا شد! ⚔️' : isTg ? 'Ҳамбозӣ ёфт шуд! ⚔️' : 'Opponent Found! ⚔️'}
              </span>

              <div className="flex items-center justify-center gap-4 py-2">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-2xl mx-auto shadow-lg">
                    👑
                  </div>
                  <div className="font-bold text-amber-300 text-xs mt-1">شما (فرمانده)</div>
                  <div className="text-[10px] text-stone-400">{playerRating} ELO</div>
                </div>

                <div className="font-black text-amber-500 text-lg">VS</div>

                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-sky-500/20 border-2 border-sky-400 flex items-center justify-center text-2xl mx-auto shadow-lg">
                    {foundOpponent.flag}
                  </div>
                  <div className="font-bold text-sky-300 text-xs mt-1">{foundOpponent.name}</div>
                  <div className="text-[10px] text-stone-400">{foundOpponent.rating} ELO</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => {
                    onFindOnlineOpponent(foundOpponent.name, foundOpponent.rating, foundOpponent.country);
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-stone-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-950/40 cursor-pointer transition-all active:scale-95"
                >
                  {isFa ? 'شروع نبرد با این هم‌بازی (+۵۰۰ امتیاز برد)' : 'Start Match (+500 XP on Win)'}
                </button>
              </div>
            </div>
          ) : (
            /* Option Selector */
            <div className="space-y-2.5">
              
              {/* Option 1: Find an Online Companion */}
              <button
                onClick={() => setIsSearching(true)}
                className="w-full p-3.5 rounded-xl bg-gradient-to-r from-[#2a1c12] to-[#20150d] hover:from-[#352317] hover:to-[#281a10] border-2 border-amber-500/70 hover:border-amber-400 text-right flex items-center justify-between gap-3 shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-600/20 text-amber-300 border border-amber-500/40 group-hover:scale-105 transition-transform">
                    <Search size={22} />
                  </div>
                  <div>
                    <div className="font-black text-amber-200 text-xs sm:text-sm flex items-center gap-1.5">
                      <span>{isFa ? '۱. پیدا کردن هم‌بازی آنلاین برای من' : isTg ? '۱. Ёфтани ҳамбозӣ барои ман' : '1. Find Me an Online Opponent'}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">پیشنهادی ⭐</span>
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      {isFa 
                        ? 'جستجوی هوشمند بازیکن هم‌سطح از ایران، تاجیکستان، ازبکستان و سایر کشورها' 
                        : 'Smart matchmaking matching your exact rating tier'}
                    </div>
                  </div>
                </div>
                <ChevronLeft size={18} className="text-amber-400 flex-shrink-0" />
              </button>

              {/* Option 2: Play vs Machine / AI */}
              <button
                onClick={() => {
                  onPlayVsBot();
                  onClose();
                }}
                className="w-full p-3 rounded-xl bg-[#201711] hover:bg-[#2b1f17] border border-stone-700 hover:border-amber-500/50 text-right flex items-center justify-between gap-3 shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 group-hover:scale-105 transition-transform">
                    <Bot size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-sky-200 text-xs sm:text-sm">
                      {isFa ? '۲. بازی با ماشین (هوش مصنوعی)' : isTg ? '۲. Бозӣ бо мошин (ҳуши сунъӣ)' : '2. Play against Machine (AI Bot)'}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      {isFa ? 'نبرد تک‌نفره آفلاین با هوش مصنوعی تمدن‌ها (مبتدی، متوسط، استاد اعظم)' : 'Solo match with configurable tactical difficulty'}
                    </div>
                  </div>
                </div>
                <ChevronLeft size={18} className="text-stone-400 flex-shrink-0" />
              </button>

              {/* Option 3: Play with a Friend inside App */}
              <button
                onClick={() => {
                  onPlayWithFriend();
                  onClose();
                }}
                className="w-full p-3 rounded-xl bg-[#201711] hover:bg-[#2b1f17] border border-stone-700 hover:border-amber-500/50 text-right flex items-center justify-between gap-3 shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 group-hover:scale-105 transition-transform">
                    <Users size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-emerald-200 text-xs sm:text-sm">
                      {isFa ? '۳. بازی با دوست خود در داخل برنامه (Pass & Play)' : isTg ? '۳. Бозӣ бо дӯсти худ дар барнома' : '3. Play with a Friend (Local 2-Players)'}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      {isFa ? 'نبرد نوبتی دو نفره روبه‌رو روی یک گوشی یا تبلت همراه با تایمر زمان' : 'Pass & Play head-to-head match on one device'}
                    </div>
                  </div>
                </div>
                <ChevronLeft size={18} className="text-stone-400 flex-shrink-0" />
              </button>

              {/* Option 4: Join the Imperial League */}
              <button
                onClick={() => {
                  onJoinLeague();
                  onClose();
                }}
                className="w-full p-3 rounded-xl bg-[#201711] hover:bg-[#2b1f17] border border-stone-700 hover:border-amber-500/50 text-right flex items-center justify-between gap-3 shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 group-hover:scale-105 transition-transform">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-purple-200 text-xs sm:text-sm flex items-center gap-1.5">
                      <span>{isFa ? '۴. حضور در لیگ‌های اساطیری' : isTg ? '۴. Иштирок дар лигаҳои шоҳӣ' : '4. Compete in Imperial Leagues'}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold">+۵۰۰ XP برد</span>
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      {isFa ? 'کسب ۵۰۰ امتیاز برای هر برد، ۲۵۰ امتیاز مساوی و صعود در رنکینگ جهانی' : 'Earn 500 XP per win, 250 XP per draw and climb leagues'}
                    </div>
                  </div>
                </div>
                <ChevronLeft size={18} className="text-stone-400 flex-shrink-0" />
              </button>

            </div>
          )}

          {/* Points Rules Summary Box */}
          <div className="p-2.5 rounded-xl bg-[#140f0c] border border-amber-600/30 flex items-center justify-between text-[11px] text-amber-200/90 font-medium">
            <span className="flex items-center gap-1.5">
              <span>🏆</span>
              <span>{isFa ? 'امتیازات لیگ: هر برد ۵۰۰ امتیاز • هر مساوی ۲۵۰ امتیاز' : 'League: +500 XP Win • +250 XP Draw'}</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">لول‌آپ هر ۱۰۰۰XP</span>
          </div>

        </div>
      </div>
    </div>
  );
};
