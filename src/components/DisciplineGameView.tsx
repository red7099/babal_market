import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  CORE_HABITS,
  DISCIPLINE_VIRTUES,
  IMPULSE_ITEMS,
  ImpulseItem,
  DisciplineHabit,
} from '../data/disciplineGameData';
import {
  Flame,
  Award,
  Shield,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Mountain,
  Sun,
  BookOpen,
  Activity,
  Smartphone,
  HeartHandshake,
  Book,
  Zap,
  CheckCircle2,
  Clock,
  Target,
  Trophy,
  AlertTriangle,
  Coins,
} from 'lucide-react';

export const DisciplineGameView: React.FC = () => {
  const {
    disciplinePoints,
    disciplineStreak,
    completedHabitsToday,
    disciplineBadges,
    totalFocusMinutes,
    toggleHabitCompletion,
    addDisciplinePoints,
    recordFocusSession,
    user,
    t,
  } = useApp();

  // Mode tabs: 'ascent' | 'habits' | 'reflex_arena' | 'wisdom'
  const [activeGameTab, setActiveGameTab] = useState<'ascent' | 'habits' | 'reflex_arena' | 'wisdom'>('ascent');

  // ==================== MODE 1: EVEREST FOCUS STUDY ASCENT ====================
  const [selectedStudyDuration, setSelectedStudyDuration] = useState<number>(25); // minutes
  const [studySubject, setStudySubject] = useState('Mathematics & Science Problem Solving');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isAmbientSoundOn, setIsAmbientSoundOn] = useState<boolean>(false);
  const [focusCompletionNotice, setFocusCompletionNotice] = useState<string | null>(null);

  // Audio synthesis for zen Tibetan bell chime
  const audioContextRef = useRef<AudioContext | null>(null);

  const playZenBell = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = audioContextRef.current || new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime); // 528 Hz miracle tone
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.5);
    } catch (e) {
      // Audio optional
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playZenBell();
      recordFocusSession(selectedStudyDuration);
      setFocusCompletionNotice(
        `Incredible Focus! You climbed +${selectedStudyDuration * 50}m up Mount Everest and earned $BABAL study rewards!`
      );
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsRemaining, selectedStudyDuration]);

  const handleStartTimer = () => {
    setIsTimerRunning(true);
    setFocusCompletionNotice(null);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = (minutes: number = selectedStudyDuration) => {
    setIsTimerRunning(false);
    setSelectedStudyDuration(minutes);
    setSecondsRemaining(minutes * 60);
    setFocusCompletionNotice(null);
  };

  // Mountain Altitude calculation (Base: Lukla 2,840m -> Summit 8,848m)
  const currentAltitude = Math.min(8849, 2840 + totalFocusMinutes * 25);
  const progressPercent = Math.min(100, Math.round(((currentAltitude - 2840) / (8848.86 - 2840)) * 100));

  // ==================== MODE 3: IMPULSE CONTROL REFLEX ARENA ====================
  const [arenaActive, setArenaActive] = useState<boolean>(false);
  const [arenaTimeLeft, setArenaTimeLeft] = useState<number>(30);
  const [arenaScore, setArenaScore] = useState<number>(0);
  const [spawnedItems, setSpawnedItems] = useState<(ImpulseItem & { instanceId: number; x: number; y: number })[]>([]);
  const [arenaGameOver, setArenaGameOver] = useState<boolean>(false);

  useEffect(() => {
    let arenaTimer: NodeJS.Timeout | null = null;
    let spawnTimer: NodeJS.Timeout | null = null;

    if (arenaActive && arenaTimeLeft > 0) {
      arenaTimer = setInterval(() => {
        setArenaTimeLeft((prev) => prev - 1);
      }, 1000);

      spawnTimer = setInterval(() => {
        const randomItem = IMPULSE_ITEMS[Math.floor(Math.random() * IMPULSE_ITEMS.length)];
        const newItem = {
          ...randomItem,
          instanceId: Date.now() + Math.random(),
          x: Math.floor(10 + Math.random() * 75), // random horizontal %
          y: Math.floor(15 + Math.random() * 70), // random vertical %
        };
        setSpawnedItems((prev) => [...prev.slice(-5), newItem]);
      }, 1200);
    } else if (arenaTimeLeft === 0 && arenaActive) {
      setArenaActive(false);
      setArenaGameOver(true);
      if (arenaScore > 0) {
        addDisciplinePoints(arenaScore, 'Impulse Control Arena Victory');
      }
    }

    return () => {
      if (arenaTimer) clearInterval(arenaTimer);
      if (spawnTimer) clearInterval(spawnTimer);
    };
  }, [arenaActive, arenaTimeLeft, arenaScore]);

  const startArenaGame = () => {
    setArenaActive(true);
    setArenaTimeLeft(30);
    setArenaScore(0);
    setSpawnedItems([]);
    setArenaGameOver(false);
  };

  const handleItemClick = (item: ImpulseItem & { instanceId: number }) => {
    // Remove item
    setSpawnedItems((prev) => prev.filter((i) => i.instanceId !== item.instanceId));

    if (item.type === 'virtue') {
      setArenaScore((s) => s + item.penaltyOrPoints);
      playZenBell();
    } else {
      // Distraction clicked! Penalty!
      setArenaScore((s) => Math.max(0, s + item.penaltyOrPoints));
    }
  };

  // Helper formatting for timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Student Discipline Level calculation
  const getDisciplineLevel = (pts: number) => {
    if (pts >= 1000) return { title: 'Himalayan Zen Master', rank: 5, color: 'text-amber-400' };
    if (pts >= 600) return { title: 'Iron Will Achiever', rank: 4, color: 'text-emerald-400' };
    if (pts >= 300) return { title: 'Mountain Focus Climber', rank: 3, color: 'text-sky-400' };
    if (pts >= 100) return { title: 'Mindful Apprentice', rank: 2, color: 'text-purple-400' };
    return { title: 'Discipline Seeker', rank: 1, color: 'text-slate-300' };
  };

  const currentLevel = getDisciplineLevel(disciplinePoints);
  const habitCompletionRate = Math.round((completedHabitsToday.length / CORE_HABITS.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Discipline Dojo Header */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Mountain className="w-4 h-4" />
              <span>विद्यार्थी अनुशासन विकास · STUDENT DISCIPLINE ARENA</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Himalayan Discipline & Focus Master
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Gamified discipline training for students: build unbreakable morning habits, conquer digital addiction, climb Mount Everest through uninterrupted deep study, and earn $BABAL scholarship tokens.
            </p>

            {/* Sub-modes navigation */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => setActiveGameTab('ascent')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeGameTab === 'ascent'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <Mountain className="w-4 h-4" />
                <span>Everest Study Climb</span>
              </button>

              <button
                onClick={() => setActiveGameTab('habits')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeGameTab === 'habits'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Daily Habit Matrix ({completedHabitsToday.length}/{CORE_HABITS.length})</span>
              </button>

              <button
                onClick={() => setActiveGameTab('reflex_arena')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeGameTab === 'reflex_arena'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Impulse Control Mini-Game</span>
              </button>

              <button
                onClick={() => setActiveGameTab('wisdom')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeGameTab === 'wisdom'
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Badges & Wisdom</span>
              </button>
            </div>
          </div>

          {/* Student Status Card */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 w-full md:w-80 space-y-4 shrink-0 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Discipline Rank
                </div>
                <div className={`text-sm font-bold ${currentLevel.color}`}>
                  {currentLevel.title}
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>{disciplineStreak} Day Streak</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-850">
                <div className="text-slate-500">Discipline Points</div>
                <div className="text-base font-black text-amber-400">{disciplinePoints} PTS</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-850">
                <div className="text-slate-500">Focus Recorded</div>
                <div className="text-base font-black text-emerald-400">{totalFocusMinutes} Mins</div>
              </div>
            </div>

            {/* Altitude Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Everest Climb Progress</span>
                <span className="font-mono text-amber-400 font-bold">{Math.round(currentAltitude)}m / 8,848m</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODE 1: EVEREST FOCUS STUDY ASCENT (POMODORO) */}
      {/* ============================================================== */}
      {activeGameTab === 'ascent' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Pomodoro Clock Card */}
          <div className="lg:col-span-2 rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col items-center justify-between space-y-6 shadow-xl relative overflow-hidden">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Target className="w-4 h-4 text-amber-400" />
                <span>Active Target: <strong>{studySubject}</strong></span>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={() => setIsAmbientSoundOn(!isAmbientSoundOn)}
                className={`p-2 rounded-xl text-xs border transition-colors flex items-center gap-1.5 ${
                  isAmbientSoundOn
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Toggle Himalayan Tibetan Bell Chime"
              >
                {isAmbientSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden sm:inline">Zen Chimes</span>
              </button>
            </div>

            {/* Large Digital Clock Display */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center bg-slate-950/80 shadow-inner">
              <div className="absolute inset-2 rounded-full border border-amber-500/20"></div>

              <div className="text-5xl sm:text-6xl font-black font-mono tracking-tighter text-white">
                {formatTime(secondsRemaining)}
              </div>

              <div className="text-xs text-amber-400 font-semibold tracking-wider uppercase mt-2">
                {isTimerRunning ? 'Deep Focus In Progress' : 'Ready To Begin'}
              </div>

              <div className="text-[11px] text-slate-500 mt-1">
                Altitude: {Math.round(currentAltitude)}m
              </div>
            </div>

            {/* Timer Presets */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { label: '15m Quick Drill', mins: 15 },
                { label: '25m Classic Pomodoro', mins: 25 },
                { label: '45m Deep Mastery', mins: 45 },
                { label: '60m Summit Push', mins: 60 },
              ].map((preset) => (
                <button
                  key={preset.mins}
                  disabled={isTimerRunning}
                  onClick={() => handleResetTimer(preset.mins)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedStudyDuration === preset.mins
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Study Subject Input */}
            <div className="w-full max-w-md">
              <input
                type="text"
                disabled={isTimerRunning}
                value={studySubject}
                onChange={(e) => setStudySubject(e.target.value)}
                placeholder="What subject or problem are you studying?"
                className="w-full bg-slate-950 text-xs text-white p-3 rounded-xl border border-slate-800 text-center focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {!isTimerRunning ? (
                <button
                  onClick={handleStartTimer}
                  className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transform hover:scale-105"
                >
                  <Play className="w-5 h-5 fill-slate-950" />
                  <span>Begin Focus Climb</span>
                </button>
              ) : (
                <button
                  onClick={handlePauseTimer}
                  className="px-8 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-sm tracking-wide transition-all shadow-lg shadow-rose-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Pause className="w-5 h-5 fill-white" />
                  <span>Pause Timer</span>
                </button>
              )}

              <button
                onClick={() => handleResetTimer(selectedStudyDuration)}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {focusCompletionNotice && (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 text-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{focusCompletionNotice}</span>
              </div>
            )}
          </div>

          {/* Right Column: Mountain Milestones & Study Rules */}
          <div className="space-y-6">
            {/* Mountain Camps Progress */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Mountain className="w-5 h-5 text-amber-400" />
                <span>Himalayan Altitude Milestones</span>
              </h3>

              <div className="space-y-3 text-xs">
                {[
                  { name: 'Lukla Hillary Airport', alt: 2840, reached: currentAltitude >= 2840 },
                  { name: 'Namche Bazaar (Sherpa Capital)', alt: 3440, reached: currentAltitude >= 3440 },
                  { name: 'Tengboche Monastery', alt: 3860, reached: currentAltitude >= 3860 },
                  { name: 'Dingboche Alpine Valley', alt: 4410, reached: currentAltitude >= 4410 },
                  { name: 'Lobuche Glacier Camp', alt: 4910, reached: currentAltitude >= 4910 },
                  { name: 'Everest Base Camp', alt: 5364, reached: currentAltitude >= 5364 },
                  { name: 'Kala Patthar Sunrise', alt: 5550, reached: currentAltitude >= 5550 },
                  { name: 'Mount Everest Summit', alt: 8848, reached: currentAltitude >= 8848 },
                ].map((milestone, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      milestone.reached
                        ? 'bg-amber-500/10 border-amber-500/30 text-white'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          milestone.reached ? 'bg-amber-400 shadow-sm shadow-amber-400' : 'bg-slate-700'
                        }`}
                      ></div>
                      <span className="font-semibold">{milestone.name}</span>
                    </div>
                    <span className="font-mono text-[11px]">{milestone.alt}m</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Iron Discipline Study Rules */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-3 shadow-xl text-xs">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>Student Discipline Code</span>
              </h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Phone Policy:</strong> Place your mobile in another room in silent mode.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Single-Tasking:</strong> Finish one chapter or 5 difficult problems before taking a break.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Earn $BABAL Rewards:</strong> Every 25 minutes of deep study mines 1.25 $BABAL tokens into your student wallet.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 2: DAILY HABIT MATRIX */}
      {/* ============================================================== */}
      {activeGameTab === 'habits' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Daily Willpower & Character Habit Matrix
              </h2>
              <p className="text-xs text-slate-400">
                Small consistent actions repeated every single day compound into superhuman discipline and academic excellence.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-400">Daily Completion</div>
                <div className="text-xl font-black text-amber-400">{habitCompletionRate}%</div>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-slate-800 flex items-center justify-center text-xs font-mono font-bold text-white bg-slate-950">
                {completedHabitsToday.length}/{CORE_HABITS.length}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CORE_HABITS.map((habit) => {
              const isDone = completedHabitsToday.includes(habit.id);
              return (
                <div
                  key={habit.id}
                  onClick={() => toggleHabitCompletion(habit.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/50 shadow-md shadow-emerald-500/5'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-semibold text-slate-400 border border-slate-800">
                        {habit.category}
                      </span>
                      {habit.timeTarget && (
                        <span className="text-[10px] text-amber-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {habit.timeTarget}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {habit.title}
                      </h4>
                      {habit.localTitle && (
                        <div className="text-xs text-amber-400/90 font-medium">
                          {habit.localTitle}
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {habit.description}
                    </p>

                    <div className="text-[11px] font-mono text-emerald-400 font-bold">
                      +{habit.points} Points & +0.25 $BABAL
                    </div>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                        : 'border-slate-700 bg-slate-950 text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 fill-current" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 3: IMPULSE RESISTANCE REFLEX ARENA (MINI-GAME) */}
      {/* ============================================================== */}
      {activeGameTab === 'reflex_arena' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Impulse Control Reflex Arena
              </h2>
              <p className="text-xs text-slate-400">
                Train your brain to conquer quick dopamine temptation traps! Tap the <strong>Virtues</strong> to earn points, and <strong>RESIST clicking the Distractions</strong>!
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-slate-400">Arena Score</div>
                <div className="text-2xl font-black text-amber-400">{arenaScore} PTS</div>
              </div>

              {!arenaActive ? (
                <button
                  onClick={startArenaGame}
                  className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>Start 30s Challenge</span>
                </button>
              ) : (
                <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold text-rose-400">
                  Time Left: {arenaTimeLeft}s
                </div>
              )}
            </div>
          </div>

          {/* Interactive Arena Board */}
          <div className="relative h-96 w-full rounded-3xl bg-slate-950 border-2 border-slate-800 overflow-hidden flex items-center justify-center">
            {/* Grid pattern background */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

            {!arenaActive && !arenaGameOver && (
              <div className="text-center space-y-3 z-10 p-6 max-w-md">
                <Zap className="w-12 h-12 text-rose-500 mx-auto" />
                <h3 className="text-lg font-bold text-white">Dopamine Reflex Challenge</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Items will appear rapidly across the arena. Click only Virtues (Laser Focus, Punctuality, Integrity). Do not click Distractions (Doomscrolling, Snooze)!
                </p>
                <button
                  onClick={startArenaGame}
                  className="px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs transition-all shadow-md shadow-rose-500/30"
                >
                  Enter Reflex Arena
                </button>
              </div>
            )}

            {arenaGameOver && (
              <div className="text-center space-y-3 z-10 p-6 max-w-md bg-slate-900/90 rounded-2xl border border-slate-800 backdrop-blur-md">
                <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Round Completed!</h3>
                <div className="text-2xl font-black text-emerald-400">+{arenaScore} Points Earned</div>
                <p className="text-xs text-slate-300">
                  Great self-control practice! Your discipline points have been added to your profile.
                </p>
                <button
                  onClick={startArenaGame}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Play Again
                </button>
              </div>
            )}

            {/* Spawned Floating Items */}
            {arenaActive &&
              spawnedItems.map((item) => (
                <button
                  key={item.instanceId}
                  onClick={() => handleItemClick(item)}
                  style={{
                    position: 'absolute',
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border shadow-lg transform active:scale-90 transition-all cursor-pointer animate-in zoom-in duration-150 ${item.color}`}
                >
                  <div className="flex items-center gap-1.5">
                    {item.type === 'virtue' ? (
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span>{item.label}</span>
                  </div>
                  <div className="text-[10px] text-right font-mono mt-0.5">
                    {item.type === 'virtue' ? `+${item.penaltyOrPoints}` : `${item.penaltyOrPoints}`}
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 4: BADGES & HIMALAYAN VEDIC WISDOM */}
      {/* ============================================================== */}
      {activeGameTab === 'wisdom' && (
        <div className="space-y-6">
          {/* Unlocked Badges */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Student Discipline Badges</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {disciplineBadges.map((badge) => {
                const unlocked = !!badge.unlockedAt;
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 ${
                      unlocked
                        ? 'bg-amber-500/10 border-amber-500/30 text-white'
                        : 'bg-slate-950/60 border-slate-850 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400">
                        <Award className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold">
                        {unlocked ? 'UNLOCKED' : badge.criteria}
                      </span>
                    </div>

                    <div>
                      <div className="text-sm font-bold text-white">{badge.title}</div>
                      <div className="text-xs text-slate-400 mt-1">{badge.description}</div>
                    </div>

                    {unlocked && (
                      <div className="text-[10px] text-amber-400 font-mono">
                        Earned: {badge.unlockedAt}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Himalayan Wisdom Scrolls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DISCIPLINE_VIRTUES.map((v) => (
              <div
                key={v.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                    {v.localName}
                  </span>
                  <span className="text-xs text-slate-500">{v.author}</span>
                </div>
                <h4 className="text-base font-bold text-white">{v.name}</h4>
                <blockquote className="text-xs italic text-slate-300 border-l-2 border-amber-500 pl-3">
                  "{v.quote}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
