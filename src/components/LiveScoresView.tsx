import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SportsLeague, MatchStatus, LiveMatch } from '../types';
import {
  Trophy,
  Activity,
  Radio,
  Flame,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Zap,
  BarChart2,
  Award,
  Vote,
  Share2,
  ExternalLink,
  Shield,
  Coins,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export const LiveScoresView: React.FC = () => {
  const {
    liveMatches,
    selectedMatchId,
    setSelectedMatchId,
    activeLeagueFilter,
    setActiveLeagueFilter,
    activeMatchStatusFilter,
    setActiveMatchStatusFilter,
    nplPointsTable,
    iplPointsTable,
    voteMatchPoll,
    simulateNextBall,
    isAutoScoreTickEnabled,
    setIsAutoScoreTickEnabled,
    setActiveTab,
    user,
  } = useApp();

  // Tab View Mode: 'matches' or 'standings'
  const [viewMode, setViewMode] = useState<'matches' | 'standings'>('matches');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedScorecardMatch, setSelectedScorecardMatch] = useState<LiveMatch | null>(null);
  const [activeScorecardTab, setActiveScorecardTab] = useState<'summary' | 'commentary' | 'squad'>('summary');

  // Filtered matches
  const filteredMatches = liveMatches.filter((m) => {
    const matchLeague = activeLeagueFilter === 'ALL' || m.league === activeLeagueFilter;
    const matchStatus = activeMatchStatusFilter === 'ALL' || m.status === activeMatchStatusFilter;
    return matchLeague && matchStatus;
  });

  // Active Featured match (default to selected or first live match)
  const featuredMatch =
    liveMatches.find((m) => m.id === selectedMatchId) ||
    liveMatches.find((m) => m.status === 'Live') ||
    liveMatches[0];

  const liveMatchesCount = liveMatches.filter((m) => m.status === 'Live').length;

  const handleVote = (matchId: string, teamId: string) => {
    voteMatchPoll(matchId, teamId);
  };

  const handleSimulateBall = () => {
    if (featuredMatch && featuredMatch.status === 'Live') {
      simulateNextBall(featuredMatch.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border-b border-red-900/30 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="font-mono font-bold text-red-300 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-red-400" />
              <span>Babal Sports Live Scorecast</span>
            </span>
            <span className="text-slate-400 hidden md:inline">•</span>
            <span className="text-slate-300 hidden md:inline">
              Nepal Premier League (NPL), Indian Premier League (IPL), ICC T20 & Football
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto Tick Control */}
            <button
              onClick={() => setIsAutoScoreTickEnabled(!isAutoScoreTickEnabled)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold transition-all cursor-pointer ${
                isAutoScoreTickEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title="Toggle Live Ball-by-Ball Auto Simulator"
            >
              {isAutoScoreTickEnabled ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
              <span>Auto-Tick: {isAutoScoreTickEnabled ? 'ON' : 'PAUSED'}</span>
            </button>

            {/* Manual Next Ball Simulation */}
            <button
              onClick={handleSimulateBall}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold font-mono transition-all cursor-pointer"
              title="Advance one ball in live match"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Next Ball ⚡</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
              title={soundEnabled ? 'Mute Alerts' : 'Enable Sound Alerts'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Header Title & League Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 via-amber-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-red-500/20 text-white font-black text-lg">
                🏏
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2 tracking-tight">
                  <span>लाइभ खेल स्कोर (Live Scores)</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-red-600 text-white uppercase tracking-wider animate-pulse">
                    {liveMatchesCount} LIVE NOW
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Real-time ball-by-ball updates for NPL, IPL, ICC Men's Cricket & Nepal Super League.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Views Switcher: Matches vs Points Table */}
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setViewMode('matches')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'matches'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Live Matches ({liveMatches.length})</span>
            </button>
            <button
              onClick={() => setViewMode('standings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'standings'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Points Table (अंक तालिका)</span>
            </button>
          </div>
        </div>

        {/* League Selector Chips (Icon-Rich Presentation) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveLeagueFilter('ALL')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
              activeLeagueFilter === 'ALL'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800 hover:bg-slate-850'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>All Tournaments ({liveMatches.length})</span>
          </button>

          {/* NPL - Nepal Premier League */}
          <button
            onClick={() => setActiveLeagueFilter('NPL')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
              activeLeagueFilter === 'NPL'
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white border-red-400 shadow-md shadow-red-500/30'
                : 'bg-red-950/20 text-red-300 hover:text-white border-red-900/40 hover:bg-red-950/40'
            }`}
          >
            <span className="text-base">🇳🇵</span>
            <span>Nepal Premier League (NPL)</span>
            <span className="px-1.5 py-0.2 rounded bg-red-600/60 text-[10px] font-mono text-white">
              HOT
            </span>
          </button>

          {/* IPL - Indian Premier League */}
          <button
            onClick={() => setActiveLeagueFilter('IPL')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
              activeLeagueFilter === 'IPL'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                : 'bg-amber-950/20 text-amber-300 hover:text-white border-amber-900/40 hover:bg-amber-950/40'
            }`}
          >
            <span className="text-base">🇮🇳</span>
            <span>Indian Premier League (IPL)</span>
          </button>

          {/* ICC & Nepal International */}
          <button
            onClick={() => setActiveLeagueFilter('ICC_T20')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
              activeLeagueFilter === 'ICC_T20'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 shadow-md shadow-blue-500/30'
                : 'bg-blue-950/20 text-blue-300 hover:text-white border-blue-900/40 hover:bg-blue-950/40'
            }`}
          >
            <span className="text-base">🌍</span>
            <span>ICC & Nepal National Team</span>
          </button>

          {/* Football: NSL & EPL */}
          <button
            onClick={() => setActiveLeagueFilter('FOOTBALL_NSL')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
              activeLeagueFilter === 'FOOTBALL_NSL'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 shadow-md shadow-emerald-500/30'
                : 'bg-emerald-950/20 text-emerald-300 hover:text-white border-emerald-900/40 hover:bg-emerald-950/40'
            }`}
          >
            <span className="text-base">⚽</span>
            <span>Nepal Super League (NSL)</span>
          </button>

          <button
            onClick={() => setActiveLeagueFilter('FOOTBALL_EPL')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
              activeLeagueFilter === 'FOOTBALL_EPL'
                ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white border-purple-400 shadow-md shadow-purple-500/30'
                : 'bg-purple-950/20 text-purple-300 hover:text-white border-purple-900/40 hover:bg-purple-950/40'
            }`}
          >
            <span className="text-base">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
            <span>English Premier League</span>
          </button>
        </div>

        {/* Status Filter (Live, Upcoming, Completed) */}
        {viewMode === 'matches' && (
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveMatchStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeMatchStatusFilter === 'ALL'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Matches ({liveMatches.length})
              </button>

              <button
                onClick={() => setActiveMatchStatusFilter('Live')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeMatchStatusFilter === 'Live'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'text-slate-400 hover:text-red-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>Live Now ({liveMatches.filter((m) => m.status === 'Live').length})</span>
              </button>

              <button
                onClick={() => setActiveMatchStatusFilter('Upcoming')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeMatchStatusFilter === 'Upcoming'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'text-slate-400 hover:text-blue-300'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Upcoming ({liveMatches.filter((m) => m.status === 'Upcoming').length})</span>
              </button>

              <button
                onClick={() => setActiveMatchStatusFilter('Completed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeMatchStatusFilter === 'Completed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-emerald-300'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Results ({liveMatches.filter((m) => m.status === 'Completed').length})</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-400 font-mono">
              <Coins className="w-4 h-4" />
              <span>Predict & Win $BABAL Tokens</span>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW MODE 1: MATCHES & LIVE SCOREBOARD
           ======================================================== */}
        {viewMode === 'matches' && (
          <div className="space-y-6">
            {/* FEATURED LIVE MATCH CENTER */}
            {featuredMatch && (
              <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-red-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl -z-10"></div>

                {/* Match Header Info */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-mono font-bold text-xs flex items-center gap-1.5 uppercase tracking-wider animate-pulse">
                      <Radio className="w-3 h-3" />
                      <span>{featuredMatch.status}</span>
                    </span>
                    <span className="font-bold text-white text-xs sm:text-sm">
                      {featuredMatch.tournamentName} • {featuredMatch.matchNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      <span>{featuredMatch.venue}, {featuredMatch.venueCity}</span>
                    </span>
                  </div>
                </div>

                {/* Scoreboard Dual Grid */}
                <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Team A */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <img
                        src={featuredMatch.teamA.logo}
                        alt={featuredMatch.teamA.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md"
                      />
                      <div>
                        <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-1.5">
                          <span>{featuredMatch.teamA.name}</span>
                          <span className="text-xs font-mono text-slate-400 font-normal">
                            ({featuredMatch.teamA.shortName})
                          </span>
                        </h3>
                        {featuredMatch.teamA.nameNepali && (
                          <span className="text-xs text-amber-400 font-medium block">
                            {featuredMatch.teamA.nameNepali}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 font-mono">
                          Captain: {featuredMatch.teamA.captain || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {featuredMatch.scoreA ? (
                        <div>
                          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                            {featuredMatch.scoreA.runs}/{featuredMatch.scoreA.wickets}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            ({featuredMatch.scoreA.overs}.{featuredMatch.scoreA.balls} ov)
                          </div>
                        </div>
                      ) : featuredMatch.footballData ? (
                        <div className="text-3xl font-black text-white font-mono">
                          {featuredMatch.footballData.homeScore}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 font-mono">Yet to bat</span>
                      )}
                    </div>
                  </div>

                  {/* Team B (Chasing / Batting) */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 ring-1 ring-amber-500/20">
                    <div className="flex items-center gap-3">
                      <img
                        src={featuredMatch.teamB.logo}
                        alt={featuredMatch.teamB.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md"
                      />
                      <div>
                        <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-1.5">
                          <span>{featuredMatch.teamB.name}</span>
                          <span className="text-xs font-mono text-slate-400 font-normal">
                            ({featuredMatch.teamB.shortName})
                          </span>
                        </h3>
                        {featuredMatch.teamB.nameNepali && (
                          <span className="text-xs text-amber-400 font-medium block">
                            {featuredMatch.teamB.nameNepali}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 font-mono">
                          Captain: {featuredMatch.teamB.captain || 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {featuredMatch.scoreB ? (
                        <div>
                          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight">
                            {featuredMatch.scoreB.runs}/{featuredMatch.scoreB.wickets}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            ({featuredMatch.scoreB.overs}.{featuredMatch.scoreB.balls} ov)
                          </div>
                        </div>
                      ) : featuredMatch.footballData ? (
                        <div className="text-3xl font-black text-amber-400 font-mono">
                          {featuredMatch.footballData.awayScore}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 font-mono">Yet to bat</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Match Equation Banner */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/80 border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
                    <div>
                      <span className="font-bold text-white text-sm block">
                        {featuredMatch.statusText}
                      </span>
                      {featuredMatch.statusTextNepali && (
                        <span className="text-xs text-amber-400 font-medium block">
                          {featuredMatch.statusTextNepali}
                        </span>
                      )}
                    </div>
                  </div>

                  {featuredMatch.requiredRunRate && (
                    <div className="flex items-center gap-3 font-mono text-xs shrink-0">
                      <span className="text-slate-400">
                        CRR: <strong className="text-white">{featuredMatch.currentRunRate || '8.5'}</strong>
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-amber-300">
                        RRR: <strong className="text-amber-400">{featuredMatch.requiredRunRate}</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Live Over Strip (Ball-by-Ball) */}
                {featuredMatch.recentBalls && featuredMatch.recentBalls.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                      Recent Balls:
                    </span>
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                      {featuredMatch.recentBalls.map((b, i) => (
                        <span
                          key={i}
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-black text-xs shadow-md ${
                            b === 'W'
                              ? 'bg-red-600 text-white animate-pulse'
                              : b === '6'
                              ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                              : b === '4'
                              ? 'bg-blue-500 text-white'
                              : b === '0'
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-emerald-600/80 text-white'
                          }`}
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Current Batters & Bowler Mini Bar */}
                {featuredMatch.currentBatsmen && featuredMatch.currentBatsmen.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Batters */}
                    <div className="md:col-span-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider block">
                        Batting (ब्याट्सम्यानहरू):
                      </span>
                      <div className="space-y-1">
                        {featuredMatch.currentBatsmen.map((bat) => (
                          <div key={bat.id} className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white flex items-center gap-1">
                              <span>{bat.name}</span>
                              {bat.isStriker && <span className="text-amber-400 font-black">*</span>}
                            </span>
                            <div className="font-mono text-slate-300 flex items-center gap-3">
                              <span className="font-black text-white">{bat.runs} ({bat.balls})</span>
                              <span className="text-slate-400">4s: {bat.fours}</span>
                              <span className="text-slate-400">6s: {bat.sixes}</span>
                              <span className="text-amber-400 text-[11px]">SR: {bat.strikeRate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bowler */}
                    {featuredMatch.currentBowler && (
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider block">
                          Current Bowler (बलिङ):
                        </span>
                        <div>
                          <span className="font-bold text-white text-xs block">
                            {featuredMatch.currentBowler.name}
                          </span>
                          <div className="font-mono text-xs text-slate-300 mt-1 flex items-center justify-between">
                            <span>{featuredMatch.currentBowler.overs} ov</span>
                            <span className="text-red-400 font-bold">{featuredMatch.currentBowler.wickets} wkt</span>
                            <span>{featuredMatch.currentBowler.runs} runs</span>
                            <span className="text-[11px] text-slate-400">Econ: {featuredMatch.currentBowler.economy}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Match Prediction Fan Poll */}
                {featuredMatch.poll && (
                  <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <Vote className="w-4 h-4 text-amber-400" />
                        <span>Fan Match Prediction Poll (कसले जित्छ?)</span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        +0.50 $BABAL Reward
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Vote Team A */}
                      <button
                        onClick={() => handleVote(featuredMatch.id, featuredMatch.teamA.id)}
                        disabled={!!featuredMatch.poll.userVotedTeamId}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          featuredMatch.poll.userVotedTeamId === featuredMatch.teamA.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'
                        }`}
                      >
                        <span>{featuredMatch.teamA.name}</span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {featuredMatch.poll.teamAVotes} votes ({Math.round(
                            (featuredMatch.poll.teamAVotes /
                              (featuredMatch.poll.teamAVotes + featuredMatch.poll.teamBVotes)) *
                              100
                          )}%)
                        </span>
                      </button>

                      {/* Vote Team B */}
                      <button
                        onClick={() => handleVote(featuredMatch.id, featuredMatch.teamB.id)}
                        disabled={!!featuredMatch.poll.userVotedTeamId}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          featuredMatch.poll.userVotedTeamId === featuredMatch.teamB.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'
                        }`}
                      >
                        <span>{featuredMatch.teamB.name}</span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {featuredMatch.poll.teamBVotes} votes ({Math.round(
                            (featuredMatch.poll.teamBVotes /
                              (featuredMatch.poll.teamAVotes + featuredMatch.poll.teamBVotes)) *
                              100
                          )}%)
                        </span>
                      </button>
                    </div>

                    {featuredMatch.poll.userVotedTeamId && (
                      <p className="text-[11px] text-center text-emerald-400 font-mono">
                        ✅ Your vote has been recorded on the Babal blockchain ledger!
                      </p>
                    )}
                  </div>
                )}

                {/* Live Commentary Feed Preview */}
                {featuredMatch.commentary && featuredMatch.commentary.length > 0 && (
                  <div className="mt-5 space-y-2">
                    <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider flex items-center justify-between">
                      <span>Ball-by-Ball Live Commentary</span>
                      <button
                        onClick={() => setSelectedScorecardMatch(featuredMatch)}
                        className="text-amber-400 hover:text-amber-300 text-xs font-sans flex items-center gap-1"
                      >
                        <span>View Full Scorecard</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </span>

                    <div className="space-y-2">
                      {featuredMatch.commentary.slice(0, 3).map((comm) => (
                        <div
                          key={comm.id}
                          className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3"
                        >
                          <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-400 shrink-0">
                            {comm.over}.{comm.ball}
                          </span>
                          <div className="flex-1 text-xs">
                            <p className="text-slate-200 leading-relaxed">{comm.description}</p>
                            {comm.descriptionNepali && (
                              <p className="text-amber-400 font-medium text-[11px] mt-0.5">
                                {comm.descriptionNepali}
                              </p>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0">
                            {comm.timestamp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ALL MATCHES CARD GRID */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center justify-between">
                <span>All Scheduled Matches & Fixtures</span>
                <span className="text-xs text-slate-400 font-mono">{filteredMatches.length} Fixtures</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMatches.map((match) => (
                  <div
                    key={match.id}
                    onClick={() => {
                      setSelectedMatchId(match.id);
                      if (match.id !== featuredMatch?.id) {
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }
                    }}
                    className={`p-4 rounded-2xl bg-slate-900/90 border transition-all cursor-pointer flex flex-col justify-between group hover:border-amber-500/40 shadow-lg ${
                      featuredMatch?.id === match.id
                        ? 'border-amber-500 ring-1 ring-amber-500/20'
                        : 'border-slate-800'
                    }`}
                  >
                    <div>
                      {/* Match Meta Badge */}
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="font-mono font-bold text-slate-400 text-[11px]">
                          {match.tournamentName}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                            match.status === 'Live'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                              : match.status === 'Completed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          }`}
                        >
                          {match.status}
                        </span>
                      </div>

                      {/* Team A */}
                      <div className="flex items-center justify-between py-1.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={match.teamA.logo}
                            alt={match.teamA.name}
                            className="w-7 h-7 rounded-lg object-cover border border-slate-800"
                          />
                          <span className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                            {match.teamA.name}
                          </span>
                        </div>
                        <div className="text-right font-mono font-bold text-sm text-slate-200">
                          {match.scoreA ? (
                            <span>{match.scoreA.runs}/{match.scoreA.wickets}</span>
                          ) : match.footballData ? (
                            <span>{match.footballData.homeScore}</span>
                          ) : (
                            <span className="text-slate-500 text-xs">-</span>
                          )}
                        </div>
                      </div>

                      {/* Team B */}
                      <div className="flex items-center justify-between py-1.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={match.teamB.logo}
                            alt={match.teamB.name}
                            className="w-7 h-7 rounded-lg object-cover border border-slate-800"
                          />
                          <span className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                            {match.teamB.name}
                          </span>
                        </div>
                        <div className="text-right font-mono font-bold text-sm text-slate-200">
                          {match.scoreB ? (
                            <span className="text-amber-400">{match.scoreB.runs}/{match.scoreB.wickets}</span>
                          ) : match.footballData ? (
                            <span className="text-amber-400">{match.footballData.awayScore}</span>
                          ) : (
                            <span className="text-slate-500 text-xs">-</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Status & Venue */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                        {match.statusText}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedScorecardMatch(match);
                        }}
                        className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-0.5"
                      >
                        <span>Card</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW MODE 2: POINTS TABLE (STANDINGS)
           ======================================================== */}
        {viewMode === 'standings' && (
          <div className="space-y-6">
            {/* NPL Points Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🇳🇵</span>
                  <div>
                    <h3 className="font-bold text-white text-base">Nepal Premier League (NPL 2026) Standings</h3>
                    <p className="text-xs text-slate-400">Official tournament points table and Net Run Rate (NRR)</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-lg bg-red-600/20 text-red-300 border border-red-500/30 text-xs font-mono font-bold">
                  8 Franchises
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3">Pos</th>
                      <th className="py-3 px-4">Team</th>
                      <th className="py-3 px-3 text-center">P</th>
                      <th className="py-3 px-3 text-center">W</th>
                      <th className="py-3 px-3 text-center">L</th>
                      <th className="py-3 px-3 text-center">NR</th>
                      <th className="py-3 px-4 text-center">NRR</th>
                      <th className="py-3 px-4 text-center font-bold text-white">PTS</th>
                      <th className="py-3 px-4 text-center">Recent Form</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {nplPointsTable.map((team, idx) => (
                      <tr
                        key={team.teamId}
                        className={`hover:bg-slate-850/50 transition-colors ${
                          idx < 4 ? 'bg-emerald-950/10' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-bold text-slate-400">
                          {idx + 1}
                          {idx < 4 && <span className="text-emerald-400 ml-1">●</span>}
                        </td>
                        <td className="py-3 px-4 font-sans flex items-center gap-2">
                          <img
                            src={team.logo}
                            alt={team.teamName}
                            className="w-6 h-6 rounded-md object-cover border border-slate-800"
                          />
                          <span className="font-bold text-white">{team.teamName}</span>
                        </td>
                        <td className="py-3 px-3 text-center">{team.played}</td>
                        <td className="py-3 px-3 text-center text-emerald-400 font-bold">{team.won}</td>
                        <td className="py-3 px-3 text-center text-red-400">{team.lost}</td>
                        <td className="py-3 px-3 text-center text-slate-500">{team.tiedOrNR}</td>
                        <td className="py-3 px-4 text-center font-bold text-slate-300">
                          {team.netRunRate > 0 ? `+${team.netRunRate.toFixed(3)}` : team.netRunRate.toFixed(3)}
                        </td>
                        <td className="py-3 px-4 text-center font-black text-amber-400 text-sm">
                          {team.points}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {team.form.map((f, i) => (
                              <span
                                key={i}
                                className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center ${
                                  f === 'W'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-red-600 text-white'
                                }`}
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 font-mono">
                ● Top 4 teams qualify for the NPL Playoffs (Qualifier 1, Eliminator, and Final at TU Ground).
              </p>
            </div>

            {/* IPL Points Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🇮🇳</span>
                  <div>
                    <h3 className="font-bold text-white text-base">Indian Premier League (IPL 2026) Standings</h3>
                    <p className="text-xs text-slate-400">Current tournament rankings and NRR</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                  IPL Table
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3">Pos</th>
                      <th className="py-3 px-4">Team</th>
                      <th className="py-3 px-3 text-center">P</th>
                      <th className="py-3 px-3 text-center">W</th>
                      <th className="py-3 px-3 text-center">L</th>
                      <th className="py-3 px-4 text-center">NRR</th>
                      <th className="py-3 px-4 text-center font-bold text-white">PTS</th>
                      <th className="py-3 px-4 text-center">Recent Form</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {iplPointsTable.map((team, idx) => (
                      <tr key={team.teamId} className="hover:bg-slate-850/50 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-400">{idx + 1}</td>
                        <td className="py-3 px-4 font-sans flex items-center gap-2">
                          <img
                            src={team.logo}
                            alt={team.teamName}
                            className="w-6 h-6 rounded-md object-cover border border-slate-800"
                          />
                          <span className="font-bold text-white">{team.teamName}</span>
                        </td>
                        <td className="py-3 px-3 text-center">{team.played}</td>
                        <td className="py-3 px-3 text-center text-emerald-400 font-bold">{team.won}</td>
                        <td className="py-3 px-3 text-center text-red-400">{team.lost}</td>
                        <td className="py-3 px-4 text-center font-bold text-slate-300">
                          {team.netRunRate > 0 ? `+${team.netRunRate.toFixed(3)}` : team.netRunRate.toFixed(3)}
                        </td>
                        <td className="py-3 px-4 text-center font-black text-amber-400 text-sm">
                          {team.points}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {team.form.map((f, i) => (
                              <span
                                key={i}
                                className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center ${
                                  f === 'W'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-red-600 text-white'
                                }`}
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FULL MATCH DETAIL SCORECARD MODAL */}
      {selectedScorecardMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
              <div>
                <span className="text-[11px] font-mono text-red-400 font-bold uppercase tracking-wider block">
                  {selectedScorecardMatch.tournamentName} • {selectedScorecardMatch.matchNumber}
                </span>
                <h3 className="font-bold text-white text-base sm:text-lg">
                  {selectedScorecardMatch.teamA.name} vs {selectedScorecardMatch.teamB.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedScorecardMatch(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Scorecard Tabs */}
            <div className="flex items-center border-b border-slate-800 px-5 pt-3 gap-3">
              <button
                onClick={() => setActiveScorecardTab('summary')}
                className={`pb-2 text-xs font-bold transition-all border-b-2 ${
                  activeScorecardTab === 'summary'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Match Summary & Batting
              </button>
              <button
                onClick={() => setActiveScorecardTab('commentary')}
                className={`pb-2 text-xs font-bold transition-all border-b-2 ${
                  activeScorecardTab === 'commentary'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Live Commentary Feed
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-5 space-y-4">
              {activeScorecardTab === 'summary' && (
                <div className="space-y-4">
                  {/* Scores Summary */}
                  <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div>
                      <span className="text-xs text-slate-400 block">{selectedScorecardMatch.teamA.name}</span>
                      <span className="text-xl font-black text-white font-mono">
                        {selectedScorecardMatch.scoreA
                          ? `${selectedScorecardMatch.scoreA.runs}/${selectedScorecardMatch.scoreA.wickets} (${selectedScorecardMatch.scoreA.overs} ov)`
                          : '-'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">{selectedScorecardMatch.teamB.name}</span>
                      <span className="text-xl font-black text-amber-400 font-mono">
                        {selectedScorecardMatch.scoreB
                          ? `${selectedScorecardMatch.scoreB.runs}/${selectedScorecardMatch.scoreB.wickets} (${selectedScorecardMatch.scoreB.overs}.${selectedScorecardMatch.scoreB.balls} ov)`
                          : '-'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-white bg-slate-850 p-2.5 rounded-xl border border-slate-700">
                    {selectedScorecardMatch.statusText}
                  </p>

                  {/* Batting Card */}
                  {selectedScorecardMatch.currentBatsmen && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono uppercase text-slate-400 font-bold">Current Innings Batting</h4>
                      <table className="w-full text-left text-xs text-slate-300 font-mono">
                        <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase">
                          <tr>
                            <th className="py-2 px-3">Batter</th>
                            <th className="py-2 px-2 text-center">R</th>
                            <th className="py-2 px-2 text-center">B</th>
                            <th className="py-2 px-2 text-center">4s</th>
                            <th className="py-2 px-2 text-center">6s</th>
                            <th className="py-2 px-2 text-center">SR</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {selectedScorecardMatch.currentBatsmen.map((b) => (
                            <tr key={b.id}>
                              <td className="py-2 px-3 font-sans font-bold text-white">
                                {b.name} {b.isStriker && '*'}
                              </td>
                              <td className="py-2 px-2 text-center font-black text-amber-400">{b.runs}</td>
                              <td className="py-2 px-2 text-center">{b.balls}</td>
                              <td className="py-2 px-2 text-center">{b.fours}</td>
                              <td className="py-2 px-2 text-center">{b.sixes}</td>
                              <td className="py-2 px-2 text-center">{b.strikeRate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Match Info */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs text-slate-400 font-mono">
                    <div><strong>Venue:</strong> {selectedScorecardMatch.venue}, {selectedScorecardMatch.venueCity}</div>
                    {selectedScorecardMatch.tossResult && (
                      <div><strong>Toss:</strong> {selectedScorecardMatch.tossResult}</div>
                    )}
                    <div><strong>Date & Time:</strong> {selectedScorecardMatch.dateFormatted} • {selectedScorecardMatch.startTime}</div>
                  </div>
                </div>
              )}

              {activeScorecardTab === 'commentary' && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {selectedScorecardMatch.commentary && selectedScorecardMatch.commentary.length > 0 ? (
                    selectedScorecardMatch.commentary.map((comm) => (
                      <div
                        key={comm.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs"
                      >
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 shrink-0">
                          {comm.over}.{comm.ball}
                        </span>
                        <div className="flex-1">
                          <p className="text-slate-200">{comm.description}</p>
                          {comm.descriptionNepali && (
                            <p className="text-amber-400 text-[11px] mt-0.5">{comm.descriptionNepali}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-6">No commentary available for this fixture.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
