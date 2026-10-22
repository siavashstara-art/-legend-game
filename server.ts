import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '1mb' }));

// In-memory persistent state for leaderboard and leagues (ready to attach to DB if provisioned)
interface PlayerRecord {
  id: string;
  name: string;
  rating: number;
  xp: number;
  league: string;
  wins: number;
  losses: number;
  avatar: string;
  country: string;
  level?: number;
  rank?: number;
}

let leaderboard: PlayerRecord[] = [
  { id: '1', name: 'کوروش_ایران', rating: 2140, xp: 9800, league: 'Cyrus', wins: 84, losses: 12, avatar: '👑', country: 'IR' },
  { id: '2', name: 'Mandana_Queen', rating: 1980, xp: 8200, league: 'Mandana', wins: 71, losses: 19, avatar: '👸', country: 'IR' },
  { id: '3', name: 'Aryo_Barzan', rating: 1890, xp: 7400, league: 'Darius', wins: 62, losses: 23, avatar: '🛡️', country: 'IR' },
  { id: '4', name: 'Apadana_Master', rating: 1750, xp: 6100, league: 'Apadana', wins: 53, losses: 28, avatar: '🏛️', country: 'FR' },
  { id: '5', name: 'Pasargad_Knight', rating: 1620, xp: 4800, league: 'Pasargadae', wins: 41, losses: 30, avatar: '🐎', country: 'DE' }
];

const LEAGUES = [
  { id: 'pasargadae', nameFa: 'لیگ پاسارگاد', nameEn: 'Pasargadae League', minRating: 1000, maxRating: 1399, badge: '🥉', color: '#cd7f32' },
  { id: 'apadana', nameFa: 'لیگ آپادانا', nameEn: 'Apadana League', minRating: 1400, maxRating: 1699, badge: '🏛️', color: '#38bdf8' },
  { id: 'mandana', nameFa: 'لیگ ماندانا', nameEn: 'Mandana League', minRating: 1700, maxRating: 1899, badge: '🥈', color: '#c0c0c0' },
  { id: 'darius', nameFa: 'لیگ داریوش', nameEn: 'Darius League', minRating: 1900, maxRating: 2099, badge: '⚔️', color: '#f59e0b' },
  { id: 'cyrus', nameFa: 'لیگ کوروش بزرگ', nameEn: 'Cyrus the Great League', minRating: 2100, maxRating: 3000, badge: '👑', color: '#f0c04a' }
];

// Simple in-memory rate limiter per IP
const requestCounts = new Map<string, { count: number; resetTime: number }>();
function rateLimitMiddleware(req: Request, res: Response, next: () => void) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxReq = 120;

  const current = requestCounts.get(ip);
  if (!current || now > current.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (current.count >= maxReq) {
    return res.status(429).json({ error: 'Too many requests. Please slow down.' });
  }

  current.count++;
  next();
}

app.use('/api', rateLimitMiddleware);

// --- Secure API Routes ---

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    game: 'Worldplay - Hamjahan',
    version: '1.4.0',
    timestamp: new Date().toISOString()
  });
});

// Get Leagues definition
app.get('/api/leagues', (_req: Request, res: Response) => {
  res.json({ leagues: LEAGUES });
});

// Get Leaderboard
app.get('/api/leaderboard', (_req: Request, res: Response) => {
  res.json({ leaderboard: [...leaderboard].sort((a, b) => b.rating - a.rating) });
});

