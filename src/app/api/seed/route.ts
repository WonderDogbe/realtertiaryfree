import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Import local JSON databases
import institutions from "@/db/institutions.json";
import faculty from "@/db/faculty.json";
import programmes from "@/db/programmes.json";
import courseCatalog from "@/db/course-catalog.json";
import weeklyLectures from "@/db/weekly-lectures.json";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Missing SUPABASE_SERVICE_ROLE_KEY in `.env.local`. Please add it to bypass RLS and insert data." },
      { status: 500 }
    );
  }

  // Create a privileged client using the service_role key to bypass Row Level Security
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // 1. Seed Institutions
    console.log("Seeding institutions...");
    const formattedInstitutions = institutions.map(i => ({
      id: i.id,
      name: i.name,
      abbreviation: i.abbreviation
    }));
    await supabase.from("institutions").upsert(formattedInstitutions);

    // 2. Seed Faculties
    console.log("Seeding faculties...");
    const formattedFaculties = faculty.map(f => ({
      id: f.id,
      name: f.name
    }));
    await supabase.from("faculties").upsert(formattedFaculties);

    // 3. Seed Programmes
    console.log("Seeding programmes...");
    const formattedProgrammes = programmes.map(p => ({
      id: p.id,
      name: p.name,
      faculty_id: p.facultyId,
      programme_type: p.programmeType
    }));
    await supabase.from("programmes").upsert(formattedProgrammes);

    // 4. Seed Course Catalog
    console.log("Seeding courses...");
    const formattedCourses = courseCatalog.map(c => ({
       id: c.id,
       code: c.code,
       title: c.title,
       department: c.department,
       image: c.image
    }));
    await supabase.from("course_catalog").upsert(formattedCourses);

    // 5. Seed Weekly Lectures
    console.log("Seeding weekly lectures...");
    const formattedLectures = weeklyLectures.map(l => ({
      id: l.id,
      day: l.day,
      course_code: l.courseCode,
      lecturer: l.lecturer,
      venue: l.venue,
      start_time: l.startTime,
      end_time: l.endTime
    }));
    await supabase.from("weekly_lectures").upsert(formattedLectures);

    return NextResponse.json({ success: true, message: "Database seeding complete! All mock JSON data has been migrated into Supabase." });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
