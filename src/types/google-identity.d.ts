declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            auto_select?: boolean;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          prompt: (callback?: (notification: GooglePromptNotification) => void) => void;
          cancel?: () => void;
        };
      };
    };
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }

  interface GoogleCredentialResponse {
    credential: string;
    select_by?: string;
  }

  interface GooglePromptNotification {
    isNotDisplayed(): boolean;
    isSkippedMoment(): boolean;
    isDismissedMoment(): boolean;
    getNotDisplayedReason?(): string;
    getSkippedReason?(): string;
    getDismissedReason?(): string;
  }
}

export {};
