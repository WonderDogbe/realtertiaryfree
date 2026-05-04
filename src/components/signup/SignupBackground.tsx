"use client";

import { useEffect, useState } from "react";

const SIGNUP_INSTITUTION_STORAGE_KEY = "tertiaryfree:signup-institution";
const SIGNUP_INSTITUTION_UPDATED_EVENT = "tertiaryfree:signup-institution-updated";

const INSTITUTION_LOGOS_BY_ID: Record<string, string> = {
  htu: "/HTU-LOGO.png",
  uhas: "/uhas_logo.png",
  amedzofe: "/amedzofe logo.png",
};

const INSTITUTION_LOGOS_BY_NAME: Record<string, string> = {
  "HO TECHNICAL UNIVERSITY": "/HTU-LOGO.png",
  "UNIVERSITY OF HEALTH AND ALLIED SERVICES": "/uhas_logo.png",
  "UNIVERSITY OF HEALTH AND ALLIED SCIENCES": "/uhas_logo.png",
  "AMEDZOFE COLLEGE OF EDUCATION": "/amedzofe logo.png",
};

type StoredInstitutionPayload = {
  id?: unknown;
  name?: unknown;
  logoSrc?: unknown;
};

function resolveStoredInstitutionLogo(payload: StoredInstitutionPayload): string | null {
  if (typeof payload.logoSrc === "string" && payload.logoSrc.trim()) {
    return payload.logoSrc;
  }

  if (typeof payload.id === "string") {
    const logoFromId = INSTITUTION_LOGOS_BY_ID[payload.id.trim().toLowerCase()];
    if (logoFromId) return logoFromId;
  }

  if (typeof payload.name === "string") {
    const logoFromName = INSTITUTION_LOGOS_BY_NAME[payload.name.trim().toUpperCase()];
    if (logoFromName) return logoFromName;
  }

  return null;
}

export function SignupBackground() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const syncDarkMode = () => {
      setIsDarkMode(root.classList.contains("dark"));
    };

    syncDarkMode();

    const observer = new MutationObserver(syncDarkMode);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const readLogo = () => {
      try {
        const storedValue = window.localStorage.getItem(SIGNUP_INSTITUTION_STORAGE_KEY);
        if (!storedValue) {
          setLogoUrl(null);
          return;
        }
        const parsed = JSON.parse(storedValue);
        if (parsed && typeof parsed === "object") {
          setLogoUrl(resolveStoredInstitutionLogo(parsed as StoredInstitutionPayload));
        } else {
          setLogoUrl(null);
        }
      } catch {
        setLogoUrl(null);
      }
    };

    readLogo();
    // Listen for storage changes across tabs and explicit same-tab updates.
    window.addEventListener("storage", readLogo);
    window.addEventListener(SIGNUP_INSTITUTION_UPDATED_EVENT, readLogo);

    return () => {
      window.removeEventListener("storage", readLogo);
      window.removeEventListener(SIGNUP_INSTITUTION_UPDATED_EVENT, readLogo);
    };
  }, []);

  if (!logoUrl) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor: isDarkMode ? "#0f1324" : "#fdfdfd",
      }}
    >
      {/* The main blurred logo */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `url('${logoUrl}')`,
          backgroundSize: "600px", // Large but not overwhelming
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: isDarkMode ? "blur(70px) opacity(0.16)" : "blur(70px) opacity(0.12)", // "a bit blur" and subtle
          transform: "scale(1.2)",
          transition: "background-image 0.5s ease-in-out",
        }}
      />
      
      {/* Subtle overlay to soften the edges and keep content readable */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isDarkMode
            ? "radial-gradient(circle at center, transparent 0%, rgba(15, 19, 36, 0.58) 100%)"
            : "radial-gradient(circle at center, transparent 0%, rgba(253, 253, 253, 0.6) 100%)",
        }}
      />

      {/* Very faint, unblurred floating logo in the corner for "premium" feel */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          right: "40px",
          width: "120px",
          height: "120px",
          backgroundImage: `url('${logoUrl}')`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: isDarkMode ? 0.06 : 0.03,
          filter: "grayscale(100%)",
        }}
      />
    </div>
  );
}
