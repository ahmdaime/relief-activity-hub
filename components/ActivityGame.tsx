
import React, { useState, useEffect, useRef } from 'react';
import { Activity, TeamId, Question, AppContextType } from '../types';
import { generateMathQuestion, SIMPULAN_BAHASA_DATA, PERIBAHASA_DATA, SCIENCE_QUESTIONS, SCRAMBLE_WORDS } from '../data/content';
import { COUNTRIES_DATA, Country } from '../data/countries';
import { Check, X, Timer, Play, Pause, ArrowRight, Home, Zap, Send, Undo2, AlertTriangle, Flame, Siren, Target, Globe, Rocket } from 'lucide-react';
import { soundEngine } from '../utils/sounds';

interface ActivityGameProps {
    activity: Activity;
    context: AppContextType;
    onExit: () => void;
}

export const ActivityGame: React.FC<ActivityGameProps> = ({ activity, context, onExit }) => {
    // Game State
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [round, setRound] = useState(1);
    const [localScore, setLocalScore] = useState({ boys: 0, girls: 0 });
    const [activeTeam, setActiveTeam] = useState<TeamId>('boys');
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [userInput, setUserInput] = useState('');

    // Math Specific State
    const [buzzedTeam, setBuzzedTeam] = useState<TeamId | null>(null);

    // Timer Settings
    const getMaxTime = () => {
        if (activity.type === 'math') return 60;
        if (activity.type === 'hangman') return 90; // More time for hangman
        return 45;
    };
    const [turnTimer, setTurnTimer] = useState(getMaxTime());

    const [winner, setWinner] = useState<TeamId | 'draw' | null>(null);
    const [earnedBonus, setEarnedBonus] = useState(false);

    // ============ NEW FEATURES STATE ============

    // STREAK SYSTEM
    const [streak, setStreak] = useState({ boys: 0, girls: 0 });
    const [lastStreakTeam, setLastStreakTeam] = useState<TeamId | null>(null);

    // STEAL MECHANIC
    const [stealMode, setStealMode] = useState(false);
    const [stealTimer, setStealTimer] = useState(0);
    const [stealAvailableFor, setStealAvailableFor] = useState<TeamId | null>(null);
    const [wasStolen, setWasStolen] = useState(false);
    const stealTimerRef = useRef<number | null>(null);

    // Points earned this round (for display)
    const [pointsEarned, setPointsEarned] = useState(0);

    // ============ HANGMAN STATE ============
    const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
    const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const MAX_WRONG_GUESSES = 6;
    const [hangmanUsedIndices, setHangmanUsedIndices] = useState<Set<number>>(new Set());

    // ============================================

    // Question Management
    const [usedQuestionIndices, setUsedQuestionIndices] = useState<Set<number>>(new Set());

    // Refs for timer
    const timerRef = useRef<number | null>(null);

    // Constants
    const TOTAL_ROUNDS = (activity.id === 'peribahasa-challenge' || activity.id === 'simpulan-bahasa' || activity.id === 'math-quickfire' || activity.id === 'sains-fakta') ? 30 : (activity.type === 'hangman' ? 15 : 10);
    const POINTS_PER_CORRECT = 100;
    const POINTS_PER_WRONG = 50;
    const SPEED_BONUS_POINTS = 50;
    const SPEED_THRESHOLD = 5;
    const STEAL_TIME = 5; // seconds
    const STEAL_POINTS = 75;
    const SHOWDOWN_ROUNDS = 5; // Last 5 rounds are showdown

    // FINAL SHOWDOWN - computed after TOTAL_ROUNDS is defined
    const isShowdown = round > (TOTAL_ROUNDS - SHOWDOWN_ROUNDS);
    const [showdownAnnounced, setShowdownAnnounced] = useState(false);

    // STREAK MULTIPLIER
    const getStreakMultiplier = (streakCount: number): number => {
        if (streakCount >= 5) return 2.0;
        if (streakCount >= 3) return 1.5;
        return 1.0;
    };

    // SHOWDOWN MULTIPLIER
    const getShowdownMultiplier = (): number => {
        return isShowdown ? 2 : 1;
    };

    // Utility to shuffle array
    const shuffleArray = <T,>(array: T[]): T[] => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    // Initialize Question
    const loadQuestion = () => {
        let q: Question;

        // Announce showdown on first showdown round
        if (round === TOTAL_ROUNDS - SHOWDOWN_ROUNDS + 1 && !showdownAnnounced) {
            setShowdownAnnounced(true);
            soundEngine.play('showdown');
        }

        if (activity.type === 'quiz') {
            const sourceData = activity.id === 'peribahasa-challenge' ? PERIBAHASA_DATA : SIMPULAN_BAHASA_DATA;
            const prefix = activity.id === 'peribahasa-challenge' ? 'peri' : 'quiz';

            let availableIndices = sourceData.map((_, idx) => idx)
                                    .filter(idx => !usedQuestionIndices.has(idx));

            if (availableIndices.length === 0) {
                availableIndices = sourceData.map((_, idx) => idx);
                setUsedQuestionIndices(new Set());
            }

            const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            setUsedQuestionIndices(prev => new Set(prev).add(randomIndex));

            const correctItem = sourceData[randomIndex];
            const otherIndices = sourceData.map((_, idx) => idx).filter(idx => idx !== randomIndex);
            const shuffledDistractors = shuffleArray(otherIndices).slice(0, 3);
            const distractorMeanings = shuffledDistractors.map(idx => sourceData[idx].meaning);
            const options = shuffleArray([correctItem.meaning, ...distractorMeanings]);

            q = {
                id: `${prefix}-${randomIndex}`,
                text: `Apakah maksud "${correctItem.idiom}"?`,
                options: options,
                answer: correctItem.meaning,
                explanation: `Contoh ayat: "${correctItem.example}"`,
                type: 'mcq'
            };

        } else if (activity.type === 'math') {
            q = generateMathQuestion(activity.difficulty);
        } else if (activity.type === 'science') {
            const sourceData = SCIENCE_QUESTIONS;
            let availableIndices = sourceData.map((_, idx) => idx)
                                    .filter(idx => !usedQuestionIndices.has(idx));

            if (availableIndices.length === 0) {
                availableIndices = sourceData.map((_, idx) => idx);
                setUsedQuestionIndices(new Set());
            }

            const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            setUsedQuestionIndices(prev => new Set(prev).add(randomIndex));
            q = sourceData[randomIndex];

        } else if (activity.type === 'hangman') {
            // Hangman / Teka Negara
            let availableIndices = COUNTRIES_DATA.map((_, idx) => idx)
                .filter(idx => !hangmanUsedIndices.has(idx));

            if (availableIndices.length === 0) {
                availableIndices = COUNTRIES_DATA.map((_, idx) => idx);
                setHangmanUsedIndices(new Set());
            }

            const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            setHangmanUsedIndices(prev => new Set(prev).add(randomIndex));

            const country = COUNTRIES_DATA[randomIndex];
            setCurrentCountry(country);
            setGuessedLetters(new Set());
            setWrongGuesses(0);

            q = {
                id: `country-${randomIndex}`,
                text: country.name,
                answer: country.name,
                explanation: country.hint || country.continent,
                type: 'text'
            };
        } else {
            const scrambleQ = SCRAMBLE_WORDS[(round - 1) % SCRAMBLE_WORDS.length];
            q = scrambleQ;
        }

        setCurrentQuestion(q);
        setFeedback(null);
        setShowAnswer(false);
        setEarnedBonus(false);
        setUserInput('');
        setBuzzedTeam(null);
        setStealMode(false);
        setStealAvailableFor(null);
        setWasStolen(false);
        setPointsEarned(0);
        setTurnTimer(getMaxTime());

        // Reset hangman state for new round
        if (activity.type === 'hangman') {
            setGuessedLetters(new Set());
            setWrongGuesses(0);
        }
    };

    // Timer Effect
    useEffect(() => {
        if (isPlaying && !isPaused && !winner && !buzzedTeam && !feedback && !stealMode) {
            timerRef.current = window.setInterval(() => {
                setTurnTimer((prev) => {
                    // Play countdown sound when timer is low
                    if (prev <= 10 && prev > 0) {
                        soundEngine.play('countdown');
                    }
                    if (prev <= 1) {
                        handleTimeout();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, isPaused, round, feedback, winner, buzzedTeam, stealMode]);

    // Steal Timer Effect
    useEffect(() => {
        if (stealMode && stealTimer > 0) {
            stealTimerRef.current = window.setInterval(() => {
                setStealTimer((prev) => {
                    soundEngine.play('tick');
                    if (prev <= 1) {
                        // Steal time expired
                        setStealMode(false);
                        setStealAvailableFor(null);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (stealTimerRef.current) clearInterval(stealTimerRef.current);
        };
    }, [stealMode, stealTimer]);

    const startGame = () => {
        setIsPlaying(true);
        loadQuestion();
    };

    const handleTimeout = () => {
        handleAnswer(false, activeTeam);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleAnswer = (isCorrect: boolean, teamWhoAnswered?: TeamId, isStealAttempt: boolean = false) => {
        if (feedback && !isStealAttempt) return;

        const scoringTeam = teamWhoAnswered || activeTeam;

        // Clear steal timer if running
        if (stealTimerRef.current) clearInterval(stealTimerRef.current);
        setStealMode(false);

        if (isCorrect) {
            setFeedback('correct');

            // Calculate multipliers
            const currentStreak = streak[scoringTeam] + 1;
            const streakMultiplier = getStreakMultiplier(currentStreak);
            const showdownMultiplier = getShowdownMultiplier();

            // Calculate Bonus
            const timeTaken = getMaxTime() - turnTimer;
            const isFast = timeTaken <= SPEED_THRESHOLD;

            // Base points (steal gives less)
            let basePoints = isStealAttempt ? STEAL_POINTS : POINTS_PER_CORRECT;
            if (isFast && !isStealAttempt) {
                basePoints += SPEED_BONUS_POINTS;
                setEarnedBonus(true);
            }

            // Apply multipliers
            const totalPoints = Math.round(basePoints * streakMultiplier * showdownMultiplier);
            setPointsEarned(totalPoints);

            // Update streak - only increment for scoring team, keep other team's streak
            setStreak(prev => ({
                ...prev,
                [scoringTeam]: prev[scoringTeam] + 1
            }));
            setLastStreakTeam(scoringTeam);

            // Play sounds
            if (currentStreak >= 3) {
                soundEngine.play('streak');
            } else {
                soundEngine.play('correct');
            }

            if (isStealAttempt) {
                soundEngine.play('steal');
                setWasStolen(true);
            }

            // Update scores
            setLocalScore(prev => ({
                ...prev,
                [scoringTeam]: prev[scoringTeam] + totalPoints
            }));
            context.updateScore(scoringTeam, totalPoints);

        } else {
            setFeedback('wrong');
            soundEngine.play('wrong');

            // Reset streak for this team
            setStreak(prev => ({
                ...prev,
                [scoringTeam]: 0
            }));

            // Penalty
            setLocalScore(prev => ({
                ...prev,
                [scoringTeam]: prev[scoringTeam] - POINTS_PER_WRONG
            }));
            context.updateScore(scoringTeam, -POINTS_PER_WRONG);

            // Enable steal mode (only for non-math, non-steal attempts)
            if (!isStealAttempt && activity.type !== 'math') {
                const otherTeam: TeamId = scoringTeam === 'boys' ? 'girls' : 'boys';
                setStealAvailableFor(otherTeam);
                setStealMode(true);
                setStealTimer(STEAL_TIME);
            }
        }

        if (!stealMode || isCorrect || isStealAttempt) {
            setShowAnswer(true);
        }

        if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleStealAttempt = (answer: any) => {
        if (!stealAvailableFor) return;

        const isCorrect = answer === currentQuestion?.answer;
        soundEngine.play('buzzer');
        handleAnswer(isCorrect, stealAvailableFor, true);
    };

    const handleScrambleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        const correctAnswer = String(currentQuestion?.answer).toUpperCase().replace(/\s/g, '');
        const userAnswer = userInput.toUpperCase().replace(/\s/g, '');

        handleAnswer(correctAnswer === userAnswer);
    };

    const handleMathSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !buzzedTeam) return;

        const userAnswer = parseInt(userInput.trim());
        const correctAnswer = currentQuestion?.answer as number;

        handleAnswer(userAnswer === correctAnswer, buzzedTeam);
    };

    // HANGMAN FUNCTIONS
    const handleLetterGuess = (letter: string) => {
        if (guessedLetters.has(letter) || feedback) return;

        const newGuessedLetters = new Set(guessedLetters).add(letter);
        setGuessedLetters(newGuessedLetters);

        const countryName = currentCountry?.name || '';
        const isCorrectGuess = countryName.toUpperCase().includes(letter);

        if (isCorrectGuess) {
            soundEngine.play('correct');

            // Check if word is complete
            const isComplete = countryName.toUpperCase().split('').every(
                char => char === ' ' || newGuessedLetters.has(char)
            );

            if (isComplete) {
                // Word completed!
                handleAnswer(true);
            }
        } else {
            soundEngine.play('wrong');
            const newWrongGuesses = wrongGuesses + 1;
            setWrongGuesses(newWrongGuesses);

            if (newWrongGuesses >= MAX_WRONG_GUESSES) {
                // Game over - lost
                handleAnswer(false);
            }
        }
    };

    const getDisplayWord = (): string => {
        if (!currentCountry) return '';
        return currentCountry.name
            .toUpperCase()
            .split('')
            .map(char => {
                if (char === ' ') return '  ';
                if (guessedLetters.has(char)) return char;
                return '_';
            })
            .join(' ');
    };

    const nextRound = () => {
        if (activity.type !== 'math') {
            setActiveTeam(prev => prev === 'boys' ? 'girls' : 'boys');
        }

        if (round >= TOTAL_ROUNDS) {
            endGame();
        } else {
            setRound(r => r + 1);
            setTimeout(() => {
                loadQuestion();
            }, 500);
        }
    };

    const endGame = () => {
        let w: TeamId | 'draw' = 'draw';
        if (localScore.boys > localScore.girls) w = 'boys';
        if (localScore.girls > localScore.boys) w = 'girls';
        setWinner(w);
        soundEngine.play('victory');

        context.addHistory({
            activityId: activity.id,
            winner: w,
            scoreBoys: localScore.boys,
            scoreGirls: localScore.girls,
            timestamp: Date.now()
        });
    };

    // --- RENDERERS ---

    // STREAK INDICATOR COMPONENT
    const StreakIndicator = ({ team }: { team: TeamId }) => {
        const count = streak[team];
        if (count < 2) return null;

        const flames = Math.min(count, 5);
        const isOnFire = count >= 3;

        return (
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                team === 'boys' ? 'bg-blue-500' : 'bg-pink-500'
            } text-white font-black text-sm animate-pulse`}>
                {Array.from({ length: flames }).map((_, i) => (
                    <Flame key={i} size={16} fill="currentColor" className={isOnFire ? 'text-yellow-300' : 'text-orange-300'} />
                ))}
                <span className="ml-1">{count}x</span>
            </div>
        );
    };

    // 1. INTRO SCREEN
    if (!isPlaying) {
        return (
            <div className="h-full flex flex-col items-center justify-center animate-float">
                <div className="bg-white p-8 lg:p-12 rounded-[3rem] shadow-pop border-4 border-slate-900 text-center max-w-5xl w-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-4 bg-slate-900"></div>

                    <div className={`inline-flex p-8 rounded-full border-4 border-slate-900 shadow-pop mb-8 ${activity.subject === 'Matematik' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                        <activity.icon size={100} className="text-slate-900" strokeWidth={1.5} />
                    </div>

                    <h1 className="text-6xl lg:text-7xl font-display font-black mb-4 text-slate-900 tracking-tight uppercase">
                        {activity.title}
                    </h1>
                    <p className="text-3xl text-slate-500 mb-8 font-medium max-w-3xl mx-auto">{activity.description}</p>

                    {/* NEW FEATURES PREVIEW */}
                    <div className="bg-gradient-to-r from-orange-100 via-red-100 to-pink-100 rounded-2xl p-6 mb-8 border-4 border-orange-200">
                        <h3 className="text-xl font-black text-slate-700 mb-4 flex items-center justify-center gap-2">
                            <Flame className="text-orange-500" /> FEATURES BARU!
                        </h3>
                        <div className="flex flex-wrap justify-center gap-4 text-sm font-bold">
                            <span className="bg-white px-4 py-2 rounded-full border-2 border-orange-300">🔥 Combo Streak</span>
                            <span className="bg-white px-4 py-2 rounded-full border-2 border-purple-300">🎯 Boleh Curi</span>
                            <span className="bg-white px-4 py-2 rounded-full border-2 border-red-300">⚡ Pusingan Kritikal 2x</span>
                            <span className="bg-white px-4 py-2 rounded-full border-2 border-blue-300">🔊 Sound Effects</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8 mb-12 text-left">
                        <div className="bg-orange-50 p-6 rounded-2xl border-4 border-slate-900 shadow-pop">
                            <span className="block text-sm font-bold text-slate-400 uppercase tracking-wider">Masa</span>
                            <span className="text-3xl font-black text-orange-600">{activity.duration} Minit</span>
                        </div>
                        <div className="bg-green-50 p-6 rounded-2xl border-4 border-slate-900 shadow-pop">
                            <span className="block text-sm font-bold text-slate-400 uppercase tracking-wider">Tahap</span>
                            <span className="text-3xl font-black text-green-600">{activity.difficulty}</span>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-2xl border-4 border-slate-900 shadow-pop">
                            <span className="block text-sm font-bold text-slate-400 uppercase tracking-wider">Soalan</span>
                            <span className="text-3xl font-black text-blue-600">{TOTAL_ROUNDS} Pusingan</span>
                        </div>
                    </div>

                    <div className="flex justify-center gap-6">
                        <button onClick={onExit} className="px-10 py-5 rounded-2xl text-2xl font-bold text-slate-500 hover:bg-slate-100 border-4 border-transparent hover:border-slate-200 transition">
                            BATAL
                        </button>
                        <button onClick={startGame} className="px-16 py-6 rounded-2xl bg-brand-green text-white text-3xl font-black border-4 border-slate-900 shadow-pop hover:shadow-pop-hover hover:-translate-y-1 active:shadow-pop-active active:translate-y-1 transition-all flex items-center gap-4">
                            <Play size={36} fill="currentColor" /> MULA
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. END SCREEN
    if (winner) {
        return (
            <div className="h-full flex flex-col items-center justify-center animate-fade-in-up">
                <div className="bg-white rounded-[3rem] border-4 border-slate-900 shadow-pop p-12 text-center max-w-5xl w-full">
                    <h2 className="text-4xl font-bold text-slate-400 mb-4 tracking-widest">TAMAT PERMAINAN!</h2>

                    <div className="flex justify-center items-center gap-4 mb-6">
                        <div className="text-9xl animate-bounce-slow filter drop-shadow-xl">
                            {winner === 'boys' ? '🏆' : winner === 'girls' ? '🏆' : '🤝'}
                        </div>
                    </div>

                    <h1 className={`text-8xl font-display font-black mb-10 text-outline-lg ${winner === 'boys' ? 'text-blue-500' : winner === 'girls' ? 'text-pink-500' : 'text-slate-800'}`}>
                        {winner === 'boys' ? context.teams.boys.name + ' MENANG!' :
                         winner === 'girls' ? context.teams.girls.name + ' MENANG!' :
                         'SERI!'}
                    </h1>

                    <div className="flex justify-center gap-8 mb-12">
                        <div className="bg-blue-50 border-4 border-blue-200 rounded-3xl p-8 w-64">
                            <div className="text-2xl font-bold text-blue-800 mb-2">LELAKI 💙</div>
                            <div className="text-7xl font-black text-blue-600">{localScore.boys}</div>
                        </div>
                        <div className="bg-pink-50 border-4 border-pink-200 rounded-3xl p-8 w-64">
                            <div className="text-2xl font-bold text-pink-800 mb-2">PEREMPUAN 💖</div>
                            <div className="text-7xl font-black text-pink-600">{localScore.girls}</div>
                        </div>
                    </div>

                    <button onClick={onExit} className="px-12 py-6 bg-slate-900 text-white rounded-2xl text-3xl font-bold border-4 border-slate-900 shadow-pop hover:shadow-pop-hover hover:-translate-y-1 transition-all flex items-center gap-3 mx-auto">
                        <Home size={32} /> KEMBALI KE MENU
                    </button>
                </div>
            </div>
        );
    }

    // 3. GAMEPLAY UI
    let bgColor = 'bg-slate-100';
    let borderColor = 'border-slate-900';

    // Showdown mode styling
    if (isShowdown) {
        bgColor = 'bg-gradient-to-br from-red-100 via-orange-100 to-yellow-100';
        borderColor = 'border-red-500';
    } else if (activity.type !== 'math') {
        bgColor = activeTeam === 'boys' ? 'bg-blue-50' : 'bg-pink-50';
        borderColor = activeTeam === 'boys' ? 'border-blue-500' : 'border-pink-500';
    } else if (buzzedTeam) {
        bgColor = buzzedTeam === 'boys' ? 'bg-blue-100' : 'bg-pink-100';
        borderColor = buzzedTeam === 'boys' ? 'border-blue-600' : 'border-pink-600';
    }

    return (
        <div className={`h-full flex flex-col max-w-7xl mx-auto ${bgColor} rounded-[2.5rem] border-4 ${borderColor} shadow-pop p-8 transition-colors duration-500 relative overflow-hidden`}>

            {/* Background Texture */}
            <div className="absolute inset-0 pattern-diagonal opacity-20 pointer-events-none"></div>

            {/* SHOWDOWN BANNER */}
            {isShowdown && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white py-2 text-center font-black text-xl tracking-widest flex items-center justify-center gap-3 animate-pulse z-20">
                    <Siren size={24} /> PUSINGAN KRITIKAL — MARKAH 2X! <Siren size={24} />
                </div>
            )}

            {/* Header: Round & Timer */}
            <div className={`relative z-10 flex justify-between items-center mb-6 ${isShowdown ? 'mt-8' : ''}`}>
                <div className="flex items-center gap-4">
                    <span className={`bg-white border-2 shadow-sm px-6 py-3 rounded-xl text-2xl font-black font-display ${isShowdown ? 'border-red-500 text-red-600' : 'border-slate-900 text-slate-900'}`}>
                        SOALAN {round} / {TOTAL_ROUNDS}
                    </span>

                    {/* Streak Indicators */}
                    <StreakIndicator team="boys" />
                    <StreakIndicator team="girls" />

                    {activity.type !== 'math' && !stealMode && (
                        <div className={`px-6 py-3 rounded-xl border-2 border-slate-900 shadow-sm flex items-center gap-2 ${activeTeam === 'boys' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                            <span className="text-xl font-bold uppercase">Giliran:</span>
                            <span className="text-2xl font-black">{activeTeam === 'boys' ? 'Lelaki 💙' : 'Perempuan 💖'}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-3 bg-white px-6 py-2 rounded-xl border-2 border-slate-900 shadow-sm ${turnTimer < 10 ? 'text-red-600 animate-pulse bg-red-50' : 'text-slate-800'}`}>
                        <Timer size={32} strokeWidth={2.5} />
                        <span className="text-4xl font-mono font-bold">{turnTimer}s</span>
                    </div>
                    <button onClick={() => setIsPaused(!isPaused)} className="p-3 bg-white border-2 border-slate-900 rounded-xl hover:bg-slate-100 transition shadow-sm">
                        {isPaused ? <Play size={28} /> : <Pause size={28} />}
                    </button>
                </div>
            </div>

            {/* STEAL MODE OVERLAY */}
            {stealMode && stealAvailableFor && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center animate-fade-in">
                    <div className={`bg-white rounded-[3rem] p-12 border-8 ${stealAvailableFor === 'boys' ? 'border-blue-500' : 'border-pink-500'} shadow-2xl text-center max-w-3xl animate-bounce-in`}>
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <Target size={48} className={stealAvailableFor === 'boys' ? 'text-blue-500' : 'text-pink-500'} />
                            <h2 className="text-5xl font-black uppercase">PELUANG CURI!</h2>
                        </div>

                        <p className="text-3xl font-bold text-slate-600 mb-6">
                            {stealAvailableFor === 'boys' ? 'Pasukan Lelaki' : 'Pasukan Perempuan'} boleh curi!
                        </p>

                        <div className="text-8xl font-black text-red-500 mb-8 animate-pulse">
                            {stealTimer}s
                        </div>

                        {/* Steal Answer Options */}
                        {currentQuestion?.options ? (
                            <div className="grid grid-cols-2 gap-4">
                                {currentQuestion.options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleStealAttempt(opt)}
                                        className={`p-6 text-2xl font-bold rounded-2xl border-4 shadow-pop hover:shadow-pop-hover active:translate-y-1 transition-all ${
                                            stealAvailableFor === 'boys' ? 'bg-blue-100 border-blue-500 hover:bg-blue-200' : 'bg-pink-100 border-pink-500 hover:bg-pink-200'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        ) : activity.type === 'science' ? (
                            <div className="flex gap-6 justify-center">
                                <button onClick={() => handleStealAttempt(true)} className="px-16 py-8 bg-green-500 text-white rounded-2xl text-4xl font-black border-4 border-slate-900 shadow-pop">BENAR</button>
                                <button onClick={() => handleStealAttempt(false)} className="px-16 py-8 bg-red-500 text-white rounded-2xl text-4xl font-black border-4 border-slate-900 shadow-pop">PALSU</button>
                            </div>
                        ) : null}

                        <button
                            onClick={() => { setStealMode(false); setShowAnswer(true); }}
                            className="mt-6 text-slate-400 font-bold hover:text-slate-600"
                        >
                            Langkau (Tak nak curi)
                        </button>
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">

                {/* Question Text */}
                {activity.type === 'scramble' ? (
                    <div className="w-full flex flex-col items-center mb-10">
                        <div className="mb-8 text-2xl text-slate-500 font-bold uppercase tracking-widest">SUSUN HURUF INI:</div>
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            {currentQuestion?.text.split('').map((char, i) => (
                                char !== ' ' ? (
                                    <div key={i} className="w-20 h-24 lg:w-24 lg:h-32 bg-white rounded-xl border-b-8 border-r-4 border-slate-900 shadow-md flex items-center justify-center text-5xl lg:text-6xl font-black text-slate-800 animate-bounce-slow" style={{ animationDelay: `${i * 0.1}s` }}>
                                        {char}
                                    </div>
                                ) : <div key={i} className="w-8"></div>
                            ))}
                        </div>
                    </div>
                ) : activity.type === 'hangman' ? (
                    <div className="w-full flex flex-col items-center mb-6">
                        <div className="flex items-center gap-4 mb-4">
                            <Globe size={48} className="text-green-600" />
                            <h2 className="text-4xl font-black text-slate-800 uppercase tracking-wide">
                                Teka Nama Negara!
                            </h2>
                            <Globe size={48} className="text-green-600" />
                        </div>
                        <p className="text-xl text-slate-500 font-medium">
                            Klik huruf untuk meneka. Anda ada {MAX_WRONG_GUESSES} peluang!
                        </p>
                    </div>
                ) : (
                    <div className={`w-full bg-white border-4 shadow-pop rounded-3xl p-10 mb-10 min-h-[300px] flex items-center justify-center relative ${isShowdown ? 'border-red-500' : 'border-slate-900'}`}>
                        <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 px-8 py-2 border-4 rounded-full font-black tracking-widest shadow-sm ${isShowdown ? 'bg-red-500 text-white border-red-700' : 'bg-yellow-300 text-slate-900 border-slate-900'}`}>
                            {isShowdown ? '⚡ SOALAN 2X ⚡' : 'SOALAN'}
                        </div>
                        <h2 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-tight font-display">
                            {currentQuestion?.text}
                        </h2>
                    </div>
                )}

                {/* Input Area / Options */}
                {!showAnswer ? (
                    <div className="w-full max-w-6xl">

                        {activity.type === 'scramble' ? (
                            <form onSubmit={handleScrambleSubmit} className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto">
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    className="w-full text-center text-5xl font-bold p-6 rounded-2xl border-4 border-slate-300 focus:border-brand-purple focus:ring-4 ring-purple-200 outline-none uppercase tracking-widest shadow-inner placeholder-slate-300"
                                    placeholder="TAIP JAWAPAN..."
                                    autoFocus
                                />
                                <button type="submit" className="w-full py-6 bg-brand-green text-white text-3xl font-black rounded-2xl border-4 border-slate-900 shadow-pop hover:shadow-pop-hover active:translate-y-1 transition-all flex items-center justify-center gap-3">
                                    <Send size={32} /> HANTAR JAWAPAN
                                </button>
                            </form>

                        ) : activity.type === 'math' ? (
                            <div className="flex flex-col items-center w-full">
                                {buzzedTeam ? (
                                    <div className="bg-white p-8 rounded-[2rem] border-4 border-slate-900 shadow-2xl animate-bounce-in max-w-2xl w-full">
                                        <h3 className={`text-2xl font-black uppercase mb-6 tracking-wide flex items-center justify-center gap-2 ${buzzedTeam === 'boys' ? 'text-blue-600' : 'text-pink-600'}`}>
                                            {buzzedTeam === 'boys' ? 'Pasukan Lelaki' : 'Pasukan Perempuan'} Menjawab...
                                        </h3>

                                        <form onSubmit={handleMathSubmit} className="flex flex-col items-center gap-4 w-full">
                                            <input
                                                type="number"
                                                value={userInput}
                                                onChange={(e) => setUserInput(e.target.value)}
                                                className="w-full text-center text-6xl font-black p-6 rounded-2xl border-4 border-slate-900 focus:ring-4 focus:ring-yellow-300 outline-none shadow-inner bg-slate-50"
                                                placeholder="0"
                                                autoFocus
                                            />
                                            <button type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl text-xl mt-2 hover:bg-slate-700 transition">
                                                SEMAK JAWAPAN
                                            </button>
                                        </form>

                                        <button onClick={() => setBuzzedTeam(null)} className="text-slate-400 hover:text-slate-600 font-bold flex items-center justify-center gap-2 w-full py-4 mt-2">
                                            <Undo2 size={20} /> Batal
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-8 justify-center w-full">
                                        <button onClick={() => { setBuzzedTeam('boys'); soundEngine.play('buzzer'); }} className="flex-1 h-56 bg-blue-500 hover:bg-blue-600 text-white rounded-3xl border-b-8 border-blue-800 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center justify-center group shadow-xl">
                                            <span className="text-3xl font-bold mb-2">PASUKAN LELAKI</span>
                                            <span className="text-6xl font-black text-outline">JAWAB!</span>
                                        </button>
                                        <button onClick={() => { setBuzzedTeam('girls'); soundEngine.play('buzzer'); }} className="flex-1 h-56 bg-pink-500 hover:bg-pink-600 text-white rounded-3xl border-b-8 border-pink-800 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center justify-center group shadow-xl">
                                            <span className="text-3xl font-bold mb-2">PASUKAN PEREMPUAN</span>
                                            <span className="text-6xl font-black text-outline">JAWAB!</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : currentQuestion?.options ? (
                            <div className="grid grid-cols-2 gap-6 w-full">
                                {currentQuestion.options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(opt === currentQuestion?.answer)}
                                        className="p-8 text-3xl font-bold bg-white border-4 border-slate-900 rounded-2xl shadow-pop hover:shadow-pop-hover hover:bg-yellow-50 active:shadow-pop-active active:translate-y-1 transition-all text-slate-800 text-left flex items-center"
                                    >
                                        <span className="bg-slate-900 text-white w-12 h-12 rounded-lg flex items-center justify-center mr-6 text-xl shrink-0">
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        ) : activity.type === 'science' ? (
                            <div className="flex gap-8 justify-center w-full">
                                <button onClick={() => handleAnswer(currentQuestion?.answer === true)} className="flex-1 py-12 bg-green-500 text-white rounded-3xl border-4 border-slate-900 shadow-pop hover:shadow-pop-hover active:translate-y-1 transition-all text-6xl font-black text-outline">BENAR</button>
                                <button onClick={() => handleAnswer(currentQuestion?.answer === false)} className="flex-1 py-12 bg-red-500 text-white rounded-3xl border-4 border-slate-900 shadow-pop hover:shadow-pop-hover active:translate-y-1 transition-all text-6xl font-black text-outline">PALSU</button>
                            </div>
                        ) : activity.type === 'hangman' ? (
                            // HANGMAN / TEKA NEGARA UI
                            <div className="w-full flex flex-col items-center">
                                {/* Rocket Progress */}
                                <div className="flex items-center gap-8 mb-8">
                                    <div className="flex flex-col items-center">
                                        <div className={`text-6xl transition-transform duration-300 ${wrongGuesses >= MAX_WRONG_GUESSES ? 'opacity-50' : ''}`}
                                            style={{ transform: `translateY(-${(MAX_WRONG_GUESSES - wrongGuesses) * 10}px)` }}>
                                            <Rocket size={64} className={wrongGuesses >= MAX_WRONG_GUESSES ? 'text-red-500' : 'text-green-500'} />
                                        </div>
                                        <div className="flex gap-1 mt-4">
                                            {Array.from({ length: MAX_WRONG_GUESSES }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-4 h-4 rounded-full transition-colors ${
                                                        i < wrongGuesses ? 'bg-red-500' : 'bg-green-400'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-bold text-slate-500 mt-2">
                                            {MAX_WRONG_GUESSES - wrongGuesses} peluang lagi
                                        </span>
                                    </div>

                                    {/* Hint */}
                                    {currentCountry?.hint && (
                                        <div className="bg-yellow-100 px-6 py-3 rounded-xl border-4 border-yellow-300">
                                            <span className="text-sm font-bold text-yellow-700 uppercase">Petunjuk:</span>
                                            <p className="text-xl font-bold text-yellow-800">{currentCountry.hint}</p>
                                        </div>
                                    )}

                                    <div className="bg-purple-100 px-6 py-3 rounded-xl border-4 border-purple-300">
                                        <span className="text-sm font-bold text-purple-700 uppercase">Benua:</span>
                                        <p className="text-xl font-bold text-purple-800">{currentCountry?.continent}</p>
                                    </div>
                                </div>

                                {/* Word Display */}
                                <div className="bg-white p-8 rounded-2xl border-4 border-slate-900 shadow-pop mb-8 min-w-[600px]">
                                    <div className="text-5xl font-mono font-black tracking-[0.3em] text-slate-800 text-center">
                                        {getDisplayWord()}
                                    </div>
                                </div>

                                {/* Letter Keyboard */}
                                <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
                                    {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => {
                                        const isGuessed = guessedLetters.has(letter);
                                        const isInWord = currentCountry?.name.toUpperCase().includes(letter);
                                        const isCorrect = isGuessed && isInWord;
                                        const isWrong = isGuessed && !isInWord;

                                        return (
                                            <button
                                                key={letter}
                                                onClick={() => handleLetterGuess(letter)}
                                                disabled={isGuessed}
                                                className={`w-14 h-14 text-2xl font-black rounded-xl border-4 transition-all ${
                                                    isCorrect
                                                        ? 'bg-green-500 text-white border-green-700 cursor-not-allowed'
                                                        : isWrong
                                                        ? 'bg-red-400 text-white border-red-600 cursor-not-allowed opacity-50'
                                                        : 'bg-white border-slate-900 hover:bg-yellow-100 hover:scale-110 active:scale-95 shadow-pop hover:shadow-pop-hover'
                                                }`}
                                            >
                                                {letter}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : null}
                    </div>
                ) : (
                    // Feedback / Answer Reveal
                    <div className="w-full animate-fade-in-up flex flex-col items-center">
                        <div className={`inline-flex flex-col items-center justify-center px-16 py-6 rounded-[2rem] mb-6 border-4 border-slate-900 shadow-pop transform scale-110 ${feedback === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            <div className="flex items-center gap-6">
                                {feedback === 'correct' ? <Check size={80} strokeWidth={4} /> : <X size={80} strokeWidth={4} />}
                                <span className="text-7xl font-black tracking-tight">
                                    {feedback === 'correct' ? (wasStolen ? 'DICURI!' : 'TEPAT!') : 'SALAH!'}
                                </span>
                            </div>

                            {/* Points Display */}
                            {feedback === 'correct' && pointsEarned > 0 && (
                                <div className="mt-3 bg-green-500 text-white px-6 py-2 rounded-full text-3xl font-black flex items-center gap-2">
                                    +{pointsEarned} MATA
                                    {isShowdown && <span className="text-yellow-300">⚡2X</span>}
                                </div>
                            )}

                            {/* Penalty Display */}
                            {feedback === 'wrong' && (
                                <div className="mt-2 bg-red-500 text-white px-4 py-1 rounded-full text-2xl font-black animate-pulse flex items-center gap-2">
                                    <AlertTriangle size={24} /> TOLAK {POINTS_PER_WRONG} MARKAH
                                </div>
                            )}
                        </div>

                        {/* Streak Badge */}
                        {feedback === 'correct' && lastStreakTeam && streak[lastStreakTeam] >= 3 && (
                            <div className={`mb-4 flex items-center gap-2 px-6 py-3 rounded-full border-4 border-slate-900 shadow-sm animate-bounce ${
                                lastStreakTeam === 'boys' ? 'bg-blue-500 text-white' : 'bg-pink-500 text-white'
                            }`}>
                                <Flame size={28} fill="currentColor" className="text-yellow-300" />
                                <span className="font-black text-2xl">{streak[lastStreakTeam]}x STREAK! ({getStreakMultiplier(streak[lastStreakTeam])}x)</span>
                            </div>
                        )}

                        {/* Speed Bonus Badge */}
                        {earnedBonus && feedback === 'correct' && (
                            <div className="mb-4 flex items-center gap-2 bg-yellow-300 text-slate-900 px-6 py-2 rounded-full border-4 border-slate-900 shadow-sm animate-bounce">
                                <Zap size={24} fill="currentColor" />
                                <span className="font-black text-2xl">BONUS PANTAS!</span>
                            </div>
                        )}

                        <div className="bg-white p-10 rounded-[2rem] border-4 border-slate-900 shadow-pop max-w-4xl w-full mb-10 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-3 bg-slate-200"></div>
                            <div className="text-xl text-slate-400 uppercase font-black tracking-widest mb-4">JAWAPAN SEBENAR</div>
                            <div className="text-6xl font-bold text-slate-900 mb-6">
                                {currentQuestion?.answer === true ? 'BENAR' : currentQuestion?.answer === false ? 'PALSU' : String(currentQuestion?.answer)}
                            </div>
                            {currentQuestion?.explanation && (
                                <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200 inline-block">
                                    <p className="text-3xl text-slate-700 font-display">"{currentQuestion.explanation}"</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center gap-6">
                            <button onClick={nextRound} className={`px-16 py-6 text-slate-900 rounded-2xl text-4xl font-black border-4 border-slate-900 shadow-pop hover:shadow-pop-hover hover:-translate-y-1 transition-all flex items-center gap-4 ${isShowdown ? 'bg-red-400' : 'bg-brand-yellow'}`}>
                                SETERUSNYA <ArrowRight size={40} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
