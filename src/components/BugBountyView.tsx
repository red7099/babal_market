import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Award,
  Terminal,
  FileCode,
  DollarSign,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Send,
  ExternalLink,
  ChevronRight,
  Search,
  Code,
  Globe,
  Users,
  Copy,
  Check,
  Key,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VulnerabilitySeverity, VulnerabilityType } from '../types';
import { PythonSecurityScanner } from './PythonSecurityScanner';

export const BugBountyView: React.FC = () => {
  const {
    bountyReports,
    submitBountyReport,
    securityResearchers,
    securitySettings,
    user,
  } = useApp();

  // Active view tab
  const [bountyTab, setBountyTab] = useState<'program' | 'submit' | 'hall-of-fame' | 'disclosures' | 'python-scanner'>('program');

  // Submission Form State
  const [reportTitle, setReportTitle] = useState('');
  const [targetAsset, setTargetAsset] = useState('Escrow Smart Contract Engine (/api/escrow/release)');
  const [vulnType, setVulnType] = useState<VulnerabilityType>('EscrowDrain');
  const [severity, setSeverity] = useState<VulnerabilitySeverity>('high');
  const [researcherName, setResearcherName] = useState(user.name);
  const [researcherHandle, setResearcherHandle] = useState(user.creatorHandle || '@bharat_sec');
  const [researcherEmail, setResearcherEmail] = useState(user.email);
  const [researcherWallet, setResearcherWallet] = useState('0x71C8294B... (USDC) / Babal Pay');
  const [impactSummary, setImpactSummary] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [proofOfConcept, setProofOfConcept] = useState('');
  const [pgpEncrypted, setPgpEncrypted] = useState(true);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [submittedReportId, setSubmittedReportId] = useState('');

  // Security.txt modal
  const [showSecurityTxt, setShowSecurityTxt] = useState(false);
  const [copiedSecurityTxt, setCopiedSecurityTxt] = useState(false);

  // Search in disclosures
  const [disclosureFilter, setDisclosureFilter] = useState('all');

  const targetAssetOptions = [
    'Escrow Smart Contract Engine (/api/escrow/release)',
    'Admin Security Gate & 2FA Token Validation (/api/admin/auth)',
    'Vendor Multi-Tenant Inventory API (/api/inventory/batch)',
    'Real-Time Telematics & GPS WebSocket Hub (/api/telematics)',
    'Gemini AI Assistant Context Proxy (/api/chat)',
    'Payment Gateway Webhook Verification (Stripe / USDC / Babal Pay)',
    'Creator Video & Blog Content Renderer (DOM Sanitize)',
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim() || !stepsToReproduce.trim() || !impactSummary.trim()) {
      alert('Please provide a complete title, impact description, and reproduction steps.');
      return;
    }

    const rewardMap: Record<VulnerabilitySeverity, number> = {
      critical: 5000,
      high: 2000,
      medium: 750,
      low: 250,
    };

    const newRep = submitBountyReport({
      title: reportTitle,
      targetAsset,
      vulnerabilityType: vulnType,
      severity,
      rewardOffered: rewardMap[severity],
      researcherName,
      researcherHandle,
      researcherEmail,
      researcherWallet,
      impactSummary,
      stepsToReproduce,
      proofOfConcept: proofOfConcept || '// Proof of concept payload verified by researcher',
      pgpEncrypted,
    });

    setSubmittedReportId(newRep.id);
    setIsSubmittedSuccess(true);
    // Reset inputs
    setReportTitle('');
    setImpactSummary('');
    setStepsToReproduce('');
    setProofOfConcept('');
  };

  const securityTxtContent = `Contact: mailto:security@babalmarket.org
Expires: 2027-12-31T23:59:59.000Z
Acknowledgments: https://babalmarket.org/bounty#hall-of-fame
Preferred-Languages: en, ne
Canonical: https://babalmarket.org/.well-known/security.txt
Policy: https://babalmarket.org/bounty#safe-harbor
Hiring: https://babalmarket.org/careers#security-engineer
Encryption: https://babalmarket.org/pgp-key.asc`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/30 p-8 sm:p-10 shadow-2xl overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold tracking-wider uppercase">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Babal Security Defense Matrix • Bug Bounty 2.0</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight">
              Babal Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400">Bug Bounty Program</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Help us safeguard global buyers, merchant funds, and smart contracts. We invite security researchers, ethical white-hat hackers, and student scholars to identify vulnerabilities with guaranteed safe harbor and rewards up to <strong>$5,000 per critical report</strong>.
            </p>

            <div className="flex items-center gap-4 pt-2 text-xs text-slate-400 flex-wrap">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>$25,000 Escrow Bounty Pool</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 text-amber-400 font-mono">
                <Lock className="w-4 h-4" />
                <span>RFC 9116 Compliant</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 text-blue-400 font-mono">
                <Award className="w-4 h-4" />
                <span>Instant USDC or Babal Pay Payout</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shrink-0 w-full lg:w-80 space-y-3 shadow-xl backdrop-blur-md">
            <div className="text-xs text-slate-400 flex items-center justify-between font-mono">
              <span>DEFENSE SENTINEL</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <div className="text-lg font-black text-rose-400 font-mono">$5,000</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Max Critical Bounty</div>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <div className="text-lg font-black text-emerald-400 font-mono">24h</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Average Triage SLA</div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => setBountyTab('submit')}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Terminal className="w-4 h-4" />
                <span>Submit Vulnerability Report</span>
              </button>

              <button
                onClick={() => setShowSecurityTxt(true)}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white font-semibold text-xs border border-slate-800 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FileCode className="w-3.5 h-3.5 text-amber-400" />
                <span>View RFC 9116 security.txt</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-800 pb-2">
        <button
          onClick={() => setBountyTab('program')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            bountyTab === 'program'
              ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Reward Tiers & Scope</span>
        </button>

        <button
          onClick={() => setBountyTab('submit')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            bountyTab === 'submit'
              ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Report a Bug</span>
        </button>

        <button
          onClick={() => setBountyTab('hall-of-fame')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            bountyTab === 'hall-of-fame'
              ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Hall of Fame ({securityResearchers.length})</span>
        </button>

        <button
          onClick={() => setBountyTab('disclosures')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            bountyTab === 'disclosures'
              ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Resolved Disclosures ({bountyReports.length})</span>
        </button>

        <button
          onClick={() => setBountyTab('python-scanner')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            bountyTab === 'python-scanner'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-emerald-400 hover:text-white hover:bg-slate-900 border border-emerald-500/30'
          }`}
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>🐍 Python Security Engine (100% Score)</span>
        </button>
      </div>

      {/* TAB 1: PROGRAM SCOPE & REWARDS MATRIX */}
      {bountyTab === 'program' && (
        <div className="space-y-8">
          {/* Rewards Matrix Grid */}
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Vulnerability Reward Matrix</h2>
            <p className="text-xs text-slate-400 mb-4">
              Payouts are disbursed upon verification within 48 hours via USDC, Bank Transfer, or Babal Pay balance with 0 fees.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Critical */}
              <div className="bg-slate-900/90 border-2 border-rose-500/40 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-mono font-bold text-xs">
                    CRITICAL
                  </span>
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <div className="text-3xl font-black text-white font-mono">$3,000 – $5,000</div>
                  <p className="text-xs text-slate-400 mt-1">Remote Code Execution & Direct Escrow Thefts</p>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                  <li>• Smart contract balance drain or double spend</li>
                  <li>• Remote Code Execution (RCE) on backend</li>
                  <li>• Complete authentication bypass on Admin Gate</li>
                  <li>• Database destruction or private key leak</li>
                </ul>
              </div>

              {/* High */}
              <div className="bg-slate-900/90 border border-orange-500/40 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-mono font-bold text-xs">
                    HIGH
                  </span>
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-3xl font-black text-white font-mono">$1,500 – $2,500</div>
                  <p className="text-xs text-slate-400 mt-1">IDOR, Tenant Compromise & Price Manipulations</p>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                  <li>• Multi-tenant inventory price or stock override</li>
                  <li>• User account takeover without user action</li>
                  <li>• Gateway signature forging (Stripe / USDC)</li>
                  <li>• Unauthorized access to customer delivery OTPs</li>
                </ul>
              </div>

              {/* Medium */}
              <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold text-xs">
                    MEDIUM
                  </span>
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-3xl font-black text-white font-mono">$500 – $1,000</div>
                  <p className="text-xs text-slate-400 mt-1">CSRF, Stored XSS & Business Logic Leaks</p>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                  <li>• Stored XSS in creator video reels or blogs</li>
                  <li>• Cross-Site Request Forgery (CSRF) on state change</li>
                  <li>• Subdomain takeover on Babal assets</li>
                  <li>• Referral or coupon code exhaustion logic</li>
                </ul>
              </div>

              {/* Low */}
              <div className="bg-slate-900/90 border border-blue-500/40 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono font-bold text-xs">
                    LOW
                  </span>
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-3xl font-black text-white font-mono">$150 – $350</div>
                  <p className="text-xs text-slate-400 mt-1">Information Disclosure & Rate Limit Bypasses</p>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
                  <li>• Sensitive internal stack trace exposure</li>
                  <li>• AI Assistant rate limiter rotation bypass</li>
                  <li>• Missing CORS origin headers with leak</li>
                  <li>• Weak cipher suites or legacy TLS flags</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Scope Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <h3>In-Scope Assets & Endpoints</h3>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { target: 'https://babalmarket.org/api/escrow/*', desc: 'Escrow settlement, locking, and milestone release router' },
                  { target: 'https://babalmarket.org/api/admin/*', desc: 'Security console, 2FA biometric gate, audit ledger' },
                  { target: 'https://babalmarket.org/api/inventory/*', desc: 'Multi-vendor catalog mutation, batch sync' },
                  { target: 'https://babalmarket.org/api/telematics/*', desc: 'Live GPS route coordinates, cargo flights' },
                  { target: 'https://babalmarket.org/api/creator/*', desc: 'Student reward claims, 30s video scripts, blog engine' },
                  { target: 'https://babalmarket.org/api/chat', desc: 'Gemini AI assistant prompt orchestration engine' },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3">
                    <code className="text-emerald-400 font-mono font-bold">{item.target}</code>
                    <span className="text-slate-400 text-right">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <h3>Out-of-Scope (Prohibited)</h3>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { target: 'Denial of Service (DoS/DDoS)', desc: 'Volumetric network flood testing is strictly forbidden.' },
                  { target: 'Social Engineering & Phishing', desc: 'Attacking employees, merchant creators, or users via email.' },
                  { target: 'Physical Security & Warehouses', desc: 'Attempts against physical fulfillment cargo depots.' },
                  { target: 'Third-Party Upstreams (Vite, Cloud Run)', desc: 'Report cloud platform infrastructure to Google Cloud VRP directly.' },
                  { target: 'Self-XSS without Impact', desc: 'XSS where the user must paste malicious code into own console.' },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3">
                    <span className="text-rose-400 font-bold">{item.target}</span>
                    <span className="text-slate-400 text-right">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Safe Harbor Legal Commitment */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-3 text-xs text-slate-300">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Babal Market Safe Harbor & Researcher Protection Policy</span>
            </h3>
            <p className="leading-relaxed">
              We consider security research conducted under this policy to be authorized, beneficial, and protected. We will <strong>not</strong> initiate legal action or contact law enforcement against researchers who make a good-faith effort to avoid privacy violations, data destruction, and service disruption. We commit to acknowledging your contributions on our official Hall of Fame and disbursing bounties in full.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: SUBMIT VULNERABILITY REPORT */}
      {bountyTab === 'submit' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Submit a Vulnerability Report</h2>
            <p className="text-xs text-slate-400">
              All submissions are cryptographically logged, prioritized by our security engineer on-call, and awarded within 48 hours.
            </p>
          </div>

          {isSubmittedSuccess && (
            <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <span>Report Successfully Filed ({submittedReportId})!</span>
              </div>
              <p>
                Our security response team has received your encrypted advisory. A notification has been placed in the Admin Security Ledger. You will receive payout confirmation directly at your wallet once verified.
              </p>
              <button
                onClick={() => setIsSubmittedSuccess(false)}
                className="mt-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs"
              >
                Submit Another Advisory
              </button>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Vulnerability Title
              </label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="e.g. Broken Object Level Authorization (BOLA) in Order Tracking Endpoint"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            {/* Target Asset & Vuln Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Asset / Endpoint
                </label>
                <select
                  value={targetAsset}
                  onChange={(e) => setTargetAsset(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  {targetAssetOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Vulnerability Class
                </label>
                <select
                  value={vulnType}
                  onChange={(e) => setVulnType(e.target.value as VulnerabilityType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                >
                  <option value="EscrowDrain">Escrow Drain / Smart Contract Flaw</option>
                  <option value="RCE">Remote Code Execution (RCE)</option>
                  <option value="IDOR">IDOR / BOLA Authorization Bypass</option>
                  <option value="SQLi_XSS">Cross-Site Scripting (XSS) / Injection</option>
                  <option value="CSRF">Cross-Site Request Forgery (CSRF)</option>
                  <option value="AuthBypass">Authentication / 2FA Gate Bypass</option>
                  <option value="BusinessLogic">Business Logic / Cart Exploitation</option>
                  <option value="InfoDisclosure">Information Leakage / Sensitive Keys</option>
                </select>
              </div>
            </div>

            {/* Severity Radio Buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Estimated Severity & Bounty Estimate
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'critical', label: 'Critical', reward: '$5,000', color: 'border-rose-500 text-rose-400 bg-rose-500/10' },
                  { id: 'high', label: 'High', reward: '$2,000', color: 'border-orange-500 text-orange-400 bg-orange-500/10' },
                  { id: 'medium', label: 'Medium', reward: '$750', color: 'border-amber-500 text-amber-400 bg-amber-500/10' },
                  { id: 'low', label: 'Low', reward: '$250', color: 'border-blue-500 text-blue-400 bg-blue-500/10' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSeverity(s.id as VulnerabilitySeverity)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      severity === s.id ? s.color + ' ring-2 ring-white/20' : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs uppercase">{s.label}</div>
                    <div className="text-[11px] font-mono mt-0.5">{s.reward}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Impact Summary */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Impact Summary
              </label>
              <textarea
                value={impactSummary}
                onChange={(e) => setImpactSummary(e.target.value)}
                placeholder="Explain the security consequences: what can an attacker achieve if this flaw is exploited?"
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            {/* Steps to Reproduce */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Steps to Reproduce
              </label>
              <textarea
                value={stepsToReproduce}
                onChange={(e) => setStepsToReproduce(e.target.value)}
                placeholder="1. Send GET request to /api/...&#10;2. Observe parameter omission...&#10;3. State switches without authorization token..."
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            {/* Proof of Concept Payload */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Proof of Concept (PoC) Script / HTTP Request</span>
                <span className="text-[10px] text-slate-500 font-mono">Optional but expedites payout</span>
              </label>
              <textarea
                value={proofOfConcept}
                onChange={(e) => setProofOfConcept(e.target.value)}
                placeholder="curl -X POST https://babalmarket.org/api/... -H 'Authorization: Bearer ...'"
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-emerald-400 font-mono focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Researcher Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Researcher Name & Handle
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={researcherName}
                    onChange={(e) => setResearcherName(e.target.value)}
                    placeholder="Full Name"
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                    required
                  />
                  <input
                    type="text"
                    value={researcherHandle}
                    onChange={(e) => setResearcherHandle(e.target.value)}
                    placeholder="@handle"
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Bounty Payout Wallet (USDC / Babal Pay)
                </label>
                <input
                  type="text"
                  value={researcherWallet}
                  onChange={(e) => setResearcherWallet(e.target.value)}
                  placeholder="0x... or Babal Pay ID"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                  required
                />
              </div>
            </div>

            {/* PGP Encryption Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Encrypt advisory payload with Babal Security GPG Key (0x981A7F2D)</span>
              </div>
              <input
                type="checkbox"
                checked={pgpEncrypted}
                onChange={(e) => setPgpEncrypted(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 bg-slate-900 border-slate-700"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Advisory to Security Sentinel</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: HALL OF FAME / TOP ETHICAL HACKERS */}
      {bountyTab === 'hall-of-fame' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>Security Researcher Hall of Fame</span>
              </h2>
              <p className="text-xs text-slate-400">
                Recognizing independent security analysts, white-hat bounty hunters, and student computer scientists protecting Babal Market.
              </p>
            </div>
            <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              Total Bounties Disbursed: <strong className="text-emerald-400">$24,250</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {securityResearchers.map((res) => (
              <div
                key={res.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl hover:border-amber-500/40 transition-all relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={res.avatar}
                      alt={res.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                      #{res.rank}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm flex items-center gap-1.5">
                      <span>{res.name}</span>
                      {res.verifiedResearcher && (
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {res.handle} • {res.country}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] space-y-1">
                  <div className="text-slate-400">Specialization:</div>
                  <div className="text-slate-200 font-semibold">{res.specialization}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <div className="font-mono font-bold text-amber-400">{res.points}</div>
                    <div className="text-[9px] text-slate-500 uppercase">Points</div>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <div className="font-mono font-bold text-emerald-400">${res.bountiesEarned.toLocaleString()}</div>
                    <div className="text-[9px] text-slate-500 uppercase">Earned</div>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <div className="font-mono font-bold text-rose-400">{res.criticalBugsReported}</div>
                    <div className="text-[9px] text-slate-500 uppercase">Criticals</div>
                  </div>
                </div>

                <div className="pt-1">
                  <span className="w-full text-center block text-[10px] font-mono font-bold uppercase tracking-wider py-1 px-2 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {res.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RESOLVED DISCLOSURES & CVE FEED */}
      {bountyTab === 'disclosures' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-blue-400" />
                <span>Coordinated Vulnerability Disclosures</span>
              </h2>
              <p className="text-xs text-slate-400">
                Transparent public CVE disclosures released after security patches have been deployed and verified.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Filter:</span>
              <select
                value={disclosureFilter}
                onChange={(e) => setDisclosureFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-rose-500 font-mono"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {bountyReports
              .filter((r) => disclosureFilter === 'all' || r.severity === disclosureFilter)
              .map((rep) => (
                <div
                  key={rep.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-extrabold text-white text-base">
                          {rep.cveId || rep.id}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            rep.severity === 'critical'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              : rep.severity === 'high'
                              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                              : rep.severity === 'medium'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          }`}
                        >
                          {rep.severity}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">
                          {rep.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-sm mt-1">{rep.title}</h3>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block font-mono">Bounty Awarded</span>
                      <span className="font-mono font-black text-emerald-400 text-sm">
                        ${(rep.rewardPaid || rep.rewardOffered).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Target Asset</span>
                      <code className="text-slate-200 font-mono text-[11px]">{rep.targetAsset}</code>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Credited Researcher</span>
                      <span className="text-amber-400 font-semibold">{rep.researcherName} ({rep.researcherHandle})</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {rep.impactSummary}
                  </p>

                  {rep.patchNotes && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs">
                      <span className="text-emerald-400 font-bold block mb-1">🛡️ Engineering Mitigation:</span>
                      <p className="text-slate-300 font-mono text-[11px]">{rep.patchNotes}</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 5: PYTHON AUTOMATED SECURITY ENGINE & SCANNER */}
      {bountyTab === 'python-scanner' && <PythonSecurityScanner />}

      {/* RFC 9116 security.txt MODAL */}
      {showSecurityTxt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <FileCode className="w-5 h-5 text-amber-400" />
                <span>RFC 9116 security.txt Protocol</span>
              </div>
              <button
                onClick={() => setShowSecurityTxt(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Machine-readable security vulnerability disclosure instructions served at <code className="text-amber-400">/.well-known/security.txt</code> according to IETF RFC 9116 standards.
            </p>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre">
              {securityTxtContent}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500 font-mono">GPG Fingerprint: 981A 7F2D 4C01 88E2</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(securityTxtContent);
                  setCopiedSecurityTxt(true);
                  setTimeout(() => setCopiedSecurityTxt(false), 2000);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSecurityTxt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSecurityTxt ? 'Copied' : 'Copy security.txt'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
