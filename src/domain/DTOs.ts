export interface Player {
	id: string;
	nickname: string;
}

export interface Game {
	id: string;
	title: string;
	plataform?: string;
}

export interface Score {
	playerId: Player["id"];
	gameId: Game["id"];
	score: number;
}

export type Leaderboard = [
	{
		rank: number;
		player: Player;
		score: Score["score"];
		game: Game;
	},
];
