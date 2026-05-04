import type { WeekDayValue } from "@/lib/study-schedule";

export interface LectureCommunicationItem {
  id: string;
  day: WeekDayValue;
  title: string;
  detail: string;
  time: string;
}

export interface OutstandingNotificationItem {
  id: string;
  day: WeekDayValue;
  category: "Assignment" | "Attendance" | "Timetable" | "Announcement";
  message: string;
  source: string;
  priority: "Outstanding" | "Pending" | "Urgent";
  updatedAt: string;
}

export const LECTURE_COMMUNICATIONS: LectureCommunicationItem[] = [
  {
    id: "comm-1",
    day: "Monday",
    title: "CSC 301 - Dr. Mensah",
    detail:
      "Upload your lab report before 6:00 PM today. Late submissions will close automatically.",
    time: "15 mins ago",
  },
  {
    id: "comm-2",
    day: "Tuesday",
    title: "MAT 221 - Prof. Boateng",
    detail:
      "Tomorrow's class starts 30 minutes earlier. Please review tutorial sheet 4 before coming.",
    time: "1 hour ago",
  },
  {
    id: "comm-3",
    day: "Friday",
    title: "PHY 201 - Dr. Owusu",
    detail:
      "Live Q&A opens at 8:00 PM for revision. Bring one question from the previous quiz.",
    time: "Today",
  },
  {
    id: "comm-4",
    day: "Saturday",
    title: "ICT 315 - Weekend Lab",
    detail:
      "Saturday practical starts at 9:00 AM. Please submit your pre-lab notes before class.",
    time: "Weekend",
  },
  {
    id: "comm-5",
    day: "Sunday",
    title: "MTH 101 - Revision Session",
    detail:
      "Sunday revision room changed to Hall C2. Bring your solved worksheet.",
    time: "Weekend",
  },
];

export const OUTSTANDING_NOTIFICATIONS: OutstandingNotificationItem[] = [
  {
    id: "out-1",
    day: "Monday",
    category: "Assignment",
    message: "Submit Operating Systems mini project before 11:59 PM.",
    source: "CSC 301",
    priority: "Urgent",
    updatedAt: "Today",
  },
  {
    id: "out-2",
    day: "Tuesday",
    category: "Attendance",
    message: "Attendance sync pending for MAT 221 morning lecture.",
    source: "MAT 221",
    priority: "Pending",
    updatedAt: "1 hr ago",
  },
  {
    id: "out-3",
    day: "Friday",
    category: "Timetable",
    message: "Venue update: PHY 201 moved from Lab 2 to Hall B1.",
    source: "PHY 201",
    priority: "Outstanding",
    updatedAt: "Today",
  },
  {
    id: "out-4",
    day: "Saturday",
    category: "Announcement",
    message: "Weekend lab pre-notes are required before class check-in.",
    source: "ICT 315",
    priority: "Outstanding",
    updatedAt: "Weekend",
  },
  {
    id: "out-5",
    day: "Sunday",
    category: "Announcement",
    message: "Revision session room changed to Hall C2.",
    source: "MTH 101",
    priority: "Pending",
    updatedAt: "Weekend",
  },
];