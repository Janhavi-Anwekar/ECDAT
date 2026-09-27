// Horizontal timeline visualising Mosca's inequality X + Y vs Z.
//  [==== X: data lifetime ====][== Y: migration ==]   ← org timeline
//                    ▲ Z: quantum arrives
//  If the org timeline crosses Z before finishing, the finding is urgent.

export default function MoscaTimeline({ X, Y, Z }) {
  const W = 640;
  const H = 132;
  const PAD_L = 16;
  const PAD_R = 16;
  const BAR_Y = 62;
  const BAR_H = 26;

  const domain = Math.max(X + Y, Z) * 1.12;
  const scale = (yr) => PAD_L + (yr / domain) * (W - PAD_L - PAD_R);

  const xEnd = scale(X);
  const yEnd = scale(X + Y);
  const zX = scale(Z);
  const crossed = X + Y > Z;

  // year ticks every 5
  const ticks = [];
  for (let yr = 0; yr <= domain; yr += 5) {
    const tx = scale(yr);
    if (tx > W - 20) break;
    ticks.push(
      <g key={yr}>
        <line x1={tx} y1={BAR_Y + BAR_H + 6} x2={tx} y2={BAR_Y + BAR_H + 12} stroke="#cbd5e1" strokeWidth={1} />
        <text x={tx} y={BAR_Y + BAR_H + 26} textAnchor="middle" fontSize={10.5} fill="#7c8794" fontFamily="'JetBrains Mono', monospace">
          {yr}
        </text>
      </g>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }} role="img"
      aria-label={`Mosca timeline: data lifetime ${X} years plus migration ${Y} years versus quantum arrival in ${Z} years`}>
      {/* exposure region beyond Z */}
      {crossed && (
        <rect x={zX} y={BAR_Y - 6} width={Math.max(yEnd - zX, 0)} height={BAR_H + 12}
          fill="rgba(198, 40, 40, 0.10)" rx={4} />
      )}

      {/* X segment */}
      <rect x={PAD_L} y={BAR_Y} width={xEnd - PAD_L} height={BAR_H} rx={4} fill="#3e6b96" />
      <text x={(PAD_L + xEnd) / 2} y={BAR_Y - 10} textAnchor="middle" fontSize={12} fontWeight={600} fill="#24425f" fontFamily="'Barlow Condensed', sans-serif" letterSpacing="0.5">
        X · DATA LIFETIME {X} YRS
      </text>

      {/* Y segment */}
      <rect x={xEnd + 2} y={BAR_Y} width={Math.max(yEnd - xEnd - 2, 2)} height={BAR_H} rx={4} fill="#d97706" />
      <text x={(xEnd + yEnd) / 2} y={BAR_Y + BAR_H + 42} textAnchor="middle" fontSize={12} fontWeight={600} fill="#b45309" fontFamily="'Barlow Condensed', sans-serif" letterSpacing="0.5">
        Y · MIGRATION {Y} YRS
      </text>

      {/* Z marker */}
      <line x1={zX} y1={18} x2={zX} y2={BAR_Y + BAR_H + 14} stroke="#c62828" strokeWidth={2} strokeDasharray="5 4" />
      <text x={zX} y={12} textAnchor={zX > W - 110 ? 'end' : 'middle'} fontSize={12} fontWeight={700} fill="#c62828" fontFamily="'Barlow Condensed', sans-serif" letterSpacing="0.5">
        Z · QUANTUM ARRIVES (YR {Z})
      </text>

      {ticks}

      {/* total marker */}
      <line x1={yEnd} y1={BAR_Y - 2} x2={yEnd} y2={BAR_Y + BAR_H + 2} stroke="#17212f" strokeWidth={1.5} />
    </svg>
  );
}
