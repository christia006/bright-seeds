import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header/Header';
import styles from './PathFinderPage.module.css'; // Perhatikan ini harusnya PathFinderPage.module.css
import ConfettiExplosion from 'react-confetti-explosion';
import { useNavigate } from 'react-router-dom';

// Helper function untuk mendapatkan elemen acak dari array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper function untuk mengacak array (tidak digunakan langsung di sini, tapi baik untuk utilitas umum)
const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
};

// Fungsi BFS untuk mencari jalur terpendek (tetap sama, ini inti logikanya)
const findShortestPathBFS = (grid, start, end) => {
    const rows = grid.length;
    const cols = grid[0].length;
    const queue = [[start]]; // Queue stores paths, not just cells
    const visited = new Set();
    visited.add(`${start[0]},${start[1]}`);

    const directions = [
        [-1, 0], // Up
        [1, 0],  // Down
        [0, -1], // Left
        [0, 1]   // Right
    ];

    while (queue.length > 0) {
        const currentPath = queue.shift();
        const [r, c] = currentPath[currentPath.length - 1];

        if (r === end[0] && c === end[1]) {
            return currentPath;
        }

        for (const [dr, dc] of directions) {
            const nr = r + dr;
            const nc = c + dc;

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== 1) { // Not a wall
                const nextCellKey = `${nr},${nc}`;
                if (!visited.has(nextCellKey)) {
                    visited.add(nextCellKey);
                    const newPath = [...currentPath, [nr, nc]];
                    queue.push(newPath);
                }
            }
        }
    }
    return null; // No path found
};

