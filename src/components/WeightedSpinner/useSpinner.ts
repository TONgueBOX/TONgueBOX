import { useState, useEffect } from "react";
import { Player, Square } from "../../types";

export const useSpinner = (players: Player[]) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [winnerInput, setWinnerInput] = useState("");
  const [winner, setWinner] = useState<number | null>(null);
  const [squares, setSquares] = useState<Square[]>([]);
  const [showWinner, setShowWinner] = useState(false);

  // Generate squares based on player weights
  const generateSquares = (players: Player[]): Square[] => {
    const totalWeight = players.reduce((sum, player) => sum + player.weight, 0);
    const targetTotalSquares = 50; // Target number of squares

    // Calculate how many squares each player should get
    const playerSquareCounts = players.map((player) => ({
      player,
      count:
        player.weight > 0
          ? Math.max(
              1, // Guarantee at least 1 square for any player with weight > 0
              Math.round((player.weight / totalWeight) * targetTotalSquares)
            )
          : 0 // Players with 0 weight get 0 squares
    }));

    // Ensure we don't exceed target total squares due to minimum guarantees
    const totalCalculatedSquares = playerSquareCounts.reduce(
      (sum, pc) => sum + pc.count,
      0
    );

    // If we have too many squares due to minimum guarantees, adjust proportionally
    if (totalCalculatedSquares > targetTotalSquares) {
      const scaleFactor = targetTotalSquares / totalCalculatedSquares;

      playerSquareCounts.forEach((pc) => {
        if (pc.player.weight > 0) {
          pc.count = Math.max(1, Math.floor(pc.count * scaleFactor));
        }
      });

      // Final adjustment to hit exact target
      const finalTotal = playerSquareCounts.reduce(
        (sum, pc) => sum + pc.count,
        0
      );
      const difference = targetTotalSquares - finalTotal;

      if (difference > 0) {
        // Add remaining squares to players with highest weights
        const sortedByWeight = [...playerSquareCounts]
          .filter((pc) => pc.player.weight > 0)
          .sort((a, b) => b.player.weight - a.player.weight);

        for (let i = 0; i < difference && i < sortedByWeight.length; i++) {
          sortedByWeight[i].count++;
        }
      }
    }

    // Create array of all squares
    const allSquares: {
      playerId: number;
      playerName: string;
      color: string;
    }[] = [];
    playerSquareCounts.forEach(({ player, count }) => {
      for (let i = 0; i < count; i++) {
        allSquares.push({
          playerId: player.id,
          playerName: player.name,
          color: player.color
        });
      }
    });

    // Fisher-Yates shuffle for truly random distribution
    const shuffledSquares = [...allSquares];
    for (let i = shuffledSquares.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledSquares[i], shuffledSquares[j]] = [
        shuffledSquares[j],
        shuffledSquares[i]
      ];
    }

    // Convert to final format with square indices
    const finalSquares: Square[] = shuffledSquares.map((square, index) => ({
      ...square,
      squareIndex: index
    }));

    return finalSquares;
  };

  // Calculate animation position
  const calculateSpinPosition = (
    winnerId: number,
    targetSquareIndex: number
  ) => {
    // Get container width to calculate center position
    const containerElement = document.querySelector(
      '[data-spinner="true"]'
    )?.parentElement;
    const containerWidth = containerElement
      ? containerElement.clientWidth
      : 768; // fallback to max-w-3xl ~768px
    const centerPosition = containerWidth / 2;

    // Square calculations
    const squareWidth = 64; // w-16 = 64px
    const singleSetWidth = squares.length * squareWidth;

    // Random position within the target square (0 to 1)
    const randomPositionInSquare = Math.random();

    // IMPORTANT: We have 10 repeated sets of squares
    // We need to find which repeated set will be visible after spinning
    const totalRepeats = 10;
    const rotations = 3 + Math.random() * 2; // 3-5 rotations

    // Calculate which set will be in the visible area
    const totalSpinDistance = rotations * singleSetWidth;
    const finalSetIndex =
      Math.floor(totalSpinDistance / singleSetWidth) % totalRepeats;

    // Calculate position within the final visible set
    const targetSquareInFinalSet = targetSquareIndex;
    const targetSquareGlobalPosition =
      finalSetIndex * singleSetWidth + targetSquareInFinalSet * squareWidth;
    const randomPointInSquare =
      targetSquareGlobalPosition + randomPositionInSquare * squareWidth;

    // Now calculate translateX to align this point with center
    const finalTranslateX = centerPosition - randomPointInSquare;

    // Dynamic timing
    const baseTime = 5000;
    const extraTime = Math.min(8000, (rotations - 3) * 2000);
    const totalTime = baseTime + extraTime;

    return { finalTranslateX, totalTime };
  };

  // Handle spin logic
  const handleSpin = () => {
    if (isSpinning) return;

    const winnerId = parseInt(winnerInput);
    if (!winnerId || winnerId < 1 || winnerId > players.length) {
      alert(`Please enter a valid player number (1-${players.length})`);
      return;
    }

    setIsSpinning(true);
    setWinner(null);
    setShowWinner(false);

    // Always reset to starting position first
    setTranslateX(0);

    // Find all squares of the winning player
    const winnerSquares = squares.filter(
      (square) => square.playerId === winnerId
    );

    if (winnerSquares.length === 0) {
      alert(`Player ${winnerId} has no squares!`);
      setIsSpinning(false);
      return;
    }

    // Pick a random square from winner's squares for more realistic landing
    const randomWinnerSquare =
      winnerSquares[Math.floor(Math.random() * winnerSquares.length)];
    const targetSquareIndex = randomWinnerSquare.squareIndex;

    setTimeout(() => {
      // Small delay to ensure position reset is applied before starting new animation
      const { finalTranslateX, totalTime } = calculateSpinPosition(
        winnerId,
        targetSquareIndex
      );

      // Set the final position
      setTranslateX(finalTranslateX);

      // Complete animation
      setTimeout(() => {
        setIsSpinning(false);

        // Wait a bit more for the spinner to visually settle before showing winner
        setTimeout(() => {
          setWinner(winnerId);
          setShowWinner(true);
        }, 500); // Additional delay for winner display
      }, totalTime);
    }, 100);
  };

  // Handle try again logic
  const handleTryAgain = () => {
    setTranslateX(0); // Reset to starting position
    setWinner(null); // Clear winner display
    setWinnerInput(""); // Clear input
    setShowWinner(false); // Reset winner display state
  };

  // Generate squares on client side only to avoid hydration issues
  useEffect(() => {
    setSquares(generateSquares(players));
  }, [players]);

  return {
    // State
    isSpinning,
    translateX,
    winnerInput,
    winner,
    squares,
    showWinner,

    // Actions
    handleSpin,
    handleTryAgain,
    setWinnerInput
  };
};
