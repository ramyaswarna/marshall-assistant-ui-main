declare global {
  interface Window {
    currentPatientId: string;
    watsonAssistantInstance: any;
    watsonAssistantChatOptions: {
      integrationID: string;
      region: string;
      serviceInstanceID: string;
      clientVersion?: string;
      onLoad: (instance: any) => Promise<void>;
    };
  }
}

export {};