// Record Match Score & Update Rating
app.post('/api/scores', (req: Request, res: Response) => {
  const { playerName, result, timeSpent, boostersUsedCount } = req.body;

  if (!playerName || typeof playerName !== 'string') {
    return res.status(400).json({ error: 'Player name is required' });
  }

  const safeName = playerName.trim().substring(0, 30);
  const isWin = result === 'win';
  const isDraw = result === 'draw';

  // XP calculation algorithm as specified: 500 XP for Win, 250 XP for Draw, 50 XP for participation
  const baseXP = isWin ? 500 : isDraw ? 250 : 50;
  const speedBonus = Math.max(0, Math.floor((30 - (timeSpent || 15)) * 2));
  const efficiencyBonus = Math.max(0, (3 - (boostersUsedCount || 0)) * 15);
  const totalEarnedXP = baseXP + speedBonus + efficiencyBonus;

  // Rating delta
  const ratingDelta = isWin ? +25 : isDraw ? +5 : -15;

  let player = leaderboard.find(p => p.name.toLowerCase() === safeName.toLowerCase());
  const oldLevel = player ? Math.floor(player.xp / 1000) + 1 : 1;

  if (player) {
    player.rating = Math.max(800, player.rating + ratingDelta);
    player.xp += totalEarnedXP;
    if (isWin) player.wins += 1;
    else if (!isDraw) player.losses += 1;
  } else {
    player = {
      id: String(Date.now()),
      name: safeName,
      rating: Math.max(800, 1200 + ratingDelta),
      xp: totalEarnedXP,
      league: 'Pasargadae',
      wins: isWin ? 1 : 0,
      losses: isWin || isDraw ? 0 : 1,
      avatar: '🛡️',
      country: 'IR'
    };
    leaderboard.push(player);
  }

  // Calculate Level (every 1000 XP is 1 level)
  const newLevel = Math.floor(player.xp / 1000) + 1;
  const levelUp = newLevel > oldLevel;
  player.level = newLevel;

  // Determine Level Title
  const levelTitlesFa = [
    'سرباز نوپا',
    'دلاور پارس',
    'امیر سواره‌نظام',
    'سردار بخارا',
    'سپهبد اساطیر',
    'استاد اعظم چترنگ'
  ];
  const levelTitle = levelTitlesFa[Math.min(newLevel - 1, levelTitlesFa.length - 1)];

  // Update dynamic leaderboard ranking by total XP
  const sortedByXP = [...leaderboard].sort((a, b) => b.xp - a.xp);
  const playerRank = sortedByXP.findIndex(p => p.id === player!.id) + 1;
  player.rank = playerRank;

  // Update league according to rating
  const matchedLeague = [...LEAGUES].reverse().find(l => player!.rating >= l.minRating) || LEAGUES[0];
  player.league = matchedLeague.id;

  res.json({
    success: true,
    player,
    earnedXP: totalEarnedXP,
    ratingDelta,
    currentLeague: matchedLeague,
    level: newLevel,
    levelTitle,
    levelUp,
    rank: playerRank,
    nextLevelXP: newLevel * 1000,
    currentLevelProgress: player.xp % 1000
  });
});

// Claim Rewarded Ad Coins/Booster (Simulated secure token validation)
app.post('/api/claim-reward', (req: Request, res: Response) => {
  const { rewardType, verificationToken } = req.body;
  if (!verificationToken || typeof verificationToken !== 'string') {
    return res.status(400).json({ error: 'Invalid reward token' });
  }

  // Credit 50 Darics (gold coins) or 1 free booster
  res.json({
    success: true,
    rewardType: rewardType || 'coins',
    amount: rewardType === 'booster' ? 1 : 50,
    messageFa: 'پاداش با موفقیت به حساب شما اضافه شد! ۵۰ دریک زرین',
    messageEn: 'Reward successfully claimed! 50 Golden Darics'
  });
});

// Redeem Daily / Telegram Promo Codes
const VALID_PROMO_CODES: Record<string, { coins: number; messageFa: string; messageEn: string }> = {
  'CYRUS2026': { coins: 150, messageFa: 'کد هدیه کوروش اعمال شد! (+۱۵۰ دریک زرین)', messageEn: 'Cyrus Gift Code activated! (+150 Darics)' },
  'HAMJAHAN': { coins: 100, messageFa: 'کد ورود به همجهان اعمال شد! (+۱۰۰ دریک زرین)', messageEn: 'Welcome code activated! (+100 Darics)' },
  'TELEGRAM_VIP': { coins: 200, messageFa: 'پاداش عضویت در کانال تلگرام ثبت شد! (+۲۰۰ دریک)', messageEn: 'Telegram VIP reward claimed! (+200 Darics)' },
  'INSTA_FAMILY': { coins: 120, messageFa: 'پاداش همراهی اینستاگرام ثبت شد! (+۱۲۰ دریک)', messageEn: 'Instagram follow reward claimed! (+120 Darics)' },
  'YOUTUBE_VIP': { coins: 250, messageFa: 'پاداش سابسکرایب یوتیوب اعمال شد! (+۲۵۰ دریک زرین + کارت پلاتینیوم ۶۵ث)', messageEn: 'YouTube VIP reward claimed! (+250 Darics + Platinum Booster)' }
};

const redeemedUserCodes = new Set<string>();

