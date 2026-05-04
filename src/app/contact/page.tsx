"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Clock,
  Send,
  Sun,
  Moon,
  MessageSquare,
  Headphones,
  BookOpen,
  ChevronRight,
} from "lucide-react";

/* ─── CONTACT CHANNELS ─── */
const CHANNELS = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Our team typically responds within 24 hours on business days.",
    detail: "support@tertiaryfree.com",
    href: "mailto:support@tertiaryfree.com",
    cta: "Send email",
  },
  {
    icon: MapPin,
    title: "Visit Campus",
    description: "Come say hi at our campus innovation hub.",
    detail: "Ho Technical University, Ho, Ghana",
    href: "https://maps.google.com/?q=Ho+Technical+University",
    cta: "Get directions",
  },
  {
    icon: Clock,
    title: "Office Hours",
    description: "We're available during standard working hours.",
    detail: "Mon – Fri, 8:00 AM – 5:00 PM GMT",
    href: null,
    cta: null,
  },
];

/* ─── FAQ ─── */
const FAQS = [
  {
    icon: MessageSquare,
    question: "How do I reset my password?",
    answer:
      "Go to the sign-in page and tap \"Forgot password\". You'll receive a reset link at your registered email within minutes.",
  },
  {
    icon: Headphones,
    question: "Can my institution join TertiaryFree?",
    answer:
      "Absolutely. Email us at support@tertiaryfree.com with your institution details and we'll walk you through the onboarding process.",
  },
  {
    icon: BookOpen,
    question: "Is TertiaryFree free for students?",
    answer:
      "Yes — students can create accounts, access timetables, check attendance, and receive notifications completely free of charge.",
  },
];

