export default function StatCard({ value, label, tone = '' }) {
  return (
    <div className={`card stat-card ${tone ? `tone-${tone}` : ''}`}>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}
