import React from "react";
import { Link } from "react-router-dom";
import "../styles/empty-state.css";

const EmptyState = ({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  size = "medium"
}) => {
  return (
    <div className={`empty-state empty-state--${size}`}>
      <div className="empty-state__icon">
        {icon || (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.9.416 1.485A7.5 7.5 0 1115.9 4.5c-.89.964-.927 2.485-.416 3.485-.137.36-.321.695-.544 1.005-.203.179-.43.326-.67.442-.11.06-.227.118-.347.17A2.5 2.5 0 019.88 7.519z" />
          </svg>
        )}
      </div>
      
      <div className="empty-state__content">
        <h3 className="empty-state__title">{title}</h3>
        {description && (
          <p className="empty-state__description">{description}</p>
        )}
      </div>

      <div className="empty-state__actions">
        {primaryAction && (
          <Link to={primaryAction.to} className="btn btn-primary">
            {primaryAction.label}
          </Link>
        )}
        {secondaryAction && (
          <Link to={secondaryAction.to} className="btn btn-secondary">
            {secondaryAction.label}
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmptyState;