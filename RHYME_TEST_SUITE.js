/**
 * Rhyme Scoring System - Comprehensive Test Suite
 * 
 * This file demonstrates and validates the robust rhyme-scoring system
 * with a variety of test cases covering different rhyme types and edge cases.
 * 
 * Run in browser console: RhymeTest.runAllTests()
 */

const RhymeTest = (() => {
    /**
     * Test result object
     */
    class TestResult {
        constructor(word1, word2, score, category, notes = '') {
            this.word1 = word1;
            this.word2 = word2;
            this.score = score;
            this.category = category;
            this.notes = notes;
        }

        toString() {
            return `${this.word1.padEnd(15)} ↔ ${this.word2.padEnd(15)} | Score: ${String(this.score).padStart(3)} | ${this.category.padEnd(25)} | ${this.notes}`;
        }

        toHTML() {
            const colors = {
                'Perfect Rhyme': '#4CAF50',           // Green
                'Strong Near-Rhyme': '#8BC34A',      // Light Green
                'Near-Rhyme': '#FFC107',             // Amber
                'Assonant Rhyme': '#FF9800',         // Orange
                'Weak Rhyme': '#F44336',             // Red
                'Non-Rhyme': '#9E9E9E'               // Gray
            };

            const bgColor = colors[this.category] || '#9E9E9E';
            const textColor = this.score > 60 ? '#000' : '#fff';

            return `
                <tr style="background-color: ${bgColor}; color: ${textColor}; font-weight: bold;">
                    <td>${this.word1}</td>
                    <td>${this.word2}</td>
                    <td>${this.score}</td>
                    <td>${this.category}</td>
                    <td>${this.notes}</td>
                </tr>
            `;
        }
    }

    /**
     * Categorize score into rhyme type
     */
    const categorizeScore = (score) => {
        if (score >= 95) return 'Perfect Rhyme';
        if (score >= 85) return 'Strong Near-Rhyme';
        if (score >= 70) return 'Near-Rhyme';
        if (score >= 60) return 'Assonant Rhyme';
        if (score >= 40) return 'Weak Rhyme';
        return 'Non-Rhyme';
    };

    /**
     * Run all test suites
     */
    const runAllTests = () => {
        console.clear();
        console.log('%c═══════════════════════════════════════════════════════════════════════', 'color: cyan; font-weight: bold;');
        console.log('%c  ROBUST RHYME SCORING SYSTEM - COMPREHENSIVE TEST SUITE', 'color: cyan; font-weight: bold; font-size: 14px;');
        console.log('%c═══════════════════════════════════════════════════════════════════════', 'color: cyan; font-weight: bold;');
        console.log('');

        const allResults = [];

        // Run test groups
        const perfectTests = testPerfectRhymes();
        allResults.push(...perfectTests);

        const strongTests = testStrongNearRhymes();
        allResults.push(...strongTests);

        const nearTests = testNearRhymes();
        allResults.push(...nearTests);

        const assonanceTests = testAssonantRhymes();
        allResults.push(...assonanceTests);

        const weakTests = testWeakRhymes();
        allResults.push(...weakTests);

        const nonTests = testNonRhymes();
        allResults.push(...nonTests);

        const edgeCaseTests = testEdgeCases();
        allResults.push(...edgeCaseTests);

        // Print summary statistics
        printSummaryStatistics(allResults);

        return allResults;
    };

    /**
     * Test perfect rhymes (95-100)
     */
    const testPerfectRhymes = () => {
        console.log('%c✓ PERFECT RHYMES (95-100)', 'color: #4CAF50; font-weight: bold; font-size: 12px;');
        console.log('Words with identical rime structures should score 100\n');

        const testCases = [
            ['cat', 'hat'],
            ['bat', 'rat'],
            ['sing', 'ring'],
            ['make', 'take'],
            ['love', 'above'],
            ['bright', 'night'],
            ['green', 'seen'],
            ['phone', 'tone'],
            ['place', 'face'],
            ['peace', 'piece']
        ];

        const results = [];
        testCases.forEach(([word1, word2]) => {
            const score = RhymeDetector.calculateRhymeStrength(word1, word2);
            const category = categorizeScore(score);
            const result = new TestResult(word1, word2, score, category, 'Identical rime');
            results.push(result);
            console.log(result.toString());
        });

        console.log('');
        return results;
    };

    /**
     * Test strong near-rhymes (85-94)
     */
    const testStrongNearRhymes = () => {
        console.log('%c✓ STRONG NEAR-RHYMES (85-94)', 'color: #8BC34A; font-weight: bold; font-size: 12px;');
        console.log('Words with minor phonetic differences\n');

        const testCases = [
            ['throne', 'stone', 'Last 3 chars match'],
            ['sound', 'round', 'Both end in -ound'],
            ['sound', 'bound', 'Both end in -ound, ou nucleus'],
            ['beat', 'feet', 'Vowel group match: ea/ee'],
            ['heat', 'meat', 'Vowel group match: ea'],
            ['light', 'sight', 'Perfect rime match'],
            ['mile', 'tile', 'Perfect rime match'],
            ['day', 'way', 'Perfect rime match'],
            ['slow', 'show', 'Perfect rime: ow/ow'],
            ['pain', 'main', 'Perfect rime: ain/ain']
        ];

        const results = [];
        testCases.forEach(([word1, word2, note]) => {
            const score = RhymeDetector.calculateRhymeStrength(word1, word2);
            const category = categorizeScore(score);
            const result = new TestResult(word1, word2, score, category, note);
            results.push(result);
            console.log(result.toString());
        });

        console.log('');
        return results;
    };

    /**
     * Test near-rhymes and critical edge cases (70-84)
     */
    const testNearRhymes = () => {
        console.log('%c✓ NEAR-RHYMES & EDGE CASES (70-84)', 'color: #FFC107; font-weight: bold; font-size: 12px;');
        console.log('Words with good phonetic similarity but some differences\n');

        const testCases = [
            ['sound', 'town', 'KEY TEST: Both /aʊn/ nucleus but different consonants'],
            ['gray', 'play', 'Both end in ay, different starting'],
            ['care', 'share', 'Strong near-rhyme, both -are'],
            ['time', 'crime', 'Both -ime ending'],
            ['mind', 'find', 'Both -ind ending'],
            ['rose', 'nose', 'Perfect rime match'],
            ['pen', 'when', 'Perfect rime match'],
            ['bone', 'tone', 'Perfect rime match'],
            ['line', 'mine', 'Perfect rime match'],
            ['fire', 'wire', 'Perfect rime match']
        ];

        const results = [];
        testCases.forEach(([word1, word2, note]) => {
            const score = RhymeDetector.calculateRhymeStrength(word1, word2);
            const category = categorizeScore(score);
            const result = new TestResult(word1, word2, score, category, note);
            results.push(result);
            console.log(result.toString());
        });

        console.log('');
        return results;
    };

    /**
     * Test assonant rhymes (60-69)
     */
    const testAssonantRhymes = () => {
        console.log('%c✓ ASSONANT & WEAK RHYMES (60-69)', 'color: #FF9800; font-weight: bold; font-size: 12px;');
        console.log('Words with vowel harmony but consonant differences\n');

        const testCases = [
            ['lake', 'game', 'Both have a vowel'],
            ['moat', 'boat', 'Perfect rime match'],
            ['sleep', 'deep', 'Perfect rime match'],
            ['shake', 'flame', 'Both -ake/-ame (similar)'],
            ['rain', 'train', 'Perfect rime match'],
            ['meet', 'street', 'Perfect rime match'],
            ['blue', 'shoe', 'ue endings, different consonants'],
            ['flow', 'grow', 'ow endings, perfect match'],
            ['dark', 'park', 'Perfect rime match']
        ];

        const results = [];
        testCases.forEach(([word1, word2, note]) => {
            const score = RhymeDetector.calculateRhymeStrength(word1, word2);
            const category = categorizeScore(score);
            const result = new TestResult(word1, word2, score, category, note);
            results.push(result);
            console.log(result.toString());
        });

        console.log('');
        return results;
    };

    /**
     * Test weak rhymes (40-59)
     */
    const testWeakRhymes = () => {
        console.log('%c✓ WEAK RHYMES (40-59)', 'color: #F44336; font-weight: bold; font-size: 12px;');
        console.log('Words with minimal phonetic similarity\n');

        const testCases = [
            ['sound', 'house', 'KEY TEST: Both ou vowel but nd vs s consonants'],
            ['make', 'milk', 'Different vowel structures'],
            ['cat', 'dot', 'Different vowels and consonants'],
            ['sing', 'song', 'Vowel difference: ing vs ong'],
            ['fast', 'most', 'Different vowels: a vs o'],
            ['light', 'blue', 'igh vs ue - different structure'],
            ['bread', 'thread', 'Perfect rime match'],
            ['hold', 'cold', 'Perfect rime match'],
            ['ball', 'fall', 'Perfect rime match'],
            ['girl', 'pearl', 'Perfect rime match']
        ];

        const results = [];
        testCases.forEach(([word1, word2, note]) => {
            const score = RhymeDetector.calculateRhymeStrength(word1, word2);
            const category = categorizeScore(score);
            const result = new TestResult(word1, word2, score, category, note);
            results.push(result);
            console.log(result.toString());
        });

        console.log('');
        return results;
    };

    /**
     * Test non-rhymes (0-39)
     */
    const testNonRhymes = () => {
        console.log('%c✓ NON-RHYMES (0-39)', 'color: #9E9E9E; font-weight: bold; font-size: 12px;');
        console.log('Words with no phonetic similarity\n');

        const testCases = [
            ['cat', 'dog', 'Completely different'],
            ['happy', 'car', 'Completely different'],
            ['book', 'table', 'Completely different'],
            ['tree', 'jump', 'Completely different'],
            ['fish', 'sun', 'Completely different'],
            ['moon', 'desk', 'Completely different'],
            ['run', 'sit', 'Completely different'],
            ['apple', 'blue', 'Completely different'],
            ['water', 'fire', 'Completely different'],
            ['house', 'sky', 'Completely different']
        ];

        const results = [];
        testCases.forEach(([word1, word2, note]) => {
            const score = RhymeDetector.calculateRhymeStrength(word1, word2);
            const category = categorizeScore(score);
            const result = new TestResult(word1, word2, score, category, note);
            results.push(result);
            console.log(result.toString());
        });

        console.log('');
        return results;
    };

    /**
     * Test edge cases
     */
    const testEdgeCases = () => {
        console.log('%c✓ EDGE CASES & SPECIAL CONDITIONS', 'color: #2196F3; font-weight: bold; font-size: 12px;');
        console.log('Homophones, words with different syllable counts, etc.\n');

        const testCases = [
            ['to', 'too', 'Homophones (different spelling)'],
            ['bear', 'bare', 'Homophones (different spelling)'],
            ['be', 'bee', 'Homophones (different spelling)'],
            ['know', 'no', 'Homophones (different spelling)'],
            ['right', 'write', 'Homophones (different spelling)'],
            ['read', 'red', 'Homophones (different spelling)'],
            ['through', 'threw', 'Homophones'],
            ['tail', 'tale', 'Homophones'],
            ['one', 'won', 'Homophones'],
            ['knight', 'night', 'Homophones (kn silent)'],
            ['psychology', 'easy', 'Different syllable counts with similar endings'],
            ['photograph', 'laugh', 'Both have -agh sound'],
            ['through', 'blue', 'Different but similar vowel'],
            ['cough', 'off', 'Similar vowel: au/o'],
            ['tough', 'stuff', 'Similar structure: ough/uff']
        ];

        const results = [];
        testCases.forEach(([word1, word2, note]) => {
            const score = RhymeDetector.calculateRhymeStrength(word1, word2);
            const category = categorizeScore(score);
            const result = new TestResult(word1, word2, score, category, note);
            results.push(result);
            console.log(result.toString());
        });

        console.log('');
        return results;
    };

    /**
     * Print summary statistics
     */
    const printSummaryStatistics = (results) => {
        console.log('%c═══════════════════════════════════════════════════════════════════════', 'color: cyan; font-weight: bold;');
        console.log('%c  SUMMARY STATISTICS', 'color: cyan; font-weight: bold; font-size: 12px;');
        console.log('%c═══════════════════════════════════════════════════════════════════════', 'color: cyan; font-weight: bold;');
        console.log('');

        const stats = {
            'Perfect Rhyme': 0,
            'Strong Near-Rhyme': 0,
            'Near-Rhyme': 0,
            'Assonant Rhyme': 0,
            'Weak Rhyme': 0,
            'Non-Rhyme': 0
        };

        let totalScore = 0;
        results.forEach(result => {
            stats[result.category]++;
            totalScore += result.score;
        });

        const avgScore = (totalScore / results.length).toFixed(1);

        console.log(`Total Tests: ${results.length}`);
        console.log(`Average Score: ${avgScore}/100`);
        console.log('');
        console.log('Distribution by Category:');
        Object.entries(stats).forEach(([category, count]) => {
            const percentage = ((count / results.length) * 100).toFixed(1);
            console.log(`  ${category.padEnd(25)}: ${String(count).padStart(2)} tests (${String(percentage).padStart(5)}%)`);
        });

        console.log('');
        console.log('%c✓ KEY TEST RESULTS:', 'color: #2196F3; font-weight: bold;');

        // Find specific tests
        const keyTests = results.filter(r => 
            (r.word1 === 'sound' && r.word2 === 'town') ||
            (r.word1 === 'sound' && r.word2 === 'house') ||
            (r.word1 === 'cat' && r.word2 === 'hat')
        );

        keyTests.forEach(test => {
            const emoji = test.score >= 70 ? '✓' : '✗';
            console.log(`  ${emoji} "${test.word1}" ↔ "${test.word2}" = ${test.score} (${test.category})`);
        });

        console.log('');
        console.log('%cNotes:', 'font-weight: bold;');
        console.log('- "sound" vs "town" should score ~80+: Both share /aʊn/ nucleus');
        console.log('- "sound" vs "house": Should be lower (~50) as consonants differ');
        console.log('- "cat" vs "hat": Perfect rhyme, should be 100');
        console.log('');

        // Create HTML table for visual inspection
        createHTMLReport(results);
    };

    /**
     * Create an HTML table for visual inspection in browser
     */
    const createHTMLReport = (results) => {
        const htmlContent = `
            <div id="rhyme-test-report" style="
                position: fixed;
                right: 20px;
                top: 20px;
                width: 800px;
                max-height: 600px;
                overflow-y: auto;
                background: #f5f5f5;
                border: 2px solid #2196F3;
                border-radius: 8px;
                padding: 20px;
                z-index: 10000;
                font-family: monospace;
                font-size: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            ">
                <button onclick="document.getElementById('rhyme-test-report').remove();" style="
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    padding: 5px 10px;
                    background: #f44336;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">✕ Close</button>
                
                <h3 style="margin-top: 0; color: #2196F3;">Rhyme Scoring Test Report</h3>
                
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #2196F3; color: white; font-weight: bold;">
                            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Word 1</th>
                            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Word 2</th>
                            <th style="padding: 8px; text-align: center; border: 1px solid #ddd;">Score</th>
                            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Category</th>
                            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${results.map(r => r.toHTML()).join('\n')}
                    </tbody>
                </table>
            </div>
        `;

        // Inject into document
        if (typeof document !== 'undefined') {
            const temp = document.createElement('div');
            temp.innerHTML = htmlContent;
            document.body.appendChild(temp.firstElementChild);
            console.log('%c✓ Visual report opened in browser (check top-right corner)', 'color: #4CAF50; font-weight: bold;');
        }
    };

    // Public API
    return {
        runAllTests,
        testPerfectRhymes,
        testStrongNearRhymes,
        testNearRhymes,
        testAssonantRhymes,
        testWeakRhymes,
        testNonRhymes,
        testEdgeCases,
        categorizeScore
    };
})();

// Auto-run tests if in a suitable environment
if (typeof RhymeDetector !== 'undefined') {
    console.log('%cℹ Run tests with: RhymeTest.runAllTests()', 'color: #FF9800; font-weight: bold; font-size: 11px;');
}
