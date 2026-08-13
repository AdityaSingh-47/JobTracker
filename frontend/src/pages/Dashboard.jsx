import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsAPI } from '../services/api';
import JobTable from '../components/JobTable';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          jobsAPI.getStats(),
          jobsAPI.getAll('date'),
        ]);
        setStats(statsRes.data);
        setRecentJobs(jobsRes.data.slice(0, 5));
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="page-title mb-1">Welcome back, {user?.name}!</h1>
          <p className="text-muted mb-0">Track and manage your job applications</p>
        </div>
        <Link to="/jobs/add" className="btn btn-primary">+ Add Application</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {stats && (
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-4 col-lg-2">
            <div className="card-stat">
              <p>Total</p>
              <h3>{stats.totalApplications}</h3>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-2">
            <div className="card-stat">
              <p>Applied</p>
              <h3>{stats.applied}</h3>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-2">
            <div className="card-stat">
              <p>Screening</p>
              <h3>{stats.screening}</h3>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-2">
            <div className="card-stat">
              <p>Interviews</p>
              <h3>{stats.interviews}</h3>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-2">
            <div className="card-stat">
              <p>Offers</p>
              <h3>{stats.offers}</h3>
            </div>
          </div>
          <div className="col-6 col-md-4 col-lg-2">
            <div className="card-stat">
              <p>Rejected</p>
              <h3>{stats.rejected}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="detail-section">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Recent Applications</h5>
          <Link to="/jobs" className="btn btn-sm btn-outline-primary">View All</Link>
        </div>
        <JobTable jobs={recentJobs} onDelete={() => {}} />
      </div>
    </div>
  );
}

export default Dashboard;
