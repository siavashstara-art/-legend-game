/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, Globe, Award, Shield, Coins, ArrowRight, Play, X, Compass, Zap } from 'lucide-react';
import { playBoosterSound, playMetallicClashSound } from '../utils/audio.ts';
import { Language } from '../types/chess.ts';

interface MetalCastingSilkRoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAddCoins: (amount: number) => void;
}

export const MetalCastingSilkRoadModal: React.FC<MetalCastingSilkRoadModalProps> = ({
  isOpen,
  onClose,
  lang,
  onAddCoins
}) => {
  const [step, setStep] = useState<number>(1);
  const [castingProgress, setCastingProgress] = useState<number>(0);
  const [isCasting, setIsCasting] = useState<boolean>(false);
  const [castCompleted, setCastCompleted] = useState<boolean>(false);
  const [claimedReward, setClaimedReward] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCastingProgress(0);
      setIsCasting(false);
      setCastCompleted(false);
      setClaimedReward(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startCastingProcess = () => {
    setIsCasting(true);
    setCastingProgress(10);
    try {
      playMetallicClashSound();
    } catch {}

    const interval = setInterval(() => {
      setCastingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCasting(false);
          setCastCompleted(true);
          try {
            playBoosterSound('gold');
          } catch {}
          return 100;
        }
        return prev + 25;
      });
    }, 600);
  };

  const handleClaimReward = () => {
    if (claimedReward) return;
    onAddCoins(100);
    setClaimedReward(true);
    localStorage.setItem('worldplay_casting_reward_claimed', 'true');
  };

  const isFa = lang === 'fa';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-[#221c16] via-[#1a1511] to-[#120f0d] border border-amber-500/60 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#f5ecd9] max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-950/90 via-[#2a1d12] to-amber-950/90 border-b border-amber-500/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-300 tracking-tight">
                {isFa ? 'ریخته‌گری تاریخی و جاده ابریشم' : 'Historic Metal Casting & Silk Road'}
              </h2>
              <p className="text-[11px] text-amber-200/80 font-medium">
                {isFa 
                  ? 'لحظه آغازین تولد مهره‌های متالیک و کاروان‌های تجاری امپراتوری‌ها' 
                  : 'The Majestic Forge of Metallic Chess Pieces & Silk Road Caravans'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Tabs / Steps */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setStep(1)}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                step === 1
                  ? 'bg-amber-900/40 border-amber-500 text-amber-200 shadow-md'
                  : 'bg-[#18130f] border-stone-800 text-stone-400 hover:border-stone-700'
              }`}
            >
              <Flame size={20} className="text-amber-400 shrink-0" />
              <div className="text-right">
                <div className="font-bold">{isFa ? '۱. ریخته‌گری تاریخی' : '1. Historic Casting'}</div>
                <div className="text-[10px] opacity-75">{isFa ? 'طلای ۲۴ عیار و نقره استرلینگ' : '24K Gold & Sterling Silver'}</div>
              </div>
            </button>

            <button
              onClick={() => setStep(2)}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                step === 2
                  ? 'bg-amber-900/40 border-amber-500 text-amber-200 shadow-md'
                  : 'bg-[#18130f] border-stone-800 text-stone-400 hover:border-stone-700'
              }`}
            >
              <Globe size={20} className="text-amber-400 shrink-0" />
              <div className="text-right">
                <div className="font-bold">{isFa ? '۲. جاده ابریشم و تمدن‌ها' : '2. Silk Road & Empires'}</div>
                <div className="text-[10px] opacity-75">{isFa ? 'شبکه تجارت و پرچم‌ها' : 'Trade Routes & Flags'}</div>
              </div>
            </button>
          </div>

          {/* STEP 1: HISTORIC METAL CASTING CINEMATIC EXPERIENCE */}
          {step === 1 && (
            <div className="space-y-4 bg-[#18130f] border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
                <Sparkles className="text-amber-400" size={20} />
                <h3 className="font-bold text-amber-300 text-sm sm:text-base">
                  {isFa ? 'قلاب طلایی برنامه: لحظه ریخته‌گری در کوره سلطنتی' : 'The Golden App Hook: Royal Furnace Metal Casting'}
                </h3>
              </div>

              <p className="text-stone-300 leading-relaxed text-xs sm:text-sm">
                {isFa
                  ? 'در قلب امپراتوری‌های کهن، از تیسفون و تخت جمشید تا بخارا و چانگان، ساخت مهره‌های شطرنج نه یک بازی ساده، بلکه یک آیین کیمیاگری و فلزکاری مقدس بود. در آغاز برنامه، شمش‌های طلای ۲۴ عیار و نقره استرلینگ در کوره‌های گداخته آب شده و در قالب‌های دستی سلطنتی ریخته می‌شوند تا ارتش‌های شطرنج شکل گیرند.'
                  : 'In ancient empires from Persepolis to Bukhara, forging chess pieces was a sacred alchemical ritual. At app startup, 24K gold and sterling silver bullion are melted in royal furnaces and poured into custom hand-carved molds.'}
              </p>

              {/* Interactive Casting Simulation Box */}
              <div className="bg-[#120e0b] border border-amber-500/40 rounded-xl p-4 text-center space-y-3 shadow-inner">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl animate-bounce">🔥</span>
                  <span className="text-3xl">🏺</span>
                  <span className="text-3xl animate-bounce">👑</span>
                </div>

                <div className="text-xs font-mono text-amber-200">
                  {isCasting
                    ? (isFa ? 'در حال ذوب فلزات گرانبها و تزریق در قالب شاهنشاهی...' : 'Melting precious metals & pouring into royal mold...')
                    : castCompleted
                    ? (isFa ? '✨ ریخته‌گری با موفقیت کامل انجام شد! مهره‌های لوکس متالیک آماده‌اند.' : '✨ Casting completed successfully! Luxury metallic pieces are ready.')
                    : (isFa ? 'آماده‌سازی کوره برای آغاز آیین ریخته‌گری تاریخی' : 'Furnace ready for historic casting ritual')}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-stone-800 rounded-full h-3 overflow-hidden border border-amber-500/30">
                  <div
                    className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-300 h-full transition-all duration-500"
                    style={{ width: `${castingProgress}%` }}
                  />
                </div>

                <div className="flex items-center justify-center gap-3 pt-1">
                  {!castCompleted ? (
                    <button
                      onClick={startCastingProcess}
                      disabled={isCasting}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-stone-950 font-black text-xs sm:text-sm transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      <Play size={16} />
                      {isCasting ? (isFa ? 'در حال گداختن...' : 'Casting...') : (isFa ? 'شروع آیین ریخته‌گری' : 'Start Casting Ritual')}
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleClaimReward}
                        disabled={claimedReward}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <Coins size={16} />
                        {claimedReward ? (isFa ? 'پاداش ۱۰۰ دریک دریافت شد ✅' : 'Claimed 100 Darics ✅') : (isFa ? 'دریافت ۱۰۰ دریک پاداش ریخته‌گری' : 'Claim 100 Darics Reward')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SILK ROAD & CIVILIZATIONS FLAGS */}
          {step === 2 && (
            <div className="space-y-4 bg-[#18130f] border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
                <Compass className="text-amber-400" size={20} />
                <h3 className="font-bold text-amber-300 text-sm sm:text-base">
                  {isFa ? 'جاده ابریشم، پرچم‌ها و ایده‌های خلاقانه معماری' : 'Silk Road, Flags & Creative Architecture Ideas'}
                </h3>
              </div>

              <p className="text-stone-300 leading-relaxed text-xs sm:text-sm">
                {isFa
                  ? 'جاده ابریشم شریان حیاتی تبادل دانش، فرهنگ، شطرنج و فلزات گرانبها بین شرق و غرب بود. در «همجهان شطرنج»، ۱۴ تمدن بزرگ (از هخامنشیان و سامانیان تا روم، چین، ژاپن و وایکینگ‌ها) با پرچم‌های اختصاصی و خط و زبان بومی در این مسیر تجاری به رقابت استراتژیک می‌پردازند.'
                  : 'The Silk Road was the vital artery of cultural and strategic exchange. In Worldplay Chess, 14 major civilizations compete along this historic route with authentic flags and native scripts.'}
              </p>

              {/* Our Innovative Ideas Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-[#120e0b] border border-amber-500/20 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                    <Shield size={15} className="text-amber-400" />
                    <span>{isFa ? '۱. کاروانسرای جاده ابریشم (Caravan Hub)' : '1. Silk Road Caravanserai'}</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-normal">
                    {isFa
                      ? 'محیطی تجاری که بازیکنان می‌توانند در آن قطعات تمدنی، کلکسیون مهره‌های متالیک و توکن‌های سکه دریک را با سایر سفیران مبادله کنند.'
                      : 'A trading hub where players exchange civilization artifacts, metallic pieces, and Daric coins.'}
                  </p>
                </div>

                <div className="bg-[#120e0b] border border-amber-500/20 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                    <Zap size={15} className="text-yellow-400" />
                    <span>{isFa ? '۲. تورنمنت بزرگ بین‌تمدنی (Grand League)' : '2. Grand Inter-Civilization League'}</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-normal">
                    {isFa
                      ? 'مسابقات دوره‌ای هفتگی که در آن قهرمان هر تمدن (مثلاً امپراتور هخامنشی یا سامورایی ژاپن) برای فتح تاج زرین جاده ابریشم مبارزه می‌کند.'
                      : 'Weekly tournaments where champions of each civilization battle to conquer the Silk Road Golden Crown.'}
                  </p>
                </div>

                <div className="bg-[#120e0b] border border-amber-500/20 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                    <Award size={15} className="text-emerald-400" />
                    <span>{isFa ? '۳. سیستم پاداش سفیران و شهر توانا (Able City)' : '3. Able City Ambassador Rewards'}</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-normal">
                    {isFa
                      ? 'دعوت از دوستان و ساخت قطعه زمین مجازی در «شهر توانا» با پاداش‌های وفاداری واقعی و ساخت استوری‌های اختصاصی اینستاگرام.'
                      : 'Inviting friends and building virtual land in Able City with real loyalty rewards and Instagram stories.'}
                  </p>
                </div>

                <div className="bg-[#120e0b] border border-amber-500/20 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                    <Sparkles size={15} className="text-rose-400" />
                    <span>{isFa ? '۴. استودیوی اختصاصی تیزر و استوری (Promo Studio)' : '4. Dedicated Promo & Story Studio'}</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-normal">
                    {isFa
                      ? 'ساخت رایگان اولین تیزر ۳۰ ثانیه‌ای برای بازارهای داخلی و اینستاگرام با اولین ویدیو رایگان جهت رشد ویروسی.'
                      : 'Free creation of the first 30s promo for domestic markets and Instagram with free 1st base video.'}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-900/90 border-t border-amber-500/30 flex items-center justify-between">
          <div className="text-[11px] text-stone-400">
            {isFa ? 'ارائه شده توسط تیم مهندسی همجهان شطرنج' : 'Worldplay Chess Engineering Team'}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-700 to-yellow-600 hover:from-amber-600 hover:to-yellow-500 text-stone-950 font-bold text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <span>{isFa ? 'ورود به میدان نبرد' : 'Enter Battle Arena'}</span>
            <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </div>
  );
};
