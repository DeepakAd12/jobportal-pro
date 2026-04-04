import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "./ToastContainer";
import ApplicationForm from "./ApplicationForm";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import api from "../api";
import "../styles/job-details.css";

export default function JobDetails() {
  const { id } = useParams();
  const { showToast } = useToast();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const fetchJob = () => {
      setLoading(true);
      setError(null);
      api.get(`jobs/${id}/`)
      // Debug log
        .then(res => {
          setJob(res.data);
        })
        .catch(err => {
          console.error("Failed to fetch job:", err);
          setError("Failed to load job details. Please try again later.");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchJob();
  }, [id]);

  const handleApply = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login to apply for this job", "warning");
      return;
    }
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = async (formData) => {
    setIsApplying(true);
    try {
      await api.post(`applications/`, formData);
      showToast("Application submitted successfully!", "success");
      setShowApplicationForm(false);
    } catch (err) {
      console.error("Failed to apply:", err);
      if (err.response?.data?.non_field_errors) {
        showToast(err.response.data.non_field_errors[0], "error");
      } else {
        showToast("Failed to submit application. Please try again.", "error");
      }
    } finally {
      setIsApplying(false);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    showToast(isSaved ? "Job removed from saved" : "Job saved successfully", "info");
  };

  if (loading) {
    return (
      <div className="job-details-page">
        <LoadingSpinner 
          size="large" 
          text="Loading job details..." 
          fullScreen={false} 
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-details-page">
        <EmptyState
          title="Unable to Load Job Details"
          description={error}
          primaryAction={{
            label: "Back to Jobs",
            to: "/jobs"
          }}
          size="large"
        />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-details-page">
        <EmptyState
          title="Job Not Found"
          description="The job you're looking for doesn't exist or has been removed."
          primaryAction={{
            label: "Back to Jobs",
            to: "/jobs"
          }}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          }
          size="large"
        />
      </div>
    );
  }

  return (
    <div className="job-details-page">
      <div className="container">
        <div className="job-details-header">
          <div className="job-details-main">
            <div className="job-details-breadcrumbs">
              <Link to="/jobs">All Jobs</Link>
              <span>›</span>
              <span>{job.title}</span>
            </div>
            
            <div className="job-details-card">
              <div className="job-details-top">
                <div className="job-details-title">
                  <h1>{job.title}</h1>
                  <div className="job-details-meta">
                    <span className={`job-badge ${job.job_type?.toLowerCase() || 'full-time'}`}>
                      {job.job_type || "Full-time"}
                    </span>
                    <span className="job-posted">
                      Posted {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                </div>
                
                <div className="job-details-actions">
                  <button 
                    onClick={handleSave} 
                    className={`btn ${isSaved ? 'btn-secondary' : 'btn-outline'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                    {isSaved ? 'Saved' : 'Save Job'}
                  </button>
                  <button 
                    onClick={handleApply} 
                    className="btn btn-primary"
                  >
                    Apply Now
                  </button>
                </div>
              </div>

              <div className="job-details-company">
                <div className="company-info">
                  <div className="company-logo">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-18v18M6 9h1.5m-1.5 6h1.5m-1.5-3h1.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="company-details">
                    <h3>{job.created_by?.username || job.created_by?.email || "Company Name"}</h3>
                    <p className="company-location">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {job.location || "Remote"}
                    </p>
                  </div>
                </div>
                
                <div className="job-details-stats">
                  <div className="stat-item">
                    <span className="stat-label">Job Type</span>
                    <span className="stat-value">{job.job_type || "Full-time"}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Experience</span>
                    <span className="stat-value">{job.experience || "Not specified"}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Salary</span>
                    <span className="stat-value">
                      {job.salary ? `₹${Number(job.salary).toLocaleString()}/yr` : "Not disclosed"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ApplicationForm
            job={job}
            isOpen={showApplicationForm}
            onClose={() => setShowApplicationForm(false)}
            onApply={handleApplicationSubmit}
          />

          <div className="job-details-sidebar">
            <div className="job-summary">
              <h3>Job Summary</h3>
              <div className="summary-stats">
                <div className="summary-item">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <div>
                    <span className="summary-label">Job Type</span>
                    <span className="summary-value">{job.job_type || "Full-time"}</span>
                  </div>
                </div>
                <div className="summary-item">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <div>
                    <span className="summary-label">Location</span>
                    <span className="summary-value">{job.location || "Remote"}</span>
                  </div>
                </div>
                <div className="summary-item">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="summary-label">Experience</span>
                    <span className="summary-value">{job.experience || "Not specified"}</span>
                  </div>
                </div>
                <div className="summary-item">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303-.001-3.182s2.9-.879 4.006 0l.415.33M21 14.75V20a1 1 0 01-1 1v0a1 1 0 01-1-1v-5.25m18 0V20a1 1 0 01-1 1h0a1 1 0 01-1-1v-5.25" />
                  </svg>
                  <div>
                    <span className="summary-label">Salary</span>
                    <span className="summary-value">
                      {job.salary ? `₹${Number(job.salary).toLocaleString()}/yr` : "Not disclosed"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {(() => {
              const skills = typeof job.skills === 'string' ? JSON.parse(job.skills) : (Array.isArray(job.skills) ? job.skills : []);
              return skills.length > 0 && (
                <div className="job-skills-sidebar">
                  <h3>Required Skills</h3>
                  <div className="skills-list">
                    {skills.slice(0, 10).map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        <div className="job-details-content">
          <div className="job-description-section">
            <h2>Job Description</h2>
            {job.description ? (
              <div className="job-description-content">
                <p>{job.description}</p>
              </div>
            ) : (
              <p className="no-description">No description available for this job.</p>
            )}
          </div>

          {job.requirements && (
            <div className="job-requirements-section">
              <h2>Requirements</h2>
              <div className="requirements-content">
                <p>{job.requirements}</p>
              </div>
            </div>
          )}

          {job.responsibilities && (
            <div className="job-responsibilities-section">
              <h2>Responsibilities</h2>
              <div className="responsibilities-content">
                <p>{job.responsibilities}</p>
              </div>
            </div>
          )}

          <div className="job-actions-bottom">
            <button 
              onClick={handleSave} 
              className={`btn ${isSaved ? 'btn-secondary' : 'btn-outline'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
              {isSaved ? 'Saved' : 'Save Job'}
            </button>
            <button 
              onClick={handleApply} 
              className="btn btn-primary"
              disabled={isApplying}
            >
              {isApplying ? 'Applying...' : 'Apply Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}