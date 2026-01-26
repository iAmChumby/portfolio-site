export {};

declare global {
  interface Window {
    turnstile?: {
      reset: (widgetId?: string) => void;
      render: (selector: HTMLElement, options: { 
        sitekey: string; 
        callback: (token: string) => void; 
        theme: string;
        'expire-callback'?: () => void;
      }) => string;
      getResponse: (widgetId?: string) => string | undefined;
      remove: (widgetId: string) => void;
    };
  }
}
