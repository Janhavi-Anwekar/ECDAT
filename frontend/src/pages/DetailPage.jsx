import SeverityBadge from '../components/SeverityBadge';
import MoscaTimeline from '../components/MoscaTimeline';

const SEVERITY_LABEL = {
  critical: 'Critical severity',
  high: 'High severity',
  medium: 'Medium severity',
  low: 'Low severity',
  safe: 'Quantum-safe',
};

export default function DetailPage({ finding, index, total, onBack, onPrev, onNext }) {
  if (!finding) return null;
  const { mosca } = finding;

  return (
    <div className="fade-in">
      <div className="detail-header">
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← All findings</button>
        <h2>{finding.algorithm}</h2>
        <SeverityBadge severity={finding.severity} large />
        <span className="detail-loc">
          {SEVERITY_LABEL[finding.severity]} · {finding.file}:{finding.line}
        </span>
      </div>

      <div className="detail-layout">
        {/* Left column — the risk story */}
        <div>
          <div className="card card-pad section-block">
            <h3>What was found</h3>
            <p>{finding.description}</p>
            <div className="kv-list" style={{ marginTop: 14 }}>
              <div className="kv-row">
                <span className="kv-key">Artefact type</span>
                <span className="kv-val">{finding.type}</span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Library</span>
                <span className="kv-val">{finding.library}</span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Location</span>
                <span className="kv-val" style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                  {finding.file}:{finding.line}
                </span>
              </div>
            </div>
          </div>

          <div className="card card-pad section-block">
            <h3>Why it is risky</h3>
            <p>{finding.quantum_threat}</p>
          </div>

          <div className="card card-pad section-block">
            <h3>Code context</h3>
            <pre className="code-block">
              <span className="lineno">{finding.line}</span>
              {finding.snippet}
            </pre>
          </div>
        </div>

        {/* Right column — Mosca verdict + recommendation */}
        <div>
          <div className="card card-pad section-block">
            <h3>Quantum timeline (Mosca)</h3>
            <div className={`mosca-verdict ${mosca.urgency.key}`} style={{ marginBottom: 16 }}>
              <strong>{mosca.urgency.label}.</strong> {mosca.urgency.detail}
            </div>
            <MoscaTimeline X={mosca.X} Y={mosca.Y} Z={mosca.Z} />
            <div className="kv-list" style={{ marginTop: 10 }}>
              <div className="kv-row">
                <span className="kv-key">X · data lifetime</span>
                <span className="kv-val">{mosca.X} yrs</span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Y · migration time</span>
                <span className="kv-val">{mosca.Y} yrs</span>
              </div>
              <div className="kv-row">
                <span className="kv-key">Z · quantum arrival</span>
                <span className="kv-val">{mosca.Z} yrs</span>
              </div>
              <div className="kv-row">
                <span className="kv-key">X + Y vs Z</span>
                <span className="kv-val">{mosca.X + mosca.Y} vs {mosca.Z}</span>
              </div>
            </div>
          </div>

          <div className="card card-pad reco-card">
            <div className="card-label">Recommended replacement</div>
            <div className="reco-algo">{finding.recommendation.algorithm}</div>
            <p style={{ color: 'var(--ink-2)', fontSize: 13.5, margin: '4px 0 10px' }}>
              {finding.recommendation.family}
            </p>
            <p style={{ fontSize: 14.5 }}>{finding.recommendation.note}</p>
            <div className="kv-row" style={{ marginTop: 12 }}>
              <span className="kv-key">Est. migration effort</span>
              <span className="kv-val">{finding.recommendation.effort}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="prev-next">
        <button className="btn btn-ghost btn-sm" onClick={onPrev} disabled={index <= 0}>
          ← Previous finding
        </button>
        <span style={{ alignSelf: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-2)' }}>
          {index + 1} / {total}
        </span>
        <button className="btn btn-ghost btn-sm" onClick={onNext} disabled={index >= total - 1}>
          Next finding →
        </button>
      </div>
    </div>
  );
}
