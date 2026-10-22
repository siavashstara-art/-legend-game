import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Users,
  Calendar,
  Gift,
  Share2,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Flame,
  Clock,
  MapPin,
  FileText,
  X,
  Mail,
  Award,
  ExternalLink,
  ChevronRight,
  Landmark,
  Coins,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playVictoryFanfare, playBoosterSound } from '../utils/audio.ts';
import { Language, TranslationDictionary } from '../types/chess.ts';

interface GoogleUser {
  email: string;
  name: string;
  avatar: string;
  referralCode: string;
  chessRating: number;
  chessXP: number;
  loyaltyEXP: number;
  activeMinutes: number;
  streakDays: number;
  referralsCount: number;
  isTrustee: boolean;
  tier: string;
  tierNameFa: string;
  badge: string;
}

interface AmbassadorItem {
  id: string;
  name: string;
  referralsCount: number;
  streakDays: number;
  loyaltyPoints: number;
  tier: string;
  tierNameFa: string;
  badge: string;
  isTrustee: boolean;
  ableCityParcelId: string;
  ableCityDistrict: string;
}

interface TrusteeItem {
  role: string;
  titleEn: string;
  name: string;
  reasonFa: string;
  reasonEn: string;
  badge: string;
  landParcel: string;
}

interface AmbassadorLoyaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerRating: number;
  playerXP: number;
  playerName: string;
  coins: number;
  onAddCoins: (amount: number) => void;
  lang: Language;
  t: TranslationDictionary;
  activePresenceSeconds: number;
}

