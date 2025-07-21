import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
// import ConfettiExplosion from 'react-confetti-explosion'; // Uncomment this line if using the real library
import styles from './WritingPage.module.css';

// Placeholder for ConfettiExplosion if you haven't installed it or want to test without the library.
const ConfettiExplosionPlaceholder = ({ force, duration, particleCount, width, height, colors }) => {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // console.log("Confetti Explosion would be playing now!");
        }
    }, []);
    return null;
};

const ActualConfettiExplosion = typeof ConfettiExplosion !== 'undefined' ? ConfettiExplosion : ConfettiExplosionPlaceholder;

const alphabetLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)); // 'a' through 'z'
const LOCAL_STORAGE_KEY = 'currentLetterIndex'; // Kunci untuk localStorage

const WritingPage = () => {
    // Inisialisasi state dari localStorage atau default ke 0 (huruf 'a')
    const [currentLetterIndex, setCurrentLetterIndex] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedIndex = localStorage.getItem(LOCAL_STORAGE_KEY);
            return savedIndex !== null ? parseInt(savedIndex, 10) : 0;
        }
        return 0; // Default if not in browser environment
    });
    const [feedback, setFeedback] = useState('');
    const [feedbackColor, setFeedbackColor] = useState('');
    const [isExploding, setIsExploding] = useState(false);

    const canvasRef = useRef(null);
    const hiddenCanvasRef = useRef(null); // Canvas for drawing the target letter for comparison
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawingPoints, setDrawingPoints] = useState([]); // Stores {x, y} coordinates of user's drawing

    const clickAudioRef = useRef(null);
    const correctSoundRef = useRef(null);
    const incorrectSoundRef = useRef(null);

    const navigate = useNavigate();

    const currentLetter = alphabetLetters[currentLetterIndex];

    // --- Audio Initialization ---
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
    }, []);

    const playClickSound = () => {
        if (clickAudioRef.current) {
            clickAudioRef.current.currentTime = 0;
            clickAudioRef.current.play().catch(e => console.error("Failed to play click sound:", e));
        }
    };

    const playCorrectSound = () => {
        if (correctSoundRef.current) {
            correctSoundRef.current.currentTime = 0;
            correctSoundRef.current.play().catch(e => console.error("Failed to play correct sound:", e));
        }
    };

    const playIncorrectSound = () => {
        if (incorrectSoundRef.current) {
            incorrectSoundRef.current.currentTime = 0;
            incorrectSoundRef.current.play().catch(e => console.error("Failed to play incorrect sound:", e));
        }
    };

    // --- Web Speech API (Text-to-Speech) for letters ---
    const playWebSpeech = useCallback((text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const msg = new SpeechSynthesisUtterance(text);
            msg.lang = 'id-ID';
            msg.rate = 0.7;
            msg.pitch = 1.0;

            const voices = window.speechSynthesis.getVoices();
            const indoVoice = voices.find(voice => voice.lang === 'id-ID' && voice.name.includes('Google Bahasa Indonesia'));
            if (indoVoice) {
                msg.voice = indoVoice;
            } else {
                console.warn("Indonesian voice not found, using default voice.");
            }
            window.speechSynthesis.speak(msg);
        } else {
            console.error("Your browser does not support Web Speech API.");
            setFeedback("Maaf, browser Anda tidak mendukung fitur suara.");
            setFeedbackColor("orange");
        }
    }, []);

    // --- Canvas Drawing Logic ---
    const redrawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const hiddenCanvas = hiddenCanvasRef.current;
        if (!canvas || !hiddenCanvas) return;

        const ctx = canvas.getContext('2d');
        const hiddenCtx = hiddenCanvas.getContext('2d');

        // Clear visible canvas completely
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the light guide on visible canvas
        ctx.font = `${Math.min(canvas.width, canvas.height) * 0.7}px 'Comic Sans MS', cursive, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(100, 100, 255, 0.2)'; // Faded blue for guide
        ctx.fillText(currentLetter.toUpperCase(), canvas.width / 2, canvas.height / 2);

        // Draw the user's path on visible canvas
        ctx.strokeStyle = '#FF5722'; // User's drawing color (orange-red)
        ctx.lineWidth = 15; // Thicker line for child-like drawing
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Redraw all drawing points, handling multiple segments
        ctx.beginPath();
        if (drawingPoints.length > 0) {
            drawingPoints.forEach((point, index) => {
                if (point.type === 'start') {
                    ctx.moveTo(point.x, point.y);
                } else { // type === 'draw'
                    ctx.lineTo(point.x, point.y);
                }
            });
            ctx.stroke();
        }

        // Clear and draw the solid target letter on the hidden canvas for comparison
        hiddenCtx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
        hiddenCtx.font = `${Math.min(hiddenCanvas.width, hiddenCanvas.height) * 0.7}px 'Comic Sans MS', cursive, sans-serif`;
        hiddenCtx.textAlign = 'center';
        hiddenCtx.textBaseline = 'middle';
        hiddenCtx.fillStyle = 'black'; // Use a solid, distinguishable color for the target
        hiddenCtx.fillText(currentLetter.toUpperCase(), hiddenCanvas.width / 2, hiddenCanvas.height / 2);

    }, [currentLetter, drawingPoints]); // Redraw whenever currentLetter or drawingPoints change

    const clearCanvas = useCallback(() => {
        setDrawingPoints([]); // Reset drawing points
        setFeedback(''); // Clear feedback
        setFeedbackColor('');
        setIsExploding(false); // Ensure confetti stops
        // Redraw will be triggered by drawingPoints change, which will clear and redraw the guide
    }, []);


    // Effect to play sound and reset for new letter
    useEffect(() => {
        if (currentLetter) {
            playWebSpeech(currentLetter);
            clearCanvas(); // Clear canvas for new letter
        }
    }, [currentLetter, playWebSpeech, clearCanvas]);

    // Effect to handle canvas resizing and initial drawing
    useEffect(() => {
        const canvas = canvasRef.current;
        const hiddenCanvas = hiddenCanvasRef.current;
        if (!canvas || !hiddenCanvas) return;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            hiddenCanvas.width = canvas.offsetWidth; // Hidden canvas matches visible one
            hiddenCanvas.height = canvas.offsetHeight;
            redrawCanvas(); // Redraw everything on resize
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas(); // Initial size setting

        return () => window.removeEventListener('resize', resizeCanvas);
    }, [redrawCanvas]); // Depends on redrawCanvas


    const getCanvasCoordinates = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if (event.touches) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    };

    const handleStartDrawing = (event) => {
        setIsDrawing(true);
        const point = getCanvasCoordinates(event);
        // Add a 'start' type point to signal a new drawing segment
        setDrawingPoints(prevPoints => [...prevPoints, { type: 'start', x: point.x, y: point.y }]);
        setFeedback(''); // Clear feedback when new drawing starts
        setFeedbackColor('');
    };

    const handleDrawing = (event) => {
        if (!isDrawing) return;
        const point = getCanvasCoordinates(event);
        // Add a 'draw' type point for continuous drawing
        setDrawingPoints(prevPoints => [...prevPoints, { type: 'draw', x: point.x, y: point.y }]);
    };

    const handleEndDrawing = () => {
        setIsDrawing(false);
        // No auto-validation here
    };

    // --- Accurate Completion Logic (Pixel-based comparison) ---
    const checkAccurateCompletion = useCallback(() => {
        const canvas = canvasRef.current;
        const hiddenCanvas = hiddenCanvasRef.current;
        if (!canvas || !hiddenCanvas) {
            console.error("Canvas references are null.");
            return false;
        }

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const hiddenCtx = hiddenCanvas.getContext('2d', { willReadFrequently: true });

        // Ensure the target letter is drawn correctly on the hiddenCanvas before comparison
        hiddenCtx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
        hiddenCtx.font = `${Math.min(hiddenCanvas.width, hiddenCanvas.height) * 0.7}px 'Comic Sans MS', cursive, sans-serif`;
        hiddenCtx.textAlign = 'center';
        hiddenCtx.textBaseline = 'middle';
        hiddenCtx.fillStyle = 'black';
        hiddenCtx.fillText(currentLetter.toUpperCase(), hiddenCanvas.width / 2, hiddenCanvas.height / 2);

        const imageDataUser = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const dataUser = imageDataUser.data;

        const imageDataTarget = hiddenCtx.getImageData(0, 0, hiddenCanvas.width, hiddenCanvas.height);
        const dataTarget = imageDataTarget.data;

        let totalTargetPixels = 0; // Pixels that form the letter on the hidden canvas
        let matchedPixels = 0;     // Pixels on the user's canvas that overlap with target pixels

        // NEW: Increased tolerance and adjusted coverage for more leniency
        const colorMatchTolerance = 80; // Allow a wider range for matching the drawing color
        const requiredCoverage = 0.45; // Only 45% of the target letter needs to be covered

        const drawingColorR = 255; // Red component of #FF5722
        const drawingColorG = 87;  // Green component of #FF5722
        const drawingColorB = 34;  // Blue component of #FF5722

        // Iterate through pixels
        for (let i = 0; i < dataTarget.length; i += 4) {
            // Check if the target pixel on hidden canvas is part of the letter (non-transparent black)
            if (dataTarget[i + 3] > 0 && dataTarget[i] === 0 && dataTarget[i+1] === 0 && dataTarget[i+2] === 0) {
                totalTargetPixels++;

                // Check if the corresponding pixel on the user's canvas has been drawn over (is orange-red)
                const rUser = dataUser[i];
                const gUser = dataUser[i + 1];
                const bUser = dataUser[i + 2];
                const aUser = dataUser[i + 3];

                // If user pixel is mostly opaque and somewhat matches our drawing color
                if (aUser > 100 && // Opacity check, must be visible
                    Math.abs(rUser - drawingColorR) < colorMatchTolerance &&
                    Math.abs(gUser - drawingColorG) < colorMatchTolerance &&
                    Math.abs(bUser - drawingColorB) < colorMatchTolerance) {
                    matchedPixels++;
                }
            }
        }

        const completionPercentage = (totalTargetPixels > 0) ? (matchedPixels / totalTargetPixels) : 0;

        console.log(`Huruf: ${currentLetter.toUpperCase()}, Total Piksel Target: ${totalTargetPixels}, Piksel Cocok: ${matchedPixels}, Persentase Penyelesaian: ${(completionPercentage * 100).toFixed(2)}%`);

        return completionPercentage >= requiredCoverage;
    }, [currentLetter]);

    const handleSubmit = () => {
        playClickSound(); // Play sound when check button is pressed
        if (drawingPoints.length === 0) {
            setFeedback('Gambarlah hurufnya dulu, ya! 🤔');
            setFeedbackColor('orange');
            playIncorrectSound();
            return; // Do not proceed with check if nothing is drawn
        }

        const isCorrect = checkAccurateCompletion();

        if (isCorrect) {
            playCorrectSound();
            setFeedback('Hebat! Betul sekali! Lanjut ke huruf berikutnya! ✨');
            setFeedbackColor('green');
            setIsExploding(true);

            // Wait for confetti/feedback to finish, then advance letter
            setTimeout(() => {
                setIsExploding(false);
                if (currentLetterIndex < alphabetLetters.length - 1) {
                    const nextIndex = currentLetterIndex + 1;
                    setCurrentLetterIndex(nextIndex);
                    // Simpan indeks baru ke localStorage
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(LOCAL_STORAGE_KEY, nextIndex.toString());
                    }
                } else {
                    // All letters completed
                    setCurrentLetterIndex(0); // Loop back to 'a' or show a final message
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(LOCAL_STORAGE_KEY, '0'); // Reset progress if all completed
                    }
                    setFeedback('Kamu sudah menyelesaikan semua huruf! Hebat! 🎉');
                    setFeedbackColor('purple');
                    // Do NOT clear canvas here. User can admire their final work.
                    // They can manually clear or navigate to dashboard.
                }
                setTimeout(() => {
                    setFeedback('');
                    setFeedbackColor('');
                }, 1000); // Clear feedback message after a delay
            }, 1500); // Confetti duration + a bit
        } else {
            playIncorrectSound();
            setFeedback('Coba lagi, ya! Pastikan kamu melacak hurufnya dengan lengkap! 💪');
            setFeedbackColor('red');
            setIsExploding(false);
            // DO NOT clear canvas here. User's drawing remains.
        }
    };

    const handleGoToDashboard = () => {
        playClickSound();
        navigate('/dashboard');
    };

    return (
        <div className={styles.writingPageContainer}>
            <Header />
            <div className={styles.contentArea}>
                {isExploding && (
                    <div className={styles.confettiContainer}>
                        <ActualConfettiExplosion
                            force={0.8}
                            duration={3000}
                            particleCount={100}
                            width={1000}
                            height={1000}
                            colors={['#FFC107', '#4CAF50', '#8E24AA', '#FF5722']}
                        />
                    </div>
                )}

              

                <div className={styles.tracingCard}>
                    <h2 className={styles.cardTitle}>Huruf saat ini: <span className={styles.currentLetterDisplay}>{currentLetter.toUpperCase()}</span></h2>

                    <div className={styles.canvasWrapper}>
                        <canvas
                            ref={canvasRef}
                            className={styles.tracingCanvas}
                            onMouseDown={handleStartDrawing}
                            onMouseMove={handleDrawing}
                            onMouseUp={handleEndDrawing}
                            onMouseLeave={handleEndDrawing}
                            onTouchStart={handleStartDrawing}
                            onTouchMove={handleDrawing}
                            onTouchEnd={handleEndDrawing}
                            onTouchCancel={handleEndDrawing}
                        ></canvas>
                        <canvas
                            ref={hiddenCanvasRef}
                            style={{ display: 'none', position: 'absolute', top: 0, left: 0 }}
                        ></canvas>
                        <button onClick={() => { playClickSound(); clearCanvas(); }} className={styles.clearButton}>
                            Bersihkan <span role="img" aria-label="clear">🧼</span>
                        </button>
                    </div>

                    <div className={styles.audioControl}>
                        <button onClick={() => { playClickSound(); playWebSpeech(currentLetter); }} className={styles.speakButton}>
                            <span role="img" aria-label="speaker">🔊</span> Dengar Suara
                        </button>
                    </div>

                    <div className={styles.feedbackMessage} style={{ color: feedbackColor }}>
                        {feedback}
                    </div>

                    <div className={styles.buttonGroup}>
                        <button onClick={handleSubmit} className={styles.submitButton}>
                            Periksa ✅
                        </button>
                        <button
                            onClick={handleGoToDashboard}
                            className={styles.dashboardButtonWriting}
                        >
                            <span role="img" aria-label="dashboard">🏠</span> Dashboard Utama
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WritingPage;