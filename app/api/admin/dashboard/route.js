import { NextResponse } from "next/server";
import User from "@/models/User";
import connectMongo from "@/libs/mongoose";

// Force dynamic to avoid caching
export const dynamic = "force-dynamic";

// This route is used to get data for the admin dashboard
export async function GET() {
  try {
    // The session check and authOptions import have been removed as per the edit hint.
    // The original code had `import { getServerSession } from "next-auth/next";` and `import { authOptions } from "@/libs/next-auth";`
    // which are no longer needed.

    // The original code had `const session = await getServerSession(authOptions);`
    // and `if (!session) { ... }` and `if (session.user.role !== "admin") { ... }`
    // which are no longer needed.

    await connectMongo();

    // Get all users count
    const usersCount = await User.countDocuments();
    const stats = {
      usersCount,
    };

    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Error fetching dashboard data" },
      { status: 500 }
    );
  }
}
