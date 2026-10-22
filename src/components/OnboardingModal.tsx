import React, { useState } from 'react';
import { 
  X, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, 
  Crown, Mail, User, Trophy, BookOpen, Swords, Users, Bot, 
  Award, Shield, HelpCircle, Star, Zap, ShieldCheck
} from 'lucide-react';
import { Language } from '../types/chess.ts';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartVsBot: () => void;
  onStartPassAndPlay: () => void;
  onOpenLeague: () => void;
  onOpenAcademy: () => void;
  onOpenCampaign: () => void;
  onAddCoins: (amount: number) => void;
  lang: Language;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartVsBot,
  onStartPassAndPlay,
  onOpenLeague,
  onOpenAcademy,
  onOpenCampaign,
  onAddCoins,
  lang
}) => {
  const [step, setStep] = useState<number>(1);
  const isRtl = ['fa', 'ar'].includes(lang);
  const isCyrillic = lang === 'tg' || lang === 'ru';

  // Sign-in state
  const [email, setEmail] = useState<string>(() => localStorage.getItem('worldplay_player_email') || 'siavashhamiri@gmail.com');
  const [playerName, setPlayerName] = useState<string>(() => localStorage.getItem('worldplay_player_name') || 'فرمانده سیاوش');
  const [isRegistered, setIsRegistered] = useState<boolean>(() => localStorage.getItem('worldplay_registered') === 'true');

  // Quiz state
  const [skillLevel, setSkillLevel] = useState<string>('intermediate');
  const [favoriteTactic, setFavoriteTactic] = useState<string>('fork');
  const [playStyle, setPlayStyle] = useState<string>('aggressive');
  const [quizBonusClaimed, setQuizBonusClaimed] = useState<boolean>(() => localStorage.getItem('worldplay_quiz_claimed') === 'true');

  if (!isOpen) return null;

  const handleRegister = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    localStorage.setItem('worldplay_player_email', email);
    localStorage.setItem('worldplay_player_name', playerName);
    localStorage.setItem('worldplay_registered', 'true');
    setIsRegistered(true);

    // Give welcome reward of 100 coins
    onAddCoins(100);
    setStep(3);
  };

  const handleCompleteQuiz = () => {
    if (!quizBonusClaimed) {
      onAddCoins(50);
      setQuizBonusClaimed(true);
      localStorage.setItem('worldplay_quiz_claimed', 'true');
    }
    setStep(5);
  };

  const handleFinishOnboarding = (action: () => void) => {
    localStorage.setItem('worldplay_onboarding_completed', 'true');
    onClose();
    action();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#1a1512] border-2 border-amber-500/80 rounded-2xl max-w-xl w-full flex flex-col shadow-2xl overflow-hidden max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-[#4a3b2c] bg-gradient-to-r from-[#2a1f17] via-[#1f1712] to-[#2a1f17]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Crown size={20} />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-black text-amber-300">
                {lang === 'fa' 
                  ? 'کاخ اساطیر و ثبت‌نام دربار شاهنشاهی' 
                  : lang === 'tg'
                  ? 'Қасри асотир ва сабти номи дарбори шоҳӣ'
                  : 'Imperial Mythic Palace & Induction'}
              </h3>
              <p className="text-[11px] text-stone-400">
                {lang === 'fa' 
                  ? `مرحله ${step} از ۵` 
                  : lang === 'tg' 
                  ? `Марҳилаи ${step} аз ۵` 
                  : `Step ${step} of 5`}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.setItem('worldplay_onboarding_completed', 'true');
              onClose();
            }}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            title="بستن / Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="w-full bg-[#120f0d] h-1.5">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300" 
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm text-stone-200">
          
          {/* STEP 1: VISUAL SHOWCASE OF MYTHIC CHESS PIECES */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
                  {lang === 'fa' ? 'شکوه مهره‌ها و تمدن‌های کهن' : lang === 'tg' ? 'Шукӯҳи мӯҳраҳо ва тамаддунҳои куҳан' : 'Showcase of Mythic Pieces'}
                </span>
                <h4 className="text-base sm:text-lg font-black text-amber-200">
                  {lang === 'fa' 
                    ? 'اولین شطرنج اقتباس‌شده با تم اساطیری و کیمیاگری' 
                    : lang === 'tg' 
                    ? 'Аввалин шоҳмоти асотирӣ ва кимиёӣ дар ҷаҳон' 
                    : 'The First Mythological & Alchemy Adapted Chess'}
                </h4>
                <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
                  {lang === 'fa'
                    ? 'ترکیب بی‌نظیر شطرنج فکری با فرهنگ هخامنشی، سامانیان بخارا (تاجیکستان و ازبکستان)، گورکانیان هند، عثمانی و فلزات ۶گانه کیمیاگری.'
                    : lang === 'tg'
                    ? 'Омезиши беназири шоҳмот бо фарҳанги Ҳахоманишӣ, давлати Сомониёни Бухоро (Тоҷикистон ва Ӯзбекистон), Акбаршоҳи Ҳинд ва филиззоти кимиёӣ.'
                    : 'A fusion of strategic chess with Achaemenid Persia, Samanid Bukhara (Tajikistan & Uzbekistan), Mughal India, and the 6 alchemical metals.'}
                </p>

                {/* Creator Credits & Google AI Studio Partnership Banner */}
                <div className="p-3 bg-gradient-to-r from-amber-950/80 via-[#261c14] to-amber-950/80 border border-amber-500/60 rounded-xl space-y-1 text-xs text-center shadow-md my-2">
                  <div className="font-black text-amber-300">
                    👑 طراح و ایده‌پرداز برنامه: جناب آقای اکبر علیمیری
                  </div>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    با سپاس و قدردانی فراوان از همراهی و همکاری بسیار ارزشمند کمپانی معظم <strong className="text-amber-400">گوگل ای‌آی استودیو (Google AI Studio)</strong>
                  </p>
                </div>
              </div>

              {/* Showcase Grid of Pieces */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="bg-[#241c16] border border-amber-500/40 rounded-xl p-3 flex flex-col items-center text-center shadow-md hover:border-amber-400 transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl shadow-lg border-2 border-amber-300 mb-2">
                    👑
                  </div>
                  <span className="font-bold text-amber-300 text-xs">
                    {lang === 'fa' ? 'شاه زرین کوروش' : lang === 'tg' ? 'Шоҳи тилоии Куруш' : 'Gold King Cyrus'}
                  </span>
                  <span className="text-[10px] text-stone-400 mt-0.5">
                    {lang === 'fa' ? 'طلا • هخامنشی پارس' : lang === 'tg' ? 'Тило • Ҳахоманишӣ' : 'Gold • Achaemenid'}
                  </span>
                </div>

                <div className="bg-[#241c16] border border-sky-500/40 rounded-xl p-3 flex flex-col items-center text-center shadow-md hover:border-sky-400 transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-2xl shadow-lg border-2 border-sky-300 mb-2">
                    🕌
                  </div>
                  <span className="font-bold text-sky-300 text-xs">
                    {lang === 'fa' ? 'امیر مسعود سامانی' : lang === 'tg' ? 'Амир Масъуди Сомонӣ' : 'Emir Masoud Samani'}
                  </span>
                  <span className="text-[10px] text-stone-400 mt-0.5">
                    {lang === 'fa' ? 'تاجیکستان و ازبکستان' : lang === 'tg' ? 'Тоҷикистон ва Ӯзбекистон' : 'Tajikistan & Uzbekistan'}
                  </span>
                </div>

                <div className="bg-[#241c16] border border-slate-400/40 rounded-xl p-3 flex flex-col items-center text-center shadow-md hover:border-slate-300 transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 flex items-center justify-center text-2xl shadow-lg border-2 border-white mb-2 text-stone-900">
                    💎
                  </div>
                  <span className="font-bold text-slate-200 text-xs">
                    {lang === 'fa' ? 'ملکه نقره‌ای ماندانا' : lang === 'tg' ? 'Маликаи нуқрагӣ' : 'Silver Queen Mandana'}
                  </span>
                  <span className="text-[10px] text-stone-400 mt-0.5">
                    {lang === 'fa' ? 'نقره • بانوی خردمند' : lang === 'tg' ? 'Нуқра • Маликаи доно' : 'Silver • Wise Queen'}
                  </span>
                </div>

                <div className="bg-[#241c16] border border-amber-700/40 rounded-xl p-3 flex flex-col items-center text-center shadow-md hover:border-amber-600 transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-2xl shadow-lg border-2 border-amber-600 mb-2">
                    🐘
                  </div>
                  <span className="font-bold text-amber-200 text-xs">
                    {lang === 'fa' ? 'فیل برنزی باستان' : lang === 'tg' ? 'Фили биринҷӣ' : 'Bronze Bishop'}
                  </span>
                  <span className="text-[10px] text-stone-400 mt-0.5">
                    {lang === 'fa' ? 'برنز • ارتش گورکانی' : lang === 'tg' ? 'Биринҷӣ • Ҳиндустон' : 'Bronze • Gurkani'}
                  </span>
                </div>

                <div className="bg-[#241c16] border border-amber-900/40 rounded-xl p-3 flex flex-col items-center text-center shadow-md hover:border-amber-700 transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-800 to-stone-800 flex items-center justify-center text-2xl shadow-lg border-2 border-amber-800 mb-2">
                    🐎
                  </div>
                  <span className="font-bold text-amber-200 text-xs">
                    {lang === 'fa' ? 'اسب چوبی سرستون' : lang === 'tg' ? 'Аспи чӯбини сарсутун' : 'Wood Knight Capital'}
                  </span>
                  <span className="text-[10px] text-stone-400 mt-0.5">
                    {lang === 'fa' ? 'چوب • تخت جمشید' : lang === 'tg' ? 'Чӯб • Тахти Ҷамшед' : 'Wood • Persepolis'}
                  </span>
                </div>

                <div className="bg-[#241c16] border border-stone-500/40 rounded-xl p-3 flex flex-col items-center text-center shadow-md hover:border-stone-400 transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-stone-600 to-stone-800 flex items-center justify-center text-2xl shadow-lg border-2 border-stone-500 mb-2">
                    🛡️
                  </div>
                  <span className="font-bold text-stone-300 text-xs">
                    {lang === 'fa' ? 'سرباز آهنین جاویدان' : lang === 'tg' ? 'Сарбози оҳанин' : 'Iron Pawn Immortal'}
                  </span>
                  <span className="text-[10px] text-stone-400 mt-0.5">
                    {lang === 'fa' ? 'آهن • لشکر شکست‌ناپذیر' : lang === 'tg' ? 'Оҳан • Лашкари ҷовидон' : 'Iron • Invincible Guard'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-amber-900/40 cursor-pointer transition-all active:scale-95"
                >
                  <span>{lang === 'fa' ? 'ورود و ثبت‌نام دربار' : lang === 'tg' ? 'Воридшавӣ ва сабти ном' : 'Continue to Registration'}</span>
                  <ChevronLeft size={16} className={isRtl ? '' : 'rotate-180'} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: REGISTRATION WITH GMAIL OR USERNAME */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto text-xl">
                  📜
                </div>
                <h4 className="text-base sm:text-lg font-black text-amber-200">
                  {lang === 'fa' ? 'ثبت‌نام رسمی در دیوان شاهنشاهی' : lang === 'tg' ? 'Сабти номи расмӣ дар девони шоҳӣ' : 'Register Your Imperial Profile'}
                </h4>
                <p className="text-xs text-stone-400">
                  {lang === 'fa'
                    ? 'برای ذخیره امن افتخارات، ریتینگ جهانی و سکه‌های زرین، حساب خود را متصل فرمایید.'
                    : lang === 'tg'
                    ? 'Барои нигоҳдории амни дараҷа ва дирамҳо, ҳисоби худро сабт кунед.'
                    : 'Link your Gmail or choose a commander name to securely sync your XP & Darics.'}
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-3.5 bg-[#231a14] border border-[#4a3a2a] p-4 rounded-xl">
                {/* One-click Gmail Quick Sign-In */}
                <button
                  type="button"
                  onClick={() => {
                    setEmail('siavashhamiri@gmail.com');
                    setPlayerName('فرمانده سیاوش');
                    handleRegister();
                  }}
                  className="w-full py-2.5 px-3 rounded-lg bg-white hover:bg-stone-100 text-stone-900 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border border-stone-300"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{lang === 'fa' ? 'ورود سریع با جیمیل گوگل (siavashhamiri@gmail.com)' : 'Quick Sign-In with Google'}</span>
                </button>

                <div className="flex items-center gap-2 my-2">
                  <div className="h-px bg-stone-700 flex-1" />
                  <span className="text-[10px] text-stone-500 font-mono uppercase">
                    {lang === 'fa' ? 'یا ورود اختصاصی' : 'or custom profile'}
                  </span>
                  <div className="h-px bg-stone-700 flex-1" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-300 mb-1 flex items-center gap-1">
                    <User size={13} />
                    <span>{lang === 'fa' ? 'نام فرمانده / عنوان شاهنشاهی' : lang === 'tg' ? 'Номи сарлашкар' : 'Commander Name'}</span>
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={e => setPlayerName(e.target.value)}
                    required
                    className="w-full bg-[#17110d] border border-stone-700 focus:border-amber-500 rounded-lg p-2 text-stone-200 text-xs outline-none"
                    placeholder="مثلاً: فرمانده کوروش، امیر مسعود"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-300 mb-1 flex items-center gap-1">
                    <Mail size={13} />
                    <span>{lang === 'fa' ? 'پست الکترونیکی (جیمیل)' : lang === 'tg' ? 'Почтаи электронӣ (Ҷимейл)' : 'Gmail / Email'}</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#17110d] border border-stone-700 focus:border-amber-500 rounded-lg p-2 text-stone-200 text-xs outline-none"
                    placeholder="name@gmail.com"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-3 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer"
                  >
                    {lang === 'fa' ? 'بازگشت' : 'Back'}
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-amber-900/40 cursor-pointer transition-all active:scale-95"
                  >
                    <span>{lang === 'fa' ? 'ثبت و دریافت ۱۰۰ دریک زرین هدیه 🎁' : 'Register & Claim 100 Darics'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: JOYFUL CELEBRATION CARD ("اینجا جایی است که هم بازی میکنی و هم یاد میگیری!") */}
          {step === 3 && (
            <div className="space-y-4 text-center animate-in zoom-in-95 duration-200 py-2">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-emerald-400 p-0.5 mx-auto shadow-2xl shadow-yellow-500/20">
                <div className="w-full h-full bg-[#1c1611] rounded-3xl flex items-center justify-center text-4xl">
                  🎉
                </div>
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  {lang === 'fa' ? 'درود بر شما فرمانده عزیز!' : lang === 'tg' ? 'Салом бар шумо сарлашкари азиз!' : 'Welcome, Noble Commander!'}
                </span>
                
                <h3 className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-emerald-300 leading-snug">
                  {lang === 'fa' 
                    ? 'اینجا جایی است که وقتتو به تفریح می‌گذرد، آموزش می‌بینی و از مهارت‌هات تو مسابقات استفاده می‌کنی! 🌟' 
                    : lang === 'tg'
                    ? 'Инҷо ҷоест, ки вақтат бо фароғат мегузарад, таълим мегирӣ ва аз маҳоратҳоят дар мусобиқаҳо истифода мекунӣ! 🌟'
                    : 'Here is where you have fun, receive coaching, and deploy your skills in epic tournaments! 🌟'}
                </h3>

                <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
                  {lang === 'fa'
                    ? 'در همجهان شطرنج (اولین بازی اقتباس شده از شطرنج با تم اساطیری و کیمیاگری)، هم از نبردها لذت می‌بری، هم رازهای استراتژی را در آکادمی فرامی‌گیری و هم در لیگ‌های بزرگ با حریفان جوانمرد به رقابت می‌پردازی.'
                    : lang === 'tg'
                    ? 'Дар Ҷаҳоншоҳмот (аввалин бозии баргирифта аз шоҳмот бо мавзӯи асотирӣ ва кимиёгарӣ), ҳам аз набардҳо лаззат мебарӣ, ҳам ҳикмати Амир Масъуди Сомониро меомӯзӣ ва дар мусобиқаҳо медурахшӣ.'
                    : 'In Worldplay Chess (The first game adapted from chess with mythological & alchemical theme), you enjoy every move, master tactical philosophy, and shine in leagues.'}
                </p>
              </div>

              {/* Bonus Gift Box */}
              <div className="bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-amber-950/60 border border-amber-500/50 rounded-xl p-3 max-w-sm mx-auto flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🪙</span>
                  <div className="text-right">
                    <div className="font-bold text-amber-300 text-xs">
                      {lang === 'fa' ? 'هدیه ثبت‌نام واریز شد' : 'Registration Bonus Added'}
                    </div>
                    <div className="text-[10px] text-stone-400">
                      {lang === 'fa' ? 'موجودی افزوده شد به خزانه‌داری' : 'Added to Imperial Treasury'}
                    </div>
                  </div>
                </div>
                <span className="font-mono font-black text-amber-300 text-sm">
                  +100 {lang === 'fa' ? 'دریک' : 'Darics'}
                </span>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => setStep(4)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-900/30 cursor-pointer transition-all active:scale-95 inline-flex items-center justify-center gap-1.5"
                >
                  <span>{lang === 'fa' ? 'سنجش سطح شطرنج و دریافت ۵۰ دریک دیگر 🎯' : 'Skill Assessment & 50 More Darics'}</span>
                  <ChevronLeft size={16} className={isRtl ? '' : 'rotate-180'} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CHESS SKILL ASSESSMENT & DARIC REWARD */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
                  {lang === 'fa' ? 'سنجش هوشمند سطح مهارت' : lang === 'tg' ? 'Санҷиши дараҷаи маҳорат' : 'Skill Assessment'}
                </span>
                <h4 className="text-base sm:text-lg font-black text-amber-200">
                  {lang === 'fa' ? 'شما در چه سطحی از شطرنج قرار دارید؟' : 'What is your chess experience level?'}
                </h4>
                <p className="text-xs text-stone-400">
                  {lang === 'fa'
                    ? 'با پاسخ به این ۳ پرسش، هوش مصنوعی بازی حریفان مناسبی برای شما انتخاب خواهد کرد.'
                    : 'Help us calibrate your initial opponent level and strategic recommendations.'}
                </p>
              </div>

              <div className="space-y-3 bg-[#231a14] border border-[#4a3a2a] p-4 rounded-xl">
                {/* Question 1: Experience */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Trophy size={13} />
                    <span>۱. {lang === 'fa' ? 'میزان تجربه شما در شطرنج چقدر است؟' : 'Your general chess experience:'}</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'beginner', labelFa: 'مبتدی (قوانین پایه)', labelEn: 'Beginner' },
                      { id: 'intermediate', labelFa: 'متوسط (بازی‌های دورهمی)', labelEn: 'Intermediate' },
                      { id: 'advanced', labelFa: 'پیشرفته (باشگاهی و آنلاین)', labelEn: 'Advanced' },
                      { id: 'master', labelFa: 'استاد تاکتیک و مات برق‌آسا', labelEn: 'Master' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSkillLevel(opt.id)}
                        className={`p-2 rounded-lg border text-right transition-all cursor-pointer font-medium ${
                          skillLevel === opt.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                            : 'bg-[#18120e] border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        {lang === 'fa' ? opt.labelFa : opt.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 2: Tactical understanding */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Zap size={13} />
                    <span>۲. {lang === 'fa' ? 'کدام تاکتیک شطرنج برای شما جذاب‌تر است؟' : 'Preferred tactical style:'}</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'fork', labelFa: 'چنگال اسب و حملات دوگانه', labelEn: 'Knight Forks' },
                      { id: 'pin', labelFa: 'آچمزی فیل و رخ', labelEn: 'Pins & Skewers' },
                      { id: 'sacrifice', labelFa: 'فداکاری مهره برای مات سریع', labelEn: 'Queen Sacrifices' },
                      { id: 'endgame', labelFa: 'آخربازی دقیق با کارت‌های زمان', labelEn: 'Time Boosters & Endgame' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFavoriteTactic(opt.id)}
                        className={`p-2 rounded-lg border text-right transition-all cursor-pointer font-medium ${
                          favoriteTactic === opt.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                            : 'bg-[#18120e] border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        {lang === 'fa' ? opt.labelFa : opt.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 3: Play style */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Shield size={13} />
                    <span>۳. {lang === 'fa' ? 'طبع فرماندهی شما در میدان نبرد چیست؟' : 'Your command temper:'}</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'aggressive', labelFa: 'شجاع و تهاجمی (هخامنشی)', labelEn: 'Aggressive' },
                      { id: 'patient', labelFa: 'صبور و مدافع خردمند (سامانی)', labelEn: 'Strategic Defense' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPlayStyle(opt.id)}
                        className={`p-2 rounded-lg border text-right transition-all cursor-pointer font-medium ${
                          playStyle === opt.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                            : 'bg-[#18120e] border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        {lang === 'fa' ? opt.labelFa : opt.labelEn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quiz Daric Reward Banner */}
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-2.5 text-center flex items-center justify-between">
                <span className="text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <Star size={15} className="text-yellow-400" />
                  <span>{lang === 'fa' ? 'جایزه پاسخ به سنجش: ۵۰ دریک زرین' : 'Quiz Reward: 50 Golden Darics'}</span>
                </span>
                <span className="font-mono text-xs font-bold text-yellow-300">+50 Darics</span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-3 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer"
                >
                  {lang === 'fa' ? 'بازگشت' : 'Back'}
                </button>

                <button
                  onClick={handleCompleteQuiz}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-amber-900/40 cursor-pointer transition-all active:scale-95"
                >
                  <span>{lang === 'fa' ? 'تأیید سنجش و دریافت جایزه ⬅️' : 'Save & Choose Mode ⬅️'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: CHOOSE YOUR GAME PATH (بات / دونفره / لیگ / آموزش / نبردهای داستانی) */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
                  {lang === 'fa' ? 'انتخاب مسیر نبرد' : 'Choose Your Battle Path'}
                </span>
                <h4 className="text-base sm:text-lg font-black text-amber-200">
                  {lang === 'fa' ? 'مایلید بازی خود را چگونه آغاز فرمایید؟' : 'How would you like to begin?'}
                </h4>
                <p className="text-xs text-stone-400">
                  {lang === 'fa'
                    ? 'یکی از گزینه‌های زیر را انتخاب کنید؛ هر زمان مایل باشید می‌توانید از منو به سایر بخش‌ها بروید.'
                    : 'Select your preferred entry mode. You can switch between all modes anytime.'}
                </p>
              </div>

              {/* Fair Play Pact Banner */}
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-2.5 flex items-center justify-between text-xs">
                <span className="text-emerald-300 flex items-center gap-1.5 text-[11px] sm:text-xs">
                  <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0" />
                  <span>
                    {lang === 'fa' 
                      ? 'سوگند بازی جوانمردانه (Fair Play): نبردها پاک، بدون هوش مصنوعی و بر پایه شرافت است.'
                      : 'Fair Play Protocol: All matches are played purely by human intellect without AI engines.'}
                  </span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold whitespace-nowrap">
                  Anti-Cheat 🛡️
                </span>
              </div>

              <div className="space-y-2.5">
                {/* 1. Play vs Bot */}
                <button
                  onClick={() => handleFinishOnboarding(onStartVsBot)}
                  className="w-full p-3 rounded-xl bg-[#231a14] hover:bg-[#2e2118] border border-amber-500/40 hover:border-amber-400 text-right flex items-center justify-between gap-3 shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 group-hover:scale-105 transition-transform">
                      <Bot size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-amber-200 text-xs sm:text-sm">
                        {lang === 'fa' ? '۱. نبرد با فرمانده هوش مصنوعی (Play vs Bot)' : '1. Play against AI Bot'}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {lang === 'fa' ? 'رویارویی با هوش مصنوعی منطبق با سطح سنجش شما' : 'Smart tactical bot tuned to your rating'}
                      </div>
                    </div>
                  </div>
                  <ChevronLeft size={18} className={`text-amber-400 ${isRtl ? '' : 'rotate-180'}`} />
                </button>

                {/* 2. Pass & Play Local */}
                <button
                  onClick={() => handleFinishOnboarding(onStartPassAndPlay)}
                  className="w-full p-3 rounded-xl bg-[#231a14] hover:bg-[#2e2118] border border-stone-700 hover:border-amber-400 text-right flex items-center justify-between gap-3 shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 group-hover:scale-105 transition-transform">
                      <Users size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-blue-200 text-xs sm:text-sm">
                        {lang === 'fa' ? '۲. بازی دو نفره روی یک گوشی (Pass & Play)' : '2. Two Players on One Screen'}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {lang === 'fa' ? 'نبرد نوبتی رو در رو با دوستان و اعضای خانواده' : 'Turn-based head-to-head match'}
                      </div>
                    </div>
                  </div>
                  <ChevronLeft size={18} className={`text-stone-400 ${isRtl ? '' : 'rotate-180'}`} />
                </button>

                {/* 3. Join Imperial League */}
                <button
                  onClick={() => handleFinishOnboarding(onOpenLeague)}
                  className="w-full p-3 rounded-xl bg-[#231a14] hover:bg-[#2e2118] border border-stone-700 hover:border-amber-400 text-right flex items-center justify-between gap-3 shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 group-hover:scale-105 transition-transform">
                      <Trophy size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-purple-200 text-xs sm:text-sm">
                        {lang === 'fa' ? '۳. ورود به لیگ‌های اساطیری (Imperial Leagues)' : '3. Imperial League Tournaments'}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {lang === 'fa' ? 'ارتقای ریتینگ، کسب نشان‌های افتخار و رتبه‌بندی' : 'Climb rating tiers & earn medals'}
                      </div>
                    </div>
                  </div>
                  <ChevronLeft size={18} className={`text-stone-400 ${isRtl ? '' : 'rotate-180'}`} />
                </button>

                {/* 4. Academy & Training */}
                <button
                  onClick={() => handleFinishOnboarding(onOpenAcademy)}
                  className="w-full p-3 rounded-xl bg-[#231a14] hover:bg-[#2e2118] border border-stone-700 hover:border-amber-400 text-right flex items-center justify-between gap-3 shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 group-hover:scale-105 transition-transform">
                      <BookOpen size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-emerald-200 text-xs sm:text-sm">
                        {lang === 'fa' ? '۴. آکادمی و آموزش شطرنج (Academy & Training)' : '4. Academy & Wisdom of Chatrang'}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {lang === 'fa' ? 'آموزش ترفندهای تاکتیکی، مات خفه‌کن و فلسفه چترنگ' : 'Master tactics, non-violent strategy & lore'}
                      </div>
                    </div>
                  </div>
                  <ChevronLeft size={18} className={`text-stone-400 ${isRtl ? '' : 'rotate-180'}`} />
                </button>

                {/* 5. Story Battles */}
                <button
                  onClick={() => handleFinishOnboarding(onOpenCampaign)}
                  className="w-full p-3 rounded-xl bg-[#231a14] hover:bg-[#2e2118] border border-rose-500/40 hover:border-rose-400 text-right flex items-center justify-between gap-3 shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 group-hover:scale-105 transition-transform">
                      <Swords size={22} />
                    </div>
                    <div>
                      <div className="font-bold text-rose-200 text-xs sm:text-sm">
                        {lang === 'fa' ? '۵. نبردهای داستانی اساطیر (Story Battles)' : '5. Mythic Campaign & Scenarios'}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {lang === 'fa' ? 'سناریوهای تاریخی امیر مسعود سامانی، کوروش و اکبر شاه' : 'Historical puzzles of Samanids & Cyrus'}
                      </div>
                    </div>
                  </div>
                  <ChevronLeft size={18} className={`text-stone-400 ${isRtl ? '' : 'rotate-180'}`} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
