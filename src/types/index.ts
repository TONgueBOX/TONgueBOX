export interface Player {
  id: number;
  name: string;
  color: string;
  weight: number;
}

export interface Square {
  playerId: number;
  playerName: string;
  color: string;
  squareIndex: number;
}
