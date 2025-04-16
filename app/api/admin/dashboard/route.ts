import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/constants";

export async function GET() {
  const session = await auth();
  
  // Check if user is authenticated
  if (!session?.user) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  
  // Check if user is an admin
  if (session.user.role !== Role.ADMIN) {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }
  
  try {
    // Count total users
    const totalUsers = await prisma.user.count();
    
    // Count total videos - placeholder, replace with actual model
    const totalVideos = await prisma.video.count().catch(() => 0);
    
    // Count active subscriptions - placeholder, replace with actual model
    const activeSubscriptions = await prisma.subscription
      .count({
        where: {
          status: "active"
        }
      })
      .catch(() => 0);
    
    return NextResponse.json({
      totalUsers,
      totalVideos,
      activeSubscriptions
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
} 