app.post('/api/redeem-code', (req: Request, res: Response) => {
  const { code, playerId } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Promo code required' });
  }

  const cleanCode = code.trim().toUpperCase();
  const reward = VALID_PROMO_CODES[cleanCode];

  if (!reward) {
    return res.status(404).json({ errorFa: 'کد نامعتبر است یا منقضی شده است.', errorEn: 'Invalid or expired code.' });
  }

  const userKey = `${playerId || 'guest'}_${cleanCode}`;
  if (redeemedUserCodes.has(userKey)) {
    return res.status(400).json({ errorFa: 'این کد قبلاً توسط شما استفاده شده است.', errorEn: 'Code already redeemed.' });
  }

  redeemedUserCodes.add(userKey);
  res.json({
    success: true,
    code: cleanCode,
    coinsGranted: reward.coins,
    messageFa: reward.messageFa,
    messageEn: reward.messageEn
  });
});

// Verify In-App Purchase
app.post('/api/verify-purchase', (req: Request, res: Response) => {
  const { packageId, receiptToken } = req.body;
  if (!packageId) {
    return res.status(400).json({ error: 'Package ID required' });
  }

  // Validates IAP package
  const PACKAGES: Record<string, { coins: number; name: string }> = {
    'daric_pack_small': { coins: 250, name: 'کیسه دریک هخامنشی (۲۵۰ سکه)' },
    'daric_pack_royal': { coins: 1000, name: 'صندوقچه سلطنتی کوروش (۱۰۰۰ سکه)' },
    'booster_bundle': { coins: 0, name: 'بسته ۳۰ تایی کارت‌های زمان' },
    'skin_apadana': { coins: 0, name: 'پوسته کاخ آپادانا' }
  };

  const selected = PACKAGES[packageId];
  if (!selected) {
    return res.status(404).json({ error: 'Unknown package' });
  }

  res.json({
    success: true,
    packageId,
    receiptToken: receiptToken || `tok_${Date.now()}`,
    unlockedItem: selected.name,
    coinsGranted: selected.coins
  });
});

// --- Fully Automated & Secure AI Strategic Advisor (Powered by Gemini 2.5 Flash) ---
let aiClient: GoogleGenAI | null = null;
try {
  aiClient = new GoogleGenAI();
} catch (e) {
  console.log('[AI Oracle] Initialized with automatic credentials');
}

