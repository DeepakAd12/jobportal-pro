import React, { useState, useEffect } from "react";
import { useToast } from "./ToastContainer";
import api from "../api";
import "../styles/job-seeker-dashboard.css";

const JobSeekerDashboard = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('applied');
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch applied jobs
        const appliedResponse = await api.get('applications/');
        setJobs(appliedResponse.data || []);
        
        // Fetch saved jobs (for now, we'll use a mock implementation)
        // In a real app, this would be a separate endpoint
        setSavedJobs([]);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        showToast("Failed to load dashboard", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUnsaveJob = (jobId) => {
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
    showToast("Job removed from saved", "info");
  };

  const handleDeleteApplication = async (applicationId) => {
    try {
      await api.delete(`applications/${applicationId}/`);
      setJobs(prev => prev.filter(app => app.id !== applicationId));
      showToast("Application deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete application:", err);
      showToast("Failed to delete application", "error");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'reviewed': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      case 'reviewed': return 'Under Review';
      default: return 'Applied';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>My Dashboard</h1>
          <p className="dashboard-subtitle">Track your job applications and saved opportunities</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <span className="loading-text">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>My Dashboard</h1>
          <p className="dashboard-subtitle">Track your job applications and saved opportunities</p>
        </div>
        <div className="error-container">
          <div className="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <p className="dashboard-subtitle">Track your job applications and saved opportunities</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'applied' ? 'active' : ''}`}
          onClick={() => setActiveTab('applied')}
        >
          Applied Jobs ({jobs.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved Jobs ({savedJobs.length})
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'applied' && (
          <div className="applied-jobs-section">
            <div className="section-header">
              <h2>My Applications</h2>
              <p>Track the status of your job applications</p>
            </div>

            {jobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <h3>No Applications Yet</h3>
                <p>Start applying to jobs to see your applications here</p>
                <a href="/jobs" className="btn btn-primary">Browse Jobs</a>
              </div>
            ) : (
              <div className="applications-grid">
                {jobs.map((application) => (
                  <div key={application.id} className="application-card">
                    <div className="application-header">
                      <div className="job-info">
                        <h3>{application.job?.title || "Job Title"}</h3>
                        <p className="company-name">{application.job?.company || "Company"}</p>
                        <div className="job-meta">
                          <span className="location">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            {application.job?.location || "Location"}
                          </span>
                          <span className="salary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303-.001-3.182s2.9-.879 4.006 0l.415.33M21 14.75V20a1 1 0 01-1 1v0a1 1 0 01-1-1v-5.25m18 0V20a1 1 0 01-1 1h0a1 1 0 01-1-1v-5.25" />
                            </svg>
                            {application.job?.salary ? `₹${Number(application.job.salary).toLocaleString()}/yr` : "Not disclosed"}
                          </span>
                        </div>
                      </div>
                      <div className="application-status">
                        <span 
                          className="status-badge"
                          style={{ borderColor: getStatusColor(application.status), color: getStatusColor(application.status) }}
                        >
                          {getStatusText(application.status)}
                        </span>
                        <span className="applied-date">
                          Applied on {new Date(application.applied_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="application-actions">
                      <a 
                        href={`/job/${application.job?.id}`}
                        className="btn btn-outline"
                      >
                        View Job
                      </a>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => handleDeleteApplication(application.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="saved-jobs-section">
            <div className="section-header">
              <h2>Saved Jobs</h2>
              <p>Jobs you've bookmarked for later consideration</p>
            </div>

            {savedJobs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                </div>
                <h3>No Saved Jobs</h3>
                <p>Save jobs you're interested in to see them here</p>
                <a href="/jobs" className="btn btn-primary">Browse Jobs</a>
              </div>
            ) : (
              <div className="saved-jobs-grid">
                {savedJobs.map((job) => (
                  <div key={job.id} className="saved-job-card">
                    <div className="job-info">
                      <h3>{job.title}</h3>
                      <p className="company-name">{job.company}</p>
                      <div className="job-meta">
                        <span className="location">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          {job.location}
                        </span>
                        <span className="salary">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303-.001-3.182s2.9-.879 4.006 0l.415.33M21 14.75V20a1 1 0 01-1 1v0a1 1 0 01-1-1v-5.25m18 0V20a1 1 0 01-1 1h0a1 1 0 01-1-1v-5.25" />
                          </svg>
                          {job.salary ? `₹${Number(job.salary).toLocaleString()}/yr` : "Not disclosed"}
                        </span>
                      </div>
                    </div>
                    <div className="saved-job-actions">
                      <a href={`/job/${job.id}`} className="btn btn-primary">View Details</a>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => handleUnsaveJob(job.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekerDashboard;