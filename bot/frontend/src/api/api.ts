import axios from "axios";

interface Patient {
  id: number;
  name: string;
  mrn: string;
  pcp: string;
  dob: string;
  gender: string;
}

export async function getPatientsList() {
  try {
    const response = await api.get("/healthcare/patients", {
      params: { full_detail: false },
    });
    return response.data as Patient[];
  } catch (error) {
    handleApiError("Error fetching patients list:", error);
    throw error;
  }
}

export const API_BASE_URL =
  "https://watsonx-api.1g88fv3g83rh.us-south.codeengine.appdomain.cloud"  ;

// const credentials = btoa("watsonx:watsonx");
const credentials = btoa("watsonx:watsonx".trim());
// const credentials = "d2F0c29ueDp3YXRzb254";
console.log(btoa("watsonx:watsonx"));

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     Authorization: `Basic ${credentials}`,
//     "Content-Type": "application/json",
//   },
// });
const api = axios.create({
  baseURL: "https://watsonx-api.1g88fv3g83rh.us-south.codeengine.appdomain.cloud",
  headers: {
    Authorization: "Basic d2F0c29ueDp3YXRzb254",
    "Content-Type": "application/json",
  },
});

// ✅ Make the call
api.get("/healthcare/patients")
  .then((res) => {
    console.log("Patients:", res.data);
  })
  .catch(console.error);

export function getDefaultStartDate() {
  const today = new Date();
  const sixMonthsAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 6,
    today.getDate()
  );
  return sixMonthsAgo.toISOString().split("T")[0];
}

export async function getPatientDetails(patientId: any, options = {}) {
  try {
    const response = await api.get(`/healthcare/patients/${patientId}`, {
      params: options,
    });
    return response.data;
  } catch (error) {
    handleApiError("Error fetching patient details:", error);
    throw error;
  }
}

export async function getPatientCareGaps(
  patientId: string,
  startDate?: string | null
) {
  try {
    console.log("getPatientCareGaps called with:", {
      patientId,
      startDate,
    });

    const params = {
      start_date: startDate || getDefaultStartDate(),
    };

    console.log("Care Gaps request params:", params);

    const response = await api.get(`/healthcare/care-gaps/${patientId}`, {
      params,
    });

    console.log("Care Gaps API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getPatientCareGaps:", error);
    handleApiError("Error fetching care gaps:", error);
    throw error;
  }
}

export async function getPatientSummary(patientId: string, options = {}) {
  try {
    const defaultOptions = {
      verbosity: 1,
      start_date: getDefaultStartDate(),
      care_gaps: false,
      identify_indicators_in_summary: false,
      decoding_method: "sample",
    };

    const finalOptions = { ...defaultOptions, ...options };
    console.log("Final request options:", finalOptions);

    const response = await api.get(`/healthcare/patient-summary/${patientId}`, {
      params: finalOptions,
    });

    console.log("Patient Summary API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getPatientSummary:", error);
    handleApiError("Error fetching patient summary:", error);
    throw error;
  }
}

function handleApiError(message: any, error: any) {
  if (error.code === "ECONNABORTED") {
    console.log(
      `${message} Request timed out. The server might be starting up.`
    );
  } else if (error.response) {
    console.error(
      `${message} Server responded with error:`,
      error.response.data
    );
    console.error("Status:", error.response.status);
    console.error("Headers:", error.response.headers);
  } else if (error.request) {
    console.error(`${message} No response received:`, error.request);
  } else {
    console.error(`${message} Error`, error.message);
  }
}

export const getPatientSummaryAndCareGaps = async (
  patientId: string,
  verbosity: number = 1,
  identifyIndicators: boolean = false,
  startDate?: string | null
) => {
  try {
    const params = {
      verbosity: verbosity,
      start_date: startDate || getDefaultStartDate(),
      care_gaps: true,
      identify_indicators_in_summary: identifyIndicators,
      decoding_method: "sample",
    };

    console.log(
      "Making API request to:",
      `${API_BASE_URL}/healthcare/patient-summary/${patientId}`
    );
    console.log("With params:", params);

    const response = await axios.get(
      `${API_BASE_URL}/healthcare/patient-summary/${patientId}`,
      {
        params,
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("API call error details:", error);
    handleApiError("Error fetching patient summary and care gaps:", error);
    throw error;
  }
};

export async function generateCareGapMessage(careGapData: any) {
  try {
    const response = await api.post(
      "/healthcare/generate-caregap-message",
      careGapData
    );
    console.log("Generated Care Gap Message:", response.data);
    return response.data.message;
  } catch (error) {
    handleApiError("Error generating care gap message:", error);
    throw error;
  }
}

export default api;