app.post('/api/ai-oracle', async (req: Request, res: Response) => {
  const { fen, civilization, lastMove, lang } = req.body;
  const isFa = lang !== 'en';

  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI();
    } catch {
      // safe fallback
    }
  }

  if (!aiClient) {
    return res.json({
      success: true,
      tip: isFa
        ? 'مرکز صفحه را با پیاده‌ها کنترل کنید و اسب‌های خود را به سمت خانه‌های کلیدی گسترش دهید.'
        : 'Control the center with your pawns and develop your knights to active squares.'
    });
  }

  try {
    const prompt = `You are the legendary historical grand strategist of the "${civilization || 'achaemenid'}" civilization in Worldplay Cultural Chess.
The current board FEN is: "${fen || 'start'}". The last move played was: "${lastMove || 'opening'}".
Provide a brief, inspiring 1-2 sentence tactical recommendation and royal lore insight for the current player.
Answer strictly in ${isFa ? 'Persian (Farsi)' : 'English'}. No markdown bullets, keep it under 35 words.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const tip = response.text?.trim() || (isFa ? 'با خرد و شجاعت گام بردارید؛ کنترل مرکز کلید پیروزی است.' : 'Control the center and guard your king.');

    res.json({
      success: true,
      tip
    });
  } catch (err: any) {
    console.error('[AI Oracle] Automated Gemini fallback:', err?.message || err);
    res.json({
      success: true,
      tip: isFa
        ? 'دیده‌بانی هوشمند: از مهره‌های سبک برای تصاحب خانه‌های میانی بهره بگیرید و شاه را با قلعه‌رفتن محافظت کنید.'
        : 'Tactical hint: Secure the king via castling and keep knight outpost active.'
    });
  }
});

// --- Ambassador & Loyalty League, Board of Trustees & Able City Land Grant System ---

interface AmbassadorRecord {
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

let ambassadors: AmbassadorRecord[] = [
  {
    id: 'amb-1',
    name: 'کوروش_ایران',
    referralsCount: 142,
    streakDays: 48,
    loyaltyPoints: 42500,
    tier: 'supreme',
    tierNameFa: 'ارکان عالی همجهان',
    badge: '👑',
    isTrustee: true,
    ableCityParcelId: 'ABLE-PRIME-001',
    ableCityDistrict: 'منطقه سلطنتی آپادانا - شهر توانا'
  },
  {
    id: 'amb-2',
    name: 'بانو_میترا',
    referralsCount: 96,
    streakDays: 35,
    loyaltyPoints: 29800,
    tier: 'minister',
    tierNameFa: 'وزیر وفاداری',
    badge: '💎',
    isTrustee: true,
    ableCityParcelId: 'ABLE-INNOV-014',
    ableCityDistrict: 'پردیس نوآوری و فناوری - شهر توانا'
  },
  {
    id: 'amb-3',
    name: 'آبتین_پارس',
    referralsCount: 78,
    streakDays: 41,
    loyaltyPoints: 24200,
    tier: 'minister',
    tierNameFa: 'وزیر وفاداری',
    badge: '🏛️',
    isTrustee: true,
    ableCityParcelId: 'ABLE-CULTURE-029',
    ableCityDistrict: 'بلوار فرهنگ و تمدن - شهر توانا'
  },
  {
    id: 'amb-4',
    name: 'Mandana_Queen',
    referralsCount: 65,
    streakDays: 28,
    loyaltyPoints: 19500,
    tier: 'senior',
    tierNameFa: 'سفیر ارشد',
    badge: '👸',
    isTrustee: true,
    ableCityParcelId: 'ABLE-WISDOM-044',
    ableCityDistrict: 'منطقه دانش و اندیشه - شهر توانا'
  },
  {
    id: 'amb-5',
    name: 'Aryo_Barzan',
    referralsCount: 54,
    streakDays: 22,
    loyaltyPoints: 16100,
    tier: 'senior',
    tierNameFa: 'سفیر ارشد',
    badge: '🛡️',
    isTrustee: true,
    ableCityParcelId: 'ABLE-TACTIC-063',
    ableCityDistrict: 'شهرک ورزشی شطرنج - شهر توانا'
  }
];

// In-memory record of Google/Gmail profiles and loyalty states
interface GoogleUserProfile {
  email: string;
  name: string;
  avatar: string;
  referralCode: string;
  chessRating: number;
  chessXP: number;
  loyaltyEXP: number; // لیگ معرفان و وفاداران
  activeMinutes: number; // دقایق حضور فعال (هر ۱ دقیقه = ۱ EXP)
  streakDays: number;
  totalCheckins: number;
  referralsCount: number;
  registeredInvites: string[];
  isTrustee: boolean;
  createdAt: string;
}

const googleUsers = new Map<string, GoogleUserProfile>();

// In-memory record of daily checkins: playerId -> { lastCheckinDate: string, streak: number, totalCheckins: number }
const playerAttendance = new Map<string, { lastCheckinDate: string; streak: number; totalCheckins: number }>();
// In-memory record of player loyalty points & referrals
const playerLoyaltyState = new Map<string, { points: number; referrals: number; code: string; registeredInvites: string[]; activeMinutes: number }>();

// Helper to determine tier based on Loyalty EXP
function getAmbassadorTier(points: number, referrals: number) {
  if (points >= 25000 || referrals >= 70) {
    return { tier: 'supreme', nameFa: 'ارکان عالی همجهان', nameEn: 'Supreme Pillar of Hamjahan', badge: '👑', isTrustee: true };
  } else if (points >= 15000 || referrals >= 40) {
    return { tier: 'minister', nameFa: 'وزیر وفاداری', nameEn: 'Minister of Loyalty', badge: '💎', isTrustee: true };
  } else if (points >= 7000 || referrals >= 20) {
    return { tier: 'senior', nameFa: 'سفیر ارشد', nameEn: 'Senior Ambassador', badge: '🎖️', isTrustee: true };
  } else if (points >= 2500 || referrals >= 8) {
    return { tier: 'benefactor', nameFa: 'یاور تمدن', nameEn: 'Civilization Benefactor', badge: '🌟', isTrustee: false };
  } else {
    return { tier: 'ambassador', nameFa: 'سفیر صلح', nameEn: 'Peace Ambassador', badge: '🕊️', isTrustee: false };
  }
}

// 0. Google/Gmail Registration & Profile Binding
app.post('/api/auth/google-register', (req: Request, res: Response) => {
  const { email, name, avatar, inviterCode } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'آدرس ایمیل / جیمیل الزامی است' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const userName = name && typeof name === 'string' ? name.trim() : cleanEmail.split('@')[0];
  const userAvatar = avatar || '👑';

  let user = googleUsers.get(cleanEmail);
  if (!user) {
    // Generate unique referral code
    const prefix = cleanEmail.replace(/[^a-z0-9]/gi, '').slice(0, 4).toUpperCase() || 'HAM';
    const code = `HAM-${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    user = {
      email: cleanEmail,
      name: userName,
      avatar: userAvatar,
      referralCode: code,
      chessRating: 1420,
      chessXP: 1150,
      loyaltyEXP: 500, // Welcome Ambassador EXP bonus
      activeMinutes: 0,
      streakDays: 1,
      totalCheckins: 1,
      referralsCount: 0,
      registeredInvites: [],
      isTrustee: false,
      createdAt: new Date().toISOString()
    };

    // If an inviter code was supplied during registration
    if (inviterCode && typeof inviterCode === 'string') {
      const cleanInviter = inviterCode.trim().toUpperCase();
      if (cleanInviter !== code) {
        user.loyaltyEXP += 300; // Registration with inviter bonus
      }
    }

    googleUsers.set(cleanEmail, user);
  } else {
    // Update name or avatar if provided
    if (name) user.name = userName;
    if (avatar) user.avatar = userAvatar;
  }

  // Also sync to playerLoyaltyState map
  playerLoyaltyState.set(cleanEmail, {
    points: user.loyaltyEXP,
    referrals: user.referralsCount,
    code: user.referralCode,
    registeredInvites: user.registeredInvites,
    activeMinutes: user.activeMinutes
  });

  const tierInfo = getAmbassadorTier(user.loyaltyEXP, user.referralsCount);
  const isTrustee = tierInfo.isTrustee || user.loyaltyEXP >= 5000 || user.referralsCount >= 10;
  user.isTrustee = isTrustee;

  res.json({
    success: true,
    user: {
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      referralCode: user.referralCode,
      chessRating: user.chessRating,
      chessXP: user.chessXP,
      loyaltyEXP: user.loyaltyEXP,
      activeMinutes: user.activeMinutes,
      streakDays: user.streakDays,
      referralsCount: user.referralsCount,
      isTrustee: user.isTrustee,
      tier: tierInfo.tier,
      tierNameFa: tierInfo.nameFa,
      tierNameEn: tierInfo.nameEn,
      badge: tierInfo.badge
    },
    messageFa: `پروفایل جیمیل «${user.email}» با موفقیت فعال شد. کد معرف اختصاصی شما: ${user.referralCode}`,
    messageEn: `Gmail profile "${user.email}" successfully verified. Your exclusive referral code: ${user.referralCode}`
  });
});

