import {
  getStudyDaysForMode,
  isKnownStudyMode,
  normalizeCustomStudyDays,
  type StudyModeValue,
  type WeekDayValue,
} from "@/lib/study-schedule";

export type UserRole = "student" | "lecturer";
export type UserGender = "male" | "female" | "other";

export interface RegisteredUser {
  id: string;
  role: UserRole;
  name: string;
  gender?: UserGender;
  email: string;
  password: string;
  school: string;
  department: string;
  indexNumber?: string;
  programme?: string;
  level?: string;
  studyMode?: StudyModeValue;
  customStudyDays?: WeekDayValue[];
  title?: string;
  courseLectured?: string;
  createdAt: string;
}

export interface ActiveUserProfile {
  id: string;
  role: UserRole;
  name: string;
  gender?: UserGender;
  email: string;
  school: string;
  department: string;
  indexNumber?: string;
  programme?: string;
  level?: string;
  studyMode: StudyModeValue;
  customStudyDays?: WeekDayValue[];
  title?: string;
  courseLectured?: string;
}

interface ActiveSession {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
  loggedInAt: string;
}

interface RegisterUserInput {
  role: UserRole;
  name: string;
  gender?: UserGender;
  email: string;
  password: string;
  school: string;
  department: string;
  indexNumber?: string;
  programme?: string;
  level?: string;
  studyMode?: StudyModeValue;
  customStudyDays?: WeekDayValue[];
  title?: string;
  courseLectured?: string;
}

type RegisterUserResult =
  | { success: true; user: RegisteredUser }
  | { success: false; message: string; field?: "email" | "general" };

type AuthenticateUserResult =
  | { success: true; user: RegisteredUser }
  | { success: false; message: string };

const USERS_STORAGE_KEY = "tertiaryfree:registered-users";
const SESSION_STORAGE_KEY = "tertiaryfree:active-session";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const isBrowser = () => typeof window !== "undefined";

const createUserId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const isRegisteredUser = (entry: unknown): entry is RegisteredUser => {
  if (!entry || typeof entry !== "object") {
    return false;
  }

  const candidate = entry as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    (candidate.role === "student" || candidate.role === "lecturer") &&
    typeof candidate.name === "string" &&
    (typeof candidate.gender === "undefined" ||
      candidate.gender === "male" ||
      candidate.gender === "female" ||
      candidate.gender === "other") &&
    typeof candidate.email === "string" &&
    typeof candidate.password === "string" &&
    typeof candidate.school === "string" &&
    typeof candidate.department === "string" &&
    (typeof candidate.indexNumber === "undefined" ||
      typeof candidate.indexNumber === "string") &&
    (typeof candidate.studyMode === "undefined" ||
      isKnownStudyMode(candidate.studyMode)) &&
    (typeof candidate.customStudyDays === "undefined" ||
      (Array.isArray(candidate.customStudyDays) &&
        normalizeCustomStudyDays(candidate.customStudyDays).length ===
          candidate.customStudyDays.length)) &&
    typeof candidate.createdAt === "string"
  );
};

const isActiveSession = (entry: unknown): entry is ActiveSession => {
  if (!entry || typeof entry !== "object") {
    return false;
  }

  const candidate = entry as Record<string, unknown>;

  return (
    typeof candidate.userId === "string" &&
    typeof candidate.email === "string" &&
    (candidate.role === "student" || candidate.role === "lecturer") &&
    typeof candidate.name === "string" &&
    typeof candidate.loggedInAt === "string"
  );
};

const readUsers = (): RegisteredUser[] => {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isRegisteredUser);
  } catch {
    return [];
  }
};

const saveUsers = (users: RegisteredUser[]) => {
  if (!isBrowser()) {
    return false;
  }

  try {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return true;
  } catch {
    return false;
  }
};

const setActiveSession = (user: RegisteredUser) => {
  if (!isBrowser()) {
    return;
  }

  const session: ActiveSession = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    loggedInAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // If storage fails, registration/login still succeeds for this page load.
  }
};

const readActiveSession = (): ActiveSession | null => {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as unknown;

    if (!isActiveSession(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const mapRegisteredUserToProfile = (
  user: RegisteredUser
): ActiveUserProfile => ({
  id: user.id,
  role: user.role,
  name: user.name,
  gender: user.gender,
  email: user.email,
  school: user.school,
  department: user.department,
  indexNumber: user.indexNumber,
  programme: user.programme,
  level: user.level,
  studyMode: user.studyMode || "weekday",
  customStudyDays: getStudyDaysForMode(
    user.studyMode || "weekday",
    normalizeCustomStudyDays(user.customStudyDays),
  ),
  title: user.title,
  courseLectured: user.courseLectured,
});

export const getActiveUserProfile = (): ActiveUserProfile | null => {
  const session = readActiveSession();

  if (!session) {
    return null;
  }

  const users = readUsers();
  const matchedUser = users.find((entry) => entry.id === session.userId);

  if (!matchedUser) {
    return null;
  }

  return mapRegisteredUserToProfile(matchedUser);
};

export const registerUserAccount = (
  input: RegisterUserInput
): RegisterUserResult => {
  if (!isBrowser()) {
    return {
      success: false,
      message: "Registration is only available in the browser.",
      field: "general",
    };
  }

  const email = normalizeEmail(input.email);
  if (!email) {
    return {
      success: false,
      message: "Email is required.",
      field: "email",
    };
  }

  const users = readUsers();
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return {
      success: false,
      message: "An account with this email already exists.",
      field: "email",
    };
  }

  const user: RegisteredUser = {
    id: createUserId(),
    role: input.role,
    name: input.name.trim(),
    gender: input.gender,
    email,
    password: input.password,
    school: input.school.trim(),
    department: input.department.trim(),
    indexNumber: input.indexNumber?.trim() || undefined,
    programme: input.programme?.trim() || undefined,
    level: input.level?.trim() || undefined,
    studyMode: input.studyMode || "weekday",
    customStudyDays: getStudyDaysForMode(
      input.studyMode || "weekday",
      normalizeCustomStudyDays(input.customStudyDays),
    ),
    title: input.title?.trim() || undefined,
    courseLectured: input.courseLectured?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  const persisted = saveUsers([...users, user]);

  if (!persisted) {
    return {
      success: false,
      message: "Could not save account. Please try again.",
      field: "general",
    };
  }

  setActiveSession(user);

  return {
    success: true,
    user,
  };
};

export const authenticateUser = (
  emailInput: string,
  password: string
): AuthenticateUserResult => {
  if (!isBrowser()) {
    return {
      success: false,
      message: "Login is only available in the browser.",
    };
  }

  const email = normalizeEmail(emailInput);
  const users = readUsers();
  const user = users.find((entry) => entry.email === email);

  if (!user || user.password !== password) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  setActiveSession(user);

  return {
    success: true,
    user,
  };
};

export const logoutActiveSession = () => {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Ignore cleanup failures.
  }
};
