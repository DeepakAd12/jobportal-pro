import React, { useState } from "react";
import { useToast } from "./ToastContainer";
import { useFormValidation, applicationFormValidation } from "../hooks/useFormValidation";
import FormInput from "./FormInput";
import "../styles/application-form.css";
import api from "../api";

const ApplicationForm = ({ job, isOpen, onClose }) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFieldError
  } = useFormValidation(
    {
      fullName: "",
      email: "",
      phone: "",
      coverLetter: "",
      resume: null
    },
    applicationFormValidation
  );

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("JOB ID:", job.id);

  if (!validateForm()) {
    showToast("Please fix the errors", "error");
    return;
  }

  if (!resumeFile) {
    setFieldError("resume", "Please upload your resume");
    return;
  }

  setIsSubmitting(true);

  try {
    const formData = new FormData();
    formData.append("job_id", job.id);
    formData.append("resume", resumeFile);

    await api.post("applications/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    showToast("Application submitted successfully", "success");

  } catch (error) {
    console.error(error);

    const message =
      error.response?.data?.detail ||
      error.response?.data ||
      "Something went wrong";

    showToast(message, "error");

  } finally {
    setIsSubmitting(false);
  }
};

  const handleClose = () => {
    resetForm();
    setResumeFile(null);
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
    handleChange("resume", file);

    const fileError = applicationFormValidation.resume[1](file);
    if (fileError) {
      setFieldError("resume", fileError);
    } else {
      setFieldError("resume", null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Apply for {job.title}</h2>
          <button className="modal-close" onClick={handleClose} aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="application-form">
          <div className="form-section">
            <h3>Personal Information</h3>

            <FormInput
              label="Full Name"
              name="fullName"
              type="text"
              value={values.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fullName}
              touched={touched.fullName}
              placeholder="Enter your full name"
              required
            />

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              placeholder="your.email@example.com"
              required
            />

            <FormInput
              label="Phone Number"
              name="phone"
              type="tel"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.phone}
              touched={touched.phone}
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>

          <div className="form-section">
            <h3>Resume & Cover Letter</h3>

            <div className="form-input">
              <label className="form-label">
                Resume <span className="required">*</span>
              </label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className={`file-input ${errors.resume && touched.resume ? "has-error" : ""}`}
                />
                <label htmlFor="resume" className="file-input-label">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  {resumeFile ? resumeFile.name : "Choose PDF or DOC file"}
                </label>

                {resumeFile && (
                  <div className="file-preview">
                    <span className="file-name">{resumeFile.name}</span>
                    <span className="file-size">
                      {(resumeFile.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                )}

                {errors.resume && touched.resume && (
                  <div className="error-message">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    {errors.resume}
                  </div>
                )}
              </div>
            </div>

            <div className="form-input">
              <label htmlFor="coverLetter" className="form-label">
                Cover Letter (Optional)
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                value={values.coverLetter}
                onChange={(e) => handleChange("coverLetter", e.target.value)}
                onBlur={() => handleBlur("coverLetter")}
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                className={`form-control ${errors.coverLetter && touched.coverLetter ? "has-error" : ""}`}
                rows="6"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Job Details</h3>
            <div className="job-summary">
              <div className="job-summary-item">
                <span className="summary-label">Position:</span>
                <span className="summary-value">{job.title}</span>
              </div>
              <div className="job-summary-item">
                <span className="summary-label">Company:</span>
                <span className="summary-value">{typeof job.created_by === "string" ? job.created_by : "Not specified"}</span>
              </div>
              <div className="job-summary-item">
                <span className="summary-label">Location:</span>
                <span className="summary-value">{job.location || "Not specified"}</span>
              </div>
              <div className="job-summary-item">
                <span className="summary-label">Salary:</span>
                <span className="summary-value">
                  {job.salary ? `Rs ${Number(job.salary).toLocaleString()}/yr` : "Not disclosed"}
                </span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="submit-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
