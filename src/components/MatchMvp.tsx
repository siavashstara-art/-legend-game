import React from 'react';
import { Trophy, Award, Sparkles, Flame, Zap } from 'lucide-react';
import { Color, PieceStyle } from '../types/chess.ts';
import { ChessPiece } from './ChessPiece.tsx';

interface MatchMvpProps {
  winner: Color;
  totalMoves: number;
  pieceStyle: PieceStyle;
  enableMetallurgy: boolean;
  lang?: string;
}

export const MatchMvp: React.FC<MatchMvpProps> = ({
  winner,
  totalMoves,
  pieceStyle,
  enableMetallurgy,
  lang = 'fa'
}) => {
  const isFa = lang === 'fa';

  // Dynamic tactical MVP evaluation based on game length and winner
  const mvpPiece = totalMoves < 20 ? 'q' : totalMoves < 40 ? 'n' : 'r';
  const mvpTitleFa = totalMoves < 20 
    ? 'ملکه کیمیایی؛ قربانی و مات حماسی در خط آتش' 
    : totalMoves < 40 
    ? 'اسب زرین؛ جهش تاکتیکی و محاصره شاه' 
    : 'رخ پولادین؛ تسخیر نهایی ستاره‌های پادشاهی';

  const mvpTitleEn = totalMoves < 20
    ? 'Alchemical Queen; Decisive Sacrifice & Mate in the Fireline'
    : totalMoves < 40
    ? 'Golden Knight; Tactical Leap & Royal Checkmate'
    : 'Damascus Rook; Final Fortress Domination';

  return (
    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/70 via-stone-900 to-amber-950/70 border border-amber-500/50 shadow-lg space-y-2 text-right dir-rtl">
      <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Award size={18} className="animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-black text-amber-300 block">
              {isFa ? 'مهره برتر نبرد (Match MVP)' : 'Match MVP Evaluation'}
            </span>
            <span className="text-[10px] text-stone-400 font-mono">
              {isFa ? 'تحلیل هوشمند تأثیرگذارترین مهره در رزم' : 'AI-Powered Impactful Piece Analysis'}
            </span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
          ⭐ MVP Star
        </span>
      </div>

      {/* MVP Piece Display & Title */}
      <div className="flex items-center gap-3 pt-1">
        <div className="w-12 h-12 rounded-xl bg-stone-950 border-2 border-amber-400/80 shadow-xl flex items-center justify-center shrink-0">
          <ChessPiece type={mvpPiece as any} color={winner} style={pieceStyle} enableMetallurgy={enableMetallurgy} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-amber-200 truncate leading-snug">
            {isFa ? mvpTitleFa : mvpTitleEn}
          </h4>
          <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed">
            {isFa
              ? `این مهره با کلیدی‌ترین حرکت در حرکت شماره ${totalMoves}، سرنوشت میدان را رقم زد و عنوان ارزشمندترین مهره نبرد (MVP) را به خود اختصاص داد.`
              : `This piece delivered the most impactful tactical breakthrough at move ${totalMoves}, earning the prestigious Match MVP title.`}
          </p>
        </div>
      </div>
    </div>
  );
};
