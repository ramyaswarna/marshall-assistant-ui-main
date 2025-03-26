import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import "./Chat.scss";
import { getPatientCareGaps, getPatientSummary } from "../../api/api";
import { Loading } from "@carbon/react";
import ChatTable from "./ChatTable";

interface ChatProps {
  regenerateTrigger: number;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  selectedPatient: string | null;
  verbosity: number;
  identifyIndicators: boolean;
  startDate: string | null;
}

const Chat = (props: ChatProps) => {
  const lastProcessedTrigger = useRef<number>(-1);
  const isMounted = useRef(false);

  const {
    regenerateTrigger,
    isLoading,
    setIsLoading,
    error,
    setError,
    selectedPatient,
    verbosity,
    identifyIndicators,
    startDate,
  } = props;
  const messageEl = useRef<HTMLDivElement>(null);
  const [patientSummary, setPatientSummary] = useState<string>("");
  const [careGaps, setCareGaps] = useState<any[]>([]);
  const [summaryLoaded, setSummaryLoaded] = useState<boolean>(false);
  const [isCareGapsLoading, setIsCareGapsLoading] = useState<boolean>(false);

  const formatSummary = (summary: string) => {
    let formattedSummary = summary
      .replace(
        /MRN:\s*(\d{10})|(\d{10})\n=+/,
        '<h4 style="margin-bottom: 15px;">MRN: $1$2</h4>'
      )
      .replace(
        /(Potential Undiagnosed Conditions:)/g,
        '<h5 style="margin-bottom: 0px;margin-top: 20px;font-weight: bold; color: #161616;">$1</h5>'
      )
      .replace(
        /(Recommendations for Discussion with the Patient:|Recent Operations:|Maintenance Medications That Have Not Been Recently Filled:|Maintenance Medications:)/g,
        '<h5 style="margin-bottom: 10px; margin-top: 20px; font-weight: bold; color: #161616;">$1</h5>'
      )
      .replace(
        /([^\n]+)\n={3,}/g,
        '<h4 style="margin-top: 20px; margin-bottom: 15px; color: #161616;">$1</h4>'
      )
      .replace(
        /### ([^\n]+)/g,
        '<h5 style="margin-bottom: 10px; margin-top: 20px; font-weight: bold; color: #161616;">$1</h5>'
      )
      .replace(/\*\*(.*?)\*\*/g, '<span style="font-weight: bold;">$1</span>')
      .replace(
        /\*(.*?)\*\*/g,
        '<h5 style="margin-bottom: 10px; margin-top: 20px; font-weight: bold; color: #161616;">$1</h5>'
      )
      .replace(/\n-{3,}/g, "")
      .replace(
        /^[\*\+]\s*(.*)/gm,
        '<li style="margin-left: 5px; margin-top: 5px; margin-bottom: 5px;">$1</li>'
      )
      .replace(
        /^\d+\.\s*(.*)/gm,
        '<li style="margin-left: 5px; margin-top: 5px; margin-bottom: 5px;">$1</li>'
      )
      .replace(/\n{3,}/g, "\n\n")
      .replace(/\n/g, "<br>")
      .replace(/<br><br>/g, "<br>")
      .replace(/(<h[45].*?>.*?<\/h[45]>)(<br>)+/g, "$1")
      .replace(/(<li.*?>.*?<\/li>)(<br>)+/g, "$1");

    formattedSummary = formattedSummary.replace(
      /(<li.*?>.*?<\/li>)+/g,
      '<ul style="margin-top: 5px; margin-bottom: 10px; padding-left: 20px; list-style-type: disc;">$&</ul>'
    );

    return (
      <div
        className="patient-summary"
        style={{
          fontFamily: "IBM Plex Sans, Arial, sans-serif",
          lineHeight: "1.5",
          color: "#161616",
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: formattedSummary }} />
      </div>
    );
  };

  const removeDuplicateCareGaps = (careGaps: any[]) => {
    const seen = new Set();
    return careGaps.filter((careGap) => {
      const serialized = JSON.stringify(careGap);
      if (seen.has(serialized)) {
        return false;
      }
      seen.add(serialized);
      return true;
    });
  };

  async function getAndSetPatientSummary() {
    if (!selectedPatient) {
      console.log("No patient selected, skipping fetch");
      return;
    }

    setSummaryLoaded(false);
    

    let summaryResponse = await getPatientSummary(selectedPatient, {
      verbosity,
      start_date: startDate,
      identify_indicators_in_summary: identifyIndicators,
    });

    setPatientSummary(summaryResponse.summary || "");
    setSummaryLoaded(true);
  }

  async function getAndSetPatientCareGaps() {
    if (!selectedPatient) {
      console.log("No patient selected, skipping fetch");
      return;
    }
    setIsCareGapsLoading(true);

    const careGapsResponse = await getPatientCareGaps(
      selectedPatient,
      startDate
    );

    const uniqueCareGaps = removeDuplicateCareGaps(
      careGapsResponse.care_gaps || []
    ).map((careGap, index) => ({
      ...careGap,
      id: `${careGap.care_gap}-${index}`,
    }));

    setCareGaps(uniqueCareGaps);
    setIsCareGapsLoading(false);
    
  }

  const fetchPatientData = useCallback(async () => {
    if (!selectedPatient) {
      console.log("No patient selected, skipping fetch");
      return;
    }

    setIsLoading(true);
    setError(null);
    

    const summaryOptions = {
      verbosity,
      start_date: startDate,
      identify_indicators_in_summary: identifyIndicators,
    };

    const careGapsOptions = {
      start_date: startDate,
    };

    console.log("Component Summary Options:", summaryOptions);
    console.log("Component Care Gaps Options:", careGapsOptions);

    try {
      console.log("Fetching patient summary...");
      console.log("Fetching care gaps...");

      await Promise.all([getAndSetPatientSummary(), getAndSetPatientCareGaps()]);
      setIsLoading(false);


    } catch (error) {
      console.error("Error in fetchPatientData:", error);
      let errorMessage = "Failed to load patient data.";
      if (error instanceof Error) {
        errorMessage += ` (Error: ${error.message})`;
      } else {
        errorMessage += " (An unknown error occurred)";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      
      console.log("API calls completed");
    }
  }, [selectedPatient, verbosity, identifyIndicators, startDate]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (!selectedPatient) return;
    if (regenerateTrigger === 0) return;
    if (lastProcessedTrigger.current === regenerateTrigger) {
      console.log("Already processed trigger:", regenerateTrigger);
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setIsLoading(true);
        lastProcessedTrigger.current = regenerateTrigger;
        await fetchPatientData();
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [selectedPatient, regenerateTrigger, fetchPatientData]);

  const formattedSummary = useMemo(
    () => formatSummary(patientSummary),
    [patientSummary]
  );

  return (
    <div className="chat">
      <div className="patient-summary-heading">
        <span>Patient Summary</span>
      </div>
      <div className="chat-content-wrapper">
        <div className="chat__messages" ref={messageEl}>
          {!summaryLoaded ? (
            <div className="loading-container">
              <p className="info-text">Preparing your patient summary...</p>
              <Loading
                description="Generating patient summary"
                withOverlay={false}
              />
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              <p className="info-text">AI Explained</p>
              {formattedSummary}
            </>
          )}
        </div>
        {!error && (
          <div className="care-gap-container">
            {isCareGapsLoading ? (
              <div className="loading-container">
                <p className="info-text">Loading care gaps...</p>
                <Loading description="Identifying care gaps" withOverlay={false} />
              </div>
            ) : careGaps.length > 0 ? (
              <div className="table-wrapper">
                <ChatTable
                  header={[
                    "Care Gap Opportunity",
                    "Next Best Action",
                    "Assignment",
                  ]}
                  keys={[
                    "care_gap",
                    "next_best_action",
                    "next_action_assignment",
                  ]}
                  data={careGaps}
                  feedback={false}
                />
              </div>
            ) : (
              <p className="no-care-gaps">No care gaps found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
