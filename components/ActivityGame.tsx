
import React, { useState, useEffect, useRef } from 'react';
import { Activity, TeamId, Question, AppContextType } from '../types';
import { generateMathQuestion, SIMPULAN_BAHASA_DATA, PERIBAHASA_DATA, SCIENCE_QUESTIONS, SCRAMBLE_WORDS } from '../data/content';
import { Check, X, Timer, Play, Pause, ArrowRight, Home, Zap, Send, Undo2, AlertTriangle } from 'lucide-react';

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
    const [activeTeam, setActiveTeam] = useState<TeamId>('boys'); // Who's turn is it?
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [userInput, setUserInput] = useState('');
    
    // Math Specific State
    const [buzzedTeam, setBuzzedTeam] = useState<TeamId | null>(null);

    // Timer Settings
    const getMaxTime = () => activity.type === 'math' ? 60 : 45;
    const [turnTimer, setTurnTimer] = useState(getMaxTime());
    
    const [winner, setWinner] = useState<TeamId | 'draw' | null>(null);
    const [earnedBonus, setEarnedBonus] = useState(false); // Track if bonus was earned this round
    
    // Question Management for Non-Repeatable Questions
    const [usedQuestionIndices, setUsedQuestionIndices] = useState<Set<number>>(new Set());
    
    // Refs for timer
    const timerRef = useRef<number | null>(null);
    
    // Constants
    const TOTAL_ROUNDS = (activity.id === 'peribahasa-challenge' || activity.id === 'simpulan-bahasa' || activity.id === 'math-quickfire' || activity.id === 'sains-fakta') ? 30 : 10;
    const POINTS_PER_CORRECT = 100;
    const POINTS_PER_WRONG = 50; // Penalty points
    const SPEED_BONUS_POINTS = 50;
    const SPEED_THRESHOLD = 5; // Seconds to get bonus

    // --- GAME LOOP LOGIC ---

    // Utility to shuffle array
    const shuffleArray = <T,>(array: T[]): T[] => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    // Initialize Question
    const loadQuestion = () => {
        let q: Question;
        
        if (activity.type === 'quiz') {
            // Determine dataset based on activity ID
            const sourceData = activity.id === 'peribahasa-challenge' ? PERIBAHASA_DATA : SIMPULAN_BAHASA_DATA;
            const prefix = activity.id === 'peribahasa-challenge' ? 'peri' : 'quiz';

            // Smart Quiz Generation from Raw Data
            let availableIndices = sourceData.map((_, idx) => idx)
                                    .filter(idx => !usedQuestionIndices.has(idx));
            
            // If we ran out of questions (rare with 80+), reset used
            if (availableIndices.length === 0) {
                availableIndices = sourceData.map((_, idx) => idx);
                setUsedQuestionIndices(new Set());
            }

            // Pick random index
            const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            
            // Mark as used
            setUsedQuestionIndices(prev => new Set(prev).add(randomIndex));

            const correctItem = sourceData[randomIndex];
            
            // Generate Distractors (Wrong Answers)
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
            // Smart Shuffle for Science Questions
            const sourceData = SCIENCE_QUESTIONS;
            
            let availableIndices = sourceData.map((_, idx) => idx)
                                    .filter(idx => !usedQuestionIndices.has(idx));
            
            // Reset if ran out
            if (availableIndices.length === 0) {
                availableIndices = sourceData.map((_, idx) => idx);
                setUsedQuestionIndices(new Set());
            }

            const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            setUsedQuestionIndices(prev => new Set(prev).add(randomIndex));
            
            q = sourceData[randomIndex];

        } else {
            // Scramble
            const scrambleQ = SCRAMBLE_WORDS[(round - 1) % SCRAMBLE_WORDS.length];
            q = scrambleQ;
        }

        setCurrentQuestion(q);
        setFeedback(null);
        setShowAnswer(false);
        setEarnedBonus(false);
        setUserInput('');
        setBuzzedTeam(null);
        setTurnTimer(getMaxTime()); // Reset timer
    };

    // Start Game
    useEffect(() => {
        // Stop timer if paused OR if a team has buzzed in (Math mode)
        if (isPlaying && !isPaused && !winner && !buzzedTeam && !feedback) {
            timerRef.current = window.setInterval(() => {
                setTurnTimer((prev) => {
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
    }, [isPlaying, isPaused, round, feedback, winner, buzzedTeam]);

    const startGame = () => {
        setIsPlaying(true);
        loadQuestion();
    };

    const handleTimeout = () => {
        // Timeout counts as a wrong answer for the active team
        handleAnswer(false, activeTeam);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleAnswer = (isCorrect: boolean, teamWhoAnswered?: TeamId) => {
        if (feedback) return; // Already answered

        const scoringTeam = teamWhoAnswered || activeTeam;

        if (isCorrect) {
            setFeedback('correct');
            
            // Calculate Bonus
            const timeTaken = getMaxTime() - turnTimer;
            const isFast = timeTaken <= SPEED_THRESHOLD;
            const totalPoints = POINTS_PER_CORRECT + (isFast ? SPEED_BONUS_POINTS : 0);
            
            if (isFast) setEarnedBonus(true);

            // Update local score (ADD)
            setLocalScore(prev => ({
                ...prev,
                [scoringTeam]: prev[scoringTeam] + totalPoints
            }));

            // Update global score (ADD)
            context.updateScore(scoringTeam, totalPoints);
        } else {
            setFeedback('wrong');
            
            // Update local score (SUBTRACT)
            setLocalScore(prev => ({
                ...prev,
                [scoringTeam]: prev[scoringTeam] - POINTS_PER_WRONG
            }));

            // Update global score (SUBTRACT)
            context.updateScore(scoringTeam, -POINTS_PER_WRONG);
        }
        
        setShowAnswer(true);
        if (timerRef.current) clearInterval(timerRef.current);
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

        // Auto-detect logic
        const userAnswer = parseInt(userInput.trim());
        const correctAnswer = currentQuestion?.answer as number;

        handleAnswer(userAnswer === correctAnswer, buzzedTeam);
    };

    const nextRound = () => {
        // Toggle Active Team Strictly (If not simultaneous like Math)
        if (activity.type !== 'math') {
            setActiveTeam(prev => prev === 'boys' ? 'girls' : 'boys');
        }

        if (round >= TOTAL_ROUNDS) {
            endGame();
        } else {
            setRound(r => r + 1);
            setTimeout(() => {
                loadQuestion();
            }, 500); // Slight delay for transition
        }
    };

    const endGame = () => {
        let w: TeamId | 'draw' = 'draw';
        // Use localScore for immediate feedback
        if (localScore.boys > localScore.girls) w = 'boys';
        if (localScore.girls > localScore.boys) w = 'girls';
        setWinner(w);
        
        // Add to history
        context.addHistory({
            activityId: activity.id,
            winner: w,
            scoreBoys: localScore.boys,
            scoreGirls: localScore.girls,
            timestamp: Date.now()
        });
    };

    // --- RENDERERS ---

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
                    <p className="text-3xl text-slate-500 mb-12 font-medium max-w-3xl mx-auto">{activity.description}</p>
                    
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
    // Determine background color
    let bgColor = 'bg-slate-100';
    let borderColor = 'border-slate-900';

    if (activity.type !== 'math') {
        bgColor = activeTeam === 'boys' ? 'bg-blue-50' : 'bg-pink-50';
        borderColor = activeTeam === 'boys' ? 'border-blue-500' : 'border-pink-500';
    } else if (buzzedTeam) {
        // If someone buzzed in Math mode
        bgColor = buzzedTeam === 'boys' ? 'bg-blue-100' : 'bg-pink-100';
        borderColor = buzzedTeam === 'boys' ? 'border-blue-600' : 'border-pink-600';
    }

    return (
        <div className={`h-full flex flex-col max-w-7xl mx-auto ${bgColor} rounded-[2.5rem] border-4 ${borderColor} shadow-pop p-8 transition-colors duration-500 relative overflow-hidden`}>
            
            {/* Background Texture */}
            <div className="absolute inset-0 pattern-diagonal opacity-20 pointer-events-none"></div>

            {/* Header: Round & Timer */}
            <div className="relative z-10 flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <span className="bg-white border-2 border-slate-900 shadow-sm text-slate-900 px-6 py-3 rounded-xl text-2xl font-black font-display">
                        SOALAN {round} / {TOTAL_ROUNDS}
                    </span>
                    {activity.type !== 'math' && (
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

            {/* Content Area */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
                
                {/* Question Text */}
                {activity.type === 'scramble' ? (
                    // Scramble Layout
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
                ) : (
                    // Standard Layout
                    <div className="w-full bg-white border-4 border-slate-900 shadow-pop rounded-3xl p-10 mb-10 min-h-[300px] flex items-center justify-center relative">
                         <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-300 px-8 py-2 border-4 border-slate-900 rounded-full font-black text-slate-900 tracking-widest shadow-sm">
                             SOALAN
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
                                <button type="button" onClick={() => setShowAnswer(true)} className="text-slate-400 font-bold hover:text-slate-600 underline">
                                    Menyerah kalah? Lihat jawapan
                                </button>
                            </form>

                        ) : activity.type === 'math' ? (
                            <div className="flex flex-col items-center w-full">
                                {buzzedTeam ? (
                                    // AUTO-DETECT MATH INPUT PHASE
                                    <div className="bg-white p-8 rounded-[2rem] border-4 border-slate-900 shadow-2xl animate-bounce-in max-w-2xl w-full">
                                        <h3 className={`text-2xl font-black uppercase mb-6 tracking-wide flex items-center justify-center gap-2 ${buzzedTeam === 'boys' ? 'text-blue-600' : 'text-pink-600'}`}>
                                            {buzzedTeam === 'boys' ? 'Pasukan Lelaki' : 'Pasukan Perempuan'} Menjawab...
                                        </h3>
                                        
                                        <form onSubmit={handleMathSubmit} className="flex flex-col items-center gap-4 w-full">
                                            <div className="text-slate-400 font-bold mb-2 uppercase tracking-wider">Taip Jawapan Mereka:</div>
                                            <input 
                                                type="number" 
                                                value={userInput}
                                                onChange={(e) => setUserInput(e.target.value)}
                                                className="w-full text-center text-6xl font-black p-6 rounded-2xl border-4 border-slate-900 focus:ring-4 focus:ring-yellow-300 outline-none shadow-inner bg-slate-50"
                                                placeholder="0"
                                                autoFocus
                                            />
                                            <button 
                                                type="submit"
                                                className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl text-xl mt-2 hover:bg-slate-700 transition"
                                            >
                                                SEMAK JAWAPAN
                                            </button>
                                        </form>

                                        <button 
                                            onClick={() => setBuzzedTeam(null)}
                                            className="text-slate-400 hover:text-slate-600 font-bold flex items-center justify-center gap-2 w-full py-4 mt-2"
                                        >
                                            <Undo2 size={20} /> Batal (Sambung Semula)
                                        </button>
                                    </div>
                                ) : (
                                    // BUZZER PHASE
                                    <div className="flex gap-8 justify-center w-full">
                                        <button onClick={() => setBuzzedTeam('boys')} className="flex-1 h-56 bg-blue-500 hover:bg-blue-600 text-white rounded-3xl border-b-8 border-blue-800 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center justify-center group shadow-xl">
                                            <span className="text-3xl font-bold mb-2 opacity-90 group-hover:opacity-100">PASUKAN LELAKI</span>
                                            <span className="text-6xl font-black text-outline">JAWAB!</span>
                                        </button>
                                        <button onClick={() => setBuzzedTeam('girls')} className="flex-1 h-56 bg-pink-500 hover:bg-pink-600 text-white rounded-3xl border-b-8 border-pink-800 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center justify-center group shadow-xl">
                                            <span className="text-3xl font-bold mb-2 opacity-90 group-hover:opacity-100">PASUKAN PEREMPUAN</span>
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
                        ) : (
                            // Fallback
                            <button onClick={() => setShowAnswer(true)} className="px-16 py-8 bg-slate-900 text-white rounded-2xl text-3xl font-bold hover:bg-slate-800 shadow-pop border-4 border-white transition-all">
                                LIHAT JAWAPAN
                            </button>
                        )}
                    </div>
                ) : (
                    // Feedback / Answer Reveal
                    <div className="w-full animate-fade-in-up flex flex-col items-center">
                        <div className={`inline-flex flex-col items-center justify-center px-16 py-6 rounded-[2rem] mb-6 border-4 border-slate-900 shadow-pop transform scale-110 ${feedback === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            <div className="flex items-center gap-6">
                                {feedback === 'correct' ? <Check size={80} strokeWidth={4} /> : <X size={80} strokeWidth={4} />}
                                <span className="text-7xl font-black tracking-tight">
                                    {feedback === 'correct' ? 'TEPAT!' : 'SALAH!'}
                                </span>
                            </div>
                            {/* Penalty Display */}
                            {feedback === 'wrong' && (
                                <div className="mt-2 bg-red-500 text-white px-4 py-1 rounded-full text-2xl font-black animate-pulse flex items-center gap-2">
                                    <AlertTriangle size={24} /> TOLAK {POINTS_PER_WRONG} MARKAH
                                </div>
                            )}
                        </div>

                        {/* Speed Bonus Badge */}
                        {earnedBonus && feedback === 'correct' && (
                            <div className="mb-8 flex items-center gap-2 bg-yellow-300 text-slate-900 px-6 py-2 rounded-full border-4 border-slate-900 shadow-sm animate-bounce">
                                <Zap size={24} fill="currentColor" />
                                <span className="font-black text-2xl">BONUS PANTAS +50</span>
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
                            {/* Manual Adjustment if teacher overrides */}
                            {feedback === 'wrong' && (
                                <button onClick={() => handleAnswer(true)} className="px-8 py-5 bg-slate-200 text-slate-600 rounded-xl font-bold border-2 border-slate-300 hover:bg-green-200 hover:text-green-800 hover:border-green-300 transition">
                                    Beri Markah (Override)
                                </button>
                            )}
                            <button onClick={nextRound} className="px-16 py-6 bg-brand-yellow text-slate-900 rounded-2xl text-4xl font-black border-4 border-slate-900 shadow-pop hover:shadow-pop-hover hover:-translate-y-1 transition-all flex items-center gap-4">
                                SETERUSNYA <ArrowRight size={40} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
