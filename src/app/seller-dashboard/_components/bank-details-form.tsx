"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form"
import { toast } from "@/hooks/use-toast"

const bankDetailsSchema = z.object({
  bankName: z.string().min(2, { message: "Bank name is required" }),
  accountNumber: z.string().min(8, { message: "Valid account number is required" }),
  ifscCode: z.string().min(11, { message: "Valid IFSC code is required" }).max(11),
  branchName: z.string().min(2, { message: "Branch name is required" }),
  accountHolderName: z.string().min(2, { message: "Account holder name is required" }),
  mobileNumber: z.string().min(10, { message: "Valid mobile number is required" }).max(15),
})

type BankDetailsFormValues = z.infer<typeof bankDetailsSchema>

export function BankDetailsForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<BankDetailsFormValues>({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      branchName: "",
      accountHolderName: "",
      mobileNumber: "",
    },
  })

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const response = await fetch("/api/seller-dash/bank")
        if (response.ok) {
          const data = await response.json()
          if (data && Object.keys(data).length > 0) {
            form.reset({
              bankName: data.bankName || "",
              accountNumber: data.accountNumber || "",
              ifscCode: data.ifscCode || "",
              branchName: data.branchName || "",
              accountHolderName: data.accountHolderName || "",
              mobileNumber: data.mobileNumber || "",
            })
          }
        }
      } catch (error) {
        console.error("Error fetching bank details:", error)
      }
    }

    fetchBankDetails()
  }, [form])

  async function onSubmit(data: BankDetailsFormValues) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/seller-dash/bank", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Bank details saved successfully",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to save bank details")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save bank details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border border-[#f0e6dd] bg-[#fffbf7]">
      <CardHeader className="bg-[#fff8f2] border-b border-[#f0e6dd]">
        <CardTitle className="text-[#B34700]">Bank Account Information</CardTitle>
        <CardDescription>Please provide your bank account details for receiving payments</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter bank name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="branchName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter branch name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter account number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ifscCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IFSC Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter IFSC code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountHolderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Holder Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter account holder name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter mobile number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <CardFooter className="px-0 pt-4">
              <Button type="submit" disabled={isLoading} className="bg-[#E85D04] hover:bg-[#DC4C00] text-white">
                {isLoading ? "Saving..." : "Save Bank Details"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

