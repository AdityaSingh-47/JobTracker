import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

function JobCard({ job }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0">{job.companyName}</h5>
          <StatusBadge status={job.status} />
        </div>
        <p className="text-muted mb-2">{job.jobTitle}</p>
        <small className="text-muted">Applied: {formatDate(job.appliedDate)}</small>
      </div>
      <div className="card-footer bg-white border-0">
        <Link to={`/jobs/${job.id}`} className="btn btn-sm btn-outline-primary">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default JobCard;
