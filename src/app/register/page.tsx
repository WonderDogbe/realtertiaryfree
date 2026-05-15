"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TextInput, PasswordInput } from "@mantine/core";
import {
  Eye,
  EyeOff,
} from "lucide-react";
import { AuthLayout } from "@/components/AuthLayout";
import { createClient } from "@/utils/supabase/client";

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
  const userType = role === "lecturer" ? "lecturer" : "student";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");

  const inputStyles = {
    input: {
      backgroundColor: "var(--color-secondary-bg)",
      color: "var(--color-text)",
      borderColor: "rgba(148, 163, 184, 0.2)",
      borderWidth: "1.5px",
      minHeight: "60px",
      borderRadius: "16px",
      fontSize: "1.05rem",
      paddingLeft: "1.5rem",
      "&::placeholder": {
        color: "var(--color-text)",
        opacity: 0.5,
        fontWeight: 400,
      },
      "&:focus": {
        borderColor: "var(--color-primary)",
      },
    },
    section: {
      marginRight: "0.75rem",
    },
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.email.includes("@") &&
      formData.password.trim() !== "" &&
      formData.confirmPassword.trim() !== "" &&
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (formData.firstName.trim() === "") newErrors.firstName = "First name is required";
    if (formData.lastName.trim() === "") newErrors.lastName = "Last name is required";
    if (formData.email.trim() === "") newErrors.email = "Email is required";
    else if (!formData.email.includes("@"))
      newErrors.email = "Invalid email address";

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
          name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
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
      userType={userType as "student" | "lecturer"}
      centerHeader={true}
    >
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-[42px] font-bold text-[var(--color-text)] tracking-tight leading-tight text-center">
          Create your<br />account
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto w-full">
        <TextInput
          placeholder="First name"
          size="lg"
          value={formData.firstName}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, firstName: e.target.value }));
            if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: "" }));
          }}
          error={errors.firstName}
          styles={inputStyles}
        />

        <TextInput
          placeholder="Last name"
          size="lg"
          value={formData.lastName}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, lastName: e.target.value }));
            if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: "" }));
          }}
          error={errors.lastName}
          styles={inputStyles}
        />

        <TextInput
          placeholder="Email address"
          size="lg"
          value={formData.email}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, email: e.target.value }));
            if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
          }}
          error={errors.email}
          styles={inputStyles}
        />

        <PasswordInput
          placeholder="Password"
          size="lg"
          visibilityToggleIcon={({ reveal }) =>
            reveal ? <EyeOff size={22} strokeWidth={1.5} /> : <Eye size={22} strokeWidth={1.5} />
          }
          value={formData.password}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, password: e.target.value }));
            if (errors.password)
              setErrors((prev) => ({ ...prev, password: "" }));
          }}
          error={errors.password}
          styles={inputStyles}
        />

        <PasswordInput
          placeholder="Confirm password"
          size="lg"
          visibilityToggleIcon={({ reveal }) =>
            reveal ? <EyeOff size={22} strokeWidth={1.5} /> : <Eye size={22} strokeWidth={1.5} />
          }
          value={formData.confirmPassword}
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              confirmPassword: e.target.value,
            }));
            if (errors.confirmPassword)
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
          }}
          error={errors.confirmPassword}
          styles={inputStyles}
        />

        <button
          type="submit"
          className={`mt-6 w-full rounded-full bg-[var(--color-text)] py-5 text-lg font-bold text-[var(--color-background)] transition-all hover:opacity-90 active:scale-[0.98] ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={loading}
          id="create-account-btn"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {submitError && (
          <p
            role="alert"
            className="text-center text-sm font-medium text-red-600 mt-2"
          >
            {submitError}
          </p>
        )}

        <div className="mt-8 text-center text-[15px] text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-[var(--color-text)] underline decoration-[1.5px] underline-offset-4"
            id="login-link"
          >
            Log In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
