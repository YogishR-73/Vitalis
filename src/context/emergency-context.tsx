"use client";

import * as React from "react";

type EmergencyContextValue = {
  active: boolean;
  setActive: (v: boolean) => void;
  toggle: () => void;
};

const EmergencyContext = React.createContext<EmergencyContextValue | null>(null);

export function EmergencyProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = React.useState(false);
  const toggle = React.useCallback(() => setActive((a) => !a), []);

  const value = React.useMemo(
    () => ({ active, setActive, toggle }),
    [active, toggle]
  );

  React.useEffect(() => {
    document.documentElement.classList.toggle("emergency-mode", active);
    return () => document.documentElement.classList.remove("emergency-mode");
  }, [active]);

  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  const ctx = React.useContext(EmergencyContext);
  if (!ctx) throw new Error("useEmergency must be used within EmergencyProvider");
  return ctx;
}