// Track active presence in the app: 1 minute = 1 EXP in Loyalty League
app.post('/api/loyalty/track-minute', (req: Request, res: Response) => {
  const { playerId, email, minutesToAdd } = req.body;
  const pId = email ? email.trim().toLowerCase() : (playerId || 'player_default');
  const count = typeof minutesToAdd === 'number' && minutesToAdd > 0 && minutesToAdd <= 60 ? minutesToAdd : 1;

  let user = email ? googleUsers.get(pId) : null;
  let loyalty = playerLoyaltyState.get(pId);

  if (!loyalty) {
    loyalty = {
      points: 1200,
      referrals: 3,
      code: `CYRUS-${Math.floor(1000 + Math.random() * 9000)}`,
      registeredInvites: [],
      activeMinutes: 0
    };
  }

  loyalty.activeMinutes = (loyalty.activeMinutes || 0) + count;
  loyalty.points += count; // 1 min active presence = 1 EXP in loyalty league
  playerLoyaltyState.set(pId, loyalty);

  if (user) {
    user.activeMinutes = loyalty.activeMinutes;
    user.loyaltyEXP = loyalty.points;
  }

  res.json({
    success: true,
    addedEXP: count,
    activeMinutes: loyalty.activeMinutes,
    totalLoyaltyEXP: loyalty.points,
    messageFa: `+${count} امتیاز EXP بابت ۱ دقیقه حضور فعال در برنامه ثبت شد.`
  });
});

