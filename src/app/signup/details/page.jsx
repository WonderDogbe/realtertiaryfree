"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, GraduationCap, Presentation } from "lucide-react";
import { FloatingBackLink } from "@/components/signup/FloatingBackLink";
import { getSignupRoleOptions } from "@/lib/local-db";

const SIGNUP_INSTITUTION_STORAGE_KEY = "tertiaryfree:signup-institution";
const ROLE_OPTIONS = getSignupRoleOptions();
const HTU_INSTITUTION_NAME = "HO TECHNICAL UNIVERSITY";
const ROLE_ICON_BY_VALUE = {
  student: GraduationCap,
  lecturer: Presentation,
};

function isHtuInstitution(institutionName) {
  return institutionName.trim().toUpperCase() === HTU_INSTITUTION_NAME;
}

function readStoredInstitutionName() {
  if (typeof window === "undefined") return "";

  try {
    const storedValue = window.localStorage.getItem(SIGNUP_INSTITUTION_STORAGE_KEY);
    if (!storedValue) return "";

    const parsed = JSON.parse(storedValue);
    if (parsed && typeof parsed === "object" && typeof parsed.name === "string") {
      return parsed.name;
    }
  } catch {
    // Ignore invalid signup storage payloads.
  }

  return "";
}

export default function SignupDetailsPage() {
  const router = useRouter();
  const [institutionName] = useState(readStoredInstitutionName);
  const [selectedRole, setSelectedRole] = useState("");

  const handleContinue = () => {
    if (!selectedRole) return;

    if (selectedRole === "student") {
      if (isHtuInstitution(institutionName)) {
        router.push("/signup/student/department");
      } else {
        router.push("/signup/student");
      }
      return;
    }

    router.push(
      `/register?role=${selectedRole}&institution=${encodeURIComponent(institutionName)}`,
    );
  };

  return (
    <>
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
        }

        /* Card wrapper */
        .institution-card-wrapper {
          position: relative;
          flex: 1;
          max-width: 320px;
          min-width: 240px;
          border-radius: 22px;
          transition: transform 0.25s ease;
        }
        .institution-card-wrapper:hover {
          transform: translateY(-4px);
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

        /* The actual card button */
        .institution-card-btn {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
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
          padding: 1.5rem;
        }
        .institution-card-selected .institution-card-btn {
          box-shadow: 0 6px 32px rgba(99,102,241,0.25);
        }

        /* Icon area */
        .institution-card-icon-box {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: rgba(99,102,241,0.08);
          color: #6366f1;
          margin-bottom: 1.25rem;
          transition: all 0.3s ease;
        }
        .institution-card-selected .institution-card-icon-box {
          background: #6366f1;
          color: #fff;
        }

        /* Body */
        .institution-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #111;
          margin: 0 0 0.5rem;
        }
        .institution-card-desc {
          font-size: 0.88rem;
          color: #666;
          line-height: 1.5;
          margin: 0;
        }

        /* Selection dot */
        .institution-card-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid #ccc;
          background: transparent;
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
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
        html.dark .institution-card-icon-box {
          background: rgba(129, 140, 248, 0.18);
          color: #c7d2fe;
        }
        html.dark .institution-card-title {
          color: #f2f3ff;
        }
        html.dark .institution-card-desc {
          color: #a6b1ca;
        }
        html.dark .institution-card-dot {
          border-color: #64748b;
        }
        html.dark .institution-continue-btn:disabled {
          background: #4b5563;
          color: #cbd5e1;
        }
      `}</style>

      <main className="institution-page">
        <FloatingBackLink href="/signup/institution" label="Back to institution selection" />

        <div className="institution-container">
          {!institutionName ? (
            <div className="institution-header">
              <h1 className="institution-title">No Institution Selected</h1>
              <p className="institution-subtitle">Please select your institution first.</p>
              <div className="mt-8">
                <Link href="/signup/institution" className="institution-continue-btn">
                  <ArrowLeft size={18} />
                  Back to selection
                </Link>
              </div>
            </div>
          ) : (
            <>
              <header className="institution-header">

                <h1 className="institution-title">{institutionName}</h1>
                <p className="institution-subtitle">What is your role at this institution?</p>
              </header>

              <div className="institution-grid" role="group" aria-label="Role selection">
                {ROLE_OPTIONS.map((option) => {
                  const Icon = ROLE_ICON_BY_VALUE[option.value] || GraduationCap;
                  const isSelected = selectedRole === option.value;

                  return (
                    <div
                      key={option.value}
                      className={`institution-card-wrapper${isSelected ? " institution-card-selected" : ""}`}
                    >
                      {isSelected && <span className="institution-card-ring" aria-hidden="true" />}
                      <button
                        type="button"
                        onClick={() => setSelectedRole(option.value)}
                        className="institution-card-btn"
                        aria-pressed={isSelected}
                      >
                        <div className="institution-card-icon-box">
                          <Icon size={24} />
                        </div>
                        <h3 className="institution-card-title">{option.title}</h3>
                        <p className="institution-card-desc">{option.description}</p>
                        <div
                          className={`institution-card-dot${isSelected ? " institution-card-dot-active" : ""}`}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="institution-continue-btn"
                  disabled={!selectedRole}
                >
                  Continue
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
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
            </>
          )}
        </div>
      </main>
    </>
  );
}
