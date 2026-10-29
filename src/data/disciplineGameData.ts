/**
 * Student Discipline Development & Focus Arena Game Data
 * Focus: Habit formation, impulse control, deep work endurance, character virtues, and $BABAL rewards
 */

export interface DisciplineHabit {
  id: string;
  title: string;
  localTitle?: string;
  category: 'Morning Willpower' | 'Academic Focus' | 'Mind & Body' | 'Digital Self-Control' | 'Character & Integrity';
  description: string;
  points: number;
  iconName: string;
  timeTarget?: string;
}

export interface DisciplineVirtue {
  id: string;
  name: string;
  localName?: string;
  quote: string;
  author: string;
  color: string;
}

export interface DisciplineBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  criteria: string;
}

export const DISCIPLINE_VIRTUES: DisciplineVirtue[] = [
  {
    id: 'virtue-1',
    name: 'Sankalpa (Steadfast Will)',
    localName: 'दृढ संकल्प',
    quote: 'Discipline is choosing between what you want now, and what you want most.',
    author: 'Ancient Vedic Proverb',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'virtue-2',
    name: 'Ekagrata (Single-Pointed Focus)',
    localName: 'एकाग्रता',
    quote: 'The successful warrior is the average student, with laser-like focus.',
    author: 'Bruce Lee',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'virtue-3',
    name: 'Dhairya (Patience & Fortitude)',
    localName: 'धैर्य र सहनशीलता',
    quote: 'Rivers know this: there is no hurry. We shall get there some day.',
    author: 'Himalayan Mountain Wisdom',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'virtue-4',
    name: 'Satya (Integrity & Truthfulness)',
    localName: 'सत्यनिष्ठा',
    quote: 'Integrity is doing the right thing even when no one is watching.',
    author: 'C.S. Lewis',
    color: 'from-purple-500 to-indigo-600',
  },
];

export const CORE_HABITS: DisciplineHabit[] = [
  {
    id: 'habit-wake-early',
    title: 'Brahma Muhurta / Early Rise (Before 6:00 AM)',
    localTitle: 'बिहान सबेरै उठ्ने (६ बजे अगाडि)',
    category: 'Morning Willpower',
    description: 'Conquer the pillow. Start the day with a glass of water, bed made, and clear mental intent.',
    points: 25,
    iconName: 'Sun',
    timeTarget: '06:00 AM',
  },
  {
    id: 'habit-deep-study',
    title: '45-Min Pure Study / No Phone Distraction',
    localTitle: '४५ मिनेट मोबाइल बिना गहन अध्ययन',
    category: 'Academic Focus',
    description: 'Phone in airplane mode in another room. Complete an uninterrupted problem set or chapter.',
    points: 40,
    iconName: 'BookOpen',
    timeTarget: '45 mins',
  },
  {
    id: 'habit-body-exercise',
    title: 'Surya Namaskar or 20-Min Physical Fitness',
    localTitle: 'सूर्य नमस्कार वा २० मिनेट शारीरिक व्यायाम',
    category: 'Mind & Body',
    description: 'Physical discipline builds mental discipline. Pushups, stretching, or brisk morning walk.',
    points: 20,
    iconName: 'Activity',
    timeTarget: '20 mins',
  },
  {
    id: 'habit-digital-fast',
    title: 'Digital Fast: Zero Reels / TikTok / Short Videos',
    localTitle: 'डिजिटल उपवास: रिल्स र टिकटक बन्द',
    category: 'Digital Self-Control',
    description: 'Reclaim dopamine baseline. Do not open addictive infinite scroll algorithms today.',
    points: 35,
    iconName: 'SmartphoneOff',
    timeTarget: 'All Day',
  },
  {
    id: 'habit-respect-elders',
    title: 'Act of Service to Parents / Elders & Gratitude',
    localTitle: 'आमाबुबाको सेवा र कृतज्ञता',
    category: 'Character & Integrity',
    description: 'Help with house chores, speak gently, and express genuine gratitude to teachers or family.',
    points: 30,
    iconName: 'HeartHandshake',
    timeTarget: 'Daily',
  },
  {
    id: 'habit-night-reading',
    title: 'Read 10 Pages of Non-Fiction / Science Book',
    localTitle: 'राति सुत्नु अघि १० पृष्ठ ज्ञानवर्धक पुस्तक अध्ययन',
    category: 'Academic Focus',
    description: 'Replace bedtime blue light with deep intellectual reading before sleep.',
    points: 25,
    iconName: 'Book',
    timeTarget: '15 mins',
  },
];

