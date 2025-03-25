/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { db } from "../../../../../configs/db"
import { userDocuments } from "../../../../../configs/schema"
import { eq, and } from "drizzle-orm"
import { cookies } from "next/headers"
import { put } from "@vercel/blob"

export async function POST(request: Request) {
  try {
    // Get the token (user ID) from cookies
    const token = (await cookies()).get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const documentType = formData.get("documentType") as string

    if (!file || !documentType) {
      return NextResponse.json({ error: "File and document type are required" }, { status: 400 })
    }

    // Upload file to Vercel Blob
    const blob = await put(`user-${token}/${documentType}`, file, {
      access: "public",
    })

    // Check if document already exists
    const existingDoc = await db
      .select()
      .from(userDocuments)
      .where(and(eq(userDocuments.userId, Number(token)), eq(userDocuments.documentType, documentType as any)))

    if (existingDoc.length > 0) {
      // Update existing document
      await db
        .update(userDocuments)
        .set({
          documentUrl: blob.url,
          updatedAt: new Date(),
        })
        .where(and(eq(userDocuments.userId, Number(token)), eq(userDocuments.documentType, documentType as any)))
    } else {
      // Insert new document
      await db.insert(userDocuments).values({
        userId: Number(token),
        documentType: documentType as any,
        documentUrl: blob.url,
      })
    }

    return NextResponse.json(
      {
        success: true,
        url: blob.url,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error uploading document:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

