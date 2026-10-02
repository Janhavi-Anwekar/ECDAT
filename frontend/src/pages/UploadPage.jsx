import { useRef, useState } from 'react';
import sample from '../data/sampleResults.json';

const STAGES = [
  'Uploading files…',
  'Parsing source & detecting languages…',
  'Pattern matching cryptographic artefacts…',
  'Scoring quantum risk (Shor / Grover)…',
  'Applying Mosca X + Y vs Z…',
  'Generating CBOM…',
];

export default function UploadPage({ onComplete }) {
  const [files, setFiles] = useState([]);
  const [profileId, setProfileId] = useState('');
  const [scenarioId, setScenarioId] = useState('');
  const [scanning, setScanning] = useState(false);
  const [stageIdx, setStageIdx] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const profile = sample.profiles_available.find((p) => p.id === profileId);
  const scenario = sample.scenarios_available.find((s) => s.id === scenarioId);
  const ready = files.length > 0 && profile && scenario;

  // function addFiles(list) {
  //   const names = Array.from(list).map((f) => f.name);
  //   setFiles((prev) => [...new Set([...prev, ...names])]);
  // }

  function addFiles(list) {
    const incoming = Array.from(list);
    setFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.name));
      const merged = [...prev];
      incoming.forEach((f) => { if (!existingNames.has(f.name)) merged.push(f); });
      return merged;
    });
  }

  function runScan() {
    if (!ready) return;
    setScanning(true);
    setStageIdx(0);
    let i = 0;
    const tick = () => {
      i += 1;
      if (i < STAGES.length) {
        setStageIdx(i);
        setTimeout(tick, 260 + Math.random() * 200);
      } else {
        setTimeout(() => {
          onComplete({
            files,
            profile,
            scenario,
            meta: sample.scan_metadata,
          });
        }, 350);
      }
    };
    setTimeout(tick, 350);
  }

  if (scanning) {
    return (
      <div className="upload-layout fade-in">
        <div className="card card-pad scan-progress">
          <div className="dropzone__icon" style={{ background: 'var(--steel-100)' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
          </div>
          <div className="dropzone__title">Scanning {files.length} file{files.length === 1 ? '' : 's'}…</div>
          <div className="scan-progress__bar">
            <div className="scan-progress__fill" style={{ width: `${((stageIdx + 1) / STAGES.length) * 100}%` }} />
          </div>
          <div className="scan-progress__stage">{STAGES[stageIdx]}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-layout fade-in">
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <h1 className="page-title">Scan a codebase</h1>
        <p className="page-sub">Upload source files, then set the planning assumptions for quantum risk.</p>
      </div>

      {/* Step 1 — files */}
      <div className="card card-pad">
        <div className="card-label">Step 1 · Scan input</div>
        <div
          className={`dropzone ${dragOver ? 'dragover' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        >
          <div className="dropzone__icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div className="dropzone__title">Drop Resources here.</div>
          <div className="dropzone__hint">.py · .java · .js · .go · .c · whole .zip or repo link </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>
        {files.length > 0 && (
          <div className="file-chips">
            {files.map((file) => (
              <span key={file.name} className="file-chip">
                {file.name}
                <button
                  onClick={(e) => { e.stopPropagation(); setFiles(files.filter((f) => f !== file)); }}
                  aria-label={`Remove ${file.name}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Step 2 — parameters */}
      <div className="card card-pad">
        <div className="card-label">Step 2 · Planning assumptions (Mosca's theorem)</div>
        <div className="param-grid">
          <div>
            <label htmlFor="profile" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
              Data profile — sets X and Y
            </label>
            <select
              id="profile"
              className="field"
              value={profileId}
              onChange={(e) => setProfileId(e.target.value)}
            >
              <option value="">Select a profile…</option>
              {sample.profiles_available.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label} — X: {p.X} yrs, Y: {p.Y} yrs
                </option>
              ))}
            </select>
            <div className="param-hint">
              {profile
                ? <>X (data lifetime) = <strong>{profile.X} yrs</strong> · Y (migration time) = <strong>{profile.Y} yrs</strong> — {profile.note}</>
                : 'X = how long the data must stay secret · Y = how long migration takes'}
            </div>
          </div>

          <div>
            <label htmlFor="scenario" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
              Quantum scenario — sets Z
            </label>
            <select
              id="scenario"
              className="field"
              value={scenarioId}
              onChange={(e) => setScenarioId(e.target.value)}
            >
              <option value="">Select a scenario…</option>
              {sample.scenarios_available.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} — Z: {s.Z} yrs
                </option>
              ))}
            </select>
            <div className="param-hint">
              {scenario
                ? <>Z (quantum arrival) = <strong>{scenario.Z} yrs</strong> — {scenario.note}</>
                : 'Nobody can predict the exact year — pick an assumption to plan around'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        <button className="btn btn-primary" onClick={runScan} disabled={!ready}>
          Run scan
        </button>
      </div>
    </div>
  );
}
