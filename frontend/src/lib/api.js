const API_URL = 'http://localhost:8080';

// Converts one backend AssetRisk into the shape sampleResults.json uses,

function toFinding(asset, index) {
    return {
        id: `F-${String(index + 1).padStart(3, '0')}`,
        algorithm: asset.name,
        type: asset.quantumVulnerable ? 'Asymmetric' : 'Hash', // refine later if backend adds a real type
        file: '—',        // backend doesn't send location yet — see note below
        line: null,
        library: '—',
        severity: mapRiskToSeverity(asset.risk),
        quantum_vulnerable: asset.quantumVulnerable,
        quantum_threat: asset.reason,
        description: asset.reason,
        snippet: '',
        recommendation: asset.recommendation
            ? {
                algorithm: asset.recommendation.primary,
                family: asset.recommendation.hybrid,
                note: asset.recommendation.tradeoff,
                effort: '—',
            }
            : null,
        // Pre-computed by the backend — the frontend must NOT recalculate this.
        mosca: {
            X: asset.dataLifetimeYears,
            Y: asset.migrationYears,
            Z: asset.yearsToCrqc,
            urgency: {
                key: mapRiskToUrgencyKey(asset.risk),
                label: asset.risk,
                detail: `Mosca margin: ${asset.moscaMargin} yrs`,
            },
        },
    };
}

function mapRiskToSeverity(risk) {
    return risk.toLowerCase(); // CRITICAL -> critical, matches SEVERITY_COLORS keys
}

function mapRiskToUrgencyKey(risk) {
    if (risk === 'CRITICAL' || risk === 'HIGH') return 'now';
    if (risk === 'MEDIUM') return 'plan';
    return 'monitor';
}

export async function runScan(files, profile, scenario) {
    const formData = new FormData();
    files.forEach((f) => formData.append('file', f));
    formData.append('profile', profile.id.toUpperCase()); // DEFENSE / FINANCIAL / etc.
    formData.append('z', scenario.Z);

    const res = await fetch(`${API_URL}/api/scans`, { method: 'POST', body: formData });
    if (!res.ok) throw new Error(`Scan failed: ${res.status}`);
    const data = await res.json();

    return {
        scan_id: `SCAN-${data.id}`,
        scan_metadata: { files_scanned: files.length },
        findings: data.assets.map(toFinding),
    };
}