import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WumpusWorldPage.module.css'; // Import file CSS module

// ASUMSI: Anda memiliki komponen Header di lokasi ini.
// Jika tidak, Anda perlu membuat komponen Header sederhana atau mengimpornya dari lokasi yang benar.
import Header from '../../components/Header/Header'; // <-- Menggunakan Header dari komponen yang diimpor

// Konstanta untuk elemen game
const BOARD_SIZE = 4; // Papan 4x4 untuk Wumpus World klasik
const CELL_TYPES = {
    EMPTY: 'E',
    WUMPUS: 'W',
    PIT: 'P',
    GOLD: 'G',
    START: 'S',
};

const PERCEPTS = {
    STENCH: 'Stench',
    BREEZE: 'Breeze',
    GLITTER: 'Glitter',
    SCREAM: 'Scream',
};

const AGENT_ACTIONS = {
    MOVE_UP: 'Up',
    MOVE_DOWN: 'Down',
    MOVE_LEFT: 'Left',
    MOVE_RIGHT: 'Right',
    GRAB: 'Grab',
    SHOOT: 'Shoot',
    CLIMB: 'Climb',
};

// Mode AI yang tersedia
const AI_MODES = {
    MANUAL: 'manual',
    BFS_SEARCH: 'bfs_search',
    DFS_SEARCH: 'dfs_search',
    UCS_SEARCH: 'ucs_search', // Uniform Cost Search
    REASONING_AGENT: 'reasoning_agent', // Menggabungkan penalaran dengan pencarian
    PROBABILISTIC_AGENT: 'probabilistic_agent', // Menggunakan peta keyakinan lebih intensif
};

// Fungsi utilitas untuk mengacak array (algoritma Fisher-Yates)
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Tukar elemen
    }
};

// Fungsi untuk menghasilkan papan Wumpus World acak
const generateRandomBoard = () => {
    let newBoard = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(CELL_TYPES.EMPTY));
    let availableCells = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (!(r === BOARD_SIZE - 1 && c === 0)) { // Kecualikan sel awal (bawah-kiri)
                availableCells.push({ r, c });
            }
        }
    }
    shuffleArray(availableCells);

    // Tempatkan Wumpus (1)
    const wumpusPos = availableCells.pop();
    newBoard[wumpusPos.r][wumpusPos.c] = CELL_TYPES.WUMPUS;

    // Tempatkan Emas (1)
    const goldPos = availableCells.pop();
    newBoard[goldPos.r][goldPos.c] = CELL_TYPES.GOLD;

    // Tempatkan Lubang (2-3 lubang untuk papan 4x4)
    const numPits = Math.floor(Math.random() * 2) + 2; // 2 atau 3 lubang
    for (let i = 0; i < numPits; i++) {
        if (availableCells.length > 0) {
            const pitPos = availableCells.pop();
            newBoard[pitPos.r][pitPos.c] = CELL_TYPES.PIT;
        }
    }

    // Agen dimulai di (BOARD_SIZE - 1, 0)
    newBoard[BOARD_SIZE - 1][0] = CELL_TYPES.START;

    return newBoard;
};

