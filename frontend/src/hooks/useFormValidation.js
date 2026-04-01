import { useState, useCallback } from "react";

export const useFormValidation = (initialState = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValid, setIsValid] = useState(false);

  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return null;

    for (const rule of rules) {
      const error = rule(value, values);
      if (error) return error;
    }
    return null;
  }, [validationRules, values]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let formIsValid = true;

    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        formIsValid = false;
      }
    });

    setErrors(newErrors);
    setIsValid(formIsValid);
    return formIsValid;
  }, [values, validateField, validationRules]);

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    
    // Validate field in real-time
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [errors, validateField]);

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField, values]);

  const resetForm = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setTouched({});
    setIsValid(false);
  }, [initialState]);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFieldError,
    setValues
  };
};

// Validation rules
export const validationRules = {
  required: (message = "This field is required") => (value) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return message;
    }
    return null;
  },

  email: (message = "Please enter a valid email address") => (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return message;
    }
    return null;
  },

  minLength: (min, message) => (value) => {
    if (value && value.length < min) {
      return message || `Must be at least ${min} characters long`;
    }
    return null;
  },

  maxLength: (max, message) => (value) => {
    if (value && value.length > max) {
      return message || `Must be no more than ${max} characters long`;
    }
    return null;
  },

  password: (message = "Password must be at least 8 characters with uppercase, lowercase, and number") => (value) => {
    if (!value) return null;
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(value)) {
      return message;
    }
    return null;
  },

  confirmPassword: (message = "Passwords do not match") => (value, values) => {
    if (value !== values.password) {
      return message;
    }
    return null;
  },

  phone: (message = "Please enter a valid phone number") => (value) => {
    if (!value) return null;
    
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(value)) {
      return message;
    }
    return null;
  },

  file: (allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], maxSize = 5 * 1024 * 1024) => (file) => {
    if (!file) return null;
    
    if (!allowedTypes.includes(file.type)) {
      return "Please upload a PDF or DOC/DOCX file";
    }
    
    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }
    
    return null;
  }
};

// Common form configurations
export const loginFormValidation = {
  email: [validationRules.required(), validationRules.email()],
  password: [validationRules.required()]
};

export const registerFormValidation = {
  email: [validationRules.required(), validationRules.email()],
  password: [validationRules.required(), validationRules.password()],
  confirmPassword: [validationRules.required(), validationRules.confirmPassword()],
  role: [validationRules.required()]
};

export const applicationFormValidation = {
  fullName: [validationRules.required(), validationRules.minLength(2), validationRules.maxLength(50)],
  email: [validationRules.required(), validationRules.email()],
  phone: [validationRules.required(), validationRules.phone()],
  resume: [validationRules.required(), validationRules.file()]
};