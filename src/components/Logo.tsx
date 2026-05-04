"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizeMap = {
    sm: { width: 120, height: 40 },
    md: { width: 150, height: 50 },
    lg: { width: 200, height: 67 },
  };

  const { width, height } = sizeMap[size];

  return (
    <Link
      href="/"
      className={`inline-flex items-center no-underline group ${className}`}
      id="brand-logo"
    >
      <Image
        src="/logo.png"
        alt="TertiaryFree Logo"
        width={width}
        height={height}
        priority
        className="h-auto w-auto"
      />
    </Link>
  );
}
