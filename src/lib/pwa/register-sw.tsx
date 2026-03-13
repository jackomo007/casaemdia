"use client";

import { useEffect } from "react";

let isRegistered = false;

export function useRegisterServiceWorker() {
  useEffect(() => {
    if (isRegistered || !("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    isRegistered = true;
  }, []);
}
