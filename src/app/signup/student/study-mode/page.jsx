"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { FloatingBackLink } from "@/components/signup/FloatingBackLink";
import {
  getProgrammeOptionsForFacultyAndType,
  getStudyModeOptions,
  isKnownDepartmentName,
  isKnownGender,
  isKnownLevel,
  isKnownProgrammeName,
  isKnownProgrammeType,
  isKnownStudyMode,
  isKnownWeekDay,
} from "@/lib/local-db";
import { ALL_WEEK_DAYS } from "@/lib/study-schedule";

const SIGNUP_INSTITUTION_STORAGE_KEY = "tertiaryfree:signup-institution";
const SIGNUP_STUDENT_DETAILS_STORAGE_KEY = "tertiaryfree:signup-student-details";
const HTU_INSTITUTION_NAME = "HO TECHNICAL UNIVERSITY";

const STUDY_MODE_OPTIONS = getStudyModeOptions();

function isHtuInstitution(institutionName) {
  return institutionName.trim().toUpperCase() === HTU_INSTITUTION_NAME;
}

function readStoredInstitutionName() {
  if (typeof window === "undefined") return "";
  try {
    const storedValue = window.localStorage.getItem(SIGNUP_INSTITUTION_STORAGE_KEY);
    if (!storedValue) return "";
    const parsed = JSON.parse(storedValue);
    if (parsed && typeof parsed === "object" && typeof parsed.name === "string") return parsed.name;
  } catch { /* ignore */ }
  return "";
}

function readStoredStudentDetails() {
  if (typeof window === "undefined") return { name: "", email: "", indexNumber: "", gender: "", level: "", department: "", programmeType: "", programme: "", studyMode: "", customStudyDays: [] };
  try {
    const storedValue = window.localStorage.getItem(SIGNUP_STUDENT_DETAILS_STORAGE_KEY);
    if (!storedValue) return { name: "", email: "", indexNumber: "", gender: "", level: "", department: "", programmeType: "", programme: "", studyMode: "", customStudyDays: [] };
    const parsed = JSON.parse(storedValue);
    if (!parsed || typeof parsed !== "object") return { name: "", email: "", indexNumber: "", gender: "", level: "", department: "", programmeType: "", programme: "", studyMode: "", customStudyDays: [] };
    
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
      indexNumber: typeof parsed.indexNumber === "string" ? parsed.indexNumber : "",
      gender: typeof parsed.gender === "string" && isKnownGender(parsed.gender) ? parsed.gender : "",
      level: typeof parsed.level === "string" && isKnownLevel(parsed.level) ? parsed.level : "",
      department: typeof parsed.department === "string" && isKnownDepartmentName(parsed.department) ? parsed.department : "",
      programmeType: typeof parsed.programmeType === "string" && isKnownProgrammeType(parsed.programmeType) ? parsed.programmeType : "",
      programme: typeof parsed.programme === "string" && isKnownProgrammeName(parsed.programme) ? parsed.programme : "",
      studyMode: typeof parsed.studyMode === "string" && isKnownStudyMode(parsed.studyMode) ? parsed.studyMode : "",
      customStudyDays: Array.isArray(parsed.customStudyDays) ? ALL_WEEK_DAYS.filter((day) => parsed.customStudyDays.some((storedDay) => storedDay === day)) : [],
    };
  } catch {
    return { name: "", email: "", indexNumber: "", gender: "", level: "", department: "", programmeType: "", programme: "", studyMode: "", customStudyDays: [] };
  }
}

export default function StudentStudyModePage() {
  const router = useRouter();
  const [institutionName] = useState(readStoredInstitutionName);
  const [studentDetails] = useState(readStoredStudentDetails);
  const requiresFacultyAndProgrammeSelection = isHtuInstitution(institutionName);

  const [studyMode, setStudyMode] = useState(studentDetails.studyMode);
  const [customStudyDays, setCustomStudyDays] = useState(studentDetails.customStudyDays);
  const [error, setError] = useState("");

  const programmeMatchesSelection = !requiresFacultyAndProgrammeSelection || (isKnownDepartmentName(studentDetails.department) && isKnownProgrammeType(studentDetails.programmeType) ? getProgrammeOptionsForFacultyAndType(studentDetails.department, studentDetails.programmeType).some((option) => option.name === studentDetails.programme) : false);

  const hasRequiredStudentDetails = studentDetails.name.trim() !== "" && studentDetails.email.trim() !== "" && studentDetails.email.includes("@") && studentDetails.indexNumber.trim() !== "" && isKnownGender(studentDetails.gender) && isKnownLevel(studentDetails.level) && (!requiresFacultyAndProgrammeSelection || (isKnownDepartmentName(studentDetails.department) && isKnownProgrammeType(studentDetails.programmeType) && isKnownProgrammeName(studentDetails.programme))) && programmeMatchesSelection;

  const hasValidStudyMode = isKnownStudyMode(studyMode) && (studyMode !== "custom" || customStudyDays.length > 0);

  const handleToggleCustomDay = (day) => {
    if (!isKnownWeekDay(day)) return;
    setCustomStudyDays((currentDays) => {
      const daySet = new Set(currentDays);
      if (daySet.has(day)) daySet.delete(day); else daySet.add(day);
      return ALL_WEEK_DAYS.filter((item) => daySet.has(item));
    });
    if (error) setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isKnownStudyMode(studyMode)) { setError("Select your study mode"); return; }
    if (studyMode === "custom" && customStudyDays.length === 0) { setError("Select at least one study day"); return; }
    window.localStorage.setItem(SIGNUP_STUDENT_DETAILS_STORAGE_KEY, JSON.stringify({ ...studentDetails, studyMode, customStudyDays: studyMode === "custom" ? customStudyDays : [] }));
    router.push("/signup/student/password");
  };

  return (
    <>
      <style>{`
        .institution-page {
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5rem 1.25rem 2.5rem;
          position: relative;
          overflow: hidden;
          background: #fdfdfd;
        }



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

        .institution-header { text-align: center; }
        .institution-title {
          font-size: 2.25rem; font-weight: 800; letter-spacing: -0.04em; color: #000; margin: 0; line-height: 1.1;
        }
        .institution-subtitle {
          font-size: 1rem; color: #334155; margin-top: 0.75rem; font-weight: 600;
        }

        .institution-grid {
          display: flex;
          flex-direction: row;
          gap: 1.25rem;
          width: 100%;
          justify-content: center;
          align-items: stretch;
        }
        @media (max-width: 768px) { .institution-grid { flex-direction: column; align-items: center; } }

        .institution-card-wrapper {
          position: relative;
          flex: 1;
          max-width: 280px;
          min-width: 220px;
          border-radius: 28px;
          transition: transform 0.25s ease;
        }
        .institution-card-wrapper:hover { transform: translateY(-4px); }

        .institution-card-ring {
          position: absolute; inset: -2px; border-radius: 30px;
          background: linear-gradient(135deg, #a855f7, #6366f1);
          z-index: 0; pointer-events: none;
        }

        .institution-card-btn {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
          height: 100%;
          border-radius: 28px;
          border: none;
          background: #fff;
          cursor: pointer;
          box-shadow: 0 10px 40px rgba(0,0,0,0.06);
          text-align: left;
          padding: 1.75rem;
        }

        .study-mode-title { font-size: 1.25rem; font-weight: 800; color: #000; margin-bottom: 0.5rem; }
        .study-mode-desc { font-size: 0.85rem; color: #475569; line-height: 1.5; margin: 0; font-weight: 600; }

        .custom-days-container {
          width: 100%;
          max-width: 520px;
          background: #fff;
          border-radius: 32px;
          padding: 2rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.02);
          margin-top: 1rem;
        }
        .day-chip-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; margin-top: 1.25rem; }
        @media (max-width: 480px) { .day-chip-grid { grid-template-columns: repeat(2, 1fr); } }
        
        .day-chip {
          display: flex; align-items: center; justify-content: center;
          padding: 1rem; border-radius: 16px; border: 1.5px solid #f1f5f9;
          background: #f8fafc; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: all 0.2s ease;
          color: #475569;
        }
        .day-chip-active {
          background: #7e22ce; color: #fff; border-color: #7e22ce;
          box-shadow: 0 8px 20px rgba(126, 34, 206, 0.25);
        }

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
          min-width: 240px;
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
      `}</style>

      <main className="institution-page">
        <FloatingBackLink href="/signup/student/level" label="Back" />

        <div className="institution-container">
          {!institutionName || !hasRequiredStudentDetails ? (
            <header className="institution-header">
              <h1 className="institution-title">Session error</h1>
              <div className="mt-8">
                <Link href="/signup/institution" className="institution-continue-btn">Restart</Link>
              </div>
            </header>
          ) : (
            <>
              <header className="institution-header">
                <h1 className="institution-title">Study Mode</h1>
                <p className="institution-subtitle">Choose how you attend lectures.</p>
              </header>

              <div className="institution-grid" role="group">
                {STUDY_MODE_OPTIONS.map((option) => {
                  const isSelected = studyMode === option.value;
                  return (
                    <div key={option.value} className={`institution-card-wrapper${isSelected ? " institution-card-selected" : ""}`}>
                      {isSelected && <span className="institution-card-ring" aria-hidden="true" />}
                      <button
                        type="button"
                        onClick={() => { setStudyMode(option.value); if (option.value !== "custom") setCustomStudyDays([]); if (error) setError(""); }}
                        className="institution-card-btn"
                      >
                        <h3 className="study-mode-title">{option.label}</h3>
                        <p className="study-mode-desc">{option.description}</p>
                      </button>
                    </div>
                  );
                })}
              </div>

              {studyMode === "custom" && (
                <div className="custom-days-container">
                  <p className="text-center font-extrabold text-slate-800 uppercase tracking-widest text-xs">Pick your active days</p>
                  <div className="day-chip-grid">
                    {ALL_WEEK_DAYS.map((day) => (
                      <button key={day} type="button" onClick={() => handleToggleCustomDay(day)} className={`day-chip${customStudyDays.includes(day) ? " day-chip-active" : ""}`}>
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && <p className="text-sm font-bold text-red-500 mt-2">{error}</p>}

              <div className="mt-4">
                <button type="submit" onClick={handleSubmit} className="institution-continue-btn" disabled={!hasValidStudyMode}>
                  Next
                  <svg viewBox="0 0 16 16" width="18" height="18" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
