import React, { useState, useEffect } from "react";
import "./i18n/config";
import "./App.scss";
import LandingPage from "./content/LandingPage/LandingPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DisclaimerModal from "./components/DisclaimerModal/DisclaimerModal";

function App() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const hasAccepted = localStorage.getItem("disclaimerAccepted");
      if (hasAccepted === "true") {
        setShowDisclaimer(false);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
    setIsLoading(false);
  }, []);

  const handleDisclaimerClose = () => {
    try {
      localStorage.setItem("disclaimerAccepted", "true");
      setShowDisclaimer(false);
    } catch (error) {
      console.error("Error setting localStorage:", error);
      setShowDisclaimer(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <BrowserRouter>
      <DisclaimerModal
        isOpen={showDisclaimer}
        onClose={handleDisclaimerClose}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
