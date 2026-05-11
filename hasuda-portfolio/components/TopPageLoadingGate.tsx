"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";

const MIN_LOADING_MS = 1500;
const MAX_LOADING_MS = 3000;
const EXIT_ANIMATION_MS = 320;

type Props = {
  forceVisible?: boolean;
};

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function waitForTypekitClass() {
  return new Promise<void>((resolve) => {
    const root = document.documentElement;
    const typekitStatus = /\bwf-(active|inactive)\b/;
    if (typekitStatus.test(root.className)) {
      resolve();
      return;
    }

    const observer = new MutationObserver(() => {
      if (!typekitStatus.test(root.className)) return;
      finish();
    });
    const fallbackTimerId = window.setTimeout(finish, MAX_LOADING_MS);

    function finish() {
      observer.disconnect();
      window.clearTimeout(fallbackTimerId);
      resolve();
    }

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
  });
}

function waitForFonts() {
  const fontReady = document.fonts?.ready ?? Promise.resolve();

  return Promise.all([
    fontReady.catch(() => undefined),
    waitForTypekitClass().catch(() => undefined),
  ]);
}

export default function TopPageLoadingGate({ forceVisible = false }: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (forceVisible) return;

    let isMounted = true;
    let exitTimerId: number | undefined;

    Promise.all([
      wait(MIN_LOADING_MS),
      Promise.race([waitForFonts(), wait(MAX_LOADING_MS)]),
    ]).then(() => {
      if (!isMounted) return;

      setIsExiting(true);
      exitTimerId = window.setTimeout(() => {
        if (isMounted) setIsVisible(false);
      }, EXIT_ANIMATION_MS);
    });

    return () => {
      isMounted = false;
      if (exitTimerId) window.clearTimeout(exitTimerId);
    };
  }, [forceVisible]);

  if (!isVisible) return null;

  return <LoadingScreen isExiting={isExiting && !forceVisible} />;
}
