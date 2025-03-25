import { NextResponse } from "next/server"
import { Resend } from "resend"

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { formType, name, email, phone, message, organization, business, area, product, partnerType } = data

    // Construct email subject based on form type
    const formTypeMap: Record<string, string> = {
      member: "सदस्य फॉर्म",
      promoter: "प्रमोटर फॉर्म",
      distributor: "वितरक फॉर्म",
      udyami: "उद्यमी फॉर्म",
      partner: "पार्टनर फॉर्म",
    }

    const subject = `नव सृष्टि सृजन - नया ${formTypeMap[formType] || "संपर्क"} प्राप्त हुआ`

    // Construct email body with all relevant fields
    let emailBody = `
      <h2>नव सृष्टि सृजन - ${formTypeMap[formType] || "संपर्क फॉर्म"}</h2>
      <p><strong>नाम:</strong> ${name}</p>
      <p><strong>ईमेल:</strong> ${email}</p>
      <p><strong>फोन:</strong> ${phone}</p>
    `

    // Add conditional fields based on form type
    if (organization) {
      emailBody += `<p><strong>संगठन:</strong> ${organization}</p>`
    }

    if (business) {
      emailBody += `<p><strong>व्यवसाय:</strong> ${business}</p>`
    }

    if (area) {
      emailBody += `<p><strong>वितरण क्षेत्र:</strong> ${area}</p>`
    }

    if (product) {
      emailBody += `<p><strong>उत्पाद श्रेणी:</strong> ${product}</p>`
    }

    if (partnerType) {
      emailBody += `<p><strong>साझेदारी का प्रकार:</strong> ${partnerType}</p>`
    }

    emailBody += `
      <p><strong>संदेश:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `

    // Send email using Resend
    const { data: emailData, error } = await resend.emails.send({
      from: "Nav Srishti Srijan <noreply@prefercoding.com>", // Replace with your domain
      to: ["mehulsingh076@gmail.com"], // Replace with your email
      subject: subject,
      html: emailBody,
      replyTo: email,
    })
    

    if (error) {
      console.error("Error sending email:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    // Log success and return response
    console.log("Email sent successfully:", emailData)
    return NextResponse.json({
      success: true,
      message: "फॉर्म सफलतापूर्वक जमा किया गया",
    })
  } catch (error) {
    console.error("Error processing form submission:", error)
    return NextResponse.json({ error: "Failed to process form submission" }, { status: 500 })
  }
}

