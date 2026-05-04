"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { InstitutionCard } from "@/components/signup/InstitutionCard";
import { FloatingBackLink } from "@/components/signup/FloatingBackLink";
import {
  getInstitutions,
  isKnownInstitutionName,
} from "@/lib/local-db";

/* ─── constants ──────────────────────────────────────────────────── */

const SIGNUP_INSTITUTION_STORAGE_KEY = "tertiaryfree:signup-institution";
const SIGNUP_STUDENT_DETAILS_STORAGE_KEY = "tertiaryfree:signup-student-details";
const SIGNUP_INSTITUTION_UPDATED_EVENT = "tertiaryfree:signup-institution-updated";
const INSTITUTIONS = getInstitutions();
const MOBILE_MEDIA_QUERY = "(max-width: 767px)";
const START_OVER_QUERY_PARAM = "startOver";

/**
 * Extra metadata for each institution card.
 * logoSrc  → relative to /public
 * tagline  → badge shown above the card (optional, marks the "featured" slot)
 * featured → renders the gradient accent ring
 */
const INSTITUTION_META = {
  htu: {
    logoSrc: "/HTU-LOGO.png",
    tagline: null,
    featured: false,
  },
  uhas: {
    logoSrc: "/uhas_logo.png",
    tagline: null,
    featured: false,
  },
  amedzofe: {
    logoSrc: "/amedzofe logo.png",
    tagline: null,
    featured: false,
  },
};

/* ─── helpers ────────────────────────────────────────────────────── */

function shouldStartOver() {
  if (typeof window === "undefined") return false;
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(START_OVER_QUERY_PARAM) === "1";
}

function readStoredInstitutionName() {
  if (typeof window === "undefined") return "";

  try {
    const storedValue = window.localStorage.getItem(SIGNUP_INSTITUTION_STORAGE_KEY);
    if (!storedValue) return "";

    const parsed = JSON.parse(storedValue);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.name === "string" &&
      isKnownInstitutionName(parsed.name)
    ) {
      return parsed.name;
    }
  } catch {
    // ignore invalid payloads
  }

  return "";
}

function getInstitutionLogoSrc(institutionId) {
  return INSTITUTION_META[institutionId]?.logoSrc ?? null;
}

function persistSelectedInstitution(institutionName) {
  const selectedInstitutionRecord = INSTITUTIONS.find(
    (institution) => institution.name === institutionName,
  );

  if (!selectedInstitutionRecord) return false;

  const institutionLogoSrc = getInstitutionLogoSrc(selectedInstitutionRecord.id);
  const payload = institutionLogoSrc
    ? { ...selectedInstitutionRecord, logoSrc: institutionLogoSrc }
    : selectedInstitutionRecord;

  try {
    window.localStorage.setItem(
      SIGNUP_INSTITUTION_STORAGE_KEY,
      JSON.stringify(payload),
    );
    window.dispatchEvent(new Event(SIGNUP_INSTITUTION_UPDATED_EVENT));
    return true;
  } catch {
    return false;
  }
}

/* ─── page ───────────────────────────────────────────────────────── */

