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
  GraduationCap,
  Presentation,
} from "lucide-react";
import { AuthLayout } from "@/components/AuthLayout";
import { createClient } from "@/utils/supabase/client";
import { getGenderOptions, isKnownGender } from "@/lib/local-db";

const GENDER_OPTIONS = getGenderOptions();

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{
    role?: string | string[] | undefined;
  }>;
}) {
  const router = useRouter();
  const resolvedSearchParams = use(searchParams);
  const rawRole = resolvedSearchParams.role;
  const role = Array.isArray(rawRole) ? rawRole[0] : rawRole;
  const initialRole = role === "lecturer" ? "lecturer" : role === "student" ? "student" : "";
  const [selectedRole, setSelectedRole] = useState<"" | "student" | "lecturer">(initialRole as "" | "student" | "lecturer");
  const userType = selectedRole || "student";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    indexNumber: "",
    gender: "" as string,
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

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

  const isFormValid = () => {
    if (!selectedRole) return false;

    const hasBasic =
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.email.includes("@") &&
      formData.password.trim() !== "" &&
      formData.confirmPassword.trim() !== "" &&
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword;

    if (userType === "student") {
      return (
        hasBasic &&
        formData.indexNumber.trim() !== "" &&
        isKnownGender(formData.gender)
      );
    }

    return hasBasic;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (formData.name.trim() === "") newErrors.name = "Name is required";
    if (formData.email.trim() === "") newErrors.email = "Email is required";
    else if (!formData.email.includes("@"))
      newErrors.email = "Invalid email address";

    if (userType === "student") {
      if (formData.indexNumber.trim() === "")
        newErrors.indexNumber = "Index number is required";
      if (!isKnownGender(formData.gender))
        newErrors.gender = "Gender is required";
    }

    if (formData.password.trim() === "")
      newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (formData.confirmPassword.trim() === "")
      newErrors.confirmPassword = "Confirm password is required";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSubmitError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          role: userType,
          name: formData.name.trim(),
          gender:
            userType === "student" && isKnownGender(formData.gender)
              ? formData.gender
              : null,
          indexNumber:
            userType === "student" ? formData.indexNumber.trim() : null,
          onboardingComplete: false,
        },
      },
    });

    setLoading(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    const encodedEmail = encodeURIComponent(formData.email);
    router.push(`/welcome?email=${encodedEmail}&role=${userType}`);
  };

  return (
    <AuthLayout
      userType={selectedRole || "student"}
      title="Create your account"
      subtitle={
        userType === "student"
          ? "Join thousands of students simplifying their academic life"
          : "Manage your lectures and connect with students effortlessly"
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
        {/* Role Selector */}
        <div className="flex gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setSelectedRole("student")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
              userType === "student"
                ? "bg-white text-gray-900 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            <GraduationCap size={16} />
            Student
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("lecturer")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
              userType === "lecturer"
                ? "bg-white text-gray-900 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            <Presentation size={16} />
            Lecturer
          </button>
        </div>

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
            userType === "student" ? "Student Email Address" : "Email Address"
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
          <>
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
          </>
        )}

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

        <button
          type="submit"
          className={`btn-brand flex w-full justify-center items-center gap-2 py-3 sm:py-3.5 text-base mt-2 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading || !isFormValid()}
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
