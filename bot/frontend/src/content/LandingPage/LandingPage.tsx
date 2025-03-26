import { useCallback, useEffect, useState } from "react";
import Page from "../Page/Page";
import AppSideNav from "../../components/AppSideNav/AppSideNav";
import "./LandingPage.scss";
import Chat from "../../components/Chat/Chat";
import {
  cleanup,
  initializeWatsonAssistant,
  updatePatientId,
} from "../../watsonAssistantUtils";
import Login from "../../components/Login/Login";

const LandingPage = () => {
  const [regenerateTrigger, setRegenerateTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState("1");
  const [activePatient, setActivePatient] = useState("1");
  const [identifyIndicators, setIdentifyIndicators] = useState<boolean>(false);
  const [verbosityLevel, setVerbosityLevel] = useState<number>(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [startDate, setStartDate] = useState<string | null>(() => {
    const today = new Date();
    const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 6));
    return sixMonthsAgo.toISOString().split("T")[0];
  });

  const handleLogin = useCallback((success: boolean) => {
    setIsAuthenticated(success);
  }, []);

  const handleLogout = useCallback(() => {
    cleanup();
    setTimeout(() => {
      localStorage.removeItem("isAuthenticated");
      setIsAuthenticated(false);
      setIsInitialized(false);
    }, 100);
  }, []);

  const handleRegenerateSummary = useCallback(
    (
      verbosity: number,
      identifyIndicators: boolean,
      startDate?: string | null,
      patientId?: string
    ) => {
      console.log("Regenerate summary called with:", {
        verbosity,
        identifyIndicators,
        startDate,
        patientId,
      });

      if (!selectedPatient) return;

      Promise.resolve().then(() => {
        setVerbosityLevel(verbosity);
        setIdentifyIndicators(identifyIndicators);
        if (startDate !== undefined) {
          setStartDate(startDate);
        }
        setRegenerateTrigger((prev) => prev + 1);
      });
    },
    [selectedPatient]
  );

  const handlePatientSelect = useCallback((patientId: string) => {
    Promise.resolve().then(() => {
      updatePatientId(patientId);
      setSelectedPatient(patientId);
      setActivePatient(patientId);
      window.currentPatientId = patientId;
      setRegenerateTrigger((prev) => prev + 1);
    });
  }, []);

  const initializeApp = useCallback(async () => {
    if (!isInitialized && isAuthenticated) {
      console.log("Initializing app with patient:", selectedPatient);
      await initializeWatsonAssistant(selectedPatient);
      setIsInitialized(true);
      setRegenerateTrigger(1);
    }
  }, [selectedPatient, isInitialized, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      const timeoutId = setTimeout(() => {
        initializeApp();
      }, 100);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [initializeApp, isAuthenticated]);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Page
      className="landing-page"
      selectedPatient={activePatient}
      onLogout={handleLogout}
    >
      <AppSideNav
        onRegenerateSummary={handleRegenerateSummary}
        isLoading={isLoading}
        error={error}
        selectedPatient={selectedPatient}
        activePatient={activePatient}
        onPatientSelect={handlePatientSelect}
        identifyIndicators={identifyIndicators}
        setIdentifyIndicators={setIdentifyIndicators}
        verbosityLevel={verbosityLevel}
      />

      <Chat
        regenerateTrigger={regenerateTrigger}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        error={error}
        setError={setError}
        selectedPatient={selectedPatient}
        verbosity={verbosityLevel}
        identifyIndicators={identifyIndicators}
        startDate={startDate}
      />
    </Page>
  );
};

export default LandingPage;
