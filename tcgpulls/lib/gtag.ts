// lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

type GaEventParams = {
  category: string;
  label: string;
  value?: number;
} & Record<string, unknown>;

// Track a page view
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Set the user ID for GA
export const setUserId = (userId: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("set", { user_id: userId });
  }
};

// Track custom events
export const gaEvent = (
  action: string,
  { category, label, value, ...rest }: GaEventParams,
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
      ...rest,
    });
  }
};
