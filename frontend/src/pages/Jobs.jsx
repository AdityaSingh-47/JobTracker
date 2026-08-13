import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import SearchBar from '../components/SearchBar';
import JobTable from '../components/JobTable';

const STATUSES = ['ALL', 'APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN'];

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      let response;
      if (search.trim()) {
        response = await jobsAPI.search(search.trim(), sortBy);
      } else if (statusFilter !== 'ALL') {
        response = await jobsAPI.filterByStatus(statusFilter, sortBy);
      } else {
        response = await jobsAPI.getAll(sortBy);
      }
      setJobs(response.data);
    } catch (err) {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter, sortBy]);

  const handleSearch = () => {
    fetchJobs();
  };

  const handleDelete = async (id, companyName) => {
    if (!window.confirm(`Are you sure you want to delete the application for ${companyName}?`)) {
      return;
    }
    try {
      await jobsAPI.delete(id);
      setSuccess('Application deleted successfully');
      fetchJobs();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete application');
    }
  };

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title mb-0">Applications</h1>
        <Link to="/jobs/add" className="btn btn-primary">+ Add Job</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <SearchBar value={search} onChange={setSearch} onSearch={handleSearch} />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === 'ALL' ? 'All Statuses' : s.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Sort by Applied Date</option>
            <option value="company">Sort by Company</option>
            <option value="title">Sort by Job Title</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <JobTable jobs={jobs} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default Jobs;
