/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface EarningsSummary {
  degree: number
  earnings: number
  percentage: number
}

interface ReferralData {
  totalEarnings: number
  earningsSummary: EarningsSummary[]
  referrals: {
    id: number
    name: string
    date: string
    status: string
    earnings: number
    degree: number
  }[]
}

export default function EarningsPage() {
  const { toast } = useToast()
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch referral data
    const fetchReferralData = async () => {
      try {
        const response = await fetch("/api/referrals")
        if (!response.ok) {
          throw new Error("Failed to fetch referral data")
        }
        const data = await response.json()
        setReferralData(data)
      } catch (error) {
        console.error("Error fetching referral data:", error)
        toast({
          title: "Error",
          description: "Failed to load referral data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReferralData()
  }, [toast])

  if (isLoading) {
    return (
      <div className="flex items-center animate-spin-slow justify-center min-h-screen bg-orange-50 relative">
        <svg viewBox="0 0 200 200" className="absolute w-48 h-48 ">
          <path id="circlePath" fill="transparent" d="M 100, 100 m -90, 0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0" />
          <text fill="#b45309" fontSize="14" fontWeight="bold">
            <textPath xlinkHref="#circlePath" startOffset="50%">
              ॐ नमः शिवाय • हरे कृष्ण हरे राम • श्री राम जय राम जय जय राम • ॐ गं गणपतये नमः • ॐ ह्रीं क्लीं महालक्ष्म्यै नमः •
            </textPath>
          </text>
        </svg>
      </div>
    )
  }

  if (!referralData) {
    return null
  }

  // Format data for the chart
  const chartData =
    referralData.earningsSummary?.map((level) => ({
      name:
        level.degree === 1
          ? "1st Degree"
          : level.degree === 2
            ? "2nd Degree"
            : level.degree === 3
              ? "3rd Degree"
              : `${level.degree}th Degree`,
      earnings: level.earnings / 100, // Convert to rupees
      percentage: level.percentage,
    })) || []

  // Get top earners
  const topEarners = [...(referralData.referrals || [])].sort((a, b) => b.earnings - a.earnings).slice(0, 5)

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#8B4513]">Referral Earnings</h1>
          <p className="text-muted-foreground">Track your commission earnings from all referral levels</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-3 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
            <CardDescription>Your total earnings from all referral levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <span className="text-5xl font-bold text-orange-800">
                ₹{(referralData.totalEarnings / 100).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Earnings by Level</CardTitle>
            <CardDescription>Breakdown of your earnings from each referral level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Level</TableHead>
                    <TableHead>Commission Rate</TableHead>
                    <TableHead className="text-right">Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referralData.earningsSummary && referralData.earningsSummary.length > 0 ? (
                    referralData.earningsSummary.map((level) => (
                      <TableRow key={level.degree}>
                        <TableCell>
                          {level.degree === 1
                            ? "1st Degree (Direct)"
                            : level.degree === 2
                              ? "2nd Degree"
                              : level.degree === 3
                                ? "3rd Degree"
                                : `${level.degree}th Degree`}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                            {level.percentage}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">₹{(level.earnings / 100).toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                        No earnings yet
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow className="bg-orange-50">
                    <TableCell className="font-bold">Total</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right font-bold">
                      ₹{(referralData.totalEarnings / 100).toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Earnings Visualization</CardTitle>
            <CardDescription>Visual breakdown of your earnings by referral level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`₹${value}`, "Earnings"]}
                      labelFormatter={(value) =>
                        `${value} (${chartData.find((item) => item.name === value)?.percentage}%)`
                      }
                    />
                    <Bar dataKey="earnings" fill="#c2410c" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No earnings data to display
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Earning Referrals</CardTitle>
          <CardDescription>Your referrals that have generated the most earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Earnings Generated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topEarners.length > 0 ? (
                  topEarners.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell className="font-medium">{referral.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-orange-50">
                          {referral.degree === 1
                            ? "1st Degree"
                            : referral.degree === 2
                              ? "2nd Degree"
                              : referral.degree === 3
                                ? "3rd Degree"
                                : `${referral.degree}th Degree`}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            referral.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {referral.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">₹{(referral.earnings / 100).toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No earnings data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Commission Structure</CardTitle>
            <CardDescription>How your multi-level referral commissions work</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-semibold mb-4 text-orange-800">Multi-Level Commission Rates</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-orange-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">1st Degree</h4>
                    <Badge className="bg-orange-200 text-orange-800">7%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Your direct referrals</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-orange-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">2nd Degree</h4>
                    <Badge className="bg-orange-200 text-orange-800">5%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Your referrals' referrals</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-orange-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">3rd Degree</h4>
                    <Badge className="bg-orange-200 text-orange-800">3%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Three levels deep</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-orange-200">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">4th+ Degree</h4>
                    <Badge className="bg-orange-200 text-orange-800">1%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Four or more levels deep</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-2 text-orange-800">How It Works</h4>
                <p className="text-sm mb-3">
                  When someone in your referral network makes a purchase and their order is completed:
                </p>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  <li>You earn a percentage of the purchase amount based on your relationship to them</li>
                  <li>The closer they are to you in the referral chain, the higher your commission percentage</li>
                  <li>Commissions are automatically calculated and added to your earnings</li>
                  <li>You can track all your earnings on this dashboard</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

