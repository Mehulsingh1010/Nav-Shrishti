"use client"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface InvoiceButtonProps {
  orderId: number
  totalAmount: number
  items: Array<{
    id: number
    quantity: number
    pricePerUnit: number
    product?: {
      name: string
    }
  }>
  createdAt: Date
  customerName: string
  customerEmail: string
  customerAddress?: string
  gstin?: string
}

export function InvoiceButton({
  orderId,
  totalAmount,
  items,
  createdAt,
  customerName,
  customerEmail,
  customerAddress,
  gstin,
}: InvoiceButtonProps) {
  const generateInvoice = async () => {
    // Create the invoice content
    const invoiceData = {
      invoiceNumber: `INV-${orderId}-${new Date().getFullYear()}`,
      date: new Date(createdAt).toLocaleDateString("hi-IN"),
      customerDetails: {
        name: customerName,
        email: customerEmail,
        address: customerAddress || "Address not provided",
      },
      items: items.map((item) => ({
        name: item.product?.name || "Product",
        quantity: item.quantity,
        unitPrice: item.pricePerUnit / 100,
        total: (item.quantity * item.pricePerUnit) / 100,
      })),
      subtotal: totalAmount / 100,
      tax: (totalAmount * 0.18) / 100, // 18% GST
      total: (totalAmount + totalAmount * 0.18) / 100,
      gstin: gstin || "GSTIN not provided",
    }

    // Create a temporary div to render the invoice HTML
    const tempDiv = document.createElement("div")
    tempDiv.style.position = "absolute"
    tempDiv.style.left = "-9999px"
    tempDiv.style.top = "-9999px"
    document.body.appendChild(tempDiv)

    // Create the HTML content for the invoice
    tempDiv.innerHTML = `
      <div id="invoice-content" style="width: 210mm; padding: 20px; font-family: Arial, sans-serif; color: #333;">
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
          <h1 style="color: #f97316; margin: 0;">चालान / INVOICE</h1>
          <p>चालान संख्या / Invoice Number: ${invoiceData.invoiceNumber}</p>
          <p>दिनांक / Date: ${invoiceData.date}</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div style="flex: 1;">
            <h3 style="color: #f97316; margin-bottom: 5px;">विक्रेता / Seller:</h3>
            <p>आपकी कंपनी का नाम / Your Company Name</p>
            <p>आपका पता / Your Address</p>
            <p>GSTIN: ${invoiceData.gstin}</p>
          </div>
          <div style="flex: 1;">
            <h3 style="color: #f97316; margin-bottom: 5px;">ग्राहक / Customer:</h3>
            <p>${invoiceData.customerDetails.name}</p>
            <p>${invoiceData.customerDetails.email}</p>
            <p>${invoiceData.customerDetails.address}</p>
          </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr>
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd; background-color: #fff8f0; color: #f97316;">विवरण / Description</th>
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd; background-color: #fff8f0; color: #f97316;">मात्रा / Quantity</th>
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd; background-color: #fff8f0; color: #f97316;">मूल्य / Unit Price</th>
              <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd; background-color: #fff8f0; color: #f97316;">राशि / Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.items
              .map(
                (item) => `
              <tr>
                <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">₹${item.unitPrice.toFixed(2)}</td>
                <td style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">₹${item.total.toFixed(2)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div style="float: right; width: 300px;">
          <table style="width: 100%;">
            <tr>
              <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">उप योग / Subtotal:</th>
              <td style="text-align: right; padding: 10px; border-bottom: 1px solid #ddd;">₹${invoiceData.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">GST (18%):</th>
              <td style="text-align: right; padding: 10px; border-bottom: 1px solid #ddd;">₹${invoiceData.tax.toFixed(2)}</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">कुल राशि / Total:</th>
              <td style="text-align: right; padding: 10px; border-bottom: 1px solid #ddd;"><strong>₹${invoiceData.total.toFixed(2)}</strong></td>
            </tr>
          </table>
        </div>
        
        <div style="margin-top: 150px; text-align: center; color: #888; font-size: 12px;">
          <p>धन्यवाद आपके व्यापार के लिए / Thank you for your business</p>
          <p>यह एक कंप्यूटर जनित चालान है और इसके लिए हस्ताक्षर की आवश्यकता नहीं है / This is a computer-generated invoice and does not require a signature</p>
        </div>
      </div>
    `

    try {
      // Wait for the content to render
      const invoiceElement = tempDiv.querySelector("#invoice-content")
      if (!invoiceElement) throw new Error("Invoice element not found")

      // Convert the HTML element to canvas
      const canvas = await html2canvas(invoiceElement as HTMLElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
      })

      // Create PDF from canvas
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Add the canvas as an image to the PDF
      const imgData = canvas.toDataURL("image/png")
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio)

      // Save the PDF
      pdf.save(`Invoice-${orderId}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      // Clean up
      document.body.removeChild(tempDiv)
    }
  }

  return (
    <Button
      onClick={generateInvoice}
      variant="outline"
      className="border-orange-200 text-orange-700 hover:bg-orange-50"
    >
      <FileText className="mr-2 h-4 w-4" /> चालान डाउनलोड करें (PDF)
    </Button>
  )
}

