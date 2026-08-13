import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { jobsAPI, interviewsAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    interviewDate: '',
    round: '',
    type: 'Online',
    notes: '',
  });
  const [editingInterviewId, setEditingInterviewId] = useState(null);

  const fetchJob = async () => {
    try {
      const response = await jobsAPI.getById(id);
      setJob(response.data);
    } catch (err) {
      setError('Job application not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatJobType = (type) => {
    if (!type) return '-';
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete application for ${job.companyName}?`)) return;
    try {
      await jobsAPI.delete(id);
      navigate('/jobs');
    } catch (err) {
      setError('Failed to delete application');
    }
  };

  const resetInterviewForm = () => {
    setInterviewForm({ interviewDate: '', round: '', type: 'Online', notes: '' });
    setEditingInterviewId(null);
    setShowInterviewForm(false);
  };

  const handleInterviewSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingInterviewId) {
        await interviewsAPI.update(editingInterviewId, interviewForm);
      } else {
        await interviewsAPI.create(id, interviewForm);
      }
      resetInterviewForm();
      fetchJob();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save interview');
    }
  };

  const handleEditInterview = (interview) => {
    setInterviewForm({
      interviewDate: interview.interviewDate,
      round: interview.round,
      type: interview.type,
      notes: interview.notes || '',
    });
    setEditingInterviewId(interview.id);
    setShowInterviewForm(true);
  };

  const handleDeleteInterview = async (interviewId) => {
    if (!window.confirm('Delete this interview record?')) return;
    try {
      await interviewsAPI.delete(interviewId);
      fetchJob();
    } catch (err) {
      setError('Failed to delete interview');
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="page-container">
        <div className="alert alert-danger">{error}</div>
        <Link to="/jobs" className="btn btn-primary">Back to Applications</Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="page-title mb-1">{job.companyName}</h1>
          <p className="text-muted fs-5 mb-2">{job.jobTitle}</p>
          <StatusBadge status={job.status} />
        </div>
        <div className="d-flex gap-2">
          <Link to={`/jobs/${id}/edit`} className="btn btn-outline-primary">Edit</Link>
          <button type="button" className="btn btn-outline-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="detail-section">
        <div className="detail-row">
          <span className="detail-label">Location</span>
          <span>{job.location || '-'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Applied</span>
          <span>{formatDate(job.appliedDate)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Salary</span>
          <span>{job.salary || '-'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Job Type</span>
          <span>{formatJobType(job.jobType)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Job URL</span>
          <span>
            {job.jobUrl ? (
              <a href={job.jobUrl} target="_blank" rel="noopener noreferrer">View Job</a>
            ) : '-'}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Description</span>
          <span>{job.description || '-'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Notes</span>
          <span>{job.notes || '-'}</span>
        </div>
      </div>

      <div className="detail-section">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Interviews</h5>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => {
              resetInterviewForm();
              setShowInterviewForm(true);
            }}
          >
            + Add Interview
          </button>
        </div>

        {showInterviewForm && (
          <form onSubmit={handleInterviewSubmit} className="border rounded p-3 mb-3 bg-light">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Interview Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={interviewForm.interviewDate}
                  onChange={(e) => setInterviewForm({ ...interviewForm, interviewDate: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Round</label>
                <input
                  type="text"
                  className="form-control"
                  value={interviewForm.round}
                  onChange={(e) => setInterviewForm({ ...interviewForm, round: e.target.value })}
                  placeholder="e.g. Technical Interview"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={interviewForm.type}
                  onChange={(e) => setInterviewForm({ ...interviewForm, type: e.target.value })}
                >
                  <option value="Online">Online</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Phone">Phone</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={interviewForm.notes}
                  onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-3 d-flex gap-2">
              <button type="submit" className="btn btn-primary btn-sm">
                {editingInterviewId ? 'Update Interview' : 'Save Interview'}
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={resetInterviewForm}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {job.interviews && job.interviews.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Round</th>
                  <th>Type</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {job.interviews.map((interview) => (
                  <tr key={interview.id}>
                    <td>{formatDate(interview.interviewDate)}</td>
                    <td>{interview.round}</td>
                    <td>{interview.type}</td>
                    <td>{interview.notes || '-'}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditInterview(interview)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteInterview(interview.id)}
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
        ) : (
          <p className="text-muted mb-0">No interviews recorded yet.</p>
        )}
      </div>

      <Link to="/jobs" className="btn btn-link ps-0">← Back to Applications</Link>
    </div>
  );
}

export default JobDetails;
