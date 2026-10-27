import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { MonsterCard } from '../types/game';
import { Swords, Shield, Zap, Sparkles, Trophy, Award, Plus, Flame, Droplets, Mountain, Sun, RefreshCw, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export const MonsterBattleScreen: React.FC = () => {
  const { monsterCards, runBattle, battleHistory } = useGameStore();
  const [selectedPlayerMonster, setSelectedPlayerMonster] = useState<MonsterCard | null>(() => {
    return monsterCards.find(m => m.isUnlocked) || monsterCards[0] || null;
  });

  const [activeTab, setActiveTab] = useState<'battle' | 'deck' | 'history' | 'guide'>('battle');
  const [battleAnimation, setBattleAnimation] = useState<{
    inProgress: boolean;
    logs: string[];
    result: { isVictory: boolean; earnedStars: number; playerHp: number; enemyHp: number } | null;
  }>({
    inProgress: false,
    logs: [],
    result: null,
  });

  // Custom monster creation modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMonsterName, setNewMonsterName] = useState('');
  const [newMonsterElement, setNewMonsterElement] = useState('Fire');
  const [newMonsterPower, setNewMonsterPower] = useState(45);
  const [newMonsterHp, setNewMonsterHp] = useState(220);

  const getElementBadge = (elementCategory: string) => {
    const el = elementCategory.toLowerCase();
    if (el.includes('fire') || el.includes('آتش')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-950/80 text-amber-400 border border-amber-500/50">
          <Flame size={12} className="text-amber-500" /> 🔥 آتش
        </span>
      );
    }
    if (el.includes('water') || el.includes('آب')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-sky-950/80 text-sky-400 border border-sky-500/50">
          <Droplets size={12} className="text-sky-400" /> 💧 آب
        </span>
      );
    }
    if (el.includes('earth') || el.includes('خاک')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/50">
          <Mountain size={12} className="text-emerald-400" /> 🌍 خاک
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-950/80 text-yellow-300 border border-yellow-500/50">
        <Sun size={12} className="text-yellow-400" /> ✨ روشنایی
      </span>
    );
  };

  const handleStartAnimatedBattle = (enemyCard: MonsterCard) => {
    if (!selectedPlayerMonster) {
      alert('لطفاً ابتدا کارت هیولای خود را انتخاب کنید!');
      return;
    }

    setBattleAnimation({
      inProgress: true,
      logs: [
        `⚔️ آغاز نبرد معبد متحد: ${selectedPlayerMonster.name} در برابر ${enemyCard.name}!`,
        `🛡️ میزان سلامتی اولیه: ${selectedPlayerMonster.name} (${selectedPlayerMonster.healthPoints} HP) | ${enemyCard.name} (${enemyCard.healthPoints} HP)`
      ],
      result: null,
    });

    // Execute battle step by step simulation
    setTimeout(() => {
      let playerHp = selectedPlayerMonster.healthPoints;
      let enemyHp = enemyCard.healthPoints;
      const logs: string[] = [
        `⚔️ آغاز نبرد معبد متحد: ${selectedPlayerMonster.name} در برابر ${enemyCard.name}!`,
      ];

      let round = 1;
      while (playerHp > 0 && enemyHp > 0 && round <= 10) {
        // Player attacks
        const pDamage = selectedPlayerMonster.powerLevel;
        enemyHp -= pDamage;
        logs.push(`🔴 دور ${round}: ${selectedPlayerMonster.name} با قدرتش ${pDamage} واحد آسیب به ${enemyCard.name} وارد کرد! (HP باقی‌مانده حریف: ${Math.max(0, enemyHp)})`);

        if (enemyHp <= 0) break;

        // Enemy attacks
        const eDamage = enemyCard.powerLevel;
        playerHp -= eDamage;
        logs.push(`⚡ دور ${round}: ${enemyCard.name} پاسخ داد و ${eDamage} واحد به ${selectedPlayerMonster.name} ضربه زد! (HP باقی‌مانده شما: ${Math.max(0, playerHp)})`);

        round++;
      }

      const isVictory = playerHp > 0;
      const earnedStars = isVictory ? 10 : 2;

      if (isVictory) {
        logs.push(`🏆 پیروزی درخشان در معبد متحد! شما حریف را شکست دادید و +${earnedStars} ستاره پیروزی دریافت کردید!`);
      } else {
        logs.push(`💀 شکست در معبد متحد! کارت شما از پا درآمد اما +${earnedStars} ستاره پاداش شجاعت گرفتید.`);
      }

      // Record in store
      runBattle(selectedPlayerMonster, enemyCard);

      setBattleAnimation({
        inProgress: false,
        logs,
        result: {
          isVictory,
          earnedStars,
          playerHp: Math.max(0, playerHp),
          enemyHp: Math.max(0, enemyHp),
        },
      });
    }, 800);
  };

  const handleCreateMonster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMonsterName.trim()) return;

    const customMonster: MonsterCard = {
      id: 'custom_' + Date.now(),
      name: newMonsterName.trim(),
      powerLevel: newMonsterPower,
      healthPoints: newMonsterHp,
      elementCategory: newMonsterElement,
      isUnlocked: true,
    };

    useGameStore.setState((state) => ({
      monsterCards: [...state.monsterCards, customMonster],
    }));

    setSelectedPlayerMonster(customMonster);
    setShowCreateModal(false);
    setNewMonsterName('');
  };

  return (
    <div className="p-4 sm:p-6 bg-[#14110f] text-[#f5ecd9] rounded-2xl border border-amber-500/40 shadow-2xl space-y-5 dir-rtl" dir="rtl">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-900/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-600 to-rose-700 text-amber-100 shadow-md">
            <Swords size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight">
                معبد متحد • نبرد هیولاهای اساطیری
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                حالت ویژه
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              کارت هیولای خود را انتخاب کرده، عناصر را هدایت کنید و حریفان را در معبد متحد شکست دهید!
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-[#1e1914] p-1 rounded-xl border border-stone-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('battle')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'battle'
                ? 'bg-amber-600 text-stone-950 font-black shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            ⚔️ نبرد زنده
          </button>
          <button
            onClick={() => setActiveTab('deck')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'deck'
                ? 'bg-amber-600 text-stone-950 font-black shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            🎴 کارت‌ها
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-amber-600 text-stone-950 font-black shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            📜 تاریخچه
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'guide'
                ? 'bg-amber-600 text-stone-950 font-black shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            📖 راهنما
          </button>
        </div>
      </div>

      {/* TAB 1: BATTLE ARENA */}
      {activeTab === 'battle' && (
        <div className="space-y-6">
          {/* Quick Battle Launcher Bar */}
          <div className="p-3 bg-gradient-to-r from-amber-950/70 via-rose-950/70 to-amber-950/70 rounded-xl border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="text-amber-400 shrink-0" size={20} />
              <div className="text-xs">
                <span className="font-bold text-amber-200 block">شروع فوری بازی نبرد متحد</span>
                <span className="text-stone-300">هیولای برتر شما به‌طور خودکار انتخاب می‌شود و حریف به چالش کشیده می‌شود.</span>
              </div>
            </div>
            <button
              onClick={() => {
                const enemies = monsterCards.filter(m => m.id !== selectedPlayerMonster?.id);
                const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)] || monsterCards[1];
                if (randomEnemy) handleStartAnimatedBattle(randomEnemy);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-stone-950 font-black text-xs shadow-lg transition-all transform hover:scale-105 shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <Zap size={16} />
              <span>⚡ شروع نبرد بی‌درنگ</span>
            </button>
          </div>

          {/* Player Monster Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-black text-amber-300 flex items-center gap-2">
                <Shield size={16} className="text-amber-400" />
                <span>۱. هیولای قهرمان خود را انتخاب کنید:</span>
              </h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 underline cursor-pointer"
              >
                <Plus size={14} /> ساخت کارت هیولای جدید
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {monsterCards.filter(m => m.isUnlocked).map(monster => {
                const isSelected = selectedPlayerMonster?.id === monster.id;
                return (
                  <button
                    key={monster.id}
                    onClick={() => setSelectedPlayerMonster(monster)}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'border-amber-400 bg-gradient-to-b from-amber-950/90 to-[#221810] shadow-lg ring-2 ring-amber-500/50 scale-[1.02]'
                        : 'border-stone-800 bg-[#1c1713] hover:border-amber-700/60 hover:bg-[#251e18]'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 left-2 text-amber-400">
                        <CheckCircle2 size={18} />
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-stone-100">{monster.name}</span>
                    </div>
                    {getElementBadge(monster.elementCategory)}

                    <div className="mt-3 pt-2 border-t border-stone-800/80 grid grid-cols-2 gap-1 text-[11px]">
                      <div className="text-stone-400">
                        قدرت حمله: <span className="font-bold text-amber-300">{monster.powerLevel}</span>
                      </div>
                      <div className="text-stone-400">
                        سلامتی (HP): <span className="font-bold text-rose-400">{monster.healthPoints}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Enemies Selection & Arena Battle Cards */}
          <div>
            <h2 className="text-sm font-black text-rose-400 mb-2 flex items-center gap-2">
              <Swords size={16} className="text-rose-400" />
              <span>۲. هیولای حریف را در معبد متحد به مبارزه بطلبید:</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {monsterCards.map(enemy => {
                const isCurrentPlayer = selectedPlayerMonster?.id === enemy.id;
                if (isCurrentPlayer) return null;

                return (
                  <div
                    key={enemy.id}
                    className="p-3.5 rounded-xl border border-rose-950/80 bg-gradient-to-b from-[#221515] to-[#181111] hover:border-rose-600/60 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="font-bold text-sm text-rose-200">{enemy.name}</h3>
                        {getElementBadge(enemy.elementCategory)}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-stone-300 mt-2 bg-[#120d0d] p-2 rounded-lg border border-stone-800">
                        <div>
                          قدرت: <span className="font-bold text-amber-400">{enemy.powerLevel}</span>
                        </div>
                        <div>
                          سلامتی: <span className="font-bold text-rose-400">{enemy.healthPoints} HP</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartAnimatedBattle(enemy)}
                      disabled={battleAnimation.inProgress}
                      className="w-full py-2 rounded-lg bg-gradient-to-r from-rose-700 to-amber-700 hover:from-rose-600 hover:to-amber-600 text-stone-100 font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Swords size={15} />
                      <span>ورود به نبرد با {enemy.name}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Battle Animation Simulation & Live Logs */}
          {(battleAnimation.inProgress || battleAnimation.logs.length > 0) && (
            <div className="p-4 rounded-xl bg-[#0f0c0a] border border-amber-600/50 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <h3 className="text-xs font-black text-amber-300 flex items-center gap-2">
                  <Zap size={16} className="text-amber-400 animate-bounce" />
                  <span>گزارش نبرد معبد متحد:</span>
                </h3>
                {battleAnimation.inProgress && (
                  <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                    <RefreshCw size={12} className="animate-spin" /> در حال محاسبه ضربات...
                  </span>
                )}
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-xs text-stone-300 bg-[#14110f] p-3 rounded-lg border border-stone-900">
                {battleAnimation.logs.map((log, idx) => (
                  <div key={idx} className="py-0.5 border-b border-stone-900/50 leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>

              {battleAnimation.result && (
                <div
                  className={`p-3 rounded-xl border text-center space-y-1 ${
                    battleAnimation.result.isVictory
                      ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-200'
                      : 'bg-rose-950/70 border-rose-500/60 text-rose-200'
                  }`}
                >
                  <div className="text-lg font-black flex items-center justify-center gap-2">
                    {battleAnimation.result.isVictory ? (
                      <>
                        <Trophy className="text-amber-400" size={24} />
                        <span>پیروزی افتخارآمیز در معبد متحد!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="text-rose-400" size={24} />
                        <span>شکست در برابر حریف!</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs">
                    پاداش نبرد: <span className="font-bold text-amber-300">+{battleAnimation.result.earnedStars} ستاره اساطیری</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DECK & CARDS */}
      {activeTab === 'deck' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-amber-300">مجموعه کارت‌های هیولای موجود:</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-xs cursor-pointer flex items-center gap-1"
            >
              <Plus size={14} /> ساخت هیولای جدید
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {monsterCards.map(monster => (
              <div
                key={monster.id}
                className={`p-4 rounded-xl border transition-all ${
                  monster.isUnlocked
                    ? 'bg-[#1e1814] border-amber-600/50 text-stone-100'
                    : 'bg-[#120f0d] border-stone-800 text-stone-500 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm text-amber-200">{monster.name}</h3>
                  {getElementBadge(monster.elementCategory)}
                </div>

                <div className="space-y-1 text-xs text-stone-300 mt-3 bg-[#120f0d] p-2.5 rounded-lg border border-stone-800">
                  <div className="flex justify-between">
                    <span>قدرت حمله:</span>
                    <span className="font-bold text-amber-400">{monster.powerLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>میزان سلامتی:</span>
                    <span className="font-bold text-rose-400">{monster.healthPoints} HP</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-stone-800">
                    <span>وضعیت:</span>
                    <span className={monster.isUnlocked ? 'text-emerald-400 font-bold' : 'text-amber-500 font-bold'}>
                      {monster.isUnlocked ? '✓ باز شده' : '🔒 قفل شده (نیاز به ستاره)'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BATTLE HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <h2 className="text-sm font-black text-amber-300">تاریخچه نبردهای اخیر معبد متحد:</h2>

          {battleHistory.length === 0 ? (
            <div className="p-8 text-center bg-[#181411] rounded-xl border border-stone-800 text-stone-400 text-xs">
              هنوز نبردی ثبت نشده است. اولین نبرد خود را در زبانه «نبرد زنده» آغاز کنید!
            </div>
          ) : (
            <div className="space-y-2">
              {battleHistory.map(record => (
                <div
                  key={record.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    record.isVictory
                      ? 'bg-emerald-950/40 border-emerald-600/40 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-600/40 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{record.isVictory ? '🏆' : '💀'}</span>
                    <div>
                      <div className="font-bold">
                        {record.playerMonsterName} <span className="text-stone-400">در برابر</span> {record.enemyMonsterName}
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5">
                        {new Date(record.timestamp).toLocaleTimeString('fa-IR')} • معبد متحد
                      </div>
                    </div>
                  </div>

                  <div className="text-left font-bold">
                    <span className={record.isVictory ? 'text-emerald-400' : 'text-rose-400'}>
                      {record.isVictory ? 'پیروزی' : 'شکست'}
                    </span>
                    <span className="block text-[11px] text-amber-400">+{record.earnedStars} ستاره</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: HOW TO PLAY GUIDE */}
      {activeTab === 'guide' && (
        <div className="p-4 rounded-xl bg-[#1a1512] border border-amber-600/40 text-xs space-y-3 leading-relaxed">
          <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
            <HelpCircle size={18} className="text-amber-400" />
            <span>راهنمای جامع بازی در معبد متحد:</span>
          </h3>

          <ol className="list-decimal list-inside space-y-2 text-stone-300">
            <li>
              <strong className="text-amber-200">انتخاب کارت هیولا:</strong> از بین هیولاهای آزاد شده (آتش، آب، خاک، روشنایی)، هیولای خود را برگزینید.
            </li>
            <li>
              <strong className="text-amber-200">انتخاب حریف:</strong> هیولای حریف را به مبارزه دعوت کنید یا روی دکمه «شروع نبرد بی‌درنگ» کلیک کنید.
            </li>
            <li>
              <strong className="text-amber-200">محاسبات نبرد:</strong> در هر دور نبرد، قدرت حمله هیولاها از HP حریف کسر می‌شود تا زمانی که سلامتی یکی از هیولاها به صفر برسد.
            </li>
            <li>
              <strong className="text-amber-200">کسب پاداش:</strong> با کسب پیروزی، ۱۰ ستاره و در صورت شجاعت در شکست ۲ ستاره دریافت می‌کنید.
            </li>
            <li>
              <strong className="text-amber-200">حالت شطرنج + هیولا:</strong> با زدن دکمه «شمشیر» در بالای صفحه اصلی، هر حرکت در شطرنج همزمان آسیب هیولایی نیز وارد می‌کند!
            </li>
          </ol>
        </div>
      )}

      {/* CREATE MONSTER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleCreateMonster}
            className="bg-[#1c1713] border border-amber-500/60 rounded-2xl p-5 max-w-md w-full text-xs space-y-4 shadow-2xl"
          >
            <h3 className="text-sm font-black text-amber-300 border-b border-stone-800 pb-2">
              ✨ ساخت هیولای اساطیری جدید
            </h3>

            <div>
              <label className="block text-stone-300 font-bold mb-1">نام هیولا:</label>
              <input
                type="text"
                value={newMonsterName}
                onChange={e => setNewMonsterName(e.target.value)}
                placeholder="مثلاً: سیمرغ آذرین"
                className="w-full bg-[#120e0c] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-300 font-bold mb-1">عنصر:</label>
                <select
                  value={newMonsterElement}
                  onChange={e => setNewMonsterElement(e.target.value)}
                  className="w-full bg-[#120e0c] border border-stone-700 rounded-lg p-2 text-stone-100 focus:outline-none"
                >
                  <option value="Fire">🔥 آتش (Fire)</option>
                  <option value="Water">💧 آب (Water)</option>
                  <option value="Earth">🌍 خاک (Earth)</option>
                  <option value="Light">✨ روشنایی (Light)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">قدرت حمله ({newMonsterPower}):</label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={newMonsterPower}
                  onChange={e => setNewMonsterPower(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-300 font-bold mb-1">میزان سلامتی HP ({newMonsterHp}):</label>
              <input
                type="range"
                min="100"
                max="500"
                step="10"
                value={newMonsterHp}
                onChange={e => setNewMonsterHp(parseInt(e.target.value, 10))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-black cursor-pointer shadow-md"
              >
                ایجاد و افزودن به کارت‌ها
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MonsterBattleScreen;
