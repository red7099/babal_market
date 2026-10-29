import React, { useState } from 'react';
import {
  Code,
  GitBranch,
  GitCommit as GitCommitIcon,
  GitPullRequest,
  Star,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Boxes,
  Cpu,
  Download,
  Share2,
  Folder,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OpenSourceModule, GitCommit } from '../types';

export const OpenSourceView: React.FC = () => {
  const { openSourceModules, gitCommits } = useApp();

  const [activeTab, setActiveTab] = useState<'architecture' | 'commits' | 'contributing' | 'license'>('architecture');
  const [selectedModule, setSelectedModule] = useState<OpenSourceModule>(openSourceModules[0]);
  const [copiedClone, setCopiedClone] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [starred, setStarred] = useState(false);
  const [starCount, setStarCount] = useState(4829);

  const cloneCommand = 'git clone https://github.com/babal-market/core.git';

  const handleCopyClone = () => {
    navigator.clipboard.writeText(cloneCommand);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  const handleCopySnippet = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const toggleStar = () => {
    setStarred(!starred);
    setStarCount((prev) => (starred ? prev - 1 : prev + 1));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950/40 border border-slate-800 p-8 sm:p-10 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" />
                <span>100% Free & Open Source Software (FOSS)</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                MIT / Apache-2.0
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-semibold">
                v2.4.0 Public Release
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight">
              Babal Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">Open Source Engine</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              The full codebase of Babal Market is open for all developers, students, and businesses worldwide. Inspect our multi-vendor shop routing, 256-bit milestone escrow smart contracts, real-time GPS telematics, and Gemini AI concierge pipelines.
            </p>

            {/* Quick Git Clone Bar */}
            <div className="pt-2">
              <div className="flex items-center gap-2 max-w-md bg-slate-950 border border-slate-800 rounded-xl p-1.5 pl-3">
                <Terminal className="w-4 h-4 text-slate-500 shrink-0" />
                <code className="text-xs text-blue-300 font-mono flex-1 select-all truncate">
                  {cloneCommand}
                </code>
                <button
                  onClick={handleCopyClone}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all shrink-0"
                >
                  {copiedClone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedClone ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* GitHub Stats Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shrink-0 w-full lg:w-80 space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>GITHUB REPOSITORY</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Public
              </span>
            </div>

            <div className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Boxes className="w-4 h-4 text-blue-400" />
              <span>babal-market / core</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                <div className="font-mono font-bold text-amber-400 flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{starCount.toLocaleString()}</span>
                </div>
                <div className="text-[10px] text-slate-500 uppercase mt-0.5">Stars</div>
              </div>

              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                <div className="font-mono font-bold text-blue-400 flex items-center justify-center gap-1">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>612</span>
                </div>
                <div className="text-[10px] text-slate-500 uppercase mt-0.5">Forks</div>
              </div>

              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                <div className="font-mono font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <GitPullRequest className="w-3.5 h-3.5" />
                  <span>148</span>
                </div>
                <div className="text-[10px] text-slate-500 uppercase mt-0.5">PRs Merged</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleStar}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                  starred
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 hover:bg-slate-850 text-slate-200 border-slate-700'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${starred ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{starred ? 'Starred ★' : 'Star on GitHub'}</span>
              </button>

              <button
                onClick={() => {
                  alert('🔗 GitHub repository opened: https://github.com/babal-market/core (simulated)');
                }}
                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center gap-1 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Fork</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'architecture'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Core Architecture Modules</span>
        </button>

        <button
          onClick={() => setActiveTab('commits')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'commits'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <GitCommitIcon className="w-4 h-4" />
          <span>Live Git Commit Stream ({gitCommits.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('contributing')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'contributing'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Contributing & Student Bounties</span>
        </button>

        <button
          onClick={() => setActiveTab('license')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'license'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>MIT & Apache 2.0 Licenses</span>
        </button>
      </div>

      {/* TAB 1: ARCHITECTURE MODULE EXPLORER */}
      {activeTab === 'architecture' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Module List (Left) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Browse Core Subsystems
            </h3>
            <div className="space-y-2">
              {openSourceModules.map((mod) => (
                <div
                  key={mod.id}
                  onClick={() => setSelectedModule(mod)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedModule.id === mod.id
                      ? 'bg-slate-900 border-blue-500/60 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 font-bold">
                      {mod.language}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {mod.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mt-2">{mod.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{mod.description}</p>
                  <div className="mt-2 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                    <span>{mod.file}</span>
                    <span>{mod.lines} lines</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Viewer (Right) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white text-sm">{selectedModule.file}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                    {selectedModule.lines} lines
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{selectedModule.description}</p>
              </div>

              <button
                onClick={() => handleCopySnippet(selectedModule.codeSnippet)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              >
                {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="relative">
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                {selectedModule.codeSnippet}
              </pre>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Production Tested • Zero Proprietary Locks</span>
              </div>
              <span className="font-mono text-slate-500">License: Apache-2.0 / MIT</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE GIT COMMITS STREAM */}
      {activeTab === 'commits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <GitCommitIcon className="w-5 h-5 text-blue-400" />
                <span>Live Repository Commits</span>
              </h2>
              <p className="text-xs text-slate-400">
                Verified cryptographically signed commits pushed to the main branch by maintainers and open source researchers.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
              Branch: <strong className="text-white">main</strong>
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl divide-y divide-slate-800">
            {gitCommits.map((cmt) => (
              <div key={cmt.hash} className="p-4 hover:bg-slate-850/50 transition-colors flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <img
                    src={cmt.avatar}
                    alt={cmt.author}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-800 mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">{cmt.message}</span>
                      {cmt.verified && (
                        <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          VERIFIED GPG
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span>{cmt.author}</span>
                      <span>•</span>
                      <span>{cmt.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <code className="text-xs text-blue-400 font-mono bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                    {cmt.shortHash}
                  </code>
                  <div className="text-[11px] font-mono mt-1 text-slate-500">
                    <span className="text-emerald-400">+{cmt.additions}</span> / <span className="text-rose-400">-{cmt.deletions}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CONTRIBUTING GUIDELINES & STUDENT BOUNTIES */}
      {activeTab === 'contributing' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>How to Contribute to Babal Market</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Whether you are a high schooler writing your first React component, a university student learning cryptographic smart contracts, or a seasoned engineer, you are welcome here!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h4 className="font-bold text-white text-xs">Fork & Clone</h4>
                <p className="text-xs text-slate-400">
                  Fork the repository to your own GitHub account and clone locally with <code className="text-blue-300">git clone</code>.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h4 className="font-bold text-white text-xs">Build & Test</h4>
                <p className="text-xs text-slate-400">
                  Run <code className="text-indigo-300">npm install</code> followed by <code className="text-indigo-300">npm run dev</code>. Ensure all lint rules and unit tests pass.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h4 className="font-bold text-white text-xs">Submit PR & Claim Bounty</h4>
                <p className="text-xs text-slate-400">
                  Open a Pull Request describing your enhancement. Merged community PRs are rewarded with $50 to $500 community grants!
                </p>
              </div>
            </div>

            {/* Student Open Source Micro-Grants */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-rose-500/15 border border-amber-500/30 space-y-2">
              <h4 className="font-bold text-amber-300 text-xs flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>Student Open Source Contributor Micro-Grants</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you a student in Nepal or anywhere worldwide? If you submit a documentation improvement, translation, or bug fix, our foundation awards an instant $50 - $250 stipend into your Babal Pay balance or educational fund to support your studies!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: OPEN SOURCE LICENSES */}
      {activeTab === 'license' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span>The MIT License (MIT)</span>
              </h2>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                OSI Approved
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Copyright (c) 2026 Bharat Raj Timilsaina & Babal Market Contributors.
            </p>

            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
{`Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