export const INITIAL_DISCIPLINE_BADGES: DisciplineBadge[] = [
  {
    id: 'badge-iron-will',
    title: 'Iron Will Initiator',
    description: 'Maintained 3 consecutive days of morning discipline and zero study distraction.',
    icon: 'Shield',
    unlockedAt: '2026-10-24',
    criteria: '3-Day Streak',
  },
  {
    id: 'badge-digital-monk',
    title: 'Digital Monk',
    description: 'Successfully defeated 10 distraction triggers in the Impulse Resistance Reflex Arena.',
    icon: 'Zap',
    unlockedAt: '2026-10-26',
    criteria: 'Score 100+ in Impulse Arena',
  },
  {
    id: 'badge-everest-scholar',
    title: 'Everest Scholar',
    description: 'Completed 5 continuous hours of deep study focus on the Himalayan Mountain Climb.',
    icon: 'Award',
    criteria: '300 Total Focus Minutes',
  },
  {
    id: 'badge-dharma-master',
    title: 'Dharma & Integrity Master',
    description: 'Completed 30 days of consistent acts of respect, gratitude, and clean discipline.',
    icon: 'Crown',
    criteria: '30-Day Master Streak',
  },
];

export interface ImpulseItem {
  id: string;
  label: string;
  type: 'distraction' | 'virtue';
  penaltyOrPoints: number;
  color: string;
  description: string;
}

export const IMPULSE_ITEMS: ImpulseItem[] = [
  // Temptations to RESIST (Penalty if clicked, or ignore to get discipline bonus)
  { id: 'imp-reels', label: 'Doomscroll 30 Reels', type: 'distraction', penaltyOrPoints: -20, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', description: 'Dopamine trap that steals 2 hours of study time!' },
  { id: 'imp-snooze', label: 'Hit Snooze 3 Times', type: 'distraction', penaltyOrPoints: -15, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', description: 'Start the day in reactive weakness!' },
  { id: 'imp-gaming', label: 'Just One More Video Game Match', type: 'distraction', penaltyOrPoints: -25, color: 'text-red-400 bg-red-500/10 border-red-500/30', description: 'Exam tomorrow! Postpone gaming until weekend.' },
  { id: 'imp-procrastinate', label: 'Will Study Tomorrow Instead', type: 'distraction', penaltyOrPoints: -30, color: 'text-orange-400 bg-orange-500/10 border-orange-500/30', description: 'Tomorrow never comes. Discipline is NOW!' },
  { id: 'imp-junkfood', label: 'Midnight Sugar & Chips Binge', type: 'distraction', penaltyOrPoints: -10, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', description: 'Brain fog and sluggishness next morning.' },

  // Virtues to COLLECT (Must click quickly!)
  { id: 'imp-focus', label: 'Laser Focus On Problem Set', type: 'virtue', penaltyOrPoints: 25, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', description: 'High cognitive flow state unlocked!' },
  { id: 'imp-punctuality', label: 'Submit Homework 1 Hour Early', type: 'virtue', penaltyOrPoints: 20, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', description: 'Punctuality is the hallmark of champions.' },
  { id: 'imp-integrity', label: 'No Cheating During Mock Exam', type: 'virtue', penaltyOrPoints: 35, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', description: 'True mastery over deceptive shortcuts.' },
  { id: 'imp-exercise', label: '25 Pushups When Feeling Lazy', type: 'virtue', penaltyOrPoints: 20, color: 'text-amber-300 bg-amber-500/10 border-amber-500/30', description: 'Energy follows physical movement!' },
  { id: 'imp-meditate', label: '5-Min Deep Breathing Meditation', type: 'virtue', penaltyOrPoints: 15, color: 'text-teal-300 bg-teal-500/10 border-teal-500/30', description: 'Calm the racing mind and sharpen willpower.' },
];
