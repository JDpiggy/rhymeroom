/**
 * Quick validation script to test the rhyme scoring system
 * Run this in a Node.js environment or browser console after loading rhymeDetector.js
 * 
 * Expected Results:
 * - Perfect rhymes: 100
 * - "sound"/"town": 80-90 (strong near-rhyme)
 * - "sound"/"house": 40-60 (weak rhyme)
 * - Non-rhymes: 0-20
 */

const validateRhymeScoring = () => {
    console.log('%c════════════════════════════════════════════════════════', 'color: cyan; font-weight: bold;');
    console.log('%c  Rhyme Scoring System - Quick Validation', 'color: cyan; font-weight: bold; font-size: 14px;');
    console.log('%c════════════════════════════════════════════════════════\n', 'color: cyan; font-weight: bold;');

    if (typeof RhymeDetector === 'undefined') {
        console.error('❌ RhymeDetector module not found. Make sure rhymeDetector.js is loaded.');
        return false;
    }

    const tests = [
        // Perfect Rhymes (should be 100)
        { word1: 'cat', word2: 'hat', expectedMin: 95, expectedMax: 100, category: 'Perfect' },
        { word1: 'sing', word2: 'ring', expectedMin: 95, expectedMax: 100, category: 'Perfect' },
        { word1: 'love', word2: 'above', expectedMin: 95, expectedMax: 100, category: 'Perfect' },

        // Strong Near-Rhymes (should be 85-94)
        { word1: 'sound', word2: 'town', expectedMin: 78, expectedMax: 90, category: 'Key Test' },
        { word1: 'throne', word2: 'stone', expectedMin: 85, expectedMax: 100, category: 'Near-Rhyme' },
        { word1: 'beat', word2: 'feet', expectedMin: 85, expectedMax: 100, category: 'Near-Rhyme' },

        // Moderate Rhymes (should be 70-84)
        { word1: 'gray', word2: 'play', expectedMin: 70, expectedMax: 85, category: 'Moderate' },
        { word1: 'care', word2: 'share', expectedMin: 80, expectedMax: 95, category: 'Moderate' },

        // Weak Rhymes (should be 40-60)
        { word1: 'sound', word2: 'house', expectedMin: 40, expectedMax: 65, category: 'Weak Test' },
        { word1: 'make', word2: 'milk', expectedMin: 20, expectedMax: 50, category: 'Weak' },

        // Non-Rhymes (should be 0-30)
        { word1: 'cat', word2: 'dog', expectedMin: 0, expectedMax: 30, category: 'Non-Rhyme' },
        { word1: 'happy', word2: 'car', expectedMin: 0, expectedMax: 30, category: 'Non-Rhyme' },
    ];

    let passed = 0;
    let failed = 0;

    tests.forEach(test => {
        const score = RhymeDetector.calculateRhymeStrength(test.word1, test.word2);
        const isPass = score >= test.expectedMin && score <= test.expectedMax;

        const status = isPass ? '✅' : '❌';
        const detail = `${test.word1.padEnd(10)} ↔ ${test.word2.padEnd(10)} = ${String(score).padStart(3)} (expected ${test.expectedMin}-${test.expectedMax})`;

        console.log(`${status} [${test.category.padEnd(13)}] ${detail}`);

        if (isPass) {
            passed++;
        } else {
            failed++;
        }
    });

    console.log('\n%c════════════════════════════════════════════════════════', 'color: cyan; font-weight: bold;');
    console.log(`%c✓ Passed: ${passed}/${tests.length}`, passed === tests.length ? 'color: #4CAF50; font-weight: bold;' : 'color: #FFC107; font-weight: bold;');
    if (failed > 0) {
        console.log(`%c✗ Failed: ${failed}/${tests.length}`, 'color: #F44336; font-weight: bold;');
    }
    console.log('%c════════════════════════════════════════════════════════\n', 'color: cyan; font-weight: bold;');

    // Key test results
    console.log('%c📊 Key Findings:', 'font-weight: bold; color: #2196F3;');
    const soundTown = RhymeDetector.calculateRhymeStrength('sound', 'town');
    const soundHouse = RhymeDetector.calculateRhymeStrength('sound', 'house');
    const catHat = RhymeDetector.calculateRhymeStrength('cat', 'hat');

    console.log(`  • "sound" vs "town"   = ${soundTown} (was 55 in old system) ${soundTown >= 78 ? '✓' : '✗'}`);
    console.log(`  • "sound" vs "house"  = ${soundHouse} (was 55 in old system) ${soundHouse < soundTown ? '✓' : '✗'}`);
    console.log(`  • "cat" vs "hat"      = ${catHat} (perfect rhyme) ${catHat === 100 ? '✓' : '✗'}`);

    console.log('\n%c💡 System Status:', 'font-weight: bold; color: #2196F3;');
    if (passed === tests.length) {
        console.log('%c✓ Rhyme scoring system is working correctly!', 'color: #4CAF50; font-weight: bold;');
        return true;
    } else {
        console.log('%c⚠ Some tests failed. Check the implementation.', 'color: #FFC107; font-weight: bold;');
        return false;
    }
};

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validateRhymeScoring };
}

// Auto-run if script is loaded
if (typeof window !== 'undefined') {
    console.log('%c✓ Validation script loaded. Run validateRhymeScoring() to test.', 'color: #FFC107; font-size: 11px;');
}
