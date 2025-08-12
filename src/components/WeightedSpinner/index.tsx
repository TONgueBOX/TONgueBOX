"use client";

import { Player } from "../../types";
import { useSpinner } from "./useSpinner";

interface WeightedSpinnerProps {
  players: Player[];
}

export default function WeightedSpinner({ players }: WeightedSpinnerProps) {
  const {
    isSpinning,
    translateX,
    winnerInput,
    winner,
    squares,
    showWinner,
    handleSpin,
    handleTryAgain,
    setWinnerInput
  } = useSpinner(players);

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-500 border-blue-700",
      red: "bg-red-500 border-red-700",
      green: "bg-green-500 border-green-700",
      yellow: "bg-yellow-500 border-yellow-700",
      purple: "bg-purple-500 border-purple-700",
      orange: "bg-orange-500 border-orange-700",
      pink: "bg-pink-500 border-pink-700",
      indigo: "bg-indigo-500 border-indigo-700"
    };
    return colorMap[color] || "bg-gray-500 border-gray-700";
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full">
      <div className="flex flex-col items-center gap-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800">Spinner Game</h1>

        {/* Players Info */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
          {players.map((player) => {
            const playerSquareCount = squares.filter(
              (s) => s.playerId === player.id
            ).length;
            const percentage =
              squares.length > 0
                ? Math.round((playerSquareCount / squares.length) * 100)
                : 0;

            return (
              <div
                key={player.id}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border"
              >
                <div
                  className={`w-4 h-4 rounded ${
                    getColorClasses(player.color).split(" ")[0]
                  }`}
                ></div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{player.name}</div>
                  <div className="text-xs text-gray-600">
                    Weight: {player.weight}
                  </div>
                  <div className="text-xs text-gray-600">
                    {percentage}% ({playerSquareCount} squares)
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Spinner Area */}
        <div className="relative w-full max-w-3xl h-20 overflow-hidden border-2 border-gray-300 rounded-lg bg-gray-50">
          {/* Center indicator line */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-red-500 opacity-75 z-10"></div>

          {/* Spinning squares */}
          <div
            data-spinner="true"
            className={`flex h-full transition-transform ${
              isSpinning ? "ease-out" : "duration-1000 ease-in-out"
            }`}
            style={{
              transform: `translateX(${translateX}px)`,
              width: "max-content",
              transitionDuration: isSpinning
                ? `${5000 + Math.random() * 8000}ms`
                : "1000ms"
            }}
          >
            {/* Repeat squares multiple times for infinite scroll effect */}
            {squares.length > 0 &&
              Array.from({ length: 10 }, (_, setIndex) =>
                squares.map((square, index) => (
                  <div
                    key={`${setIndex}-${index}`}
                    className={`w-16 h-16 border-2 flex-shrink-0 flex items-center justify-center text-white font-bold text-xs ${getColorClasses(
                      square.color
                    )}`}
                  >
                    {square.playerId}
                  </div>
                ))
              )}
          </div>
        </div>

        {/* Winner Input */}
        {!winner && (
          <div className="flex items-center gap-4">
            <label
              htmlFor="winner-input"
              className="font-semibold text-gray-700"
            >
              Enter Winner (1-{players.length}):
            </label>
            <input
              id="winner-input"
              type="number"
              min="1"
              max={players.length}
              value={winnerInput}
              onChange={(e) => setWinnerInput(e.target.value)}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1"
              disabled={isSpinning}
            />
          </div>
        )}

        {/* Spin Button */}
        <button
          onClick={winner ? handleTryAgain : handleSpin}
          disabled={isSpinning || (!winner && !winnerInput)}
          className={`font-bold py-3 px-8 rounded-lg transition-colors text-lg ${
            isSpinning || (!winner && !winnerInput)
              ? "bg-gray-400 cursor-not-allowed text-gray-600"
              : winner
              ? "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl"
              : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl"
          }`}
        >
          {isSpinning ? "SPINNING..." : winner ? "TRY AGAIN" : "START SPIN"}
        </button>

        {/* Winner Display */}
        {winner && showWinner && (
          <div className="text-center p-4 bg-yellow-100 rounded-lg border-2 border-yellow-300">
            <div className="text-2xl font-bold text-yellow-800 mb-2">
              🎉 WINNER! 🎉
            </div>
            <div className="text-xl font-semibold text-gray-800">
              {players.find((p) => p.id === winner)?.name} wins!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
