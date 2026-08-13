import { useEffect, useState } from 'react';

const STATUSES = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN'];
const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE'];

const emptyForm = {
  companyName: '',
  jobTitle: '',
  location: '',
  status: 'APPLIED',
  jobUrl: '',
  appliedDate: new Date().toISOString().split('T')[0],
  salary: '',
  jobType: 'FULL_TIME',
  description: '',
  notes: '',
};

function JobForm({ initialData, onSubmit, loading, submitLabel }) {
  const [form, setForm] = useState(initialData || emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!form.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!form.status) newErrors.status = 'Status is required';
    if (!form.appliedDate) newErrors.appliedDate = 'Applied date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="detail-section">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Company Name *</label>
          <input
            type="text"
            name="companyName"
            className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
            value={form.companyName}
            onChange={handleChange}
          />
          {errors.companyName && <div className="invalid-feedback">{errors.companyName}</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label">Job Title *</label>
          <input
            type="text"
            name="jobTitle"
            className={`form-control ${errors.jobTitle ? 'is-invalid' : ''}`}
            value={form.jobTitle}
            onChange={handleChange}
          />
          {errors.jobTitle && <div className="invalid-feedback">{errors.jobTitle}</div>}
        </div>
        <div className="col-md-6">
          <label className="form-label">Location</label>
          <input
            type="text"
            name="location"
            className="form-control"
            value={form.location}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Status *</label>
          <select
            name="status"
            className={`form-select ${errors.status ? 'is-invalid' : ''}`}
            value={form.status}
            onChange={handleChange}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Job URL</label>
          <input
            type="url"
            name="jobUrl"
            className="form-control"
            value={form.jobUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Applied Date *</label>
          <input
            type="date"
            name="appliedDate"
            className={`form-control ${errors.appliedDate ? 'is-invalid' : ''}`}
            value={form.appliedDate}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Salary</label>
          <input
            type="text"
            name="salary"
            className="form-control"
            value={form.salary}
            onChange={handleChange}
            placeholder="e.g. 12 LPA"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Job Type</label>
          <select
            name="jobType"
            className="form-select"
            value={form.jobType}
            onChange={handleChange}
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>{t.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div className="col-12">
          <label className="form-label">Notes</label>
          <textarea
            name="notes"
            className="form-control"
            rows="3"
            value={form.notes}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="mt-4">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default JobForm;
