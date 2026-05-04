"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TextInput, PasswordInput } from "@mantine/core";
import { Mail, Lock, LogIn } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { FloatingBackLink } from "@/components/signup/FloatingBackLink";

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
      fontWeight: "600" as const,
      boxShadow: "0 2px 10px rgba(168, 85, 247, 0.05)",
      transition: "all 0.2s ease",
      "&::placeholder": { color: "#475569", opacity: 1 },
      "&:focus": { borderColor: "#a855f7", boxShadow: "0 0 0 4px rgba(168, 85, 247, 0.1)" },
    },
    innerInput: { minHeight: "56px" },
    section: { color: "#64748b" },
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

        .institution-page::before,
        .institution-page::after {
          content: ""; position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0;
        }
        .institution-page::before {
          width: 600px; height: 600px; top: -200px; left: -150px;
          background: radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%);
        }
        .institution-page::after {
          width: 500px; height: 500px; bottom: -150px; right: -100px;
          background: radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%);
        }

        .institution-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 480px;
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
          gap: 0.6rem;
          padding: 1.1rem 2.5rem;
          border-radius: 20px;
          border: none;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          background: #000;
          color: #fff;
          width: 100%;
          margin-top: 1rem;
        }
        .institution-continue-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.3);
          background: #000;
        }
        .institution-continue-btn:disabled {
          opacity: 0.2;
          cursor: not-allowed;
        }
        
        .footer-link {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.9rem;
          color: #475569;
          font-weight: 600;
        }
        .footer-link a { color: #7e22ce; font-weight: 800; text-decoration: none; }
        .footer-link a:hover { text-decoration: underline; }

        .forgot-btn {
          display: block;
          width: 100%;
          text-align: right;
          margin-bottom: 1.5rem;
          margin-top: -0.5rem;
          font-size: 0.8rem;
          font-weight: 800;
          color: #7e22ce;
          background: none;
          border: none;
          cursor: pointer;
        }
      `}</style>

      <main className="institution-page">
        <FloatingBackLink href="/" label="Back" />

        <div className="institution-container">
          <header className="institution-header">
            <h1 className="institution-title">Sign In</h1>
            <p className="institution-subtitle">Access your academic dashboard.</p>
          </header>

          <div className="institution-form-card">
            <form onSubmit={handleSubmit}>
              <TextInput
                id="login-email"
                placeholder="Email Address"
                leftSection={<Mail size={18} />}
                value={formData.email}
                onChange={(e) => { setFormData(prev => ({ ...prev, email: e.target.value })); if (authError) setAuthError(""); }}
                styles={inputStyles}
              />

              <PasswordInput
                id="login-password"
                placeholder="Password"
                leftSection={<Lock size={18} />}
                value={formData.password}
                onChange={(e) => { setFormData(prev => ({ ...prev, password: e.target.value })); if (authError) setAuthError(""); }}
                styles={inputStyles}
              />

              <button type="button" className="forgot-btn">Forgot password?</button>

              {authNotice && <p className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">{authNotice}</p>}
              {authError && <p className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100">{authError}</p>}

              <button type="submit" className="institution-continue-btn" disabled={!isFormValid || loading}>
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <LogIn size={18} />}
              </button>

              <p className="footer-link">
                New here? <Link href="/signup/institution?startOver=1">Create Account</Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
