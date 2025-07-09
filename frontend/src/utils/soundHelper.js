// Function to get the correct path for a sound file
// soundType: 'letter', 'word', 'sentence', 'number', 'positive-feedback', 'negative-feedback', 'math_question'
export const getSoundPath = (text, soundType = 'letter') => {
    const normalizedText = String(text).toLowerCase().trim();

    let soundBaseDir = '/sounds/'; // Default base directory

    // Determine sub-directory based on soundType
    if (soundType === 'letter') {
        soundBaseDir += 'letters/';
    } else if (soundType === 'word') {
        soundBaseDir += 'words/';
    } else if (soundType === 'sentence') {
        soundBaseDir += 'sentences/';
        // For sentences, replace spaces with hyphens and remove most punctuation for filenames
        const hyphenatedText = normalizedText
                                .replace(/[.,!?'"‘’“”—-]/g, '') // Remove punctuation
                                .replace(/ /g, '-'); // Replace spaces with hyphens
        if (!hyphenatedText) {
            console.warn(`[soundHelper] Attempted to create sound path for empty/invalid sentence text: "${text}"`);
            return null;
        }
        return `${soundBaseDir}${hyphenatedText}.mp3`;
    } else if (soundType === 'number') {
        // For numbers, directly use the number as filename
        const numberValue = parseInt(normalizedText);
        if (!isNaN(numberValue) && numberValue >= 1 && numberValue <= 100) {
            return `${soundBaseDir}numbers/${numberValue}.mp3`;
        }
        console.warn(`[soundHelper] Number sound not found for: ${text}. Falling back to Web Speech API.`);
        return null; // Fallback to Web Speech API
    } else if (soundType === 'math_question') {
        // For complex math questions like "5 tambah 3", we usually rely on Web Speech API
        // unless you have specific pre-recorded audio for every possible combination.
        console.warn(`[soundHelper] Math question sound files are generally not stored directly. Using Web Speech API for: "${text}"`);
        return null; // Fallback to Web Speech API
    } else if (soundType === 'positive-feedback' || soundType === 'negative-feedback') {
        // For feedback sounds, the 'text' argument is already the filename stem (e.g., 'mantap-bos')
        return `${soundBaseDir}feedback/${normalizedText}.mp3`;
    }

    // Fallback for other cases if needed, but with specific soundTypes, this part might be less used
    // If no specific soundType matches, it will default to 'letter' base dir and try to find filename.mp3
    const filename = `${normalizedText}.mp3`;
    console.warn(`[soundHelper] Unhandled soundType "${soundType}" for text "${text}". Attempting default path: ${soundBaseDir}${filename}`);
    return `${soundBaseDir}${filename}`;
};