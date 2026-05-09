"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { Select } from "@mantine/core";
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  School,
  Building2,
  BookOpen,
  GraduationCap,
  CalendarDays,
  Sparkles,
  Briefcase,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import type { AuthUser } from "@/components/AuthProvider";
import {
  getInstitutions,
  getFacultyOptions,
  getProgrammeTypeOptions,
  getProgrammeOptionsForFacultyAndType,
  getLevelOptions,
  getSemesterOptions,
  getStudyModeOptions,
  getLecturerTitleOptions,
  getCourseOptions,
  isKnownFacultyName,
  isKnownProgrammeType,
  isKnownProgrammeName,
  isKnownLevel,
  isKnownStudyMode,
  isKnownWeekDay,
} from "@/lib/local-db";
import { ALL_WEEK_DAYS } from "@/lib/study-schedule";

/* ─── constants ─────────────────────────────────────────────── */

const INSTITUTIONS = getInstitutions();
const FACULTY_OPTIONS = getFacultyOptions().map((f) => ({ value: f.name, label: f.name }));
const PROGRAMME_TYPE_OPTIONS = getProgrammeTypeOptions();
const LEVEL_OPTIONS = getLevelOptions();
const SEMESTER_OPTIONS = getSemesterOptions();
const STUDY_MODE_OPTIONS = getStudyModeOptions();
const LECTURER_TITLE_OPTIONS = getLecturerTitleOptions();
const COURSE_OPTIONS = getCourseOptions();
const HTU_NAME = "HO TECHNICAL UNIVERSITY";

const LEVEL_NUMBER_OPTIONS = Array.from(
  new Set(LEVEL_OPTIONS.map((o) => o.level))
).map((v) => ({ value: v, label: `Level ${v}` }));

const INSTITUTION_META: Record<string, { logoSrc: string }> = {
  htu: { logoSrc: "/HTU-LOGO.png" },
  uhas: { logoSrc: "/uhas_logo.png" },
  amedzofe: { logoSrc: "/amedzofe logo.png" },
};

function buildLevelValue(level: string, semester: string) {
  return LEVEL_OPTIONS.find((o) => o.level === level && o.semester === semester)?.value || "";
}

/* ─── types ──────────────────────────────────────────────────── */

type StepId =
  | "welcome"
  | "institution"
  | "faculty"
  | "programme"
  | "level"
  | "study-mode"
  | "lecturer-info"
  | "complete";

interface Props {
  user: AuthUser;
  onComplete: () => void;
}

/* ─── component ──────────────────────────────────────────────── */

