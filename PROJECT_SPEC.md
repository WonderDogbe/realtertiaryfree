# TertiaryFree - Project Specification

## 1. Overview
**TertiaryFree** is a modern educational web application built to streamline and empower the academic journey for both students and lecturers. It acts as a centralized workspace handling attendance tracking, timetable coordination, coursework management, and real-time class communications.

## 2. Technology Stack
- **Framework**: Next.js 16.2.1 (App Router)
- **Frontend Library**: React 19.2.4
- **Styling**: Tailwind CSS v4, Mantine Core/Hooks v9, PostCSS
- **Icons**: Lucide React
- **Utilities**: 
  - `html5-qrcode` (For QR-based attendance tracking)
  - `next-themes` (For light/dark mode toggling)
- **Language**: TypeScript

## 3. Core Features
1. **QR Attendance Check-In**: Students can scan session codes for fraud-resistant, one-tap class check-ins.
2. **Mobile Lecturer Attendance**: Lecturers have mobile-friendly tools to generate QR codes, capture offline attendance, and perform bulk confirmations.
3. **Personalized Timetables**: Auto-synchronized weekly schedules filtered by a student's or lecturer's specific courses and study modes (e.g., Weekday, Weekend, Custom).
4. **Student & Lecturer Workspace (Dashboard)**: Role-based views providing insights, assignment deadlines, and class visibility.
5. **Real-Time Class Notifications**: Instant alerts for timetable changes, room swaps, and upcoming lectures.

## 4. Application Architecture & Routing
The application tightly follows the Next.js App Router conventions (`src/app`):

### Public Routes
- `/`: The Landing Page detailing features, hero highlights, and onboarding CTAs.
- `/login`: Standard user authentication.
- `/register`: Initial registration wrapper.
- `/signup/*`: A comprehensive, multi-step onboarding wizard gathering detailed academic context. Subflows include `institution`, `details`, `student/department`, `student/level`, `student/programme`, `student/study-mode`, and `student/password`.

### Protected Routes (Dashboard)
- `/dashboard`: Main wrapper (`layout.tsx`) containing the sidebar, top navigation, and common shells.
  - Sub-modules: `/attendance`, `/chat`, `/courses`, `/exam-timetable`, `/midsem`, `/my-courses`, `/notifications`, `/profile`, `/quiz-midsem`, `/quizzes`, `/settings`, `/timetable`.

## 5. Data & State Management
Currently, the application operates primarily on client-side mock databases and browser storage, signaling a frontend-first development approach.

### Authentication & Sessions (`src/lib/auth-storage.ts`)
- **Storage Strategy**: Uses browser `localStorage`.
- **Keys**: 
  - `tertiaryfree:registered-users` (Array of all signed-up users)
  - `tertiaryfree:active-session` (Currently logged-in user)
- **Data Models**: Defines types for `RegisteredUser`, `ActiveUserProfile`, and `ActiveSession`.

### Local Database (`src/lib/local-db.ts` & `src/db/`)
Populates the application's select dropdowns and dashboard data utilizing static JSON maps:
- `academic-options.json`: Semesters, levels, and signup roles.
- `course-catalog.json`: Course IDs, codes, and titles.
- `faculty.json` / `programmes.json`: Structural hierarchy for schools.
- `institutions.json`: Supported schools/universities.
- `weekly-lectures.json`: Time, day, and venue mappings for the timetable feature.

## 6. Component Structure
Located in `src/components`, the application uses modular UI elements separated by context:
- **Global**: `Footer`, `LandingHeader`, `Logo`, `FeatureCard`, `AuthLayout`.
- **Dashboard (`student-dashboard/`)**: `Sidebar`, `TopNavbar`, `BottomNav`, `DashboardShell`, `LiveCountdown`, `QRScanner` (using a custom `useQrScanner` hook), `TimetableGrid`, etc.
- **Onboarding (`signup/`)**: Nested UI elements for the multi-step form.

## 7. Future Backend Integration Requirements
As the project evolves from a frontend-mock to a fullstack application, the following backend transitions will be necessary:
- **Authentication Strategy**: Replace `localStorage` with a robust JWT/Session mechanism (e.g., NextAuth.js or Supabase Auth).
- **Database Architecture**: Migrate JSON catalogs to a relational database (e.g., PostgreSQL via Prisma or Drizzle ORM).
- **Real-Time capabilities**: Implement WebSockets or Server-Sent Events (SSE) for the Chat and Notification features.
