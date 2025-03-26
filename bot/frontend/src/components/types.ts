export interface NewsfeedDataType {
    label: string;
    children: Array<{ feed: string; onChange?: () => void; value?: string }>;
    critical: Array<{ message: string; senderID: string }>;
  }
  
  export interface NewsfeedButtonsType {
    children: Array<{ message: string; senderID: string }>;
  }
  
  export interface SideNavSectionDataType {
    title: string;
    content: Array<{
      label: string;
      children: Array<{ label: string }>;
    }>;
  }
  
  export interface Patient {
    id: number;
    name: string;
    mrn: string;
    pcp: string;
    dob: string;
    gender: string;
  }
  
  export interface AppSideNavProps {
    onRegenerateSummary: (
      verbosity: number,
      identifyIndicators: boolean,
      startDate?: string | null
    ) => void;
    isLoading: boolean;
    error: string | null;
    selectedPatient: string;
    onPatientSelect: (patientId: string) => void;
    activePatient: string;
    identifyIndicators: boolean;
    setIdentifyIndicators: React.Dispatch<React.SetStateAction<boolean>>;
    verbosityLevel: number;
  }
  