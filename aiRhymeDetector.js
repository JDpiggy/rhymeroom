/**
 * AI-Based Rhyme Detection Module
 * Uses Qwen API for intelligent rhyme analysis
 */

const AIRhymeDetector = (() => {
    let apiKey = null;
    let useAI = false;
    let cache = new Map();
    const CACHE_TTL = 3600000; // 1 hour cache

    /**
     * Initialize the AI detector with API key
     */
    const init = (key, enabled = true) => {
        apiKey = key;
        useAI = enabled && key;
    };

    /**
     * Enable or disable AI detection
     */
    const setEnabled = (enabled) => {
        useAI = enabled && apiKey;
    };

    /**
     * Update API key
     */
    const setApiKey = (key) => {
        apiKey = key;
        useAI = useAI && key;
    };

    /**
     * Check if AI is enabled
     */
    const isEnabled = () => {
        return useAI && apiKey;
    };

    /**
     * Generate cache key for word pair
     */
    const getCacheKey = (word1, word2) => {
        return `${word1.toLowerCase()}:${word2.toLowerCase()}`;
    };

    /**
     * Get cached result if available and not expired
     */
    const getCached = (word1, word2) => {
        const key = getCacheKey(word1, word2);
        const cached = cache.get(key);
        
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return cached.result;
        }
        
        return null;
    };

    /**
     * Cache a result
     */
    const setCached = (word1, word2, result) => {
        const key = getCacheKey(word1, word2);
        cache.set(key, {
            result: result,
            timestamp: Date.now()
        });
    };

    /**
     * Call Qwen API for rhyme analysis
     */
    const callQwenAPI = async (word1, word2) => {
        if (!apiKey) {
            throw new Error('API key not configured');
        }

        const prompt = `Analyze how well these two words rhyme: "${word1}" and "${word2}". 
Respond with ONLY a number from 0-100 representing rhyme strength, where:
- 100 = perfect rhyme (same ending sound)
- 80-99 = very strong rhyme
- 60-79 = good rhyme/slant rhyme
- 40-59 = weak rhyme/assonance
- 0-39 = no rhyme

Consider phonetic pronunciation, not just spelling. Respond with just the number.`;

        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': window.location.href,
                    'X-Title': 'RhymeRoom'
                },
                body: JSON.stringify({
                    model: 'qwen/qwen-2-7b-instruct',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a rhyme detection expert. Analyze word pairs and return only a numerical score from 0-100.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 10
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content || '0';
            
            // Extract number from response
            const match = content.match(/\d+/);
            const score = match ? parseInt(match[0]) : 0;
            
            return Math.min(100, Math.max(0, score));
        } catch (error) {
            console.error('Qwen API error:', error);
            throw error;
        }
    };

    /**
     * Calculate rhyme strength using AI
     * Falls back to null if AI is disabled or fails
     */
    const calculateRhymeStrength = async (word1, word2) => {
        if (!isEnabled()) {
            return null;
        }

        // Check cache first
        const cached = getCached(word1, word2);
        if (cached !== null) {
            return cached;
        }

        try {
            const score = await callQwenAPI(word1, word2);
            setCached(word1, word2, score);
            return score;
        } catch (error) {
            console.error('AI rhyme detection failed:', error);
            return null;
        }
    };

    /**
     * Batch process multiple word pairs
     * Returns array of results in same order as input pairs
     */
    const batchCalculateStrength = async (wordPairs) => {
        if (!isEnabled()) {
            return wordPairs.map(() => null);
        }

        const results = await Promise.all(
            wordPairs.map(([word1, word2]) => calculateRhymeStrength(word1, word2))
        );

        return results;
    };

    /**
     * Clear the cache
     */
    const clearCache = () => {
        cache.clear();
    };

    /**
     * Get cache statistics
     */
    const getCacheStats = () => {
        return {
            size: cache.size,
            keys: Array.from(cache.keys())
        };
    };

    return {
        init,
        setEnabled,
        setApiKey,
        isEnabled,
        calculateRhymeStrength,
        batchCalculateStrength,
        clearCache,
        getCacheStats
    };
})();
