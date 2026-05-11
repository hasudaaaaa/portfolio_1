"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";

const MIN_LOADING_MS = 1500;
const MAX_LOADING_MS = 3000;
const EXIT_ANIMATION_MS = 500;
const LOADER_STORAGE_KEY = "hasudaTopLoaderShownAt";
// 次回ローディング画面表示まで6時間
const LOADER_SKIP_TTL_MS = 6 * 60 * 60 * 1000;

type Props = {
  forceVisible?: boolean;
};

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function hasRecentLoaderShown() {
  try {
    const shownAt = Number(window.localStorage.getItem(LOADER_STORAGE_KEY));
    return Number.isFinite(shownAt) && Date.now() - shownAt < LOADER_SKIP_TTL_MS;
  } catch {
    return false;
  }
}

function markLoaderShown() {
  try {
    window.localStorage.setItem(LOADER_STORAGE_KEY, String(Date.now()));
  } catch {
    return;
  }
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

    if (hasRecentLoaderShown()) {
      const skipTimerId = window.setTimeout(() => setIsVisible(false), 0);
      return () => window.clearTimeout(skipTimerId);
    }

    let isMounted = true;
    let exitTimerId: number | undefined;

    Promise.all([
      wait(MIN_LOADING_MS),
      Promise.race([waitForFonts(), wait(MAX_LOADING_MS)]),
    ]).then(() => {
      if (!isMounted) return;

      markLoaderShown();
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
