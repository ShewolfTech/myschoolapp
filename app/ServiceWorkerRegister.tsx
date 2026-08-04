"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      // A service worker intercepting fetches conflicts with Next.js dev
      // server's hot-reload/streaming behavior and can cause reload loops.
      // Actively unregister any SW left over from earlier testing, and
      // skip registering a new one while in development.
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((reg) => reg.unregister());
      });
      return;
    }

    navigator.serviceWorker
      .register("/sw.js")
      .catch((err) => console.error("Service worker registration failed:", err));
  }, []);

  return null;
}
