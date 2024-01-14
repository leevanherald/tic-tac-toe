import "./styles.css";
import { useState } from "react";

function Square({ value, onSquareClick, isWinnerSquare }) {
  const classNames = `square ${isWinnerSquare ? "winner" : ""}`;

  return (
    <button className={classNames} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLine: [a, b, c] };
    }
  }
  return { winner: null, winningLine: null };
}

function Board({ xIsNext, squares, onPlay }) {
  //const winner = calculateWinner(squares);
  const { winner, winningLine } = calculateWinner(squares);
  let status = null;
  if (winner) {
    status = "Winner is : " + winner;
  } else {
    status = "Next Player : " + (xIsNext ? "X" : "O");
  }

  function handleClick(i) {
    const newSquares = squares.slice();
    if (squares[i] || calculateWinner(squares).winner) {
      return;
    }
    if (xIsNext) {
      newSquares[i] = "X";
    } else {
      newSquares[i] = "O";
    }
    onPlay(newSquares);
  }

  function isSquareWinner(index) {
    return winningLine && winningLine.includes(index);
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {(() => {
          const rows = [];
          for (let i = 0; i < 3; i++) {
            const squaresInRow = [];
            for (let j = 0; j < 3; j++) {
              const squareIndex = i * 3 + j;
              const isWinnerSquare = isSquareWinner(squareIndex);
              squaresInRow.push(
                <Square
                  key={squareIndex}
                  value={squares[squareIndex]}
                  onSquareClick={() => handleClick(squareIndex)}
                  isWinnerSquare={isWinnerSquare}
                />,
              );
            }
            rows.push(
              <div key={i} className="board-row">
                {squaresInRow}
              </div>,
            );
          }
          return rows;
        })()}
      </div>
    </>
  );
}

export default function Game() {
  const [currentMove, setCurrentMove] = useState(0);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(newSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), newSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextStep) {
    setCurrentMove(nextStep);
  }

  function reset() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    let description;
    let currentDescription = "You are at move #" + move;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    if (move == currentMove) {
      return (
        <li key={move}>
          <strong>{currentDescription}</strong>
        </li>
      );
    }
    return (
      <li key={move}>
        <button className="step" onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    );
  });
  return (
    <>
      <h1 className="title">Tic-Tac-Toe</h1>

      <div className="game">
        <div className="game-component">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </div>
        <div className="game-info">
          <h1>History</h1>
          <ol>{moves}</ol>
          <button onClick={reset}>Reset</button>
        </div>
      </div>
    </>
  );
}
