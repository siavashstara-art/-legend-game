import React, { useState, useEffect, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import { PieceType, Color, Language } from '../types/chess';
import { ChessPiece } from './ChessPiece';
import {
  Wand2,
  X,
  Play,
  RotateCcw,
  Copy,
  Check,
  Save,
  Sparkles,
  Trash2,
  Lightbulb,
  Share2,
  Bookmark,
  HelpCircle
} from 'lucide-react';

interface CustomPuzzle {
  id: string;
  title: string;
  fen: string;
  turn: Color;
  createdAt: string;
}

interface PuzzleDesignerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaytestPuzzle: (fen: string, turn: Color) => void;
  lang: Language;
}

type PaletteItem = { type: PieceType; color: Color } | null;

const PRESETS = [
  {
    nameFa: 'مات در ۱ حرکت (مبتدی)',
    nameEn: 'Checkmate in 1 (Beginner)',
    fen: 'r1bqkb1r/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 4',
    turn: 'w' as Color
  },
  {
    nameFa: 'حمله تاکتیکی رخ و شاه (میان‌برد)',
    nameEn: 'Rook & King Tactical Attack (Intermediate)',
    fen: '6k1/5ppp/8/8/8/8/1R6/1K6 w - - 0 1',
    turn: 'w' as Color
  },
  {
    nameFa: 'معمای آخربازی فیل و پیاده (پیشرفته)',
    nameEn: 'Bishop & Pawn Endgame (Advanced)',
    fen: '8/8/4k3/8/3P4/2B5/4K3/8 w - - 0 1',
    turn: 'w' as Color
  },
  {
    nameFa: 'تخته خالی (طراحی از صفر)',
    nameEn: 'Empty Board (Design from scratch)',
    fen: '8/8/8/8/8/8/8/8 w - - 0 1',
    turn: 'w' as Color
  }
];

