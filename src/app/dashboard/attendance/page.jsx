"use client";

import { useState, useEffect } from "react";
import { MoreVertical, Calendar, Clock, MapPin, CheckCircle2, ChevronRight, History, Trash2, Eye, X } from "lucide-react";
import { Menu } from "@mantine/core";
import { QRScanner } from "@/components/student-dashboard/QRScanner";
import { AttendanceStats } from "@/components/student-dashboard/AttendanceStats";

const ATTENDANCE_STORAGE_KEY = "tertiaryfree:attendance-history";

const MOCK_STATS = [
  { id: "1", course: "MTH 101: Engineering Mathematics I", percentage: 85, barWidthClass: "w-[85%]" },
  { id: "2", course: "CSC 101: Introduction to Computing", percentage: 45, barWidthClass: "w-[45%]" },
  { id: "3", course: "PHY 101: General Physics I", percentage: 92, barWidthClass: "w-[92%]" },
];

export default function AttendancePage() {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse attendance history", e);
      }
    }
  }, []);

  const handleCheckIn = (newRecord) => {
    const updated = [newRecord, ...records];
    setRecords(updated);
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleDelete = (indexToDelete) => {
    const updated = records.filter((_, index) => index !== indexToDelete);
    setRecords(updated);
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div className="flex flex-col gap-8 py-4 lg:flex-row lg:items-start">
      {/* Scanner Section - 60% on desktop */}
      <div className="flex flex-col gap-6 lg:w-[60%] lg:sticky lg:top-24">
        <div className="flex justify-center">
          <QRScanner onCheckIn={handleCheckIn} />
        </div>
      </div>

      {/* History Section - 40% on desktop */}
      <div className="flex flex-col gap-6 lg:w-[40%]">
        <section className="rounded-[2rem] bg-white p-6 shadow-sm transition-colors duration-300 dark:bg-gray-800 lg:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-2 dark:bg-blue-900/30">
                <History className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                Attendance History
              </h2>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold text-gray-500 dark:bg-gray-700 dark:text-gray-400">
              {records.length} {records.length === 1 ? 'Record' : 'Records'}
            </span>
          </div>

          {records.length > 0 ? (
            <div className="grid gap-3">
              {records.map((record, index) => (
                <div 
                  key={`${record.course}-${index}`}
                  className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-4 transition-all hover:bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-900"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <h3 className="truncate font-bold text-gray-900 transition-colors duration-300 dark:text-gray-100">
                      {record.course}
                    </h3>
                  </div>
                  
                  <Menu position="bottom-end" offset={5} withinPortal shadow="md">
                    <Menu.Target>
                      <button 
                        className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-200 dark:hover:bg-gray-800"
                        aria-label="Open options menu"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </Menu.Target>

                    <Menu.Dropdown className="rounded-xl border border-gray-100 bg-white p-1.5 dark:border-gray-800 dark:bg-[#1A1A1A]">
                      <Menu.Item 
                        onClick={() => setSelectedRecord(record)}
                        leftSection={<Eye className="h-4 w-4" />}
                        className="text-sm font-semibold text-gray-700 dark:text-gray-200"
                      >
                        View Details
                      </Menu.Item>
                      <Menu.Divider className="border-gray-50 dark:border-gray-800" />
                      <Menu.Item 
                        onClick={() => handleDelete(index)}
                        leftSection={<Trash2 className="h-4 w-4" />}
                        className="text-sm font-semibold text-red-600 dark:text-red-400"
                      >
                        Delete Record
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-700">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <p className="max-w-xs text-sm font-medium text-gray-500 dark:text-gray-400">
                Your history is empty. Scan a code to see records here.
              </p>
            </div>
          )}
        </section>

        <AttendanceStats courses={MOCK_STATS} />
      </div>

      {/* Details Modal/Panel */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4">
          <div 
            className="absolute inset-0" 
            onClick={() => setSelectedRecord(null)} 
          />
          <div className="relative w-full max-w-md animate-slide-up rounded-t-[2.5rem] bg-white p-8 shadow-2xl transition-colors duration-300 dark:bg-gray-900 sm:rounded-[2.5rem]">
            <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-gray-200 dark:bg-gray-700 sm:hidden" />
            
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Attendance Detail</h3>
                <h2 className="mt-2 text-2xl font-black text-gray-900 dark:text-white leading-tight">
                  {selectedRecord.course}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedRecord(null)}
                className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-gray-800">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Date</p>
                  <p className="font-bold text-gray-900 dark:text-gray-100">{selectedRecord.checkInDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-gray-800">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Check-in Time</p>
                  <p className="font-bold text-gray-900 dark:text-gray-100">{selectedRecord.checkInTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-gray-800">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Status</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{selectedRecord.status}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedRecord(null)}
              className="mt-8 w-full rounded-2xl bg-gray-900 py-4 text-base font-bold text-white transition-all active:scale-[0.98] dark:bg-blue-600"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
