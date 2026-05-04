"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TextInput, PasswordInput, Select } from "@mantine/core";
import {
  Mail,
  Lock,
  User,
  Hash,
  UserPlus,
  BookOpen,
  GraduationCap,
  Building2,
  School,
  Briefcase,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { AuthLayout } from "@/components/AuthLayout";
import { registerUserAccount } from "@/lib/auth-storage";
import {
  getCourseOptions,
  getDepartmentOptions,
  getGenderOptions,
  getLecturerTitleOptions,
  getLevelOptions,
  getProgrammeOptionsForFacultyAndType,
  getProgrammeTypeOptions,
  getProgrammeOptions,
  isKnownFacultyName,
  isKnownGender,
  isKnownLevel,
  isKnownProgrammeName,
  isKnownProgrammeType,
  isKnownStudyMode,
  isKnownWeekDay,
} from "@/lib/local-db";
import type { WeekDayValue } from "@/lib/study-schedule";

const SIGNUP_STUDENT_DETAILS_STORAGE_KEY = "tertiaryfree:signup-student-details";

type StudentSignupPrefill = {
  name: string;
  indexNumber: string;
  gender: "" | "male" | "female" | "other";
  level: string;
  department: string;
  programmeType: "" | "degree" | "hnd";
  programme: string;
  studyMode: "" | "weekday" | "weekend" | "custom";
  customStudyDays: WeekDayValue[];
};

const EMPTY_STUDENT_SIGNUP_PREFILL: StudentSignupPrefill = {
  name: "",
  indexNumber: "",
  gender: "",
  level: "",
  department: "",
  programmeType: "",
  programme: "",
  studyMode: "",
  customStudyDays: [],
};

const GENDER_OPTIONS = getGenderOptions();
const LEVEL_OPTIONS = getLevelOptions();
const DEPARTMENT_SELECT_OPTIONS = getDepartmentOptions().map((department) => ({
  value: department.name,
  label: department.name,
}));
const PROGRAMME_TYPE_SELECT_OPTIONS = getProgrammeTypeOptions();
const LECTURER_TITLE_OPTIONS = getLecturerTitleOptions();
const COURSE_SELECT_OPTIONS = getCourseOptions();

function readStoredStudentSignupPrefill(): StudentSignupPrefill {
  if (typeof window === "undefined") {
    return EMPTY_STUDENT_SIGNUP_PREFILL;
  }

  try {
    const storedValue = window.localStorage.getItem(
      SIGNUP_STUDENT_DETAILS_STORAGE_KEY,
    );

    if (!storedValue) {
      return EMPTY_STUDENT_SIGNUP_PREFILL;
    }

    const parsed = JSON.parse(storedValue) as unknown;

    if (!parsed || typeof parsed !== "object") {
      return EMPTY_STUDENT_SIGNUP_PREFILL;
    }

    const candidate = parsed as Record<string, unknown>;

    const department =
      isKnownFacultyName(candidate.department) ? candidate.department : "";
    const programmeType = isKnownProgrammeType(candidate.programmeType)
      ? candidate.programmeType
      : "";

    const prefilledProgrammeOptions =
      department && programmeType
        ? getProgrammeOptionsForFacultyAndType(department, programmeType)
        : [];

    const programme =
      typeof candidate.programme === "string" &&
      isKnownProgrammeName(candidate.programme) &&
      (prefilledProgrammeOptions.length === 0 ||
        prefilledProgrammeOptions.some(
          (option) => option.name === candidate.programme,
        ))
        ? candidate.programme
        : "";
    const studyMode = isKnownStudyMode(candidate.studyMode)
      ? candidate.studyMode
      : "";
    const customStudyDays = Array.isArray(candidate.customStudyDays)
      ? candidate.customStudyDays.filter((day) => isKnownWeekDay(day))
      : [];

    return {
      name: typeof candidate.name === "string" ? candidate.name : "",
      indexNumber:
        typeof candidate.indexNumber === "string" ? candidate.indexNumber : "",
      gender: isKnownGender(candidate.gender) ? candidate.gender : "",
      level: isKnownLevel(candidate.level) ? candidate.level : "",
      department,
      programmeType,
      programme,
      studyMode,
      customStudyDays,
    };
  } catch {
    return EMPTY_STUDENT_SIGNUP_PREFILL;
  }
}

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{
    role?: string | string[] | undefined;
    institution?: string | string[] | undefined;
  }>;
}) {
  const router = useRouter();
  const resolvedSearchParams = use(searchParams);
  const rawRole = resolvedSearchParams.role;
  const rawInstitution = resolvedSearchParams.institution;
  const role = Array.isArray(rawRole) ? rawRole[0] : rawRole;
  const institution = Array.isArray(rawInstitution)
    ? rawInstitution[0]
    : rawInstitution;
  const userType = role === "lecturer" ? "lecturer" : "student";
  const [studentSignupPrefill] = useState(readStoredStudentSignupPrefill);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: userType === "student" ? studentSignupPrefill.name : "",
    gender: userType === "student" ? studentSignupPrefill.gender : "",
    email: "",
    school: institution || "",
    programmeType:
      userType === "student" ? studentSignupPrefill.programmeType : "",
    programme: userType === "student" ? studentSignupPrefill.programme : "",
    studyMode: userType === "student" ? studentSignupPrefill.studyMode : "",
    customStudyDays:
      userType === "student" ? studentSignupPrefill.customStudyDays : [],
    indexNumber: userType === "student" ? studentSignupPrefill.indexNumber : "",
    level: userType === "student" ? studentSignupPrefill.level : "",
    department: userType === "student" ? studentSignupPrefill.department : "",
    title: "",
    courseLectured: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  const studentProgrammeRecords = (() => {
    if (userType !== "student" || !isKnownProgrammeType(formData.programmeType)) {
      return [];
    }

    if (isKnownFacultyName(formData.department)) {
      return getProgrammeOptionsForFacultyAndType(
        formData.department,
        formData.programmeType,
      );
    }

    return getProgrammeOptions().filter(
      (programme) => programme.programmeType === formData.programmeType,
    );
  })();

  const studentProgrammeSelectOptions = studentProgrammeRecords.map((programme) => ({
    value: programme.name,
    label: programme.name,
  }));

  const totalSteps = 4;

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (formData.name.trim() === "") newErrors.name = "Name is required";
      if (formData.email.trim() === "") newErrors.email = "Email is required";
      if (!formData.email.includes("@"))
        newErrors.email = "Invalid email address";
      if (userType === "student" && formData.gender.trim() === "") {
        newErrors.gender = "Gender is required";
      }
    } else if (step === 2) {
      if (userType === "student") {
        if (formData.programmeType.trim() === "")
          newErrors.programmeType = "Programme type is required";
        if (formData.programme.trim() === "")
          newErrors.programme = "Programme is required";
        if (
          formData.programme.trim() !== "" &&
          !studentProgrammeRecords.some(
            (programme) => programme.name === formData.programme,
          )
        ) {
          newErrors.programme = "Select a valid programme";
        }
        if (formData.indexNumber.trim() === "")
          newErrors.indexNumber = "Index number is required";
        if (formData.level.trim() === "") newErrors.level = "Level is required";
      } else {
        if (formData.title.trim() === "") newErrors.title = "Title is required";
        if (formData.courseLectured.trim() === "")
          newErrors.courseLectured = "Course is required";
      }
    } else if (step === 3) {
      if (formData.school.trim() === "")
        newErrors.school = "School is required";
      if (formData.department.trim() === "")
        newErrors.department = "Faculty is required";
    } else if (step === 4) {
      if (formData.password.trim() === "")
        newErrors.password = "Password is required";
      if (formData.confirmPassword.trim() === "")
        newErrors.confirmPassword = "Confirm password is required";
      if (formData.password.length < 8)
        newErrors.password = "Password must be at least 8 characters";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isCurrentStepValid = () => {
    if (currentStep === 1) {
      const hasBasicInfo =
        formData.name.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.email.includes("@");

      return userType === "student"
        ? hasBasicInfo && formData.gender.trim() !== ""
        : hasBasicInfo;
    } else if (currentStep === 2) {
      if (userType === "student") {
        return (
          formData.programmeType.trim() !== "" &&
          formData.programme.trim() !== "" &&
          studentProgrammeRecords.some(
            (programme) => programme.name === formData.programme,
          ) &&
          formData.indexNumber.trim() !== "" &&
          formData.level.trim() !== ""
        );
      } else {
        return (
          formData.title.trim() !== "" && formData.courseLectured.trim() !== ""
        );
      }
    } else if (currentStep === 3) {
      return formData.school.trim() !== "" && formData.department.trim() !== "";
    } else if (currentStep === 4) {
      return (
        formData.password.trim() !== "" &&
        formData.confirmPassword.trim() !== "" &&
        formData.password.length >= 8 &&
        formData.password === formData.confirmPassword
      );
    }
    return false;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setLoading(true);
    setSubmitError("");

    const registrationResult = registerUserAccount({
      role: userType,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      school: formData.school,
      department: formData.department,
      gender:
        userType === "student" && isKnownGender(formData.gender)
          ? formData.gender
          : undefined,
      indexNumber: userType === "student" ? formData.indexNumber : undefined,
      programme: userType === "student" ? formData.programme : undefined,
      level: userType === "student" ? formData.level : undefined,
      studyMode:
        userType === "student" && isKnownStudyMode(formData.studyMode)
          ? formData.studyMode
          : undefined,
      customStudyDays:
        userType === "student" && formData.studyMode === "custom"
          ? formData.customStudyDays
          : undefined,
      title: userType === "lecturer" ? formData.title : undefined,
      courseLectured:
        userType === "lecturer" ? formData.courseLectured : undefined,
    });

    setLoading(false);

    if (!registrationResult.success) {
      setSubmitError(registrationResult.message);

      if (registrationResult.field === "email") {
        setCurrentStep(1);
        setErrors((prev) => ({
          ...prev,
          email: registrationResult.message,
        }));
      }

      return;
    }

    if (userType === "student") {
      try {
        window.localStorage.removeItem(SIGNUP_STUDENT_DETAILS_STORAGE_KEY);
      } catch {
        // Ignore cleanup failures.
      }
    }

    const encodedEmail = encodeURIComponent(registrationResult.user.email);
    router.push(`/welcome?email=${encodedEmail}&role=${userType}`);
  };

  const inputStyles = {
    label: {
      color: "var(--color-text)",
      fontWeight: 700,
      fontSize: "0.76rem",
      letterSpacing: "0.08em",
      textTransform: "uppercase" as const,
      marginBottom: "0.42rem",
    },
    input: {
      backgroundColor: "var(--color-secondary-bg)",
      color: "var(--color-text)",
      borderColor: "rgba(148, 163, 184, 0.35)",
      minHeight: "54px",
    },
    dropdown: {
      backgroundColor: "var(--color-secondary-bg)",
      borderColor: "rgba(148, 163, 184, 0.35)",
    },
    option: {
      color: "var(--color-text)",
      backgroundColor: "transparent",
    },
    section: {
      color: "#94a3b8",
    },
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Basic Information";
      case 2:
        return userType === "student"
          ? "Academic Information"
          : "Professional Information";
      case 3:
        return "Institution Details";
      case 4:
        return "Set Password";
      default:
        return "";
    }
  };

  return (
    <AuthLayout
      userType={userType}
      title="Create your account"
      subtitle={
        userType === "student"
          ? "Join thousands of students simplifying their academic life"
          : "Manage your lectures and connect with students effortlessly"
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
        {/* Step Title */}
        <div className="mb-2">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Step {currentStep} of {totalSteps}
          </h3>
          <p className="text-lg font-bold text-[var(--color-text)] mt-1">
            {getStepTitle()}
          </p>
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <>
            <TextInput
              id="register-name"
              label="Full Name"
              placeholder="e.g. John Doe"
              size="md"
              leftSection={<User size={18} className="text-slate-400" />}
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              error={errors.name}
              styles={inputStyles}
            />

            <TextInput
              id="register-email"
              label={
                userType === "student"
                  ? "Student Email Address"
                  : "Email Address"
              }
              placeholder="e.g. john@university.edu"
              size="md"
              leftSection={<Mail size={18} className="text-slate-400" />}
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }));
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                if (submitError) setSubmitError("");
              }}
              error={errors.email}
              styles={inputStyles}
            />

            {userType === "student" && (
              <Select
                id="register-gender"
                label="Gender"
                placeholder="Select your gender"
                size="md"
                leftSection={<User size={18} className="text-slate-400" />}
                data={GENDER_OPTIONS}
                value={formData.gender}
                onChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    gender: isKnownGender(value) ? value : "",
                  }));
                  if (errors.gender)
                    setErrors((prev) => ({ ...prev, gender: "" }));
                }}
                error={errors.gender}
                styles={inputStyles}
              />
            )}
          </>
        )}

        {/* Step 2: Academic/Professional Information */}
        {currentStep === 2 && (
          <>
            {userType === "student" ? (
              <>
                <Select
                  id="register-programme-type"
                  label="Programme Type"
                  placeholder="Select programme type"
                  size="md"
                  leftSection={
                    <BookOpen size={18} className="text-slate-400" />
                  }
                  data={PROGRAMME_TYPE_SELECT_OPTIONS}
                  value={formData.programmeType}
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      programmeType: isKnownProgrammeType(value) ? value : "",
                      programme: "",
                    }));
                    if (errors.programmeType)
                      setErrors((prev) => ({ ...prev, programmeType: "" }));
                    if (errors.programme)
                      setErrors((prev) => ({ ...prev, programme: "" }));
                  }}
                  error={errors.programmeType}
                  styles={inputStyles}
                />

                <Select
                  id="register-programme"
                  label="Programme"
                  placeholder={
                    isKnownProgrammeType(formData.programmeType)
                      ? "Select your programme"
                      : "Select programme type first"
                  }
                  size="md"
                  leftSection={
                    <BookOpen size={18} className="text-slate-400" />
                  }
                  data={studentProgrammeSelectOptions}
                  value={formData.programme}
                  disabled={!isKnownProgrammeType(formData.programmeType)}
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      programme: value || "",
                    }));
                    if (errors.programme)
                      setErrors((prev) => ({ ...prev, programme: "" }));
                  }}
                  error={errors.programme}
                  styles={inputStyles}
                />

                {isKnownProgrammeType(formData.programmeType) &&
                  studentProgrammeSelectOptions.length === 0 && (
                    <p className="-mt-2 text-xs font-medium text-amber-600 dark:text-amber-400">
                      No programmes match the selected faculty and programme type.
                    </p>
                  )}

                <TextInput
                  id="register-index-number"
                  label="Index Number"
                  placeholder="e.g. UEB3214024"
                  size="md"
                  leftSection={<Hash size={18} className="text-slate-400" />}
                  value={formData.indexNumber}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      indexNumber: e.target.value,
                    }));
                    if (errors.indexNumber)
                      setErrors((prev) => ({ ...prev, indexNumber: "" }));
                  }}
                  error={errors.indexNumber}
                  styles={inputStyles}
                />

                <Select
                  id="register-level"
                  label="Level"
                  placeholder="Select your level"
                  size="md"
                  leftSection={
                    <GraduationCap size={18} className="text-slate-400" />
                  }
                  data={LEVEL_OPTIONS}
                  value={formData.level}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, level: value || "" }));
                    if (errors.level)
                      setErrors((prev) => ({ ...prev, level: "" }));
                  }}
                  error={errors.level}
                  styles={inputStyles}
                />
              </>
            ) : (
              <>
                <Select
                  id="register-title"
                  label="Title"
                  placeholder="Select title"
                  size="md"
                  leftSection={
                    <Briefcase size={18} className="text-slate-400" />
                  }
                  data={LECTURER_TITLE_OPTIONS}
                  value={formData.title}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, title: value || "" }));
                    if (errors.title)
                      setErrors((prev) => ({ ...prev, title: "" }));
                  }}
                  error={errors.title}
                  styles={inputStyles}
                />

                <Select
                  id="register-course"
                  label="Course Lectured"
                  placeholder="Select a course"
                  size="md"
                  leftSection={
                    <BookOpen size={18} className="text-slate-400" />
                  }
                  data={COURSE_SELECT_OPTIONS}
                  value={formData.courseLectured}
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      courseLectured: value || "",
                    }));
                    if (errors.courseLectured)
                      setErrors((prev) => ({ ...prev, courseLectured: "" }));
                  }}
                  error={errors.courseLectured}
                  styles={inputStyles}
                />
              </>
            )}
          </>
        )}

        {/* Step 3: Institution Details */}
        {currentStep === 3 && (
          <>
            <TextInput
              id="register-school"
              label="School Name"
              placeholder="e.g. University of Ghana"
              size="md"
              leftSection={<School size={18} className="text-slate-400" />}
              value={formData.school}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, school: e.target.value }));
                if (errors.school)
                  setErrors((prev) => ({ ...prev, school: "" }));
              }}
              error={errors.school}
              styles={inputStyles}
            />

            <Select
              id="register-faculty"
              label="Faculty"
              placeholder="Select faculty"
              size="md"
              leftSection={<Building2 size={18} className="text-slate-400" />}
              data={DEPARTMENT_SELECT_OPTIONS}
              value={formData.department}
              onChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  department: value || "",
                  programme: "",
                }));
                if (errors.department)
                  setErrors((prev) => ({ ...prev, department: "" }));
              }}
              error={errors.department}
              styles={inputStyles}
            />
          </>
        )}

        {/* Step 4: Password */}
        {currentStep === 4 && (
          <>
            <PasswordInput
              id="register-password"
              label="Password"
              placeholder="At least 8 characters"
              size="md"
              leftSection={<Lock size={18} className="text-slate-400" />}
              value={formData.password}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, password: e.target.value }));
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: "" }));
                if (submitError) setSubmitError("");
              }}
              error={errors.password}
              styles={inputStyles}
            />

            <PasswordInput
              id="register-confirm-password"
              label="Confirm Password"
              placeholder="Re-enter your password"
              size="md"
              leftSection={<Lock size={18} className="text-slate-400" />}
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }));
                if (errors.confirmPassword)
                  setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                if (submitError) setSubmitError("");
              }}
              error={errors.confirmPassword}
              styles={inputStyles}
            />
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="flex-1 flex items-center justify-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <ArrowLeft size={18} />
              Previous
            </button>
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className={`flex-1 flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 ${
                !isCurrentStepValid()
                  ? "opacity-45 cursor-not-allowed bg-gray-300"
                  : "bg-gradient-to-br from-[#a855f7] to-[#6366f1] shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:shadow-[0_8px_28px_rgba(99,102,241,0.45)]"
              }`}
              disabled={!isCurrentStepValid()}
            >
              Next
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              type="submit"
              className={`btn-brand flex-1 flex justify-center items-center gap-2 py-3 sm:py-3.5 text-base ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
              id="create-account-btn"
            >
              {loading ? (
                <>
                  <span className="inline-block rounded-full border-2 border-white border-t-transparent animate-spin w-5 h-5" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <UserPlus size={20} />
                </>
              )}
            </button>
          )}
        </div>

        {submitError && (
          <p
            role="alert"
            className="-mt-2 text-sm font-medium text-red-600 dark:text-red-400"
          >
            {submitError}
          </p>
        )}

        {/* Login Link */}
        <p className="mt-3 text-center text-sm text-slate-500 dark:text-slate-300 sm:text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--color-primary)] transition-colors hover:underline"
            id="login-link"
          >
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
