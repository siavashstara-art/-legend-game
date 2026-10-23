import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Film,
  Music,
  Crown,
  Globe2,
  Tv,
  CheckCircle2,
  ExternalLink,
  Zap,
  Volume2,
  VolumeX
} from 'lucide-react';
import { playMetallicClashSound, playVictoryFanfare, playBoosterSound } from '../utils/audio';

interface PromoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: string;
}

interface VideoScene {
  id: number;
  startTime: number;
  endTime: number;
  title: string;
  voiceover: string;
  visualDescription: string;
  cameraAction: string;
  badge: string;
  color: string;
}

const SCENES: VideoScene[] = [
  {
    id: 1,
    startTime: 0,
    endTime: 6,
    title: 'شکوه شطرنج هخامنشی و متریال‌های کیمیایی',
    voiceover: 'آیا آماده‌اید تجربه شطرنج را به سطحی فراتر از زمان ببرید؟ همجهان شطرنج با متریال‌های کیمیای مقدس!',
    visualDescription: 'چرخش ۳۶۰ درجه دوربین حول صفحه ۳ بعدی آپادانا، مهره‌های طلای ۲۴ عیار، نقره استرلینگ و پایه‌های مرمر عاجی و بازالت سیاه.',
    cameraAction: 'سینماتیک کم‌ارتفاع با نورپردازی متالیک و درخشش زمردی/یاقوتی',
    badge: 'طراحی ۳ بعدی نوین',
    color: 'from-amber-500/20 to-yellow-600/20 border-amber-500/40'
  },
  {
    id: 2,
    startTime: 6,
    endTime: 12,
    title: 'مشاور هوشمند گرندمستر (هوش مصنوعی)',
    voiceover: 'با هوش مصنوعی پیشرفته هوش‌افزا، تحلیل آنی تاکتیک‌ها و مشاوره استراتژیک را در هر لحظه تجربه کنید.',
    visualDescription: 'نمایش افکت‌های نوری دور مهره‌ها، مشاوره زنده اوراکل هوش مصنوعی و نمایش بهترین حرکت استراتژیک روی صفحه.',
    cameraAction: 'زوم نرم روی خانه شاه و فعال شدن هاله‌های تاکتیکی',
    badge: 'هوش مصنوعی Gemini',
    color: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/40'
  },
  {
    id: 3,
    startTime: 12,
    endTime: 18,
    title: 'آکادمی جذاب آموزش و پاداش داریک',
    voiceover: 'در آکادمی تعاملی آموزش ببینید، معماها را حل کنید و با هر درس پاداش سکه‌های داریک دریافت کنید.',
    visualDescription: 'نمایش محیط آکادمی، کارت‌های دروس تعاملی، انیمیشن دریافت ۱۰۰ سکه داریک و افزایش امتیاز EXP بازیکن.',
    cameraAction: 'انتقال سریع از صفحه بازی به کارت‌های پاداش آکادمی',
    badge: 'یادگیری گیمیفای‌شده',
    color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/40'
  },
  {
    id: 4,
    startTime: 18,
    endTime: 24,
    title: 'متاورس قادرشهر و لیگ سفیران',
    voiceover: 'به متاورس قادرشهر بپیوندید، سند وثیقه زمین مجازی دریافت کنید و در لیگ سفیران به صعود بپردازید!',
    visualDescription: 'رونمایی از شهرهای دوقلوی همراز و آفرینا، مدال‌های لیگ و گواهی رسمی وثیقه ۱.۳ میلیون مترمربعی.',
    cameraAction: 'نمایش کارت گواهی طلایی با افکت درخشش ستاره‌ای',
    badge: 'متاورس ۱.۳M مترمربع',
    color: 'from-purple-500/20 to-indigo-600/20 border-purple-500/40'
  },
  {
    id: 5,
    startTime: 24,
    endTime: 30,
    title: 'فراخوان دانلود - همجهان شطرنج',
    voiceover: 'هم‌اکنون "همجهان شطرنج" را مجانی از کافه بازار دانلود کنید و به جمع فرماندهان بپیوندید!',
    visualDescription: 'لوگوی باشکوه همجهان شطرنج، آیکون کافه بازار و آپارات، دکمه دانلود رایگان و آدرس وب‌سایت رسمی.',
    cameraAction: 'نمای پایانی ثابت با لوگوی طلایی و جلوه آتشین',
    badge: 'دانلود رایگان از کافه بازار',
    color: 'from-rose-500/20 to-amber-600/20 border-rose-500/40'
  }
];

