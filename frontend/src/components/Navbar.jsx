import React from 'react';

const STEPS = [
  { id: 'upload', label: 'Upload' },
  { id: 'overview', label: 'Overview' },
  { id: 'detail', label: 'Details' },
];

export default function Navbar({ current }) {
  const idx = STEPS.findIndex((s) => s.id === current);
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <div className="brand-mark">EC</div>
          <div className="brand-name">ECDAT</div>
        </div>
        <div className="brand-sub">ENTERPRISE CRYPTOGRAPHIC DISCOVERY & ANALYSIS TOOL</div>
        <nav className="nav-steps" aria-label="Progress">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              {i > 0 && <span className="nav-step-sep">›</span>}
              <span className={`nav-step ${i < idx ? 'done' : ''} ${i === idx ? 'active' : ''}`}>
                <span className="nav-step__num">{i + 1}</span>
                {s.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>
    </header>
  );
}
