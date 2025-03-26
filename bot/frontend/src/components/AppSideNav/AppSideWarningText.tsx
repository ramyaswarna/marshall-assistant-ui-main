import React from "react";
import "./AppSideNav.scss";
import { AlertIconSVG } from "../Icons/AlertIcon";

const AppSideWarningText: React.FC = () => {
  return (
    <div className="app-side-warning-text">
      <div className="warning-content">
        <div className="icon-container">
          <AlertIconSVG className="alert-icon" />
        </div>
        <div className="text-content">
          <p>
            <strong>Concise:</strong> Key diagnoses, active medications, and
            immediate concerns, providing the most essential information for a
            quick review.
          </p>
          <p>
            <strong>Moderate-Detail:</strong> Includes recent lab results,
            allergies, and previous treatments in addition to the concise
            overview, providing a more detailed snapshot without overwhelming
            detail.
          </p>
          <p>
            <strong>High-Detail:</strong> Comprehensive history, covering
            detailed medical records, past treatments, ER visits, lab results,
            surgeries, and a full medication history for a complete patient
            overview.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppSideWarningText;
