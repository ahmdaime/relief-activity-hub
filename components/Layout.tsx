
import React, { useState } from 'react';
import { AppContextType } from '../types';
import { Settings, RefreshCw, Trophy, Clock, X, AlertTriangle } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    context: AppContextType;
    showControls?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, context, showControls = true }) => {
    const { teams, sessionTime, resetDaily } = context;
    const [showSettings, setShowSettings] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen flex flex-col font-sans">
            {/* Projector Optimized Header */}
            <header className="sticky top-0 z-50 bg-white shadow-xl border-b-4 border-slate-900">
                <div className="flex justify-between items-stretch h-28 lg:h-36">
                    {/* BOYS TEAM */}
                    <div className={`flex-1 relative overflow-hidden flex flex-col justify-center items-center border-r-4 border-slate-900 transition-all duration-500 ${teams.boys.score > teams.girls.score ? 'bg-blue-100' : 'bg-white'}`}>
                        {/* Background Pattern */}
                        <div className="absolute inset-0 pattern-diagonal opacity-50 pointer-events-none"></div>
                        
                        <div className="relative z-10 flex flex-col items-center">
                            <h2 className="text-2xl lg:text-3xl font-bold text-blue-700 uppercase tracking-wider mb-1 flex items-center gap-2 bg-white px-4 py-1 rounded-full border-2 border-blue-200 shadow-sm">
                                💙 {teams.boys.name || 'LELAKI'}
                                {teams.boys.score > teams.girls.score && <Trophy className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-500 animate-bounce" />}
                            </h2>
                            <div className="text-6xl lg:text-8xl font-display font-black text-blue-600 leading-none drop-shadow-sm text-outline-white">
                                {teams.boys.score}
                            </div>
                        </div>
                    </div>

                    {/* CENTER INFO (VS) */}
                    <div className="w-48 lg:w-64 flex flex-col justify-center items-center bg-slate-900 text-white px-4 shrink-0 relative overflow-hidden">
                        <div className="absolute inset-0 bg-slate-800 pattern-diagonal opacity-20"></div>
                        <div className="relative z-10 text-center">
                            <div className="flex items-center justify-center gap-2 text-xs lg:text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                                <Clock size={14} /> MASA
                            </div>
                            <div className={`text-4xl lg:text-6xl font-mono font-bold tracking-tight ${sessionTime > 2400 ? 'text-red-400 animate-pulse' : 'text-green-400'}`}>
                                {formatTime(sessionTime)}
                            </div>
                        </div>
                    </div>

                    {/* GIRLS TEAM */}
                    <div className={`flex-1 relative overflow-hidden flex flex-col justify-center items-center border-l-4 border-slate-900 transition-all duration-500 ${teams.girls.score > teams.boys.score ? 'bg-pink-100' : 'bg-white'}`}>
                        {/* Background Pattern */}
                        <div className="absolute inset-0 pattern-diagonal opacity-50 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <h2 className="text-2xl lg:text-3xl font-bold text-pink-700 uppercase tracking-wider mb-1 flex items-center gap-2 bg-white px-4 py-1 rounded-full border-2 border-pink-200 shadow-sm">
                                {teams.girls.score > teams.boys.score && <Trophy className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-500 animate-bounce" />}
                                {teams.girls.name || 'PEREMPUAN'} 💖
                            </h2>
                            <div className="text-6xl lg:text-8xl font-display font-black text-pink-600 leading-none drop-shadow-sm text-outline-white">
                                {teams.girls.score}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-4 lg:p-8 overflow-hidden relative max-w-[1920px] mx-auto w-full">
                {children}
            </main>

            {/* Teacher Floating Controls */}
            {showControls && (
                <>
                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className={`fixed bottom-6 right-6 p-4 rounded-2xl shadow-pop hover:shadow-pop-hover border-2 border-white transition-all transform hover:-translate-y-1 z-50 group ${showSettings ? 'bg-red-500 text-white border-slate-900' : 'bg-slate-900 text-white'}`}
                        title="Tetapan Cikgu"
                    >
                        {showSettings ? <X size={32} /> : <Settings size={32} className="group-hover:rotate-90 transition-transform duration-500" />}
                    </button>

                    {/* Settings Panel */}
                    {showSettings && (
                        <div className="fixed bottom-24 right-6 bg-white p-6 rounded-3xl shadow-2xl border-4 border-slate-900 z-50 w-80 animate-fade-in-up">
                            <h3 className="font-bold font-display text-2xl mb-4 border-b-2 border-slate-100 pb-2 text-slate-800 flex items-center gap-2">
                                <Settings className="text-slate-400" size={24}/> Panel Cikgu
                            </h3>
                            
                            <button 
                                onClick={() => setShowResetConfirm(true)}
                                className="w-full flex items-center justify-center gap-3 p-4 bg-red-100 text-red-700 rounded-xl border-4 border-red-200 hover:bg-red-500 hover:text-white hover:border-slate-900 hover:shadow-md transition mb-3 font-bold group"
                            >
                                <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-500" /> Reset Hari Ini
                            </button>
                            
                            <div className="text-xs text-slate-500 mt-2 bg-slate-50 p-3 rounded-xl border-2 border-slate-200">
                                <p className="flex items-start gap-2">
                                    <span className="text-lg">💡</span> 
                                    <span>Tekan <strong>F11</strong> untuk paparan penuh di projektor supaya murid nampak lebih jelas.</span>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Custom Reset Confirmation Modal */}
                    {showResetConfirm && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowResetConfirm(false)}></div>
                            <div className="bg-white w-full max-w-md p-8 rounded-[2rem] border-4 border-slate-900 shadow-2xl relative z-10 animate-bounce-in transform transition-all">
                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-red-200">
                                     <AlertTriangle size={40} className="text-red-500 animate-pulse" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 text-center mb-4 font-display leading-none">RESET SEMUA?</h3>
                                <p className="text-slate-500 text-center font-bold text-lg mb-8 leading-relaxed">
                                    Adakah anda pasti? Semua markah, masa, dan sejarah aktiviti hari ini akan <span className="text-red-500 underline decoration-4 decoration-red-200">DIPADAM</span>.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => setShowResetConfirm(false)}
                                        className="py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition border-4 border-transparent hover:border-slate-200 text-xl"
                                    >
                                        BATAL
                                    </button>
                                    <button 
                                        onClick={() => {
                                            resetDaily();
                                            setShowResetConfirm(false);
                                            setShowSettings(false);
                                        }}
                                        className="py-4 rounded-xl bg-red-500 text-white font-black border-4 border-slate-900 shadow-pop hover:shadow-pop-hover active:translate-y-1 transition-all text-xl flex items-center justify-center gap-2"
                                    >
                                        YA, PADAM!
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
