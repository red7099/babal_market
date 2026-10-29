import React, { useState } from 'react';
import {
  Sparkles,
  Video,
  FileText,
  GraduationCap,
  DollarSign,
  TrendingUp,
  Award,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  Eye,
  ShoppingBag,
  ExternalLink,
  Plus,
  CheckCircle2,
  BookOpen,
  Send,
  Loader2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  ChevronRight,
  Lightbulb,
  X,
  AlertCircle,
  Building,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BlogPost, PromoVideo, BrandBounty, StudentCourse } from '../types';

export const CreatorHubView: React.FC = () => {
  const {
    blogs,
    videos,
    bounties,
    courses,
    products,
    user,
    addToCart,
    setSelectedProductId,
    publishBlog,
    publishVideo,
    likeBlog,
    likeVideo,
    shareVideo,
    claimBounty,
    completeCourse,
    withdrawEarnings,
    setActiveTab,
  } = useApp();

  // Active sub-tab in Creator Hub
  const [activeHubTab, setActiveHubTab] = useState<'videos' | 'blogs' | 'learn' | 'bounties' | 'studio'>('videos');

  // Video Player state
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoTimer, setVideoTimer] = useState(14); // seconds counter

  // Selected blog for reading
  const [readingBlog, setReadingBlog] = useState<BlogPost | null>(null);

  // Active course learning modal
  const [activeCourse, setActiveCourse] = useState<StudentCourse | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  // Studio form states
  const [studioType, setStudioType] = useState<'video' | 'blog'>('video');
  const [selectedProductForContent, setSelectedProductForContent] = useState<string>(products[0]?.id || '');
  const [contentTitle, setContentTitle] = useState('');
  const [contentBodyOrScript, setContentBodyOrScript] = useState('');
  const [contentTagline, setContentTagline] = useState('');
  const [creatorStyle, setCreatorStyle] = useState('High-Energy Student Reviewer');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiGeneratedScript, setAiGeneratedScript] = useState<any | null>(null);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('50');

  const currentVideo = videos[activeVideoIndex] || videos[0];
  const videoProduct = products.find((p) => p.id === currentVideo?.attachedProductId);

  // AI Script Generator for 30s Video
  const handleGenerateScriptWithAI = async () => {
    const prod = products.find((p) => p.id === selectedProductForContent);
    if (!prod) return;

    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/creator/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: prod.name,
          productTagline: prod.tagline,
          category: prod.category,
          creatorStyle,
          discountCode: 'BABALVIP',
        }),
      });

      if (!res.ok) throw new Error('Script generation failed');
      const data = await res.json();
      if (data.data) {
        setAiGeneratedScript(data.data);
        setContentTitle(data.data.title || `30s Video Promo: ${prod.name}`);
        const formattedScenes = (data.data.scenes || [])
          .map(
            (s: any) =>
              `[${s.time}] Visual: ${s.visual}\nSpoken: "${s.spokenAudio}"\nOn Screen: ${s.onScreenText}`
          )
          .join('\n\n');
        setContentBodyOrScript(formattedScenes);
      }
    } catch (err) {
      console.error(err);
      setContentTitle(`30-Second Honest Test: ${prod.name}`);
      setContentBodyOrScript(
        `[0:00 - 0:05] Hook: "Stop scrolling if you need better study focus!"\n[0:05 - 0:15] Showcase: Testing the ${prod.name} from Babal Market.\n[0:15 - 0:25] Demo: Built by verified shops with free express air shipping.\n[0:25 - 0:30] CTA: Tap the product link below and use code BABALVIP for 15% off!`
      );
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // AI Blog Generator
  const handleGenerateBlogWithAI = async () => {
    const prod = products.find((p) => p.id === selectedProductForContent);
    if (!prod) return;

    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/creator/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: prod.name,
          productTagline: prod.tagline,
          category: prod.category,
          angle: 'Student Guide & Hands-on Review',
          studentAuthor: user.name,
        }),
      });

      if (!res.ok) throw new Error('Blog generation failed');
      const data = await res.json();
      if (data.data) {
        setContentTitle(data.data.title || `Review: ${prod.name}`);
        setContentTagline(data.data.excerpt || prod.tagline);
        setContentBodyOrScript(data.data.content || '');
      }
    } catch (err) {
      console.error(err);
      setContentTitle(`The Ultimate Student Guide to ${prod.name}`);
      setContentTagline(`Why this verified Babal Market product is worth every penny.`);
      setContentBodyOrScript(
        `## My Experience as a Student Creator\n\nFinding gear that lasts without draining your tuition budget is difficult. The **${prod.name}** completely changed my workflow.\n\n### Why it stands out:\n- Handcrafted quality\n- Babal Escrow protection\n- 15% off with code \`BABALVIP\`\n\n*Check the product card below to buy directly and support independent creators!*`
      );
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Publish from Studio
  const handlePublishFromStudio = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedProductForContent);
    if (!prod || !contentTitle.trim()) return;

    if (studioType === 'video') {
      publishVideo({
        title: contentTitle.trim(),
        description: contentBodyOrScript.slice(0, 160) || `30s brand promotion for ${prod.name}. Use code BABALVIP!`,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-white-keyboard-41395-large.mp4',
        thumbnailUrl: prod.images[0],
        durationSec: 30,
        creatorName: user.name,
        creatorAvatar: user.avatar,
        creatorHandle: user.creatorHandle || `@${user.name.toLowerCase().replace(/\s+/g, '')}`,
        isStudent: !!user.isStudent,
        schoolOrCollege: user.schoolOrCollege,
        attachedProductId: prod.id,
        brandName: prod.shopName,
        commissionRate: 10,
        tags: ['NewPromo', 'BabalShorts', 'StudentCreator'],
      });
      alert('🎉 30-Second Video Promo published! A $10 Creator Starter Bonus has been credited to your wallet.');
      setActiveHubTab('videos');
    } else {
      publishBlog({
        title: contentTitle.trim(),
        slug: contentTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        excerpt: contentTagline.trim() || `In-depth review of ${prod.name} by student creator ${user.name}.`,
        content: contentBodyOrScript,
        coverImage: prod.images[0],
        authorName: user.name,
        authorAvatar: user.avatar,
        authorRole: user.isStudent ? 'Student Creator • Babal Academy' : 'Creator Ambassador',
        isStudent: !!user.isStudent,
        schoolOrCollege: user.schoolOrCollege,
        attachedProductId: prod.id,
        readTime: '3 min read',
        tags: ['ProductReview', 'BabalCreator', 'StudentLife'],
      });
      alert('🎉 Product Review Blog published! A $5 Creator Publishing Bonus has been credited to your wallet.');
      setActiveHubTab('blogs');
    }

    // Reset studio
    setContentTitle('');
    setContentBodyOrScript('');
    setContentTagline('');
    setAiGeneratedScript(null);
  };

  // Submit course quiz
  const handleQuizSubmit = () => {
    if (!activeCourse) return;
    let correctCount = 0;
    activeCourse.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    setQuizSubmitted(true);
    if (correctCount === activeCourse.quiz.length) {
      setQuizPassed(true);
      completeCourse(activeCourse.id);
    } else {
      setQuizPassed(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      {/* Creator Hub Hero Banner */}
      <section className="relative overflow-hidden pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(168,85,247,0.18),rgba(245,158,11,0.08),rgba(255,255,255,0))] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-violet-500/20 to-amber-500/20 border border-violet-500/40 text-violet-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Babal Creator & School Student Learn-and-Earn Hub</span>
              </div>

              <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                Create. Promote Brands. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-violet-400">
                  Learn & Earn Money from Babal Market.
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                School and college students can create <strong>30-second brand promo video shorts</strong> and <strong>authentic product blogs</strong>. Earn 10%–15% sales commissions, win brand bounties, and get certified with free masterclasses!
              </p>

              {/* Creator Badges Pill */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" /> 10%–15% Instant Commission
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-semibold text-amber-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" /> $10 Student Bonus Per Quiz
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-semibold text-violet-300 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5" /> 30-Sec Brand Promotion Format
                </span>
              </div>
            </div>

            {/* Creator Earnings Quick Card */}
            <div className="bg-slate-900/90 border-2 border-violet-500/40 rounded-3xl p-6 shadow-2xl backdrop-blur-xl lg:min-w-[340px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    My Creator Wallet
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  Active Creator
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Total Earned:</span>
                  <span className="font-heading font-black text-2xl text-emerald-400 font-mono">
                    ${(user.creatorEarnings?.totalEarned || 345.5).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-400">Available to Withdraw:</span>
                  <span className="font-mono font-bold text-amber-400">
                    ${(user.creatorEarnings?.pendingPayout || 95.0).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-baseline text-xs text-slate-400">
                  <span>Student Certifications:</span>
                  <span className="text-white font-bold">
                    {user.completedCourseIds?.length || 1} Badges Earned 🎓
                  </span>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setWithdrawModalOpen(true)}
                    className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    <DollarSign className="w-3.5 h-3.5" /> Cash Out Earnings
                  </button>
                  <button
                    onClick={() => {
                      setStudioType('video');
                      setActiveHubTab('studio');
                    }}
                    className="px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Post
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sub Navigation Bar */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-slate-800/80 pt-4">
            <button
              onClick={() => setActiveHubTab('videos')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeHubTab === 'videos'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-white border border-slate-800'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>30s Brand Videos ({videos.length})</span>
            </button>

            <button
              onClick={() => setActiveHubTab('blogs')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeHubTab === 'blogs'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-white border border-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Creator Blogs & Guides ({blogs.length})</span>
            </button>

            <button
              onClick={() => setActiveHubTab('learn')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeHubTab === 'learn'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/30'
                  : 'bg-violet-950/40 text-violet-300 hover:bg-violet-900/40 border border-violet-800/40'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Student Learn & Earn Academy ({courses.length})</span>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                +$10 BONUS
              </span>
            </button>

            <button
              onClick={() => setActiveHubTab('bounties')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeHubTab === 'bounties'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-white border border-slate-800'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Brand Bounties ({bounties.length})</span>
            </button>

            <button
              onClick={() => setActiveHubTab('studio')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ml-auto ${
                activeHubTab === 'studio'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/30'
                  : 'bg-slate-900 text-amber-400 hover:bg-slate-850 border border-amber-500/30'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Creator Studio</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* SUB-TAB 1: 30-Second Promotional Video Feed */}
        {activeHubTab === 'videos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: 30s Interactive Video Player Stage (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></div>
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    30-Second Brand Reel
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                    {currentVideo.durationSec}s Promo
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-amber-400" />}
                  </button>
                </div>
              </div>

              {/* Video Canvas Container (9:16 vertical ratio) */}
              <div className="relative aspect-[9/14] sm:aspect-[9/12] max-h-[580px] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 mx-auto group">
                <img
                  src={currentVideo.thumbnailUrl}
                  alt={currentVideo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-black/40"></div>

                {/* Top 30-Second Countdown Meter */}
                <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                    <span className="font-mono font-bold text-xs text-white">00:{videoTimer < 10 ? `0${videoTimer}` : videoTimer} / 00:30</span>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-lg">
                    {currentVideo.commissionRate}% Commission Active
                  </span>
                </div>

                {/* Simulated High-Energy Video Overlay Text */}
                <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none p-6 text-center">
                  <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-400/50 transform -rotate-1 shadow-2xl">
                    <span className="text-xs font-mono font-black text-amber-400 tracking-widest block uppercase">
                      ⚡ VERIFIED 30S BRAND REEL ⚡
                    </span>
                    <span className="font-heading font-black text-lg sm:text-xl text-white block mt-0.5">
                      {currentVideo.title}
                    </span>
                  </div>
                </div>

                {/* Right Floating Actions (Like, Share, Tip) */}
                <div className="absolute right-4 bottom-28 z-20 flex flex-col items-center gap-4">
                  <button
                    onClick={() => likeVideo(currentVideo.id)}
                    className="p-3 rounded-full bg-slate-900/80 hover:bg-rose-500 hover:text-white text-slate-200 backdrop-blur-md border border-white/15 transition-all shadow-xl group/btn"
                    title="Like video"
                  >
                    <Heart className="w-5 h-5 group-hover/btn:scale-125 transition-transform" />
                    <span className="text-[10px] font-bold block text-center mt-1">
                      {currentVideo.likes}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      shareVideo(currentVideo.id);
                      navigator.clipboard?.writeText(window.location.href);
                      alert('🔗 Creator link copied! Share to earn 10% commission on all sales.');
                    }}
                    className="p-3 rounded-full bg-slate-900/80 hover:bg-blue-500 hover:text-white text-slate-200 backdrop-blur-md border border-white/15 transition-all shadow-xl group/btn"
                    title="Share affiliate video link"
                  >
                    <Share2 className="w-5 h-5 group-hover/btn:scale-125 transition-transform" />
                    <span className="text-[10px] font-bold block text-center mt-1">
                      {currentVideo.shares}
                    </span>
                  </button>
                </div>

                {/* Bottom Overlay: Creator Info & Live Product Card */}
                <div className="absolute bottom-4 left-4 right-4 z-20 space-y-3">
                  {/* Creator Info */}
                  <div className="flex items-center gap-2.5">
                    <img
                      src={currentVideo.creatorAvatar}
                      alt={currentVideo.creatorName}
                      className="w-10 h-10 rounded-full border-2 border-amber-400 object-cover shadow"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-heading font-extrabold text-sm text-white">
                          {currentVideo.creatorName}
                        </span>
                        {currentVideo.isStudent && (
                          <span className="px-1.5 py-0.2 rounded bg-violet-500/80 text-[10px] text-white font-bold">
                            🎓 Student Creator
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-amber-400">
                        {currentVideo.creatorHandle} • {currentVideo.schoolOrCollege || currentVideo.brandName}
                      </span>
                    </div>
                  </div>

                  {/* Attached Product Card (Direct Purchase with 15% discount) */}
                  {videoProduct && (
                    <div className="p-3 rounded-2xl bg-slate-900/95 border border-amber-500/50 backdrop-blur-xl flex items-center justify-between gap-3 shadow-2xl">
                      <img
                        src={videoProduct.images[0]}
                        alt={videoProduct.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-800 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-white block truncate">
                          {videoProduct.name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-heading font-extrabold text-xs text-emerald-400">
                            ${videoProduct.price.toFixed(2)}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                            CODE: BABALVIP (-15%)
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(videoProduct, 1)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 flex-shrink-0"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Buy Now</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Video Playlist Selector */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3 overflow-x-auto no-scrollbar">
                <span className="text-xs font-bold text-slate-400 whitespace-nowrap">More 30s Promos:</span>
                {videos.map((vid, idx) => (
                  <button
                    key={vid.id}
                    onClick={() => {
                      setActiveVideoIndex(idx);
                      setVideoTimer(Math.floor(10 + Math.random() * 15));
                    }}
                    className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl border text-xs whitespace-nowrap transition-all ${
                      activeVideoIndex === idx
                        ? 'bg-amber-500/20 border-amber-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <img src={vid.thumbnailUrl} alt={vid.title} className="w-7 h-7 rounded-lg object-cover" />
                    <span className="font-bold truncate max-w-[120px]">{vid.creatorName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Creator Earnings Breakdown & How to Post (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* How Students Earn Card */}
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap className="w-5 h-5 text-amber-400" />
                  <h3 className="font-heading font-extrabold text-base text-white">
                    How School Students Earn Money
                  </h3>
                </div>

                <div className="space-y-3.5 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0">
                      1
                    </span>
                    <div>
                      <strong className="text-white block">Pick any product from Babal Market</strong>
                      <span className="text-slate-400">Choose tech gear, artisan crafts, or study supplies you love.</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0">
                      2
                    </span>
                    <div>
                      <strong className="text-white block">Record a 30-Second Brand Promo</strong>
                      <span className="text-slate-400">Use our AI script generator or free student masterclass tips.</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center flex-shrink-0">
                      3
                    </span>
                    <div>
                      <strong className="text-white block">Earn 10%–15% on every purchase</strong>
                      <span className="text-slate-400">Plus instant brand bounties ($35-$60) deposited into your wallet.</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setStudioType('video');
                    setActiveHubTab('studio');
                  }}
                  className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create My 30s Brand Video Now
                </button>
              </div>

              {/* Student Star of the Week */}
              <div className="bg-gradient-to-br from-violet-950/40 via-slate-900 to-slate-900 rounded-3xl border border-violet-800/40 p-6 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-violet-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" /> STUDENT CREATOR SPOTLIGHT
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                    +$340 This Month
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80"
                    alt="Student"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400"
                  />
                  <div>
                    <span className="font-bold text-sm text-white block">Rohan Adhikari</span>
                    <span className="text-xs text-slate-400 font-mono">
                      Grade 12 • Pulchowk Campus • 19 Brand Promos
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  &ldquo;I bought my engineering laptop using Babal Market video commissions and brand bounties. Any student with a phone can start!&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: Creator Blogs & Buying Guides */}
        {activeHubTab === 'blogs' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-heading font-black text-2xl text-white">
                  Creator Blogs & Buying Guides
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  In-depth honest reviews, dorm room setups, and artisan stories written by students & creators.
                </p>
              </div>

              <button
                onClick={() => {
                  setStudioType('blog');
                  setActiveHubTab('studio');
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs flex items-center gap-2 self-start sm:self-auto shadow-md"
              >
                <Plus className="w-4 h-4" /> Write a Product Blog
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => {
                const prod = products.find((p) => p.id === blog.attachedProductId);

                return (
                  <div
                    key={blog.id}
                    onClick={() => setReadingBlog(blog)}
                    className="bg-slate-900 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden cursor-pointer shadow-lg hover:shadow-xl group flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[16/9] w-full overflow-hidden bg-slate-950 relative">
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          {blog.isStudent && (
                            <span className="px-2 py-0.5 rounded-lg bg-violet-600/90 text-white font-bold text-[10px] backdrop-blur-md">
                              🎓 Student Review
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-lg bg-slate-950/80 text-slate-300 text-[10px] font-mono">
                            {blog.readTime}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-heading font-extrabold text-base text-white group-hover:text-amber-400 transition-colors line-clamp-2 mb-2">
                          {blog.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-4">{blog.excerpt}</p>

                        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                          <img
                            src={blog.authorAvatar}
                            alt={blog.authorName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {blog.authorName}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[180px]">
                              {blog.schoolOrCollege || blog.authorRole}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Attached Product Strip */}
                    <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs">
                      {prod ? (
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-bold text-white truncate max-w-[140px]">{prod.name}</span>
                          <span className="font-mono text-emerald-400">${prod.price.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500">Babal Choice</span>
                      )}

                      <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                        Read Story →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUB-TAB 3: School Student Learn & Earn Academy */}
        {activeHubTab === 'learn' && (
          <div>
            <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-950/60 via-slate-900 to-indigo-950/60 border border-violet-800/40 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 mb-1">
                    <GraduationCap className="w-4 h-4" /> STUDENT CREATOR SCHOLARSHIP PROGRAM
                  </div>
                  <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
                    Learn E-Commerce Skills & Earn Instant Cash Bonuses
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                    Complete any 10-15 minute interactive masterclass, ace the 3-question quiz, and get certified. Each passed course deposits an immediate <strong>$10.00 cash bonus</strong> directly into your Babal Pay wallet!
                  </p>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-2xl border border-violet-500/30 text-center flex-shrink-0">
                  <span className="text-[11px] text-slate-400 block">Completed Masterclasses</span>
                  <span className="font-heading font-black text-2xl text-amber-400">
                    {user.completedCourseIds?.length || 1} / {courses.length}
                  </span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">
                    ${((user.completedCourseIds?.length || 1) * 10).toFixed(2)} in Bonuses Won
                  </span>
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => {
                const isCompleted = user.completedCourseIds?.includes(course.id);

                return (
                  <div
                    key={course.id}
                    className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-violet-500/50 transition-all flex flex-col justify-between shadow-xl"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-lg bg-violet-500/20 text-violet-300 text-xs font-bold border border-violet-500/30">
                          {course.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-mono">{course.duration}</span>
                          {isCompleted ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Certified
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold">
                              +${course.rewardBonus.toFixed(2)} Cash
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="font-heading font-extrabold text-lg text-white mb-2">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-400 mb-4">{course.description}</p>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1 mb-4">
                        <span className="font-bold text-amber-400 block text-[11px]">
                          🏆 Award on Completion:
                        </span>
                        <span>{course.badge} + $10.00 Babal Pay Deposit</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveCourse(course);
                        setQuizAnswers({});
                        setQuizSubmitted(false);
                        setQuizPassed(false);
                      }}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                        isCompleted
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                          : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/30'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{isCompleted ? 'Review Masterclass & Certificate' : 'Start Lesson & Take Quiz →'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUB-TAB 4: Brand Sponsorship Bounties */}
        {activeHubTab === 'bounties' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-heading font-black text-2xl text-white">
                  Brand Sponsorship Bounty Board
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Verified shops on Babal Market sponsor creators to produce 30s video reviews & buying blogs.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {bounties.map((bounty) => (
                <div
                  key={bounty.id}
                  className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={bounty.shopLogo}
                      alt={bounty.shopName}
                      className="w-14 h-14 rounded-2xl object-cover bg-slate-950 border border-slate-800 flex-shrink-0"
                    />
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-amber-400 font-bold">
                          {bounty.shopName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          {bounty.type.toUpperCase().replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-base text-white">
                        {bounty.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span>Product: <strong className="text-slate-200">{bounty.productName}</strong></span>
                        <span>•</span>
                        <span>Deadline: <strong className="text-rose-400">{bounty.deadline}</strong></span>
                        <span>•</span>
                        <span>Slots: <strong className="text-white">{bounty.slotsFilled}/{bounty.slotsAvailable} Filled</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 flex-shrink-0">
                    <div className="text-right sm:text-left">
                      <span className="text-[11px] text-slate-400 block">Upfront Bounty + Sales Share</span>
                      <div className="font-heading font-black text-2xl text-emerald-400 font-mono">
                        ${bounty.rewardCash.toFixed(2)}{' '}
                        <span className="text-xs text-amber-400 font-sans font-bold">
                          + {bounty.commissionPercent}% Cut
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => claimBounty(bounty.id)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg transition-all"
                    >
                      Claim Bounty Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB 5: AI Creator Studio (Create Video or Blog) */}
        {activeHubTab === 'studio' && (
          <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-slate-950 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading font-black text-xl text-white">
                    Babal AI Creator Studio
                  </h2>
                  <p className="text-xs text-slate-400">
                    Auto-generate viral 30-second scripts and high-converting review blogs with Gemini AI.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Format Toggle */}
            <div className="flex p-1 rounded-2xl bg-slate-950 border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => setStudioType('video')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  studioType === 'video'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-4 h-4" /> 30-Second Brand Promo Video
              </button>
              <button
                type="button"
                onClick={() => setStudioType('blog')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  studioType === 'blog'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" /> Buying Guide / Product Blog
              </button>
            </div>

            <form onSubmit={handlePublishFromStudio} className="space-y-5">
              {/* Product Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  1. Select Product from Babal Market to Promote *
                </label>
                <select
                  value={selectedProductForContent}
                  onChange={(e) => setSelectedProductForContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ${p.price.toFixed(2)} (Shop: {p.shopName})
                    </option>
                  ))}
                </select>
              </div>

              {/* AI Auto-Generate Prompt Box */}
              <div className="p-4 rounded-2xl bg-violet-950/30 border border-violet-800/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    {studioType === 'video' ? 'AI 30-Second Script Writer' : 'AI Blog Writer'}
                  </span>
                  <span className="text-[10px] text-slate-400">Gemini 3.8 Flash</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={creatorStyle}
                    onChange={(e) => setCreatorStyle(e.target.value)}
                    placeholder="Style (e.g. Energetic Student Reviewer, Aesthetic ASMR, Honest Dorm Review)"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                  <button
                    type="button"
                    onClick={studioType === 'video' ? handleGenerateScriptWithAI : handleGenerateBlogWithAI}
                    disabled={isGeneratingAI}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isGeneratingAI ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Generate with AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Content Title / Hook Headline *
                </label>
                <input
                  type="text"
                  required
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  placeholder={studioType === 'video' ? 'Catchy 30s Video Hook Title' : 'Engaging Blog Headline'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Tagline / Excerpt (for blogs) */}
              {studioType === 'blog' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Excerpt Summary
                  </label>
                  <input
                    type="text"
                    value={contentTagline}
                    onChange={(e) => setContentTagline(e.target.value)}
                    placeholder="Brief 2-sentence summary hook"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {/* Script / Body */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {studioType === 'video' ? '30-Second Video Script & Scenes' : 'Blog Article Body'}
                </label>
                <textarea
                  rows={6}
                  value={contentBodyOrScript}
                  onChange={(e) => setContentBodyOrScript(e.target.value)}
                  placeholder={
                    studioType === 'video'
                      ? '[0:00 - 0:05] Hook\n[0:05 - 0:15] Showcase\n[0:15 - 0:25] Demo\n[0:25 - 0:30] Call to action with code BABALVIP'
                      : 'Write your honest review and guide...'
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Publish to Babal Creator Hub & Start Earning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </main>

      {/* MODAL 1: Read Blog Detail Modal */}
      {readingBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setReadingBlog(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/8] w-full rounded-2xl overflow-hidden mb-6 bg-slate-950">
              <img src={readingBlog.coverImage} alt={readingBlog.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-800">
              <img src={readingBlog.authorAvatar} alt={readingBlog.authorName} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <span className="font-bold text-white block text-sm">{readingBlog.authorName}</span>
                <span className="text-xs text-slate-400 font-mono">{readingBlog.schoolOrCollege || readingBlog.authorRole}</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => likeBlog(readingBlog.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>{readingBlog.likes} Likes</span>
                </button>
              </div>
            </div>

            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white mb-3">
              {readingBlog.title}
            </h1>

            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line mb-8">
              {readingBlog.content}
            </div>

            {/* Embedded Product Card inside Blog */}
            {(() => {
              const prod = products.find((p) => p.id === readingBlog.attachedProductId);
              if (!prod) return null;

              return (
                <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <img src={prod.images[0]} alt={prod.name} className="w-14 h-14 rounded-xl object-cover bg-slate-800" />
                    <div>
                      <span className="text-xs font-mono text-amber-400 block font-bold">Featured in this Article:</span>
                      <span className="font-bold text-sm text-white block">{prod.name}</span>
                      <span className="font-mono text-emerald-400 font-bold">${prod.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(prod, 1);
                      setReadingBlog(null);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Buy with 15% VIP Discount</span>
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* MODAL 2: Interactive Course Masterclass & Quiz Modal */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setActiveCourse(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 mb-1">
              <GraduationCap className="w-4 h-4" /> BABAL STUDENT ACADEMY
            </div>
            <h2 className="font-heading font-black text-2xl text-white mb-2">
              {activeCourse.title}
            </h2>
            <p className="text-xs text-slate-400 mb-6">{activeCourse.description}</p>

            {/* Course Lessons */}
            <div className="space-y-4 mb-8">
              {activeCourse.lessons.map((lesson, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-violet-400" />
                    {lesson.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{lesson.content}</p>
                  <div className="pt-2 border-t border-slate-900">
                    <span className="text-[11px] font-bold text-amber-400 block mb-1">Key Takeaways:</span>
                    <ul className="space-y-1 text-slate-400 text-[11px]">
                      {lesson.keyTips.map((tip, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Certification Quiz */}
            <div className="p-5 rounded-2xl bg-violet-950/30 border border-violet-800/40 space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-violet-800/30">
                <span className="font-bold text-xs text-violet-200 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" /> Complete Quiz to Claim $10 Cash Bonus
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-bold">Passing Score: 100%</span>
              </div>

              {activeCourse.quiz.map((q, qIdx) => (
                <div key={qIdx} className="space-y-2">
                  <p className="text-xs font-bold text-white">
                    {qIdx + 1}. {q.question}
                  </p>
                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => (
                      <label
                        key={optIdx}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          quizAnswers[qIdx] === optIdx
                            ? 'bg-violet-600/30 border-violet-400 text-white font-semibold'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${qIdx}`}
                          checked={quizAnswers[qIdx] === optIdx}
                          onChange={() => setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                          className="text-amber-500 focus:ring-0 bg-slate-900"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>

                  {quizSubmitted && (
                    <div
                      className={`p-2.5 rounded-xl text-[11px] font-medium ${
                        quizAnswers[qIdx] === q.correctAnswerIndex
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {quizAnswers[qIdx] === q.correctAnswerIndex ? '✅ Correct! ' : '❌ Incorrect. '}
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}

              {quizPassed ? (
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-2">
                  <Award className="w-10 h-10 text-amber-400 mx-auto" />
                  <h4 className="font-heading font-black text-lg text-white">
                    Certificate Earned: {activeCourse.badge}
                  </h4>
                  <p className="text-xs text-emerald-300 font-semibold">
                    +$10.00 Student Bonus deposited to your Babal Pay wallet balance!
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length < activeCourse.quiz.length}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all disabled:opacity-40"
                >
                  Submit Answers & Claim $10 Bonus
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Cash Out / Withdraw Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setWithdrawModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-black text-xl text-white">
                  Cash Out Creator Earnings
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Pending Balance: ${(user.creatorEarnings?.pendingPayout || 95.0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-4 my-6 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Amount to Withdraw ($)
                </label>
                <input
                  type="number"
                  min="5"
                  max={user.creatorEarnings?.pendingPayout || 95}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Transfer Destination
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 font-bold text-xs text-left"
                  >
                    Babal Pay Wallet
                    <span className="block text-[10px] text-slate-400 font-normal">Instant • 0% Fee</span>
                  </button>
                  <button
                    type="button"
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs text-left"
                  >
                    Local Bank / eSewa
                    <span className="block text-[10px] text-slate-400 font-normal">24h Direct Deposit</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const amt = parseFloat(withdrawAmount) || 0;
                if (withdrawEarnings(amt)) {
                  setWithdrawModalOpen(false);
                }
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg transition-all"
            >
              Confirm Withdrawal of ${withdrawAmount}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
