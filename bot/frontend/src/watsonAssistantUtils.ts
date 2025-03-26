let currentPatientId: string | number = "1";
let watsonAssistantInitialized = false;
let lastLoggedPatientId: string | number | null = null;

const validateEnvVariables = () => {
  const required = [
    "REACT_APP_WATSON_INTEGRATION_ID",
    "REACT_APP_WATSON_REGION",
    "REACT_APP_WATSON_SERVICE_INSTANCE_ID",
    "REACT_APP_WATSON_CHAT_URL",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

export function reset() {
  if (window.watsonAssistantInstance) {
    window.watsonAssistantInstance.restartConversation();
  }

  const watsonElement = document.querySelector(".WatsonAssistantChatElement");
  if (watsonElement) {
    watsonElement.remove();
  }
}

export function initializeWatsonAssistant(patientId: string | number) {
  validateEnvVariables();

  const existingElement = document.querySelector(".WatsonAssistantChatElement");
  if (existingElement) {
    existingElement.remove();
  }

  if (watsonAssistantInitialized) {
    console.log("Watson Assistant initialized");
    return;
  }

  const existingScript = document.querySelector(
    'script[src*="WatsonAssistantChatEntry.js"]'
  );
  if (existingScript) {
    existingScript.remove();
  }

  watsonAssistantInitialized = true;
  currentPatientId = patientId;

  function setPatientIdPreSendHandler(event: any) {
    if (event.data.input) {
      event.data.context.skills["actions skill"] =
        event.data.context.skills["actions skill"] || {};
      event.data.context.skills["actions skill"].skill_variables =
        event.data.context.skills["actions skill"].skill_variables || {};
      event.data.context.skills["actions skill"].skill_variables.patient_id =
        currentPatientId.toString();

      if (lastLoggedPatientId !== currentPatientId) {
        console.log(
          "Watson Assistant: Setting patient ID to",
          currentPatientId
        );
        lastLoggedPatientId = currentPatientId;
      }
    }
  }

  window.watsonAssistantChatOptions = {
    integrationID: process.env.REACT_APP_WATSON_INTEGRATION_ID,
    region: process.env.REACT_APP_WATSON_REGION,
    serviceInstanceID: process.env.REACT_APP_WATSON_SERVICE_INSTANCE_ID,
    headerConfig: {
      showRestartButton: true,
    },
    onLoad: async (instance: any) => {
      instance.on({
        type: "pre:send",
        handler: setPatientIdPreSendHandler,
      });
      window.watsonAssistantInstance = instance;
      console.log("Watson Assistant: Instance loaded and stored globally");
      await instance.render();
    },
  };

  const t = document.createElement("script");
  t.src =
    `${process.env.REACT_APP_WATSON_CHAT_URL}/` +
    (window.watsonAssistantChatOptions.clientVersion || "latest") +
    "/WatsonAssistantChatEntry.js";
  document.head.appendChild(t);
}

export function updatePatientId(newPatientId: string | number) {
  currentPatientId = newPatientId;
  console.log("Watson Assistant: Updated patient ID to", currentPatientId);
  if (window.watsonAssistantInstance) {
    window.watsonAssistantInstance.restartConversation();
    console.log("Watson Assistant: Conversation restarted for new patient ID");
  } else {
    console.warn(
      "Watson Assistant instance not available. Unable to restart conversation."
    );
  }
}

export function cleanup() {
  watsonAssistantInitialized = false;

  const existingElement = document.querySelector(".WatsonAssistantChatElement");
  if (existingElement) {
    existingElement.remove();
  }

  const existingScript = document.querySelector(
    'script[src*="WatsonAssistantChatEntry.js"]'
  );
  if (existingScript) {
    existingScript.remove();
  }

  if (window.watsonAssistantInstance) {
    window.watsonAssistantInstance.destroy();
    window.watsonAssistantInstance = null;
  }

  if (window.watsonAssistantChatOptions) {
    window.watsonAssistantChatOptions = undefined;
  }
}