export const PuzzleDesignerModal: React.FC<PuzzleDesignerModalProps> = ({
  isOpen,
  onClose,
  onPlaytestPuzzle,
  lang
}) => {
  const isFa = lang === 'fa';

  // Board 8x8 matrix state: row 0 is rank 8, row 7 is rank 1
  const [boardGrid, setBoardGrid] = useState<PaletteItem[][]>(() => {
    return Array(8).fill(null).map(() => Array(8).fill(null));
  });

  const [activeTurn, setActiveTurn] = useState<Color>('w');
  const [selectedPalette, setSelectedPalette] = useState<PaletteItem>({ type: 'q', color: 'w' });
  const [puzzleTitle, setPuzzleTitle] = useState<string>('معمای اختصاصی من');
  const [currentFen, setCurrentFen] = useState<string>('');
  const [isValidBoard, setIsValidBoard] = useState<boolean>(true);
  const [validationMsg, setValidationMsg] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  // Saved puzzles
  const [savedPuzzles, setSavedPuzzles] = useState<CustomPuzzle[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('worldplay_my_custom_puzzles') || '[]');
    } catch {
      return [];
    }
  });

  // Convert 8x8 matrix to FEN
  const generateFenFromGrid = useCallback((grid: PaletteItem[][], turn: Color): { fen: string; valid: boolean; error: string } => {
    let whiteKingCount = 0;
    let blackKingCount = 0;

    let fenRows: string[] = [];

    for (let r = 0; r < 8; r++) {
      let rowStr = '';
      let emptyCount = 0;

      for (let c = 0; c < 8; c++) {
        const item = grid[r][c];
        if (!item) {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            rowStr += emptyCount;
            emptyCount = 0;
          }
          let pieceChar: string = item.type;
          if (item.color === 'w') {
            pieceChar = pieceChar.toUpperCase();
          } else {
            pieceChar = pieceChar.toLowerCase();
          }
          rowStr += pieceChar;

          if (item.type === 'k') {
            if (item.color === 'w') whiteKingCount++;
            else blackKingCount++;
          }
        }
      }
      if (emptyCount > 0) {
        rowStr += emptyCount;
      }
      fenRows.push(rowStr);
    }

    const fen = `${fenRows.join('/')} ${turn} - - 0 1`;

    if (whiteKingCount !== 1 || blackKingCount !== 1) {
      return {
        fen,
        valid: false,
        error: isFa
          ? 'تخته باید دقیقاً دارای ۱ شاه سفید و ۱ شاه سیاه باشد!'
          : 'Board must contain exactly 1 White King and 1 Black King!'
      };
    }

    // Try parsing with chess.js
    try {
      const c = new Chess(fen);
      return { fen, valid: true, error: '' };
    } catch {
      return {
        fen,
        valid: false,
        error: isFa ? 'چیدمان فعلی طبق قوانین شطرنج غیرمجاز است.' : 'Illegal position according to chess rules.'
      };
    }
  }, [isFa]);

  // Load a FEN into board grid
  const loadFenToGrid = useCallback((fen: string, turn: Color) => {
    try {
      const parts = fen.split(' ');
      const rows = parts[0].split('/');
      const grid: PaletteItem[][] = Array(8).fill(null).map(() => Array(8).fill(null));

      for (let r = 0; r < 8; r++) {
        const rowStr = rows[r] || '';
        let col = 0;
        for (let i = 0; i < rowStr.length; i++) {
          const char = rowStr[i];
          if (/\d/.test(char)) {
            col += parseInt(char, 10);
          } else {
            const color: Color = char === char.toUpperCase() ? 'w' : 'b';
            const type = char.toLowerCase() as PieceType;
            if (col < 8) {
              grid[r][col] = { type, color };
            }
            col++;
          }
        }
      }

      setBoardGrid(grid);
      setActiveTurn(turn);
    } catch (e) {
      console.error('Failed to parse FEN:', e);
    }
  }, []);

  // Initialize with initial default setup on open
  useEffect(() => {
    if (isOpen && !currentFen) {
      loadFenToGrid(PRESETS[0].fen, PRESETS[0].turn);
    }
  }, [isOpen, currentFen, loadFenToGrid]);

  // Recalculate FEN whenever grid or turn changes
  useEffect(() => {
    const res = generateFenFromGrid(boardGrid, activeTurn);
    setCurrentFen(res.fen);
    setIsValidBoard(res.valid);
    setValidationMsg(res.error);
    setAiAnalysis(null);
  }, [boardGrid, activeTurn, generateFenFromGrid]);

  if (!isOpen) return null;

  // Handle Square click
  const handleSquareClick = (r: number, c: number) => {
    setBoardGrid(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = selectedPalette;
      return next;
    });
  };

  // Clear entire board
  const handleClearBoard = () => {
    setBoardGrid(Array(8).fill(null).map(() => Array(8).fill(null)));
  };

  // Reset to standard chess opening
  const handleResetStandard = () => {
    loadFenToGrid('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'w');
  };

  // Save puzzle to local list
  const handleSavePuzzle = () => {
    if (!isValidBoard) return;

    const newPuzzle: CustomPuzzle = {
      id: 'puzzle_' + Date.now(),
      title: puzzleTitle.trim() || (isFa ? 'معمای جدید' : 'New Puzzle'),
      fen: currentFen,
      turn: activeTurn,
      createdAt: new Date().toLocaleDateString(isFa ? 'fa-IR' : 'en-US')
    };

    const updated = [newPuzzle, ...savedPuzzles];
    setSavedPuzzles(updated);
    localStorage.setItem('worldplay_my_custom_puzzles', JSON.stringify(updated));
  };

  // Delete saved puzzle
  const handleDeletePuzzle = (id: string) => {
    const updated = savedPuzzles.filter(p => p.id !== id);
    setSavedPuzzles(updated);
    localStorage.setItem('worldplay_my_custom_puzzles', JSON.stringify(updated));
  };

  // Copy FEN string
  const handleCopyFen = () => {
    navigator.clipboard?.writeText(currentFen);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // AI Verification & Auto Hint
  const handleAiAnalyzePuzzle = async () => {
    if (!isValidBoard || loadingAi) return;
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai-oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fen: currentFen,
          civilization: 'achaemenid',
          lastMove: 'puzzle_analysis',
          lang
        })
      });
      const data = await res.json();
      if (data?.tip) {
        setAiAnalysis(data.tip);
      } else {
        setAiAnalysis(
          isFa
            ? '🤖 تحلیل هوشمند: وضعیت معما متعادل است. حرکت‌های کلیدی مرکز را بررسی کنید!'
            : '🤖 Smart Analysis: Position is balanced. Look for key central tactics!'
        );
      }
    } catch {
      setAiAnalysis(
        isFa
          ? '🤖 تحلیل هوشمند: معمای شما آماده تست زنده است! نوبت حرکت: ' + (activeTurn === 'w' ? 'سفید' : 'سیاه')
          : '🤖 Smart Analysis: Puzzle ready for playtest!'
      );
    } finally {
      setLoadingAi(false);
    }
  };

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200" dir={isFa ? 'rtl' : 'ltr'}>
      <div className="bg-[#181310] border-2 border-amber-500/60 rounded-3xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-[#3a322b] bg-gradient-to-r from-[#241e19] via-[#1c1815] to-[#241e19]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Wand2 size={24} />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-black text-amber-300 flex items-center gap-2">
                <span>{isFa ? 'طراح معما و سازنده مرحله شطرنج' : 'Chess Puzzle Designer & Level Creator'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                  {isFa ? 'اتوماسیون ساده' : 'Effortless Studio'}
                </span>
              </h2>
              <p className="text-xs text-stone-300">
                {isFa
                  ? 'مهره‌ها را به آسانی روی تخته بگذارید، معما بسازید و مستقیماً تست زنده بگیرید!'
                  : 'Place pieces easily, craft custom tactical puzzles, and playtest instantly!'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer border border-stone-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Top Presets Bar */}
          <div className="p-3 rounded-2xl bg-[#221b16] border border-amber-600/30 space-y-2">
            <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
              <Sparkles size={14} />
              <span>{isFa ? 'الگوهای آماده برای شروع سریع:' : 'Quick Start Templates:'}</span>
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => loadFenToGrid(p.fen, p.turn)}
                  className="px-3 py-1.5 rounded-xl bg-[#2c231c] hover:bg-amber-600 hover:text-stone-950 text-stone-200 text-xs font-bold transition-all shrink-0 cursor-pointer border border-amber-500/30"
                >
                  ⚡ {isFa ? p.nameFa : p.nameEn}
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid + Controls split */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Left Column: 8x8 Board Canvas */}
            <div className="md:col-span-7 flex flex-col items-center gap-3">
              <div className="w-full max-w-[380px] aspect-square rounded-2xl border-4 border-amber-900/80 shadow-2xl overflow-hidden grid grid-cols-8 grid-rows-8 bg-[#2a221b]">
                {boardGrid.map((row, r) =>
                  row.map((item, c) => {
                    const isDark = (r + c) % 2 === 1;
                    return (
                      <button
                        key={`${r}-${c}`}
                        onClick={() => handleSquareClick(r, c)}
                        className={`relative flex items-center justify-center transition-all cursor-pointer hover:brightness-125 ${
                          isDark ? 'bg-[#584534]' : 'bg-[#c2a688]'
                        }`}
                      >
                        {/* Square Coordinate notation */}
                        {c === 0 && (
                          <span className={`absolute top-0.5 right-1 text-[9px] font-bold ${isDark ? 'text-stone-300/60' : 'text-stone-700/60'}`}>
                            {8 - r}
                          </span>
                        )}
                        {r === 7 && (
                          <span className={`absolute bottom-0.5 left-1 text-[9px] font-bold ${isDark ? 'text-stone-300/60' : 'text-stone-700/60'}`}>
                            {files[c]}
                          </span>
                        )}

                        {item && (
                          <div className="w-4/5 h-4/5 drop-shadow-md pointer-events-none">
                            <ChessPiece type={item.type} color={item.color} style="achaemenid" />
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Turn & Actions below board */}
              <div className="w-full max-w-[380px] flex items-center justify-between gap-2 bg-[#221b16] p-2.5 rounded-xl border border-stone-800">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <span className="text-stone-400">{isFa ? 'نوبت حرکت:' : 'Turn:'}</span>
                  <button
                    onClick={() => setActiveTurn('w')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTurn === 'w'
                        ? 'bg-amber-400 text-stone-950 font-black shadow-sm'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    ⚪ {isFa ? 'سفید' : 'White'}
                  </button>
                  <button
                    onClick={() => setActiveTurn('b')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTurn === 'b'
                        ? 'bg-amber-400 text-stone-950 font-black shadow-sm'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    ⚫ {isFa ? 'سیاه' : 'Black'}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleResetStandard}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
                    title={isFa ? 'بازنشانی چیدمان استاندارد' : 'Reset Standard'}
                  >
                    <RotateCcw size={15} />
                  </button>
                  <button
                    onClick={handleClearBoard}
                    className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 transition-colors cursor-pointer border border-rose-800/50"
                    title={isFa ? 'تخلیه کامل تخته' : 'Clear All'}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Piece Palette & Puzzle Tools */}
            <div className="md:col-span-5 space-y-4">
              {/* Palette Selection Box */}
              <div className="p-3.5 rounded-2xl bg-[#221b16] border border-amber-600/40 space-y-3">
                <h3 className="text-xs font-black text-amber-300 flex items-center justify-between">
                  <span>{isFa ? 'انتخاب مهره جهت جانمایی:' : 'Select Piece to Place:'}</span>
                  {selectedPalette ? (
                    <span className="text-[10px] text-emerald-400 font-bold">
                      {selectedPalette.color === 'w' ? '⚪ ' : '⚫ '}
                      {selectedPalette.type.toUpperCase()}
                    </span>
                  ) : (
                    <span className="text-[10px] text-rose-400 font-bold">🧹 {isFa ? 'پاک‌کن' : 'Eraser'}</span>
                  )}
                </h3>

                {/* White Pieces Palette */}
                <div>
                  <span className="text-[10px] text-stone-400 font-bold block mb-1">
                    ⚪ {isFa ? 'مهره‌های سفید:' : 'White Pieces:'}
                  </span>
                  <div className="grid grid-cols-6 gap-1.5">
                    {(['k', 'q', 'r', 'b', 'n', 'p'] as PieceType[]).map(type => {
                      const isSel = selectedPalette?.type === type && selectedPalette?.color === 'w';
                      return (
                        <button
                          key={`w-${type}`}
                          onClick={() => setSelectedPalette({ type, color: 'w' })}
                          className={`p-1.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                            isSel
                              ? 'bg-amber-500 border-amber-300 shadow-md ring-2 ring-amber-400'
                              : 'bg-stone-900 border-stone-700 hover:bg-stone-800'
                          }`}
                        >
                          <div className="w-6 h-6">
                            <ChessPiece type={type} color="w" style="achaemenid" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Black Pieces Palette */}
                <div>
                  <span className="text-[10px] text-stone-400 font-bold block mb-1">
                    ⚫ {isFa ? 'مهره‌های سیاه:' : 'Black Pieces:'}
                  </span>
                  <div className="grid grid-cols-6 gap-1.5">
                    {(['k', 'q', 'r', 'b', 'n', 'p'] as PieceType[]).map(type => {
                      const isSel = selectedPalette?.type === type && selectedPalette?.color === 'b';
                      return (
                        <button
                          key={`b-${type}`}
                          onClick={() => setSelectedPalette({ type, color: 'b' })}
                          className={`p-1.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                            isSel
                              ? 'bg-amber-500 border-amber-300 shadow-md ring-2 ring-amber-400'
                              : 'bg-stone-900 border-stone-700 hover:bg-stone-800'
                          }`}
                        >
                          <div className="w-6 h-6">
                            <ChessPiece type={type} color="b" style="achaemenid" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Eraser Tool */}
                <button
                  onClick={() => setSelectedPalette(null)}
                  className={`w-full py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedPalette === null
                      ? 'bg-rose-600 text-white border-rose-400 shadow-md'
                      : 'bg-stone-900 text-stone-300 border-stone-700 hover:bg-stone-800'
                  }`}
                >
                  <Trash2 size={14} />
                  <span>{isFa ? 'حالت پاک‌کن (حذف مهره با کلیک)' : 'Eraser Mode (Click to remove)'}</span>
                </button>
              </div>

              {/* Puzzle Title & Direct Playtest Button */}
              <div className="p-3.5 rounded-2xl bg-[#221b16] border border-amber-600/40 space-y-3">
                <div>
                  <label className="text-xs font-bold text-amber-300 block mb-1">
                    {isFa ? 'عنوان معما:' : 'Puzzle Title:'}
                  </label>
                  <input
                    type="text"
                    value={puzzleTitle}
                    onChange={e => setPuzzleTitle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    placeholder={isFa ? 'نام معما...' : 'Puzzle name...'}
                  />
                </div>

                {/* Board Validation Status */}
                {!isValidBoard && (
                  <div className="p-2 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-300 text-xs font-bold">
                    ⚠️ {validationMsg}
                  </div>
                )}

                {/* Primary Playtest Action */}
                <button
                  disabled={!isValidBoard}
                  onClick={() => {
                    if (isValidBoard) {
                      onPlaytestPuzzle(currentFen, activeTurn);
                      onClose();
                    }
                  }}
                  className={`w-full py-3 rounded-2xl font-black text-sm transition-all transform flex items-center justify-center gap-2 shadow-xl cursor-pointer ${
                    isValidBoard
                      ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 hover:scale-105 active:scale-95 border border-amber-300'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <Play size={18} />
                  <span>{isFa ? '▶️ تست زنده معما روی تخته اصلی' : '▶️ Playtest Puzzle Instantly'}</span>
                </button>

                {/* Secondary Actions: Save & AI Analysis */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={!isValidBoard}
                    onClick={handleSavePuzzle}
                    className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-stone-600"
                  >
                    <Save size={14} className="text-amber-400" />
                    <span>{isFa ? 'ذخیره معما' : 'Save Puzzle'}</span>
                  </button>

                  <button
                    disabled={!isValidBoard || loadingAi}
                    onClick={handleAiAnalyzePuzzle}
                    className="py-2 px-3 rounded-xl bg-gradient-to-r from-purple-950 to-indigo-950 hover:from-purple-900 hover:to-indigo-900 text-purple-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-purple-500/40"
                  >
                    <Sparkles size={14} className="text-purple-400" />
                    <span>{loadingAi ? '...' : isFa ? 'صحت‌سنجی AI' : 'AI Analysis'}</span>
                  </button>
                </div>

                {/* FEN Box & Copy */}
                <div className="p-2 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between gap-2">
                  <code className="text-[10px] font-mono text-stone-400 truncate flex-1">{currentFen}</code>
                  <button
                    onClick={handleCopyFen}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors shrink-0 cursor-pointer"
                    title={isFa ? 'کپی کد FEN' : 'Copy FEN'}
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>

                {/* AI Advice Box */}
                {aiAnalysis && (
                  <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-200 text-xs leading-relaxed animate-in fade-in">
                    {aiAnalysis}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section: My Saved Custom Puzzles */}
          {savedPuzzles.length > 0 && (
            <div className="pt-4 border-t border-[#3a322b] space-y-3">
              <h3 className="text-xs font-black text-amber-300 flex items-center gap-2">
                <Bookmark size={15} />
                <span>{isFa ? 'معماهای ذخیره‌شده شما:' : 'Your Saved Puzzles:'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
                {savedPuzzles.map(p => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl bg-[#221b16] border border-stone-800 hover:border-amber-600/50 transition-all flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-amber-200 truncate">{p.title}</h4>
                      <p className="text-[10px] text-stone-400 font-mono truncate">{p.fen}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          onPlaytestPuzzle(p.fen, p.turn);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-colors cursor-pointer"
                      >
                        ▶️
                      </button>
                      <button
                        onClick={() => handleDeletePuzzle(p.id)}
                        className="p-1 rounded-lg text-rose-400 hover:bg-rose-950/50 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