export default function SignupInstitutionPage() {
  const router = useRouter();
  const [selectedInstitution, setSelectedInstitution] = useState(() =>
    shouldStartOver() ? "" : readStoredInstitutionName(),
  );

  useEffect(() => {
    if (!shouldStartOver()) return;

    try {
      window.localStorage.removeItem(SIGNUP_INSTITUTION_STORAGE_KEY);
      window.localStorage.removeItem(SIGNUP_STUDENT_DETAILS_STORAGE_KEY);
      window.dispatchEvent(new Event(SIGNUP_INSTITUTION_UPDATED_EVENT));
    } catch {
      // ignore cleanup failures
    }
  }, []);

  const isMobileViewport = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
  };

  const handleContinue = (institutionName = selectedInstitution) => {
    const institutionToContinueWith =
      typeof institutionName === "string" ? institutionName : selectedInstitution;

    if (!persistSelectedInstitution(institutionToContinueWith)) return;

    router.push("/signup/details");
  };

  const handleSelectInstitution = (institution) => {
    setSelectedInstitution(institution.name);
    const didPersistSelection = persistSelectedInstitution(institution.name);

    if (isMobileViewport() && didPersistSelection) {
      router.push("/signup/details");
    }
  };

  return (
    <>
      {/* ── inline styles ──────────────────────────────────────────── */}
      <style>{`
        /* Page shell */
        .institution-page {
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5rem 1.25rem 2.5rem;
          position: relative;
          overflow: hidden;
          background: #f5f5f7;
        }

        /* Soft background blobs */


        /* Content container */
        .institution-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 860px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.5rem;
        }

        /* Header */
        .institution-header {
          text-align: center;
        }
        .institution-eyebrow {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6366f1;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.25);
          padding: 0.3rem 0.9rem;
          border-radius: 999px;
          margin-bottom: 1rem;
        }
        .institution-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #111;
          margin: 0 0 0.5rem;
          line-height: 1.15;
        }
        .institution-subtitle {
          font-size: 0.95rem;
          color: #666;
          margin: 0;
        }

        /* Cards grid */
        .institution-grid {
          display: flex;
          flex-direction: row;
          gap: 1.25rem;
          width: 100%;
          justify-content: center;
          align-items: stretch;
        }
        @media (max-width: 640px) {
          .institution-grid {
            flex-direction: column;
            align-items: center;
          }
          .institution-card-wrapper {
            width: 100%;
            max-width: 260px;
          }
        }

        /* ── Card wrapper ─────────────────────────────────────── */
        .institution-card-wrapper {
          position: relative;
          display: flex;
          flex: 1;
          max-width: 260px;
          min-width: 200px;
          border-radius: 22px;
          transition: transform 0.25s ease;
        }
        .institution-card-wrapper:hover {
          transform: translateY(-4px);
        }
        .institution-card-featured {
          z-index: 2;
        }
        .institution-card-featured:hover {
          transform: translateY(-8px);
        }

        /* Gradient accent ring */
        .institution-card-ring {
          position: absolute;
          inset: -2px;
          border-radius: 24px;
          background: linear-gradient(135deg, #a855f7, #6366f1, #ec4899);
          z-index: 0;
          pointer-events: none;
        }

        /* Badge */
        .institution-card-badge {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          background: linear-gradient(90deg, #a855f7, #6366f1);
          color: #fff;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.3rem 0.9rem;
          border-radius: 999px;
          white-space: nowrap;
          box-shadow: 0 2px 10px rgba(99,102,241,0.35);
        }

        /* The actual card button */
        .institution-card-btn {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 100%;
          height: 100%;
          border-radius: 22px;
          border: none;
          overflow: hidden;
          background: #fff;
          cursor: pointer;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          transition: box-shadow 0.25s ease;
          text-align: left;
          padding: 0;
        }
        .institution-card-selected .institution-card-btn {
          box-shadow: 0 6px 32px rgba(99,102,241,0.25);
        }
        .institution-card-btn:focus-visible {
          outline: 3px solid #6366f1;
          outline-offset: 3px;
        }

        /* Logo area */
        .institution-card-logo-area {
          position: relative;
          height: 140px;
          background: linear-gradient(135deg, #e8e8f4 0%, #f0eef8 100%);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .institution-card-logo-img {
          object-fit: contain;
          padding: 1.25rem;
          transition: transform 0.3s ease;
        }
        #institution-card-htu .institution-card-logo-img {
          transform: scale(1.16);
        }
        #institution-card-uhas .institution-card-logo-img {
          transform: scale(1.3);
        }
        .institution-card-abbr-placeholder {
          font-size: 2.25rem;
          font-weight: 800;
          letter-spacing: -0.05em;
          color: rgba(99,102,241,0.35);
          user-select: none;
        }
        .institution-card-logo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.6) 100%);
        }

        /* Body */
        .institution-card-body {
          padding: 1rem 1.25rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          flex: 1;
        }
        .institution-card-abbr {
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #111;
          margin: 0;
          line-height: 1;
        }
        .institution-card-name {
          font-size: 0.72rem;
          font-weight: 500;
          color: #888;
          margin: 0;
          line-height: 1.4;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        /* Selection dot */
        .institution-card-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid #ccc;
          background: transparent;
          position: absolute;
          bottom: 1.1rem;
          right: 1.1rem;
          transition: all 0.2s ease;
        }
        .institution-card-dot-active {
          background: #6366f1;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.2);
        }

        /* Continue button */
        .institution-continue-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.85rem 2.5rem;
          border-radius: 999px;
          border: none;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: all 0.25s ease;
          background: linear-gradient(135deg, #a855f7, #6366f1);
          color: #fff;
          box-shadow: 0 4px 20px rgba(99,102,241,0.35);
        }
        .institution-continue-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(99,102,241,0.45);
        }
        .institution-continue-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          background: #ccc;
          box-shadow: none;
        }
        .institution-continue-btn svg {
          width: 16px;
          height: 16px;
        }

        /* Footnote */
        .institution-footnote {
          font-size: 0.78rem;
          color: #aaa;
          text-align: center;
        }

        /* Dark theme overrides */
        html.dark .institution-page {
          background: #0f1324;
        }
        html.dark .institution-title {
          color: #f2f3ff;
        }
        html.dark .institution-subtitle {
          color: #b8c0d6;
        }
        html.dark .institution-card-btn {
          background: rgba(20, 26, 46, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.22);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.34);
        }
        html.dark .institution-card-selected .institution-card-btn {
          border-color: rgba(129, 140, 248, 0.55);
          box-shadow: 0 12px 34px rgba(30, 41, 59, 0.7);
        }
        html.dark .institution-card-logo-area {
          background: linear-gradient(135deg, #1f2745 0%, #171d34 100%);
        }
        html.dark .institution-card-logo-overlay {
          background: linear-gradient(to bottom, transparent 50%, rgba(15, 19, 36, 0.56) 100%);
        }
        html.dark .institution-card-abbr {
          color: #f2f3ff;
        }
        html.dark .institution-card-name {
          color: #9ea9c3;
        }
        html.dark .institution-card-dot {
          border-color: #64748b;
        }
        html.dark .institution-continue-btn:disabled {
          background: #4b5563;
          color: #cbd5e1;
        }
        html.dark .institution-footnote {
          color: #94a3b8;
        }
      `}</style>

      <main className="institution-page">
        <FloatingBackLink href="/" label="Back to home" />

        <div className="institution-container">
          {/* Header */}
          <header className="institution-header">

            <h1 className="institution-title">Select Your Institution</h1>
            <p className="institution-subtitle">
              Choose the school you are enrolled in to get started
            </p>
          </header>

          {/* Cards */}
          <div className="institution-grid" role="group" aria-label="Institution selection">
            {INSTITUTIONS.map((institution) => {
              const meta = INSTITUTION_META[institution.id] ?? {};
              return (
                <InstitutionCard
                  key={institution.name}
                  name={institution.name}
                  abbreviation={institution.abbreviation}
                  logoSrc={meta.logoSrc ?? null}
                  tagline={meta.tagline ?? null}
                  isFeatured={meta.featured ?? false}
                  isSelected={selectedInstitution === institution.name}
                  onSelect={() => handleSelectInstitution(institution)}
                />
              );
            })}
          </div>

          {/* Continue (desktop) */}
          <div>
            <button
              type="button"
              id="institution-continue-btn"
              onClick={() => handleContinue()}
              className="institution-continue-btn"
              disabled={!selectedInstitution}
            >
              Continue
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <p className="institution-footnote">
            Only schools registered on TertiaryFree are listed above.
          </p>
        </div>
      </main>
    </>
  );
}
