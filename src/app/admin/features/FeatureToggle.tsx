"use client";

import { useOptimistic, startTransition } from "react";
import { toggleFeature } from "@/actions/features";

interface FeatureToggleProps {
  tenantId: string;
  featureKey: string;
  initialEnabled: boolean;
}

export function FeatureToggle({
  tenantId,
  featureKey,
  initialEnabled,
}: FeatureToggleProps) {
  const [optimisticEnabled, setOptimisticEnabled] = useOptimistic(
    initialEnabled,
    (state, newState: boolean) => newState
  );

  const handleToggle = async () => {
    const newState = !optimisticEnabled;
    
    startTransition(() => {
      setOptimisticEnabled(newState);
      
      const formData = new FormData();
      formData.append("tenantId", tenantId);
      formData.append("featureKey", featureKey);
      // The server action toggles the value provided.
      // If we send "true", it sets it to "false".
      // So we should send the *current* optimistic state before the toggle.
      // Which is 'optimisticEnabled'. 
      // But wait! If user clicks fast multiple times?
      // "optimisticEnabled" might be ahead of server.
      // Server action logic: 
      // const enabled = formData.get('enabled') === 'true';
      // update: { enabled: !enabled }
      // So if I send "true", it becomes "false". Matches.
      formData.append("enabled", String(optimisticEnabled));
      
      toggleFeature(formData);
    });
  };

  return (
    <button
      onClick={handleToggle}
      type="button"
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
        optimisticEnabled ? "bg-emerald-600" : "bg-gray-200"
      }`}
      role="switch"
      aria-checked={optimisticEnabled}
    >
      <span className="sr-only">Toggle feature</span>
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          optimisticEnabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
