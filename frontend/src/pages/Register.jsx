import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastContainer";
import { useFormValidation, registerFormValidation } from "../hooks/useFormValidation";
import FormInput from "../components/FormInput";
import api from "../api";
import "../styles/form.css";

export default function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm
  } = useFormValidation(
    {
      email: "",
      password: "",
      confirmPassword: "",
      role: "job_seeker"
    },
    registerFormValidation
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please fix the errors below", "error");
      return;
    }

    setLoading(true);

    try {
      await api.post("accounts/register/", {
        email: values.email,
        password: values.password,
        role: values.role
      });

      showToast("Account created successfully!", "success");
      navigate("/login");

    } catch (err) {
      console.error(err);
      if (err.response?.data?.email) {
        showToast(err.response.data.email[0], "error");
      } else if (err.response?.data?.password) {
        showToast(err.response.data.password[0], "error");
      } else {
        showToast("Registration failed. Try another email.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <div className="form-group">
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            touched={touched.email}
            placeholder="Enter your email address"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            touched={touched.password}
            placeholder="Create a strong password"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.confirmPassword}
            touched={touched.confirmPassword}
            placeholder="Confirm your password"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role" className="form-label">Account Type</label>
          <select
            id="role"
            name="role"
            value={values.role}
            onChange={(e) => handleChange("role", e.target.value)}
            onBlur={() => handleBlur("role")}
            className={`form-control ${errors.role && touched.role ? 'has-error' : ''}`}
            disabled={loading}
          >
            <option value="job_seeker">Job Seeker</option>
            <option value="recruiter">Recruiter</option>
          </select>
          {errors.role && touched.role && (
            <div className="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              {errors.role}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <svg className="submit-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    </div>
  );
}