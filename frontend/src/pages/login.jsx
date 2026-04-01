import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastContainer";
import { useFormValidation, loginFormValidation } from "../hooks/useFormValidation";
import FormInput from "../components/FormInput";
import api from "../api";
import "../styles/form.css";

export default function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validateForm
  } = useFormValidation(
    {
      email: "",
      password: ""
    },
    loginFormValidation
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast("Please fix the errors below", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("accounts/login/", {
        email: values.email,
        password: values.password
      });
      
      localStorage.setItem("token", response.data.access);
      showToast("Login successful!", "success");
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      if (err.response?.data?.detail) {
        showToast(err.response.data.detail, "error");
      } else if (err.response?.data?.non_field_errors) {
        showToast(err.response.data.non_field_errors[0], "error");
      } else {
        showToast("Login failed. Please check your credentials.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <p className="form-subtitle">Sign in to access your account</p>
        
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
            placeholder="Enter your email"
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
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>
        
        <button type="submit" disabled={loading || !isValid}>
          {loading ? (
            <>
              <svg className="submit-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
}
