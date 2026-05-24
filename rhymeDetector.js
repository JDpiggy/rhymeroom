/**
 * Rhyme Detection Module
 * Analyzes lyrics for rhyming patterns using phonetic matching
 * Enhanced with AI-based detection using Qwen API
 */

const RhymeDetector = (() => {
    let useAI = false;
    let aiDetector = null;
    // Phonetic ending patterns for rhyme matching
    const phoneticMap = {
        // Common ending sounds
        'ay': ['ay', 'a', 'ey', 'ai', 'ae'],
        'ee': ['ee', 'ea', 'ie', 'y'],
        'igh': ['igh', 'y', 'ie', 'ye', 'i'],
        'oh': ['oh', 'o', 'ow', 'oe', 'eau'],
        'oo': ['oo', 'ew', 'ue', 'iew', 'ou'],
        'or': ['or', 'our', 'ore', 'ar'],
        'er': ['er', 'ir', 'ur', 'or'],
        'ar': ['ar', 'are', 'arre', 'arr'],
        'tion': ['tion', 'sion', 'shun'],
        'ight': ['ight', 'ite', 'yte', 'eit'],
        'ound': ['ound', 'ound'],
        'ent': ['ent', 'ant', 'aint'],
        'ing': ['ing', 'ang', 'ung', 'ong'],
        'ove': ['ove', 'uff', 'ove'],
        'ake': ['ake', 'ake', 'ack'],
        'all': ['all', 'al', 'aw', 'aul'],
        'own': ['own', 'awn', 'ound'],
        'ame': ['ame', 'aim', 'ame'],
        'ine': ['ine', 'ene', 'yne', 'ign'],
        'eal': ['eal', 'eal', 'eel'],
        'ood': ['ood', 'ude', 'ude'],
        'aw': ['aw', 'augh', 'ough', 'all']
    };

    // Common syllable patterns for detection
    const syllablePattern = /[aeiou]+(?:y)?/gi;

    /**
     * Extract the last word from a line
     */
    const getLastWord = (line) => {
        const cleaned = line.trim().toLowerCase().replace(/[^a-z\s']/g, '');
        const words = cleaned.split(/\s+/).filter(w => w.length > 0);
        return words[words.length - 1] || '';
    };

    /**
     * Extract the last n words from a line
     */
    const getLastNWords = (line, n) => {
        const cleaned = line.trim().toLowerCase().replace(/[^a-z\s']/g, '');
        const words = cleaned.split(/\s+/).filter(w => w.length > 0);
        return words.slice(Math.max(0, words.length - n)).join(' ');
    };

    /**
     * Extract syllables from a word
     */
    const getSyllables = (word) => {
        if (!word) return [];
        const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');
        const matches = cleaned.match(syllablePattern) || [];
        return matches.map(m => m.toLowerCase());
    };

    /**
     * Get the last n syllables from a word
     */
    const getLastNSyllables = (word, n) => {
        const syllables = getSyllables(word);
        if (syllables.length === 0) return '';
        return syllables.slice(Math.max(0, syllables.length - n)).join('');
    };

    /**
     * Get the phonetic ending of a word
     */
    const getPhoneticEnding = (word) => {
        if (!word) return '';
        
        const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');
        if (cleaned.length < 2) return cleaned;

        // Get the last 2-3 characters and check against phonetic map
        const ending = cleaned.slice(-3);
        const ending2 = cleaned.slice(-2);

        for (const [key, values] of Object.entries(phoneticMap)) {
            if (values.some(v => ending.includes(v) || ending2.includes(v))) {
                return key;
            }
        }

        return ending2 || ending;
    };

    /**
     * Extract the rime (vowel nucleus + final consonants) from a word
     * Returns {vowel: string, finalConsonants: string}
     */
    const extractRime = (word) => {
        const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');
        if (cleaned.length < 2) return { vowel: '', finalConsonants: '' };

        // Find the last vowel
        const vowels = 'aeiou';
        let lastVowelIdx = -1;
        for (let i = cleaned.length - 1; i >= 0; i--) {
            if (vowels.includes(cleaned[i])) {
                lastVowelIdx = i;
                break;
            }
        }

        if (lastVowelIdx === -1) return { vowel: '', finalConsonants: '' };

        // Get the vowel nucleus (the vowel and any immediately following vowels)
        let nucleusEnd = lastVowelIdx;
        while (nucleusEnd + 1 < cleaned.length && vowels.includes(cleaned[nucleusEnd + 1])) {
            nucleusEnd++;
        }

        const vowelNucleus = cleaned.substring(lastVowelIdx, nucleusEnd + 1);
        const finalConsonants = cleaned.substring(nucleusEnd + 1);

        return {
            vowel: vowelNucleus,
            finalConsonants: finalConsonants
        };
    };

    /**
     * Extract vowel groups from a word for assonance matching
     */
    const extractVowelSequences = (word) => {
        const cleaned = word.toLowerCase().replace(/[^a-z]/g, '');
        const sequences = [];
        let current = '';

        for (const char of cleaned) {
            if ('aeiou'.includes(char)) {
                current += char;
            } else {
                if (current) sequences.push(current);
                current = '';
            }
        }
        if (current) sequences.push(current);

        return sequences;
    };

    /**
     * Calculate similarity between two vowel sounds (0-100)
     * Treats similar vowels (e.g., 'a' and 'ai') as having good similarity
     */
    const vowelSimilarity = (vowel1, vowel2) => {
        if (!vowel1 || !vowel2) return 0;
        if (vowel1 === vowel2) return 100;

        // Define vowel groups (similar sounding vowels)
        const vowelGroups = {
            'a': ['a', 'ai', 'ay', 'ae'],      // /eɪ/ or /æ/ sounds
            'e': ['e', 'ea', 'ee', 'ie'],      // /i/ sounds
            'i': ['i', 'y', 'ie', 'igh'],      // /aɪ/ or /ɪ/ sounds
            'o': ['o', 'ow', 'oe', 'au'],      // /oʊ/ or /ɔ/ sounds
            'u': ['u', 'oo', 'ue', 'ew'],      // /u/ sounds
            'y': ['y', 'i', 'ie']              // /aɪ/ or /ɪ/ sounds
        };

        // Check which groups contain these vowels
        for (const [key, group] of Object.entries(vowelGroups)) {
            const v1InGroup = group.includes(vowel1);
            const v2InGroup = group.includes(vowel2);

            if (v1InGroup && v2InGroup) {
                // Both in same group - good match
                if (vowel1 === vowel2) return 100;
                // Different but in same group
                return 75;
            }
        }

        // Check for partial character matching (e.g., 'a' in 'ai' and 'a' in 'ay')
        const minLen = Math.min(vowel1.length, vowel2.length);
        let matches = 0;
        for (let i = 0; i < minLen; i++) {
            if (vowel1[i] === vowel2[i]) matches++;
        }

        if (matches === minLen && minLen > 0) {
            return 50 + (25 * (matches / Math.max(vowel1.length, vowel2.length)));
        }

        return 25; // Some assonance
    };

    /**
     * Calculate consonant cluster similarity
     * Matches final consonants with weighting for important phonetic features
     */
    const consonantSimilarity = (cons1, cons2) => {
        if (!cons1 || !cons2) {
            // Both have no consonants = perfect match for this part
            if (!cons1 && !cons2) return 100;
            // One has consonants, other doesn't = partial mismatch
            return 40;
        }

        if (cons1 === cons2) return 100;

        // Check if last consonants match (most important)
        const lastCons1 = cons1[cons1.length - 1];
        const lastCons2 = cons2[cons2.length - 1];

        if (lastCons1 === lastCons2) {
            // Last consonants match - this is crucial for rhyming
            // Partial credit if other consonants differ
            return 85;
        }

        // Check for similar sounding consonants
        const similarGroups = {
            'b': ['b', 'p'],           // stop sounds
            'p': ['p', 'b'],
            'k': ['k', 'c', 'g'],      // velar sounds
            'g': ['g', 'k', 'c'],
            'c': ['c', 'k', 'g'],
            'd': ['d', 't'],           // alveolar stops
            't': ['t', 'd'],
            's': ['s', 'z'],           // sibilants
            'z': ['z', 's'],
            'sh': ['sh', 'ch', 's'],   // fricatives
            'ch': ['ch', 'sh', 'j'],
            'j': ['j', 'ch'],
            'f': ['f', 'v'],           // labiodental
            'v': ['v', 'f'],
            'n': ['n', 'm'],           // nasals
            'm': ['m', 'n'],
            'ng': ['ng', 'n'],
            'l': ['l', 'r'],           // liquids
            'r': ['r', 'l']
        };

        if (similarGroups[lastCons1] && similarGroups[lastCons1].includes(lastCons2)) {
            return 60;
        }

        // Consonants don't match much
        return 20;
    };

    /**
     * Initialize AI detection with API key
     */
    const initAI = (apiKey, enabled = true) => {
        if (typeof AIRhymeDetector !== 'undefined') {
            AIRhymeDetector.init(apiKey, enabled);
            aiDetector = AIRhymeDetector;
            useAI = enabled && apiKey;
        }
    };

    /**
     * Enable or disable AI detection
     */
    const setAIEnabled = (enabled) => {
        useAI = enabled;
        if (aiDetector) {
            aiDetector.setEnabled(enabled);
        }
    };

    /**
     * Update API key
     */
    const setAIApiKey = (apiKey) => {
        if (aiDetector) {
            aiDetector.setApiKey(apiKey);
            useAI = useAI && apiKey;
        }
    };

    /**
     * Check if AI is enabled
     */
    const isAIEnabled = () => {
        return useAI && aiDetector && aiDetector.isEnabled();
    };

    /**
     * Calculate rhyme strength between two words (0-100)
     * Uses AI when available, falls back to phonetic matching
     * AI-based: Uses Qwen API for intelligent rhyme analysis
     * Fallback: Uses sophisticated phonetic matching based on:
     * - Rime matching (vowel nucleus + final consonants)
     * - Consonant similarity
     * - Assonance (vowel harmony)
     * - Syllable structure
     */
    const calculateRhymeStrength = async (word1, word2) => {
        if (!word1 || !word2) return 0;

        word1 = word1.toLowerCase().replace(/[^a-z]/g, '');
        word2 = word2.toLowerCase().replace(/[^a-z]/g, '');

        if (word1.length < 2 || word2.length < 2) return 0;
        if (word1 === word2) return 100;

        // Try AI-based detection first if enabled
        if (isAIEnabled() && aiDetector) {
            try {
                const aiScore = await aiDetector.calculateRhymeStrength(word1, word2);
                if (aiScore !== null && aiScore !== undefined) {
                    return aiScore;
                }
            } catch (error) {
                console.warn('AI detection failed, falling back to phonetic matching:', error);
            }
        }

        // Fallback to phonetic matching
        // Extract rimes (vowel nucleus + final consonants)
        const rime1 = extractRime(word1);
        const rime2 = extractRime(word2);

        // Perfect rhyme: both vowel nuclei and final consonants match
        if (rime1.vowel === rime2.vowel && rime1.finalConsonants === rime2.finalConsonants) {
            return 100;
        }

        // Calculate component scores
        const vowelScore = vowelSimilarity(rime1.vowel, rime2.vowel);
        const consonantScore = consonantSimilarity(rime1.finalConsonants, rime2.finalConsonants);

        // Bonus for matching the last 3+ characters exactly (strong indicator of rhyme)
        const last3Match = word1.slice(-3) === word2.slice(-3);
        const last2Match = word1.slice(-2) === word2.slice(-2);

        // Weight the scores based on phonetic importance
        // Consonant ending is crucial for rhyming (~50% weight)
        // Vowel nucleus is also important (~40% weight)
        // Final consonant exact match gets major boost
        let score;

        if (last3Match) {
            // Very strong indicator - near perfect rhyme
            score = 98;
        } else if (last2Match && rime1.finalConsonants && rime2.finalConsonants) {
            // Last 2 chars match - strong rhyme
            score = 92;
        } else if (consonantScore === 100 && vowelScore >= 85) {
            // Perfect consonants + excellent vowels = near perfect
            score = 95;
        } else if (consonantScore >= 85 && vowelScore >= 75) {
            // Very strong on both dimensions
            score = 85;
        } else {
            // Weighted combination: consonants (50%) + vowels (40%) + small bonus (10%)
            score = (consonantScore * 0.5) + (vowelScore * 0.4) + 5;
        }

        // Adjustment for word length difference
        // Very different length words should have slightly lower scores
        const lengthDiff = Math.abs(word1.length - word2.length);
        if (lengthDiff > 3) {
            score *= 0.95; // Small penalty for very different lengths
        }

        // Ensure both words have at least one consonant match or vowel match
        // to avoid false positives
        if (consonantScore < 30 && vowelScore < 40) {
            score = Math.min(score, 40); // Cap at assonance level
        }

        return Math.round(Math.max(0, Math.min(100, score)));
    };

    /**
     * Check if two strings rhyme
     */
    const isRhyme = async (str1, str2, minStrength = 60) => {
        const strength = await calculateRhymeStrength(str1, str2);
        return strength >= minStrength;
    };

    /**
     * Analyze rhymes between lines based on comparison mode
     */
    const analyzeRhymes = async (lyrics, targetLineIndex, compareMode) => {
        const lines = lyrics.split('\n').filter(line => line.trim().length > 0);
        
        if (targetLineIndex >= lines.length || targetLineIndex < 0) {
            return { error: 'Target line not found' };
        }

        const targetLine = lines[targetLineIndex];
        let targetSegment = '';

        // Extract the segment to compare based on mode
        switch (compareMode) {
            case 'lastWord':
                targetSegment = getLastWord(targetLine);
                break;
            case 'last2Words':
                targetSegment = getLastNWords(targetLine, 2);
                break;
            case 'lastSyllable':
                targetSegment = getLastNSyllables(getLastWord(targetLine), 1);
                break;
            case 'last2Syllables':
                targetSegment = getLastNSyllables(getLastWord(targetLine), 2);
                break;
            default:
                targetSegment = getLastWord(targetLine);
        }

        if (!targetSegment) {
            return { error: 'Could not extract comparison segment from target line' };
        }

        // Analyze other lines
        const results = [];
        for (let idx = 0; idx < lines.length; idx++) {
            if (idx === targetLineIndex) continue; // Skip target line

            let lineSegment = '';
            switch (compareMode) {
                case 'lastWord':
                    lineSegment = getLastWord(lines[idx]);
                    break;
                case 'last2Words':
                    lineSegment = getLastNWords(lines[idx], 2);
                    break;
                case 'lastSyllable':
                    lineSegment = getLastNSyllables(getLastWord(lines[idx]), 1);
                    break;
                case 'last2Syllables':
                    lineSegment = getLastNSyllables(getLastWord(lines[idx]), 2);
                    break;
                default:
                    lineSegment = getLastWord(lines[idx]);
            }

            if (!lineSegment) continue;

            const strength = await calculateRhymeStrength(targetSegment, lineSegment);
            const isMatch = strength >= 60;

            results.push({
                lineIndex: idx,
                lineNumber: idx + 1,
                lineText: lines[idx],
                segment: lineSegment,
                strength: strength,
                isMatch: isMatch
            });
        }

        return {
            targetLineNumber: targetLineIndex + 1,
            targetSegment: targetSegment,
            compareMode: compareMode,
            results: results.sort((a, b) => b.strength - a.strength)
        };
    };

    /**
     * Highlight rhyming patterns in text
     */
    const highlightRhymes = (text, results) => {
        if (!results || !results.results) return text;

        const lines = text.split('\n');
        const highlighted = [];

        lines.forEach((line, idx) => {
            let highlightedLine = line;
            
            // Check if this line is in results
            const result = results.results.find(r => r.lineIndex === idx);
            if (result) {
                // Find and highlight the segment
                const regex = new RegExp(`\\b${result.segment}\\b`, 'gi');
                highlightedLine = line.replace(regex, (match) => {
                    const className = result.isMatch ? 'match' : 'no-match';
                    return `<span class="rhyme-segment ${className}">${match}</span>`;
                });
            }

            highlighted.push(highlightedLine);
        });

        return highlighted.join('\n');
    };

    /**
     * Get rhyme suggestions for a word
     */
    const getSuggestions = async (word, wordList = []) => {
        if (!word || word.length < 2) return [];

        const suggestions = [];
        for (const w of wordList) {
            if (w.toLowerCase() === word.toLowerCase()) continue;
            const strength = await calculateRhymeStrength(word, w);
            if (strength >= 60) {
                suggestions.push({ word: w, strength });
            }
        }

        return suggestions
            .sort((a, b) => b.strength - a.strength)
            .slice(0, 5);
    };

    /**
     * Analyze overall rhyme scheme
     */
    const analyzeRhymeScheme = async (lyrics) => {
        const lines = lyrics.split('\n').filter(line => line.trim().length > 0);
        const scheme = [];
        const schemeLetters = [];
        const usedSchemes = {};
        let currentLetter = 'A';

        for (let idx = 0; idx < lines.length; idx++) {
            const word = getLastWord(lines[idx]);
            const phonetic = getPhoneticEnding(word);

            let letter = null;
            
            // Check if this phonetic ending matches previous lines
            for (const [letter2, phon] of Object.entries(usedSchemes)) {
                if (await isRhyme(word, phon, 65)) {
                    letter = letter2;
                    break;
                }
            }

            // Assign new letter if no match
            if (!letter) {
                letter = currentLetter;
                usedSchemes[currentLetter] = word;
                currentLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 1);
            }

            schemeLetters.push(letter);
            scheme.push({
                line: idx + 1,
                word: word,
                scheme: letter
            });
        }

        return {
            scheme: schemeLetters.join(''),
            details: scheme
        };
    };

    /**
     * Get highlight data for lines with rhyming segments
     * Used for visual highlighting in editor
     */
    const getHighlightData = async (lyrics, targetLineIndex, compareMode, maxLines = 4) => {
        const lines = lyrics.split('\n');
        const analysis = await analyzeRhymes(lyrics, targetLineIndex, compareMode);
        
        if (analysis.error) {
            return { highlightLines: [] };
        }

        const highlightLines = [];
        
        // Add target line highlight
        highlightLines.push({
            lineIndex: targetLineIndex,
            segment: analysis.targetSegment,
            isTarget: true,
            strength: 100
        });

        // Add all matching results sorted by strength (include weak matches too for visibility)
        // Limit to maxLines results
        analysis.results
            .filter(result => result.strength > 0)
            .slice(0, maxLines)
            .forEach(result => {
                highlightLines.push({
                    lineIndex: result.lineIndex,
                    segment: result.segment,
                    isTarget: false,
                    strength: result.strength
                });
            });

        return { highlightLines };
    };

    /**
     * Find character positions of a word/segment in a line for highlighting
     */
    const findSegmentPosition = (line, segment) => {
        const lowerLine = line.toLowerCase();
        const lowerSegment = segment.toLowerCase();
        const pos = lowerLine.lastIndexOf(lowerSegment);

        if (pos === -1) {
            return null;
        }

        return {
            start: pos,
            end: pos + segment.length,
            text: line.substring(pos, pos + segment.length)
        };
    };

    /**
     * Calculate overall rhyme score for lyrics (0-100)
     * Considers rhyme strength, consistency, and scheme quality
     */
    const calculateOverallRhymeScore = async (lyrics) => {
        const lines = lyrics.split('\n').filter(line => line.trim().length > 0);
        if (lines.length < 2) return 0;

        let totalStrength = 0;
        let rhymeCount = 0;
        let totalComparisons = 0;

        // Compare each line with every other line
        for (let i = 0; i < lines.length; i++) {
            for (let j = i + 1; j < lines.length; j++) {
                const word1 = getLastWord(lines[i]);
                const word2 = getLastWord(lines[j]);
                const strength = await calculateRhymeStrength(word1, word2);

                totalStrength += strength;
                totalComparisons++;

                if (strength >= 60) {
                    rhymeCount++;
                }
            }
        }

        // Calculate average rhyme strength
        const avgStrength = totalComparisons > 0 ? totalStrength / totalComparisons : 0;

        // Calculate rhyme density (percentage of lines that rhyme)
        const rhymeDensity = totalComparisons > 0 ? (rhymeCount / totalComparisons) * 100 : 0;

        // Analyze rhyme scheme consistency
        const schemeAnalysis = await analyzeRhymeScheme(lyrics);
        const scheme = schemeAnalysis.scheme;

        // Bonus for consistent schemes (AABB, ABAB, etc.)
        let schemeBonus = 0;
        if (lines.length >= 4) {
            const commonSchemes = ['AABB', 'ABAB', 'ABBA', 'AAAA'];
            if (commonSchemes.includes(scheme)) {
                schemeBonus = 15;
            } else if (scheme.length === lines.length) {
                // Some scheme exists, give partial bonus
                schemeBonus = 8;
            }
        }

        // Calculate final score
        // Weight: 50% rhyme strength, 30% rhyme density, 20% scheme bonus
        const finalScore = Math.round(
            (avgStrength * 0.5) +
            (rhymeDensity * 0.3) +
            schemeBonus
        );

        return Math.min(100, Math.max(0, finalScore));
    };

    /**
     * Get detailed rhyme scoring breakdown
     */
    const getRhymeScoreBreakdown = async (lyrics) => {
        const lines = lyrics.split('\n').filter(line => line.trim().length > 0);
        if (lines.length < 2) {
            return {
                overall: 0,
                avgStrength: 0,
                rhymeDensity: 0,
                rhymeCount: 0,
                totalComparisons: 0,
                scheme: '',
                breakdown: []
            };
        }

        let totalStrength = 0;
        let rhymeCount = 0;
        let totalComparisons = 0;
        const breakdown = [];

        // Compare each line with every other line
        for (let i = 0; i < lines.length; i++) {
            for (let j = i + 1; j < lines.length; j++) {
                const word1 = getLastWord(lines[i]);
                const word2 = getLastWord(lines[j]);
                const strength = await calculateRhymeStrength(word1, word2);

                totalStrength += strength;
                totalComparisons++;

                if (strength >= 60) {
                    rhymeCount++;
                }

                breakdown.push({
                    line1: i + 1,
                    line2: j + 1,
                    word1: word1,
                    word2: word2,
                    strength: strength
                });
            }
        }

        const avgStrength = totalComparisons > 0 ? Math.round(totalStrength / totalComparisons) : 0;
        const rhymeDensity = totalComparisons > 0 ? Math.round((rhymeCount / totalComparisons) * 100) : 0;
        const schemeAnalysis = await analyzeRhymeScheme(lyrics);

        return {
            overall: await calculateOverallRhymeScore(lyrics),
            avgStrength: avgStrength,
            rhymeDensity: rhymeDensity,
            rhymeCount: rhymeCount,
            totalComparisons: totalComparisons,
            scheme: schemeAnalysis.scheme,
            breakdown: breakdown.sort((a, b) => b.strength - a.strength)
        };
    };

    return {
        getLastWord,
        getLastNWords,
        getSyllables,
        getLastNSyllables,
        getPhoneticEnding,
        calculateRhymeStrength,
        isRhyme,
        analyzeRhymes,
        highlightRhymes,
        getSuggestions,
        analyzeRhymeScheme,
        getHighlightData,
        findSegmentPosition,
        calculateOverallRhymeScore,
        getRhymeScoreBreakdown,
        initAI,
        setAIEnabled,
        setAIApiKey,
        isAIEnabled
    };
})();
