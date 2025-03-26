import React from "react";
import { Modal, Button } from "@carbon/react";
import "./DisclaimerModal.scss";

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      open={isOpen}
      modalHeading="Important Disclaimer"
      primaryButtonText="I Understand"
      onRequestSubmit={onClose}
      preventCloseOnClickOutside
      shouldSubmitOnEnter
    >
      <div className="disclaimer-content">
        <p>
          The information provided is for general guidance and should not be
          considered as a substitute for professional medical judgment.
        </p>
        <p>
          By clicking <strong>"I Understand"</strong>, you acknowledge that:
        </p>
        <ul>
          <li>
            This is a non-production application using synthetic and mocked
            data. No real patient information is contained within this system.
          </li>
          <li>
            The application's performance, including response times and data
            processing, may experience delays and does not reflect the final
            product's intended performance.
          </li>
          <li>
            The header section, including alerts and patient information
            displays, contains static images for demonstration purposes only.
          </li>
          <li>
            All features and functionalities are in development phase and
            subject to continuous improvement and modification.
          </li>
          <li>
            AI-generated responses may contain inaccuracies or errors.
            Healthcare professionals must exercise their clinical judgment
            before making any medical decisions.
          </li>

          <li>
            You will use this tool in conjunction with your professional
            judgment
          </li>
          <li>
            This system is not intended to replace clinical decision-making
          </li>
          <li>
            You understand this is a demonstration version with limitations as
            described above
          </li>
        </ul>
      </div>
    </Modal>
  );
};

export default DisclaimerModal;
