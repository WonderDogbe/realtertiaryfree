"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Html5Qrcode } from "html5-qrcode";

export type QrScannerStatus =
  | "idle"
  | "scanning"
  | "success"
  | "error"
  | "permission-denied";

export interface AttendanceCheckInRecord {
  course: string;
  checkInDate: string;
  checkInTime: string;
  status: "Present";
  rawValue: string;
}

interface UseQrScannerOptions {
  onCheckIn?: (record: AttendanceCheckInRecord) => void;
}

const PERMISSION_DENIED_ERRORS = new Set([
  "NotAllowedError",
  "PermissionDeniedError",
  "SecurityError",
]);

const isPermissionDenied = (error: unknown) => {
  if (!(error instanceof DOMException)) {
    return false;
  }

  return PERMISSION_DENIED_ERRORS.has(error.name);
};

const parseLectureFromQrValue = (rawValue: string): string | null => {
  const value = rawValue.trim();

  if (!value) {
    return null;
  }

  if (value.startsWith("{")) {
    try {
      const parsed = JSON.parse(value) as Record<string, unknown>;
      const lectureValue = parsed.lecture ?? parsed.course ?? parsed.class;

      if (typeof lectureValue === "string" && lectureValue.trim().length >= 3) {
        return lectureValue.trim();
      }
    } catch {
      // Fall back to the other patterns.
    }
  }

  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      const lectureQuery =
        url.searchParams.get("lecture") ||
        url.searchParams.get("course") ||
        url.searchParams.get("class");

      if (lectureQuery && lectureQuery.trim().length >= 3) {
        return lectureQuery.trim();
      }
    } catch {
      // Ignore invalid URLs and continue with other patterns.
    }
  }

  const prefixedLectureMatch = value.match(/(?:lecture|course|class)\s*[:=-]\s*(.+)$/i);

  if (prefixedLectureMatch && prefixedLectureMatch[1]?.trim().length >= 3) {
    return prefixedLectureMatch[1].trim();
  }

  return value.length >= 3 ? value : null;
};

const formatCheckInTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const formatCheckInDate = () =>
  new Date().toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

export function useQrScanner(options: UseQrScannerOptions = {}) {
  const { onCheckIn } = options;
  const scannerElementIdRef = useRef(
    `attendance-scanner-${Math.random().toString(36).slice(2, 10)}`,
  );
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const hasSuccessfulScanRef = useRef(false);
  const lastInvalidScanRef = useRef(0);

  const [isScannerRunning, setIsScannerRunning] = useState(false);
  const [status, setStatus] = useState<QrScannerStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("Ready to scan");

  const stopScan = useCallback(async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;

    if (!scanner) {
      setIsScannerRunning(false);
      return;
    }

    try {
      await scanner.stop();
    } catch {
      // Scanner may already be stopped.
    }

    try {
      scanner.clear();
    } catch {
      // Ignore clear errors after teardown.
    }

    setIsScannerRunning(false);
  }, []);

  const requestCameraPermission = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStatus("error");
      setStatusMessage("Camera is not supported on this device.");
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
        },
      });

      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (error) {
      if (isPermissionDenied(error)) {
        setStatus("permission-denied");
        setStatusMessage("Camera access required");
        return false;
      }

      setStatus("error");
      setStatusMessage("Unable to access camera. Please try again.");
      return false;
    }
  }, []);

  const startScan = useCallback(async () => {
    if (isScannerRunning) {
      return;
    }

    hasSuccessfulScanRef.current = false;
    setStatus("idle");
    setStatusMessage("Ready to scan");

    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      return;
    }

    setStatus("scanning");
    setStatusMessage("Scanning...");

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const cameras = await Html5Qrcode.getCameras();

      if (!cameras.length) {
        setStatus("error");
        setStatusMessage("No camera found on this device.");
        return;
      }

      const preferredCamera =
        cameras.find((camera) => /back|rear|environment/i.test(camera.label)) ||
        cameras[0];

      const scanner = new Html5Qrcode(scannerElementIdRef.current, {
        verbose: false,
      });

      scannerRef.current = scanner;
      setIsScannerRunning(true);
      lastInvalidScanRef.current = 0;

      await scanner.start(
        preferredCamera.id,
        {
          fps: 10,
          aspectRatio: 1.777778,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const qrEdge = Math.floor(
              Math.min(viewfinderWidth, viewfinderHeight) * 0.74,
            );

            return {
              width: qrEdge,
              height: qrEdge,
            };
          },
        },
        (decodedText) => {
          if (hasSuccessfulScanRef.current) {
            return;
          }

          const lecture = parseLectureFromQrValue(decodedText);

          if (!lecture) {
            const now = Date.now();
            if (now - lastInvalidScanRef.current > 1500) {
              setStatus("error");
              setStatusMessage("Invalid QR code");
              lastInvalidScanRef.current = now;
            }
            return;
          }

          hasSuccessfulScanRef.current = true;
          setStatus("success");
          setStatusMessage("Attendance recorded");

          onCheckIn?.({
            course: lecture,
            checkInDate: formatCheckInDate(),
            checkInTime: formatCheckInTime(),
            status: "Present",
            rawValue: decodedText,
          });

          void stopScan();
        },
        () => {
          // Ignore per-frame decode errors during scanning.
        },
      );
    } catch {
      await stopScan();
      setStatus("error");
      setStatusMessage("Unable to start scanner. Please try again.");
    }
  }, [isScannerRunning, onCheckIn, requestCameraPermission, stopScan]);

  const resetState = useCallback(() => {
    hasSuccessfulScanRef.current = false;
    setStatus("idle");
    setStatusMessage("Ready to scan");
  }, []);

  useEffect(() => {
    return () => {
      void stopScan();
    };
  }, [stopScan]);

  return {
    scannerElementId: scannerElementIdRef.current,
    isScannerRunning,
    status,
    statusMessage,
    startScan,
    stopScan,
    simulateScan: async () => {
      if (hasSuccessfulScanRef.current) return;
      
      const mockCourse = "MTH 101: Engineering Mathematics I";
      hasSuccessfulScanRef.current = true;
      setStatus("success");
      setStatusMessage("Attendance recorded (Simulated)");
      
      onCheckIn?.({
        course: mockCourse,
        checkInDate: formatCheckInDate(),
        checkInTime: formatCheckInTime(),
        status: "Present",
        rawValue: "SIMULATED_SCAN_VALUE",
      });
      
      if (isScannerRunning) {
        await stopScan();
      }
    },
    resetState,
  };
}
