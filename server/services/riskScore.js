const { spawn } = require('child_process');
const path = require('path');

class RiskScoreEngine {
    static async compute(venueId, zoneId, fusedDensity, motionLabel, previousDensity, previousTimestamp, recentDensities) {
        // Density Score (0-100)
        const densityScore = Math.min(fusedDensity * 100, 100) || 0;

        // Motion Score
        let motionScore = 0;
        if (motionLabel === 'CRUSH') motionScore = 100;
        else if (motionLabel === 'STILL') motionScore = 70;
        else if (motionLabel === 'SHUFFLE') motionScore = 40;

        // Surge Rate 
        let surgeRate = 0;
        if (previousTimestamp && previousDensity !== undefined) {
            const timeDiffMins = (Date.now() - new Date(previousTimestamp).getTime()) / 60000;
            if (timeDiffMins > 0) {
                const rate = (fusedDensity - previousDensity) / timeDiffMins;
                surgeRate = Math.max(0, Math.min(rate * 100, 100)); // Clamp 0-100
            }
        }

        // Anomaly Score (runs sklearn via python)
        const anomalyScore = await this.runIsolationForest(recentDensities, fusedDensity);

        // Core Formula
        let riskScore = (densityScore * 0.40) + (motionScore * 0.25) + (surgeRate * 0.20) + (anomalyScore * 0.15);
        
        // Rules
        if (motionLabel === 'CRUSH') riskScore = Math.max(riskScore, 90);
        riskScore = Math.max(0, Math.min(riskScore, 100)); // Clamp

        let crowdLevel = 'LOW';
        if (riskScore >= 75) crowdLevel = 'CRITICAL';
        else if (riskScore >= 50) crowdLevel = 'HIGH';
        else if (riskScore >= 25) crowdLevel = 'MODERATE';

        const triggeredBy = [];
        if (motionLabel === 'CRUSH') triggeredBy.push('CRUSH_MOTION');
        if (densityScore >= 75) triggeredBy.push('HIGH_DENSITY');
        if (anomalyScore >= 70) triggeredBy.push('ANOMALY');

        return {
            riskScore,
            crowdLevel,
            densityScore,
            motionScore,
            surgeRateScore: surgeRate,
            anomalyScore,
            isAnomaly: anomalyScore >= 70, // dynamic classification
            triggeredBy
        };
    }

    static async runIsolationForest(recentDensities, currentDensity) {
        if (!recentDensities || recentDensities.length < 10) return 0;
        return new Promise((resolve) => {
            const pyProg = spawn('python', [path.join(__dirname, '../scripts/iforest.py')]);
            const input = JSON.stringify({ history: recentDensities, current: currentDensity });
            let dataStr = '';
            
            pyProg.stdout.on('data', (data) => dataStr += data.toString());
            pyProg.stdin.write(input);
            pyProg.stdin.end();
            pyProg.on('close', () => {
                try {
                    const result = JSON.parse(dataStr);
                    resolve(result.anomaly_score || 0);
                } catch(e) { resolve(0); }
            });
            pyProg.on('error', () => resolve(0)); 
        });
    }
}
module.exports = RiskScoreEngine;
