export interface Participant {
    id: string;
    name: string;
}

export interface Activity {
    id: string;
    category?: string;
    title?: string;
    plataform?: string;
    region?: string;
    initialScore?: number;
}

export interface Score {
    value: number;
}

export type Leaderboard = Array<{
    rank: number;
    id: Participant["id"];
    name: Participant["name"];
    activity: Activity;
    score: Score["value"];
}>;
