"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Select } from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import { FloatingBackLink } from "@/components/signup/FloatingBackLink";
import {
  getGenderOptions,
  isKnownDepartmentName,
  isKnownGender,
  isKnownLevel,
  isKnownProgrammeName,
  isKnownProgrammeType,
  isKnownStudyMode,
  isKnownWeekDay,
} from "@/lib/local-db";

const SIGNUP_INSTITUTION_STORAGE_KEY = "tertiaryfree:signup-institution";
const SIGNUP_STUDENT_DETAILS_STORAGE_KEY = "tertiaryfree:signup-student-details";
const HTU_INSTITUTION_NAME = "HO TECHNICAL UNIVERSITY";

const GENDER_OPTIONS = getGenderOptions();

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
      customStudyDays: Array.isArray(parsed.customStudyDays) ? parsed.customStudyDays.filter((day) => isKnownWeekDay(day)) : [],
    };
  } catch {
    return { name: "", email: "", indexNumber: "", gender: "", level: "", department: "", programmeType: "", programme: "", studyMode: "", customStudyDays: [] };
  }
}

export default function SignupStudentPage() {
  const router = useRouter();
  const [institutionName] = useState(readStoredInstitutionName);
  const [formData, setFormData] = useState(readStoredStudentDetails);
  const requiresProgrammeSelection = isHtuInstitution(institutionName);
  const [errors, setErrors] = useState({ name: "", email: "", indexNumber: "", gender: "" });

  const inputStyles = {
    root: { marginBottom: "1.25rem" },
    label: { display: "none" },
    input: {
      backgroundColor: "#fff",
      color: "#000",
      borderColor: "#d8b4fe",
      borderWidth: "1.5px",
      minHeight: "60px",
      borderRadius: "16px",
      fontSize: "1rem",
      fontWeight: "600",
      boxShadow: "0 2px 10px rgba(168, 85, 247, 0.05)",
      transition: "all 0.2s ease",
      "&::placeholder": { color: "#475569", opacity: 1 },
      "&:focus": {
        borderColor: "#a855f7",
        boxShadow: "0 0 0 4px rgba(168, 85, 247, 0.1)",
      },
    },
    dropdown: {
      backgroundColor: "#fff",
      borderRadius: "24px",
      boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
      border: "1px solid rgba(0,0,0,0.08)",
      padding: "0.75rem",
      marginTop: "8px",
    },
    option: {
      borderRadius: "14px",
      fontSize: "0.95rem",
      fontWeight: "600",
      padding: "12px 16px",
      marginBottom: "4px",
      color: "#000",
      "&[data-selected]": { backgroundColor: "#f3e8ff", color: "#7e22ce" },
      "&[data-hovered]": { backgroundColor: "#faf5ff", color: "#7e22ce" },
    },
  };

  const hasProgrammeSelection = !requiresProgrammeSelection || (isKnownDepartmentName(formData.department) && isKnownProgrammeType(formData.programmeType) && isKnownProgrammeName(formData.programme));

  const isFormValid = formData.name.trim() !== "" && formData.email.trim() !== "" && formData.email.includes("@") && formData.indexNumber.trim() !== "" && isKnownGender(formData.gender);

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {
      name: formData.name.trim() ? "" : "Full name is required",
      email: formData.email.trim() === "" ? "Email is required" : formData.email.includes("@") ? "" : "Invalid email address",
      indexNumber: formData.indexNumber.trim() ? "" : "Index number is required",
      gender: isKnownGender(formData.gender) ? "" : "Gender is required",
    };
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.email || nextErrors.indexNumber || nextErrors.gender) return;

    window.localStorage.setItem(SIGNUP_STUDENT_DETAILS_STORAGE_KEY, JSON.stringify({ ...formData, name: formData.name.trim(), email: formData.email.trim(), indexNumber: formData.indexNumber.trim() }));
    router.push("/signup/student/level");
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
          max-width: 520px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 2.5rem;
        }

        .institution-header { text-align: center; margin-bottom: 1rem; }
        .institution-title {
          font-size: 2.25rem; font-weight: 800; letter-spacing: -0.04em; color: #000; margin: 0; line-height: 1.1;
        }
        .institution-subtitle {
          font-size: 1rem; color: #334155; margin-top: 0.75rem; font-weight: 600;
        }

        .institution-form-card {
          background: #fff;
          border-radius: 32px;
          padding: 2.5rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.02);
        }

        .premium-input {
          width: 100%;
          background-color: #fff;
          color: #000;
          border: 1.5px solid #d8b4fe;
          min-height: 60px;
          border-radius: 16px;
          font-size: 1rem;
          padding: 0 1.25rem;
          box-shadow: 0 2px 10px rgba(168, 85, 247, 0.05);
          transition: all 0.2s ease;
          outline: none;
          font-weight: 600;
        }
        .premium-input:focus {
          border-color: #a855f7;
          box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.1);
        }
        .premium-input::placeholder { color: #475569; font-weight: 500; }

        .faculty-option {
          display: flex; align-items: center; gap: 1rem; color: #000; width: 100%;
        }
        .faculty-icon-placeholder {
          width: 36px; height: 36px; border-radius: 10px; background: #000; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 800; flex-shrink: 0;
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
          width: 100%;
          margin-top: 1rem;
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
        <FloatingBackLink href={requiresProgrammeSelection ? "/signup/student/programme" : "/signup/details"} label="Back" />

        <div className="institution-container">
          {!institutionName ? (
            <div className="institution-header">
              <h1 className="institution-title">No Institution Selected</h1>
              <div className="mt-8">
                <Link href="/signup/institution" className="institution-continue-btn">Back to selection</Link>
              </div>
            </div>
          ) : (
            <>
              <header className="institution-header">
                <h1 className="institution-title">Student Details</h1>
                <p className="institution-subtitle">Tell us more about yourself.</p>
              </header>

              <div className="institution-form-card">
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: "1.25rem" }}>
                    <input
                      id="student-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => { setFormData(prev => ({ ...prev, name: e.target.value })); if (errors.name) setErrors(prev => ({ ...prev, name: "" })); }}
                      placeholder="Full Name (e.g. Ama Mensah)"
                      className="premium-input"
                    />
                    {errors.name && <p className="mt-1 text-xs font-bold text-red-500 ml-2">{errors.name}</p>}
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <input
                      id="student-index-number"
                      type="text"
                      value={formData.indexNumber}
                      onChange={(e) => { setFormData(prev => ({ ...prev, indexNumber: e.target.value })); if (errors.indexNumber) setErrors(prev => ({ ...prev, indexNumber: "" })); }}
                      placeholder="Index Number (e.g. UEB3214024)"
                      className="premium-input"
                    />
                    {errors.indexNumber && <p className="mt-1 text-xs font-bold text-red-500 ml-2">{errors.indexNumber}</p>}
                  </div>

                  <div style={{ marginBottom: "1.25rem" }}>
                    <input
                      id="student-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => { setFormData(prev => ({ ...prev, email: e.target.value })); if (errors.email) setErrors(prev => ({ ...prev, email: "" })); }}
                      placeholder="Email Address (e.g. ama@htu.edu.gh)"
                      className="premium-input"
                    />
                    {errors.email && <p className="mt-1 text-xs font-bold text-red-500 ml-2">{errors.email}</p>}
                  </div>

                  <Select
                    id="student-gender"
                    placeholder="Select your gender"
                    data={GENDER_OPTIONS}
                    value={formData.gender}
                    onChange={(v) => { setFormData(prev => ({ ...prev, gender: v || "" })); if (errors.gender) setErrors(prev => ({ ...prev, gender: "" })); }}
                    error={errors.gender}
                    styles={inputStyles}
                    renderOption={({ option, checked }) => (
                      <div className="faculty-option">
                        <div className="faculty-icon-placeholder" style={{ backgroundColor: checked ? "#7e22ce" : "#000" }}>
                          {option.label.substring(0, 2).toUpperCase()}
                        </div>
                        <span style={{ color: "inherit", fontWeight: "inherit" }}>{option.label}</span>
                      </div>
                    )}
                  />

                  <button type="submit" className="institution-continue-btn" disabled={!isFormValid}>
                    Continue
                    <svg viewBox="0 0 16 16" width="18" height="18" fill="none" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
