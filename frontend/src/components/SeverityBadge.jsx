const LABELS = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  safe: 'Safe',
};

export default function SeverityBadge({ severity, large = false }) {
  return <span className={`badge ${severity} ${large ? 'lg' : ''}`}>{LABELS[severity] || severity}</span>;
}