export function OnboardingWizard({ user, onComplete }: Props) {
  const isStudent = user.role !== "lecturer";
  const firstName = user.name?.split(" ")[0] || "there";

  // Shared state
  const [institution, setInstitution] = useState("");
  const [faculty, setFaculty] = useState("");

  // Student state
  const [programmeType, setProgrammeType] = useState("");
  const [programme, setProgramme] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [studyMode, setStudyMode] = useState("");
  const [customStudyDays, setCustomStudyDays] = useState<string[]>([]);

  // Lecturer state
  const [lecturerTitle, setLecturerTitle] = useState("");
  const [courseLectured, setCourseLectured] = useState("");

  // UI state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [animKey, setAnimKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const isHtu = institution.trim().toUpperCase() === HTU_NAME;

  // Dynamic steps based on role and institution
  const steps: StepId[] = useMemo(() => {
    if (isStudent) {
      const s: StepId[] = ["welcome", "institution"];
      if (isHtu) s.push("faculty", "programme");
      s.push("level", "study-mode", "complete");
      return s;
    }
    return ["welcome", "institution", "faculty", "lecturer-info", "complete"];
  }, [isStudent, isHtu]);

  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;

  const programmeRecords = useMemo(() => {
    if (!isKnownProgrammeType(programmeType)) return [];
    if (isKnownFacultyName(faculty))
      return getProgrammeOptionsForFacultyAndType(faculty, programmeType);
    return [];
  }, [faculty, programmeType]);

  const programmeSelectOptions = programmeRecords.map((p) => ({
    value: p.name,
    label: p.name,
  }));

  /* ─── step validation ─────────────────────────────────────── */

  const isStepValid = useCallback((): boolean => {
    switch (currentStep) {
      case "welcome":
        return true;
      case "institution":
        return institution !== "";
      case "faculty":
        return isKnownFacultyName(faculty);
      case "programme":
        return (
          isKnownProgrammeType(programmeType) &&
          isKnownProgrammeName(programme) &&
          programmeRecords.some((p) => p.name === programme)
        );
      case "level":
        return isKnownLevel(buildLevelValue(selectedLevel, selectedSemester));
      case "study-mode":
        return (
          isKnownStudyMode(studyMode) &&
          (studyMode !== "custom" || customStudyDays.length > 0)
        );
      case "lecturer-info":
        return lecturerTitle.trim() !== "" && courseLectured.trim() !== "";
      case "complete":
        return true;
      default:
        return false;
    }
  }, [
    currentStep, institution, faculty, programmeType, programme,
    programmeRecords, selectedLevel, selectedSemester, studyMode,
    customStudyDays, lecturerTitle, courseLectured,
  ]);

  /* ─── navigation ──────────────────────────────────────────── */

  const goNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setDirection("forward");
      setCurrentStepIndex((i) => i + 1);
      setAnimKey((k) => k + 1);
    }
  };

  const goBack = () => {
    if (currentStepIndex > 0) {
      setDirection("backward");
      setCurrentStepIndex((i) => i - 1);
      setAnimKey((k) => k + 1);
    }
  };

  /* ─── submit ──────────────────────────────────────────────── */

  const handleFinish = async () => {
    setSubmitting(true);
    setSubmitError("");

    const level = buildLevelValue(selectedLevel, selectedSemester);
    const metadata: Record<string, unknown> = {
      school: institution,
      department: faculty,
      onboardingComplete: true,
    };

    if (isStudent) {
      metadata.programmeType = programmeType || null;
      metadata.programme = programme || null;
      metadata.level = level || null;
      metadata.studyMode = studyMode || null;
      metadata.customStudyDays =
        studyMode === "custom" ? customStudyDays : [];
    } else {
      metadata.title = lecturerTitle;
      metadata.courseLectured = courseLectured;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: metadata });

    setSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    onComplete();
  };

  /* ─── shared input styles ─────────────────────────────────── */

  const selectStyles = {
    input: {
      backgroundColor: "#fff",
      color: "#000",
      borderColor: "#d8b4fe",
      borderWidth: "1.5px",
      minHeight: "56px",
      borderRadius: "16px",
      fontSize: "1rem",
      fontWeight: 600,
    },
    dropdown: {
      backgroundColor: "#fff",
      borderRadius: "20px",
      boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
      border: "1px solid rgba(0,0,0,0.08)",
      padding: "0.5rem",
    },
    option: {
      borderRadius: "12px",
      fontSize: "0.95rem",
      fontWeight: 600,
      padding: "10px 14px",
      color: "#000",
    },
    label: { display: "none" as const },
  };

  /* ─── step renderers ──────────────────────────────────────── */

  const renderWelcome = () => (
    <div className="flex flex-col items-center text-center gap-6">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle className="h-12 w-12 text-emerald-600" />
      </div>
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Welcome, {firstName}! 🎉
        </h2>
        <p className="mt-3 text-base text-gray-500 leading-relaxed max-w-sm mx-auto">
          Let&apos;s set up your academic profile in a few quick steps so we can
          personalize your experience.
        </p>
      </div>
    </div>
  );

  const renderInstitution = () => (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
          <School className="h-7 w-7 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Select Your Institution
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose the school you are enrolled in
        </p>
      </div>
      <div className="grid gap-3">
        {INSTITUTIONS.map((inst) => {
          const meta = INSTITUTION_META[inst.id];
          const isSelected = institution === inst.name;
          return (
            <button
              key={inst.name}
              type="button"
              onClick={() => setInstitution(inst.name)}
              className={`relative flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-100"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 overflow-hidden">
                {meta?.logoSrc ? (
                  <Image
                    src={meta.logoSrc}
                    alt={inst.abbreviation}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-lg font-extrabold text-gray-400">
                    {inst.abbreviation}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-gray-900">
                  {inst.abbreviation}
                </p>
                <p className="truncate text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {inst.name}
                </p>
              </div>
              <div
                className={`h-5 w-5 flex-shrink-0 rounded-full border-2 transition-all ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-500"
                    : "border-gray-300"
                }`}
              >
                {isSelected && (
                  <CheckCircle className="h-full w-full text-white" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderFaculty = () => (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100">
          <Building2 className="h-7 w-7 text-purple-600" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Select Faculty
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose your department to continue
        </p>
      </div>
      <Select
        id="onboarding-faculty"
        placeholder="Select your faculty"
        data={FACULTY_OPTIONS}
        value={faculty}
        onChange={(v) => {
          setFaculty(v || "");
          setProgramme("");
        }}
        searchable
        styles={selectStyles}
        size="lg"
      />
    </div>
  );

  const renderProgramme = () => (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100">
          <BookOpen className="h-7 w-7 text-pink-600" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Your Programme
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Tell us what you are studying
        </p>
      </div>
      <Select
        id="onboarding-programme-type"
        placeholder="Select study type (Degree / HND)"
        data={PROGRAMME_TYPE_OPTIONS}
        value={programmeType}
        onChange={(v) => {
          setProgrammeType(v || "");
          setProgramme("");
        }}
        styles={selectStyles}
        size="lg"
      />
      <Select
        id="onboarding-programme"
        placeholder={
          isKnownProgrammeType(programmeType)
            ? "Select your programme"
            : "Select study type first"
        }
        data={programmeSelectOptions}
        value={programme}
        onChange={(v) => setProgramme(v || "")}
        disabled={!isKnownProgrammeType(programmeType)}
        searchable
        styles={selectStyles}
        size="lg"
      />
    </div>
  );

  const renderLevel = () => (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
          <GraduationCap className="h-7 w-7 text-amber-600" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Current Level
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Tell us your current year of study
        </p>
      </div>
      <Select
        id="onboarding-level"
        placeholder="Select your level"
        data={LEVEL_NUMBER_OPTIONS}
        value={selectedLevel}
        onChange={(v) => setSelectedLevel(v || "")}
        styles={selectStyles}
        size="lg"
      />
      <Select
        id="onboarding-semester"
        placeholder="Select your semester"
        data={SEMESTER_OPTIONS}
        value={selectedSemester}
        onChange={(v) => setSelectedSemester(v || "")}
        styles={selectStyles}
        size="lg"
      />
    </div>
  );

  const renderStudyMode = () => (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100">
          <CalendarDays className="h-7 w-7 text-teal-600" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Study Mode
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose how you attend lectures
        </p>
      </div>
      <div className="grid gap-3">
        {STUDY_MODE_OPTIONS.map((option) => {
          const isSelected = studyMode === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setStudyMode(option.value);
                if (option.value !== "custom") setCustomStudyDays([]);
              }}
              className={`rounded-2xl border-2 p-4 text-left transition-all ${
                isSelected
                  ? "border-teal-500 bg-teal-50 shadow-lg shadow-teal-100"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <p className="text-base font-bold text-gray-900">
                {option.label}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>
      {studyMode === "custom" && (
        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="mb-3 text-center text-xs font-extrabold uppercase tracking-widest text-gray-600">
            Pick your active days
          </p>
          <div className="grid grid-cols-4 gap-2">
            {ALL_WEEK_DAYS.map((day) => {
              const active = customStudyDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    setCustomStudyDays((prev) =>
                      prev.includes(day)
                        ? prev.filter((d) => d !== day)
                        : [...prev, day]
                    );
                  }}
                  className={`rounded-xl py-3 text-sm font-bold transition-all ${
                    active
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-white text-gray-500 border border-gray-200"
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderLecturerInfo = () => (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
          <Briefcase className="h-7 w-7 text-blue-600" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Professional Info
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Tell us about your teaching role
        </p>
      </div>
      <Select
        id="onboarding-title"
        placeholder="Select your title"
        data={LECTURER_TITLE_OPTIONS}
        value={lecturerTitle}
        onChange={(v) => setLecturerTitle(v || "")}
        styles={selectStyles}
        size="lg"
      />
      <Select
        id="onboarding-course"
        placeholder="Select a course you lecture"
        data={COURSE_OPTIONS}
        value={courseLectured}
        onChange={(v) => setCourseLectured(v || "")}
        searchable
        styles={selectStyles}
        size="lg"
      />
    </div>
  );

  const renderComplete = () => (
    <div className="flex flex-col items-center text-center gap-6">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-indigo-100">
        <Sparkles className="h-12 w-12 text-indigo-600" />
      </div>
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
          You&apos;re All Set! 🚀
        </h2>
        <p className="mt-3 text-base text-gray-500 leading-relaxed max-w-sm mx-auto">
          Your profile is ready. Let&apos;s dive into your personalized dashboard.
        </p>
      </div>
      {submitError && (
        <p className="text-sm font-semibold text-red-500 bg-red-50 rounded-xl px-4 py-2">
          {submitError}
        </p>
      )}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case "welcome": return renderWelcome();
      case "institution": return renderInstitution();
      case "faculty": return renderFaculty();
      case "programme": return renderProgramme();
      case "level": return renderLevel();
      case "study-mode": return renderStudyMode();
      case "lecturer-info": return renderLecturerInfo();
      case "complete": return renderComplete();
    }
  };

  /* ─── render ──────────────────────────────────────────────── */

  const isLastStep = currentStep === "complete";
  const isFirstStep = currentStepIndex === 0;

  return (
    <>
      <style>{`
        .onboarding-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        @keyframes obSlideInRight {
          from { transform: translateX(40px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes obSlideInLeft {
          from { transform: translateX(-40px); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        .ob-anim-forward { animation: obSlideInRight 0.35s ease-out both; }
        .ob-anim-backward { animation: obSlideInLeft 0.35s ease-out both; }
      `}</style>

      <div className="onboarding-overlay">
        {/* Progress bar */}
        <div className="flex-shrink-0 px-6 pt-6 pb-2">
          <div className="mx-auto flex max-w-md items-center justify-center gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i <= currentStepIndex
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-center text-xs font-semibold text-gray-400">
            Step {currentStepIndex + 1} of {totalSteps}
          </p>
        </div>

        {/* Step content */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
          <div
            key={animKey}
            className={`w-full max-w-md ${
              direction === "forward" ? "ob-anim-forward" : "ob-anim-backward"
            }`}
          >
            {renderStep()}
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="flex-shrink-0 px-6 pb-8">
          <div className="mx-auto flex max-w-md gap-3">
            {!isFirstStep && (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-5 py-4 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 active:scale-[0.97]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}
            <button
              type="button"
              onClick={isLastStep ? handleFinish : goNext}
              disabled={(!isLastStep && !isStepValid()) || submitting}
              className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-bold text-white transition-all active:scale-[0.97] ${
                (!isLastStep && !isStepValid()) || submitting
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-indigo-200 hover:shadow-xl"
              }`}
            >
              {submitting ? (
                <>
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : isLastStep ? (
                <>
                  Go to Dashboard
                  <Sparkles className="h-4 w-4" />
                </>
              ) : currentStep === "welcome" ? (
                <>
                  Let&apos;s Go
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
