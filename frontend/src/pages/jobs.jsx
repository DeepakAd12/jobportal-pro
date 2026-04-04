import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api";
import "../styles/jobs.css";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    jobType: searchParams.get('jobType') || '',
    experience: searchParams.get('experience') || '',
    salary: searchParams.get('salary') || ''
  });

 useEffect(() => {
  const fetchJobs = () => {
    setLoading(true);
    setError(null);

    api.get("jobs/")
      .then(res => {
        console.log("FULL RESPONSE:", res.data);

        const jobsData = res.data?.results || res.data || [];

        console.log("EXTRACTED JOBS:", jobsData);

        setJobs(jobsData);
      })
      .catch(err => {
        console.error("ERROR:", err);
        setError("Failed to load jobs");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  fetchJobs();
}, []);

  // Apply filters
const filteredJobs = useMemo(() => {
  return jobs.filter(job => {
    const searchLower = (filters.search || "").toLowerCase();

    const matchesSearch =
      !searchLower ||
      (job.title && job.title.toLowerCase().includes(searchLower)) ||
      (job.description && job.description.toLowerCase().includes(searchLower)) ||
      (job.created_by?.username && job.created_by.username.toLowerCase().includes(searchLower));

    const matchesLocation =
      !filters.location ||
      (job.location && job.location.toLowerCase().includes(filters.location.toLowerCase()));

    const matchesJobType =
      !filters.jobType ||
      (job.job_type && job.job_type === filters.jobType);

    const matchesExperience =
      !filters.experience ||
      (job.experience && job.experience.toLowerCase().includes(filters.experience.toLowerCase()));

    const matchesSalary =
      !filters.salary ||
      (job.salary && Number(job.salary) >= Number(filters.salary));

    return (
      matchesSearch &&
      matchesLocation &&
      matchesJobType &&
      matchesExperience &&
      matchesSalary
    );
  });
}, [jobs, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      location: '',
      jobType: '',
      experience: '',
      salary: ''
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  if (loading) {
    return (
      <div className="jobs-page">
        <div className="jobs-header">
          <h1>Find Your Perfect Job</h1>
          <p className="subtitle">Discover opportunities that match your skills and career goals</p>
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
          <h1>Find Your Perfect Job</h1>
          <p className="subtitle">Discover opportunities that match your skills and career goals</p>
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
        <h1>Find Your Perfect Job</h1>
        <p className="subtitle">Discover opportunities that match your skills and career goals</p>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              name="search"
              placeholder="Job title, keywords, or company"
              value={filters.search}
              onChange={handleFilterChange}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Search
            </button>
          </div>
        </form>

        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="City, State or Remote"
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="jobType">Job Type</label>
            <select
              id="jobType"
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="experience">Experience Level</label>
            <select
              id="experience"
              name="experience"
              value={filters.experience}
              onChange={handleFilterChange}
            >
              <option value="">All Levels</option>
              <option value="Entry">Entry Level</option>
              <option value="Mid">Mid Level</option>
              <option value="Senior">Senior Level</option>
              <option value="Lead">Lead/Manager</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="salary">Minimum Salary</label>
            <select
              id="salary"
              name="salary"
              value={filters.salary}
              onChange={handleFilterChange}
            >
              <option value="">No Minimum</option>
              <option value="30000">₹30,000+</option>
              <option value="50000">₹50,000+</option>
              <option value="80000">₹80,000+</option>
              <option value="100000">₹100,000+</option>
              <option value="150000">₹150,000+</option>
            </select>
          </div>
        </div>

        <div className="filters-actions">
          <button onClick={handleClearFilters} className="btn btn-secondary">
            Clear Filters
          </button>
          <span className="results-count">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </span>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="no-jobs">
          <div className="no-jobs-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h3>No jobs found</h3>
          <p>Try adjusting your search criteria or check back later for new opportunities</p>
          <button onClick={handleClearFilters} className="btn btn-primary">Clear Filters</button>
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-card-header">
                <h3>{job.title}</h3>
                <span className={`job-badge ${job.job_type?.toLowerCase() || 'full-time'}`}>
                  {job.job_type || "Full-time"}
                </span>
              </div>
              <p className="job-company">{job.created_by?.username || job.created_by?.email || "Company Name"}</p>
              
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
                {job.experience && (
                  <span className="job-detail">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    {job.experience}
                  </span>
                )}
              </div>

              <p className="job-salary">
                {job.salary ? `₹${Number(job.salary).toLocaleString()}/yr` : "Salary not disclosed"}
              </p>

              {job.description && (
                <p className="job-description">{job.description}</p>
              )}

              {(() => {
                const skills = typeof job.skills === 'string' ? JSON.parse(job.skills) : (Array.isArray(job.skills) ? job.skills : []);
                return skills.length > 0 && (
                  <div className="job-skills">
                    {skills.slice(0, 4).map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                );
              })()}

              <div className="job-actions">
                <Link to={`/job/${job.id}`} className="btn btn-primary">View Details</Link>
                <button className="btn btn-secondary">Save Job</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}