import { useEffect, useState } from "react";
import api from "../api";
import "../styles/jobs.css";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = () => {
      setLoading(true);
      setError(null);
      api.get("jobs/")
        .then(res => {
          if (res.data.results) {
            setJobs(res.data.results);
          } else {
            setJobs(res.data);
          }
        })
        .catch(err => {
          console.error("Failed to fetch jobs:", err);
          setError("Failed to load jobs. Please try again later.");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="jobs-page">
        <div className="jobs-header">
          <h1>Available Jobs</h1>
          <p className="subtitle">Find your dream job from our curated listings</p>
        </div>
        <div className="jobs-loading">
          <div className="loading-spinner"></div>
          <span className="loading-text">Loading jobs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobs-page">
        <div className="jobs-header">
          <h1>Available Jobs</h1>
          <p className="subtitle">Find your dream job from our curated listings</p>
        </div>
        <div className="error-container">
          <div className="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <h1>Available Jobs</h1>
        <p className="subtitle">Find your dream job from our curated listings</p>
      </div>

      {jobs.length === 0 ? (
        <div className="no-jobs">
          <div className="no-jobs-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h3>No jobs available</h3>
          <p>Check back later for new opportunities</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-card-header">
                <h3>{job.title}</h3>
              </div>
              <p className="job-company">{job.company || "Company Name"}</p>
              
              <div className="job-details">
                <span className="job-detail">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {job.location || "Remote"}
                </span>
                <span className="job-detail">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {job.job_type || "Full-time"}
                </span>
              </div>

              <p className="job-salary">
                {job.salary ? `${Number(job.salary).toLocaleString()}` : "Salary not disclosed"}
              </p>

              {job.description && (
                <p className="job-description">{job.description}</p>
              )}

              {job.skills && job.skills.length > 0 && (
                <div className="job-skills">
                  {job.skills.slice(0, 4).map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              )}

              <div className="job-actions">
                <button className="btn btn-primary">Apply Now</button>
                <button className="btn btn-secondary">Save</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
