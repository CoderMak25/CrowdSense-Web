const elphinstoneScript = [];

// Helper to interpolate between two numbers
const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

// 30 ticks total, mimicking Elphinstone bridge build-up
for (let i = 1; i <= 30; i++) {
    const timeOffset = i * 30; // 30s per tick
    let density, riskScore, crowdLevel, motionLabel, narrative, isAnomaly = false, alertFired = false, alertMessage = null;

    if (i <= 6) {
        // Ticks 1-6 (0-3 min): Normal morning rush
        density = lerp(0.3, 0.5, i/6);
        riskScore = lerp(15, 35, i/6);
        crowdLevel = i < 4 ? 'LOW' : 'MODERATE';
        motionLabel = 'FREE';
        narrative = "Normal morning commute. Density steady.";
    } else if (i <= 12) {
        // Ticks 7-12 (3-6 min): Crowd building
        const t = (i - 6) / 6;
        density = lerp(0.5, 0.7, t);
        riskScore = lerp(35, 55, t);
        crowdLevel = 'MODERATE';
        motionLabel = 'SHUFFLE';
        narrative = "Crowd building up rapidly from train arrivals.";
    } else if (i <= 18) {
        // Ticks 13-18 (6-9 min): Dangerous surge
        const t = (i - 12) / 6;
        density = lerp(0.7, 0.85, t);
        riskScore = lerp(55, 72, t);
        crowdLevel = 'HIGH';
        motionLabel = 'STILL';
        narrative = "Dangerous surge detected. People barely moving.";
    } else if (i <= 22) {
        // Ticks 19-22 (9-11 min): CRITICAL threshold
        const t = (i - 18) / 4;
        density = lerp(0.85, 0.95, t);
        riskScore = lerp(72, 88, t);
        crowdLevel = 'CRITICAL';
        motionLabel = i === 21 || i === 22 ? 'CRUSH' : 'STILL';
        isAnomaly = true;
        
        if (i === 19) narrative = "Critical point reached. Warning systems would trigger.";
        if (i === 20) narrative = "Crowd geometry collapsing.";
        if (i === 21) {
            narrative = "CrowdSense would have alerted 14 minutes before the stampede";
            alertFired = true;
            alertMessage = "⚠️ THIS IS WHERE 22 PEOPLE DIED";
        }
        if (i === 22) narrative = "Actual stampede event occurred here in 2017.";

    } else {
        // Ticks 23-30 (11-15 min): What CrowdSense would have done
        const t = (i - 22) / 8;
        density = lerp(0.95, 0.4, t);
        riskScore = lerp(88, 20, t);
        crowdLevel = riskScore > 75 ? 'CRITICAL' : (riskScore > 60 ? 'HIGH' : (riskScore > 40 ? 'MODERATE' : 'LOW'));
        motionLabel = 'FREE';
        narrative = "REROUTED — Alternate path activated early. 22 lives saved.";
    }

    elphinstoneScript.push({
        tick: i,
        timeOffset,
        venueId: "cst-mumbai", // Simulating at CST for the demo as requested
        zoneId: "zone-a",
        density: parseFloat(density.toFixed(2)),
        riskScore: Math.round(riskScore),
        crowdLevel,
        motionLabel,
        triggeredBy: crowdLevel === 'CRITICAL' ? ["HIGH_DENSITY", "CRUSH_MOTION"] : ["HIGH_DENSITY"],
        isAnomaly,
        alertFired,
        alertMessage,
        narrative
    });
}

module.exports = elphinstoneScript;
