import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import JobForm from '../components/JobForm';

function EditJob() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await jobsAPI.getById(id);
        setInitialData(response.data);
      } catch (err) {
        setError('Failed to load application');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    setError('');
    try {
      await jobsAPI.update(id, formData);
      navigate(`/jobs/${id}`);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setError(Object.values(data.errors).join(', '));
      } else {
        setError(data?.message || 'Failed to update application');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Edit Application</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {initialData && (
        <JobForm
          initialData={initialData}
          onSubmit={handleSubmit}
          loading={saving}
          submitLabel="Update Application"
        />
      )}
    </div>
  );
}

export default EditJob;
