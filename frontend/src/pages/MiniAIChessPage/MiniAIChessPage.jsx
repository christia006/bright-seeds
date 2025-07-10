import React, { useState, useEffect, useCallback } from 'react';
// Assuming Header and ConfettiExplosion are available in your project
// import Header from '../../components/Header/Header';
// import ConfettiExplosion from 'react-confetti-explosion';
import { useNavigate } from 'react-router-dom'; // Assuming react-router-dom is installed

// Placeholder for Header component if not provided by user
const Header = () => (
    <header className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-lg flex justify-center items-center rounded-b-xl">
        <h1 className="text-2xl font-bold">Mini AI Chess</h1>
    </header>
);

// Placeholder for ConfettiExplosion if not provided by user
const ConfettiExplosion = ({ force, duration, particleCount, width, height, colors }) => {
    // This is a dummy component. In a real app, you'd import the actual library.
    useEffect(() => {
        if (typeof window !== 'undefined') {
            console.log("Confetti Explosion would be playing now!");
            // You might add a simple visual cue here for demonstration
        }
    }, []);
    return null; // Does not render anything visible
};


// Piece representations and their values for AI evaluation
const PIECES = {
    'K': { value: 900, icon: 'fas fa-chess-king' },
    'Q': { value: 90, icon: 'fas fa-chess-queen' },
    'R': { value: 50, icon: 'fas fa-chess-rook' },
    'B': { value: 30, icon: 'fas fa-chess-bishop' },
    'N': { value: 30, icon: 'fas fa-chess-knight' },
    'P': { value: 10, icon: 'fas fa-chess-pawn' },
};

// Initial 8x8 board setup
// 0: Empty
// Piece format: 'wP' (white pawn), 'bR' (black rook)
const INITIAL_BOARD = [
    ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
    ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
    ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
];

// Board size constant
const BOARD_SIZE = 8;

// Utility function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
};