const WumpusWorldPage = () => {
    const navigate = useNavigate();
    const [board, setBoard] = useState([]);
    const [agentPos, setAgentPos] = useState({ r: BOARD_SIZE - 1, c: 0 });
    const [agentHasGold, setAgentHasGold] = useState(false);
    const [agentHasArrow, setAgentHasArrow] = useState(true);
    const [wumpusAlive, setWumpusAlive] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [feedback, setFeedback] = useState('Selamat datang di Wumpus World! Temukan emas dan keluar.');
    const [percepts, setPercepts] = useState([]); // Persepsi saat ini di lokasi agen
    const [visitedCells, setVisitedCells] = useState(new Set()); // Set string {r,c}
    const [knowledgeBase, setKnowledgeBase] = useState({}); // { 'r,c': { stench: bool, breeze: bool, safe: bool, wumpusProb: float, pitProb: float } }
    const [aiMode, setAiMode] = useState(AI_MODES.MANUAL); // Mode AI saat ini
    const [aiPath, setAiPath] = useState([]); // Untuk memvisualisasikan jalur yang direncanakan AI
    const [aiThinking, setAiThinking] = useState(false); // Untuk menunjukkan status berpikir AI

    // Ref untuk mencegah beberapa giliran AI jika pembaruan status terlalu cepat
    const aiTurnInProgress = useRef(false);

    // Inisialisasi status game
    const initializeGame = useCallback(() => {
        const newBoard = generateRandomBoard();
        setBoard(newBoard);
        setAgentPos({ r: BOARD_SIZE - 1, c: 0 });
        setAgentHasGold(false);
        setAgentHasArrow(true);
        setWumpusAlive(true);
        setGameOver(false);
        setGameWon(false);
        setFeedback('Selamat datang di Wumpus World! Temukan emas dan keluar.');
        setPercepts([]);
        setVisitedCells(new Set([`${BOARD_SIZE - 1},0`]));
        setKnowledgeBase({});
        setAiPath([]);
        setAiThinking(false);
    }, []);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    // Dapatkan tetangga yang valid (dipindahkan ke sini agar bisa menjadi dependency)
    const getNeighbors = useCallback((r, c) => {
        const neighbors = [];
        if (r > 0) neighbors.push({ r: r - 1, c }); // Atas
        if (r < BOARD_SIZE - 1) neighbors.push({ r: r + 1, c }); // Bawah
        if (c > 0) neighbors.push({ r, c: c - 1 }); // Kiri
        if (c < BOARD_SIZE - 1) neighbors.push({ r, c: c + 1 }); // Kanan
        return neighbors;
    }, []); // No dependencies, so can be empty

    // Dapatkan persepsi untuk sel tertentu
    const getPerceptsAt = useCallback((r, c) => {
        const currentPercepts = [];
        const neighbors = getNeighbors(r, c);

        for (const neighbor of neighbors) {
            const cellContent = board[neighbor.r][neighbor.c];
            if (cellContent === CELL_TYPES.WUMPUS && wumpusAlive) {
                currentPercepts.push(PERCEPTS.STENCH);
            }
            if (cellContent === CELL_TYPES.PIT) {
                currentPercepts.push(PERCEPTS.BREEZE);
            }
        }
        if (board[r][c] === CELL_TYPES.GOLD && !agentHasGold) {
            currentPercepts.push(PERCEPTS.GLITTER);
        }
        return Array.from(new Set(currentPercepts)); // Hapus duplikat
    }, [board, wumpusAlive, agentHasGold, getNeighbors]);

    // Tangani pergerakan agen
    const moveAgent = useCallback((newR, newC) => {
        if (gameOver) return;

        // Periksa apakah langkah valid (berdekatan dan dalam batas)
        const validMove = getNeighbors(agentPos.r, agentPos.c).some(n => n.r === newR && n.c === newC);

        if (validMove) {
            setAgentPos({ r: newR, c: newC });
            setVisitedCells(prev => new Set(prev).add(`${newR},${newC}`));
        } else {
            setFeedback('Langkah tidak valid. Anda hanya bisa bergerak satu kotak secara horizontal atau vertikal.');
        }
    }, [agentPos, gameOver, getNeighbors]);

    // Tangani tindakan agen
    const handleAction = useCallback((action) => {
        if (gameOver) return;

        if (action === AGENT_ACTIONS.GRAB) {
            if (board[agentPos.r][agentPos.c] === CELL_TYPES.GOLD && !agentHasGold) {
                setAgentHasGold(true);
                setFeedback('Anda mengambil emas! Sekarang kembali ke pintu masuk. 💰');
            } else {
                setFeedback('Tidak ada emas di sini untuk diambil.');
            }
        } else if (action === AGENT_ACTIONS.SHOOT) {
            if (agentHasArrow) {
                setAgentHasArrow(false);
                // Tembak sederhana: jika Wumpus ada di kotak yang berdekatan, ia mati
                const neighbors = getNeighbors(agentPos.r, agentPos.c);
                let wumpusKilled = false;
                for (const neighbor of neighbors) {
                    if (board[neighbor.r][neighbor.c] === CELL_TYPES.WUMPUS && wumpusAlive) {
                        setWumpusAlive(false);
                        wumpusKilled = true;
                        setFeedback('Anda menembak Wumpus! Anda mendengar jeritan. 🎯');
                        // Perbarui basis pengetahuan untuk semua sel: tidak ada lagi wumpus
                        setKnowledgeBase(prevKb => {
                            const updatedKb = { ...prevKb };
                            for (const key in updatedKb) {
                                updatedKb[key].wumpusProb = 0;
                                updatedKb[key].stench = false; // Tidak ada lagi bau
                            }
                            return updatedKb;
                        });
                        break;
                    }
                }
                if (!wumpusKilled) {
                    setFeedback('Anda menembak, tapi tidak ada Wumpus yang terkena.');
                }
            } else {
                setFeedback('Anda tidak punya panah lagi.');
            }
        } else if (action === AGENT_ACTIONS.CLIMB) {
            if (agentPos.r === BOARD_SIZE - 1 && agentPos.c === 0) {
                if (agentHasGold) {
                    setFeedback('Anda berhasil keluar dengan emas! Anda menang! 🏆');
                    setGameOver(true);
                    setGameWon(true);
                } else {
                    setFeedback('Anda keluar tanpa emas. Game Over. 🚪');
                    setGameOver(true);
                }
            } else {
                setFeedback('Anda hanya bisa memanjat keluar dari pintu masuk (0,0).');
            }
        }
    }, [agentPos, board, agentHasArrow, agentHasGold, wumpusAlive, gameOver, getNeighbors]);

    // Perbarui persepsi dan basis pengetahuan
    const updatePerceptsAndKnowledge = useCallback((r, c) => {
        const currentPercepts = getPerceptsAt(r, c);
        setPercepts(currentPercepts);

        // Perbarui basis pengetahuan untuk sel saat ini
        const currentCellKey = `${r},${c}`;
        setKnowledgeBase(prevKb => ({
            ...prevKb,
            [currentCellKey]: {
                ...prevKb[currentCellKey],
                visited: true,
                stench: currentPercepts.includes(PERCEPTS.STENCH),
                breeze: currentPercepts.includes(PERCEPTS.BREEZE),
                glitter: currentPercepts.includes(PERCEPTS.GLITTER),
                scream: currentPercepts.includes(PERCEPTS.SCREAM),
                safe: true,
                wumpusProb: 0,
                pitProb: 0,
            }
        }));

        // Perbarui basis pengetahuan untuk tetangga berdasarkan persepsi
        const neighbors = getNeighbors(r, c);
        neighbors.forEach(n => {
            const neighborKey = `${n.r},${n.c}`;
            if (!visitedCells.has(neighborKey)) {
                setKnowledgeBase(prevKb => {
                    const updatedKb = { ...prevKb };
                    if (!updatedKb[neighborKey]) {
                        updatedKb[neighborKey] = { visited: false, stench: false, breeze: false, glitter: false, scream: false, safe: false, wumpusProb: 0.2, pitProb: 0.2 };
                    }

                    if (currentPercepts.includes(PERCEPTS.STENCH)) {
                        updatedKb[neighborKey].wumpusProb = Math.min(1, updatedKb[neighborKey].wumpusProb + 0.3);
                    } else {
                        updatedKb[neighborKey].wumpusProb = Math.max(0, updatedKb[neighborKey].wumpusProb - 0.1);
                    }

                    if (currentPercepts.includes(PERCEPTS.BREEZE)) {
                        updatedKb[neighborKey].pitProb = Math.min(1, updatedKb[neighborKey].pitProb + 0.3);
                    } else {
                        updatedKb[neighborKey].pitProb = Math.max(0, updatedKb[neighborKey].pitProb - 0.1);
                    }

                    if (!currentPercepts.includes(PERCEPTS.STENCH) && !currentPercepts.includes(PERCEPTS.BREEZE)) {
                        updatedKb[neighborKey].safe = true;
                        updatedKb[neighborKey].wumpusProb = 0;
                        updatedKb[neighborKey].pitProb = 0;
                    }

                    return updatedKb;
                });
            }
        });

        // Periksa kondisi game over
        const currentCellContent = board[r][c];
        if (currentCellContent === CELL_TYPES.WUMPUS && wumpusAlive) {
            setFeedback('Anda dimakan Wumpus! Game Over. 💀');
            setGameOver(true);
        } else if (currentCellContent === CELL_TYPES.PIT) {
            setFeedback('Anda jatuh ke dalam lubang! Game Over. 🕳️');
            setGameOver(true);
        } else if (currentCellContent === CELL_TYPES.GOLD && agentHasGold && r === BOARD_SIZE - 1 && c === 0) {
            setFeedback('Anda berhasil keluar dengan emas! Anda menang! 🏆');
            setGameOver(true);
            setGameWon(true);
        } else {
            if (aiMode === AI_MODES.MANUAL) {
                setFeedback('Lanjutkan. Cari emas atau jalan keluar.');
            }
        }
    }, [board, wumpusAlive, agentHasGold, visitedCells, getPerceptsAt, getNeighbors, aiMode]);

    // BFS untuk menemukan jalur aman yang belum dikunjungi
    const findSafePathBFS = useCallback(() => {
        const queue = [{ r: agentPos.r, c: agentPos.c, path: [] }];
        const visited = new Set([`${agentPos.r},${agentPos.c}`]);

        while (queue.length > 0) {
            const { r, c, path } = queue.shift();

            if (board[r][c] === CELL_TYPES.GOLD && !agentHasGold) {
                return path;
            }
            if (agentHasGold && r === BOARD_SIZE - 1 && c === 0) {
                return path;
            }

            const neighbors = getNeighbors(r, c);
            for (const neighbor of neighbors) {
                const neighborKey = `${neighbor.r},${neighbor.c}`;
                if (!visited.has(neighborKey)) {
                    const kbEntry = knowledgeBase[neighborKey];
                    const isSafe = kbEntry ? kbEntry.safe && kbEntry.wumpusProb < 0.5 && kbEntry.pitProb < 0.5 : true;
                    const isTarget = (board[neighbor.r][neighbor.c] === CELL_TYPES.GOLD && !agentHasGold) || (agentHasGold && neighbor.r === BOARD_SIZE - 1 && neighbor.c === 0);

                    if (isSafe || isTarget) {
                        visited.add(neighborKey);
                        queue.push({ r: neighbor.r, c: neighbor.c, path: [...path, neighbor] });
                    }
                }
            }
        }
        return [];
    }, [agentPos, board, getNeighbors, knowledgeBase, agentHasGold, visitedCells]); // Added visitedCells to dependencies

    // DFS untuk menemukan jalur aman yang belum dikunjungi
    const findSafePathDFS = useCallback(() => {
        const stack = [{ r: agentPos.r, c: agentPos.c, path: [] }];
        const visited = new Set([`${agentPos.r},${agentPos.c}`]);

        while (stack.length > 0) {
            const { r, c, path } = stack.pop();

            if (board[r][c] === CELL_TYPES.GOLD && !agentHasGold) {
                return path;
            }
            if (agentHasGold && r === BOARD_SIZE - 1 && c === 0) {
                return path;
            }

            const neighbors = getNeighbors(r, c);
            shuffleArray(neighbors); // Shuffle for variation in DFS
            for (const neighbor of neighbors) {
                const neighborKey = `${neighbor.r},${neighbor.c}`;
                if (!visited.has(neighborKey)) {
                    const kbEntry = knowledgeBase[neighborKey];
                    const isSafe = kbEntry ? kbEntry.safe && kbEntry.wumpusProb < 0.5 && kbEntry.pitProb < 0.5 : true;
                    const isTarget = (board[neighbor.r][neighbor.c] === CELL_TYPES.GOLD && !agentHasGold) || (agentHasGold && neighbor.r === BOARD_SIZE - 1 && neighbor.c === 0);

                    if (isSafe || isTarget) {
                        visited.add(neighborKey);
                        stack.push({ r: neighbor.r, c: neighbor.c, path: [...path, neighbor] });
                    }
                }
            }
        }
        return [];
    }, [agentPos, board, getNeighbors, knowledgeBase, agentHasGold, visitedCells]); // Added visitedCells to dependencies

    // UCS (Uniform Cost Search) untuk menemukan jalur aman terpendek
    const findSafePathUCS = useCallback(() => {
        const priorityQueue = [{ cost: 0, r: agentPos.r, c: agentPos.c, path: [] }];
        const visitedCosts = new Map();

        visitedCosts.set(`${agentPos.r},${agentPos.c}`, 0);

        while (priorityQueue.length > 0) {
            priorityQueue.sort((a, b) => a.cost - b.cost);
            const { cost, r, c, path } = priorityQueue.shift();

            if (cost > (visitedCosts.get(`${r},${c}`) || Infinity)) {
                continue;
            }

            if (board[r][c] === CELL_TYPES.GOLD && !agentHasGold) {
                return path;
            }
            if (agentHasGold && r === BOARD_SIZE - 1 && c === 0) {
                return path;
            }

            const neighbors = getNeighbors(r, c);
            for (const neighbor of neighbors) {
                const neighborKey = `${neighbor.r},${neighbor.c}`;
                const newCost = cost + 1;

                const kbEntry = knowledgeBase[neighborKey];
                const isSafe = kbEntry ? kbEntry.safe && kbEntry.wumpusProb < 0.5 && kbEntry.pitProb < 0.5 : true;
                const isTarget = (board[neighbor.r][neighbor.c] === CELL_TYPES.GOLD && !agentHasGold) || (agentHasGold && neighbor.r === BOARD_SIZE - 1 && neighbor.c === 0);

                if ((isSafe || isTarget) && newCost < (visitedCosts.get(neighborKey) || Infinity)) {
                    visitedCosts.set(neighborKey, newCost);
                    priorityQueue.push({ cost: newCost, r: neighbor.r, c: neighbor.c, path: [...path, neighbor] });
                }
            }
        }
        return [];
    }, [agentPos, board, getNeighbors, knowledgeBase, agentHasGold, visitedCells]); // Added visitedCells to dependencies

    const runAITurn = useCallback(() => {
        if (agentHasGold && agentPos.r === BOARD_SIZE - 1 && agentPos.c === 0) {
            handleAction(AGENT_ACTIONS.CLIMB);
            return;
        }

        let nextMove = null;
        let actionTaken = false;

        if (percepts.includes(PERCEPTS.GLITTER) && !agentHasGold) {
            handleAction(AGENT_ACTIONS.GRAB);
            actionTaken = true;
            setFeedback('AI: Mengambil emas!');
        } else if (percepts.includes(PERCEPTS.STENCH) && agentHasArrow && wumpusAlive) {
            let targetR = -1, targetC = -1;
            const neighbors = getNeighbors(agentPos.r, agentPos.c);
            for (const neighbor of neighbors) {
                const kbEntry = knowledgeBase[`${neighbor.r},${neighbor.c}`];
                if (kbEntry && kbEntry.wumpusProb > 0.7) {
                    targetR = neighbor.r;
                    targetC = neighbor.c;
                    break;
                }
            }
            if (targetR !== -1) {
                handleAction(AGENT_ACTIONS.SHOOT);
                actionTaken = true;
                setFeedback('AI: Menembak Wumpus!');
            }
        }

        if (!actionTaken) {
            let path = [];
            switch (aiMode) {
                case AI_MODES.BFS_SEARCH:
                    path = findSafePathBFS();
                    break;
                case AI_MODES.DFS_SEARCH:
                    path = findSafePathDFS();
                    break;
                case AI_MODES.UCS_SEARCH:
                    path = findSafePathUCS();
                    break;
                case AI_MODES.REASONING_AGENT:
                case AI_MODES.PROBABILISTIC_AGENT:
                    path = findSafePathUCS();
                    break;
                default:
                    path = findSafePathBFS();
            }

            if (path.length > 0) {
                nextMove = path[0];
                setAiPath(path);
                moveAgent(nextMove.r, nextMove.c);
                actionTaken = true;
                setFeedback(`AI: Bergerak ke (${nextMove.r}, ${nextMove.c}).`);
            }
        }

        if (!actionTaken) {
            const unvisitedNeighbors = getNeighbors(agentPos.r, agentPos.c).filter(n => !visitedCells.has(`${n.r},${n.c}`));
            let bestRiskyMove = null;
            let lowestRisk = Infinity;

            for (const neighbor of unvisitedNeighbors) {
                const kbEntry = knowledgeBase[`${neighbor.r},${neighbor.c}`];
                const totalRisk = (kbEntry?.wumpusProb || 0) + (kbEntry?.pitProb || 0);
                if (board[neighbor.r][neighbor.c] === CELL_TYPES.WUMPUS || board[neighbor.r][neighbor.c] === CELL_TYPES.PIT) {
                    continue;
                }

                if (totalRisk < lowestRisk) {
                    lowestRisk = totalRisk;
                    bestRiskyMove = neighbor;
                }
            }

            if (bestRiskyMove && lowestRisk < 0.7) {
                setAiPath([bestRiskyMove]);
                moveAgent(bestRiskyMove.r, bestRiskyMove.c);
                actionTaken = true;
                setFeedback(`AI: Mengambil risiko kecil ke (${bestRiskyMove.r}, ${bestRiskyMove.c}).`);
            }
        }

        if (!actionTaken && agentPos.r === BOARD_SIZE - 1 && agentPos.c === 0) {
            handleAction(AGENT_ACTIONS.CLIMB);
            actionTaken = true;
            setFeedback('AI: Mencoba keluar dari pintu masuk.');
        }

        if (!actionTaken) {
            setFeedback('AI: Tidak dapat menemukan langkah yang aman atau optimal. Mungkin terjebak atau perlu strategi baru.');
        }

    }, [agentHasGold, agentPos, handleAction, percepts, agentHasArrow, wumpusAlive, getNeighbors, knowledgeBase, findSafePathBFS, findSafePathDFS, findSafePathUCS, moveAgent, visitedCells, aiMode, board]); // Added board to dependencies

    // --- Fungsi Render ---

    const renderCellContent = (r, c) => {
        const cellContent = board[r][c];
        const isVisited = visitedCells.has(`${r},${c}`);
        const isAgent = agentPos.r === r && agentPos.c === c;
        const kbEntry = knowledgeBase[`${r},${c}`];

        let icon = null;
        let tooltip = '';

        if (isAgent) {
            icon = <i className={`fas fa-robot ${styles.agentIcon}`}></i>;
            tooltip = 'Agent (Kamu)';
        } else if (isVisited) {
            if (cellContent === CELL_TYPES.WUMPUS && wumpusAlive) {
                icon = <i className={`fas fa-skull-crossbones ${styles.wumpusIcon}`}></i>;
                tooltip = 'Wumpus!';
            } else if (cellContent === CELL_TYPES.PIT) {
                icon = <i className={`fas fa-hole-in-one ${styles.pitIcon}`}></i>;
                tooltip = 'Lubang!';
            } else if (cellContent === CELL_TYPES.GOLD && !agentHasGold) {
                icon = <i className={`fas fa-gem ${styles.goldIcon}`}></i>;
                tooltip = 'Emas!';
            } else if (cellContent === CELL_TYPES.START) {
                icon = <i className={`fas fa-door-open ${styles.startIcon}`}></i>;
                tooltip = 'Pintu Masuk';
            } else if (cellContent === CELL_TYPES.EMPTY || (cellContent === CELL_TYPES.WUMPUS && !wumpusAlive)) {
                icon = null;
                tooltip = 'Kosong';
            }
        } else {
            if (kbEntry) {
                if (kbEntry.wumpusProb > 0.5 && kbEntry.pitProb > 0.5) {
                    icon = <i className={`fas fa-question ${styles.uncertainIcon}`}></i>;
                    tooltip = `Kemungkinan Wumpus & Lubang (${(kbEntry.wumpusProb * 100).toFixed(0)}% W, ${(kbEntry.pitProb * 100).toFixed(0)}% P)`;
                } else if (kbEntry.wumpusProb > 0.5) {
                    icon = <i className={`fas fa-exclamation-triangle ${styles.wumpusProbIcon}`}></i>;
                    tooltip = `Kemungkinan Wumpus (${(kbEntry.wumpusProb * 100).toFixed(0)}%)`;
                } else if (kbEntry.pitProb > 0.5) {
                    icon = <i className={`fas fa-exclamation-circle ${styles.pitProbIcon}`}></i>;
                    tooltip = `Kemungkinan Lubang (${(kbEntry.pitProb * 100).toFixed(0)}%)`;
                } else if (kbEntry.safe) {
                    icon = <i className={`fas fa-check ${styles.safeIcon}`}></i>;
                    tooltip = 'Dianggap Aman';
                }
            }
        }

        const currentPerceptIcons = [];
        if (isAgent) {
            if (percepts.includes(PERCEPTS.STENCH)) currentPerceptIcons.push(<i key="stench" className={`fas fa-wind ${styles.perceptStenchIcon}`} title="Bau Wumpus"></i>);
            if (percepts.includes(PERCEPTS.BREEZE)) currentPerceptIcons.push(<i key="breeze" className={`fas fa-fan ${styles.perceptBreezeIcon}`} title="Angin dari Lubang"></i>);
            if (percepts.includes(PERCEPTS.GLITTER)) currentPerceptIcons.push(<i key="glitter" className={`fas fa-star ${styles.perceptGlitterIcon}`} title="Kilauan Emas"></i>);
            if (percepts.includes(PERCEPTS.SCREAM) && !wumpusAlive) currentPerceptIcons.push(<i key="scream" className={`fas fa-volume-up ${styles.perceptScreamIcon}`} title="Wumpus Mati"></i>);
        }

        return (
            <div className={styles.cellContentWrapper}>
                {icon}
                <div className={styles.perceptIconsContainer}>
                    {currentPerceptIcons}
                </div>
                {aiPath.some(p => p.r === r && p.c === c) && !isAgent && (
                    <div className={styles.aiPathDot}>
                        <div className={styles.aiPathDotInner}></div>
                    </div>
                )}
                {/* Tooltip visibility is handled by CSS :hover on .group */}
                {tooltip && <span className={styles.cellTooltip}>{tooltip}</span>}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            {/* Menggunakan komponen Header yang diimpor */}
            <Header /> 

            <div className={styles.contentArea}>
                <h1 className={styles.pageTitle}>Wumpus World Deluxe 🏰</h1>
                <p className={styles.gameInfo}>
                    {gameOver ? (gameWon ? 'Game Selesai: Anda Menang! 🎉' : 'Game Selesai: Game Over! 💀') : 'Temukan Emas, Hindari Wumpus & Lubang!'}
                </p>

                {/* Game Board */}
                <div className={styles.board} style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`, gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)` }}>
                    {board.map((row, rIdx) => (
                        <React.Fragment key={rIdx}>
                            {row.map((cell, cIdx) => {
                                const isLightSquare = (rIdx + cIdx) % 2 === 0;
                                const isVisited = visitedCells.has(`${rIdx},${cIdx}`);
                                const isAgent = agentPos.r === rIdx && agentPos.c === cIdx;

                                let cellClasses = `${styles.cell} ${styles.group}`;

                                if (isLightSquare) cellClasses += ` ${styles.lightSquare}`;
                                else cellClasses += ` ${styles.darkSquare}`;

                                if (isVisited) cellClasses += ` ${styles.visitedCell}`;
                                if (isAgent) cellClasses += ` ${styles.agentCell}`;

                                return (
                                    <div
                                        key={`${rIdx}-${cIdx}`}
                                        className={cellClasses}
                                        onClick={() => aiMode === AI_MODES.MANUAL && moveAgent(rIdx, cIdx)}
                                    >
                                        {renderCellContent(rIdx, cIdx)}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>

                {/* Feedback dan Status Agen */}
                <div className={styles.agentStatusBox}>
                    <p className={styles.agentStatusTitle}>Status Agen:</p>
                    <p className={styles.agentStatusText}>Posisi: ({agentPos.r}, {agentPos.c})</p>
                    <p className={styles.agentStatusText}>Emas: {agentHasGold ? '✅ Ada' : '❌ Tidak Ada'}</p>
                    <p className={styles.agentStatusText}>Panah: {agentHasArrow ? '✅ Ada' : '❌ Tidak Ada'}</p>
                    <p className={styles.agentStatusText}>Wumpus: {wumpusAlive ? '✅ Hidup' : '❌ Mati'}</p>
                    <p className={styles.agentStatusText}>Persepsi Saat Ini: {percepts.length > 0 ? percepts.join(', ') : 'Tidak ada'}</p>
                    <p className={styles.feedbackMessage} style={{ color: gameOver ? (gameWon ? '#32CD32' : '#FF4500') : '#fff' }}>
                        {feedback}
                    </p>
                </div>

                {/* Tombol Kontrol */}
                <div className={styles.buttonGroup}>
                    <button
                        onClick={() => initializeGame()}
                        className={`${styles.button} ${styles.buttonPrimary}`}
                    >
                        Game Baru 🆕
                    </button>

                    <div className={styles.selectContainer}>
                        <select
                            value={aiMode}
                            onChange={(e) => setAiMode(e.target.value)}
                            className={`${styles.button} ${styles.buttonSecondary} ${styles.aiModeSelect}`}
                            disabled={gameOver || aiThinking}
                        >
                            <option value={AI_MODES.MANUAL}>Mode Manual</option>
                            <option value={AI_MODES.BFS_SEARCH}>AI: Pencarian BFS</option>
                            <option value={AI_MODES.DFS_SEARCH}>AI: Pencarian DFS</option>
                            <option value={AI_MODES.UCS_SEARCH}>AI: Pencarian UCS</option>
                            <option value={AI_MODES.REASONING_AGENT}>AI: Agen Penalaran</option>
                            <option value={AI_MODES.PROBABILISTIC_AGENT}>AI: Agen Probabilistik</option>
                        </select>
                        <div className={styles.selectArrow}>
                            <svg className={styles.selectArrowIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                        {aiThinking && <i className={`fas fa-spinner fa-spin ${styles.aiThinkingSpinner}`}></i>}
                    </div>


                    {aiMode === AI_MODES.MANUAL && (
                        <>
                            <button
                                onClick={() => moveAgent(agentPos.r - 1, agentPos.c)}
                                className={`${styles.button} ${styles.buttonMove}`}
                            >
                                Atas ⬆️
                            </button>
                            <button
                                onClick={() => moveAgent(agentPos.r + 1, agentPos.c)}
                                className={`${styles.button} ${styles.buttonMove}`}
                            >
                                Bawah ⬇️
                            </button>
                            <button
                                onClick={() => moveAgent(agentPos.r, agentPos.c - 1)}
                                className={`${styles.button} ${styles.buttonMove}`}
                            >
                                Kiri ⬅️
                            </button>
                            <button
                                onClick={() => moveAgent(agentPos.r, agentPos.c + 1)}
                                className={`${styles.button} ${styles.buttonMove}`}
                            >
                                Kanan ➡️
                            </button>
                            <button
                                onClick={() => handleAction(AGENT_ACTIONS.GRAB)}
                                className={`${styles.button} ${styles.buttonGrab}`}
                            >
                                Ambil Emas 💰
                            </button>
                            <button
                                onClick={() => handleAction(AGENT_ACTIONS.SHOOT)}
                                className={`${styles.button} ${styles.buttonShoot}`}
                            >
                                Tembak 🏹
                            </button>
                            <button
                                onClick={() => handleAction(AGENT_ACTIONS.CLIMB)}
                                className={`${styles.button} ${styles.buttonClimb}`}
                            >
                                Memanjat 🪜
                            </button>
                        </>
                    )}
                </div>

                {/* Wawasan Lab AI / Visualisasi */}
                <div className={styles.aiLabInsights}>
                    <h2 className={styles.aiLabTitle}>Wawasan Lab AI 🧪</h2>
                    <p className={styles.aiLabText}>Peta Keyakinan (Probabilitas Wumpus/Lubang):</p>
                    <div className={styles.beliefMapGrid} style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}>
                        {Array.from({ length: BOARD_SIZE }).map((_, rIdx) => (
                            Array.from({ length: BOARD_SIZE }).map((_, cIdx) => {
                                const key = `${rIdx},${cIdx}`;
                                const kbEntry = knowledgeBase[key];
                                const wumpusProb = kbEntry?.wumpusProb || 0;
                                const pitProb = kbEntry?.pitProb || 0;
                                const isVisited = visitedCells.has(key);

                                let cellColorClass = styles.beliefMapCellDefault;
                                if (isVisited) {
                                    cellColorClass = styles.beliefMapCellVisited;
                                } else if (wumpusProb > 0.5 && pitProb > 0.5) {
                                    cellColorClass = styles.beliefMapCellBothRisk;
                                } else if (wumpusProb > 0.5) {
                                    cellColorClass = styles.beliefMapCellWumpusRisk;
                                } else if (pitProb > 0.5) {
                                    cellColorClass = styles.beliefMapCellPitRisk;
                                } else if (kbEntry?.safe) {
                                    cellColorClass = styles.beliefMapCellSafe;
                                }

                                return (
                                    <div key={key} className={`${styles.beliefMapCell} ${cellColorClass}`}>
                                        <span className={styles.beliefMapCellCoords}>({rIdx},{cIdx})</span>
                                        {!isVisited && (
                                            <>
                                                <span className={styles.beliefMapWumpusProb}>W: {(wumpusProb * 100).toFixed(0)}%</span>
                                                <span className={styles.beliefMapPitProb}>P: {(pitProb * 100).toFixed(0)}%</span>
                                            </>
                                        )}
                                    </div>
                                );
                            })
                        ))}
                    </div>
                    <p className={styles.aiLabText}>Penjelasan AI (Sederhana):</p>
                    <ul className={styles.aiExplanationList}>
                        <li>Agen memprioritaskan mengambil emas, lalu menembak Wumpus (jika bau dan panah tersedia).</li>
                        <li>Agen mencoba menemukan jalur aman ke sel yang belum dikunjungi atau emas menggunakan algoritma pencarian yang dipilih (BFS/DFS/UCS).</li>
                        <li>Jika tidak ada jalur aman, agen mungkin mengambil risiko kecil ke sel dengan probabilitas bahaya terendah.</li>
                        <li>Peta keyakinan menunjukkan probabilitas Wumpus/Pit berdasarkan persepsi dan sel yang dikunjungi.</li>
                        <li className={styles.aiExplanationNote}>
                            **Catatan tentang Fitur AI Lanjutan:**
                        </li>
                        <li className={styles.aiExplanationSubItem}>
                            **Penalaran Proposisional:** Implementasi saat ini menggunakan pembaruan probabilistik sederhana. Sistem penalaran proposisional penuh akan melibatkan basis pengetahuan formal (misalnya, Prolog-like) dan mesin inferensi untuk menyimpulkan fakta baru (misalnya, "Jika ada bau di (X,Y) dan tidak ada Wumpus di (X-1,Y), maka Wumpus mungkin di (X+1,Y)"). Ini adalah fitur kompleks yang dapat ditambahkan.
                        </li>
                        <li className={styles.aiExplanationSubItem}>
                            **Multi-Agen:** Untuk simulasi multi-agen tanpa backend, Anda perlu mengelola beberapa objek agen (posisi, status, basis pengetahuan terpisah) dan logika giliran/koordinasi di sisi klien. Untuk interaksi multi-pengguna sejati, backend dan database (seperti Firestore) akan diperlukan.
                        </li>
                    </ul>
                </div>

                <button
                    onClick={() => navigate('/dashboard')}
                    className={`${styles.button} ${styles.buttonGoToDashboard}`}
                >
                    Kembali ke Dashboard 🏠
                </button>
            </div>
        </div>
    );
};

export default WumpusWorldPage;
