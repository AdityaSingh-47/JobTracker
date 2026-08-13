import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

function JobTable({ jobs, onDelete }) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <p className="mb-3">No job applications found.</p>
        <Link to="/jobs/add" className="btn btn-primary">Add Your First Application</Link>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle bg-white">
        <thead className="table-light">
          <tr>
            <th>Company</th>
            <th>Job Title</th>
            <th>Status</th>
            <th>Applied Date</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>
                <Link to={`/jobs/${job.id}`} className="fw-semibold text-decoration-none">
                  {job.companyName}
                </Link>
              </td>
              <td>{job.jobTitle}</td>
              <td><StatusBadge status={job.status} /></td>
              <td>{formatDate(job.appliedDate)}</td>
              <td>{job.location || '-'}</td>
              <td>
                <div className="d-flex gap-2">
                  <Link to={`/jobs/${job.id}/edit`} className="btn btn-sm btn-outline-primary">
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(job.id, job.companyName)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JobTable;
