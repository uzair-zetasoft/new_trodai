import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/constants";

// PATCH - Update user role
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const userId = params.id;
  
  try {
    // Parse request body
    const body = await req.json();
    
    // Validate role
    const { role } = body;
    
    if (!role || !Object.values(Role).includes(role as Role)) {
      return new NextResponse(JSON.stringify({ error: "Invalid role" }), {
        status: 400,
      });
    }
    
    // Update user in database
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
} 