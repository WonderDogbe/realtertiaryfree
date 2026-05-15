"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TextInput, PasswordInput } from "@mantine/core";
import { Mail, Lock, LogIn } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { FloatingBackLink } from "@/components/signup/FloatingBackLink";

import { AuthLayout } from "@/components/AuthLayout";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    email?: string | string[] | undefined;
    registered?: string | string[] | undefined;
  }>;
}) {
  const router = useRouter();
  const resolvedSearchParams = use(searchParams);
  const rawEmail = resolvedSearchParams.email;
  const emailFromQuery = Array.isArray(rawEmail) ? rawEmail[0] : rawEmail;
  const rawRegistered = resolvedSearchParams.registered;
  const accountCreated = (Array.isArray(rawRegistered) ? rawRegistered[0] : rawRegistered) === "1";
  
  const [formData, setFormData] = useState(() => ({
    email: emailFromQuery || "",
    password: "",
  }));
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const authNotice = accountCreated ? "Account created. Sign in with your new credentials." : "";

  const isFormValid = formData.email.trim() !== "" && formData.password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setAuthError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);
    if (error) { setAuthError(error.message); return; }
    router.push("/dashboard");
  };

  const inputStyles = {
    input: {
      backgroundColor: "var(--color-secondary-bg)",
      color: "var(--color-text)",
      borderColor: "rgba(148, 163, 184, 0.2)",
      borderWidth: "1.5px",
      minHeight: "60px",
      borderRadius: "16px",
      fontSize: "1.05rem",
      paddingLeft: "3.5rem",
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
      marginLeft: "0.75rem",
      color: "var(--color-text)",
      opacity: 0.6,
    },
  };

  return (
    <AuthLayout
      userType="login"
      subtitle="Access your academic dashboard."
      centerHeader={true}
    >
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-[42px] font-bold text-[var(--color-text)] tracking-tight leading-tight text-center">
          Sign In
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto w-full">
        <TextInput
          id="login-email"
          placeholder="Email address"
          size="lg"
          leftSection={<Mail size={22} strokeWidth={1.5} />}
          value={formData.email}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, email: e.target.value }));
            if (authError) setAuthError("");
          }}
          styles={inputStyles}
        />

        <PasswordInput
          id="login-password"
          placeholder="Password"
          size="lg"
          leftSection={<Lock size={22} strokeWidth={1.5} />}
          value={formData.password}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, password: e.target.value }));
            if (authError) setAuthError("");
          }}
          styles={inputStyles}
        />

        <div className="flex justify-end -mt-2">
          <button type="button" className="text-sm font-bold text-[var(--color-primary)] hover:underline">
            Forgot password?
          </button>
        </div>

        {authNotice && (
          <p className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-600 text-sm font-semibold border border-emerald-500/20">
            {authNotice}
          </p>
        )}
        
        {authError && (
          <p className="p-4 rounded-2xl bg-red-500/10 text-red-600 text-sm font-semibold border border-red-500/20">
            {authError}
          </p>
        )}

        <button
          type="submit"
          className={`mt-6 w-full rounded-full bg-[var(--color-text)] py-5 text-lg font-bold text-[var(--color-background)] transition-all hover:opacity-90 active:scale-[0.98] ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={!isFormValid || loading}
          id="login-btn"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="mt-8 text-center text-[15px] text-gray-500">
          New here?{" "}
          <Link
            href="/register"
            className="font-bold text-[var(--color-text)] underline decoration-[1.5px] underline-offset-4"
            id="register-link"
          >
            Create Account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
