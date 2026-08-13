const STATUS_CONFIG = {
  APPLIED: { label: 'Applied', className: 'bg-primary' },
  SCREENING: { label: 'Screening', className: 'bg-info text-dark' },
  INTERVIEW: { label: 'Interview', className: 'bg-warning text-dark' },
  OFFER: { label: 'Offer', className: 'bg-success' },
  REJECTED: { label: 'Rejected', className: 'bg-danger' },
  WITHDRAWN: { label: 'Withdrawn', className: 'bg-secondary' },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, className: 'bg-secondary' };

  return (
    <span className={`badge ${config.className}`}>
      {config.label}
    </span>
  );
}

export default StatusBadge;
