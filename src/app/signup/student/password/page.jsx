"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PasswordInput } from "@mantine/core";
import { ArrowLeft, UserPlus, Lock } from "lucide-react";
import { FloatingBackLink } from "@/components/signup/FloatingBackLink";
import { createClient } from "@/utils/supabase/client";
import {
  getProgrammeOptionsForFacultyAndType,
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

export default function StudentPasswordPage() {
  const router = useRouter();
  const [institutionName] = useState(readStoredInstitutionName);
  const [studentDetails] = useState(readStoredStudentDetails);
  const requiresFacultyAndProgrammeSelection = isHtuInstitution(institutionName);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const programmeMatchesSelection = !requiresFacultyAndProgrammeSelection || (isKnownDepartmentName(studentDetails.department) && isKnownProgrammeType(studentDetails.programmeType) ? getProgrammeOptionsForFacultyAndType(studentDetails.department, studentDetails.programmeType).some((option) => option.name === studentDetails.programme) : false);

  const hasRequiredStudentDetails = studentDetails.name.trim() !== "" && studentDetails.email.trim() !== "" && studentDetails.email.includes("@") && studentDetails.indexNumber.trim() !== "" && isKnownGender(studentDetails.gender) && isKnownLevel(studentDetails.level) && isKnownStudyMode(studentDetails.studyMode) && (studentDetails.studyMode !== "custom" || studentDetails.customStudyDays.length > 0) && (!requiresFacultyAndProgrammeSelection || (isKnownDepartmentName(studentDetails.department) && isKnownProgrammeType(studentDetails.programmeType) && isKnownProgrammeName(studentDetails.programme))) && programmeMatchesSelection;

  const inputStyles = {
    root: { marginBottom: "1.25rem" },
    label: { display: "none" },
    innerInput: {
      backgroundColor: "#fff",
      color: "#000",
      borderColor: "#d8b4fe",
      borderWidth: "1.5px",
      minHeight: "60px",
      borderRadius: "16px",
      fontSize: "1rem",
      boxShadow: "0 2px 10px rgba(168, 85, 247, 0.05)",
      transition: "all 0.2s ease",
      "&::placeholder": { color: "#475569", opacity: 1 },
      "&:focus-within": { borderColor: "#a855f7", boxShadow: "0 0 0 4px rgba(168, 85, 247, 0.1)" },
    },
    visibilityToggle: { color: "#64748b" },
    section: { paddingLeft: "10px" }
  };

  const isFormValid = password.trim() !== "" && confirmPassword.trim() !== "" && password.length >= 8 && password === confirmPassword;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {
      password: password.trim() === "" ? "Password is required" : password.length < 8 ? "Password must be at least 8 characters" : "",
      confirmPassword: confirmPassword.trim() === "" ? "Confirm password is required" : password !== confirmPassword ? "Passwords do not match" : "",
    };
    setErrors(nextErrors);
    if (nextErrors.password || nextErrors.confirmPassword) return;

    setLoading(true);
    setSubmitError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: studentDetails.email,
      password,
      options: {
        data: {
          role: "student",
          name: studentDetails.name,
          gender: isKnownGender(studentDetails.gender) ? studentDetails.gender : null,
          school: institutionName,
          department: studentDetails.department,
          indexNumber: studentDetails.indexNumber,
          programme: studentDetails.programme,
          level: studentDetails.level,
          studyMode: studentDetails.studyMode,
          customStudyDays: studentDetails.studyMode === "custom" ? studentDetails.customStudyDays : [],
        }
      }
    });
    setLoading(false);
    if (error) { setSubmitError(error.message); return; }

    try {
      window.localStorage.removeItem(SIGNUP_INSTITUTION_STORAGE_KEY);
      window.localStorage.removeItem(SIGNUP_STUDENT_DETAILS_STORAGE_KEY);
    } catch { /* ignore */ }

    router.push(`/welcome?email=${encodeURIComponent(studentDetails.email)}&role=student`);
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
          max-width: 500px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 2.5rem;
        }

        .institution-header { text-align: center; margin-bottom: 1rem; }
        .institution-title {
          font-size: 2.5rem; font-weight: 800; letter-spacing: -0.04em; color: #000; margin: 0; line-height: 1.1;
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
        <FloatingBackLink href="/signup/student/study-mode" label="Back" />

        <div className="institution-container">
          <header className="institution-header">
            <h1 className="institution-title">Security</h1>
            <p className="institution-subtitle">Set a password to secure your account.</p>
          </header>

          <div className="institution-form-card">
            <form onSubmit={handleSubmit}>
              <PasswordInput
                id="student-password"
                placeholder="New Password"
                leftSection={<Lock size={18} />}
                value={password}
                onChange={(e) => { setPassword(e.currentTarget.value); if (errors.password) setErrors(prev => ({ ...prev, password: "" })); if (submitError) setSubmitError(""); }}
                error={errors.password}
                styles={inputStyles}
              />

              <PasswordInput
                id="student-confirm-password"
                placeholder="Confirm Password"
                leftSection={<Lock size={18} />}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.currentTarget.value); if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: "" })); if (submitError) setSubmitError(""); }}
                error={errors.confirmPassword}
                styles={inputStyles}
              />

              {submitError && <p className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100">{submitError}</p>}

              <button type="submit" className="institution-continue-btn" disabled={!isFormValid || loading}>
                {loading ? "Completing..." : "Complete Signup"}
                {!loading && <UserPlus size={18} />}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}