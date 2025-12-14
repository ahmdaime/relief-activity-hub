
export type TeamId = 'boys' | 'girls';

export interface Team {
    id: TeamId;
    name: string;
    score: number;
    wins: number;
    color: string;
    icon: string;
}

export interface Activity {
    id: string;
    title: string;
    icon: any; // Lucide Icon
    subject: string;
    duration: number; // minutes
    difficulty: 'Mudah' | 'Sederhana' | 'Mencabar';
    type: 'quiz' | 'math' | 'scramble' | 'science';
    description: string;
}

export interface Question {
    id: string;
    text: string;
    options?: string[]; // For MCQ
    answer: string | number | boolean;
    explanation?: string;
    type?: 'text' | 'mcq' | 'boolean' | 'math';
    difficulty?: number;
}

export interface SimpulanData {
    idiom: string;
    meaning: string;
    example: string;
}

export interface GameState {
    isPlaying: boolean;
    currentActivityId: string | null;
    currentRound: number;
    timeRemaining: number;
    activityScore: {
        boys: number;
        girls: number;
    };
    activeTeam: TeamId; // For turn-based
    history: GameHistory[];
}

export interface GameHistory {
    activityId: string;
    winner: TeamId | 'draw';
    scoreBoys: number;
    scoreGirls: number;
    timestamp: number;
}

export interface AppContextType {
    teams: { boys: Team; girls: Team };
    updateScore: (teamId: TeamId, points: number) => void;
    sessionTime: number; // in seconds
    resetDaily: () => void;
    addHistory: (record: GameHistory) => void;
    setTeamName: (id: TeamId, name: string) => void;
    history: GameHistory[];
}