export default function ContactPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    const isDark =
      document.documentElement.classList.contains("dark") ||
      !document.documentElement.classList.contains("light");
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormState({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-500 dark:bg-black dark:text-white">
      {/* ─── STICKY HEADER ─── */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="flex justify-center px-4 pt-4">
          <div className="flex w-full max-w-4xl items-center justify-between rounded-2xl border border-gray-200 bg-white/80 px-5 py-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/70 dark:shadow-2xl">
            <Link href="/" className="shrink-0 group flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 text-gray-500 transition-transform group-hover:-translate-x-0.5 dark:text-white/50" />
              <Image
                src="/logo.png"
                alt="TertiaryFree"
                width={140}
                height={38}
                priority
                className="h-7 w-auto object-contain"
              />
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center justify-center rounded-full border border-gray-200 bg-gray-100 px-5 py-2 text-sm font-semibold text-gray-900 backdrop-blur-sm transition-all hover:bg-black hover:text-white dark:border-white/25 dark:bg-white/10 dark:text-white dark:hover:bg-white dark:hover:text-black"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-40 pb-24 text-center">
        {/* Subtle radial glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,#2563eb08,transparent_60%)] dark:bg-[radial-gradient(ellipse_at_center,#1e3a5f18,transparent_60%)]" />

        <div className="relative animate-slide-up">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5">
            <Mail className="h-7 w-7 text-gray-900 dark:text-white/80" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-gray-500 dark:text-white/40">
            Have a question, feedback, or partnership inquiry? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* ─── CONTACT CHANNELS ─── */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {CHANNELS.map((channel, i) => {
            const Icon = channel.icon;
            return (
              <div
                key={channel.title}
                className="group rounded-2xl border border-gray-100 bg-gray-50/50 p-8 transition-all duration-500 hover:border-gray-200 hover:shadow-lg dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-white/15 dark:hover:shadow-2xl animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-black/5 transition-transform duration-300 group-hover:scale-105 dark:bg-white/5">
                  <Icon className="h-5 w-5 text-gray-900 dark:text-white/80" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white/90">{channel.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-white/40">{channel.description}</p>
                <p className="mt-4 text-sm font-semibold text-gray-900 dark:text-white/80">{channel.detail}</p>
                {channel.href && (
                  <a
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-black dark:text-white/50 dark:hover:text-white"
                  >
                    {channel.cta}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── CONTACT FORM + FAQ SPLIT ─── */}
      <section className="relative mx-auto max-w-7xl px-6 pb-32">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* LEFT — Form */}
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Send Us a Message
            </h2>
            <p className="mt-3 text-base text-gray-500 dark:text-white/40">
              Fill out the form and our team will get back to you shortly.
            </p>

            {submitted ? (
              <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-10 text-center dark:border-emerald-800/40 dark:bg-emerald-950/20">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <Send className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-300">Message Sent!</h3>
                <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400/70">
                  Thank you for reaching out. We&apos;ll respond within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/60">
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-white/25 dark:focus:border-white/25 dark:focus:ring-white/5"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/60">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-white/25 dark:focus:border-white/25 dark:focus:ring-white/5"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/60">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    value={formState.subject}
                    onChange={(e) => setFormState((s) => ({ ...s, subject: e.target.value }))}
                    placeholder="What's this about?"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-white/25 dark:focus:border-white/25 dark:focus:ring-white/5"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-white/60">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={6}
                    value={formState.message}
                    onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                    placeholder="Tell us more..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-white/25 dark:focus:border-white/25 dark:focus:ring-white/5"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-black px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-black/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-white/90 dark:hover:shadow-white/10"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-black dark:border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT — FAQ */}
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Common Questions
            </h2>
            <p className="mt-3 text-base text-gray-500 dark:text-white/40">
              Quick answers to things you might be wondering.
            </p>

            <div className="mt-10 space-y-4">
              {FAQS.map((faq, i) => {
                const Icon = faq.icon;
                const isOpen = expandedFaq === i;
                return (
                  <div
                    key={faq.question}
                    className="rounded-2xl border border-gray-100 bg-gray-50/50 transition-all duration-300 dark:border-white/5 dark:bg-white/[0.02]"
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : i)}
                      className="flex w-full items-start gap-4 p-6 text-left"
                      aria-expanded={isOpen}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5">
                        <Icon className="h-4 w-4 text-gray-700 dark:text-white/70" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white/90">{faq.question}</h3>
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isOpen ? "mt-3 max-h-40 opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          <p className="text-sm leading-6 text-gray-500 dark:text-white/40">{faq.answer}</p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`mt-0.5 h-4 w-4 shrink-0 text-gray-400 transition-transform duration-300 dark:text-white/30 ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Extra CTA */}
            <div className="mt-10 rounded-2xl border border-gray-100 bg-gray-50/50 p-8 dark:border-white/5 dark:bg-white/[0.02]">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white/90">Still need help?</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-white/40">
                Our support team is happy to assist you with anything you need.
              </p>
              <a
                href="mailto:support@tertiaryfree.com"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-900 transition-all hover:bg-black hover:text-white dark:border-white/15 dark:text-white dark:hover:bg-white dark:hover:text-black"
              >
                Email support
                <Mail className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-gray-200 dark:bg-black">
        <div className="mx-auto max-w-7xl px-6 py-12 text-center">
          <Link href="/" className="inline-block">
            <Image src="/logo.png" alt="TertiaryFree" width={140} height={38} className="mx-auto h-7 w-auto" />
          </Link>
          <p className="mt-4 text-sm text-gray-500 dark:text-white/30">
            &copy; {new Date().getFullYear()} TertiaryFree. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center gap-6">
            <Link href="/#features" className="text-xs text-gray-500 transition-colors hover:text-gray-900 dark:text-white/30 dark:hover:text-white">
              Features
            </Link>
            <Link href="/#about" className="text-xs text-gray-500 transition-colors hover:text-gray-900 dark:text-white/30 dark:hover:text-white">
              About
            </Link>
            <Link href="/login" className="text-xs text-gray-500 transition-colors hover:text-gray-900 dark:text-white/30 dark:hover:text-white">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
