export interface Participant {
	id: string;
	name: string;
}

export interface Activity {
	id: string;
	category: string;
	title: string;
	plataform?: string;
	region?: string;
}

export interface Score {
	value: number;
}

export type Leaderboard = [
	{
		rank: number;
		participant: Participant;
		activity: Activity;
		score: Score["value"];
	},
];