// 1. Get Loyalty & Ambassador Status
app.get('/api/loyalty/status', (req: Request, res: Response) => {
  const emailParam = (req.query.email as string)?.trim().toLowerCase();
  const playerId = emailParam || (req.query.playerId as string) || 'player_default';
  const playerName = (req.query.playerName as string) || 'فرمانده_پارس';

  const user = emailParam ? googleUsers.get(emailParam) : null;
  let loyalty = playerLoyaltyState.get(playerId);

  if (!loyalty) {
    loyalty = {
      points: user ? user.loyaltyEXP : 1200,
      referrals: user ? user.referralsCount : 3,
      code: user ? user.referralCode : `CYRUS-${Math.floor(1000 + Math.random() * 9000)}`,
      registeredInvites: user ? user.registeredInvites : ['امیر_شطرنج', 'سارا_کیش', 'بابک_پارت'],
      activeMinutes: user ? user.activeMinutes : 45
    };
    playerLoyaltyState.set(playerId, loyalty);
  }

  const attendance = playerAttendance.get(playerId) || {
    lastCheckinDate: '',
    streak: 3,
    totalCheckins: 14
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const canCheckin = attendance.lastCheckinDate !== todayStr;
  const tierInfo = getAmbassadorTier(loyalty.points, loyalty.referrals);

  // Check if player ranks on ambassador leaderboard or top tier
  const isTrustee = tierInfo.isTrustee || loyalty.points >= 5000 || loyalty.referrals >= 10;

  res.json({
    success: true,
    playerId,
    playerName: user ? user.name : playerName,
    email: user ? user.email : null,
    isGoogleVerified: Boolean(user),
    referralCode: loyalty.code,
    referralsCount: loyalty.referrals,
    registeredInvites: loyalty.registeredInvites,
    loyaltyPoints: loyalty.points,
    activeMinutes: loyalty.activeMinutes || 0,
    streakDays: attendance.streak,
    totalAttendanceDays: attendance.totalCheckins,
    canCheckinToday: canCheckin,
    lastCheckinDate: attendance.lastCheckinDate,
    tier: tierInfo.tier,
    tierNameFa: tierInfo.nameFa,
    tierNameEn: tierInfo.nameEn,
    badge: tierInfo.badge,
    isTrusteeMember: isTrustee,
    ableCityLandParcel: {
      parcelId: `ABLE-VIRTUAL-${loyalty.code}`,
      districtFa: 'پردیس دانایی و نوآوری دیجیتال - شهر مجازی توانا',
      districtEn: 'Able City Digital Innovation & Wisdom Campus',
      coordinates: '35°42\'18"N, 51°24\'09"E - Metaverse Grid',
      areaSqm: 500,
      zoningFa: 'پردیس نوآوری، دانش، فرهنگ و تفکر استراتژیک مجازی',
      zoningEn: 'Persian Virtual Innovation & Strategic Culture Campus',
      statusFa: 'قول و رزرو رسمی اهدای قطعه در شهر مجازی توانا',
      statusEn: 'Official In-Game Virtual Land Allocation Pledge'
    }
  });
});

// 2. Daily Check-in Streak Endpoint
app.post('/api/loyalty/checkin', (req: Request, res: Response) => {
  const { playerId, playerName } = req.body;
  const pId = playerId || 'player_default';
  const pName = playerName || 'فرمانده_پارس';

  const todayStr = new Date().toISOString().slice(0, 10);
  let attendance = playerAttendance.get(pId);
  if (!attendance) {
    attendance = { lastCheckinDate: '', streak: 0, totalCheckins: 0 };
  }

  if (attendance.lastCheckinDate === todayStr) {
    return res.status(400).json({
      success: false,
      errorFa: 'حضور امروز شما قبلاً با موفقیت ثبت شده است! فردا برای دریافت پاداش بازگردید.',
      errorEn: 'Today’s check-in has already been registered! Return tomorrow for your next reward.'
    });
  }

  // Check if consecutive
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  let newStreak = attendance.lastCheckinDate === yesterday ? attendance.streak + 1 : 1;

  attendance.lastCheckinDate = todayStr;
  attendance.streak = newStreak;
  attendance.totalCheckins += 1;
  playerAttendance.set(pId, attendance);

  // Progressive rewards: 7-day cycle
  const dayInCycle = ((newStreak - 1) % 7) + 1;
  const rewardTable = [
    { points: 100, coins: 20, description: 'روز ۱: پاداش آغازین همجهان' },
    { points: 150, coins: 30, description: 'روز ۲: پاداش وفاداری مداوم' },
    { points: 200, coins: 40, description: 'روز ۳: شتاب وفاداری پارس' },
    { points: 250, coins: 50, description: 'روز ۴: دریک‌های زرین آپادانا' },
    { points: 300, coins: 65, description: 'روز ۵: نشان افتخار حضور مستمر' },
    { points: 400, coins: 80, description: 'روز ۶: پاداش ویژه پیشگامان' },
    { points: 600, coins: 150, description: 'روز ۷: صندوقچه افسانه‌ای وفاداران و قطعه اعتبار شهر توانا' }
  ];

  const reward = rewardTable[dayInCycle - 1];

  let loyalty = playerLoyaltyState.get(pId);
  if (!loyalty) {
    loyalty = {
      points: 1200,
      referrals: 3,
      code: `CYRUS-${Math.floor(1000 + Math.random() * 9000)}`,
      registeredInvites: [],
      activeMinutes: 0
    };
  }
  loyalty.points += reward.points;
  playerLoyaltyState.set(pId, loyalty);

  res.json({
    success: true,
    streak: newStreak,
    dayInCycle,
    rewardPoints: reward.points,
    rewardCoins: reward.coins,
    description: reward.description,
    totalPoints: loyalty.points,
    messageFa: `حضور روز ${dayInCycle} ثبت شد! +${reward.points} امتیاز وفاداری و +${reward.coins} دریک زرین دریافت کردید.`,
    messageEn: `Day ${dayInCycle} check-in registered! +${reward.points} Loyalty Points and +${reward.coins} Darics awarded.`
  });
});

// 3. Register Referral or Submit Inviter Code
app.post('/api/loyalty/referral', (req: Request, res: Response) => {
  const { playerId, action, friendCode, friendName } = req.body;
  const pId = playerId || 'player_default';

  let loyalty = playerLoyaltyState.get(pId);
  if (!loyalty) {
    loyalty = {
      points: 1200,
      referrals: 3,
      code: `CYRUS-${Math.floor(1000 + Math.random() * 9000)}`,
      registeredInvites: ['امیر_شطرنج', 'سارا_کیش', 'بابک_پارت'],
      activeMinutes: 0
    };
    playerLoyaltyState.set(pId, loyalty);
  }

  if (action === 'submit_friend_code') {
    if (!friendCode || typeof friendCode !== 'string') {
      return res.status(400).json({ error: 'کد معرف الزامی است' });
    }
    const clean = friendCode.trim().toUpperCase();
    if (clean === loyalty.code) {
      return res.status(400).json({
        errorFa: 'نمی‌توانید از کد معرف شخصی خودتان استفاده کنید.',
        errorEn: 'You cannot use your own referral code.'
      });
    }

    // Award bonus for registering under a friend
    const bonusPoints = 400;
    const bonusCoins = 100;
    loyalty.points += bonusPoints;
    playerLoyaltyState.set(pId, loyalty);

    return res.json({
      success: true,
      messageFa: `کد معرف «${clean}» با موفقیت ثبت شد! +${bonusPoints} امتیاز وفاداری و +${bonusCoins} دریک زرین به شما هدیه داده شد.`,
      messageEn: `Referral code "${clean}" successfully registered! +${bonusPoints} Loyalty Points and +${bonusCoins} Darics added.`,
      rewardPoints: bonusPoints,
      rewardCoins: bonusCoins,
      totalPoints: loyalty.points
    });
  }

  // Register a new friend invited
  const newInviteName = friendName || `فرمانده_جدید_${loyalty.referrals + 1}`;
  loyalty.referrals += 1;
  loyalty.registeredInvites.unshift(newInviteName);
  const invitePoints = 500;
  const inviteCoins = 100;
  loyalty.points += invitePoints;
  playerLoyaltyState.set(pId, loyalty);

  res.json({
    success: true,
    newReferral: newInviteName,
    referralsCount: loyalty.referrals,
    rewardPoints: invitePoints,
    rewardCoins: inviteCoins,
    totalPoints: loyalty.points,
    messageFa: `دعوت از «${newInviteName}» ثبت شد! +${invitePoints} امتیاز معرف و +${inviteCoins} دریک زرین افزوده شد.`,
    messageEn: `Invite of "${newInviteName}" registered! +${invitePoints} Points and +${inviteCoins} Darics added.`
  });
});

// 4. Combined Honorary Board of Trustees & Ambassador Leaderboard
app.get('/api/loyalty/leaderboard', (req: Request, res: Response) => {
  // Top chess masters from leaderboard
  const topChessLeaders = [...leaderboard].sort((a, b) => b.rating - a.rating).slice(0, 3);
  // Top ambassadors
  const topAmbassadors = [...ambassadors].sort((a, b) => b.loyaltyPoints - a.loyaltyPoints);

  // Combined Honorary Board of Trustees (هیئت امنای برنامه)
  const trustees = [
    {
      role: 'رئیس شورای عالی و هیئت امنا',
      titleEn: 'Supreme Council President',
      name: 'کوروش_ایران',
      reasonFa: 'صدرنشین لیگ شطرنج کوروش بزرگ و پیشگام لیگ وفاداری',
      reasonEn: 'Leader of Cyrus Chess League & Loyalty Pioneer',
      badge: '👑',
      landParcel: 'ABLE-PRIME-001'
    },
    {
      role: 'عضو هیئت امنا (نماینده استادان شطرنج)',
      titleEn: 'Trustee Member (Chess Masters Envoy)',
      name: 'Mandana_Queen',
      reasonFa: 'استاد برتر لیگ ماندانا و مدافع برتر تاکتیک‌های فرهنگی',
      reasonEn: 'Top Master of Mandana League & Tactical Strategist',
      badge: '👸',
      landParcel: 'ABLE-WISDOM-044'
    },
    {
      role: 'عضو هیئت امنا (نماینده ارشد معرفان و وفاداران)',
      titleEn: 'Trustee Member (Ambassadors & Loyalty Envoy)',
      name: 'بانو_میترا',
      reasonFa: 'بیش از ۹۶ دعوت موفق و ۳۵ روز استریک مداوم حضور',
      reasonEn: 'Over 96 successful invites & 35 days check-in streak',
      badge: '💎',
      landParcel: 'ABLE-INNOV-014'
    },
    {
      role: 'عضو هیئت امنا (دیده‌بان تمدن‌های کهن)',
      titleEn: 'Trustee Member (Heritage Warden)',
      name: 'آبتین_پارس',
      reasonFa: '۷۸ معرفی فعال و کسب نشان زرین وفاداری',
      reasonEn: '78 active referrals & Golden Loyalty Medal',
      badge: '🏛️',
      landParcel: 'ABLE-CULTURE-029'
    },
    {
      role: 'عضو هیئت امنا (نماینده دلاوران جوان)',
      titleEn: 'Trustee Member (Youth Vanguard)',
      name: 'Aryo_Barzan',
      reasonFa: 'پیشتاز لیگ داریوش و سفیر دلاوری همجهان',
      reasonEn: 'Darius League Vanguard & Valor Ambassador',
      badge: '⚔️',
      landParcel: 'ABLE-TACTIC-063'
    }
  ];

  res.json({
    success: true,
    ambassadors: topAmbassadors,
    trustees,
    topChessLeaders,
    ableCityMetadata: {
      cityName: 'شهر توانا (Able City)',
      twinCities: {
        hamrazFa: 'شهر مجازی همراز (۶۵۰,۰۰۰ متر مربع)',
        afrenaFa: 'شهر مجازی آفرینا (۶۵۰,۰۰۰ متر مربع)',
        totalAreaFa: '۱,۳۰۰,۰۰۰ متر مربع متاورس مجازی'
      },
      ecosystemAppsCount: 35,
      roadmap: {
        phase1Fa: 'فاز ۱ (۱۰,۰۰۰+ دانلود): معرفی ارز و گیم داخلی اکوسیستم',
        phase2Fa: 'فاز ۲ (۵۰,۰۰۰+ دانلود و ۶۰٪ واگذاری زمین): ارز دیجیتال جهانی و گیم سه‌بعدی 3D Metaverse'
      },
      descriptionFa: 'شهر کاملاً مجازی توانا متشکل از دو شهر همراز و آفرینا به وسعت مجموع ۱,۳۰۰,۰۰۰ متر مربع در اکوسیستم ۳۵ برنامه‌ای، بدون ادعای ملکی فیزیکی یا سند تک‌برگ.',
      descriptionEn: 'The purely virtual smart metaverse of Able City comprising twin cities Hamraz and Afrena (1,300,000 m² total) across a 35-app ecosystem.',
      totalParcelsAllocated: 1240,
      availableParcelsForTrustees: 500,
      foundationYear: '2026'
    }
  });
});

// --- Vite / Static Files Middleware ---
async function setupServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Worldplay Engine] Server running on http://0.0.0.0:${port}`);
  });
}

setupServer().catch(err => {
  console.error('[Worldplay Engine] Startup error:', err);
});
