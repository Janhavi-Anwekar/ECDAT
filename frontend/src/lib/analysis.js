// Mosca's theorem: act before X + Y exceeds Z.
//   X = data lifetime (how long the data must stay secret)
//   Y = migration time (how long the org needs to replace the crypto)
//   Z = quantum timeline (years until a CRQC exists)
// If X + Y > Z, it is already too late → urgent.

export function computeUrgency(X, Y, Z) {
  const margin = Z - (X + Y); // years of slack
  if (margin < 0) {
    return {
      key: 'now',
      label: 'Overdue — act immediately',
      detail: `X + Y = ${X + Y} yrs exceeds Z = ${Z} yrs by ${Math.abs(margin)} yr${Math.abs(margin) === 1 ? '' : 's'}. The system will still be vulnerable when quantum computers arrive.`,
    };
  }
  if (margin <= 5) {
    return {
      key: 'plan',
      label: 'Start migration now',
      detail: `X + Y = ${X + Y} yrs vs Z = ${Z} yrs — only ${margin} yr${margin === 1 ? '' : 's'} of slack. Migration must begin in this planning cycle.`,
    };
  }
  return {
    key: 'monitor',
    label: 'Monitor and schedule',
    detail: `X + Y = ${X + Y} yrs vs Z = ${Z} yrs — ${margin} yrs of slack. Migration can be scheduled normally.`,
  };
}

// Enrich raw findings with Mosca verdicts for a given profile (X, Y) and scenario (Z).
export function enrichFindings(findings, profile, scenario) {
  const urgency = computeUrgency(profile.X, profile.Y, scenario.Z);
  return findings.map((f) => ({
    ...f,
    mosca: { X: profile.X, Y: profile.Y, Z: scenario.Z, urgency },
  }));
}

export const SEVERITY_ORDER = ['critical', 'high', 'medium', 'low', 'safe'];

export const SEVERITY_COLORS = {
  critical: '#c62828',
  high: '#d97706',
  medium: '#b08805',
  low: '#64748b',
  safe: '#15803d',
};

export function summarize(findings) {
  const bySeverity = { critical: 0, high: 0, medium: 0, low: 0, safe: 0 };
  const byType = {};
  let quantumVulnerable = 0;
  let hardcodedKeys = 0;
  const algorithms = new Set();

  for (const f of findings) {
    bySeverity[f.severity] = (bySeverity[f.severity] || 0) + 1;
    byType[f.type] = (byType[f.type] || 0) + 1;
    if (f.quantum_vulnerable) quantumVulnerable += 1;
    if (f.type === 'Key Material') hardcodedKeys += 1;
    algorithms.add(f.algorithm);
  }

  return {
    total: findings.length,
    bySeverity,
    byType,
    quantumVulnerable,
    hardcodedKeys,
    uniqueAlgorithms: algorithms.size,
  };
}
