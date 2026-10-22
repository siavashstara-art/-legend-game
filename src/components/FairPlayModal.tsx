import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Scale, CheckCircle2, X, Lock, Flame, Ban, Award } from 'lucide-react';
import { Language } from '../types/chess.ts';

interface FairPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcceptOath?: () => void;
  lang: Language;
}

export const FairPlayModal: React.FC<FairPlayModalProps> = ({
  isOpen,
  onClose,
  onAcceptOath,
  lang
}) => {
  const [pledged, setPledged] = useState<boolean>(() => {
    return localStorage.getItem('worldplay_fairplay_pledged') === 'true';
  });
  const [agreedCheckbox, setAgreedCheckbox] = useState<boolean>(pledged);

  if (!isOpen) return null;

  const isFa = lang === 'fa';
  const isTg = lang === 'tg';

  const handleConfirm = () => {
    localStorage.setItem('worldplay_fairplay_pledged', 'true');
    setPledged(true);
    if (onAcceptOath) onAcceptOath();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#191410] border-2 border-emerald-500/80 rounded-2xl max-w-xl w-full flex flex-col shadow-2xl overflow-hidden max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-[#423325] bg-gradient-to-r from-[#17261c] via-[#1a1c18] to-[#261e15]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <ShieldAlert size={22} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base sm:text-lg font-black text-amber-300">
                  {isFa 
                    ? 'منشور بازی جوانمردانه و سوگند پهلوانی' 
                    : isTg 
                    ? 'Оиномаи бозии ҷавонмардӣ ва савганди шоҳӣ'
                    : 'Imperial Fair Play & Anti-Cheat Decree'}
                </h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                  Fair Play 🛡️
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                {isFa 
                  ? 'قوانین انضباطی، صیانت از راستی و اخراج متخلفان از لیگ‌ها' 
                  : isTg
                  ? 'Қоидаҳои одоби бозӣ ва манъи истифодаи фиреб'
                  : 'Zero Tolerance for AI Engines, Cheats & Assistance'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            title="بستن"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm text-stone-300">
          
          {/* Main Warning Box */}
          <div className="bg-gradient-to-r from-red-950/50 via-[#2a1313] to-red-950/50 border-2 border-red-500/60 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-red-300 font-bold text-xs sm:text-sm">
              <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
              <span>
                {isFa 
                  ? 'اخطار قطعی دیوان نظارت بر مسابقات و لیگ‌های همجهان:' 
                  : isTg 
                  ? 'Огоҳии қатъии девони назорати мусобиқот:'
                  : 'Official Anti-Cheat & League Integrity Notice:'}
              </span>
            </div>
            <p className="text-xs text-red-100/90 leading-relaxed">
              {isFa
                ? 'هرگونه استفاده از موتورهای هوش مصنوعی (مانند استاک‌فیش، لایچس و چس‌کام)، نرم‌افزارهای کمکی یا دریافت مشاوره از اشخاص ثالث در حین بازی، اکیداً ممنوع بوده و نقض منشور اخلاقی شطرنج کهن محسوب می‌شود.'
                : isTg
                ? 'Ҳар гуна истифода аз муҳаррикҳои ҳуши сунъӣ (Stockfish ва дигар нармафзорҳо) ва кӯмаки шахсони дигар ҳангоми бозӣ қатъиян манъ аст.'
                : 'The use of AI chess engines (e.g. Stockfish), third-party assistance, or external analytical tools during matches is strictly prohibited.'}
            </p>
          </div>

          {/* Strict Penalties Box */}
          <div className="bg-[#211914] border border-[#4a3929] rounded-xl p-3.5 space-y-2.5">
            <h4 className="font-bold text-amber-300 text-xs sm:text-sm flex items-center gap-1.5">
              <Ban size={16} className="text-amber-400" />
              <span>
                {isFa 
                  ? 'عواقب و ضمانت‌های اجرایی در صورت احراز تخلف:' 
                  : isTg
                  ? 'Оқибатҳо дар сурати ошкор шудани фиреб:'
                  : 'Strict Penalties Upon Infraction:'}
              </span>
            </h4>
            
            <ul className="space-y-2 text-xs text-stone-300 pr-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                <span>
                  {isFa
                    ? 'اخراج فوری و دائمی از تمام لیگ‌های سلطنتی (لیگ کوروش، سلیمان، سامانیان و المپ).'
                    : isTg
                    ? 'Хориҷ кардани фаврӣ ва ҳамешагӣ аз тамоми лигаҳои шоҳӣ.'
                    : 'Immediate and permanent expulsion from all Imperial Leagues & tourneys.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                <span>
                  {isFa
                    ? 'صفر شدن و ابطال کامل امتیازات ریتینگ (ELO)، سکه‌های دریک و نشان‌های شایستگی.'
                    : isTg
                    ? 'Бекор кардани холҳои рейтинг (ELO), дирамҳо ва медалҳои бадастомада.'
                    : 'Total nullification of ELO ratings, Daric coin balances, and honor badges.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                <span>
                  {isFa
                    ? 'مسدودسازی قطعی حساب کاربری و شناسه دستگاه از ورود به تمامی بخش‌های بازی.'
                    : isTg
                    ? 'Бастани ҳисоби корбар ва дастгоҳ аз воридшавӣ ба бозӣ.'
                    : 'Permanent ban of user profile and device identifier.'}
                </span>
              </li>
            </ul>
          </div>

          {/* Philosophy of Ancient Honor */}
          <div className="bg-gradient-to-r from-emerald-950/30 to-amber-950/30 border border-emerald-600/30 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs">
              <Scale size={15} />
              <span>
                {isFa 
                  ? 'فلسفه راستی و اصالت شطرنج (چترنگ) در تمدن باستان:' 
                  : isTg
                  ? 'Фалсафаи ростии чатранг дар тамаддуни ориёӣ:'
                  : 'The Sovereign Code of Non-Violent Honor:'}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-300 leading-relaxed">
              {isFa
                ? 'شطرنج کهن از روزگار کوروش بزرگ و عصر سامانیان، پیمانی میان دو اندیشه بر پایه راستی، خرد و سنجش هوشمندی بدون تزویر بوده است. پیروزی با تقلب، فاقد هرگونه ارزش پهلوانی و انسانی است.'
                : isTg
                ? 'Чатранг аз замони Куруши Кабир ва аҳди Сомониён паймони хирад ва ростист. Ғалаба бо фиреб ҳеҷ арзиши паҳлавонӣ надорад.'
                : 'Since the eras of Cyrus the Great and the Samanids, chess has stood as a battle of genuine intellect, wisdom, and chivalry. Victory through deception is devoid of nobility.'}
            </p>
          </div>

          {/* Interactive Pledge Checkbox */}
          <div className="bg-[#17120e] border border-amber-500/40 rounded-xl p-3 flex items-start gap-3">
            <input
              id="fairplay-checkbox"
              type="checkbox"
              checked={agreedCheckbox}
              onChange={e => setAgreedCheckbox(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-700 bg-stone-900 cursor-pointer"
            />
            <label htmlFor="fairplay-checkbox" className="text-xs text-stone-200 cursor-pointer leading-relaxed select-none">
              <span className="font-bold text-amber-300 block mb-0.5">
                {isFa 
                  ? 'سوگند پهلوانی و پایبندی به بازی جوانمردانه (Fair Play):' 
                  : isTg
                  ? 'Савганди ҷавонмардӣ ба бозии пок:'
                  : 'The Sovereign Fair Play Pledge:'}
              </span>
              <span>
                {isFa
                  ? '«اینجانب با شرافت خود متعهد می‌شوم که تنها با اتکا به ذهن و خرد خود بازی کنم و از هیچ‌گونه هوش مصنوعی، ربات یا شخص دیگری کمک نگیرم؛ و مسئولیت عواقب تخلف را به طور کامل می‌پذیرم.»'
                  : isTg
                  ? '«Ман ба шарафи худ қавл медиҳам, ки танҳо бо ақли худ бозӣ карда, аз ҳеҷ гуна ҳуши сунъӣ ё кумаки дигарон истифода набарам.»'
                  : '"I solemnly swear upon my honor to play solely by my own intellect, with zero assistance from AI engines or external players, accepting full expulsion if broken."'}
              </span>
            </label>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 border-t border-[#423325] bg-[#1a140f] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium text-xs cursor-pointer transition-colors"
          >
            {isFa ? 'انصراف' : 'Cancel'}
          </button>

          <button
            onClick={handleConfirm}
            disabled={!agreedCheckbox}
            className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
              agreedCheckbox
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-stone-950 cursor-pointer shadow-emerald-950/40'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
            }`}
          >
            <ShieldCheck size={18} />
            <span>
              {isFa 
                ? 'پذیرش سوگند و ورود به میدان نبرد پاک' 
                : isTg
                ? 'Қабули савганд ва воридшавӣ ба бозӣ'
                : 'Accept Oath & Enter Match'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
