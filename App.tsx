
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ActivityGame } from './components/ActivityGame';
import { ACTIVITIES } from './data/content';
import { Team, AppContextType, GameHistory, TeamId } from './types';
import { Trophy, Clock, PlayCircle, History as HistoryIcon, UserCircle2 } from 'lucide-react';

// --- INITIAL STATE FACTORY ---
const createInitialTeams = (): { boys: Team, girls: Team } => ({
    boys: { id: 'boys', name: 'LELAKI', score: 0, wins: 0, color: 'blue', icon: 'shield' },
    girls: { id: 'girls', name: 'PEREMPUAN', score: 0, wins: 0, color: 'pink', icon: 'heart' }
});

const App: React.FC = () => {
    // --- STATE MANAGEMENT ---
    // Default to 'setup' view so teacher can enter team names first
    const [view, setView] = useState<'setup' | 'dashboard' | 'activity'>('setup');
    const [teams, setTeams] = useState(createInitialTeams());
    const [sessionTime, setSessionTime] = useState(0); // Seconds elapsed
    const [currentActivityId, setCurrentActivityId] = useState<string | null>(null);
    const [history, setHistory] = useState<GameHistory[]>([]);

    // --- PERSISTENCE ---
    useEffect(() => {
        const savedData = localStorage.getItem('reliefHubData');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Only restore if from today
                const lastDate = parsed.date;
                const today = new Date().toDateString();
                if (lastDate === today) {
                    setTeams(parsed.teams);
                    setHistory(parsed.history);
                    setSessionTime(parsed.sessionTime || 0);
                    
                    // If teams are already named/setup (not default names), go to dashboard
                    // Check against default names 'LELAKI' and 'PEREMPUAN'
                    if (parsed.teams.boys.name !== 'LELAKI' || parsed.teams.girls.name !== 'PEREMPUAN') {
                        setView('dashboard');
                    }
                }
            } catch (e) {
                console.error("Failed to parse saved data", e);
                localStorage.removeItem('reliefHubData');
            }
        }
        
        // Timer
        const interval = setInterval(() => {
            setSessionTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Auto-save
        const data = {
            date: new Date().toDateString(),
            teams,
            history,
            sessionTime
        };
        localStorage.setItem('reliefHubData', JSON.stringify(data));
    }, [teams, history, sessionTime]);

    // --- ACTIONS ---
    const updateScore = (teamId: TeamId, points: number) => {
        setTeams(prev => ({
            ...prev,
            [teamId]: { ...prev[teamId], score: prev[teamId].score + points }
        }));
    };

    const addHistory = (record: GameHistory) => {
        setHistory(prev => [record, ...prev]);
        
        // Update wins
        if (record.winner !== 'draw') {
             setTeams(prev => ({
                ...prev,
                [record.winner as TeamId]: { ...prev[record.winner as TeamId], wins: prev[record.winner as TeamId].wins + 1 }
            }));
        }
    };

    const resetDaily = () => {
        // Create fresh objects
        setTeams(createInitialTeams());
        setHistory([]);
        setSessionTime(0);
        setCurrentActivityId(null);
        // Clear localStorage explicitly to be safe
        localStorage.removeItem('reliefHubData');
        // Force return to Setup screen (Paparan Utama)
        setView('setup');
    };

    const setTeamName = (id: TeamId, name: string) => {
        setTeams(prev => ({
            ...prev,
            [id]: { ...prev[id], name }
        }));
    };

    const context: AppContextType = {
        teams,
        updateScore,
        sessionTime,
        resetDaily,
        addHistory,
        setTeamName,
        history
    };

    // --- VIEWS ---

    if (view === 'setup') {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8 overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>

                <div className="bg-white max-w-5xl w-full rounded-[3rem] p-12 shadow-2xl text-center relative z-10 border-8 border-slate-800 animate-fade-in-up">
                    <div className="inline-block bg-brand-yellow px-8 py-3 rounded-full border-4 border-slate-900 shadow-pop mb-8 transform -rotate-2">
                        <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight">SETUP HARI INI</h1>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                        {/* Boys Setup */}
                        <div className="bg-blue-50 p-8 rounded-[2rem] border-4 border-slate-900 shadow-pop transform hover:scale-105 transition-transform duration-300">
                            <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 border-4 border-slate-900 flex items-center justify-center text-white">
                                <UserCircle2 size={48} />
                            </div>
                            <h2 className="text-3xl font-black text-blue-900 mb-6 uppercase tracking-wider">Pasukan Lelaki</h2>
                            <div className="text-left">
                                <label className="block text-sm font-bold text-blue-400 mb-2 ml-2 uppercase tracking-widest">NAMA KUMPULAN</label>
                                <input 
                                    type="text" 
                                    value={teams.boys.name}
                                    onChange={(e) => setTeamName('boys', e.target.value)}
                                    className="w-full text-2xl font-bold p-5 rounded-xl border-4 border-blue-200 focus:border-blue-500 outline-none text-blue-900 placeholder-blue-300 bg-white shadow-inner"
                                    placeholder="Cth: Harimau"
                                />
                            </div>
                        </div>

                        {/* Girls Setup */}
                        <div className="bg-pink-50 p-8 rounded-[2rem] border-4 border-slate-900 shadow-pop transform hover:scale-105 transition-transform duration-300">
                             <div className="w-20 h-20 bg-pink-500 rounded-full mx-auto mb-4 border-4 border-slate-900 flex items-center justify-center text-white">
                                <UserCircle2 size={48} />
                            </div>
                            <h2 className="text-3xl font-black text-pink-900 mb-6 uppercase tracking-wider">Pasukan Perempuan</h2>
                            <div className="text-left">
                                <label className="block text-sm font-bold text-pink-400 mb-2 ml-2 uppercase tracking-widest">NAMA KUMPULAN</label>
                                <input 
                                    type="text" 
                                    value={teams.girls.name}
                                    onChange={(e) => setTeamName('girls', e.target.value)}
                                    className="w-full text-2xl font-bold p-5 rounded-xl border-4 border-pink-200 focus:border-pink-500 outline-none text-pink-900 placeholder-pink-300 bg-white shadow-inner"
                                    placeholder="Cth: Rama-rama"
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setView('dashboard')}
                        className="w-full py-8 bg-brand-green text-white text-4xl font-black rounded-2xl border-4 border-slate-900 shadow-pop hover:shadow-pop-hover hover:-translate-y-1 active:translate-y-1 active:shadow-pop-active transition-all group"
                    >
                        <span className="group-hover:animate-pulse inline-block">MULA KELAS SEKARANG 🚀</span>
                    </button>
                </div>
            </div>
        );
    }

    if (view === 'activity' && currentActivityId) {
        const activity = ACTIVITIES.find(a => a.id === currentActivityId);
        if (!activity) return null;
        return (
            <Layout context={context} showControls={false}>
                <ActivityGame 
                    activity={activity} 
                    context={context} 
                    onExit={() => {
                        setCurrentActivityId(null);
                        setView('dashboard');
                    }} 
                />
            </Layout>
        );
    }

    // DASHBOARD VIEW
    return (
        <Layout context={context}>
            <div className="max-w-[1600px] mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-brand-purple rounded-xl border-4 border-slate-900 shadow-sm text-white">
                        <PlayCircle size={32} />
                    </div>
                    <h2 className="text-4xl font-display font-black text-slate-800 tracking-tight">
                        PILIH AKTIVITI
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                    {ACTIVITIES.map((activity) => (
                        <div 
                            key={activity.id}
                            onClick={() => {
                                setCurrentActivityId(activity.id);
                                setView('activity');
                            }}
                            className="bg-white rounded-[2rem] border-4 border-slate-900 shadow-pop hover:shadow-pop-hover hover:-translate-y-2 transition-all cursor-pointer group overflow-hidden flex flex-col h-full"
                        >
                            <div className="p-10 flex flex-col items-center justify-center bg-slate-50 group-hover:bg-purple-50 transition-colors border-b-4 border-slate-100 flex-1 min-h-[200px]">
                                <activity.icon size={80} strokeWidth={1.5} className="text-slate-400 group-hover:text-brand-purple mb-6 transition-colors transform group-hover:scale-110 duration-300" />
                                <h3 className="text-3xl font-display font-black text-center text-slate-800 leading-none group-hover:text-brand-purple">{activity.title}</h3>
                            </div>
                            <div className="p-6 bg-white">
                                <div className="flex justify-between items-center text-sm font-bold text-slate-400 mb-3">
                                    <span className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200"><Clock size={16} /> {activity.duration} MIN</span>
                                    <span className={`px-3 py-1 rounded-lg border text-xs uppercase tracking-wide ${activity.difficulty === 'Mudah' ? 'bg-green-100 text-green-700 border-green-200' : activity.difficulty === 'Sederhana' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                        {activity.difficulty}
                                    </span>
                                </div>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    {activity.description}
                                </p>
                            </div>
                        </div>
                    ))}
                    
                    {/* Placeholder for "Add Activity" or "Coming Soon" */}
                    <div className="bg-slate-100 rounded-[2rem] border-4 border-dashed border-slate-300 flex items-center justify-center p-8 opacity-60 hover:opacity-100 hover:bg-slate-200 transition cursor-not-allowed">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-slate-400 mb-2">Lagi Aktiviti...</h3>
                            <p className="text-slate-400">Akan datang!</p>
                        </div>
                    </div>
                </div>

                {/* History Section */}
                {history.length > 0 && (
                    <div className="mt-16 animate-fade-in mb-20">
                        <h2 className="text-3xl font-display font-bold text-slate-500 mb-6 flex items-center gap-3">
                            <HistoryIcon className="text-slate-400" /> SEJARAH HARI INI
                        </h2>
                        <div className="bg-white rounded-[2rem] border-4 border-slate-200 p-8 shadow-sm">
                            {history.map((record, idx) => (
                                <div key={idx} className="flex items-center justify-between p-6 border-b-2 last:border-0 border-slate-100 hover:bg-slate-50 rounded-xl transition">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl border-2 border-slate-200 ${record.winner === 'boys' ? 'bg-blue-100 text-blue-600' : record.winner === 'girls' ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-600'}`}>
                                            <Trophy size={24} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-2xl text-slate-800 mb-1">
                                                {ACTIVITIES.find(a => a.id === record.activityId)?.title || 'Aktiviti'}
                                            </div>
                                            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                                                {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 font-mono font-black text-3xl">
                                        <span className="text-blue-600 w-24 text-right">{record.scoreBoys}</span>
                                        <span className="text-slate-300">-</span>
                                        <span className="text-pink-600 w-24 text-left">{record.scoreGirls}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default App;
