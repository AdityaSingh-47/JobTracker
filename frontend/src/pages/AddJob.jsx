import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import JobForm from '../components/JobForm';

function AddJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    try {
      const response = await jobsAPI.create(formData);
      navigate(`/jobs/${response.data.id}`);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setError(Object.values(data.errors).join(', '));
      } else {
        setError(data?.message || 'Failed to create application');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Add New Application</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <JobForm onSubmit={handleSubmit} loading={loading} submitLabel="Create Application" />
    </div>
  );
}

export default AddJob;
