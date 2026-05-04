"use client";

import { QrCode, Keyboard, X, Camera, ScanLine, AlertCircle, CheckCircle2 } from "lucide-react";
import type { AttendanceCheckInRecord, QrScannerStatus } from "./useQrScanner";
import { useQrScanner } from "./useQrScanner";
import { useState } from "react";

interface QRScannerProps {
  onCheckIn: (record: AttendanceCheckInRecord) => void;
}

export function QRScanner({ onCheckIn }: QRScannerProps) {
  const [activeTab, setActiveTab] = useState<"scan" | "key">("scan");
  const {
    scannerElementId,
    isScannerRunning,
    status,
    statusMessage,
    startScan,
    stopScan,
    simulateScan,
    resetState,
  } = useQrScanner({ onCheckIn });

  const handleStartScan = () => {
    void startScan();
  };

  const handleStopScan = async () => {
    await stopScan();
    resetState();
  };

  return (
    <section className="mx-auto w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-colors duration-300 dark:bg-gray-900 dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
      <style>{`
        @keyframes scan-line {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-line {
          animation: scan-line 3s linear infinite;
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Attendance Check-in
        </h2>
        <button 
          onClick={handleStopScan}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 mt-6">
        <div className="flex rounded-2xl bg-gray-50 p-1.5 dark:bg-gray-800/50">
          <button
            onClick={() => setActiveTab("scan")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all ${
              activeTab === "scan"
                ? "bg-white text-[#6366f1] shadow-sm dark:bg-gray-800 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <Camera className="h-4 w-4" />
            Scan QR
          </button>
          <button
            onClick={() => setActiveTab("key")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all ${
              activeTab === "key"
                ? "bg-white text-[#6366f1] shadow-sm dark:bg-gray-800 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <Keyboard className="h-4 w-4" />
            Enter Key
          </button>
        </div>
      </div>

      <div className="p-8">
        {activeTab === "scan" ? (
          <div className="flex flex-col items-center">
            {/* QR Viewfinder Container */}
            <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-[2rem] bg-gray-950 shadow-2xl">
              {/* Corner Markers */}
              <div className="absolute inset-0 z-20 pointer-events-none p-6">
                {/* Top Left */}
                <div className="absolute left-6 top-6 h-10 w-10 border-l-4 border-t-4 border-gray-400/60 rounded-tl-xl" />
                {/* Top Right */}
                <div className="absolute right-6 top-6 h-10 w-10 border-r-4 border-t-4 border-gray-400/60 rounded-tr-xl" />
                {/* Bottom Left */}
                <div className="absolute left-6 bottom-6 h-10 w-10 border-l-4 border-b-4 border-gray-400/60 rounded-bl-xl" />
                {/* Bottom Right */}
                <div className="absolute right-6 bottom-6 h-10 w-10 border-r-4 border-b-4 border-gray-400/60 rounded-br-xl" />
              </div>

              {/* Scanning Animation */}
              {isScannerRunning && (
                <div className="absolute inset-x-6 z-20 h-0.5 bg-gradient-to-r from-transparent via-[#6366f1] to-transparent shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-scan-line" />
              )}

              {/* Status Overlays */}
              {status === "success" && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-emerald-500/10 backdrop-blur-[2px]">
                  <div className="rounded-full bg-emerald-500 p-3 text-white shadow-lg">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-rose-500/10 backdrop-blur-[2px]">
                  <div className="rounded-full bg-rose-500 p-3 text-white shadow-lg">
                    <AlertCircle className="h-10 w-10" />
                  </div>
                </div>
              )}

              {/* Actual Scanner Element */}
              <div 
                id={scannerElementId} 
                className={`h-full w-full transition-opacity duration-500 ${isScannerRunning ? "opacity-100" : "opacity-30"}`}
                onClick={() => !isScannerRunning && handleStartScan()}
              />

              {!isScannerRunning && status === "idle" && (
                <button
                  onClick={handleStartScan}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-white transition-all hover:scale-105"
                >
                  <div className="rounded-full bg-white/10 p-4 backdrop-blur-md">
                    <Camera className="h-8 w-8" />
                  </div>
                  <span className="text-sm font-bold tracking-wide">Tap to open camera</span>
                </button>
              )}
            </div>

            <div className="mt-8 text-center">
              <p className="px-6 text-sm font-medium leading-relaxed text-gray-500 dark:text-gray-400">
                {status === "success" 
                  ? "Attendance recorded successfully!" 
                  : status === "error"
                  ? statusMessage
                  : "Point your camera at a QR code from your lecture hall screen."}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-10 w-full space-y-3">
              <button
                type="button"
                onClick={() => simulateScan()}
                className="w-full rounded-2xl bg-gradient-to-br from-[#a855f7] to-[#6366f1] py-4 text-base font-bold text-white shadow-[0_8px_25px_rgba(99,102,241,0.35)] transition-all active:scale-[0.98] hover:shadow-[0_12px_30px_rgba(99,102,241,0.45)]"
              >
                Simulate Scan
              </button>
              
              {isScannerRunning && (
                <button
                  type="button"
                  onClick={handleStopScan}
                  className="w-full rounded-2xl border border-gray-200 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  Stop Camera
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-10">
             <div className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-800/50 w-full">
                <p className="text-sm font-bold text-gray-500 mb-2">Lecture Key</p>
                <input 
                  type="text" 
                  placeholder="Enter code manually..." 
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold transition-all focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
             </div>
             <button
                type="button"
                className="mt-10 w-full rounded-2xl bg-gray-900 py-4 text-base font-bold text-white shadow-xl transition-all active:scale-[0.98] dark:bg-blue-600"
              >
                Submit Key
              </button>
          </div>
        )}
      </div>

      <div className="px-8 pb-8 text-center">
         <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600">
            Powered by TertiaryFree
         </p>
      </div>
    </section>
  );
}