export const AmbassadorLoyaltyModal: React.FC<AmbassadorLoyaltyModalProps> = ({
  isOpen,
  onClose,
  playerRating,
  playerXP,
  playerName,
  coins,
  onAddCoins,
  lang,
  t,
  activePresenceSeconds
}) => {
  type TabType = 'overview' | 'daily' | 'referrals' | 'trustees' | 'able_city' | 'profile';
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Google account state
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => {
    try {
      const saved = localStorage.getItem('worldplay_google_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Local Loyalty EXP and active minutes
  const [loyaltyEXP, setLoyaltyEXP] = useState<number>(() => {
    return parseInt(localStorage.getItem('worldplay_loyalty_exp') || '1200', 10);
  });
  const [activeMinutes, setActiveMinutes] = useState<number>(() => {
    return parseInt(localStorage.getItem('worldplay_active_minutes') || '45', 10);
  });
  const [referralsCount, setReferralsCount] = useState<number>(() => {
    return parseInt(localStorage.getItem('worldplay_referrals_count') || '3', 10);
  });
  const [referralCode, setReferralCode] = useState<string>(() => {
    return localStorage.getItem('worldplay_referral_code') || `HAM-PARS-7842`;
  });
  const [streakDays, setStreakDays] = useState<number>(() => {
    return parseInt(localStorage.getItem('worldplay_streak_days') || '3', 10);
  });
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(() => {
    const today = new Date().toISOString().slice(0, 10);
    return localStorage.getItem('worldplay_last_checkin_date') === today;
  });

  // Server state
  const [ambassadorsList, setAmbassadorsList] = useState<AmbassadorItem[]>([]);
  const [trusteesList, setTrusteesList] = useState<TrusteeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [friendCodeInput, setFriendCodeInput] = useState<string>('');
  const [friendCodeMsg, setFriendCodeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Registration modal states
  const [regEmail, setRegEmail] = useState<string>('');
  const [regName, setRegName] = useState<string>('');
  const [regInviter, setRegInviter] = useState<string>('');
  const [showRegForm, setShowRegForm] = useState<boolean>(false);

  // Sync with server when opened
  useEffect(() => {
    if (!isOpen) return;

    fetch('/api/loyalty/leaderboard')
      .then(r => r.json())
      .then(data => {
        if (data.ambassadors) setAmbassadorsList(data.ambassadors);
        if (data.trustees) setTrusteesList(data.trustees);
      })
      .catch(() => {});

    const email = googleUser?.email || '';
    fetch(`/api/loyalty/status?email=${encodeURIComponent(email)}&playerName=${encodeURIComponent(playerName)}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          if (data.referralCode) {
            setReferralCode(data.referralCode);
            localStorage.setItem('worldplay_referral_code', data.referralCode);
          }
          if (typeof data.loyaltyPoints === 'number') {
            setLoyaltyEXP(data.loyaltyPoints);
            localStorage.setItem('worldplay_loyalty_exp', String(data.loyaltyPoints));
          }
          if (typeof data.referralsCount === 'number') {
            setReferralsCount(data.referralsCount);
            localStorage.setItem('worldplay_referrals_count', String(data.referralsCount));
          }
          if (typeof data.streakDays === 'number') {
            setStreakDays(data.streakDays);
            localStorage.setItem('worldplay_streak_days', String(data.streakDays));
          }
          if (typeof data.activeMinutes === 'number') {
            setActiveMinutes(data.activeMinutes);
            localStorage.setItem('worldplay_active_minutes', String(data.activeMinutes));
          }
          setHasCheckedInToday(!data.canCheckinToday);
        }
      })
      .catch(() => {});
  }, [isOpen, googleUser, playerName]);

  if (!isOpen) return null;

  // Determine ambassador tier
  const getTier = (exp: number, refs: number) => {
    if (exp >= 25000 || refs >= 70) return { titleFa: 'ارکان عالی همجهان', titleEn: 'Supreme Pillar', badge: '👑', isTrustee: true };
    if (exp >= 15000 || refs >= 40) return { titleFa: 'وزیر وفاداری', titleEn: 'Minister of Loyalty', badge: '💎', isTrustee: true };
    if (exp >= 7000 || refs >= 20) return { titleFa: 'سفیر ارشد تمدن', titleEn: 'Senior Ambassador', badge: '🎖️', isTrustee: true };
    if (exp >= 2500 || refs >= 8) return { titleFa: 'یاور تمدن', titleEn: 'Civilization Benefactor', badge: '🌟', isTrustee: false };
    return { titleFa: 'سفیر صلح و دوستی', titleEn: 'Peace Ambassador', badge: '🕊️', isTrustee: false };
  };

  const currentTier = getTier(loyaltyEXP, referralsCount);
  const isTrusteeMember = currentTier.isTrustee || loyaltyEXP >= 5000 || referralsCount >= 10 || playerRating >= 2100;

  // Handle Google / Gmail registration
  const handleGoogleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regEmail.includes('@')) {
      alert(lang === 'fa' ? 'لطفاً یک آدرس جیمیل معتبر وارد کنید' : 'Please provide a valid Gmail address');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/google-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: regEmail,
          name: regName || regEmail.split('@')[0],
          avatar: '👑',
          inviterCode: regInviter
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setGoogleUser(data.user);
        localStorage.setItem('worldplay_google_user', JSON.stringify(data.user));
        setReferralCode(data.user.referralCode);
        localStorage.setItem('worldplay_referral_code', data.user.referralCode);
        setLoyaltyEXP(data.user.loyaltyEXP);
        localStorage.setItem('worldplay_loyalty_exp', String(data.user.loyaltyEXP));
        onAddCoins(150); // Welcome bonus darics

        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          playVictoryFanfare();
        } catch {}

        setShowRegForm(false);
      } else {
        alert(data.error || 'خطا در ثبت‌نام با جیمیل');
      }
    } catch {
      alert('خطای اتصال به سرور');
    } finally {
      setLoading(false);
    }
  };

  // Handle Daily Check-in
  const handleDailyCheckin = async () => {
    if (hasCheckedInToday) return;

    setLoading(true);
    try {
      const res = await fetch('/api/loyalty/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: googleUser?.email || 'player_default',
          playerName: googleUser?.name || playerName
        })
      });
      const data = await res.json();

      if (data.success) {
        const today = new Date().toISOString().slice(0, 10);
        localStorage.setItem('worldplay_last_checkin_date', today);
        setHasCheckedInToday(true);
        setStreakDays(data.streak);
        localStorage.setItem('worldplay_streak_days', String(data.streak));

        const updatedEXP = loyaltyEXP + data.rewardPoints;
        setLoyaltyEXP(updatedEXP);
        localStorage.setItem('worldplay_loyalty_exp', String(updatedEXP));

        onAddCoins(data.rewardCoins);

        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.55 },
            colors: ['#f59e0b', '#10b981', '#38bdf8', '#fbbf24']
          });
          playVictoryFanfare();
        } catch {}
      } else {
        alert(data.errorFa || data.errorEn || 'خطا در ثبت حضور');
      }
    } catch {
      alert('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  // Handle Friend Referral Code Submission
  const handleSubmitFriendCode = async () => {
    if (!friendCodeInput.trim()) return;

    setLoading(true);
    setFriendCodeMsg(null);
    try {
      const res = await fetch('/api/loyalty/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: googleUser?.email || 'player_default',
          action: 'submit_friend_code',
          friendCode: friendCodeInput.trim()
        })
      });
      const data = await res.json();

      if (data.success) {
        setFriendCodeMsg({ type: 'success', text: data.messageFa });
        const updated = loyaltyEXP + (data.rewardPoints || 400);
        setLoyaltyEXP(updated);
        localStorage.setItem('worldplay_loyalty_exp', String(updated));
        onAddCoins(data.rewardCoins || 100);
        setFriendCodeInput('');
        try {
          confetti({ particleCount: 60, spread: 50 });
          playBoosterSound();
        } catch {}
      } else {
        setFriendCodeMsg({ type: 'error', text: data.errorFa || 'کد نامعتبر است' });
      }
    } catch {
      setFriendCodeMsg({ type: 'error', text: 'خطا در ارتباط با سرور' });
    } finally {
      setLoading(false);
    }
  };

  // Copy referral code or link
  const copyCode = () => {
    navigator.clipboard?.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyShareLink = () => {
    const link = `https://worldplay.app/?ref=${referralCode}`;
    navigator.clipboard?.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Seconds into current active minute
  const secondsInCurrentMinute = activePresenceSeconds % 60;
  const progressPercent = Math.min(100, Math.floor((secondsInCurrentMinute / 60) * 100));

  const inviteShareText = `👑 به همجهان شطرنج (Worldplay) بپیوندید و با کد معرف من [${referralCode}] ۱۰۰ دریک زرین + ۴۰۰ امتیاز وفاداری هدیه بگیرید و زمین رایگان در شهر توانا (Able City) دریافت کنید!`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#1b1511] border-2 border-[#d4af37] rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-stone-100">
        
        {/* Top Header Banner */}
        <div className="p-4 sm:p-5 border-b border-[#5a4630] bg-gradient-to-r from-[#2a1d13] via-[#352516] to-[#201710] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-2xl shadow-inner text-[#f0c04a]">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-[#f0c04a] tracking-wide">
                  {lang === 'fa' ? 'لیگ معرفان و وفاداران • شهر توانا' : 'Ambassador & Loyalty League • Able City'}
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                  {lang === 'fa' ? 'رسمی همجهان' : 'Official'}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {lang === 'fa'
                  ? 'کسب EXP از معرفی دوستان، حضور روزانه و هر دقیقه ماندن در بازی • عضویت هیئت امنا و قول اهدای زمین در شهر مجازی توانا'
                  : 'Earn EXP via referrals, daily check-ins & minutes of presence • Board of Trustees & Able City Virtual Land Pledge'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#2a221a] hover:bg-[#3a3026] text-stone-300 transition-colors cursor-pointer border border-stone-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dual-Point System Hero Ribbon (Two Distinct Ratings) */}
        <div className="bg-[#241c16] border-b border-[#5a4630] px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* 1. Chess League Rating & XP */}
          <div className="p-2.5 rounded-xl bg-[#1b1511] border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">♟️</span>
              <div>
                <span className="text-[10px] text-stone-400 font-bold block uppercase">
                  {lang === 'fa' ? '۱. امتیاز و ریتینگ لیگ شطرنج' : '1. Chess League ELO & XP'}
                </span>
                <span className="text-xs text-stone-300 font-medium">
                  {lang === 'fa' ? 'مهارت و پیروزی‌های بازی' : 'Tactics & Match Wins'}
                </span>
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-sm font-black text-amber-400">{playerRating} <span className="text-[10px] font-sans">ELO</span></div>
              <div className="text-[10px] text-stone-400">{playerXP} XP</div>
            </div>
          </div>

          {/* 2. Ambassador & Loyalty EXP */}
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-[#1b1511] border border-emerald-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentTier.badge}</span>
              <div>
                <span className="text-[10px] text-emerald-400 font-bold block uppercase">
                  {lang === 'fa' ? '۲. امتیاز لیگ معرفان (EXP)' : '2. Ambassador EXP'}
                </span>
                <span className="text-xs text-stone-200 font-bold">
                  {currentTier.titleFa}
                </span>
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-sm font-black text-emerald-300">{loyaltyEXP.toLocaleString()} <span className="text-[10px] font-sans">EXP</span></div>
              <div className="text-[10px] text-amber-400 font-sans">{referralsCount} {lang === 'fa' ? 'معرفی' : 'invites'}</div>
            </div>
          </div>

          {/* Live Presence Minutes Ticker: 1 Min = 1 EXP */}
          <div className="p-2.5 rounded-xl bg-[#1b1511] border border-sky-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-lg bg-sky-950/60 border border-sky-500/40 flex items-center justify-center text-sky-400">
                <Clock size={16} className="animate-spin-slow" />
              </div>
              <div>
                <span className="text-[10px] text-sky-400 font-bold block uppercase">
                  {lang === 'fa' ? 'هر ۱ دقیقه حضور = ۱ EXP' : '1 Min Presence = 1 EXP'}
                </span>
                <span className="text-xs text-stone-300">
                  {activeMinutes} {lang === 'fa' ? 'دقیقه حضور فعال' : 'active mins'}
                </span>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs font-bold text-sky-300">+{activeMinutes} EXP</span>
              <div className="w-16 bg-stone-800 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className="bg-sky-400 h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#5a4630] bg-[#1e1713] overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#f0c04a] text-[#f0c04a] bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Trophy size={15} />
            <span>{lang === 'fa' ? 'لیگ معرفان و جدول رده‌بندی' : 'Ambassador Leaderboard'}</span>
          </button>

          <button
            onClick={() => setActiveTab('daily')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'daily'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Calendar size={15} />
            <span>{lang === 'fa' ? 'حضور روزانه (استریک)' : 'Daily Check-in Streak'}</span>
            {!hasCheckedInToday && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('referrals')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'referrals'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Share2 size={15} />
            <span>{lang === 'fa' ? 'کد معرف و دعوت دوستان' : 'Referral Code & Invites'}</span>
          </button>

          <button
            onClick={() => setActiveTab('trustees')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'trustees'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Landmark size={15} />
            <span>{lang === 'fa' ? 'شورای عالی هیئت امنا' : 'Honorary Board of Trustees'}</span>
          </button>

          <button
            onClick={() => setActiveTab('able_city')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'able_city'
                ? 'border-sky-400 text-sky-300 bg-sky-500/10'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <MapPin size={15} />
            <span>{lang === 'fa' ? 'قول اهدای زمین مجازی شهر توانا' : 'Able City Virtual Land Pledge'}</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-purple-400 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Mail size={15} />
            <span>
              {googleUser
                ? (lang === 'fa' ? 'پروفایل جیمیل' : 'Gmail Profile')
                : (lang === 'fa' ? 'ثبت‌نام با جیمیل' : 'Sign in with Gmail')}
            </span>
          </button>
        </div>

        {/* Tab Body Contents */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-stone-200">
          
          {/* ================= TAB 1: OVERVIEW & AMBASSADOR LEAGUE ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Introduction Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#271d15] to-amber-950/20 border border-[#d4af37]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🏛️</div>
                  <div>
                    <h3 className="font-extrabold text-amber-300 text-sm">
                      {lang === 'fa' ? 'دیوان لیگ معرفان و وفاداران همجهان' : 'Worldplay Ambassador & Loyalty Order'}
                    </h3>
                    <p className="text-xs text-stone-300 mt-1 max-w-xl leading-relaxed">
                      {lang === 'fa'
                        ? 'افراد به ازای معرفی دوستان، حضور روزانه و هر دقیقه حضور فعال در بازی امتیاز EXP دریافت می‌کنند. صدرنشینان این لیگ در کنار قهرمانان شطرنج، به عضویت هیئت امنا منصوب شده و قول اهدای زمین در شهر کاملاً مجازی توانا (Able City) را دریافت می‌کنند!'
                        : 'Earn EXP by inviting friends, daily logins, and every minute active in the app. Top leaders unite with chess masters on the Board of Trustees with a pledge of virtual land in the digital Able City!'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('referrals')}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-stone-900 font-extrabold text-xs shadow-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                >
                  <Share2 size={15} />
                  <span>{lang === 'fa' ? 'دریافت کد و معرفی دوستان' : 'Get Referral Code'}</span>
                </button>
              </div>

              {/* Ambassador Leaderboard Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-amber-300 text-xs uppercase flex items-center gap-1.5">
                    <Flame size={15} />
                    <span>{lang === 'fa' ? 'رده‌بندی صدرنشینان لیگ معرفان و وفاداران' : 'Ambassador League Top Leaders'}</span>
                  </h4>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {lang === 'fa' ? 'بر اساس مجموع امتیاز تجربه (EXP)' : 'Ranked by Total Loyalty EXP'}
                  </span>
                </div>

                <div className="bg-[#17120e] border border-[#5a4630]/50 rounded-2xl overflow-hidden shadow-inner">
                  <div className="grid grid-cols-12 gap-2 p-3 text-[10px] font-bold text-stone-400 uppercase border-b border-stone-800 bg-[#221a14]">
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-4 sm:col-span-5">{lang === 'fa' ? 'سفیر / یاور' : 'Ambassador'}</div>
                    <div className="col-span-2 text-center">{lang === 'fa' ? 'معرفی‌ها' : 'Invites'}</div>
                    <div className="col-span-2 text-center">{lang === 'fa' ? 'استریک' : 'Streak'}</div>
                    <div className="col-span-3 sm:col-span-2 text-right">{lang === 'fa' ? 'مجموع EXP' : 'Total EXP'}</div>
                  </div>

                  <div className="divide-y divide-stone-800/60 font-mono text-xs">
                    {ambassadorsList.map((amb, idx) => (
                      <div
                        key={amb.id}
                        className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-[#251e18] transition-colors"
                      >
                        <div className="col-span-1 text-center font-bold text-stone-400">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                        </div>
                        <div className="col-span-4 sm:col-span-5 flex items-center gap-2 truncate">
                          <span className="text-base">{amb.badge}</span>
                          <div>
                            <span className="font-sans font-extrabold text-stone-100 block truncate">
                              {amb.name}
                            </span>
                            <span className="font-sans text-[10px] text-amber-400/90 flex items-center gap-1">
                              {amb.tierNameFa}
                              {amb.isTrustee && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                                  {lang === 'fa' ? 'هیئت امنا' : 'Trustee'}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-2 text-center font-bold text-stone-300">
                          {amb.referralsCount} 👤
                        </div>
                        <div className="col-span-2 text-center text-orange-400 font-bold">
                          {amb.streakDays} {lang === 'fa' ? 'روز' : 'd'} 🔥
                        </div>
                        <div className="col-span-3 sm:col-span-2 text-right font-black text-emerald-400">
                          {amb.loyaltyPoints.toLocaleString()} <span className="text-[10px] font-sans">EXP</span>
                        </div>
                      </div>
                    ))}

                    {/* Current User Row */}
                    <div className="grid grid-cols-12 gap-2 p-3 items-center bg-amber-500/10 border-t-2 border-amber-500/40 font-mono">
                      <div className="col-span-1 text-center font-bold text-amber-400">
                        ⭐
                      </div>
                      <div className="col-span-4 sm:col-span-5 flex items-center gap-2 truncate">
                        <span className="text-base">{currentTier.badge}</span>
                        <div>
                          <span className="font-sans font-extrabold text-amber-300 block truncate">
                            {googleUser?.name || playerName} ({lang === 'fa' ? 'شما' : 'You'})
                          </span>
                          <span className="font-sans text-[10px] text-amber-300/80">
                            {currentTier.titleFa}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-2 text-center font-bold text-amber-300">
                        {referralsCount} 👤
                      </div>
                      <div className="col-span-2 text-center text-orange-400 font-bold">
                        {streakDays} {lang === 'fa' ? 'روز' : 'd'} 🔥
                      </div>
                      <div className="col-span-3 sm:col-span-2 text-right font-black text-emerald-300">
                        {loyaltyEXP.toLocaleString()} <span className="text-[10px] font-sans">EXP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: DAILY CHECK-IN STREAK ================= */}
          {activeTab === 'daily' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#1f1913] to-emerald-950/30 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-2xl text-emerald-300">
                    🔥
                  </div>
                  <div>
                    <h3 className="font-black text-emerald-300 text-sm">
                      {lang === 'fa' ? 'استریک حضور روزانه شما' : 'Your Daily Check-in Streak'}
                    </h3>
                    <p className="text-xs text-stone-300 mt-0.5">
                      {lang === 'fa'
                        ? `شما ${streakDays} روز متوالی در همجهان حضور یافته‌اید! هر روز با ورود به برنامه امتیاز EXP و دریک زرین هدیه بگیرید.`
                        : `You have logged in ${streakDays} consecutive days! Claim daily EXP and Golden Darics.`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDailyCheckin}
                  disabled={hasCheckedInToday || loading}
                  className={`py-3 px-6 rounded-2xl font-black text-xs transition-all shadow-lg cursor-pointer flex items-center gap-2 ${
                    hasCheckedInToday
                      ? 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-stone-900 border border-emerald-400 animate-pulse'
                  }`}
                >
                  <Sparkles size={16} />
                  <span>
                    {hasCheckedInToday
                      ? (lang === 'fa' ? '✓ پاداش امروز دریافت شد' : '✓ Claimed for Today')
                      : (lang === 'fa' ? 'ثبت حضور امروز و دریافت پاداش' : 'Check-in Today & Claim')}
                  </span>
                </button>
              </div>

              {/* 7-Day Cycle Grid */}
              <div>
                <h4 className="font-bold text-amber-300 text-xs uppercase mb-3 flex items-center gap-1.5">
                  <Calendar size={15} />
                  <span>{lang === 'fa' ? 'چرخه پاداش هفت‌روزه حضور متوالی' : '7-Day Consecutive Attendance Calendar'}</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                  {[
                    { day: 1, exp: 100, darics: 20, icon: '🌟' },
                    { day: 2, exp: 150, darics: 30, icon: '🛡️' },
                    { day: 3, exp: 200, darics: 40, icon: '⚔️' },
                    { day: 4, exp: 250, darics: 50, icon: '🏛️' },
                    { day: 5, exp: 300, darics: 65, icon: '💎' },
                    { day: 6, exp: 400, darics: 80, icon: '👑' },
                    { day: 7, exp: 600, darics: 150, icon: '🎁', grand: true }
                  ].map((d) => {
                    const currentDayCycle = ((streakDays - 1) % 7) + 1;
                    const isCompleted = d.day < currentDayCycle || (d.day === currentDayCycle && hasCheckedInToday);
                    const isToday = d.day === currentDayCycle;

                    return (
                      <div
                        key={d.day}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          d.grand
                            ? 'border-amber-400 bg-gradient-to-b from-amber-950/60 to-yellow-950/30 ring-1 ring-amber-400/50'
                            : isToday
                            ? 'border-emerald-400 bg-emerald-950/40 ring-2 ring-emerald-400/50'
                            : isCompleted
                            ? 'border-stone-700 bg-stone-900/80 opacity-90'
                            : 'border-stone-800 bg-[#1d1611]'
                        }`}
                      >
                        <div className="text-xs font-extrabold text-stone-400 mb-1">
                          {lang === 'fa' ? `روز ${d.day}` : `Day ${d.day}`}
                        </div>
                        <div className="text-2xl my-1">{d.icon}</div>
                        <div className="text-xs font-black text-emerald-400">+{d.exp} EXP</div>
                        <div className="text-[11px] font-mono text-amber-300">+{d.darics} دریک</div>

                        <div className="mt-2 text-[10px] font-bold">
                          {isCompleted ? (
                            <span className="text-emerald-400 flex items-center justify-center gap-1">
                              <Check size={12} /> {lang === 'fa' ? 'دریافت شد' : 'Claimed'}
                            </span>
                          ) : isToday ? (
                            <span className="text-emerald-300 animate-pulse">
                              {lang === 'fa' ? 'نوبت امروز' : 'Today'}
                            </span>
                          ) : (
                            <span className="text-stone-500">{lang === 'fa' ? 'قفل' : 'Locked'}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Presence Rule Card */}
              <div className="p-4 rounded-2xl bg-[#17120e] border border-sky-500/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">⏱️</div>
                  <div>
                    <h5 className="font-extrabold text-sky-300 text-xs">
                      {lang === 'fa' ? 'پاداش حضور فعال پیوسته در برنامه' : 'Active Continuous In-App Time Reward'}
                    </h5>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {lang === 'fa'
                        ? 'به ازای هر ۱ دقیقه حضور شما در محیط برنامه، دقیقاً ۱ EXP به رده‌بندی لیگ معرفان شما افزوده می‌شود.'
                        : 'Every 1 minute of active app presence awards 1 EXP to your Ambassador League standing.'}
                    </p>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs text-stone-400">{lang === 'fa' ? 'پیشرفت ثانیه:' : 'Minute tick:'}</span>
                  <div className="text-sm font-bold text-sky-400">{secondsInCurrentMinute}s / 60s</div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: REFERRALS & INVITE HUB ================= */}
          {activeTab === 'referrals' && (
            <div className="space-y-6">
              {/* Referral Code Share Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#271d15] to-[#1f1712] border-2 border-[#d4af37]/60 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-extrabold text-amber-300 uppercase block">
                      {lang === 'fa' ? 'کد معرف اختصاصی شما (پیوسته به جیمیل)' : 'Your Exclusive Referral Code'}
                    </span>
                    <p className="text-xs text-stone-300 mt-0.5">
                      {lang === 'fa'
                        ? 'به ازای هر دوستی که با این کد وارد شود، ۵۰۰ EXP معرف + ۱۰۰ دریک زرین دریافت کنید.'
                        : 'Earn 500 Ambassador EXP + 100 Darics for every friend who joins.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400 font-mono">
                      {referralsCount} {lang === 'fa' ? 'معرفی موفق' : 'successful invites'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex-1 w-full bg-[#130f0c] border border-amber-500/50 rounded-2xl p-3 flex items-center justify-between px-4">
                    <span className="text-base sm:text-lg font-black font-mono tracking-widest text-[#f0c04a]">
                      {referralCode}
                    </span>
                    <button
                      onClick={copyCode}
                      className="py-1.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-amber-400/40"
                    >
                      {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedCode ? (lang === 'fa' ? 'کپی شد' : 'Copied') : (lang === 'fa' ? 'کپی کد' : 'Copy Code')}</span>
                    </button>
                  </div>

                  <button
                    onClick={copyShareLink}
                    className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-stone-900 font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Share2 size={16} />
                    <span>{copiedLink ? (lang === 'fa' ? 'پیوند کپی شد!' : 'Link Copied!') : (lang === 'fa' ? 'کپی پیوند دعوت' : 'Copy Invite Link')}</span>
                  </button>
                </div>

                {/* Social Share Shortcuts */}
                <div className="pt-2 border-t border-stone-800 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-stone-400 text-[11px]">
                    {lang === 'fa' ? 'اشتراک‌گذاری در پیام‌رسان‌ها:' : 'Share via:'}
                  </span>
                  
                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(`https://worldplay.app/?ref=${referralCode}`)}&text=${encodeURIComponent(inviteShareText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1 px-3 rounded-lg bg-sky-900/40 hover:bg-sky-900/60 border border-sky-500/40 text-sky-300 font-bold transition-colors"
                  >
                    تلگرام (Telegram)
                  </a>

                  {/* Eitaa */}
                  <a
                    href={`https://eitaa.com/share/url?url=${encodeURIComponent(`https://worldplay.app/?ref=${referralCode}`)}&text=${encodeURIComponent(inviteShareText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1 px-3 rounded-lg bg-orange-950/60 hover:bg-orange-900/60 border border-orange-500/40 text-orange-300 font-bold transition-colors"
                  >
                    ایتا (Eitaa)
                  </a>

                  {/* Bale */}
                  <a
                    href={`https://ble.ir/share/url?url=${encodeURIComponent(`https://worldplay.app/?ref=${referralCode}`)}&text=${encodeURIComponent(inviteShareText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1 px-3 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-bold transition-colors"
                  >
                    بله (Bale)
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(inviteShareText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1 px-3 rounded-lg bg-green-950/60 hover:bg-green-900/60 border border-green-500/40 text-green-300 font-bold transition-colors"
                  >
                    واتساپ (WhatsApp)
                  </a>
                </div>
              </div>

              {/* Submit Inviter Code */}
              <div className="p-4 rounded-2xl bg-[#19130f] border border-stone-800 space-y-3">
                <h4 className="font-extrabold text-amber-300 text-xs flex items-center gap-1.5">
                  <Gift size={15} />
                  <span>{lang === 'fa' ? 'ثبت کد معرف دوست شما (دریافت ۴۰۰ EXP هدیه + ۱۰۰ دریک)' : 'Redeem a Friend’s Referral Code'}</span>
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={friendCodeInput}
                    onChange={(e) => setFriendCodeInput(e.target.value)}
                    placeholder={lang === 'fa' ? 'مثال: HAM-MITRA-9412' : 'e.g. HAM-MITRA-9412'}
                    className="flex-1 bg-[#120d0a] border border-stone-700 rounded-xl px-3 py-2 text-xs font-mono text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleSubmitFriendCode}
                    disabled={loading || !friendCodeInput.trim()}
                    className="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-stone-800 disabled:text-stone-600 text-stone-900 font-bold text-xs transition-colors cursor-pointer"
                  >
                    {lang === 'fa' ? 'ثبت و دریافت پاداش' : 'Redeem Bonus'}
                  </button>
                </div>

                {friendCodeMsg && (
                  <div
                    className={`p-2 rounded-xl text-xs font-bold ${
                      friendCodeMsg.type === 'success'
                        ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/40'
                        : 'bg-red-950/50 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {friendCodeMsg.text}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 4: HONORARY BOARD OF TRUSTEES ================= */}
          {activeTab === 'trustees' && (
            <div className="space-y-6">
              {/* Supreme Council Decree */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/60 via-[#271d15] to-[#1c140e] border-2 border-[#d4af37] shadow-xl text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-inner">
                  👑
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#f0c04a] tracking-wider">
                  {lang === 'fa' ? 'حکم رسمی انتصاب شورای عالی و هیئت امنای همجهان' : 'Supreme Honorary Board of Trustees Council'}
                </h3>
                <p className="text-xs text-stone-300 max-w-2xl mx-auto leading-relaxed">
                  {lang === 'fa'
                    ? 'به فرمان شاهانه همجهان، ترکیبی از صدرنشینان لیگ شطرنج (استادان تاکتیک) و صدرنشینان لیگ معرفان و وفاداران، به عضویت افتخاری هیئت امنای برنامه منصوب گشته و قول اهدای قطعه زمین در شهر کاملاً مجازی توانا (Able City) به آنها تعلق می‌گیرد.'
                    : 'By imperial decree, leaders of the Chess League and top performers of the Ambassador League join the Board of Trustees with a pledge of virtual land allocation in Able City.'}
                </p>

                {/* User Status in Board of Trustees */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 font-extrabold text-xs">
                  <span>{isTrusteeMember ? '🎖️' : '⏳'}</span>
                  <span>
                    {isTrusteeMember
                      ? (lang === 'fa' ? 'شما رسماً مفتخر به عضویت در هیئت امنا شده‌اید!' : 'You are officially inducted into the Board of Trustees!')
                      : (lang === 'fa' ? `جهت انتصاب: رسیدن به ۵,۰۰۰ EXP معرفان یا ریتینگ ۲۱۰۰ شطرنج (پیشرفت شما: ${loyaltyEXP} EXP)` : `To qualify: Reach 5,000 EXP or 2100 ELO (Current: ${loyaltyEXP} EXP)`)}
                  </span>
                </div>
              </div>

              {/* Trustees Roster */}
              <div>
                <h4 className="font-bold text-amber-300 text-xs uppercase mb-3 flex items-center gap-1.5">
                  <Landmark size={15} />
                  <span>{lang === 'fa' ? 'فهرست اعضای منصوب هیئت امنا (ترکیب شطرنج و وفاداران)' : 'Appointed Board of Trustees Roster'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {trusteesList.map((tr, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#19140f] border border-[#5a4630]/60 flex items-start gap-3 hover:border-amber-400/60 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xl shrink-0">
                        {tr.badge}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-extrabold text-xs text-stone-100 truncate">{tr.name}</span>
                          <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/30">
                            {tr.landParcel}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-amber-400 mt-0.5">{tr.role}</div>
                        <p className="text-[10px] text-stone-400 mt-1 leading-normal">{tr.reasonFa}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5: ABLE CITY VIRTUAL LAND PLEDGE & ROADMAP ================= */}
          {activeTab === 'able_city' && (
            <div className="space-y-6">
              {/* Virtual Land Pledge & Twin City Header Card */}
              <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#221a14] via-[#1a140f] to-[#140f0c] border-4 border-[#d4af37] shadow-2xl space-y-5 overflow-hidden">
                {/* Visual Ambient Glow */}
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />

                <div className="flex flex-wrap items-center justify-between border-b border-[#5a4630]/60 pb-4 gap-2">
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block font-mono">ABLE CITY VIRTUAL METAVERSE</span>
                    <span className="text-xs font-black text-amber-400">قول اهدای قطعه در شهر کاملاً مجازی توانا</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-sky-950/80 border border-sky-400/50 text-sky-300 font-bold text-[11px] flex items-center gap-1.5">
                    <span>🌐</span>
                    <span>{lang === 'fa' ? 'شهر کاملاً مجازی • بدون وجود ملکی واقعی' : 'Purely Virtual World • No Physical Deed'}</span>
                  </span>
                  <div className="text-left font-mono text-[10px] text-stone-400">
                    RESERVE ID: ABLE-VIRTUAL-{referralCode}
                  </div>
                </div>

                <div className="text-center py-1">
                  <h3 className="text-lg sm:text-2xl font-black text-[#f0c04a] tracking-wide">
                    {lang === 'fa'
                      ? 'لوح تعهد و قول اهدای قطعه در شهر مجازی توانا (Able City)'
                      : 'Able City Virtual Land Grant Pledge'}
                  </h3>
                  <p className="text-xs text-stone-300 mt-2 max-w-2xl mx-auto leading-relaxed">
                    {lang === 'fa'
                      ? 'شهر توانا یک شهر کاملاً مجازی به وسعت ۱,۳۰۰,۰۰۰ متر مربع متشکل از دو شهر «همراز» و «آفرینا» است. این شهر دنیای مجازی اکوسیستم ۳۵ برنامه‌ای ماست و در عالم واقعیت وجود ملکی یا سند تک‌برگ ندارد. ما به همراهان و صدرنشینان برنامه قول داده و متعهد می‌شویم که قطعات زمین مجازی این شهر هوشمند را به صورت رایگان به آنها اهدا کنیم.'
                      : 'Able City is a 1,300,000 m² virtual metaverse comprising twin cities "Hamraz" and "Afrena", part of an ecosystem of 35 applications with no real-world land or physical deeds.'}
                  </p>
                </div>

                {/* Twin Cities Specification Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#130f0c] p-4 rounded-2xl border border-[#5a4630]/60">
                  <div className="p-3 rounded-xl bg-[#1d1611] border border-amber-500/30 text-right">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-amber-300 text-xs">شهر مجازی همراز</span>
                      <span className="text-base">🏰</span>
                    </div>
                    <div className="text-stone-300 text-[11px]">وسعت: <strong className="text-amber-400 font-mono">۶۵۰,۰۰۰ متر مربع</strong></div>
                    <div className="text-[10px] text-stone-400 mt-0.5">مرکز تمدن، تاریخ و دانشگاه شطرنج</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#1d1611] border border-amber-500/30 text-right">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-amber-300 text-xs">شهر مجازی آفرینا</span>
                      <span className="text-base">🌆</span>
                    </div>
                    <div className="text-stone-300 text-[11px]">وسعت: <strong className="text-amber-400 font-mono">۶۵۰,۰۰۰ متر مربع</strong></div>
                    <div className="text-[10px] text-stone-400 mt-0.5">پردیس فناوری، تجارت دیجیتال و ارتباطات</div>
                  </div>

                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-950/40 to-[#1d1611] border border-amber-400/50 text-right">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-emerald-300 text-xs">مجموع کل شهر توانا</span>
                      <span className="text-base">💎</span>
                    </div>
                    <div className="text-stone-200 text-[11px]">مساحت: <strong className="text-emerald-400 font-mono">۱,۳۰۰,۰۰۰ متر مربع</strong></div>
                    <div className="text-[10px] text-stone-300 mt-0.5">شامل <strong>۳۵ برنامه</strong> اکوسیستم متصل</div>
                  </div>
                </div>

                {/* 2-Phase Strategic Milestone Roadmap */}
                <div className="space-y-2 text-right">
                  <h4 className="font-extrabold text-amber-300 text-xs uppercase flex items-center gap-1.5 justify-end">
                    <span>نقشه راه و چشم‌انداز ۲ فازی توسعه شهر مجازی توانا</span>
                    <Sparkles size={14} className="text-amber-400" />
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Phase 1 */}
                    <div className="p-3.5 rounded-2xl bg-[#18130e] border border-sky-500/40 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold text-[10px] border border-sky-400/40">
                          فاز ۱: ۱۰,۰۰۰+ دانلود برنامه
                        </span>
                        <span className="text-sky-400 font-mono font-bold text-xs">Phase 1</span>
                      </div>
                      <h5 className="font-black text-stone-100 text-xs">معرفی ارز داخلی و گیم اختصاصی</h5>
                      <p className="text-[11px] text-stone-300 leading-relaxed">
                        پس از رسیدن مجموع دانلود برنامه‌ها به بیش از ۱۰,۰۰۰ نوبت، ارز داخلی اکوسیستم و گیم اولیه/داخلی برنامه رسماً معرفی و فعال خواهد شد.
                      </p>
                    </div>

                    {/* Phase 2 */}
                    <div className="p-3.5 rounded-2xl bg-[#18130e] border border-amber-500/50 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-400/40">
                          فاز ۲: ۵۰,۰۰۰+ دانلود + ۶۰٪ واگذاری زمین
                        </span>
                        <span className="text-amber-400 font-mono font-bold text-xs">Phase 2</span>
                      </div>
                      <h5 className="font-black text-stone-100 text-xs">ارز دیجیتال جهانی + گیم سه‌بعدی (3D Metaverse)</h5>
                      <p className="text-[11px] text-stone-300 leading-relaxed">
                        پس از ۵۰,۰۰۰ دانلود و واگذاری ۶۰ درصد از زمین‌های مجازی، ارز دیجیتال جهانی اکوسیستم معرفی گشته و گیم سه‌بعدی کامل شهر توانا رونمایی می‌شود.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Honest & Transparent Disclaimer */}
                <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-right text-xs flex items-start gap-2.5">
                  <span className="text-xl shrink-0 mt-0.5">🤝</span>
                  <div className="leading-relaxed text-stone-300 text-[11px]">
                    <strong className="text-amber-300 block mb-0.5 font-bold">
                      {lang === 'fa' ? 'شفافیت و صداقت کامل در تعهد به شما:' : 'Our Clear Pledge:'}
                    </strong>
                    {lang === 'fa'
                      ? 'ما هیچ ادعا یا ادعای سند تک‌برگ یا ملک واقعی در عالم دنیوی نمی‌کنیم. شهر توانا یک شهر کاملاً مجازی و شبیه‌سازی‌شده است و ما با قول صادقانه، قطعه زمین مجازی شما را در زمان راه‌اندازی گیم سه‌بعدی به شما اهدا خواهیم نمود.'
                      : 'We make no claims of physical real-estate or deeds. Able City is a purely virtual simulation where your virtual plot will be officially granted upon full metaverse launch.'}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      alert(lang === 'fa' ? 'قول و رزرو قطعه زمین مجازی شما در شهر توانا به وسعت ۵۰۰ واحد مجازی با موفقیت ثبت شد.' : 'Virtual land reservation saved to your profile.');
                    }}
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-stone-900 font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Check size={15} />
                    <span>{lang === 'fa' ? 'ثبت و دریافت لوح قول اهدای قطعه مجازی' : 'Confirm Virtual Land Reservation'}</span>
                  </button>

                  <button
                    onClick={() => {
                      alert(lang === 'fa' ? 'نقشه شماتیک شهر توانا: شهر همراز (۶۵۰ هزار م.م) و شهر آفرینا (۶۵۰ هزار م.م) - مجموع ۱.۳ میلیون متر مربع مجازی.' : 'Able City Virtual Schematic: Hamraz & Afrena Twin Cities (1.3M sqm).');
                    }}
                    className="py-2.5 px-5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs border border-stone-600 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <MapPin size={15} />
                    <span>{lang === 'fa' ? 'مشاهده نقشه دو شهر مجازی همراز و آفرینا' : 'View Twin Virtual Cities Map'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 6: GMAIL PROFILE & BINDING ================= */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {googleUser ? (
                /* Authenticated Google Profile View */
                <div className="p-6 rounded-3xl bg-[#19140f] border-2 border-emerald-500/50 space-y-4 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow-inner">
                      {googleUser.avatar || '👑'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-stone-100">{googleUser.name}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[10px] font-bold">
                          ✓ تأیید شده با جیمیل
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 font-mono mt-0.5">{googleUser.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                    <div className="p-3 rounded-xl bg-[#120d0a] border border-stone-800">
                      <span className="text-[10px] text-stone-500 block uppercase font-bold">کد معرف شما</span>
                      <span className="font-mono font-black text-amber-400">{googleUser.referralCode}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#120d0a] border border-stone-800">
                      <span className="text-[10px] text-stone-500 block uppercase font-bold">امتیاز لیگ معرفان</span>
                      <span className="font-mono font-black text-emerald-400">{loyaltyEXP} EXP</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#120d0a] border border-stone-800">
                      <span className="text-[10px] text-stone-500 block uppercase font-bold">ریتینگ شطرنج</span>
                      <span className="font-mono font-black text-amber-300">{playerRating} ELO</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#120d0a] border border-stone-800">
                      <span className="text-[10px] text-stone-500 block uppercase font-bold">دقایق حضور فعال</span>
                      <span className="font-mono font-black text-sky-400">{activeMinutes} دقیقه</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        localStorage.removeItem('worldplay_google_user');
                        setGoogleUser(null);
                      }}
                      className="text-xs text-stone-500 hover:text-red-400 transition-colors cursor-pointer underline"
                    >
                      {lang === 'fa' ? 'خروج از حساب جیمیل' : 'Sign out from Google'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Google / Gmail Sign In & Registration Form */
                <div className="p-6 rounded-3xl bg-[#19140f] border-2 border-[#d4af37]/60 space-y-5 shadow-xl max-w-xl mx-auto">
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl mb-2">
                      <Mail className="text-amber-400" size={24} />
                    </div>
                    <h3 className="text-base font-black text-[#f0c04a]">
                      {lang === 'fa' ? 'ثبت‌نام و اتصال حساب جیمیل (Gmail)' : 'Register with Google / Gmail'}
                    </h3>
                    <p className="text-xs text-stone-400 max-w-md mx-auto">
                      {lang === 'fa'
                        ? 'با ثبت جیمیل خود، یک پروفایل رسمی همجهان و یک کد معرف اختصاصی دریافت کنید و پاداش ۱۵۰ دریک زرین خوش‌آمدگویی بگیرید.'
                        : 'Connect your Gmail to receive an official profile, an exclusive referral code, and 150 Welcome Darics.'}
                    </p>
                  </div>

                  <form onSubmit={handleGoogleRegister} className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-300 mb-1">
                        {lang === 'fa' ? 'آدرس جیمیل شما (Google Email)' : 'Gmail Address'}
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full bg-[#120d0a] border border-stone-700 rounded-xl p-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-300 mb-1">
                        {lang === 'fa' ? 'نام مستعار یا نام شطرنج‌باز' : 'Player Name'}
                      </label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder={playerName || 'فرمانده_پارس'}
                        className="w-full bg-[#120d0a] border border-stone-700 rounded-xl p-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-300 mb-1">
                        {lang === 'fa' ? 'کد معرف دوست (اختیاری - دریافت ۳۰۰ EXP اضافه)' : 'Inviter Referral Code (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={regInviter}
                        onChange={(e) => setRegInviter(e.target.value)}
                        placeholder="مثال: HAM-MITRA-9412"
                        className="w-full bg-[#120d0a] border border-stone-700 rounded-xl p-2.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-stone-900 font-black text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles size={16} />
                      <span>{lang === 'fa' ? 'ثبت و اتصال با جیمیل + دریافت کد معرف' : 'Complete Registration & Get Referral Code'}</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#17120e] border-t border-[#3a3026] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-stone-400">
            <Coins size={14} className="text-amber-400" />
            <span>
              {lang === 'fa' ? 'دارایی دریک زرین شما:' : 'Your Golden Darics:'}
            </span>
            <span className="font-mono font-bold text-amber-300">{coins}</span>
          </div>

          <button
            onClick={onClose}
            className="py-2 px-6 rounded-xl bg-[#2a221a] hover:bg-[#3a3026] text-stone-200 font-bold transition-colors cursor-pointer border border-stone-700"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