export const PromoVideoModal: React.FC<PromoVideoModalProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [soundMuted, setSoundMuted] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'script' | 'specs'>('preview');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [vipUnlocked, setVipUnlocked] = useState(false);

  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();

      const updateFrame = (now: number) => {
        const delta = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= 30) {
            setIsPlaying(false);
            if (!soundMuted) playVictoryFanfare();
            return 30;
          }

          // Trigger sound effects on scene boundaries
          if (!soundMuted) {
            if (Math.floor(prev) < 6 && Math.floor(next) >= 6) playMetallicClashSound();
            if (Math.floor(prev) < 12 && Math.floor(next) >= 12) playBoosterSound('gold');
            if (Math.floor(prev) < 18 && Math.floor(next) >= 18) playBoosterSound('platinum');
          }

          return next;
        });

        animationRef.current = requestAnimationFrame(updateFrame);
      };

      animationRef.current = requestAnimationFrame(updateFrame);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, soundMuted]);

  if (!isOpen) return null;

  const currentScene = SCENES.find(
    (scene) => currentTime >= scene.startTime && currentTime < scene.endTime
  ) || SCENES[SCENES.length - 1];

  const togglePlay = () => {
    if (currentTime >= 30) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const fullScriptText = `🎥 سناریوی رسمی تیزر تبلیغاتی ۳۰ ثانیه‌ای «همجهان شطرنج» (ویژه کافه بازار و آپارات)
مدت زمان: دقیقا ۳۰ ثانیه | کیفیت: 1080p Full HD (16:9) | فرمت: MP4 / H.264

[00:00 - 00:06] صحنه اول: کیمیای متریال‌ها
• تصویر: چرخش سینماتیک ۳D حول صفحه آپادانا، مهره‌های طلای ۲۴ عیار و نقره استرلینگ روی پایه مرمر و بازالت.
• گوینده: «آیا آماده‌اید تجربه شطرنج را به سطحی فراتر از زمان ببرید؟ همجهان شطرنج با متریال‌های کیمیای مقدس!»

[00:06 - 00:12] صحنه دوم: مشاور هوشمند گرندمستر
• تصویر: نمایش زنده پیشنهاد هوش مصنوعی Gemini 2.5 Flash با هاله‌های نوری زمردی دور مهره‌ها.
• گوینده: «با هوش مصنوعی پیشرفته هوش‌افزا، تحلیل آنی تاکتیک‌ها و مشاوره استراتژیک را در هر لحظه تجربه کنید.»

[00:12 - 00:18] صحنه سوم: آکادمی و سکه داریک
• تصویر: کارت‌های تعاملی آکادمی شطرنج و افکت پرتاب سکه‌های داریک به حساب کاربر.
• گوینده: «در آکادمی تعاملی آموزش ببینید، معماها را حل کنید و با هر درس پاداش سکه‌های داریک دریافت کنید.»

[00:18 - 00:24] صحنه چهارم: متاورس قادرشهر و سفیران
• تصویر: نماد شهرهای دوقلوی همراز و آفرینا (۱.۳ میلیون متر مربع) و مدال‌های لیگ سفیران.
• گوینده: «به متاورس قادرشهر بپیوندید، سند وثیقه زمین مجازی دریافت کنید و در لیگ سفیران به صعود بپردازید!»

[00:24 - 00:30] صحنه پنجم: فراخوان دانلود (Call to Action)
• تصویر: لوگوی طلایی همجهان شطرنج، بج کافه بازار و آپارات با عبارت «دانلود رایگان».
• گوینده: «هم‌اکنون همجهان شطرنج را مجانی از کافه بازار دانلود کنید و به جمع فرماندهان بپیوندید!»
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullScriptText);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const downloadScriptFile = () => {
    const blob = new Blob([fullScriptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Hamjahan_Chess_Aparat_30s_Script.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in dir-rtl overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-amber-500/30 rounded-2xl shadow-2xl max-w-4xl w-full p-4 sm:p-6 text-amber-100 my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-xl text-slate-950 shadow-lg shadow-amber-500/20">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500">
                استودیوی تیزر ۳۰ ثانیه‌ای آپارات و کافه بازار
              </h2>
              <p className="text-xs text-amber-200/70">
                طراحی شده ویژه متقاضیان انتشار در کافه بازار و اشتراک‌گذاری در آپارات (1080p Standard)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-amber-400/60 hover:text-amber-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 mb-4 gap-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'preview'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10 rounded-t-lg'
                : 'border-transparent text-amber-100/60 hover:text-amber-200'
            }`}
          >
            <Film className="w-4 h-4" />
            پیش‌نمایش زنده ۳۰ ثانیه‌ای
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'script'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10 rounded-t-lg'
                : 'border-transparent text-amber-100/60 hover:text-amber-200'
            }`}
          >
            <Copy className="w-4 h-4" />
            متن سناریو و دکوپاژ
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'specs'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10 rounded-t-lg'
                : 'border-transparent text-amber-100/60 hover:text-amber-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            مشخصات فنی آپارات و بازار
          </button>
        </div>

        {/* TAB 1: Live Interactive Preview */}
        {activeTab === 'preview' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            
            {/* Ambassador & Creator Kit Banner */}
            <div className="p-3 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Crown className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-amber-200">کیت سفیران و سازندگان محتوا (اینستاگرام، تلگرام، آپارات):</span>
                  <p className="text-amber-100/80">قابل استفاده رایگان برای تمام بازیکنان و سفیران شطرنج بدون نیاز به هوش مصنوعی ابری (کاملاً امن و اقتصادی بدون هزینه‌های سرور ابری).</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 bg-slate-900/90 p-1 rounded-lg border border-amber-500/30">
                <button
                  onClick={() => setAspectRatio('16:9')}
                  className={`px-3 py-1 rounded-md font-bold transition-all ${
                    aspectRatio === '16:9' ? 'bg-amber-500 text-slate-950 shadow' : 'text-amber-300 hover:bg-slate-800'
                  }`}
                >
                  افقی 16:9 (آپارات/تلگرام)
                </button>
                <button
                  onClick={() => setAspectRatio('9:16')}
                  className={`px-3 py-1 rounded-md font-bold transition-all ${
                    aspectRatio === '9:16' ? 'bg-amber-500 text-slate-950 shadow' : 'text-amber-300 hover:bg-slate-800'
                  }`}
                >
                  عمودی 9:16 (استوری اینستاگرام)
                </button>
              </div>
            </div>

            {/* Screen Simulator (Responsive Aspect Ratio based on selection) */}
            <div className={`relative w-full ${aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16] max-w-sm mx-auto'} bg-black rounded-xl border border-amber-500/30 overflow-hidden shadow-2xl flex flex-col justify-between p-4 sm:p-6 group transition-all duration-300`}>
              
              {/* Background Rendered Scene Graphic */}
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 flex items-center justify-center overflow-hidden">
                {/* Visual Simulation based on Scene */}
                {currentScene.id === 1 && (
                  <div className="relative flex items-center justify-center animate-pulse">
                    <div className="w-48 h-48 rounded-full bg-amber-500/10 blur-2xl absolute" />
                    <Crown className="w-32 h-32 text-amber-400 drop-shadow-[0_0_25px_rgba(245,158,11,0.6)] animate-bounce" />
                    <div className="absolute -bottom-10 text-center font-serif text-amber-300 text-lg font-bold tracking-widest">
                      24K GOLD & STERLING SILVER
                    </div>
                  </div>
                )}
                {currentScene.id === 2 && (
                  <div className="relative flex flex-col items-center justify-center">
                    <div className="w-40 h-40 rounded-full border-2 border-cyan-400/60 animate-spin absolute" />
                    <Sparkles className="w-24 h-24 text-cyan-300 drop-shadow-[0_0_30px_rgba(6,182,212,0.8)]" />
                    <div className="mt-6 px-4 py-1.5 bg-cyan-950/80 border border-cyan-400/50 rounded-full text-cyan-200 text-xs font-mono">
                      GEMINI 2.5 FLASH AI ORACLE ACTIVE
                    </div>
                  </div>
                )}
                {currentScene.id === 3 && (
                  <div className="relative flex flex-col items-center justify-center">
                    <Zap className="w-28 h-28 text-emerald-400 drop-shadow-[0_0_35px_rgba(16,185,129,0.7)] animate-bounce" />
                    <div className="mt-4 flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 px-4 py-2 rounded-xl text-emerald-200 font-bold">
                      +100 DARICS REWARD CLAIMED
                    </div>
                  </div>
                )}
                {currentScene.id === 4 && (
                  <div className="relative flex flex-col items-center justify-center">
                    <Globe2 className="w-28 h-28 text-purple-400 drop-shadow-[0_0_35px_rgba(168,85,247,0.7)]" />
                    <div className="mt-4 px-4 py-1.5 bg-purple-950/80 border border-purple-500/40 rounded-xl text-purple-200 text-xs font-bold">
                      ABLE CITY TWIN CITIES (1.3M m²)
                    </div>
                  </div>
                )}
                {currentScene.id === 5 && (
                  <div className="relative flex flex-col items-center justify-center">
                    <div className="p-3 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-2xl text-slate-950 shadow-2xl mb-3">
                      <Crown className="w-16 h-16" />
                    </div>
                    <div className="text-2xl font-black text-amber-200 tracking-wider">
                      همجهان شطرنج
                    </div>
                    <div className="mt-2 text-xs text-amber-300/80 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                      دانلود رایگان از کافه بازار
                    </div>
                  </div>
                )}
              </div>

              {/* Overlay Top Bar */}
              <div className="relative z-10 flex items-center justify-between bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-500/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-mono font-bold text-red-400">APARAT 1080P RECORDING</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 me-1 py-0.5 rounded-full border font-semibold ${currentScene.color}`}>
                    {currentScene.badge}
                  </span>
                  <span className="font-mono text-xs text-amber-300">
                    {currentTime.toFixed(1)}s / 30.0s
                  </span>
                </div>
              </div>

              {/* Overlay Bottom Caption / Subtitle Box */}
              <div className="relative z-10 bg-black/85 border border-amber-500/40 backdrop-blur-md p-3 sm:p-4 rounded-xl shadow-xl">
                <div className="text-xs font-bold text-amber-400 mb-1 flex items-center justify-between">
                  <span>{currentScene.title}</span>
                  <span className="text-[10px] text-amber-200/60 font-mono">
                    [{currentScene.startTime}s - {currentScene.endTime}s]
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
                  🗣️ "{currentScene.voiceover}"
                </p>
                <div className="mt-2 text-[11px] text-amber-200/70 italic flex items-center gap-1.5 border-t border-amber-500/20 pt-1.5">
                  <span>🎥 دکوپاژ:</span>
                  <span>{currentScene.visualDescription}</span>
                </div>
              </div>
            </div>

            {/* Video Player Controls */}
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="p-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                  <span>{isPlaying ? 'توقف' : 'پخش تیزر'}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-amber-200 rounded-xl transition-all border border-amber-500/20"
                  title="بازنشانی"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSoundMuted(!soundMuted)}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-amber-200 rounded-xl transition-all border border-amber-500/20"
                  title={soundMuted ? 'فعال‌سازی صدا' : 'قطع صدا'}
                >
                  {soundMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
                </button>
              </div>

              {/* Progress Slider */}
              <div className="flex-1 mx-2">
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="0.1"
                  value={currentTime}
                  onChange={(e) => {
                    setIsPlaying(false);
                    setCurrentTime(parseFloat(e.target.value));
                  }}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Timeline Scene Markers */}
              <div className="hidden sm:flex items-center gap-1">
                {SCENES.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentTime(sc.startTime);
                    }}
                    className={`w-6 h-6 text-xs font-bold rounded-lg transition-all ${
                      currentScene.id === sc.id
                        ? 'bg-amber-500 text-slate-950 scale-110 shadow-md'
                        : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                    }`}
                  >
                    {sc.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 rounded-xl transition-all font-semibold text-xs sm:text-sm"
              >
                {copiedScript ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedScript ? 'کپی شد!' : 'کپی متن گویندگی و سناریو'}</span>
              </button>

              <button
                onClick={downloadScriptFile}
                className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-slate-950 font-bold rounded-xl transition-all text-xs sm:text-sm shadow-lg shadow-amber-500/10"
              >
                <Download className="w-4 h-4" />
                <span>دانلود فایل متنی سناریو (.txt)</span>
              </button>
            </div>

            {/* VIP Ambassador Creator Monetization Feature */}
            <div className="p-4 bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border border-amber-500/40 rounded-xl flex items-center justify-between gap-4 mt-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/20 rounded-xl text-amber-300 border border-amber-500/40">
                  <Crown className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-200 text-sm">
                    {vipUnlocked ? '🌟 اشتراک ویژه VIP و ویدیوهای نامحدود فعال است' : 'اولین ویدیو رایگان | ویدیوهای اضافه و پیشرفته (۵۰۰ داریک)'}
                  </h4>
                  <p className="text-xs text-amber-200/70">
                    {vipUnlocked
                      ? 'شما به ساخت نامحدود ویدیو، قالب‌های پریمیوم و خروجی بدون واترمارک دسترسی دارید.'
                      : 'ساخت اولین ویدیو و استوری پایه برای همه رایگان است؛ ویدیوهای اضافه و تخصصی بعدی شامل هزینه با سکه داریک می‌باشد.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setVipUnlocked(true);
                  playVictoryFanfare();
                }}
                disabled={vipUnlocked}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs shrink-0 transition-all ${
                  vipUnlocked
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 cursor-default'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/20'
                }`}
              >
                {vipUnlocked ? 'فعال شد ✅' : 'ارتقا به VIP (۵۰۰ داریک)'}
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: Full Screenplay & Decoupage */}
        {activeTab === 'script' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm">
            <div className="bg-slate-900/90 border border-amber-500/30 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <span className="font-bold text-amber-300 flex items-center gap-2">
                  <Film className="w-4 h-4 text-amber-400" />
                  فیلم‌نامه دقیق و دکوپاژ ضبط تیزر (۳۰ ثانیه)
                </span>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs flex items-center gap-1"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>کپی</span>
                </button>
              </div>

              <div className="space-y-4 pt-1">
                {SCENES.map((scene) => (
                  <div key={scene.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>صحنه {scene.id}: {scene.title}</span>
                      <span className="font-mono text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded-md">
                        {scene.startTime}s تا {scene.endTime}s
                      </span>
                    </div>
                    <p className="text-slate-200">
                      <strong>🎙️ گوینده:</strong> {scene.voiceover}
                    </p>
                    <p className="text-amber-200/80">
                      <strong>📷 تصویر:</strong> {scene.visualDescription}
                    </p>
                    <p className="text-xs text-amber-300/60 font-mono">
                      <strong>🎥 حرکت دوربین:</strong> {scene.cameraAction}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Aparat & Cafe Bazaar Specs */}
        {activeTab === 'specs' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Aparat Requirements */}
              <div className="p-4 bg-slate-900/90 border border-rose-500/30 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-base border-b border-rose-500/20 pb-2">
                  <Tv className="w-5 h-5" />
                  الزامات استانداردهای آپارات
                </div>
                <ul className="space-y-2 text-slate-200">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>فرمت ویدیو:</strong> MP4 (کدک H.264 + صدا AAC)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>نسبت تصویر:</strong> افقی 16:9 (کیفیت 1080p یا 720p)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>حداکثر حجم:</strong> کمتر از ۵۰ مگابایت برای سرعت بارگذاری بالا</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>محتوای صوتی:</strong> گویندگی واضح به زبان فارسی همراه با موسیقی متن بدون کپی‌رایت</span>
                  </li>
                </ul>
              </div>

              {/* Cafe Bazaar Requirements */}
              <div className="p-4 bg-slate-900/90 border border-amber-500/30 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-base border-b border-amber-500/20 pb-2">
                  <Crown className="w-5 h-5" />
                  الزامات کافه بازار برای ویدیو
                </div>
                <ul className="space-y-2 text-slate-200">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>لینک آپارات:</strong> قراردادن لینک ویدیو آپارات در پنل توسعه‌دهندگان بازار</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>مدت زمان ایده‌آل:</strong> بین ۱۵ تا ۳۰ ثانیه (جذب حداکثری)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>نمایش مستقیم گیم‌پلی:</strong> حداقل ۷۰٪ ویدیو باید گیم‌پلی اصلی برنامه باشد</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>فراخوان به عمل (CTA):</strong> وجود شعار و لوگوی برنامه در ۵ ثانیه پایانی</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Practical Recording Recommendation */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 text-amber-200">
              <div className="font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                راهنمای سریع ضبط ویدیو با گوشی یا رایانه:
              </div>
              <p className="text-xs leading-relaxed text-amber-100/90">
                شما می‌توانید همین پیش‌نمایش ۳۰ ثانیه‌ای یا خود برنامه را در حالت full-screen با نرم‌افزارهای اسکرین‌رکوردر رایگان نظیر <strong>OBS Studio</strong> (در کامپیوتر) یا <strong>AZ Screen Recorder</strong> (در اندروید) ضبط کنید و فایل MP4 حاصل را پس از صداگذاری طبق سناریوی بالا مستقیم در آپارات آپلود کرده و لینک آن را در پنل کافه بازار وارد نمایید.
              </p>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="border-t border-amber-500/20 pt-4 mt-4 flex items-center justify-between text-xs text-amber-200/60">
          <span>آماده‌سازی برای کافه بازار و آپارات - نسخه استاندارد ۱۴۰۴</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-200 font-bold rounded-xl transition-colors"
          >
            بستن
          </button>
        </div>

      </div>
    </div>
  );
};
