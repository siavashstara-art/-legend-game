var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");
var import_meta = {};
import_dotenv.default.config();
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
var app = (0, import_express.default)();
var port = parseInt(process.env.PORT || "3000", 10);
app.use(import_express.default.json({ limit: "1mb" }));
var leaderboard = [
  { id: "1", name: "\u06A9\u0648\u0631\u0648\u0634_\u0627\u06CC\u0631\u0627\u0646", rating: 2140, xp: 9800, league: "Cyrus", wins: 84, losses: 12, avatar: "\u{1F451}", country: "IR" },
  { id: "2", name: "Mandana_Queen", rating: 1980, xp: 8200, league: "Mandana", wins: 71, losses: 19, avatar: "\u{1F478}", country: "IR" },
  { id: "3", name: "Aryo_Barzan", rating: 1890, xp: 7400, league: "Darius", wins: 62, losses: 23, avatar: "\u{1F6E1}\uFE0F", country: "IR" },
  { id: "4", name: "Apadana_Master", rating: 1750, xp: 6100, league: "Apadana", wins: 53, losses: 28, avatar: "\u{1F3DB}\uFE0F", country: "FR" },
  { id: "5", name: "Pasargad_Knight", rating: 1620, xp: 4800, league: "Pasargadae", wins: 41, losses: 30, avatar: "\u{1F40E}", country: "DE" }
];
var LEAGUES = [
  { id: "pasargadae", nameFa: "\u0644\u06CC\u06AF \u067E\u0627\u0633\u0627\u0631\u06AF\u0627\u062F", nameEn: "Pasargadae League", minRating: 1e3, maxRating: 1399, badge: "\u{1F949}", color: "#cd7f32" },
  { id: "apadana", nameFa: "\u0644\u06CC\u06AF \u0622\u067E\u0627\u062F\u0627\u0646\u0627", nameEn: "Apadana League", minRating: 1400, maxRating: 1699, badge: "\u{1F3DB}\uFE0F", color: "#38bdf8" },
  { id: "mandana", nameFa: "\u0644\u06CC\u06AF \u0645\u0627\u0646\u062F\u0627\u0646\u0627", nameEn: "Mandana League", minRating: 1700, maxRating: 1899, badge: "\u{1F948}", color: "#c0c0c0" },
  { id: "darius", nameFa: "\u0644\u06CC\u06AF \u062F\u0627\u0631\u06CC\u0648\u0634", nameEn: "Darius League", minRating: 1900, maxRating: 2099, badge: "\u2694\uFE0F", color: "#f59e0b" },
  { id: "cyrus", nameFa: "\u0644\u06CC\u06AF \u06A9\u0648\u0631\u0648\u0634 \u0628\u0632\u0631\u06AF", nameEn: "Cyrus the Great League", minRating: 2100, maxRating: 3e3, badge: "\u{1F451}", color: "#f0c04a" }
];
var requestCounts = /* @__PURE__ */ new Map();
function rateLimitMiddleware(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const windowMs = 60 * 1e3;
  const maxReq = 120;
  const current = requestCounts.get(ip);
  if (!current || now > current.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }
  if (current.count >= maxReq) {
    return res.status(429).json({ error: "Too many requests. Please slow down." });
  }
  current.count++;
  next();
}
app.use("/api", rateLimitMiddleware);
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    game: "Worldplay - Hamjahan",
    version: "1.4.0",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/api/leagues", (_req, res) => {
  res.json({ leagues: LEAGUES });
});
app.get("/api/leaderboard", (_req, res) => {
  res.json({ leaderboard: [...leaderboard].sort((a, b) => b.rating - a.rating) });
});
app.post("/api/scores", (req, res) => {
  const { playerName, result, timeSpent, boostersUsedCount } = req.body;
  if (!playerName || typeof playerName !== "string") {
    return res.status(400).json({ error: "Player name is required" });
  }
  const safeName = playerName.trim().substring(0, 30);
  const isWin = result === "win";
  const isDraw = result === "draw";
  const baseXP = isWin ? 500 : isDraw ? 250 : 50;
  const speedBonus = Math.max(0, Math.floor((30 - (timeSpent || 15)) * 2));
  const efficiencyBonus = Math.max(0, (3 - (boostersUsedCount || 0)) * 15);
  const totalEarnedXP = baseXP + speedBonus + efficiencyBonus;
  const ratingDelta = isWin ? 25 : isDraw ? 5 : -15;
  let player = leaderboard.find((p) => p.name.toLowerCase() === safeName.toLowerCase());
  const oldLevel = player ? Math.floor(player.xp / 1e3) + 1 : 1;
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
      league: "Pasargadae",
      wins: isWin ? 1 : 0,
      losses: isWin || isDraw ? 0 : 1,
      avatar: "\u{1F6E1}\uFE0F",
      country: "IR"
    };
    leaderboard.push(player);
  }
  const newLevel = Math.floor(player.xp / 1e3) + 1;
  const levelUp = newLevel > oldLevel;
  player.level = newLevel;
  const levelTitlesFa = [
    "\u0633\u0631\u0628\u0627\u0632 \u0646\u0648\u067E\u0627",
    "\u062F\u0644\u0627\u0648\u0631 \u067E\u0627\u0631\u0633",
    "\u0627\u0645\u06CC\u0631 \u0633\u0648\u0627\u0631\u0647\u200C\u0646\u0638\u0627\u0645",
    "\u0633\u0631\u062F\u0627\u0631 \u0628\u062E\u0627\u0631\u0627",
    "\u0633\u067E\u0647\u0628\u062F \u0627\u0633\u0627\u0637\u06CC\u0631",
    "\u0627\u0633\u062A\u0627\u062F \u0627\u0639\u0638\u0645 \u0686\u062A\u0631\u0646\u06AF"
  ];
  const levelTitle = levelTitlesFa[Math.min(newLevel - 1, levelTitlesFa.length - 1)];
  const sortedByXP = [...leaderboard].sort((a, b) => b.xp - a.xp);
  const playerRank = sortedByXP.findIndex((p) => p.id === player.id) + 1;
  player.rank = playerRank;
  const matchedLeague = [...LEAGUES].reverse().find((l) => player.rating >= l.minRating) || LEAGUES[0];
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
    nextLevelXP: newLevel * 1e3,
    currentLevelProgress: player.xp % 1e3
  });
});
app.post("/api/claim-reward", (req, res) => {
  const { rewardType, verificationToken } = req.body;
  if (!verificationToken || typeof verificationToken !== "string") {
    return res.status(400).json({ error: "Invalid reward token" });
  }
  res.json({
    success: true,
    rewardType: rewardType || "coins",
    amount: rewardType === "booster" ? 1 : 50,
    messageFa: "\u067E\u0627\u062F\u0627\u0634 \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0628\u0647 \u062D\u0633\u0627\u0628 \u0634\u0645\u0627 \u0627\u0636\u0627\u0641\u0647 \u0634\u062F! \u06F5\u06F0 \u062F\u0631\u06CC\u06A9 \u0632\u0631\u06CC\u0646",
    messageEn: "Reward successfully claimed! 50 Golden Darics"
  });
});
var VALID_PROMO_CODES = {
  "CYRUS2026": { coins: 150, messageFa: "\u06A9\u062F \u0647\u062F\u06CC\u0647 \u06A9\u0648\u0631\u0648\u0634 \u0627\u0639\u0645\u0627\u0644 \u0634\u062F! (+\u06F1\u06F5\u06F0 \u062F\u0631\u06CC\u06A9 \u0632\u0631\u06CC\u0646)", messageEn: "Cyrus Gift Code activated! (+150 Darics)" },
  "HAMJAHAN": { coins: 100, messageFa: "\u06A9\u062F \u0648\u0631\u0648\u062F \u0628\u0647 \u0647\u0645\u062C\u0647\u0627\u0646 \u0627\u0639\u0645\u0627\u0644 \u0634\u062F! (+\u06F1\u06F0\u06F0 \u062F\u0631\u06CC\u06A9 \u0632\u0631\u06CC\u0646)", messageEn: "Welcome code activated! (+100 Darics)" },
  "TELEGRAM_VIP": { coins: 200, messageFa: "\u067E\u0627\u062F\u0627\u0634 \u0639\u0636\u0648\u06CC\u062A \u062F\u0631 \u06A9\u0627\u0646\u0627\u0644 \u062A\u0644\u06AF\u0631\u0627\u0645 \u062B\u0628\u062A \u0634\u062F! (+\u06F2\u06F0\u06F0 \u062F\u0631\u06CC\u06A9)", messageEn: "Telegram VIP reward claimed! (+200 Darics)" },
  "INSTA_FAMILY": { coins: 120, messageFa: "\u067E\u0627\u062F\u0627\u0634 \u0647\u0645\u0631\u0627\u0647\u06CC \u0627\u06CC\u0646\u0633\u062A\u0627\u06AF\u0631\u0627\u0645 \u062B\u0628\u062A \u0634\u062F! (+\u06F1\u06F2\u06F0 \u062F\u0631\u06CC\u06A9)", messageEn: "Instagram follow reward claimed! (+120 Darics)" },
  "YOUTUBE_VIP": { coins: 250, messageFa: "\u067E\u0627\u062F\u0627\u0634 \u0633\u0627\u0628\u0633\u06A9\u0631\u0627\u06CC\u0628 \u06CC\u0648\u062A\u06CC\u0648\u0628 \u0627\u0639\u0645\u0627\u0644 \u0634\u062F! (+\u06F2\u06F5\u06F0 \u062F\u0631\u06CC\u06A9 \u0632\u0631\u06CC\u0646 + \u06A9\u0627\u0631\u062A \u067E\u0644\u0627\u062A\u06CC\u0646\u06CC\u0648\u0645 \u06F6\u06F5\u062B)", messageEn: "YouTube VIP reward claimed! (+250 Darics + Platinum Booster)" }
};
var redeemedUserCodes = /* @__PURE__ */ new Set();
app.post("/api/redeem-code", (req, res) => {
  const { code, playerId } = req.body;
  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Promo code required" });
  }
  const cleanCode = code.trim().toUpperCase();
  const reward = VALID_PROMO_CODES[cleanCode];
  if (!reward) {
    return res.status(404).json({ errorFa: "\u06A9\u062F \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A \u06CC\u0627 \u0645\u0646\u0642\u0636\u06CC \u0634\u062F\u0647 \u0627\u0633\u062A.", errorEn: "Invalid or expired code." });
  }
  const userKey = `${playerId || "guest"}_${cleanCode}`;
  if (redeemedUserCodes.has(userKey)) {
    return res.status(400).json({ errorFa: "\u0627\u06CC\u0646 \u06A9\u062F \u0642\u0628\u0644\u0627\u064B \u062A\u0648\u0633\u0637 \u0634\u0645\u0627 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0634\u062F\u0647 \u0627\u0633\u062A.", errorEn: "Code already redeemed." });
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
app.post("/api/verify-purchase", (req, res) => {
  const { packageId, receiptToken } = req.body;
  if (!packageId) {
    return res.status(400).json({ error: "Package ID required" });
  }
  const PACKAGES = {
    "daric_pack_small": { coins: 250, name: "\u06A9\u06CC\u0633\u0647 \u062F\u0631\u06CC\u06A9 \u0647\u062E\u0627\u0645\u0646\u0634\u06CC (\u06F2\u06F5\u06F0 \u0633\u06A9\u0647)" },
    "daric_pack_royal": { coins: 1e3, name: "\u0635\u0646\u062F\u0648\u0642\u0686\u0647 \u0633\u0644\u0637\u0646\u062A\u06CC \u06A9\u0648\u0631\u0648\u0634 (\u06F1\u06F0\u06F0\u06F0 \u0633\u06A9\u0647)" },
    "booster_bundle": { coins: 0, name: "\u0628\u0633\u062A\u0647 \u06F3\u06F0 \u062A\u0627\u06CC\u06CC \u06A9\u0627\u0631\u062A\u200C\u0647\u0627\u06CC \u0632\u0645\u0627\u0646" },
    "skin_apadana": { coins: 0, name: "\u067E\u0648\u0633\u062A\u0647 \u06A9\u0627\u062E \u0622\u067E\u0627\u062F\u0627\u0646\u0627" }
  };
  const selected = PACKAGES[packageId];
  if (!selected) {
    return res.status(404).json({ error: "Unknown package" });
  }
  res.json({
    success: true,
    packageId,
    receiptToken: receiptToken || `tok_${Date.now()}`,
    unlockedItem: selected.name,
    coinsGranted: selected.coins
  });
});
var aiClient = null;
try {
  aiClient = new import_genai.GoogleGenAI();
} catch (e) {
  console.log("[AI Oracle] Initialized with automatic credentials");
}
app.post("/api/ai-oracle", async (req, res) => {
  const { fen, civilization, lastMove, lang } = req.body;
  const isFa = lang !== "en";
  if (!aiClient) {
    try {
      aiClient = new import_genai.GoogleGenAI();
    } catch {
    }
  }
  if (!aiClient) {
    return res.json({
      success: true,
      tip: isFa ? "\u0645\u0631\u06A9\u0632 \u0635\u0641\u062D\u0647 \u0631\u0627 \u0628\u0627 \u067E\u06CC\u0627\u062F\u0647\u200C\u0647\u0627 \u06A9\u0646\u062A\u0631\u0644 \u06A9\u0646\u06CC\u062F \u0648 \u0627\u0633\u0628\u200C\u0647\u0627\u06CC \u062E\u0648\u062F \u0631\u0627 \u0628\u0647 \u0633\u0645\u062A \u062E\u0627\u0646\u0647\u200C\u0647\u0627\u06CC \u06A9\u0644\u06CC\u062F\u06CC \u06AF\u0633\u062A\u0631\u0634 \u062F\u0647\u06CC\u062F." : "Control the center with your pawns and develop your knights to active squares."
    });
  }
  try {
    const prompt = `You are the legendary historical grand strategist of the "${civilization || "achaemenid"}" civilization in Worldplay Cultural Chess.
The current board FEN is: "${fen || "start"}". The last move played was: "${lastMove || "opening"}".
Provide a brief, inspiring 1-2 sentence tactical recommendation and royal lore insight for the current player.
Answer strictly in ${isFa ? "Persian (Farsi)" : "English"}. No markdown bullets, keep it under 35 words.`;
    const response = await aiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    const tip = response.text?.trim() || (isFa ? "\u0628\u0627 \u062E\u0631\u062F \u0648 \u0634\u062C\u0627\u0639\u062A \u06AF\u0627\u0645 \u0628\u0631\u062F\u0627\u0631\u06CC\u062F\u061B \u06A9\u0646\u062A\u0631\u0644 \u0645\u0631\u06A9\u0632 \u06A9\u0644\u06CC\u062F \u067E\u06CC\u0631\u0648\u0632\u06CC \u0627\u0633\u062A." : "Control the center and guard your king.");
    res.json({
      success: true,
      tip
    });
  } catch (err) {
    console.error("[AI Oracle] Automated Gemini fallback:", err?.message || err);
    res.json({
      success: true,
      tip: isFa ? "\u062F\u06CC\u062F\u0647\u200C\u0628\u0627\u0646\u06CC \u0647\u0648\u0634\u0645\u0646\u062F: \u0627\u0632 \u0645\u0647\u0631\u0647\u200C\u0647\u0627\u06CC \u0633\u0628\u06A9 \u0628\u0631\u0627\u06CC \u062A\u0635\u0627\u062D\u0628 \u062E\u0627\u0646\u0647\u200C\u0647\u0627\u06CC \u0645\u06CC\u0627\u0646\u06CC \u0628\u0647\u0631\u0647 \u0628\u06AF\u06CC\u0631\u06CC\u062F \u0648 \u0634\u0627\u0647 \u0631\u0627 \u0628\u0627 \u0642\u0644\u0639\u0647\u200C\u0631\u0641\u062A\u0646 \u0645\u062D\u0627\u0641\u0638\u062A \u06A9\u0646\u06CC\u062F." : "Tactical hint: Secure the king via castling and keep knight outpost active."
    });
  }
});
var ambassadors = [
  {
    id: "amb-1",
    name: "\u06A9\u0648\u0631\u0648\u0634_\u0627\u06CC\u0631\u0627\u0646",
    referralsCount: 142,
    streakDays: 48,
    loyaltyPoints: 42500,
    tier: "supreme",
    tierNameFa: "\u0627\u0631\u06A9\u0627\u0646 \u0639\u0627\u0644\u06CC \u0647\u0645\u062C\u0647\u0627\u0646",
    badge: "\u{1F451}",
    isTrustee: true,
    ableCityParcelId: "ABLE-PRIME-001",
    ableCityDistrict: "\u0645\u0646\u0637\u0642\u0647 \u0633\u0644\u0637\u0646\u062A\u06CC \u0622\u067E\u0627\u062F\u0627\u0646\u0627 - \u0634\u0647\u0631 \u062A\u0648\u0627\u0646\u0627"
  },
  {
    id: "amb-2",
    name: "\u0628\u0627\u0646\u0648_\u0645\u06CC\u062A\u0631\u0627",
    referralsCount: 96,
    streakDays: 35,
    loyaltyPoints: 29800,
    tier: "minister",
    tierNameFa: "\u0648\u0632\u06CC\u0631 \u0648\u0641\u0627\u062F\u0627\u0631\u06CC",
    badge: "\u{1F48E}",
    isTrustee: true,
    ableCityParcelId: "ABLE-INNOV-014",
    ableCityDistrict: "\u067E\u0631\u062F\u06CC\u0633 \u0646\u0648\u0622\u0648\u0631\u06CC \u0648 \u0641\u0646\u0627\u0648\u0631\u06CC - \u0634\u0647\u0631 \u062A\u0648\u0627\u0646\u0627"
  },
  {
    id: "amb-3",
    name: "\u0622\u0628\u062A\u06CC\u0646_\u067E\u0627\u0631\u0633",
    referralsCount: 78,
    streakDays: 41,
    loyaltyPoints: 24200,
    tier: "minister",
    tierNameFa: "\u0648\u0632\u06CC\u0631 \u0648\u0641\u0627\u062F\u0627\u0631\u06CC",
    badge: "\u{1F3DB}\uFE0F",
    isTrustee: true,
    ableCityParcelId: "ABLE-CULTURE-029",
    ableCityDistrict: "\u0628\u0644\u0648\u0627\u0631 \u0641\u0631\u0647\u0646\u06AF \u0648 \u062A\u0645\u062F\u0646 - \u0634\u0647\u0631 \u062A\u0648\u0627\u0646\u0627"
  },
  {
    id: "amb-4",
    name: "Mandana_Queen",
    referralsCount: 65,
    streakDays: 28,
    loyaltyPoints: 19500,
    tier: "senior",
    tierNameFa: "\u0633\u0641\u06CC\u0631 \u0627\u0631\u0634\u062F",
    badge: "\u{1F478}",
    isTrustee: true,
    ableCityParcelId: "ABLE-WISDOM-044",
    ableCityDistrict: "\u0645\u0646\u0637\u0642\u0647 \u062F\u0627\u0646\u0634 \u0648 \u0627\u0646\u062F\u06CC\u0634\u0647 - \u0634\u0647\u0631 \u062A\u0648\u0627\u0646\u0627"
  },
  {
    id: "amb-5",
    name: "Aryo_Barzan",
    referralsCount: 54,
    streakDays: 22,
    loyaltyPoints: 16100,
    tier: "senior",
    tierNameFa: "\u0633\u0641\u06CC\u0631 \u0627\u0631\u0634\u062F",
    badge: "\u{1F6E1}\uFE0F",
    isTrustee: true,
    ableCityParcelId: "ABLE-TACTIC-063",
    ableCityDistrict: "\u0634\u0647\u0631\u06A9 \u0648\u0631\u0632\u0634\u06CC \u0634\u0637\u0631\u0646\u062C - \u0634\u0647\u0631 \u062A\u0648\u0627\u0646\u0627"
  }
];
var googleUsers = /* @__PURE__ */ new Map();
var playerAttendance = /* @__PURE__ */ new Map();
var playerLoyaltyState = /* @__PURE__ */ new Map();
function getAmbassadorTier(points, referrals) {
  if (points >= 25e3 || referrals >= 70) {
    return { tier: "supreme", nameFa: "\u0627\u0631\u06A9\u0627\u0646 \u0639\u0627\u0644\u06CC \u0647\u0645\u062C\u0647\u0627\u0646", nameEn: "Supreme Pillar of Hamjahan", badge: "\u{1F451}", isTrustee: true };
  } else if (points >= 15e3 || referrals >= 40) {
    return { tier: "minister", nameFa: "\u0648\u0632\u06CC\u0631 \u0648\u0641\u0627\u062F\u0627\u0631\u06CC", nameEn: "Minister of Loyalty", badge: "\u{1F48E}", isTrustee: true };
  } else if (points >= 7e3 || referrals >= 20) {
    return { tier: "senior", nameFa: "\u0633\u0641\u06CC\u0631 \u0627\u0631\u0634\u062F", nameEn: "Senior Ambassador", badge: "\u{1F396}\uFE0F", isTrustee: true };
  } else if (points >= 2500 || referrals >= 8) {
    return { tier: "benefactor", nameFa: "\u06CC\u0627\u0648\u0631 \u062A\u0645\u062F\u0646", nameEn: "Civilization Benefactor", badge: "\u{1F31F}", isTrustee: false };
  } else {
    return { tier: "ambassador", nameFa: "\u0633\u0641\u06CC\u0631 \u0635\u0644\u062D", nameEn: "Peace Ambassador", badge: "\u{1F54A}\uFE0F", isTrustee: false };
  }
}
app.post("/api/auth/google-register", (req, res) => {
  const { email, name, avatar, inviterCode } = req.body;
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "\u0622\u062F\u0631\u0633 \u0627\u06CC\u0645\u06CC\u0644 / \u062C\u06CC\u0645\u06CC\u0644 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
  }
  const cleanEmail = email.trim().toLowerCase();
  const userName = name && typeof name === "string" ? name.trim() : cleanEmail.split("@")[0];
  const userAvatar = avatar || "\u{1F451}";
  let user = googleUsers.get(cleanEmail);
  if (!user) {
    const prefix = cleanEmail.replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase() || "HAM";
    const code = `HAM-${prefix}-${Math.floor(1e3 + Math.random() * 9e3)}`;
    user = {
      email: cleanEmail,
      name: userName,
      avatar: userAvatar,
      referralCode: code,
      chessRating: 1420,
      chessXP: 1150,
      loyaltyEXP: 500,
      // Welcome Ambassador EXP bonus
      activeMinutes: 0,
      streakDays: 1,
      totalCheckins: 1,
      referralsCount: 0,
      registeredInvites: [],
      isTrustee: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (inviterCode && typeof inviterCode === "string") {
      const cleanInviter = inviterCode.trim().toUpperCase();
      if (cleanInviter !== code) {
        user.loyaltyEXP += 300;
      }
    }
    googleUsers.set(cleanEmail, user);
  } else {
    if (name) user.name = userName;
    if (avatar) user.avatar = userAvatar;
  }
  playerLoyaltyState.set(cleanEmail, {
    points: user.loyaltyEXP,
    referrals: user.referralsCount,
    code: user.referralCode,
    registeredInvites: user.registeredInvites,
    activeMinutes: user.activeMinutes
  });
  const tierInfo = getAmbassadorTier(user.loyaltyEXP, user.referralsCount);
  const isTrustee = tierInfo.isTrustee || user.loyaltyEXP >= 5e3 || user.referralsCount >= 10;
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
    messageFa: `\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u062C\u06CC\u0645\u06CC\u0644 \xAB${user.email}\xBB \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0641\u0639\u0627\u0644 \u0634\u062F. \u06A9\u062F \u0645\u0639\u0631\u0641 \u0627\u062E\u062A\u0635\u0627\u0635\u06CC \u0634\u0645\u0627: ${user.referralCode}`,
    messageEn: `Gmail profile "${user.email}" successfully verified. Your exclusive referral code: ${user.referralCode}`
  });
});
app.post("/api/loyalty/track-minute", (req, res) => {
  const { playerId, email, minutesToAdd } = req.body;
  const pId = email ? email.trim().toLowerCase() : playerId || "player_default";
  const count = typeof minutesToAdd === "number" && minutesToAdd > 0 && minutesToAdd <= 60 ? minutesToAdd : 1;
  let user = email ? googleUsers.get(pId) : null;
  let loyalty = playerLoyaltyState.get(pId);
  if (!loyalty) {
    loyalty = {
      points: 1200,
      referrals: 3,
      code: `CYRUS-${Math.floor(1e3 + Math.random() * 9e3)}`,
      registeredInvites: [],
      activeMinutes: 0
    };
  }
  loyalty.activeMinutes = (loyalty.activeMinutes || 0) + count;
  loyalty.points += count;
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
    messageFa: `+${count} \u0627\u0645\u062A\u06CC\u0627\u0632 EXP \u0628\u0627\u0628\u062A \u06F1 \u062F\u0642\u06CC\u0642\u0647 \u062D\u0636\u0648\u0631 \u0641\u0639\u0627\u0644 \u062F\u0631 \u0628\u0631\u0646\u0627\u0645\u0647 \u062B\u0628\u062A \u0634\u062F.`
  });
});
app.get("/api/loyalty/status", (req, res) => {
  const emailParam = req.query.email?.trim().toLowerCase();
  const playerId = emailParam || req.query.playerId || "player_default";
  const playerName = req.query.playerName || "\u0641\u0631\u0645\u0627\u0646\u062F\u0647_\u067E\u0627\u0631\u0633";
  const user = emailParam ? googleUsers.get(emailParam) : null;
  let loyalty = playerLoyaltyState.get(playerId);
  if (!loyalty) {
    loyalty = {
      points: user ? user.loyaltyEXP : 1200,
      referrals: user ? user.referralsCount : 3,
      code: user ? user.referralCode : `CYRUS-${Math.floor(1e3 + Math.random() * 9e3)}`,
      registeredInvites: user ? user.registeredInvites : ["\u0627\u0645\u06CC\u0631_\u0634\u0637\u0631\u0646\u062C", "\u0633\u0627\u0631\u0627_\u06A9\u06CC\u0634", "\u0628\u0627\u0628\u06A9_\u067E\u0627\u0631\u062A"],
      activeMinutes: user ? user.activeMinutes : 45
    };
    playerLoyaltyState.set(playerId, loyalty);
  }
  const attendance = playerAttendance.get(playerId) || {
    lastCheckinDate: "",
    streak: 3,
    totalCheckins: 14
  };
  const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const canCheckin = attendance.lastCheckinDate !== todayStr;
  const tierInfo = getAmbassadorTier(loyalty.points, loyalty.referrals);
  const isTrustee = tierInfo.isTrustee || loyalty.points >= 5e3 || loyalty.referrals >= 10;
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
      districtFa: "\u067E\u0631\u062F\u06CC\u0633 \u062F\u0627\u0646\u0627\u06CC\u06CC \u0648 \u0646\u0648\u0622\u0648\u0631\u06CC \u062F\u06CC\u062C\u06CC\u062A\u0627\u0644 - \u0634\u0647\u0631 \u0645\u062C\u0627\u0632\u06CC \u062A\u0648\u0627\u0646\u0627",
      districtEn: "Able City Digital Innovation & Wisdom Campus",
      coordinates: `35\xB042'18"N, 51\xB024'09"E - Metaverse Grid`,
      areaSqm: 500,
      zoningFa: "\u067E\u0631\u062F\u06CC\u0633 \u0646\u0648\u0622\u0648\u0631\u06CC\u060C \u062F\u0627\u0646\u0634\u060C \u0641\u0631\u0647\u0646\u06AF \u0648 \u062A\u0641\u06A9\u0631 \u0627\u0633\u062A\u0631\u0627\u062A\u0698\u06CC\u06A9 \u0645\u062C\u0627\u0632\u06CC",
      zoningEn: "Persian Virtual Innovation & Strategic Culture Campus",
      statusFa: "\u0642\u0648\u0644 \u0648 \u0631\u0632\u0631\u0648 \u0631\u0633\u0645\u06CC \u0627\u0647\u062F\u0627\u06CC \u0642\u0637\u0639\u0647 \u062F\u0631 \u0634\u0647\u0631 \u0645\u062C\u0627\u0632\u06CC \u062A\u0648\u0627\u0646\u0627",
      statusEn: "Official In-Game Virtual Land Allocation Pledge"
    }
  });
});
app.post("/api/loyalty/checkin", (req, res) => {
  const { playerId, playerName } = req.body;
  const pId = playerId || "player_default";
  const pName = playerName || "\u0641\u0631\u0645\u0627\u0646\u062F\u0647_\u067E\u0627\u0631\u0633";
  const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  let attendance = playerAttendance.get(pId);
  if (!attendance) {
    attendance = { lastCheckinDate: "", streak: 0, totalCheckins: 0 };
  }
  if (attendance.lastCheckinDate === todayStr) {
    return res.status(400).json({
      success: false,
      errorFa: "\u062D\u0636\u0648\u0631 \u0627\u0645\u0631\u0648\u0632 \u0634\u0645\u0627 \u0642\u0628\u0644\u0627\u064B \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062B\u0628\u062A \u0634\u062F\u0647 \u0627\u0633\u062A! \u0641\u0631\u062F\u0627 \u0628\u0631\u0627\u06CC \u062F\u0631\u06CC\u0627\u0641\u062A \u067E\u0627\u062F\u0627\u0634 \u0628\u0627\u0632\u06AF\u0631\u062F\u06CC\u062F.",
      errorEn: "Today\u2019s check-in has already been registered! Return tomorrow for your next reward."
    });
  }
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1e3).toISOString().slice(0, 10);
  let newStreak = attendance.lastCheckinDate === yesterday ? attendance.streak + 1 : 1;
  attendance.lastCheckinDate = todayStr;
  attendance.streak = newStreak;
  attendance.totalCheckins += 1;
  playerAttendance.set(pId, attendance);
  const dayInCycle = (newStreak - 1) % 7 + 1;
  const rewardTable = [
    { points: 100, coins: 20, description: "\u0631\u0648\u0632 \u06F1: \u067E\u0627\u062F\u0627\u0634 \u0622\u063A\u0627\u0632\u06CC\u0646 \u0647\u0645\u062C\u0647\u0627\u0646" },
    { points: 150, coins: 30, description: "\u0631\u0648\u0632 \u06F2: \u067E\u0627\u062F\u0627\u0634 \u0648\u0641\u0627\u062F\u0627\u0631\u06CC \u0645\u062F\u0627\u0648\u0645" },
    { points: 200, coins: 40, description: "\u0631\u0648\u0632 \u06F3: \u0634\u062A\u0627\u0628 \u0648\u0641\u0627\u062F\u0627\u0631\u06CC \u067E\u0627\u0631\u0633" },
    { points: 250, coins: 50, description: "\u0631\u0648\u0632 \u06F4: \u062F\u0631\u06CC\u06A9\u200C\u0647\u0627\u06CC \u0632\u0631\u06CC\u0646 \u0622\u067E\u0627\u062F\u0627\u0646\u0627" },
    { points: 300, coins: 65, description: "\u0631\u0648\u0632 \u06F5: \u0646\u0634\u0627\u0646 \u0627\u0641\u062A\u062E\u0627\u0631 \u062D\u0636\u0648\u0631 \u0645\u0633\u062A\u0645\u0631" },
    { points: 400, coins: 80, description: "\u0631\u0648\u0632 \u06F6: \u067E\u0627\u062F\u0627\u0634 \u0648\u06CC\u0698\u0647 \u067E\u06CC\u0634\u06AF\u0627\u0645\u0627\u0646" },
    { points: 600, coins: 150, description: "\u0631\u0648\u0632 \u06F7: \u0635\u0646\u062F\u0648\u0642\u0686\u0647 \u0627\u0641\u0633\u0627\u0646\u0647\u200C\u0627\u06CC \u0648\u0641\u0627\u062F\u0627\u0631\u0627\u0646 \u0648 \u0642\u0637\u0639\u0647 \u0627\u0639\u062A\u0628\u0627\u0631 \u0634\u0647\u0631 \u062A\u0648\u0627\u0646\u0627" }
  ];
  const reward = rewardTable[dayInCycle - 1];
  let loyalty = playerLoyaltyState.get(pId);
  if (!loyalty) {
    loyalty = {
      points: 1200,
      referrals: 3,
      code: `CYRUS-${Math.floor(1e3 + Math.random() * 9e3)}`,
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
    messageFa: `\u062D\u0636\u0648\u0631 \u0631\u0648\u0632 ${dayInCycle} \u062B\u0628\u062A \u0634\u062F! +${reward.points} \u0627\u0645\u062A\u06CC\u0627\u0632 \u0648\u0641\u0627\u062F\u0627\u0631\u06CC \u0648 +${reward.coins} \u062F\u0631\u06CC\u06A9 \u0632\u0631\u06CC\u0646 \u062F\u0631\u06CC\u0627\u0641\u062A \u06A9\u0631\u062F\u06CC\u062F.`,
    messageEn: `Day ${dayInCycle} check-in registered! +${reward.points} Loyalty Points and +${reward.coins} Darics awarded.`
  });
});
app.post("/api/loyalty/referral", (req, res) => {
  const { playerId, action, friendCode, friendName } = req.body;
  const pId = playerId || "player_default";
  let loyalty = playerLoyaltyState.get(pId);
  if (!loyalty) {
    loyalty = {
      points: 1200,
      referrals: 3,
      code: `CYRUS-${Math.floor(1e3 + Math.random() * 9e3)}`,
      registeredInvites: ["\u0627\u0645\u06CC\u0631_\u0634\u0637\u0631\u0646\u062C", "\u0633\u0627\u0631\u0627_\u06A9\u06CC\u0634", "\u0628\u0627\u0628\u06A9_\u067E\u0627\u0631\u062A"],
      activeMinutes: 0
    };
    playerLoyaltyState.set(pId, loyalty);
  }
  if (action === "submit_friend_code") {
    if (!friendCode || typeof friendCode !== "string") {
      return res.status(400).json({ error: "\u06A9\u062F \u0645\u0639\u0631\u0641 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A" });
    }
    const clean = friendCode.trim().toUpperCase();
    if (clean === loyalty.code) {
      return res.status(400).json({
        errorFa: "\u0646\u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F \u0627\u0632 \u06A9\u062F \u0645\u0639\u0631\u0641 \u0634\u062E\u0635\u06CC \u062E\u0648\u062F\u062A\u0627\u0646 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F.",
        errorEn: "You cannot use your own referral code."
      });
    }
    const bonusPoints = 400;
    const bonusCoins = 100;
    loyalty.points += bonusPoints;
    playerLoyaltyState.set(pId, loyalty);
    return res.json({
      success: true,
      messageFa: `\u06A9\u062F \u0645\u0639\u0631\u0641 \xAB${clean}\xBB \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u062B\u0628\u062A \u0634\u062F! +${bonusPoints} \u0627\u0645\u062A\u06CC\u0627\u0632 \u0648\u0641\u0627\u062F\u0627\u0631\u06CC \u0648 +${bonusCoins} \u062F\u0631\u06CC\u06A9 \u0632\u0631\u06CC\u0646 \u0628\u0647 \u0634\u0645\u0627 \u0647\u062F\u06CC\u0647 \u062F\u0627\u062F\u0647 \u0634\u062F.`,
      messageEn: `Referral code "${clean}" successfully registered! +${bonusPoints} Loyalty Points and +${bonusCoins} Darics added.`,
      rewardPoints: bonusPoints,
      rewardCoins: bonusCoins,
      totalPoints: loyalty.points
    });
  }
  const newInviteName = friendName || `\u0641\u0631\u0645\u0627\u0646\u062F\u0647_\u062C\u062F\u06CC\u062F_${loyalty.referrals + 1}`;
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
    messageFa: `\u062F\u0639\u0648\u062A \u0627\u0632 \xAB${newInviteName}\xBB \u062B\u0628\u062A \u0634\u062F! +${invitePoints} \u0627\u0645\u062A\u06CC\u0627\u0632 \u0645\u0639\u0631\u0641 \u0648 +${inviteCoins} \u062F\u0631\u06CC\u06A9 \u0632\u0631\u06CC\u0646 \u0627\u0641\u0632\u0648\u062F\u0647 \u0634\u062F.`,
    messageEn: `Invite of "${newInviteName}" registered! +${invitePoints} Points and +${inviteCoins} Darics added.`
  });
});
app.get("/api/loyalty/leaderboard", (req, res) => {
  const topChessLeaders = [...leaderboard].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const topAmbassadors = [...ambassadors].sort((a, b) => b.loyaltyPoints - a.loyaltyPoints);
  const trustees = [
    {
      role: "\u0631\u0626\u06CC\u0633 \u0634\u0648\u0631\u0627\u06CC \u0639\u0627\u0644\u06CC \u0648 \u0647\u06CC\u0626\u062A \u0627\u0645\u0646\u0627",
      titleEn: "Supreme Council President",
      name: "\u06A9\u0648\u0631\u0648\u0634_\u0627\u06CC\u0631\u0627\u0646",
      reasonFa: "\u0635\u062F\u0631\u0646\u0634\u06CC\u0646 \u0644\u06CC\u06AF \u0634\u0637\u0631\u0646\u062C \u06A9\u0648\u0631\u0648\u0634 \u0628\u0632\u0631\u06AF \u0648 \u067E\u06CC\u0634\u06AF\u0627\u0645 \u0644\u06CC\u06AF \u0648\u0641\u0627\u062F\u0627\u0631\u06CC",
      reasonEn: "Leader of Cyrus Chess League & Loyalty Pioneer",
      badge: "\u{1F451}",
      landParcel: "ABLE-PRIME-001"
    },
    {
      role: "\u0639\u0636\u0648 \u0647\u06CC\u0626\u062A \u0627\u0645\u0646\u0627 (\u0646\u0645\u0627\u06CC\u0646\u062F\u0647 \u0627\u0633\u062A\u0627\u062F\u0627\u0646 \u0634\u0637\u0631\u0646\u062C)",
      titleEn: "Trustee Member (Chess Masters Envoy)",
      name: "Mandana_Queen",
      reasonFa: "\u0627\u0633\u062A\u0627\u062F \u0628\u0631\u062A\u0631 \u0644\u06CC\u06AF \u0645\u0627\u0646\u062F\u0627\u0646\u0627 \u0648 \u0645\u062F\u0627\u0641\u0639 \u0628\u0631\u062A\u0631 \u062A\u0627\u06A9\u062A\u06CC\u06A9\u200C\u0647\u0627\u06CC \u0641\u0631\u0647\u0646\u06AF\u06CC",
      reasonEn: "Top Master of Mandana League & Tactical Strategist",
      badge: "\u{1F478}",
      landParcel: "ABLE-WISDOM-044"
    },
    {
      role: "\u0639\u0636\u0648 \u0647\u06CC\u0626\u062A \u0627\u0645\u0646\u0627 (\u0646\u0645\u0627\u06CC\u0646\u062F\u0647 \u0627\u0631\u0634\u062F \u0645\u0639\u0631\u0641\u0627\u0646 \u0648 \u0648\u0641\u0627\u062F\u0627\u0631\u0627\u0646)",
      titleEn: "Trustee Member (Ambassadors & Loyalty Envoy)",
      name: "\u0628\u0627\u0646\u0648_\u0645\u06CC\u062A\u0631\u0627",
      reasonFa: "\u0628\u06CC\u0634 \u0627\u0632 \u06F9\u06F6 \u062F\u0639\u0648\u062A \u0645\u0648\u0641\u0642 \u0648 \u06F3\u06F5 \u0631\u0648\u0632 \u0627\u0633\u062A\u0631\u06CC\u06A9 \u0645\u062F\u0627\u0648\u0645 \u062D\u0636\u0648\u0631",
      reasonEn: "Over 96 successful invites & 35 days check-in streak",
      badge: "\u{1F48E}",
      landParcel: "ABLE-INNOV-014"
    },
    {
      role: "\u0639\u0636\u0648 \u0647\u06CC\u0626\u062A \u0627\u0645\u0646\u0627 (\u062F\u06CC\u062F\u0647\u200C\u0628\u0627\u0646 \u062A\u0645\u062F\u0646\u200C\u0647\u0627\u06CC \u06A9\u0647\u0646)",
      titleEn: "Trustee Member (Heritage Warden)",
      name: "\u0622\u0628\u062A\u06CC\u0646_\u067E\u0627\u0631\u0633",
      reasonFa: "\u06F7\u06F8 \u0645\u0639\u0631\u0641\u06CC \u0641\u0639\u0627\u0644 \u0648 \u06A9\u0633\u0628 \u0646\u0634\u0627\u0646 \u0632\u0631\u06CC\u0646 \u0648\u0641\u0627\u062F\u0627\u0631\u06CC",
      reasonEn: "78 active referrals & Golden Loyalty Medal",
      badge: "\u{1F3DB}\uFE0F",
      landParcel: "ABLE-CULTURE-029"
    },
    {
      role: "\u0639\u0636\u0648 \u0647\u06CC\u0626\u062A \u0627\u0645\u0646\u0627 (\u0646\u0645\u0627\u06CC\u0646\u062F\u0647 \u062F\u0644\u0627\u0648\u0631\u0627\u0646 \u062C\u0648\u0627\u0646)",
      titleEn: "Trustee Member (Youth Vanguard)",
      name: "Aryo_Barzan",
      reasonFa: "\u067E\u06CC\u0634\u062A\u0627\u0632 \u0644\u06CC\u06AF \u062F\u0627\u0631\u06CC\u0648\u0634 \u0648 \u0633\u0641\u06CC\u0631 \u062F\u0644\u0627\u0648\u0631\u06CC \u0647\u0645\u062C\u0647\u0627\u0646",
      reasonEn: "Darius League Vanguard & Valor Ambassador",
      badge: "\u2694\uFE0F",
      landParcel: "ABLE-TACTIC-063"
    }
  ];
  res.json({
    success: true,
    ambassadors: topAmbassadors,
    trustees,
    topChessLeaders,
    ableCityMetadata: {
      cityName: "\u0634\u0647\u0631 \u062A\u0648\u0627\u0646\u0627 (Able City)",
      twinCities: {
        hamrazFa: "\u0634\u0647\u0631 \u0645\u062C\u0627\u0632\u06CC \u0647\u0645\u0631\u0627\u0632 (\u06F6\u06F5\u06F0,\u06F0\u06F0\u06F0 \u0645\u062A\u0631 \u0645\u0631\u0628\u0639)",
        afrenaFa: "\u0634\u0647\u0631 \u0645\u062C\u0627\u0632\u06CC \u0622\u0641\u0631\u06CC\u0646\u0627 (\u06F6\u06F5\u06F0,\u06F0\u06F0\u06F0 \u0645\u062A\u0631 \u0645\u0631\u0628\u0639)",
        totalAreaFa: "\u06F1,\u06F3\u06F0\u06F0,\u06F0\u06F0\u06F0 \u0645\u062A\u0631 \u0645\u0631\u0628\u0639 \u0645\u062A\u0627\u0648\u0631\u0633 \u0645\u062C\u0627\u0632\u06CC"
      },
      ecosystemAppsCount: 35,
      roadmap: {
        phase1Fa: "\u0641\u0627\u0632 \u06F1 (\u06F1\u06F0,\u06F0\u06F0\u06F0+ \u062F\u0627\u0646\u0644\u0648\u062F): \u0645\u0639\u0631\u0641\u06CC \u0627\u0631\u0632 \u0648 \u06AF\u06CC\u0645 \u062F\u0627\u062E\u0644\u06CC \u0627\u06A9\u0648\u0633\u06CC\u0633\u062A\u0645",
        phase2Fa: "\u0641\u0627\u0632 \u06F2 (\u06F5\u06F0,\u06F0\u06F0\u06F0+ \u062F\u0627\u0646\u0644\u0648\u062F \u0648 \u06F6\u06F0\u066A \u0648\u0627\u06AF\u0630\u0627\u0631\u06CC \u0632\u0645\u06CC\u0646): \u0627\u0631\u0632 \u062F\u06CC\u062C\u06CC\u062A\u0627\u0644 \u062C\u0647\u0627\u0646\u06CC \u0648 \u06AF\u06CC\u0645 \u0633\u0647\u200C\u0628\u0639\u062F\u06CC 3D Metaverse"
      },
      descriptionFa: "\u0634\u0647\u0631 \u06A9\u0627\u0645\u0644\u0627\u064B \u0645\u062C\u0627\u0632\u06CC \u062A\u0648\u0627\u0646\u0627 \u0645\u062A\u0634\u06A9\u0644 \u0627\u0632 \u062F\u0648 \u0634\u0647\u0631 \u0647\u0645\u0631\u0627\u0632 \u0648 \u0622\u0641\u0631\u06CC\u0646\u0627 \u0628\u0647 \u0648\u0633\u0639\u062A \u0645\u062C\u0645\u0648\u0639 \u06F1,\u06F3\u06F0\u06F0,\u06F0\u06F0\u06F0 \u0645\u062A\u0631 \u0645\u0631\u0628\u0639 \u062F\u0631 \u0627\u06A9\u0648\u0633\u06CC\u0633\u062A\u0645 \u06F3\u06F5 \u0628\u0631\u0646\u0627\u0645\u0647\u200C\u0627\u06CC\u060C \u0628\u062F\u0648\u0646 \u0627\u062F\u0639\u0627\u06CC \u0645\u0644\u06A9\u06CC \u0641\u06CC\u0632\u06CC\u06A9\u06CC \u06CC\u0627 \u0633\u0646\u062F \u062A\u06A9\u200C\u0628\u0631\u06AF.",
      descriptionEn: "The purely virtual smart metaverse of Able City comprising twin cities Hamraz and Afrena (1,300,000 m\xB2 total) across a 35-app ecosystem.",
      totalParcelsAllocated: 1240,
      availableParcelsForTrustees: 500,
      foundationYear: "2026"
    }
  });
});
async function setupServer() {
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.resolve(__dirname, "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.resolve(distPath, "index.html"));
    });
  }
  app.listen(port, "0.0.0.0", () => {
    console.log(`[Worldplay Engine] Server running on http://0.0.0.0:${port}`);
  });
}
setupServer().catch((err) => {
  console.error("[Worldplay Engine] Startup error:", err);
});