// --- 40 Soal Labirin yang Rumit dan Menjebak (Tetap sama) ---
const MAZES = [
    // Level 1-5: 5x5, sederhana
    { id: 1, grid: [
        ['A',0,0,0,0],
        [0,1,1,1,0],
        [0,1,0,0,0],
        [0,0,0,1,0],
        [0,1,1,1,'B']
    ], start: [0,0], end: [4,4] },
    { id: 2, grid: [
        [0,0,0,0,'B'],
        [0,1,1,0,0],
        [0,1,0,0,0],
        [0,1,0,1,0],
        ['A',0,0,1,0]
    ], start: [4,0], end: [0,4] },
    { id: 3, grid: [
        ['A',0,1,0,0],
        [0,0,1,0,0],
        [0,1,1,0,0],
        [0,0,0,0,0],
        [1,0,1,0,'B']
    ], start: [0,0], end: [4,4] },
    { id: 4, grid: [
        [0,0,0,0,0],
        [1,1,1,0,0],
        ['A',0,0,0,0],
        [1,1,1,0,1],
        [0,0,0,0,'B']
    ], start: [2,0], end: [4,4] },
    { id: 5, grid: [
        [0,1,0,0,0],
        [0,1,0,1,0],
        [0,0,0,1,0],
        [1,1,0,1,0],
        ['A',0,0,0,'B']
    ], start: [4,0], end: [4,4] },

    // Level 6-15: 7x7, sedang
    { id: 6, grid: [
        ['A',0,0,1,0,0,0],
        [0,1,0,1,0,1,0],
        [0,1,0,0,0,1,0],
        [0,0,1,1,0,1,0],
        [0,1,0,0,0,1,0],
        [0,1,0,1,0,1,0],
        [0,0,0,1,0,0,'B']
    ], start: [0,0], end: [6,6] },
    { id: 7, grid: [
        [0,0,0,0,0,0,0],
        [0,1,1,1,1,1,0],
        [0,1,0,0,0,1,0],
        [0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0],
        ['A',0,0,1,0,0,'B']
    ], start: [6,0], end: [6,6] },
    { id: 8, grid: [
        [0,1,0,0,0,0,0],
        [0,1,0,1,1,1,0],
        [0,0,0,0,0,1,0],
        [1,1,1,1,0,1,0],
        [0,0,0,1,0,1,0],
        [0,1,0,1,0,1,0],
        ['A',0,0,0,0,0,'B']
    ], start: [6,0], end: [6,6] },
    { id: 9, grid: [
        ['A',0,0,0,0,0,0],
        [0,1,1,1,1,1,0],
        [0,0,0,0,0,1,0],
        [1,1,1,0,0,1,0],
        [0,0,0,0,0,1,0],
        [0,1,1,1,1,1,0],
        [0,0,0,0,0,0,'B']
    ], start: [0,0], end: [6,6] },
    { id: 10, grid: [
        [0,0,0,0,0,0,0],
        [0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0],
        ['A',0,0,0,0,0,'B']
    ], start: [6,0], end: [6,6] },
    { id: 11, grid: [
        ['A',0,0,0,0,0,0],
        [0,1,1,1,1,1,0],
        [0,0,0,0,0,1,0],
        [1,1,1,0,0,1,0],
        [0,0,0,0,0,1,0],
        [0,1,1,1,1,1,0],
        [0,0,0,0,0,0,'B']
    ], start: [0,0], end: [6,6] },
    { id: 12, grid: [
        [0,0,0,0,0,0,0],
        [0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0],
        ['A',0,0,0,0,0,'B']
    ], start: [6,0], end: [6,6] },
    { id: 13, grid: [
        ['A',0,0,0,0,0,0],
        [0,1,1,1,1,1,0],
        [0,0,0,0,0,1,0],
        [1,1,1,0,0,1,0],
        [0,0,0,0,0,1,0],
        [0,1,1,1,1,1,0],
        [0,0,0,0,0,0,'B']
    ], start: [0,0], end: [6,6] },
    { id: 14, grid: [
        [0,0,0,0,0,0,0],
        [0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0],
        ['A',0,0,0,0,0,'B']
    ], start: [6,0], end: [6,6] },
    { id: 15, grid: [
        ['A',0,0,0,0,0,0],
        [0,1,1,1,1,1,0],
        [0,0,0,0,0,1,0],
        [1,1,1,0,0,1,0],
        [0,0,0,0,0,1,0],
        [0,1,1,1,1,1,0],
        [0,0,0,0,0,0,'B']
    ], start: [0,0], end: [6,6] },

    // Level 16-25: 9x9, sulit
    { id: 16, grid: [
        ['A',0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,1,0],
        [1,1,1,1,1,0,0,1,0],
        [0,0,0,0,1,0,0,1,0],
        [0,1,1,0,1,0,1,1,0],
        [0,1,0,0,1,0,0,0,0],
        [0,1,0,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,'B']
    ], start: [0,0], end: [8,8] },
    { id: 17, grid: [
        [0,0,0,0,0,0,0,0,'B'],
        [0,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,1,0],
        [1,1,1,1,1,0,0,1,0],
        [0,0,0,0,1,0,0,1,0],
        [0,1,1,0,1,0,1,1,0],
        [0,1,0,0,1,0,0,0,0],
        [0,1,0,1,1,1,1,1,0],
        ['A',0,0,0,0,0,0,0,0]
    ], start: [8,0], end: [0,8] },
    { id: 18, grid: [
        ['A',0,1,0,0,0,0,0,0],
        [0,0,1,0,1,1,1,1,0],
        [0,1,1,0,0,0,0,1,0],
        [0,1,0,0,1,1,0,1,0],
        [0,1,0,1,1,0,0,1,0],
        [0,1,0,0,0,0,1,1,0],
        [0,1,0,1,1,0,0,0,0],
        [0,1,0,1,0,0,1,1,0],
        [0,0,0,0,0,0,0,0,'B']
    ], start: [0,0], end: [8,8] },
    { id: 19, grid: [
        [0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,1,0],
        [1,1,1,1,1,0,0,1,0],
        [0,0,0,0,1,0,0,1,0],
        [0,1,1,0,1,0,1,1,0],
        [0,1,0,0,1,0,0,0,0],
        [0,1,0,1,1,1,1,1,0],
        ['A',0,0,0,0,0,0,0,'B']
    ], start: [8,0], end: [8,8] },
    { id: 20, grid: [
        ['A',0,0,0,0,0,0,0,0],
        [0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        [0,0,0,0,0,0,0,0,'B']
    ], start: [0,0], end: [8,8] },
    { id: 21, grid: [
        [0,0,0,0,0,0,0,0,0],
        [0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        ['A',0,0,0,0,0,0,0,'B']
    ], start: [8,0], end: [8,8] },
    { id: 22, grid: [
        ['A',0,0,0,0,0,0,0,0],
        [0,1,1,1,0,1,1,1,0],
        [0,0,0,1,0,1,0,1,0],
        [1,1,0,1,0,1,0,1,0],
        [0,0,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        [0,0,0,0,0,0,0,0,'B']
    ], start: [0,0], end: [8,8] },
    { id: 23, grid: [
        [0,0,0,0,0,0,0,0,0],
        [0,1,1,1,0,1,1,1,0],
        [0,0,0,1,0,1,0,1,0],
        [1,1,0,1,0,1,0,1,0],
        [0,0,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        ['A',0,0,0,0,0,0,0,'B']
    ], start: [8,0], end: [8,8] },
    { id: 24, grid: [
        ['A',0,0,0,0,0,0,0,0],
        [0,1,0,1,0,1,0,1,0],
        [0,0,0,1,0,1,0,1,0],
        [1,1,0,1,0,1,0,1,0],
        [0,0,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        [0,0,0,0,0,0,0,0,'B']
    ], start: [0,0], end: [8,8] },
    { id: 25, grid: [
        [0,0,0,0,0,0,0,0,0],
        [0,1,0,1,0,1,0,1,0],
        [0,0,0,1,0,1,0,1,0],
        [1,1,0,1,0,1,0,1,0],
        [0,0,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0],
        ['A',0,0,0,0,0,0,0,'B']
    ], start: [8,0], end: [8,8] },

    // Level 26-40: 11x11, sangat sulit dan menjebak
    { id: 26, grid: [
        ['A',0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,1,0],
        [1,1,1,1,1,1,1,0,0,1,0],
        [0,0,0,0,0,0,1,0,0,1,0],
        [0,1,1,1,1,0,1,0,1,1,0],
        [0,1,0,0,0,0,1,0,0,1,0],
        [0,1,0,1,1,1,1,1,0,1,0],
        [0,1,0,0,0,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0,'B']
    ], start: [0,0], end: [10,10] },
    { id: 27, grid: [
        [0,0,0,0,0,0,0,0,0,0,'B'],
        [0,1,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,1,0],
        [1,1,1,1,1,1,1,0,0,1,0],
        [0,0,0,0,0,0,1,0,0,1,0],
        [0,1,1,1,1,0,1,0,1,1,0],
        [0,1,0,0,0,0,1,0,0,1,0],
        [0,1,0,1,1,1,1,1,0,1,0],
        [0,1,0,0,0,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,1,1,1,0],
        ['A',0,0,0,0,0,0,0,0,0,0]
    ], start: [10,0], end: [0,10] },
    { id: 28, grid: [
        ['A',0,1,0,0,0,0,0,0,0,0],
        [0,0,1,0,1,1,1,1,1,1,0],
        [0,1,1,0,0,0,0,0,0,1,0],
        [0,1,0,0,1,1,1,0,0,1,0],
        [0,1,0,1,1,0,1,0,0,1,0],
        [0,1,0,0,0,0,1,0,1,1,0],
        [0,1,0,1,1,0,1,0,0,1,0],
        [0,1,0,1,0,0,1,1,0,1,0],
        [0,1,0,1,0,1,0,0,0,1,0],
        [0,1,0,1,0,1,1,1,0,1,0],
        [0,0,0,0,0,0,0,0,0,0,'B']
    ], start: [0,0], end: [10,10] },
    { id: 29, grid: [
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,1,0],
        [1,1,1,1,1,1,1,0,0,1,0],
        [0,0,0,0,0,0,1,0,0,1,0],
        [0,1,1,1,1,0,1,0,1,1,0],
        [0,1,0,0,0,0,1,0,0,1,0],
        [0,1,0,1,1,1,1,1,0,1,0],
        [0,1,0,0,0,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,1,1,1,0],
        ['A',0,0,0,0,0,0,0,0,0,'B']
    ], start: [10,0], end: [10,10] },
    { id: 30, grid: [
        ['A',0,0,0,0,0,0,0,0,0,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,0,0,0,0,0,0,0,0,0,'B']
    ], start: [0,0], end: [10,10] },
    { id: 31, grid: [
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        ['A',0,0,0,0,0,0,0,0,0,'B']
    ], start: [10,0], end: [10,10] },
    { id: 32, grid: [
        ['A',0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,0,1,1,1,1,1,0],
        [0,0,0,1,0,1,0,0,0,1,0],
        [1,1,0,1,0,1,0,1,0,1,0],
        [0,0,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,0,0,0,0,0,0,0,0,0,'B']
    ], start: [0,0], end: [10,10] },
    { id: 33, grid: [
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,0,1,1,1,1,1,0],
        [0,0,0,1,0,1,0,0,0,1,0],
        [1,1,0,1,0,1,0,1,0,1,0],
        [0,0,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        ['A',0,0,0,0,0,0,0,0,0,'B']
    ], start: [10,0], end: [10,10] },
    { id: 34, grid: [
        ['A',0,0,0,0,0,0,0,0,0,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,0,0,1,0,1,0,1,0,1,0],
        [1,1,0,1,0,1,0,1,0,1,0],
        [0,0,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,0,0,0,0,0,0,0,0,0,'B']
    ], start: [0,0], end: [10,10] },
    { id: 35, grid: [
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,0,0,1,0,1,0,1,0,1,0],
        [1,1,0,1,0,1,0,1,0,1,0],
        [0,0,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        ['A',0,0,0,0,0,0,0,0,0,'B']
    ], start: [10,0], end: [10,10] },
    { id: 36, grid: [
        ['A',0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,1,0],
        [1,1,1,1,1,1,1,0,0,1,0],
        [0,0,0,0,0,0,1,0,0,1,0],
        [0,1,1,1,1,0,1,0,1,1,0],
        [0,1,0,0,0,0,1,0,0,1,0],
        [0,1,0,1,1,1,1,1,0,1,0],
        [0,1,0,0,0,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,0,'B']
    ], start: [0,0], end: [10,10] },
    { id: 37, grid: [
        [0,0,0,0,0,0,0,0,0,0,'B'],
        [0,1,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,1,0],
        [1,1,1,1,1,1,1,0,0,1,0],
        [0,0,0,0,0,0,1,0,0,1,0],
        [0,1,1,1,1,0,1,0,1,1,0],
        [0,1,0,0,0,0,1,0,0,1,0],
        [0,1,0,1,1,1,1,1,0,1,0],
        [0,1,0,0,0,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,1,1,1,0],
        ['A',0,0,0,0,0,0,0,0,0,0]
    ], start: [10,0], end: [0,10] },
    { id: 38, grid: [
        ['A',0,1,0,0,0,0,0,0,0,0],
        [0,0,1,0,1,1,1,1,1,1,0],
        [0,1,1,0,0,0,0,0,0,1,0],
        [0,1,0,0,1,1,1,0,0,1,0],
        [0,1,0,1,1,0,1,0,0,1,0],
        [0,1,0,0,0,0,1,0,1,1,0],
        [0,1,0,1,1,0,1,0,0,1,0],
        [0,1,0,1,0,0,1,1,0,1,0],
        [0,1,0,1,0,1,0,0,0,1,0],
        [0,1,0,1,0,1,1,1,0,1,0],
        [0,0,0,0,0,0,0,0,0,0,'B']
    ], start: [0,0], end: [10,10] },
    { id: 39, grid: [
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,0],
        [0,0,0,0,0,0,0,0,0,1,0],
        [1,1,1,1,1,1,1,0,0,1,0],
        [0,0,0,0,0,0,1,0,0,1,0],
        [0,1,1,1,1,0,1,0,1,1,0],
        [0,1,0,0,0,0,1,0,0,1,0],
        [0,1,0,1,1,1,1,1,0,1,0],
        [0,1,0,0,0,0,0,0,0,1,0],
        [0,1,1,1,1,1,1,1,1,1,0],
        ['A',0,0,0,0,0,0,0,0,0,'B']
    ], start: [10,0], end: [10,10] },
    { id: 40, grid: [
        ['A',0,0,0,0,0,0,0,0,0,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1,0,1,0],
        [0,0,0,0,0,0,0,0,0,0,'B']
    ], start: [0,0], end: [10,10] }
    
];

const PathFinderPage = () => {
    const [currentMazeIndex, setCurrentMazeIndex] = useState(0);
    const [maze, setMaze] = useState([]);
    const [startPos, setStartPos] = useState(null);
    const [endPos, setEndPos] = useState(null);
    const [userPath, setUserPath] = useState([]);
    const [feedback, setFeedback] = useState('');
    const [feedbackColor, setFeedbackColor] = useState('');
    const [isExploding, setIsExploding] = useState(false);
    const [shortestPathSolution, setShortestPathSolution] = useState(null);
    const [showSolution, setShowSolution] = useState(false);
    const [hintCount, setHintCount] = useState(3); // Batasan bantuan: 3 kali

    const navigate = useNavigate();

    // Refs untuk suara
    const clickAudioRef = useRef(null);
    const correctSoundRef = useRef(null);
    const incorrectSoundRef = useRef(null);
    const backgroundMusicRef = useRef(null); // Ref baru untuk musik latar

    // Efek samping untuk inisialisasi suara
    useEffect(() => {
        if (!clickAudioRef.current) {
            clickAudioRef.current = new Audio('/sound/tombol.mp3');
            clickAudioRef.current.volume = 0.8;
        }
        if (!correctSoundRef.current) {
            correctSoundRef.current = new Audio('/sound/benar.mp3');
            correctSoundRef.current.volume = 1.0;
        }
        if (!incorrectSoundRef.current) {
            incorrectSoundRef.current = new Audio('/sound/salah.mp3');
            incorrectSoundRef.current.volume = 1.0;
        }
        // Inisialisasi musik latar
        if (!backgroundMusicRef.current) {
            backgroundMusicRef.current = new Audio('/sound/labirin.mp3'); // Path untuk musik latar
            backgroundMusicRef.current.loop = true; // Agar musik berulang
            backgroundMusicRef.current.volume = 0.3; // Sesuaikan volume agar tidak terlalu keras
        }

        // Memulai musik latar saat komponen dimuat
        const playBackgroundMusic = () => {
            if (backgroundMusicRef.current) {
                backgroundMusicRef.current.play().catch(e => console.error("Gagal memutar musik latar:", e));
            }
        };

        playBackgroundMusic();

        // Menghentikan musik saat komponen di-unmount
        return () => {
            if (backgroundMusicRef.current) {
                backgroundMusicRef.current.pause();
                backgroundMusicRef.current.currentTime = 0;
            }
        };
    }, []); // Array dependensi kosong agar hanya berjalan sekali saat mount

    // Fungsi untuk memutar suara klik
    const playClickSound = () => {
        if (clickAudioRef.current) {
            clickAudioRef.current.currentTime = 0;
            clickAudioRef.current.play().catch(e => console.error("Gagal memutar suara klik:", e));
        }
    };

    // Fungsi untuk memutar suara jawaban benar
    const playCorrectSound = () => {
        if (correctSoundRef.current) {
            correctSoundRef.current.currentTime = 0;
            correctSoundRef.current.play().catch(e => console.error("Gagal memutar suara benar:", e));
        }
    };

    // Fungsi untuk memutar suara jawaban salah
    const playIncorrectSound = () => {
        if (incorrectSoundRef.current) {
            incorrectSoundRef.current.currentTime = 0;
            incorrectSoundRef.current.play().catch(e => console.error("Gagal memutar suara salah:", e));
        }
    };

    useEffect(() => {
        loadNewMaze();
    }, [currentMazeIndex]);

    const loadNewMaze = () => {
        if (currentMazeIndex >= MAZES.length) {
            setFeedback('Selamat! Kamu sudah menyelesaikan semua labirin! 🎉');
            setFeedbackColor('purple');
            setMaze([]); // Bersihkan labirin
            setStartPos(null);
            setEndPos(null);
            return;
        }

        const currentMazeData = MAZES[currentMazeIndex];
        setMaze(JSON.parse(JSON.stringify(currentMazeData.grid))); // Deep copy
        setStartPos(currentMazeData.start);
        setEndPos(currentMazeData.end);
        setUserPath([]);
        setFeedback('');
        setFeedbackColor('');
        setIsExploding(false);
        setShowSolution(false);
        setShortestPathSolution(null);

        // Hitung jalur terpendek segera untuk validasi nanti
        const solution = findShortestPathBFS(currentMazeData.grid, currentMazeData.start, currentMazeData.end);
        setShortestPathSolution(solution);
    };

    const handleCellClick = (row, col) => {
        playClickSound(); // Play click sound on cell click
        if (showSolution) return; // Mencegah interaksi jika solusi ditampilkan

        const cellValue = maze[row][col];
        const clickedCell = [row, col];

        // Mulai jalur jika mengklik 'A'
        if (JSON.stringify(clickedCell) === JSON.stringify(startPos)) {
            setUserPath([clickedCell]);
            setFeedback('');
            setFeedbackColor('');
            return;
        }

        // Jika jalur kosong, harus dimulai dari 'A'
        if (userPath.length === 0) {
            setFeedback('Mulai dari titik A (hijau) dulu ya! 🟢');
            setFeedbackColor('orange');
            playIncorrectSound(); // Play incorrect sound
            return;
        }

        const lastCell = userPath[userPath.length - 1];
        const isAdjacent = (Math.abs(clickedCell[0] - lastCell[0]) + Math.abs(clickedCell[1] - lastCell[1])) === 1;

        if (isAdjacent && cellValue !== 1) { // Cek jika bersebelahan dan bukan tembok
            // Jika sudah di jalur, izinkan menghapus sel terakhir yang diklik (mundur)
            if (userPath.some(p => p[0] === row && p[1] === col)) {
                const lastIdx = userPath.findIndex(p => p[0] === row && p[1] === col);
                if (lastIdx === userPath.length - 1) { // Hanya hapus jika itu sel terakhir yang ditambahkan
                    setUserPath(prevPath => prevPath.slice(0, prevPath.length - 1));
                } else {
                    setFeedback('Kamu hanya bisa mundur satu langkah atau maju ke kotak yang bersebelahan! 🤔');
                    setFeedbackColor('red');
                    playIncorrectSound(); // Play incorrect sound
                }
            } else {
                setUserPath(prevPath => [...prevPath, clickedCell]);
            }
        } else if (cellValue === 1) {
            setFeedback('Itu tembok! Cari jalan lain ya! 🧱');
            setFeedbackColor('red');
            playIncorrectSound(); // Play incorrect sound
        } else {
            setFeedback('Kamu harus bergerak ke kotak yang bersebelahan! ➡️⬆️⬇️⬅️');
            setFeedbackColor('red');
            playIncorrectSound(); // Play incorrect sound
        }
    };

    const checkPath = () => {
        playClickSound(); // Play click sound on check path button
        if (userPath.length === 0) {
            setFeedback('Buat jalur dulu ya! 🤔');
            setFeedbackColor('orange');
            playIncorrectSound(); // Play incorrect sound
            return;
        }

        const lastCell = userPath[userPath.length - 1];
        if (JSON.stringify(lastCell) !== JSON.stringify(endPos)) {
            setFeedback('Jalurmu belum sampai ke titik B (merah)! 🔴');
            setFeedbackColor('red');
            playIncorrectSound(); // Play incorrect sound
            return;
        }

        // Validasi jika semua langkah valid (tidak melalui tembok atau tidak bersebelahan)
        for (let i = 0; i < userPath.length - 1; i++) {
            const [r1, c1] = userPath[i];
            const [r2, c2] = userPath[i+1];
            const isAdjacent = (Math.abs(r2 - r1) + Math.abs(c2 - c1)) === 1;
            if (!isAdjacent || maze[r2][c2] === 1) {
                setFeedback('Jalurmu ada yang salah! Pastikan tidak melewati tembok dan selalu bersebelahan. 🤔');
                setFeedbackColor('red');
                playIncorrectSound(); // Play incorrect sound
                return;
            }
        }

        if (shortestPathSolution && userPath.length === shortestPathSolution.length) {
            setFeedback('Hebat! Kamu menemukan jalur terpendek! 🎉 Lanjut ke labirin berikutnya!');
            setFeedbackColor('green');
            setIsExploding(true);
            playCorrectSound(); // Play correct sound
            setTimeout(() => {
                setIsExploding(false);
                setCurrentMazeIndex(prev => prev + 1);
            }, 3000);
        } else if (shortestPathSolution && userPath.length > shortestPathSolution.length) {
            setFeedback(`Jalurmu benar, tapi ada yang lebih pendek! Coba cari lagi! 🤔 (Jalur terpendek: ${shortestPathSolution.length} langkah)`);
            setFeedbackColor('orange');
            playIncorrectSound(); // Play incorrect sound
        } else {
            setFeedback('Jalurmu benar, tapi ada yang lebih pendek! Coba cari lagi! 🤔');
            setFeedbackColor('orange');
            playIncorrectSound(); // Play incorrect sound
        }
    };

    const handleShowSolution = () => {
        playClickSound(); // Play click sound on show solution button
        if (hintCount > 0) {
            setShowSolution(true);
            setFeedback('Ini dia jalur terpendeknya! ✨ Pelajari ya!');
            setFeedbackColor('blue');
            setHintCount(prev => prev - 1); // Kurangi jumlah bantuan

            // Otomatis maju ke labirin berikutnya setelah menampilkan solusi
            setTimeout(() => {
                setCurrentMazeIndex(prev => prev + 1);
            }, 5000); // Tampilkan solusi selama 5 detik
        } else {
            setFeedback('Maaf, bantuan sudah habis! Coba pecahkan sendiri ya! 💪');
            setFeedbackColor('red');
            playIncorrectSound(); // Play incorrect sound
        }
    };

    const handleResetPath = () => {
        playClickSound(); // Play click sound on reset path button
        setUserPath([]);
        setFeedback('');
        setFeedbackColor('');
        setShowSolution(false);
    };

    const handleGoToDashboard = () => {
        playClickSound(); // Play click sound on dashboard button
        navigate('/dashboard');
    };

    return (
        <div className={styles.pathFinderPageContainer}>
            <Header />
            <div className={styles.contentArea}>
                {isExploding && (
                    <div className={styles.confettiContainer}>
                        <ConfettiExplosion
                            force={1.5}
                            duration={7000}
                            particleCount={400}
                            width={3000}
                            height={3000}
                            colors={['#FFD700', '#FF4500', '#32CD32', '#1E90FF', '#9370DB', '#FF69B4', '#ADFF2F', '#FFEA00', '#00BCD4', '#FF6347']}
                        />
                    </div>
                )}

                <h1 className={styles.pageTitle}>Jelajahi Labirin! 🗺️✨</h1>
                <p className={styles.levelIndicator}>Labirin ke: {currentMazeIndex + 1} dari {MAZES.length}</p>
                <p className={styles.hintCount}>Bantuan Tersisa: {hintCount} 💡</p>

                {maze.length > 0 && (
                    <div className={styles.mazeContainer}>
                        {maze.map((row, rIdx) => (
                            <div key={rIdx} className={styles.mazeRow}>
                                {row.map((cell, cIdx) => {
                                    const isStart = JSON.stringify([rIdx, cIdx]) === JSON.stringify(startPos);
                                    const isEnd = JSON.stringify([rIdx, cIdx]) === JSON.stringify(endPos);
                                    const isUserPath = userPath.some(p => p[0] === rIdx && p[1] === cIdx);
                                    const isSolutionPath = showSolution && shortestPathSolution && shortestPathSolution.some(p => p[0] === rIdx && p[1] === cIdx);

                                    let cellClass = styles.mazeCell;
                                    if (cell === 1) cellClass += ` ${styles.wall}`;
                                    if (isStart) cellClass += ` ${styles.startCell}`;
                                    if (isEnd) cellClass += ` ${styles.endCell}`;
                                    if (isUserPath && !isStart && !isEnd) cellClass += ` ${styles.userPathCell}`;
                                    if (isSolutionPath && !isStart && !isEnd) cellClass += ` ${styles.solutionPathCell}`;

                                    return (
                                        <div
                                            key={`${rIdx}-${cIdx}`}
                                            className={cellClass}
                                            onClick={() => handleCellClick(rIdx, cIdx)}
                                        >
                                            {isStart && 'A'}
                                            {isEnd && 'B'}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.feedbackMessage} style={{ color: feedbackColor }}>
                    {feedback}
                </div>

                <div className={styles.buttonGroup}>
                    <button onClick={checkPath} className={`${styles.actionButton} ${styles.primaryButton}`}>
                        Periksa Jalur ✅
                    </button>
                    <button onClick={handleResetPath} className={`${styles.actionButton} ${styles.secondaryButton}`}>
                        Reset Jalur 🔄
                    </button>
                    <button
                        onClick={handleShowSolution}
                        className={`${styles.actionButton} ${styles.tertiaryButton}`}
                        disabled={hintCount <= 0} // Nonaktifkan jika bantuan habis
                    >
                        Lihat Solusi 💡 ({hintCount})
                    </button>
                </div>

                <button
                    onClick={handleGoToDashboard}
                    className={styles.dashboardButtonPathFinder}
                >
                    <span role="img" aria-label="dashboard">🏠</span> Dashboard Utama
                </button>
            </div>
        </div>
    );
};

export default PathFinderPage;
