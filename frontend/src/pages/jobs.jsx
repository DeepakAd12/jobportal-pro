import { useEffect,  useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";
import { formatSalary, getCompanyName } from "../utils/jobUtils";
import "../styles/jobs.css";
import { toggleBookmark as apiToggleBookmark } from "../api";

const DEFAULT_FILTERS = {
  search: "",
  location: "",
  salary: "",
};

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    salary: searchParams.get("salary") || "",
  });

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      location: searchParams.get("location") || "",
      salary: searchParams.get("salary") || "",
    });
  }, [searchParams]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = { limit: 50 };

        const search = searchParams.get("search");
        const location = searchParams.get("location");
        const salary = searchParams.get("salary");

        if (search) params.search = search;
        if (location) params.location = location;
        if (salary) params.salary_min = salary;

        const res = await api.get("jobs/", { params });
        setJobs(res.data?.results || res.data || []);
      } catch (err) {
        console.error("ERROR:", err);
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams]);

  useEffect(() => {
    if (!isLoggedIn) {
      setBookmarks([]);
      return;
    }

    const fetchBookmarks = async () => {
      try {
        const res = await api.get("jobs/bookmarks/");
        setBookmarks(res.data?.results || res.data || []);
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      }
    };

    fetchBookmarks();
  }, [isLoggedIn]);


  const isInitialLoad = loading && jobs.length === 0;
  const isRefreshing = loading && jobs.length > 0;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleBookmark = async (jobId)=> {
    try {
      const existingBookmark = bookmarks.find((bookmark) => bookmark.job?.id === jobId);
      
      if (existingBookmark) {
        await api.delete(`jobs/bookmarks/${existingBookmark.id}/`);
        setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== existingBookmark.id));}
      else {
        const res = await apiToggleBookmark(jobId);
        const newBookmark = res.data?.data || res.data;
        setBookmarks((prev) => [...prev, newBookmark]);
      }
    }
      catch (err) {
        console.error("bookmark error:", err);
      }
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchParams(new URLSearchParams());
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  if (isInitialLoad) {
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

  if (error && jobs.length === 0) {
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
        {isRefreshing && (
          <div className="jobs-refreshing">
            <span>Updating jobs...</span>
          </div>
        )}
      </div>

      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              name="search"
              placeholder="Job title or keywords"
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
            <label htmlFor="salary">Minimum Salary</label>
            <select
              id="salary"
              name="salary"
              value={filters.salary}
              onChange={handleFilterChange}
            >
              <option value="">No Minimum</option>
              <option value="30000">Rs 30,000+</option>
              <option value="50000">Rs 50,000+</option>
              <option value="80000">Rs 80,000+</option>
              <option value="100000">Rs 100,000+</option>
              <option value="150000">Rs 150,000+</option>
            </select>
          </div>
        </div>

        <div className="filters-actions">
          <button type="button" onClick={handleClearFilters} className="btn btn-secondary">
            Clear Filters
          </button>
          <span className="results-count">
            {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
          </span>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="no-jobs">
          <div className="no-jobs-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h3>No jobs found</h3>
          <p>Try adjusting your search criteria or check back later for new opportunities</p>
          <button type="button" onClick={handleClearFilters} className="btn btn-primary">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => {
            const isSaved = bookmarks.some((bookmark) => bookmark.job?.id === job.id);
           
            return (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                  <div>
                    <h3>{job.title}</h3>
                    <p className="job-company">{getCompanyName(job)}</p>
                  </div>

                  <div className="job-card-actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => toggleBookmark(job.id)}
                    >
                      {isSaved ? "Saved" : "Save Job"}
                    </button>
                  </div>
                </div>
                <div className="job-details">
                  <span className="job-detail">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {job.location || "Remote"}
                  </span>
                </div>

                <p className="job-salary">{formatSalary(job.salary, "/yr")}</p>

                {job.description && <p className="job-description">{job.description}</p>}

                <div className="job-actions">
                  <Link to={`/job/${job.id}`} className="btn btn-primary">
                    View Details
                  </Link>
              
                  
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
