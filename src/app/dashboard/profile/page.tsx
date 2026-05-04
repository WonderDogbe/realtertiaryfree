"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  CalendarDays,
  Building2,
  GraduationCap,
  Hash,
  IdCard,
  Layers3,
  Mail,
  User,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/utils/supabase/client";

const formatDisplayName = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`)
    .join(" ");

function ProfileInfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800">
      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 transition-colors duration-300 dark:text-gray-400">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-blue-700 transition-colors duration-300 dark:bg-blue-900/40 dark:text-blue-200">
          {icon}
        </span>
        {label}
      </p>
      <p className="mt-3 text-sm font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
        {value}
      </p>
    </article>
  );
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function StudentProfilePage() {
  const { user: profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (profile?.avatarUrl) {
      setAvatarUrl(profile.avatarUrl);
    }
  }, [profile]);

  const name = profile?.name ? formatDisplayName(profile.name) : "Not available";
  const indexNumber = profile?.indexNumber || "Not provided during registration";
  const programme = profile?.programme || "Not available";
  const level = profile?.level
    ? profile.level.toLowerCase().startsWith("level")
      ? formatDisplayName(profile.level)
      : `Level ${profile.level}`
    : "Not available";
  const department = profile?.department || "Not available";
  const school = profile?.school || "Not available";
  const email = profile?.email || "Not available";
  const studyModeLabel =
    profile?.studyMode === "weekend"
      ? "Weekend"
      : profile?.studyMode === "custom"
        ? "Custom"
        : "Regular";
  const activeDaysLabel =
    profile?.customStudyDays && profile.customStudyDays.length > 0
      ? profile.customStudyDays.join(", ")
      : "Monday, Tuesday, Wednesday, Thursday, Friday";

  const userInitials = (() => {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "ST";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  })();

  const handleAvatarClick = () => {
    if (uploadStatus === "uploading") return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!e.target.files) return;
    // reset so same file can be picked again
    e.target.value = "";

    if (!file) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select an image file.");
      setUploadStatus("error");
      return;
    }

    // Validate size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image must be smaller than 5 MB.");
      setUploadStatus("error");
      return;
    }

    setUploadStatus("uploading");
    setErrorMessage("");

    try {
      const supabase = createClient();
      const userId = profile?.id;
      if (!userId) throw new Error("Not authenticated");

      // Optimistic preview
      const localPreview = URL.createObjectURL(file);
      setAvatarUrl(localPreview);

      const ext = file.name.split(".").pop() ?? "jpg";
      const filePath = `${userId}/avatar.${ext}`;

      const { error: storageError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true, contentType: file.type });

      if (storageError) throw storageError;

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;
      setAvatarUrl(publicUrl);

      // Persist to Supabase Auth user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatarUrl: publicUrl },
      });

      if (updateError) throw updateError;

      setUploadStatus("success");
      setTimeout(() => setUploadStatus("idle"), 3000);
    } catch (err: any) {
      console.error("Avatar upload failed:", err);
      // Revert to previous avatar on error
      setAvatarUrl(profile?.avatarUrl ?? null);
      setErrorMessage(err?.message ?? "Upload failed. Please try again.");
      setUploadStatus("error");
      setTimeout(() => setUploadStatus("idle"), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero section */}
      <section className="overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50 p-6 shadow-sm transition-colors duration-300 dark:border-blue-900/50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 min-w-0">
            {/* Avatar upload button */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={uploadStatus === "uploading"}
                aria-label="Change profile picture"
                className="group relative h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-md transition-transform duration-200 hover:scale-105 active:scale-95 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Profile picture"
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-gray-900 text-xl font-bold text-white dark:bg-gray-700">
                    {userInitials}
                  </span>
                )}

                {/* Overlay on hover */}
                <span className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {uploadStatus === "uploading" ? (
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  ) : (
                    <>
                      <Camera className="h-5 w-5 text-white" />
                      <span className="mt-1 text-[10px] font-semibold text-white">Change</span>
                    </>
                  )}
                </span>
              </button>

              {/* Status badge */}
              {uploadStatus === "uploading" && (
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 shadow">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                </span>
              )}
              {uploadStatus === "success" && (
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 shadow">
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                </span>
              )}
              {uploadStatus === "error" && (
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 shadow">
                  <AlertCircle className="h-3.5 w-3.5 text-white" />
                </span>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              aria-label="Upload profile picture"
              onChange={handleFileChange}
            />

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700 transition-colors duration-300 dark:text-blue-300">
                Student Profile
              </p>
              <h2 className="mt-1 truncate text-2xl font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                {name}
              </h2>
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={uploadStatus === "uploading"}
                className="mt-1 text-xs font-medium text-blue-600 underline-offset-2 hover:underline disabled:opacity-50 dark:text-blue-400"
              >
                {uploadStatus === "uploading"
                  ? "Uploading…"
                  : uploadStatus === "success"
                    ? "Photo updated!"
                    : "Change photo"}
              </button>
              {uploadStatus === "error" && errorMessage && (
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                  <AlertCircle className="h-3 w-3 flex-shrink-0" />
                  {errorMessage}
                </p>
              )}
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700 backdrop-blur transition-colors duration-300 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            <Layers3 className="h-3.5 w-3.5" />
            {formatDisplayName(level)}
          </div>
        </div>
      </section>

      {/* Info grid */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ProfileInfoCard icon={<User className="h-4 w-4" />} label="Name" value={name} />
        <ProfileInfoCard icon={<Hash className="h-4 w-4" />} label="Index Number" value={indexNumber} />
        <ProfileInfoCard icon={<GraduationCap className="h-4 w-4" />} label="Programme" value={programme} />
        <ProfileInfoCard icon={<Layers3 className="h-4 w-4" />} label="Level" value={formatDisplayName(level)} />
        <ProfileInfoCard icon={<IdCard className="h-4 w-4" />} label="Faculty" value={department} />
        <ProfileInfoCard icon={<CalendarDays className="h-4 w-4" />} label="Study Mode" value={studyModeLabel} />
        <ProfileInfoCard icon={<Building2 className="h-4 w-4" />} label="Institution" value={school} />
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 transition-colors duration-300 dark:text-gray-400">
          <CalendarDays className="h-4 w-4" />
          Active Study Days
        </p>
        <p className="mt-2 text-sm font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
          {activeDaysLabel}
        </p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 transition-colors duration-300 dark:text-gray-400">
          <Mail className="h-4 w-4" />
          Account Email
        </p>
        <p className="mt-2 text-sm font-semibold text-gray-900 transition-colors duration-300 dark:text-gray-100">
          {email}
        </p>
      </section>
    </div>
  );
}