const MiniAIChessPage = () => {
    const [board, setBoard] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState('white'); // 'white' or 'black'
    const [selectedPiece, setSelectedPiece] = useState(null); // { row, col, piece }
    const [validMoves, setValidMoves] = useState([]); // Array of {row, col}
    const [feedback, setFeedback] = useState('');
    const [feedbackColor, setFeedbackColor] = useState('text-black'); // Tailwind color class
    const [isExploding, setIsExploding] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null); // 'white' or 'black'

    const navigate = useNavigate();

    // Reset game state
    const initializeGame = useCallback(() => {
        setBoard(JSON.parse(JSON.stringify(INITIAL_BOARD))); // Deep copy
        setCurrentPlayer('white');
        setSelectedPiece(null);
        setValidMoves([]);
        setFeedback('Giliran Putih. Pilih bidakmu!');
        setFeedbackColor('text-gray-800');
        setIsExploding(false);
        setGameOver(false);
        setWinner(null);
    }, []);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    // AI's turn
    useEffect(() => {
        if (currentPlayer === 'black' && !gameOver) {
            setFeedback('Giliran Hitam (AI) berpikir...');
            setFeedbackColor('text-gray-600');
            setTimeout(() => {
                makeAIMove();
            }, 1000); // Give a slight delay for AI to "think"
        }
    }, [currentPlayer, gameOver, board]); // Add board to dependency to re-evaluate on board change

    // --- Chess Logic Functions ---

    // Get piece color
    const getPieceColor = (piece) => piece ? (piece[0] === 'w' ? 'white' : 'black') : null;

    // Get piece type (e.g., 'P', 'R')
    const getPieceType = (piece) => piece ? piece[1] : null;

    // Check if a move is within board boundaries
    const isValidPos = (r, c) => r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;

    // Get all legal moves for a specific piece at (r, c)
    const getLegalMoves = useCallback((boardState, r, c) => {
        const piece = boardState[r][c];
        if (!piece) return [];

        const color = getPieceColor(piece);
        const type = getPieceType(piece);
        const moves = [];

        const addMove = (targetR, targetC) => {
            if (isValidPos(targetR, targetC)) {
                const targetPiece = boardState[targetR][targetC];
                const targetColor = getPieceColor(targetPiece);

                // Cannot move to a square occupied by own piece
                if (targetPiece && targetColor === color) {
                    return false; // Stop checking in this direction for sliding pieces
                }

                moves.push({ row: targetR, col: targetC });
                return !targetPiece; // Continue if empty, stop if captured
            }
            return false; // Stop if out of bounds
        };

        // Pawn moves
        if (type === 'P') {
            const direction = color === 'white' ? -1 : 1;
            const startRow = color === 'white' ? BOARD_SIZE - 2 : 1;

            // Single forward move
            if (isValidPos(r + direction, c) && boardState[r + direction][c] === 0) {
                addMove(r + direction, c);
            }
            // Double forward move from start row
            if (r === startRow && isValidPos(r + direction * 2, c) && boardState[r + direction * 2][c] === 0 && boardState[r + direction][c] === 0) {
                addMove(r + direction * 2, c);
            }
            // Captures
            if (isValidPos(r + direction, c - 1) && boardState[r + direction][c - 1] && getPieceColor(boardState[r + direction][c - 1]) !== color) {
                moves.push({ row: r + direction, col: c - 1 });
            }
            if (isValidPos(r + direction, c + 1) && boardState[r + direction][c + 1] && getPieceColor(boardState[r + direction][c + 1]) !== color) {
                moves.push({ row: r + direction, col: c + 1 });
            }
        }
        // Rook moves
        else if (type === 'R') {
            for (let i = r - 1; i >= 0; i--) if (!addMove(i, c)) break;
            for (let i = r + 1; i < BOARD_SIZE; i++) if (!addMove(i, c)) break;
            for (let j = c - 1; j >= 0; j--) if (!addMove(r, j)) break;
            for (let j = c + 1; j < BOARD_SIZE; j++) if (!addMove(r, j)) break;
        }
        // Knight moves
        else if (type === 'N') {
            const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
            knightMoves.forEach(([dr, dc]) => addMove(r + dr, c + dc));
        }
        // Bishop moves
        else if (type === 'B') {
            for (let i = 1; ; i++) if (!addMove(r - i, c - i)) break;
            for (let i = 1; ; i++) if (!addMove(r - i, c + i)) break;
            for (let i = 1; ; i++) if (!addMove(r + i, c - i)) break;
            for (let i = 1; ; i++) if (!addMove(r + i, c + i)) break;
        }
        // Queen moves
        else if (type === 'Q') {
            for (let i = r - 1; i >= 0; i--) if (!addMove(i, c)) break;
            for (let i = r + 1; i < BOARD_SIZE; i++) if (!addMove(i, c)) break;
            for (let j = c - 1; j >= 0; j--) if (!addMove(r, j)) break;
            for (let j = c + 1; j < BOARD_SIZE; j++) if (!addMove(r, j)) break;
            for (let i = 1; ; i++) if (!addMove(r - i, c - i)) break;
            for (let i = 1; ; i++) if (!addMove(r - i, c + i)) break;
            for (let i = 1; ; i++) if (!addMove(r + i, c - i)) break;
            for (let i = 1; ; i++) if (!addMove(r + i, c + i)) break;
        }
        // King moves
        else if (type === 'K') {
            const kingMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
            kingMoves.forEach(([dr, dc]) => addMove(r + dr, c + dc));
        }

        return moves;
    }, []);

    // Check if a king is in check
    const isKingInCheck = useCallback((boardState, kingColor) => {
        let kingPos = null;
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (boardState[r][c] === `${kingColor[0]}K`) {
                    kingPos = [r, c];
                    break;
                }
            }
            if (kingPos) break;
        }

        if (!kingPos) return false; // King not found (shouldn't happen in a valid game)

        const opponentColor = kingColor === 'white' ? 'black' : 'white';

        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const piece = boardState[r][c];
                if (piece && getPieceColor(piece) === opponentColor) {
                    const opponentMoves = getLegalMoves(boardState, r, c);
                    if (opponentMoves.some(move => move.row === kingPos[0] && move.col === kingPos[1])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }, [getLegalMoves]);

    // Make a move on a new board copy
    const makeMove = (currentBoard, fromR, fromC, toR, toC) => {
        const newBoard = JSON.parse(JSON.stringify(currentBoard));
        const piece = newBoard[fromR][fromC];
        newBoard[fromR][fromC] = 0;
        newBoard[toR][toC] = piece;

        // Pawn promotion (simplified: always to Queen)
        if (getPieceType(piece) === 'P') {
            if (getPieceColor(piece) === 'white' && toR === 0) {
                newBoard[toR][toC] = 'wQ';
            } else if (getPieceColor(piece) === 'black' && toR === BOARD_SIZE - 1) {
                newBoard[toR][toC] = 'bQ';
            }
        }
        return newBoard;
    };

    // Check for game over (simplified: only checkmate)
    const isCheckmate = useCallback((boardState, playerColor) => {
        if (!isKingInCheck(boardState, playerColor)) {
            return false; // Not in check, so not checkmate
        }

        // Try to find any legal move for the current player that gets them out of check
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const piece = boardState[r][c];
                if (piece && getPieceColor(piece) === playerColor) {
                    const moves = getLegalMoves(boardState, r, c);
                    for (const move of moves) {
                        const nextBoard = makeMove(boardState, r, c, move.row, move.col);
                        if (!isKingInCheck(nextBoard, playerColor)) {
                            return false; // Found a move to escape check
                        }
                    }
                }
            }
        }
        return true; // No legal moves to escape check, it's checkmate
    }, [getLegalMoves, isKingInCheck]);

    // --- AI Logic (Minimax with simple evaluation) ---
    const evaluateBoard = useCallback((boardState, color) => {
        let score = 0;
        const opponentColor = color === 'white' ? 'black' : 'white';

        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const piece = boardState[r][c];
                if (piece) {
                    const pieceValue = PIECES[getPieceType(piece)]?.value || 0; // Handle undefined pieceType
                    if (getPieceColor(piece) === color) {
                        score += pieceValue;
                        // Positional bonus: center control (adjusted for 8x8)
                        if ((r >= 2 && r <= 5) && (c >= 2 && c <= 5)) {
                            score += 5; // Small bonus for central squares
                        }
                    } else {
                        score -= pieceValue;
                        // Positional penalty for opponent's central pieces (adjusted for 8x8)
                        if ((r >= 2 && r <= 5) && (c >= 2 && c <= 5)) {
                            score -= 5;
                        }
                    }
                }
            }
        }

        // Check for checkmate (very high bonus/penalty)
        if (isCheckmate(boardState, opponentColor)) {
            score += 10000; // Huge bonus if AI checkmates opponent
        } else if (isCheckmate(boardState, color)) {
            score -= 10000; // Huge penalty if AI is checkmated
        }

        return score;
    }, [isCheckmate]);

    const minimax = useCallback((boardState, depth, isMaximizingPlayer, alpha, beta) => {
        const currentColor = isMaximizingPlayer ? 'black' : 'white';
        const opponentColor = isMaximizingPlayer ? 'white' : 'black';

        if (depth === 0 || isCheckmate(boardState, currentColor) || isCheckmate(boardState, opponentColor)) {
            return evaluateBoard(boardState, 'black'); // Evaluate from AI's perspective (black)
        }

        let bestValue = isMaximizingPlayer ? -Infinity : Infinity;
        let allPossibleMoves = [];

        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const piece = boardState[r][c];
                if (piece && getPieceColor(piece) === currentColor) {
                    const moves = getLegalMoves(boardState, r, c);
                    moves.forEach(move => {
                        allPossibleMoves.push({ from: [r, c], to: [move.row, move.col] });
                    });
                }
            }
        }

        // Shuffle moves to add some randomness and prevent repetitive AI behavior
        shuffleArray(allPossibleMoves);

        for (const move of allPossibleMoves) {
            const newBoard = makeMove(boardState, move.from[0], move.from[1], move.to[0], move.to[1]);
            // Ensure the move does not put the current player's king in check
            if (isKingInCheck(newBoard, currentColor)) {
                continue; // Skip this move if it results in self-check
            }

            let value = minimax(newBoard, depth - 1, !isMaximizingPlayer, alpha, beta);

            if (isMaximizingPlayer) {
                bestValue = Math.max(bestValue, value);
                alpha = Math.max(alpha, bestValue);
            } else {
                bestValue = Math.min(bestValue, value);
                beta = Math.min(beta, bestValue);
            }

            if (beta <= alpha) {
                break; // Alpha-beta pruning
            }
        }
        return bestValue;
    }, [evaluateBoard, getLegalMoves, isCheckmate, isKingInCheck]);

    const makeAIMove = useCallback(() => {
        let bestMove = null;
        let bestValue = -Infinity;
        const aiColor = 'black';

        let allPossibleMoves = [];
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const piece = board[r][c];
                if (piece && getPieceColor(piece) === aiColor) {
                    const moves = getLegalMoves(board, r, c);
                    moves.forEach(move => {
                        allPossibleMoves.push({ from: [r, c], to: [move.row, move.col] });
                    });
                }
            }
        }

        // Shuffle moves to add some randomness and prevent repetitive AI behavior
        shuffleArray(allPossibleMoves);

        for (const move of allPossibleMoves) {
            const newBoard = makeMove(board, move.from[0], move.from[1], move.to[0], move.to[1]);
            // Ensure the AI's move does not put its own king in check
            if (isKingInCheck(newBoard, aiColor)) {
                continue; // Skip this move if it results in self-check
            }

            const value = minimax(newBoard, 3, false, -Infinity, Infinity); // Depth 3 for AI, false because it's opponent's turn in recursive call

            if (value > bestValue) {
                bestValue = value;
                bestMove = move;
            }
        }

        if (bestMove) {
            const newBoardState = makeMove(board, bestMove.from[0], bestMove.from[1], bestMove.to[0], bestMove.to[1]);
            setBoard(newBoardState);
            const isWhiteKingCheckmated = isCheckmate(newBoardState, 'white');
            if (isWhiteKingCheckmated) {
                setFeedback('Skakmat! Hitam (AI) menang! 🏆');
                setFeedbackColor('text-red-600');
                setGameOver(true);
                setWinner('black');
                setIsExploding(true);
            } else {
                setFeedback('Giliran Putih. Pilih bidakmu!');
                setFeedbackColor('text-gray-800');
                setCurrentPlayer('white');
            }
        } else {
            // No legal moves for AI (stalemate or checkmate for AI)
            if (isKingInCheck(board, 'black')) {
                setFeedback('Skakmat! Putih menang! 🏆');
                setFeedbackColor('text-green-600');
                setGameOver(true);
                setWinner('white');
                setIsExploding(true);
            } else {
                setFeedback('Remis! Tidak ada langkah sah untuk Hitam. 🤝');
                setFeedbackColor('text-blue-600');
                setGameOver(true);
            }
        }
    }, [board, minimax, getLegalMoves, isCheckmate, isKingInCheck]);


    // --- User Interaction Handlers ---

    const handleCellClick = (r, c) => {
        if (gameOver || currentPlayer !== 'white') return; // Only white player can click

        const clickedPiece = board[r][c];
        const clickedColor = getPieceColor(clickedPiece);

        // If a piece is already selected
        if (selectedPiece) {
            // If clicking on the selected piece again, deselect it
            if (selectedPiece.row === r && selectedPiece.col === c) {
                setSelectedPiece(null);
                setValidMoves([]);
                setFeedback('Bidak dibatalkan.');
                setFeedbackColor('text-gray-500');
                return;
            }

            // Check if the clicked cell is a valid move for the selected piece
            const targetMove = validMoves.find(move => move.row === r && move.col === c);
            if (targetMove) {
                const newBoardState = makeMove(board, selectedPiece.row, selectedPiece.col, r, c);

                // Check if the move puts own king in check
                if (isKingInCheck(newBoardState, 'white')) {
                    setFeedback('Langkah ini membuat Raja Putih dalam posisi Skak! Coba langkah lain. 🚫');
                    setFeedbackColor('text-red-600');
                    // Do not clear selected piece or valid moves, allow user to pick another move
                    return;
                }

                setBoard(newBoardState);
                setSelectedPiece(null);
                setValidMoves([]);

                // Check for checkmate for black after white's move
                if (isCheckmate(newBoardState, 'black')) {
                    setFeedback('Skakmat! Putih menang! 🎉');
                    setFeedbackColor('text-green-600');
                    setGameOver(true);
                    setWinner('white');
                    setIsExploding(true);
                } else {
                    setFeedback('Giliran Hitam (AI).');
                    setFeedbackColor('text-gray-800');
                    setCurrentPlayer('black');
                }
            } else {
                // If clicked on own piece, select new piece
                if (clickedPiece && clickedColor === 'white') {
                    setSelectedPiece({ row: r, col: c, piece: clickedPiece });
                    setValidMoves(getLegalMoves(board, r, c));
                    setFeedback('Bidak Putih terpilih. Pilih kotak tujuan.');
                    setFeedbackColor('text-blue-600');
                } else {
                    // Invalid move or clicking opponent's piece without capture
                    setFeedback('Langkah tidak valid. Pilih kotak yang valid atau bidakmu sendiri. 🤔');
                    setFeedbackColor('text-orange-600');
                }
            }
        } else {
            // No piece selected, try to select one
            if (clickedPiece && clickedColor === 'white') {
                setSelectedPiece({ row: r, col: c, piece: clickedPiece });
                setValidMoves(getLegalMoves(board, r, c));
                setFeedback('Bidak Putih terpilih. Pilih kotak tujuan.');
                setFeedbackColor('text-blue-600');
            } else {
                setFeedback('Pilih bidak Putihmu dulu! ⚪');
                setFeedbackColor('text-orange-600');
            }
        }
    };

    const handleNewGame = () => {
        initializeGame();
    };

    const handleGoToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        // Main container with full height, centered content, and responsive padding
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-4 font-inter">
            <Header /> {/* Assuming Header component is styled separately */}

            {/* Content area with responsive sizing and shadow */}
            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-md w-full text-center relative overflow-hidden my-8">
                {isExploding && (
                    <div className="absolute inset-0 pointer-events-none z-50">
                        <ConfettiExplosion
                            force={1.8}
                            duration={8000}
                            particleCount={500}
                            width={4000}
                            height={4000}
                            colors={['#FFD700', '#FF4500', '#32CD32', '#1E90FF', '#9370DB', '#FF69B4', '#ADFF2F', '#FFEA00', '#00BCD4', '#FF6347', '#FF1493']}
                        />
                    </div>
                )}

                <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-800 tracking-tight">Mini AI Chess ♟️</h1>
                <p className="text-lg mb-6 font-semibold text-gray-700">
                    {gameOver ? (
                        winner === 'white' ? 'Kamu menang! 🎉' : 'AI menang! 🤖'
                    ) : (
                        `Giliran: ${currentPlayer === 'white' ? 'Putih (Kamu)' : 'Hitam (AI)'}`
                    )}
                </p>

                {/* Chess Board Container - responsive grid */}
                <div className={`grid grid-cols-${BOARD_SIZE} border-4 border-gray-700 shadow-xl rounded-lg overflow-hidden mb-6 aspect-square w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto`}>
                    {board.map((row, rIdx) => (
                        <React.Fragment key={rIdx}>
                            {row.map((cell, cIdx) => {
                                const isLightSquare = (rIdx + cIdx) % 2 === 0;
                                const isSelected = selectedPiece && selectedPiece.row === rIdx && selectedPiece.col === cIdx;
                                const isValidMoveTarget = validMoves.some(move => move.row === rIdx && move.col === cIdx);

                                let cellClasses = `w-full h-full flex items-center justify-center text-2xl md:text-3xl cursor-pointer transition-all duration-200 relative`;

                                if (isLightSquare) cellClasses += ` bg-orange-100`;
                                else cellClasses += ` bg-orange-700`;

                                if (isSelected) cellClasses += ` ring-4 ring-blue-500 ring-offset-2 ring-offset-white scale-105`;
                                if (isValidMoveTarget) cellClasses += ` bg-green-300 hover:bg-green-400`;

                                const piece = cell;
                                const pieceType = getPieceType(piece);
                                const pieceColor = getPieceColor(piece);
                                const pieceIcon = PIECES[pieceType]?.icon;

                                return (
                                    <div
                                        key={`${rIdx}-${cIdx}`}
                                        className={cellClasses}
                                        onClick={() => handleCellClick(rIdx, cIdx)}
                                    >
                                        {piece !== 0 && pieceIcon && (
                                            <i className={`${pieceIcon} ${pieceColor === 'white' ? 'text-gray-900' : 'text-gray-100'} text-3xl md:text-4xl drop-shadow-md`}></i>
                                        )}
                                        {isValidMoveTarget && !piece && ( // Show dot only on empty valid move squares
                                            <div className="absolute w-3 h-3 bg-green-700 rounded-full opacity-75"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>

                {/* Feedback Message */}
                <div className={`text-lg font-medium mt-4 mb-6 ${feedbackColor}`}>
                    {feedback}
                </div>

                {/* Button Group - responsive layout */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full max-w-xs mx-auto">
                    <button
                        onClick={handleNewGame}
                        className="flex-1 px-6 py-3 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105
                                   bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                    >
                        Game Baru 🆕
                    </button>
                    <button
                        onClick={handleGoToDashboard}
                        className="flex-1 px-6 py-3 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105
                                   bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300"
                    >
                        Kembali ke Dashboard 🏠
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MiniAIChessPage;

