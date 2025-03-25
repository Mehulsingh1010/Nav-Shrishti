/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../configs/db";
import { bankDetails } from "../../../../../configs/schema";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

// Function to get user ID from token
async function getUserIdFromToken() {
  const cookieStore = cookies();
  const tokenCookie = (await cookieStore).get("token");

  if (!tokenCookie) {
    return null;
  }

  return tokenCookie.value; // Assuming the token contains the user ID
}

// GET handler to fetch bank details for the current user
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userBankDetails = await db.query.bankDetails.findFirst({
      where: eq(bankDetails.userId, Number(userId)),
    });

    return NextResponse.json(userBankDetails || {});
  } catch (error) {
    console.error("Error fetching bank details:", error);
    return NextResponse.json({ error: "Failed to fetch bank details" }, { status: 500 });
  }
}

// POST handler to create or update bank details
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // Validate required fields
    const requiredFields = [
      "bankName", "accountNumber", "ifscCode", "branchName", "accountHolderName", "mobileNumber"
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Check if bank details already exist for this user
    const existingDetails = await db.query.bankDetails.findFirst({
      where: eq(bankDetails.userId, Number(userId)),
    });

    let result;

    if (existingDetails) {
      // Update existing record
      result = await db
        .update(bankDetails)
        .set({
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          ifscCode: data.ifscCode,
          branchName: data.branchName,
          accountHolderName: data.accountHolderName,
          mobileNumber: data.mobileNumber,
          updatedAt: new Date(),
        })
        .where(eq(bankDetails.userId, Number(userId)))
        .returning();
    } else {
      // Create new record
      result = await db
        .insert(bankDetails)
        .values({
          userId: Number(userId),
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          ifscCode: data.ifscCode,
          branchName: data.branchName,
          accountHolderName: data.accountHolderName,
          mobileNumber: data.mobileNumber,
        })
        .returning();
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error saving bank details:", error);
    return NextResponse.json({ error: "Failed to save bank details" }, { status: 500 });
  }
}