import { NextResponse } from "next/server"
import { db } from "../../../../configs/db"
import { users, nomineeDetails, userDocuments } from "../../../../configs/schema"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Get the token (user ID) from cookies
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Fetch user details from DB
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(token)))

    if (existingUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = existingUser[0]

    // Fetch nominee details
    const nomineeData = await db
      .select()
      .from(nomineeDetails)
      .where(eq(nomineeDetails.userId, Number(token)))
    const nominee = nomineeData.length > 0 ? nomineeData[0] : null

    // Fetch user documents
    const documents = await db
      .select()
      .from(userDocuments)
      .where(eq(userDocuments.userId, Number(token)))

    // Format documents by type for easier frontend consumption
    const formattedDocuments = documents.reduce((acc: Record<"profile_photo" | "aadhaar_front" | "aadhaar_back" | "pan_card" | "bank_passbook" | "cancelled_cheque", string>, doc) => {
      acc[doc.documentType] = doc.documentUrl
      return acc
    }, {} as Record<"profile_photo" | "aadhaar_front" | "aadhaar_back" | "pan_card" | "bank_passbook" | "cancelled_cheque", string>)

    // Return user profile data
    return NextResponse.json(
      {
        user: {
          id: user.id,
          referenceId: user.referenceId,
          name: `${user.firstName} ${user.surname}`,
          firstName: user.firstName,
          surname: user.surname,
          email: user.email,
          mobile: user.mobile,
        //   fatherName: user.fatherName || "",
        //   dob: user.dob || "",
          addressLine1: user.addressLine1 || "",
          addressLine2: user.addressLine2 || "",
          city: user.city || "",
          state: user.state || "",
          pincode: user.pincode || "",
        //   landmark: user.landmark || "",
        //   sponsorId: user.sponsorId || "",
        //   sponsorName: user.sponsorName || "",
          createdAt: user.createdAt,
        },
        nominee: nominee
          ? {
              name: nominee.name,
              relation: nominee.relation,
              dob: nominee.dob,
              mobile: nominee.mobile,
              address: nominee.address,
            }
          : null,
        documents: formattedDocuments,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

