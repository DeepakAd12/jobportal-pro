import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { formatSalary, getCompanyName } from "../utils/jobUtils";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkLoadingId, setBookmarkLoadingId] = useState(null);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      setLoading(true);

      try {
        const res = await api.get("jobs/", { params: { limit: 6 } });
        const jobs = res.data?.results || res.data || [];
        setFeaturedJobs(jobs.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const bookmarkedJobIds = useMemo(
    () => new Map(bookmarks.map((bookmark) => [bookmark.job?.id, bookmark.id])),
    [bookmarks]
  );

  const toggleBookmark = async (jobId) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    setBookmarkLoadingId(jobId);

    try {
      const bookmarkId = bookmarkedJobIds.get(jobId);

      if (bookmarkId) {
        await api.delete(`jobs/bookmarks/${bookmarkId}/`);
        setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== bookmarkId));
      } else {
        const res = await api.post("jobs/bookmarks/", { job_id: jobId });
        const createdBookmark = res.data?.data || res.data;
        setBookmarks((prev) => [...prev, createdBookmark]);
      }
    } catch (err) {
      console.error("Failed to update bookmark:", err);
    } finally {
      setBookmarkLoadingId(null);
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Dream Job</h1>
          <p className="hero-subtitle">
            Discover thousands of job opportunities from top companies around the world
          </p>

          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Job title or keywords"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Search Jobs
              </button>
            </div>
          </form>

          <div className="stats">
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Jobs Available</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Companies</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">95%</span>
              <span className="stat-label">Success Rate</span>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <div className="hero-visual">
            <div className="visual-shape shape-1"></div>
            <div className="visual-shape shape-2"></div>
            <div className="visual-shape shape-3"></div>
          </div>
        </div>
      </section>

      <section className="featured-jobs">
        <div className="container">
          <div className="section-header">
            <h2>Featured Jobs</h2>
            <Link to="/jobs" className="view-all-link">View All Jobs</Link>
          </div>

          {loading ? (
            <div className="jobs-loading">
              <div className="loading-spinner"></div>
              <span className="loading-text">Loading featured jobs...</span>
            </div>
          ) : (
            <div className="jobs-grid">
              {featuredJobs.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="job-card-header">
                    <h3>{job.title}</h3>
                  </div>
                  <p className="job-company">{getCompanyName(job)}</p>

                  <div className="job-details">
                    <span className="job-detail">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {job.location || "Remote"}
                    </span>
                  </div>

                  <p className="job-salary">{formatSalary(job.salary)}</p>

                  {job.description && (
                    <p className="job-description">{job.description}</p>
                  )}

                  <div className="job-actions">
                    <Link to={`/job/${job.id}`} className="btn btn-primary">View Details</Link>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => toggleBookmark(job.id)}
                      disabled={bookmarkLoadingId === job.id}
                    >
                      {bookmarkLoadingId === job.id ? "Saving..." : bookmarkedJobIds.has(job.id) ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p className="section-subtitle">Simple steps to find your perfect job</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3>Create Profile</h3>
              <p>Sign up and create your professional profile with your skills and experience</p>
            </div>

            <div className="step-card">
              <div className="step-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3>Search Jobs</h3>
              <p>Browse through thousands of job listings and find opportunities that match your skills</p>
            </div>

            <div className="step-card">
              <div className="step-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 5.074 8.25 6.307V9" />
                </svg>
              </div>
              <h3>Apply & Get Hired</h3>
              <p>Apply to jobs and track your applications. Get hired for your dream position!</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Find Your Next Opportunity?</h2>
            <p>Join thousands of professionals who found their dream jobs through our platform</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">Get Started</Link>
              <Link to="/jobs" className="btn btn-secondary btn-large">Browse Jobs</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
