import React, { useState } from 'react';
import { Trophy, Share2, Copy, Check, RotateCcw, X, Sparkles } from 'lucide-react';
import { PieceStyle, BoardTheme, Color, Language } from '../types/chess.ts';
import { CIVILIZATIONS } from '../utils/civilizations.ts';
import { ChessPiece } from './ChessPiece.tsx';
import { MatchMvp } from './MatchMvp.tsx';

interface VictoryCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  winner: Color; // 'w' or 'b'
  totalMoves: number;
  gameDurationSeconds: number;
  capturedCount: number;
  pieceStyle: PieceStyle;
  boardTheme: BoardTheme;
  enableMetallurgy: boolean;
  onNewGame: () => void;
  lang: Language;
}

export const VictoryCardModal: React.FC<VictoryCardModalProps> = ({
  isOpen,
  onClose,
  winner,
  totalMoves,
  gameDurationSeconds,
  capturedCount,
  pieceStyle,
  enableMetallurgy,
  onNewGame,
  lang
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isFa = lang === 'fa';
  const currentCiv = CIVILIZATIONS.find(c => c.id === pieceStyle) || CIVILIZATIONS[0];

  const winnerTitleFa = winner === 'w' ? 'سپاه زرین پیروز نبرد شد' : 'سپاه سیمین پیروز نبرد شد';
  const winnerTitleEn = winner === 'w' ? 'Golden Army Crowned Victorious' : 'Silver Army Crowned Victorious';

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const shareText = isFa
    ? `🏆 نبرد اساطیری ملل در همجهان شطرنج!
👑 فاتح: ${winnerTitleFa} به رهبری ${currentCiv.kingNameFa}
🌍 تمدن: ${currentCiv.nameFa} (${currentCiv.flag})
⚔️ تعداد حرکات: ${totalMoves} | زمان نبرد: ${formatTime(gameDurationSeconds)}
⚗️ عناصر کیمیاگری: شاه طلایی، ملکه نقره‌ای، فیل برنزی، اسب چوبی، رخ آلومینیوم، پیاده آهن
شما هم به آوردگاه اساطیر جهان بپیوندید!`
    : `🏆 Epic Battle of Mythological Civilizations on Worldplay Chess!
👑 Victor: ${winnerTitleEn} led by ${currentCiv.kingNameEn}
🌍 Realm: ${currentCiv.nameEn} (${currentCiv.flag})
⚔️ Total Moves: ${totalMoves} | Battle Time: ${formatTime(gameDurationSeconds)}
⚗️ Alchemical Metallurgy: Gold King, Silver Queen, Bronze Bishop, Wood Knight, Aluminum Rook, Iron Pawn!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n' + window.location.href)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#181310] border-2 border-amber-500/60 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-40 bg-amber-500/20 blur-3xl pointer-events-none rounded-full" />

        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-[#3a322b] relative z-10">
          <div className="flex items-center gap-2 text-amber-300 font-black text-sm sm:text-base">
            <Trophy size={20} className="text-amber-400 animate-bounce" />
            <span>{isFa ? 'کارت شاهانه پیروزی و افتخار نبرد' : 'Royal Victory & Honor Showcase'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 relative z-10 flex-1">
          {/* Main Visual Emblem */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/50 via-stone-900/90 to-[#221a14] border border-amber-500/40 text-center shadow-inner relative overflow-hidden">
            <div className="absolute top-2 right-2 text-3xl opacity-20 pointer-events-none">
              {currentCiv.flag}
            </div>

            {/* Victorious King & Queen Showcase */}
            <div className="flex justify-center items-end gap-3 mb-3">
              <div className="w-14 h-14 p-1 rounded-2xl bg-stone-900/90 border border-slate-400/40 shadow-lg flex items-center justify-center">
                <ChessPiece type="q" color={winner} style={pieceStyle} enableMetallurgy={enableMetallurgy} />
              </div>
              <div className="w-20 h-20 p-1.5 rounded-2xl bg-stone-900/95 border-2 border-amber-400 shadow-xl flex items-center justify-center scale-105">
                <ChessPiece type="k" color={winner} style={pieceStyle} enableMetallurgy={enableMetallurgy} />
              </div>
              <div className="w-14 h-14 p-1 rounded-2xl bg-stone-900/90 border border-amber-600/40 shadow-lg flex items-center justify-center">
                <ChessPiece type="r" color={winner} style={pieceStyle} enableMetallurgy={enableMetallurgy} />
              </div>
            </div>

            {/* Banner Titles */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono mb-2">
              <Sparkles size={13} />
              <span>{isFa ? 'مات و پیروزی قاطع اساطیری' : 'Decisive Mythic Checkmate'}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-amber-300 tracking-wide">
              {isFa ? winnerTitleFa : winnerTitleEn}
            </h3>

            <p className="text-xs text-amber-200/90 font-medium mt-1">
              👑 {isFa ? currentCiv.kingNameFa : currentCiv.kingNameEn}
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5">
              🌍 {isFa ? currentCiv.nameFa : currentCiv.nameEn} {currentCiv.flag}
            </p>

            {/* Battle Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-amber-500/30 text-center">
              <div className="p-2 rounded-xl bg-black/40 border border-stone-800">
                <div className="text-[10px] text-stone-400">{isFa ? 'حرکات نبرد' : 'Total Moves'}</div>
                <div className="text-sm sm:text-base font-black text-amber-300">{totalMoves}</div>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-stone-800">
                <div className="text-[10px] text-stone-400">{isFa ? 'زمان رزم' : 'Duration'}</div>
                <div className="text-sm sm:text-base font-black text-emerald-400">{formatTime(gameDurationSeconds)}</div>
              </div>
              <div className="p-2 rounded-xl bg-black/40 border border-stone-800">
                <div className="text-[10px] text-stone-400">{isFa ? 'مهره‌های تسخیر' : 'Captures'}</div>
                <div className="text-sm sm:text-base font-black text-rose-400">{capturedCount}</div>
              </div>
            </div>

            {/* Alchemical Metallurgy Badge */}
            {enableMetallurgy && (
              <div className="mt-3 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-200 flex items-center justify-center gap-1.5 font-medium">
                <span>⚗️</span>
                <span>
                  {isFa
                    ? 'پوسته کیمیاگری فعال: شاه طلا، ملکه نقره، فیل برنز، اسب چوب، رخ آلومینیوم، پیاده آهن'
                    : 'Alchemical Elements Active: Gold King, Silver Queen, Bronze Bishop, Wood Knight, Aluminum Rook, Iron Pawn'}
                </span>
              </div>
            )}
          </div>

          {/* Match MVP Evaluation Card */}
          <MatchMvp
            winner={winner}
            totalMoves={totalMoves}
            pieceStyle={pieceStyle}
            enableMetallurgy={enableMetallurgy}
            lang={lang}
          />

          {/* Social Share Action Buttons */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
              <Share2 size={14} className="text-amber-400" />
              <span>{isFa ? 'اشتراک‌گذاری افتخار در شبکه‌های اجتماعی:' : 'Share Your Victory Badge:'}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#2a231d] hover:bg-[#382f27] border border-amber-600/50 text-amber-300 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? (isFa ? 'کپی شد ✓' : 'Copied!') : (isFa ? 'کپی متن' : 'Copy')}</span>
              </button>

              <button
                onClick={handleShareTelegram}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-sky-700/80 hover:bg-sky-600 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer shadow"
              >
                <span>تلگرام</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer shadow"
              >
                <span>واتساپ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#3a322b] bg-[#14100d] flex items-center justify-between gap-3 relative z-10">
          <button
            onClick={() => {
              onClose();
              onNewGame();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-black text-xs sm:text-sm transition-all active:scale-98 cursor-pointer shadow-lg shadow-amber-900/30"
          >
            <RotateCcw size={16} />
            <span>{isFa ? 'آغاز نبرد حماسی نو' : 'Start Next Epic Battle'}</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-[#2a231d] hover:bg-[#342b23] text-stone-300 font-bold text-xs transition-colors cursor-pointer"
          >
            {isFa ? 'بستن کارت' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
